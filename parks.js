
const cornerParks=[];
function createCornerPark(block){
 block.layout='park';block.type='park';block.houses=[];block.parkVariant??=0;
 block.name=['Pond Gardens','Fountain Play Park','Picnic Green','Water Gardens'][block.parkVariant];
 block.parkWater=block.parkVariant===0?{x:625,y:212,rx:103,ry:58}:block.parkVariant===1?{x:300,y:214,rx:25,ry:25}:block.parkVariant===3?{x:494,y:214,rx:158,ry:73}:null;
 cornerParks.push(block);
}
function hitsParkWater(x,y){
 return cornerParks.some(b=>{if(!b.parkWater)return false;const p=b.parkWater,px=(x-b.x)*988/b.w,py=(y-b.y)*428/b.h;
 // Keep the approved viewing decks accessible at the water's edge.
 if(b.parkVariant===0&&px>=719&&px<=753&&py>=183&&py<=226||b.parkVariant===3&&px>=625&&px<=695&&py>=194&&py<=234)return false;
 return ((px-p.x)/(p.rx+10))**2+((py-p.y)/(p.ry+10))**2<1;
 });
}
function renderCornerPark(c,block){
 c.save();c.translate(block.x,block.y);c.scale(block.w/988,block.h/428);
 const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},L=(x,y,xx,yy,col,w=1)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},O=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()},T=(s,x,y,size=12,col='#eff0dd',align='center')=>{c.fillStyle=col;c.font=`bold ${size}px Arial`;c.textAlign=align;c.fillText(s,x,y)},P=(points,col)=>{c.fillStyle=col;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};

 function tree(x,y,r=17){O(x+7,y+9,r+2,r,'#203f343e');O(x,y,r,r,'#476e4d');O(x-4,y-5,r*.74,r*.72,'#729261');O(x-6,y-7,r*.3,r*.3,'#829e6b');}
