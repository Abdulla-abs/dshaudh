"""One-time documentation migration; preserves all runtime/build paths."""
from pathlib import Path
import os
import re
import json

ROOT = Path(__file__).resolve().parents[1]
mapping = {}
for p in ROOT.glob('*.md'):
    if p.name == 'AGENTS.md':
        dest = ROOT / 'docs/archive/AGENTS-before-organization.md'
    elif p.name == 'README.md':
        dest = ROOT / 'docs/archive/README-before-organization.md'
    elif p.name.startswith('LOCAL-'):
        dest = ROOT / 'docs/operations' / p.name
    elif p.name in ('HANDOFF.md', 'TECHNICAL-NOTES.md'):
        dest = ROOT / 'docs/history' / p.name
    else:
        dest = ROOT / 'docs/native' / p.name
    mapping[p] = dest
for p in ROOT.glob('*BASELINE.json'):
    mapping[p] = ROOT / 'docs/baselines' / p.name
for p in ROOT.glob('*.png'):
    mapping[p] = ROOT / '.local/screenshots/root-legacy' / p.name

def fix_links(text, old, new):
    def replace(m):
        link = m.group(1)
        if ':' in link or link.startswith('#'):
            return m.group(0)
        target, sep, anchor = link.partition('#')
        absolute = (old.parent / target).resolve()
        absolute = mapping.get(absolute, absolute)
        relative = os.path.relpath(absolute, new.parent).replace('\\', '/')
        return '](' + relative + (sep + anchor if sep else '') + ')'
    return re.sub(r'\]\(([^)]+)\)', replace, text)

for old, new in mapping.items():
    new.parent.mkdir(parents=True, exist_ok=True)
    if new.exists():
        raise RuntimeError(f'Destination exists: {new}')
    if old.suffix == '.md':
        new.write_text(fix_links(old.read_text(encoding='utf-8-sig'), old, new), encoding='utf-8')
        old.unlink()
    else:
        old.rename(new)
for p in ROOT.glob('analysis/**/*.md'):
    if any(x in p.parts for x in ('apk', 'jadx', 'decoded')):
        continue
    text = p.read_text(encoding='utf-8-sig')
    updated = fix_links(text, p, p)
    if updated != text:
        p.write_text(updated, encoding='utf-8')
(ROOT / 'docs/moved-files.json').write_text(json.dumps({str(a.relative_to(ROOT)).replace('\\','/'):str(b.relative_to(ROOT)).replace('\\','/') for a,b in mapping.items()},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Moved {len(mapping)} files; runtime paths retained.')
