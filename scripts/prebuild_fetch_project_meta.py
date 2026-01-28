#!/usr/bin/env python3
"""Fetch OG/Twitter metadata for project URLs and write data/projects_enriched.json.

Reads data/projects.yaml (simple list format) and enriches each project with a
"card" object suitable for a Twitter/X preview.
"""

from __future__ import annotations

import datetime
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional

ROOT = Path(__file__).resolve().parent.parent
PROJECTS_YAML = ROOT / "data" / "projects.yaml"
OUTPUT_JSON = ROOT / "data" / "projects_enriched.json"


class MetaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.meta: Dict[str, str] = {}
        self.title: str = ""
        self._in_title = False

    def handle_starttag(self, tag: str, attrs: List[tuple]) -> None:
        if tag.lower() == "meta":
            attrs_dict = {k.lower(): v for k, v in attrs if k and v}
            key = attrs_dict.get("property") or attrs_dict.get("name")
            content = attrs_dict.get("content")
            if key and content:
                self.meta[key.strip().lower()] = content.strip()
        elif tag.lower() == "title":
            self._in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if value.startswith("\"") and value.endswith("\""):
        return value[1:-1]
    if value.startswith("'") and value.endswith("'"):
        return value[1:-1]
    return value


def parse_projects_yaml(path: Path) -> List[Dict[str, object]]:
    """Parse the simple projects.yaml structure without external deps."""
    items: List[Dict[str, object]] = []
    current: Optional[Dict[str, object]] = None
    in_stack = False

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue

        if line.startswith("- "):
            if current:
                items.append(current)
            current = {}
            in_stack = False
            line = line[2:]
            if ":" in line:
                key, value = line.split(":", 1)
                current[key.strip()] = _strip_quotes(value)
            continue

        if current is None:
            continue

        if line.startswith("  stack:"):
            current["stack"] = []
            in_stack = True
            continue

        if in_stack and line.startswith("    - "):
            stack_item = _strip_quotes(line[6:])
            if stack_item:
                current.setdefault("stack", [])
                current["stack"].append(stack_item)
            continue

        if line.startswith("  ") and ":" in line:
            key, value = line.split(":", 1)
            current[key.strip()] = _strip_quotes(value)
            in_stack = False
            continue

    if current:
        items.append(current)

    return items


def fetch_html(url: str, timeout: int = 15) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; ProjectMetaFetcher/1.0)",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, errors="replace")


def resolve_url(base: str, candidate: str) -> str:
    return urllib.parse.urljoin(base, candidate)


def build_card(url: str, meta: Dict[str, str], title_fallback: str, desc_fallback: str) -> Dict[str, str]:
    og_title = meta.get("og:title")
    tw_title = meta.get("twitter:title")
    og_desc = meta.get("og:description")
    tw_desc = meta.get("twitter:description")
    meta_desc = meta.get("description")
    og_image = meta.get("og:image")
    tw_image = meta.get("twitter:image")
    card_type = meta.get("twitter:card")
    tw_site = meta.get("twitter:site")

    title = tw_title or og_title or title_fallback
    description = tw_desc or og_desc or meta_desc or desc_fallback
    image = tw_image or og_image or ""
    if image:
        image = resolve_url(url, image)

    if not card_type:
        card_type = "summary_large_image" if image else "summary"

    card = {
        "type": card_type,
        "title": title,
        "description": description,
        "image": image,
        "site": tw_site or "",
    }
    return card


def main() -> int:
    if not PROJECTS_YAML.exists():
        print(f"Missing {PROJECTS_YAML}", file=sys.stderr)
        return 1

    projects = parse_projects_yaml(PROJECTS_YAML)
    enriched: List[Dict[str, object]] = []

    for project in projects:
        url = str(project.get("url", "")).strip()
        title_fallback = str(project.get("name", "")).strip()
        desc_fallback = str(project.get("description", "")).strip()

        card: Dict[str, str] = {
            "type": "",
            "title": title_fallback,
            "description": desc_fallback,
            "image": "",
            "site": "",
        }

        if url:
            try:
                html = fetch_html(url)
                parser = MetaParser()
                parser.feed(html)
                meta = parser.meta
                title = parser.title.strip() or title_fallback
                card = build_card(url, meta, title, desc_fallback)
            except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
                card["error"] = f"fetch_failed: {exc}"

        enriched_item = dict(project)
        enriched_item["card"] = card
        enriched.append(enriched_item)

    payload = {
        "generated_at": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        "projects": enriched,
    }

    OUTPUT_JSON.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
