"""Extract only rune tables and stock equipment functions into local task output."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.local/layout-editor/runes'
CLI = ROOT / 'tools/jsc_decompiler/cli.py'


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for folder, names in [('Data/Common', ['rune_order', 'equipment_attribute', 'exclusive_attribute']),
                          ('Client/Components', ['HeroComponents', 'BattleController'])]:
        for name in names:
            src = ROOT / 'analysis/decoded/script' / folder / (name + '.jsc')
            subprocess.run([sys.executable, str(CLI), str(src), str(OUT / (name + '.js'))], check=True)
            if name == 'HeroComponents':
                subprocess.run([sys.executable, str(CLI), '--disasm', str(src),
                                str(OUT / (name + '.disasm.txt'))], check=True)


if __name__ == '__main__':
    main()
