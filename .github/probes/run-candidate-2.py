from pathlib import Path
import os,sys,subprocess
r=Path(os.environ['RUNNER_TEMP']);p=Path(__file__).resolve().parent
mode,entry,plat,arch=sys.argv[1:]
modes=['cold','upgrade']if mode=='both'else[mode]
for m in modes:
 argv=[sys.executable,str(p/'candidate-install-matrix.py'),'--mode',m,'--entry',entry,'--expected-platform',plat,'--expected-arch',arch,'--assets',str(r/'full-candidate-2-input/candidate'),'--baseline-assets',str(r/'full-candidate-2-input/baseline'),'--manifest',str(p/'candidate-042-frozen.json'),'--manifest-sha256','32e99f1719dbd5c08ee13fa5a27d255f71aab3578231273535f2fde18719a870','--out',str(r/('candidate-2-'+m))]
 result=subprocess.run(argv)
 if result.returncode:raise SystemExit(result.returncode)
