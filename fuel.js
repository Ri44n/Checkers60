const petrolStations=[],fuelObstacles=[],REFILL_COST=50,REFILL_RATE=12.5;
let fuel=100,fullTankRange=54000,refuelSession=null,fuelRecovery=0,fuelStatus='FUEL';
function inRect(p,r){return p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h}
function createPetrolStations(){const corners=[[3,3,'north'],[7,3,'north'],[3,7,'south'],[7,7,'south']];
 for(let id=0;id<corners.length;id++){const [bx,by,side]=corners[id],block=cityBlocks.find(b=>b.bx===bx&&b.by===by),cw=block.w/3,ch=block.h/3,col=bx===3?0:1,row=side==='north'?0:2;
  const s={id,block,side,x:block.x+col*cw,y:block.y+row*ch,w:cw*2,h:ch,name:['Northwest','Northeast','Southwest','Southeast'][id]+' Petrol'};
  block.petrolStation=s;const overlaps=b=>b.x<s.x+s.w&&b.x+b.w>s.x&&b.y<s.y+s.h&&b.y+b.h>s.y;
  for(let i=buildings.length-1;i>=0;i--)if(overlaps(buildings[i]))buildings.splice(i,1);
  for(let i=addresses.length-1;i>=0;i--)if(!buildings.includes(addresses[i].building))addresses.splice(i,1);
  for(let i=lots.length-1;i>=0;i--)if(overlaps(lots[i]))lots.splice(i,1);
  for(let i=parkedCars.length-1;i>=0;i--){const c=parkedCars[i],r=c.horizontal?{x:c.pos-c.length/2,y:c.lane-c.width/2,w:c.length,h:c.width}:{x:c.lane-c.width/2,y:c.pos-c.length/2,w:c.width,h:c.length};if(overlaps(r))parkedCars.splice(i,1)}
  const kiosk=addBuilding(s.x+s.w-101,s.y+(side==='north'?s.h-45:6),91,37,'fuel-shop',{height:7,roof:'#e0dfc8',block,petrolShop:true});s.shop=kiosk;addressFor(kiosk,block,side,6000+id*2);
  const pumpY=s.y+(side==='north'?56:86);s.pumps=[];for(let k=0;k<4;k++){const p={x:s.x+37+k*60,y:pumpY};s.pumps.push(p);fuelObstacles.push({x:p.x-5,y:p.y-8,w:10,h:16})}
  s.zone={x:s.x+14,y:s.y+(side==='north'?10:35),w:s.w-28,h:96};s.bay={x:s.x+68,y:s.y+(side==='north'?58:82)};s.roadY=ROAD_Y[by+(side==='south'?1:0)];s.entrances=[{x:s.x+68,y:s.roadY},{x:s.x+s.w-42,y:s.roadY}];
  petrolStations.push(s);
 }
 // Six average out-and-back delivery trips per tank.
 fullTankRange=Math.round(addresses.reduce((n,a)=>n+Math.abs(a.x-collectionPoint.x)+Math.abs(a.y-collectionPoint.y),0)/addresses.length*12);
}
function drawPetrolGround(c,view){for(const s of petrolStations){if(s.x+s.w<view.x-35||s.x>view.x+view.w+35||s.y+s.h<view.y-35||s.y>view.y+view.h+35)continue;
 c.fillStyle='#c8c8b2';c.fillRect(s.x,s.y,s.w,s.h);c.fillStyle='#88938a';c.fillRect(s.x+3,s.y+3,s.w-6,s.h-6);
 for(const e of s.entrances){const top=s.side==='north'?s.roadY+69:s.y+s.h,bottom=s.side==='north'?s.y:s.roadY-69;c.fillStyle='#88938a';c.fillRect(e.x-23,top,46,bottom-top)}
 c.strokeStyle='#ede8c28c';c.lineWidth=1.5;for(let k=0;k<3;k++){const x=s.x+51+k*60;c.strokeRect(x,s.y+(s.side==='north'?18:46),33,73)}
 c.fillStyle='#407f6555';c.fillRect(s.bay.x-16,s.bay.y-28,32,56);
 }}
function drawPetrolDetail(c,view){for(const s of petrolStations){if(s.x+s.w<view.x-80||s.x>view.x+view.w+80||s.y+s.h<view.y-80||s.y>view.y+view.h+80)continue;const y=s.pumps[0].y;
 c.fillStyle='#1c453528';c.fillRect(s.x+22,y-27,232,60);c.fillStyle='#e8e6ce8c';c.fillRect(s.x+17,y-34,232,59);c.strokeStyle='#307d6e';c.lineWidth=4;c.strokeRect(s.x+17,y-34,232,59);
 for(const p of s.pumps){c.fillStyle='#d5d2b9';c.fillRect(p.x-8,p.y-11,16,22);c.fillStyle='#287e6c';c.fillRect(p.x-5,p.y-8,10,16);c.fillStyle='#d1e3cd';c.fillRect(p.x-3,p.y-6,6,5);c.strokeStyle='#293c34';c.lineWidth=1.5;c.beginPath();c.moveTo(p.x+5,p.y-4);c.lineTo(p.x+10,p.y);c.lineTo(p.x+10,p.y+8);c.stroke()}
 c.fillStyle='#2c7361';c.fillRect(s.x+17,y-38,232,12);c.fillStyle='#f8f1d8';c.textAlign='center';c.font='bold 8px sans-serif';c.fillText('PETROL',s.x+133,y-29);
 c.fillStyle='#316b59';c.fillRect(s.shop.x+2,s.shop.y+s.shop.h-13,s.shop.w-4,12);c.fillStyle='#f1edd6';c.font='bold 7px sans-serif';c.fillText('QUICK SHOP',s.shop.x+s.shop.w/2,s.shop.y+s.shop.h-4);
 const signY=s.y+(s.side==='north'?5:s.h-24);c.fillStyle='#285c4e';c.fillRect(s.x+4,signY,21,24);c.fillStyle='#f6d176';c.font='bold 9px sans-serif';c.fillText('P',s.x+14.5,signY+10);c.font='6px sans-serif';c.fillText('FUEL',s.x+14.5,signY+19);
 }}
