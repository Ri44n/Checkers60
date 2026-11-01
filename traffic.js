const trafficJunctions=[],TRAFFIC_GAP=15,TRAFFIC_BRAKE=100;
function trafficLane(horizontal,dir,road){return road+(horizontal?-dir:dir)*33}
function signalState(j,horizontal,time){const phase=Math.floor(time/5)%2,local=time%5,active=horizontal?phase===0:phase===1;return !active||local>=4.6?'red':local>=4?'amber':'green'}
function initialiseTraffic(){trafficJunctions.length=0;for(let xi=0;xi<ROAD_X.length;xi++)for(let yi=0;yi<ROAD_Y.length;yi++){const r=verticalStreetRanges[xi],y=ROAD_Y[yi];if(y<r.low||y>r.high)continue;trafficJunctions.push({id:xi+':'+yi,x:r.x,y,signal:xi>=3&&xi<=8&&yi>=3&&yi<=8,owner:null,north:y>r.low,south:y<r.high,west:xi>0,east:xi<ROAD_X.length-1})}}
function carBounds(car){return car.horizontal?{x:car.pos,y:car.lane,rx:car.length/2,ry:car.width/2,car}:{x:car.lane,y:car.pos,rx:car.width/2,ry:car.length/2,car}}
function boundsOverlap(a,b,pad=0){return Math.abs(a.x-b.x)<a.rx+b.rx+pad&&Math.abs(a.y-b.y)<a.ry+b.ry+pad}
function spawnTraffic(){cars.length=0;for(const j of trafficJunctions)j.owner=null;const types=['taxi','sedan','hatch','taxi','suv','bakkie','motorbike','van','taxi','scooter','sedan','hatch'];
 for(let i=0;i<144;i++){const horizontal=i%2===0,dir=i%4<2?1:-1,type=types[i%types.length],roads=horizontal?ROAD_Y:ROAD_X,road=roads[Math.floor(rand()*roads.length)],range=horizontal?{low:ROAD_X[0],high:ROAD_X.at(-1)}:verticalStreetRanges.find(r=>r.x===road),cruise=53+rand()*32;
 const car={id:i,horizontal,dir,type,road,lane:trafficLane(horizontal,dir,road),low:range.low,high:range.high,pos:0,speed:cruise,cruise,braking:false,waitingFor:null,stopHold:0,active:null,color:type==='taxi'?'#f2f0e6':pick(['#d5d9cc','#a7543e','#e5d7aa','#537b85','#334b52','#d1b65c','#748875']),rider:pick(['#b98a4b','#687da0','#c2b7a0','#4d6267']),...vehicleTypes[type]};
 let placed=false;for(let attempt=0;attempt<180;attempt++){car.pos=range.low+180+rand()*(range.high-range.low-360);const crossing=trafficJunctions.some(j=>(horizontal?j.y:j.x)===road&&Math.abs((horizontal?j.x:j.y)-car.pos)<190);if(!crossing&&!cars.some(other=>boundsOverlap(carBounds(car),carBounds(other),35))&&!parkedCars.some(other=>boundsOverlap(carBounds(car),carBounds(other),20))){placed=true;break}}
 if(placed)cars.push(car);
 }
}
function upcomingJunction(car){let best=null,distance=Infinity;for(const j of trafficJunctions){if((car.horizontal?j.y:j.x)!==car.road)continue;const axis=car.horizontal?j.x:j.y,d=(axis-car.pos)*car.dir;if(d>0&&d<distance){best=j;distance=d}}return best}
function forwardGap(car,obstacles,from=car.pos){let gap=Infinity;for(const b of obstacles){if(b.car===car)continue;const axis=car.horizontal?b.x:b.y,across=car.horizontal?b.y:b.x,halfAlong=car.horizontal?b.rx:b.ry,halfAcross=car.horizontal?b.ry:b.rx;
 if(Math.abs(across-car.lane)>=car.width/2+halfAcross+3)continue;const d=(axis-from)*car.dir;if(d>0)gap=Math.min(gap,d-halfAlong-car.length/2)}return gap}
