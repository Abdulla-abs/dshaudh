"""Build lightweight AI indexes; audit staged content before committing."""
from pathlib import Path
import argparse
import subprocess
import os
import re

ROOT = Path(__file__).resolve().parents[1]
LIMIT = 1024 * 1024
INDEX = ROOT / 'docs/ai'
GENERATED = {'docs/ai/files.tsv', 'docs/ai/headings.tsv', 'docs/ai/functions.tsv', 'docs/ai/rpc-locations.tsv'}
FORBIDDEN = {'.apk', '.zip', '.jar', '.so', '.dex', '.sqlite', '.db', '.png', '.jpg', '.jsc', '.jks', '.keystore', '.pem', '.key', '.pyc', '.idsig'}

def git_paths(*args):
    raw = subprocess.check_output(['git', *args, '-z'], cwd=ROOT)
    return [s.decode('utf-8') for s in raw.split(b'\0') if s]

def category(name):
    if name.startswith('analysis/apk/'):
        return 'android-patch'
    if name.startswith('analysis/rpc-contracts/'):
        return 'rpc-contract'
    if name.startswith('analysis/'):
        if Path(name).suffix == '.json':
            return 'evidence-or-data'
        if 'check_' in name or 'validate_' in name:
            return 'verification'
        if 'query_' in name or 'probe' in name or 'fixture' in name:
            return 'probe-fixture'
        if 'build_' in name or 'make_' in name:
            return 'build'
        return 'adapter-source'
    return name.split('/')[0] if '/' in name else 'entry'

def check():
    errors = []
    paths = git_paths('diff', '--cached', '--name-only', '--diff-filter=ACM')
    for name in paths:
        blob = subprocess.check_output(['git', 'show', ':' + name], cwd=ROOT)
        if len(blob) > LIMIT or Path(name).suffix.lower() in FORBIDDEN or b'\0' in blob or '.before-' in name:
            errors.append(name)
    if errors:
        raise SystemExit('Rejected staged files:\n' + '\n'.join(errors))
    print(f'Staged audit passed: {len(paths)} files, max {LIMIT} bytes each.')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--inventory', action='store_true')
    args = parser.parse_args()
    if args.check:
        check()
        return
    if args.inventory:
        rows = ['path\tbytes']
        for base, dirs, names in os.walk(ROOT):
            dirs[:] = [d for d in dirs if d != '.git']
            for name in names:
                p = Path(base) / name
                rows.append(f'{p.relative_to(ROOT).as_posix()}\t{p.stat().st_size}')
        out = ROOT / '.local/index/inventory.tsv'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text('\n'.join(rows) + '\n', encoding='utf-8')
        print(f'Inventory: {len(rows)-1} files -> {out}')
        return
    paths = sorted(git_paths('ls-files'))
    files = ['path\tcategory\tbytes']
    headings = ['path\tline\theading']
    functions = ['path\tline\tfunction\tparameters']
    rpc = ['rpc\tpath\tline\tkind']
    for name in paths:
        p = ROOT / name
        if not p.is_file() or name in GENERATED:
            continue
        files.append(f'{name}\t{category(name)}\t{p.stat().st_size}')
        if p.suffix == '.md':
            for line, text in enumerate(p.read_text(encoding='utf-8-sig').splitlines(), 1):
                if text.startswith('#'):
                    headings.append(f'{name}\t{line}\t{text.replace(chr(9), " ")}')
        if name == 'analysis/native_boot.js':
            for line, text in enumerate(p.read_text(encoding='utf-8-sig').splitlines(), 1):
                match = re.match(r'\s*(?:var\s+)?([\w.$]+)\s*=\s*function\s*\(([^)]*)\)', text)
                if not match:
                    match = re.match(r'\s*function\s+(\w+)\s*\(([^)]*)\)', text)
                if match:
                    functions.append(f'{name}\t{line}\t{match[1]}\t{match[2]}')
                if text.lstrip().startswith('//'):
                    continue
                dispatch = set(re.findall(r"methodName\s*===\s*['\"](rpc_[sc]_\w+)['\"]", text))
                for method in sorted(set(re.findall(r'\brpc_[sc]_\w+\b', text))):
                    kind = 'dispatch-condition' if method in dispatch else 'lexical-reference'
                    rpc.append(f'{method}\t{name}\t{line}\t{kind}')
    INDEX.mkdir(parents=True, exist_ok=True)
    (INDEX / 'files.tsv').write_text('\n'.join(files)+'\n', encoding='utf-8')
    (INDEX / 'headings.tsv').write_text('\n'.join(headings)+'\n', encoding='utf-8')
    (INDEX / 'functions.tsv').write_text('\n'.join(functions)+'\n', encoding='utf-8')
    (INDEX / 'rpc-locations.tsv').write_text('\n'.join(rpc)+'\n', encoding='utf-8')
    print(f'Indexed {len(files)-1} files, {len(headings)-1} headings, {len(functions)-1} function declarations and {len(rpc)-1} RPC locations.')

if __name__ == '__main__':
    main()