function drawPetrolMapIcons(c){for(const s of petrolStations){const x=s.x+s.w/2,y=s.y+s.h/2;c.fillStyle='#234d3f';c.beginPath();c.arc(x,y,55,0,Math.PI*2);c.fill();c.fillStyle='#f2d78d';c.fillRect(x-19,y-25,28,43);c.fillRect(x-23,y+18,37,6);c.fillStyle='#234d3f';c.fillRect(x-14,y-19,18,13);c.strokeStyle='#f2d78d';c.lineWidth=5;c.beginPath();c.moveTo(x+11,y-17);c.lineTo(x+22,y-8);c.lineTo(x+22,y+12);c.lineTo(x+12,y+12);c.stroke()}}
function fuelStationAt(p){return petrolStations.find(s=>inRect(p,s.zone))||null}
function refreshFuelGauge(){$('fuelNeedle').style.transform='rotate('+(-100+fuel*2)+'deg)';$('fuelGauge').classList.toggle('low-fuel',fuel<=10);$('fuelGauge').ariaLabel='Fuel: '+Math.round(fuel)+' percent'+(fuel<=10?', low fuel':'')+(refuelSession?', refuelling':'');$('fuelStatusLabel').textContent=fuelStatus}
function cashRegisterSound(){unlockAudio();if(!audio)return;try{const at=audio.currentTime;for(const [f,delay,duration] of [[1100,0,.09],[1650,.075,.1],[2500,.16,.55]]){const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.value=f;o.connect(g);g.connect(audio.destination);g.gain.setValueAtTime(.0001,at+delay);g.gain.exponentialRampToValueAtTime(.055,at+delay+.008);g.gain.exponentialRampToValueAtTime(.0001,at+delay+duration);o.start(at+delay);o.stop(at+delay+duration)}}catch{}}
function petrolPrice(level=fuel){return Math.round(Math.max(0,Math.min(100,100-level))*REFILL_COST/100/5)*5}
function parkedAtPetrol(){return fuelStationAt(player)&&Math.abs(player.v)<6&&!keys.w&&!keys.arrowup&&!keys.s&&!keys.arrowdown}
function refreshPetrolPrompt(){const station=fuelStationAt(player),active=!!station&&state!=='failed'&&state!=='fuel-empty';$('fuelPrompt').classList.toggle('hidden',!active);if(!active)return;
 const price=petrolPrice(),parked=!!parkedAtPetrol(),button=$('buyPetrol');$('fuelPromptTitle').textContent=refuelSession?'Filling your tank…':fuel>=99.99?'Tank full':'Buy Petrol';$('fuelPromptInfo').textContent=refuelSession?(parked?'Filling · '+Math.floor(fuel)+'%':'Park to continue your paid refill'):fuel>=99.99?'Ready for the road.':!parked?'Park at the pumps to fill up.':credits<price?'You need R'+price+' to fill your tank.':'Fill to 100% · R'+price;button.textContent=refuelSession?'Paid · filling':fuel>=99.99?'Full tank':'Buy Petrol · R'+price;button.disabled=!!refuelSession||fuel>=99.99||!parked||credits<price;}
function buyPetrol(){if(paused||isPortraitBlocked()||fuelRecovery>0||state==='failed'||!parkedAtPetrol()||refuelSession||fuel>=99.99)return;const price=petrolPrice();if(credits<price){refreshPetrolPrompt();return}credits-=price;refuelSession={remaining:100-fuel,price};fuelStatus='FILLING';cashRegisterSound();updateHUD();refreshFuelGauge();refreshPetrolPrompt()}
function settleRefill(){refuelSession=null;fuelStatus='FUEL';refreshFuelGauge();refreshPetrolPrompt()}
function updateRefuelling(dt){if(refuelSession){if(parkedAtPetrol()){const amount=Math.min(refuelSession.remaining,REFILL_RATE*dt);fuel=Math.min(100,fuel+amount);refuelSession.remaining-=amount;fuelStatus='FILLING';if(refuelSession.remaining<.001){settleRefill();toast(fuel>=99.99?'Tank full':'Fuel added')}}else fuelStatus='FILL PAUSED'}else fuelStatus='FUEL';refreshFuelGauge();refreshPetrolPrompt()}
function consumeFuelDistance(distanceMoved){if(distanceMoved<=0||fuelRecovery>0)return;fuel=Math.max(0,fuel-distanceMoved/fullTankRange*100);if(fuel<=0)startFuelRecovery();else refreshFuelGauge()}
function startFuelRecovery(){if(fuelRecovery>0||state==='failed')return;settleRefill();clearDrivingInput();setPhoneExpanded(false);player.v=0;fuelRecovery=3;state='fuel-empty';order=null;timer=60;fullMap=false;fuelStatus='EMPTY';$('fuelAlert').classList.remove('hidden');phone();refreshFuelGauge();updateTouchAction()}
function updateFuelRecovery(dt){fuelRecovery=Math.max(0,fuelRecovery-dt);if(fuelRecovery<=0)gameOver('Ran out of Fuel')}
function resetFuel(){fuel=100;fuelRecovery=0;refuelSession=null;fuelStatus='FUEL';$('fuelAlert').classList.add('hidden');refreshFuelGauge()}
