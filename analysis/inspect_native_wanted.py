"""Decode wanted mode evidence into task-local files."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools/jsc_decompiler'))
from parser import parse
from decompiler.decompiler import _decompile_func

OUT = ROOT / '.local/wanted'
OUT.mkdir(parents=True, exist_ok=True)
for src in ['Data/Common/wanted', 'Data/Common/wanted_control',
            'Client/UI/BattleSelect', 'Client/ClientUnits/ClientPlayer',
            'Client/Components/BattleController', 'Client/GameControllerBattle',
            'Client/Components/GameEventsComponent', 'Client/UI/GameEvents',
            'Data/Client/input_event_client', 'Data/Common/item_input',
            'Data/Common/resource_input', 'Data/Common/period_control',
            'Data/Common/pve_stage', 'Data/Common/pve_trigger',
            'Data/Client/pve_trigger_server_to_client', 'Client/Resource',
            'Client/Components/TriggerManager', 'Common/BaseConfig',
            'Client/Components/LoopQuest', 'Client/Components/GameEvent',
            'Client/Components/CommonComponent', 'Client/Components/InputEvent',
            'Client/UI/Award', 'Data/Common/item', 'Data/Common/unit_main',
            'Data/Common/unit_battle', 'Data/Common/skill_data',
            'Data/Common/hero_to_skill', 'Data/Common/skill_to_hero',
            'Client/UI/SkillInterface', 'Client/UI/HeroOprate',
            'Data/Common/hero_evolve', 'Client/ClientUnits/Unit',
            'Client/ClientUnits/UnitFactory', 'Client/Components/PlayerDataManager']:
    path = ROOT / ('analysis/decoded/script/' + src + '.jsc')
    if not path.exists():
        continue
    (OUT / (path.stem + '.js')).write_text(
        _decompile_func(parse(path.read_bytes())), encoding='utf-8')
print('Wanted evidence decoded to .local/wanted')
