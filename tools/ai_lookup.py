"""Bounded queries over AI indexes and local text files, without whole-tree scans."""
from pathlib import Path
import argparse

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('--find', help='Substring to find in navigation indexes')
group.add_argument('--read', help='Repository-relative text file')
parser.add_argument('--line', type=int, default=1)
parser.add_argument('--count', type=int, default=60)
args = parser.parse_args()
if not 1 <= args.count <= 120 or args.line < 1:
    parser.error('count must be 1..120; line must be positive')
if args.find is not None:
    matches = []
    for name in ('functions.tsv', 'rpc-locations.tsv', 'headings.tsv', 'files.tsv'):
        p = ROOT / 'docs/ai' / name
        if not p.exists():
            continue
        for row in p.read_text(encoding='utf-8').splitlines()[1:]:
            if args.find.casefold() in row.casefold():
                matches.append(f'{name}: {row}')
    print('\n'.join(matches[:args.count]))
    print(f'{len(matches)} matches; displayed {min(args.count,len(matches))}.')
else:
    p = (ROOT / args.read).resolve()
    if not p.is_relative_to(ROOT) or '.git' in p.relative_to(ROOT).parts:
        parser.error('file must be inside workspace and outside .git')
    if not p.is_file() or p.stat().st_size > 1024 * 1024:
        parser.error('file must exist and be at most 1 MiB; filter large logs separately')
    try:
        content = p.read_text(encoding='utf-8-sig')
    except UnicodeError:
        parser.error('file must be UTF-8 text')
    if '\0' in content:
        parser.error('binary file rejected')
    lines = content.splitlines()
    for i in range(args.line-1, min(len(lines), args.line-1+args.count)):
        text = lines[i]
        print(f'{i+1}: {text[:500]}' + (' [line truncated; use JSON field extraction]' if len(text)>500 else ''))