function bench(x,y,angle=0){c.save();c.translate(x,y);c.rotate(angle);R(-15,-4,30,10,'#233d3338');R(-14,-6,28,7,'#ae8358');L(-13,-3,13,-3,'#dbc29a');R(-11,2,3,4,'#4b5949');R(9,2,3,4,'#4b5949');c.restore();}
function lamp(x,y){O(x+4,y+4,5,3,'#304c3b35');R(x-1,y-2,2,12,'#4c6558');O(x,y-4,4,4,'#d8d2a9');}
function pathLine(points,w=15){c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle='#b8b498';c.lineWidth=w+4;c.stroke();c.strokeStyle='#d7ccb0';c.lineWidth=w;c.stroke();c.lineCap='butt';}
function pond(x,y,w=180,h=90){c.save();c.translate(x,y);c.scale(w/180,h/90);const pts=[[-89,-6],[-70,-37],[-20,-45],[25,-29],[76,-35],[92,-4],[73,29],[25,40],[-22,30],[-62,37]];P(pts.map(([x,y])=>[x*1.09,y*1.13]),'#b8b69a');P(pts,'#488e90');P(pts.map(([x,y])=>[x*.89,y*.77]),'#75b8ae');L(-48,-14,-12,-14,'#c3d7bb8b',2);L(12,16,48,16,'#c3d7bb8b',2);for(let i=0;i<5;i++){O(-73+i*30,30+Math.sin(i)*4,5,3,'#6e9a59');}c.restore();}
function flowerbed(x,y,w=70){R(x,y,w,14,'#766e4f');for(let i=0;i<w;i+=8){O(x+i+4,y+7,3,3,i%3?'#dbb358':'#c98086');}}
 function park(variant){
 R(0,0,988,428,'#88a575');
 const paths=[],reserved=[];
 const walk=(points,w=14)=>{pathLine(points,w);for(let i=1;i<points.length;i++)paths.push([points[i-1],points[i],w]);};
 const curve=(a,b,d,w=14)=>{const pts=[];for(let i=0;i<=30;i++){const t=i/30;pts.push([(1-t)*(1-t)*a[0]+2*(1-t)*t*b[0]+t*t*d[0],(1-t)*(1-t)*a[1]+2*(1-t)*t*b[1]+t*t*d[1]])}walk(pts,w);};
 const loop=(x,y,rx,ry,w=14)=>{const pts=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2;pts.push([x+Math.cos(a)*rx,y+Math.sin(a)*ry]);}walk(pts,w);};
 const reserve=(x,y,w,h)=>reserved.push({x,y,w,h});
 if(variant===0){
  loop(494,214,350,139,16);
  walk([[0,214],[144,214]],17);walk([[844,214],[988,214]],17);
  walk([[494,0],[494,75]],15);walk([[494,353],[494,428]],15);
  pond(625,212,195,112);reserve(510,143,230,138);
  for(const [x,y,a] of [[305,108,-.35],[700,100,.4],[310,319,.35],[690,321,-.35]])bench(x,y,a);
  flowerbed(350,35,90);flowerbed(350,383,90);
  // Pond overlook remains off the walking loop.
  R(719,183,34,43,'#b9a079');for(let i=0;i<6;i++)L(723+i*5,185,723+i*5,224,'#81745c');reserve(712,175,50,60);walk([[753,205],[844,214]],11);
 }else if(variant===1){
  // Paths end at a circular fountain plaza, never through its basin.
  curve([0,235],[130,235],[250,214],17);
  curve([350,214],[660,254],[988,235],17);
  walk([[300,0],[300,164]],15);walk([[300,264],[300,428]],15);
  O(300,214,50,50,'#bbb69c');O(300,214,43,43,'#d6ccb3');
  O(300,214,25,25,'#7a897b');O(300,214,21,21,'#66b4b1');O(300,214,8,8,'#cdd8c3');
  for(let i=0;i<8;i++){const a=i*Math.PI/4;L(300+Math.cos(a)*6,214+Math.sin(a)*6,300+Math.cos(a)*17,214+Math.sin(a)*17,'#e3f1dd',1.6);}
  reserve(240,154,120,120);
  // The playground connects with one short spur from the main path.
  walk([[755,243],[755,185]],12);
  R(610,70,280,116,'#d2c3a1');R(618,78,264,100,'#b6876b');reserve(598,60,306,132);
  // Two swings: A-frame legs, crossbar, ropes and separate seats.
  for(let x of [640,720]){L(x,98,x-10,144,'#547a73',3);L(x,98,x+10,144,'#547a73',3);}
  L(640,98,720,98,'#426c69',4);
  for(let x of [665,696]){L(x-5,100,x-5,127,'#d5d8b8',1);L(x+5,100,x+5,127,'#d5d8b8',1);R(x-7,126,14,5,'#665c4b');}
  R(790,92,32,32,'#d8b159');R(793,95,26,26,'#c47d56');R(795,124,22,39,'#70a5a6');L(796,128,796,162,'#d2d8b4',2);L(815,128,815,162,'#d2d8b4',2);
  R(839,132,22,24,'#d3bd91');O(850,143,13,13,'#e2bd63');
  bench(659,192);bench(846,192);bench(223,292);bench(373,132);
  flowerbed(192,22,65);flowerbed(333,383,75);
 }else if(variant===2){
  // A quiet open lawn with a perimeter strolling loop and picnic grove.
  loop(494,214,350,139,16);
  walk([[0,214],[144,214]],16);walk([[844,214],[988,214]],16);
  walk([[494,0],[494,75]],14);walk([[494,353],[494,428]],14);
  // Side picnic pads connect to the loop, leaving the centre unobstructed.
  R(180,155,120,110,'#c1b99b');walk([[144,214],[180,214]],11);reserve(165,145,150,130);
  for(const [x,y] of [[211,180],[264,233]]){R(x-18,y-8,36,16,'#a38860');L(x-19,y-14,x+19,y-14,'#c5ab7e',4);L(x-19,y+14,x+19,y+14,'#c5ab7e',4);}
  O(764,213,33,33,'#c6b899');walk([[797,214],[844,214]],12);
  P([[735,198],[764,180],[793,198],[793,228],[764,246],[735,228]],'#8b9578');P([[738,195],[764,182],[790,195],[764,219]],'#b2a07b');reserve(724,173,81,82);
  for(const [x,y,a] of [[310,103,-.3],[680,105,.3],[300,319,.3],[687,319,-.3]])bench(x,y,a);
  flowerbed(350,385,90);
 }else{
  // One connected water-garden loop, with no paths cutting through the pond.
  loop(494,214,270,133,15);
  walk([[0,214],[224,214]],16);walk([[764,214],[988,214]],16);
  walk([[494,0],[494,81]],14);walk([[494,347],[494,428]],14);
  pond(494,214,300,140);reserve(323,129,342,170);
  R(625,194,70,40,'#baa27b');for(let x=630;x<692;x+=7)L(x,197,x,231,'#89785c');
  reserve(620,187,83,53);walk([[695,214],[764,214]],11);bench(683,177,Math.PI/2);
  for(const [x,y,a] of [[310,98,-.4],[690,320,-.4],[300,326,.3]])bench(x,y,a);
  flowerbed(330,28,105);flowerbed(330,382,105);
 }
 const dist=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);};
 // Place trees only where their canopy clears every path and feature.
 for(let i=0;i<85;i++){
  const x=32+(i*137+variant*51)%923,y=27+(i*83+variant*27)%374,r=14+i%8;
  if(paths.some(([a,b,w])=>dist([x,y],a,b)<r+w/2+8)||reserved.some(q=>x>q.x-r&&x<q.x+q.w+r&&y>q.y-r&&y<q.y+q.h+r))continue;
  if(variant===2&&x>320&&x<660&&y>110&&y<320)continue;
  tree(x,y,r);
 }
 for(const [x,y]of [[120,189],[872,190],[467,53],[521,376]])lamp(x,y);
 R(26,237,65,14,'#4d725c');T('PARK',58,247,8);
}

 park(block.parkVariant);c.restore();
}
