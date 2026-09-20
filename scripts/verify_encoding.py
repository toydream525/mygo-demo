import ast,json,sys
from pathlib import Path
from types import SimpleNamespace
import numpy as np
from collections import Counter
source=ast.parse((Path(sys.argv[1])/'douzero/env/env.py').read_text());nodes=[n for n in source.body if isinstance(n,ast.FunctionDef)]
ns={'np':np,'Counter':Counter,'Card2Column':{**{r:r-3 for r in range(3,15)},17:12},'NumOnes2Array':{n:np.array([1]*n+[0]*(4-n)) for n in range(5)}}
exec(compile(ast.Module(body=nodes,type_ignores=[]),'original-env','exec'),ns)
convert=lambda cards:[{15:17,16:20,17:30}.get(c['rank'],c['rank']) for c in cards]
fixtures=json.loads(Path(sys.argv[2]).read_text())
for f in fixtures:
 v=f['v'];lord=v['landlord'];roles={lord:'landlord',(lord+1)%3:'landlord_down',(lord+2)%3:'landlord_up'};history=v['history'];played={roles[i]:convert([c for e in history if e['seat']==i for c in e['cards']]) for i in range(3)};last={roles[i]:convert(next((e['cards'] for e in reversed(history) if e['seat']==i),[])) for i in range(3)}
 info=SimpleNamespace(player_position=f['role'],player_hand_cards=convert(v['hand']),other_hand_cards=convert(f['unseen']),last_move=convert(v['target']['cards'] if v['target'] else []),legal_actions=[convert(a) for a in f['actions']],num_cards_left_dict={roles[i]:v['counts'][i] for i in range(3)},played_cards=played,bomb_num=v['bombs'],card_play_action_seq=[convert(e['cards']) for e in history],last_move_dict=last)
 expected=ns['get_obs'](info);np.testing.assert_array_equal(expected['x_batch'].flatten(),f['x']);np.testing.assert_array_equal(expected['z'].flatten(),f['z'])
print(f'{len(fixtures)} real states match DouZero exactly; roles: {set(f["role"] for f in fixtures)}')
