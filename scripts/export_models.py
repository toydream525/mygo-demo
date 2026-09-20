"""Convert DouZero WP checkpoints to single-history ONNX. Requires torch, onnx, onnxruntime.
Usage: python export_models.py <DouZero checkout> <weights directory> <public/ai directory>
The original checkpoint is loaded with weights_only=True. No training is performed.
"""
import sys, importlib.util, json
from pathlib import Path
import numpy as np
import torch
import onnxruntime as ort
torch.set_num_threads(1)
repo, weights, out = map(Path,sys.argv[1:]);out.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('original_models',repo/'douzero/dmc/models.py');models=importlib.util.module_from_spec(spec);spec.loader.exec_module(models)
class Export(torch.nn.Module):
 def __init__(self,m):super().__init__();self.m=m
 def forward(self,z,x):
  h=self.m.lstm(z)[0][:,-1,:].expand(x.shape[0],-1)
  x=torch.cat((h,x),dim=-1)
  for layer in [self.m.dense1,self.m.dense2,self.m.dense3,self.m.dense4,self.m.dense5]:x=torch.relu(layer(x))
  return self.m.dense6(x)
report=[]
for role in ['landlord','landlord_up','landlord_down']:
 m=models.model_dict[role]();m.load_state_dict(torch.load(weights/f'{role}.ckpt',map_location='cpu',weights_only=True));m.eval();wrapped=Export(m).eval();width=373 if role=='landlord' else 484
 torch.onnx.export(wrapped,(torch.zeros(1,5,162),torch.zeros(2,width)),str(out/f'{role}.onnx'),input_names=['z','x'],output_names=['values'],dynamic_axes={'x':{0:'actions'},'values':{0:'actions'}},opset_version=17,dynamo=False)
 so=ort.SessionOptions();so.intra_op_num_threads=1;session=ort.InferenceSession(str(out/f'{role}.onnx'),so,providers=['CPUExecutionProvider']);rng=np.random.default_rng(91);err=0
 for n in [1,3,32,180]:
  z=rng.integers(0,2,(1,5,162)).astype(np.float32);x=rng.integers(0,2,(n,width)).astype(np.float32)
  with torch.no_grad():expected=m(torch.from_numpy(np.repeat(z,n,axis=0)),torch.from_numpy(x),return_value=True)['values'].numpy()
  actual=session.run(None,{'z':z,'x':x})[0];np.testing.assert_allclose(actual,expected,atol=2e-5,rtol=2e-5);assert np.argmax(actual)==np.argmax(expected);err=max(err,float(np.max(np.abs(actual-expected))))
 report.append({'role':role,'maxAbsoluteError':err,'batches':[1,3,32,180],'topActionMatches':True,'bytes':(out/f'{role}.onnx').stat().st_size});print(report[-1],flush=True)
(out/'conversion-report.json').write_text(json.dumps(report,indent=2))