function entryHasSpace(j,car,obstacles){const axis=car.horizontal?j.x:j.y,stopGap=(axis-car.pos)*car.dir-110-car.length/2;return forwardGap(car,obstacles)>Math.max(0,stopGap)+TRAFFIC_GAP}
function junctionOccupied(j,car,snapshot){return snapshot.some(b=>b.car!==car&&Math.abs(b.x-j.x)<b.rx+77&&Math.abs(b.y-j.y)<b.ry+77)}
function exitHasSpace(j,car,obstacles){const axis=car.horizontal?j.x:j.y,exit=axis+car.dir*(110+car.length/2),candidate=carBounds({...car,pos:exit});return !obstacles.some(b=>b.car!==car&&boundsOverlap(candidate,b,TRAFFIC_GAP))&&forwardGap(car,obstacles,exit)>TRAFFIC_GAP}
function trafficTick(dt,time,fleet=cars,stationary=parkedCars,includePlayer=true){const snapshot=fleet.map(carBounds),obstacles=snapshot.concat(stationary.map(carBounds));
 if(includePlayer){const ca=Math.cos(player.a),sa=Math.sin(player.a);obstacles.push({x:player.x,y:player.y,rx:Math.abs(ca)*17+Math.abs(sa)*8,ry:Math.abs(sa)*17+Math.abs(ca)*8,car:null})}
 // Keep an entered crossing reserved until the rear clears. A blocked vehicle
 // still behind the stop line must not reserve the crossing ahead of its leader.
 for(const car of fleet)if(car.active){const j=car.active,axis=car.horizontal?j.x:j.y;if((car.pos-axis)*car.dir>110+car.length/2||((car.pos-axis)*car.dir+car.length/2<=-110&&!entryHasSpace(j,car,obstacles))){if(j.owner===car)j.owner=null;car.active=null;car.waitingFor=null;car.stopHold=0}}
 const plans=[];for(const car of fleet){let limit=Infinity,target=car.cruise??75,held=false;const gap=forwardGap(car,obstacles);if(gap<Infinity){limit=Math.max(0,gap-TRAFFIC_GAP);target=Math.min(target,Math.sqrt(2*TRAFFIC_BRAKE*Math.max(0,gap-TRAFFIC_GAP-3)))}
 const j=car.active?null:upcomingJunction(car);if(j){const axis=car.horizontal?j.x:j.y,stopGap=(axis-car.pos)*car.dir-110-car.length/2;
  if(stopGap<200){if(car.waitingFor!==j.id){car.waitingFor=j.id;car.stopHold=0;car.waitSince=time}
   if(stopGap<=3&&car.speed<1)car.stopHold+=dt;
   let eligible=j.signal?signalState(j,car.horizontal,time)==='green':car.stopHold>=1;
   if(eligible&&stopGap<80&&entryHasSpace(j,car,obstacles)){const earlier=fleet.some(other=>other!==car&&!other.active&&other.waitingFor===j.id&&(other.waitSince<car.waitSince||other.waitSince===car.waitSince&&other.id<car.id)&&(j.signal?signalState(j,other.horizontal,time)==='green':other.stopHold>=1)&&(((other.horizontal?j.x:j.y)-other.pos)*other.dir-110-other.length/2)<80&&entryHasSpace(j,other,obstacles)&&exitHasSpace(j,other,obstacles));if(earlier)eligible=false}
   if(eligible&&stopGap<80&&entryHasSpace(j,car,obstacles)&&!j.owner&&!junctionOccupied(j,car,snapshot)&&exitHasSpace(j,car,obstacles)){j.owner=car;car.active=j;car.waitingFor=null;car.stopHold=0;}
   else{held=true;limit=Math.min(limit,Math.max(0,stopGap));target=Math.min(target,Math.sqrt(2*TRAFFIC_BRAKE*Math.max(0,stopGap-2)));}
  }
 }
 const change=target>car.speed?45:TRAFFIC_BRAKE,speed=car.speed+Math.sign(target-car.speed)*Math.min(Math.abs(target-car.speed),change*dt),travel=Math.max(0,Math.min(speed*dt,limit));
 plans.push({car,pos:car.pos+car.dir*travel,speed:travel<speed*dt-.001?travel/dt:speed,braking:held||target<car.speed-1});
 }
 for(const plan of plans){const c=plan.car;c.pos=plan.pos;c.speed=plan.speed;c.braking=plan.braking;
  const low=c.low+14,high=c.high-14;if(c.pos<low||c.pos>high){c.pos=Math.max(low,Math.min(high,c.pos));const nextLane=trafficLane(c.horizontal,-c.dir,c.road),candidate=carBounds({...c,lane:nextLane});if(!snapshot.some(b=>b.car!==c&&boundsOverlap(candidate,b,12))){c.dir*=-1;c.lane=nextLane;c.waitingFor=null;c.stopHold=0;if(c.active?.owner===c)c.active.owner=null;c.active=null}else c.speed=0;}
 }
}
function updateTraffic(dt,time){const steps=Math.max(1,Math.ceil(dt/.05)),step=dt/steps;for(let i=0;i<steps;i++)trafficTick(step,time-dt+(i+1)*step)}
function drawTrafficControls(view,time,overview=false){for(const j of trafficJunctions){if(!overview&&(j.x<view.x-145||j.x>view.x+view.w+145||j.y<view.y-145||j.y>view.y+view.h+145))continue;
 if(overview){if(j.signal)circle(j.x,j.y,13,signalState(j,true,time)==='green'?'#62dca0':'#db916d');continue}
 const approaches=[{exists:j.west,x:j.x-116,y:j.y-83,h:true,bar:[j.x-110,j.y-62,j.x-110,j.y-5]}, {exists:j.east,x:j.x+116,y:j.y+83,h:true,bar:[j.x+110,j.y+5,j.x+110,j.y+62]}, {exists:j.north,x:j.x+83,y:j.y-116,h:false,bar:[j.x+5,j.y-110,j.x+62,j.y-110]}, {exists:j.south,x:j.x-83,y:j.y+116,h:false,bar:[j.x-62,j.y+110,j.x-5,j.y+110]}];
 for(const a of approaches){if(!a.exists)continue;line(...a.bar,'#ede8cfbb',2.5);line(a.x+2,a.y+3,a.x+2,a.y+15,'#1d372b55',3);line(a.x,a.y,a.x,a.y+11,'#6a7966',2);
 if(j.signal){const phase=signalState(j,a.h,time);rect(a.x-5.5,a.y-15,11,28,'#1b302d');rect(a.x-4,a.y-14,8,26,'#2c4239');for(let k=0;k<3;k++){const state=['red','amber','green'][k],lit=phase===state,col=lit?['#fa6c53','#f3c76e','#50e7a7'][k]:'#44574b';if(lit)circle(a.x,a.y-9+k*8,5,col+'28');circle(a.x,a.y-9+k*8,2.7,col)}
 }else{ctx.beginPath();for(let k=0;k<8;k++){const angle=Math.PI/8+k*Math.PI/4,x=a.x+8*Math.cos(angle),y=a.y+8*Math.sin(angle);k?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fillStyle='#c5624d';ctx.fill();ctx.strokeStyle='#f4e6cd';ctx.lineWidth=1;ctx.stroke();label('STOP',a.x,a.y+1.6,4,'#fff2d8')}
 }
 }}
