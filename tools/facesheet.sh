#!/bin/bash
cd "$(dirname "$0")/.." || exit 1
# The later creatures' portrait sheets (faces/moth.png, faces/witch.png, faces/treant.png, faces/maren.png): eight faces each of their own 3D figures,
# made in the page (story_lys.js, ?facesheet=). ONE headless browser at a time; the game served at 127.0.0.1:8123.
# usage (from the project root): tools/facesheet.sh [mo wi tr ma]
kill_chrome() { for p in $(ps aux | grep -i "Google Chrome" | grep -v grep | grep -i "remote-debugging" | awk '{print $2}'); do kill $p 2>/dev/null; done; }
declare -a KEYS=("${@:-mo}"); [ $# -eq 0 ] && KEYS=(mo wi tr ma)
for key in "${KEYS[@]}"; do
  case $key in mo) out=faces/moth.png;; wi) out=faces/witch.png;; tr) out=faces/treant.png;; ma) out=faces/maren.png;; esac
  r=$(mktemp)
  node tools/cdp_run.mjs "http://127.0.0.1:8123/?auto&fresh&level=lys&prog=106&flags=dryadDone&facesheet=$key" gpu=1 dpr=1 w=900 h=560 wait="FACESHEET done" delay=300 timeout=180000 eval="window.__sheet" > "$r" 2>&1
  python3 -c "
import base64,re,sys
t=open(sys.argv[1]).read(); m=re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)',t)
if not m: print('NO SHEET:', t[-600:]); sys.exit(1)
open(sys.argv[2],'wb').write(base64.b64decode(m.group(1))); print(sys.argv[2], 'ok')" "$r" "$out"
  rm -f "$r"; kill_chrome
done
