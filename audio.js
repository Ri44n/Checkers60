// User-selected soundboard options. City ambience is deliberately excluded.
const GameSound=(()=>{
 const assets={phone:'phone3-retro-courier.wav',engine:'bike3-running-loop.wav',fuel:'fuel1-cash-drawer.wav',clock:'clock2-count-in.wav',paid:'paid3-package-and-payment.wav',taxi:'taxi2-friendly-double-tap.wav',lowfuel:'lowfuel1-dashboard-pips.wav',beach:'beach3-breezy-coastline.wav'};
 const buffers=new Map(),shots=new Set(),loops=new Map(),taxiTimes=new Map();
 let context=null,master=null,loading=null,embeddedLoading=null,serial=0,lastLow=-Infinity,lowArmed=true,nextTaxi=12,hornScan=0;
 const param=(p,value,tau=.06)=>{if(p?.setTargetAtTime)p.setTargetAtTime(value,context.currentTime,tau);else if(p)p.value=value};
 function running(){return !paused&&!isPortraitBlocked()&&!document.hidden&&!document.body?.classList.contains('at-start')&&state!=='failed'&&state!=='fuel-empty'&&fuel>0}
 function localSamples(){
  if(window.GameAudioEmbedded)return Promise.resolve(window.GameAudioEmbedded);
  if(!embeddedLoading)embeddedLoading=new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src='assets/audio/embedded.js';
   script.onload=()=>window.GameAudioEmbedded?resolve(window.GameAudioEmbedded):reject(Error('Offline audio bundle is empty'));
   script.onerror=()=>{embeddedLoading=null;reject(Error('Offline audio bundle could not be loaded'))};
   document.head.appendChild(script);
  });return embeddedLoading;
 }
 function bytesFromBase64(value){const raw=atob(value),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes.buffer}
 function unlock(ctx){
  const offline=typeof location!=='undefined'&&location.protocol==='file:';
  if(!ctx?.createBufferSource||!offline&&typeof fetch!=='function')return Promise.resolve(false);
  if(context&&context!==ctx){suspend();buffers.clear();loading=null;master=null}
  context=ctx;if(!master){master=context.createGain();master.gain.value=.7;master.connect(context.destination)}
  if(!loading)loading=(async()=>{
   const embedded=offline?await localSamples():null;
   await Promise.all(Object.entries(assets).map(async([key,file])=>{
    try{let data;if(embedded){if(!embedded[key])throw Error('Missing offline sample');data=bytesFromBase64(embedded[key])}
    else{const res=await fetch('assets/audio/'+file);if(!res.ok)throw Error('Audio asset '+res.status);data=await res.arrayBuffer()}
    const buffer=await context.decodeAudioData(data);buffers.set(key,buffer)}catch(error){console.warn('Could not load '+file,error.message)}
   }));
  })().catch(error=>{loading=null;console.warn('Could not prepare game audio',error.message)});return loading;
 }
 function startShot(key,volume,pan){
  const buffer=buffers.get(key);if(!context||!buffer||!running())return false;
  const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=volume;source.connect(gain);
  let panner=null;if(context.createStereoPanner){panner=context.createStereoPanner();panner.pan.value=pan;gain.connect(panner);panner.connect(master)}else gain.connect(master);
  const entry={key,source,gain,panner};shots.add(entry);source.onended=()=>{shots.delete(entry);gain.disconnect();panner?.disconnect()};source.start();return true;
 }
 function play(key,{volume=.45,pan=0}={}){
  if(!context||!running())return false;
  if(buffers.has(key))return startShot(key,volume,pan);
  const token=serial,requested=performance.now();
  loading?.then(()=>{if(token!==serial||performance.now()-requested>1400||key==='phone'&&state!=='call')return;startShot(key,volume,pan)});
  return false;
 }
 function stop(key){for(const shot of [...shots])if(!key||shot.key===key){try{shot.source.stop()}catch{}shots.delete(shot)}}
 function loop(key){
  if(loops.has(key))return loops.get(key);const buffer=buffers.get(key);if(!buffer||!context)return null;
  const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;gain.gain.value=0;source.connect(gain);gain.connect(master);source.start();
  const entry={source,gain};loops.set(key,entry);return entry;
 }
 function suspend(){serial++;stop();for(const entry of loops.values()){try{entry.source.stop()}catch{}entry.gain.disconnect()}loops.clear()}
 function reset(){suspend();taxiTimes.clear();lastLow=-Infinity;lowArmed=true;nextTaxi=12;hornScan=0}
 function update(dt){
  if(!context||!running()){if(loops.size||shots.size)suspend();return}
  const speed=Math.min(1,Math.abs(player.v)/285),throttle=!!(keys.w||keys.arrowup||keys.s||keys.arrowdown),engine=loop('engine');
  if(engine){param(engine.source.playbackRate,.57+speed*.94+(throttle?.05:0),.09);param(engine.gain.gain,.11+speed*.10+(throttle?.025:0),.10)}
  const coast=Math.max(0,Math.min(1,(player.y-(townBounds.bottom-450))/450));
  if(coast>0){const beach=loop('beach');if(beach)param(beach.gain.gain,coast*.18,.35)}
  else if(loops.has('beach')){const beach=loops.get('beach');beach.source.stop();beach.gain.disconnect();loops.delete('beach')}
  if(fuel>12)lowArmed=true;
  if(fuel<=10&&(lowArmed||elapsed-lastLow>25)){play('lowfuel',{volume:.36});lastLow=elapsed;lowArmed=false}
  hornScan-=dt;if(hornScan>0)return;hornScan=1;
  if(elapsed<nextTaxi)return;
  const candidates=cars.filter(c=>c.type==='taxi'&&elapsed-(taxiTimes.get(c.id)??-100)>40).map(car=>({car,x:car.horizontal?car.pos:car.lane,y:car.horizontal?car.lane:car.pos})).map(c=>({...c,d:Math.hypot(c.x-player.x,c.y-player.y)})).filter(c=>c.d<420).sort((a,b)=>a.d-b.d);
  const near=candidates[0];if(near){play('taxi',{volume:.30*(1-near.d/550),pan:Math.max(-.8,Math.min(.8,(near.x-player.x)/400))});taxiTimes.set(near.car.id,elapsed);nextTaxi=elapsed+18+near.car.id%5*2}
 }
 return {assets,unlock,play,stop,suspend,reset,update};
})();
window.addEventListener('blur',()=>GameSound.suspend());
document.addEventListener?.('visibilitychange',()=>{if(document.hidden)GameSound.suspend()});
