from pathlib import Path
import hashlib,os,tarfile,shutil,json
f=Path('candidate-input-download/full-candidate-2-inputs.tgz')
assert hashlib.sha256(f.read_bytes()).hexdigest()=='925cca8177a811802dc8d385d5b6197b8a32f072ad79afeac8ab4acc91b76d33'
root=Path(os.environ['RUNNER_TEMP'])/'full-candidate-2-input';assert not root.exists();root.mkdir()
expected={f'{folder}/koder-cli.{ext}' for folder in ['candidate','baseline'] for ext in ['sh','ps1','cmd']}
expected.update(f'{folder}/koder-cli-{version}.{ext}'for folder,version in [('candidate','0.4.1-candidate.2'),('baseline','0.4.0')] for ext in ['tgz','json'])
with tarfile.open(f) as t:
 members=t.getmembers();assert len(members)==10 and {m.name for m in members}==expected
 for m in members:
  assert m.isfile() and 0<m.size<40000000
  dest=root/m.name;dest.parent.mkdir(exist_ok=True)
  with t.extractfile(m)as source,dest.open('xb')as target:shutil.copyfileobj(source,target)
print(json.dumps({'verifiedBundle':True,'files':len(expected),'root':str(root)}))
