// The Checkers parcel replaces one complete three-by-three city block.
const checkersObstacles=[];
function createCheckersBlock(block){block.layout='checkers-store';block.name='Checkers';block.pools=[];
 addBuilding(block.x+7,block.y,454,284,'checkers-store',{block,checkersStore:true,sceneryOnly:true,height:18});
 const entrance={x:ROAD_X[block.bx],y:block.y+400},lot={x:block.x,y:block.y+301,w:468,h:127,name:'CHECKERS PARKING',block,entrance,checkersStore:true};lots.push(lot);
 const zone={x:block.x+42,y:block.y+317,w:83,h:47};collectionPoint={x:block.x+83.5,y:block.y+340.5,access:entrance,lot,zone};
 startPoint={x:collectionPoint.x,y:block.y+400,a:-Math.PI/2};block.collectionBays=[0,1,2,3].map(i=>({x:block.x+13+i*29,y:block.y+317,w:25,h:47,occupied:i===0}));
 block.accessibleBay={x:block.x+267,y:block.y+307,w:43,h:66};block.trolleyBay={x:block.x+150,y:block.y+305,w:39,h:65};
 for(const r of [{x:17,y:322,w:16,h:38},{x:153,y:309,w:33,h:54},{x:189,y:290,w:6,h:6},{x:275,y:290,w:6,h:6}])checkersObstacles.push({x:block.x+r.x,y:block.y+r.y,w:r.w,h:r.h});
 parkedCars.push({horizontal:false,dir:-1,lane:block.x+376,pos:block.y+340,type:'suv',color:'#d6c9a7',length:71,width:33,checkersStore:true});
 for(let k=0;k<3;k++)trees.push({x:block.x+22+k*212,y:block.y+436,r:9});
}
function inCollectionArea(p=player){return inRect(p,collectionPoint.zone)&&!collision(p.x,p.y)}
function renderCheckersStore(paint,b){paint.save();paint.translate(b.x,b.y);
const R=(x,y,w,h,c)=>{paint.fillStyle=c;paint.fillRect(x,y,w,h)},L=(x,y,xx,yy,c,w=1)=>{paint.strokeStyle=c;paint.lineWidth=w;paint.beginPath();paint.moveTo(x,y);paint.lineTo(xx,yy);paint.stroke()},T=(s,x,y,n=10,c='#fff',weight='600')=>{paint.font=weight+' '+n+'px Arial';paint.textAlign='center';paint.fillStyle=c;paint.fillText(s,x,y)},C=(x,y,r,c)=>{paint.fillStyle=c;paint.beginPath();paint.arc(x,y,r,0,TAU);paint.fill()};
// The ground and facade are cached together; verge trees are drawn afterward.
R(-3,-3,474,437,'#bfc2ad');R(0,0,468,428,'#c8c6b2');
// Broad supermarket roof, depth, service equipment and a branded frontage.
R(21,22,447,268,'#203c3535');R(7,10,454,266,'#658378');R(7,0,454,261,'#e2dfcd');R(14,7,440,238,'#b8c2b6');
for(let x=18;x<451;x+=11){L(x,9,x,238,'#a3afa2',1);L(x+2,9,x+2,238,'#cad0bf',.6)}
R(22,20,424,7,'#d5d7c6');R(22,231,424,7,'#d8dac7');
for(let k=0;k<3;k++){const x=43+k*45;R(x+4,52,33,34,'#304c3530');R(x,45,33,34,'#d8d8c5');R(x+3,49,27,25,'#798c81');C(x+16,61,9,'#526e66');C(x+16,61,5,'#94a599');L(x+10,61,x+22,61,'#c6cebb');L(x+16,55,x+16,67,'#c6cebb')}
for(let row=0;row<3;row++)for(let col=0;col<5;col++){const x=294+col*25,y=43+row*20;R(x+3,y+4,23,18,'#506b6233');R(x,y,23,18,'#365c61');R(x+1,y+1,21,16,'#466c70');L(x+11,y+1,x+11,y+16,'#a0b8a355',.6);L(x+1,y+8,x+21,y+8,'#a0b8a355',.6)}
R(43,137,110,30,'#d6d4bf');for(let k=0;k<8;k++)L(48+k*13,140,48+k*13,163,'#87988a',2);
R(7,242,454,42,'#66877b');R(12,247,444,32,'#a3b9a9');
// Glazed storefront and twin automatic entrance doors.
R(81,254,307,29,'#375e59');for(let k=0;k<12;k++){R(84+k*25,257,22,21,'#8bb9b1');L(85+k*25,258,104+k*25,276,'#c4ddc760',1)}
R(204,257,61,27,'#e3e7ce');R(208,260,24,23,'#7da9a0');R(236,260,24,23,'#82b1a6');L(230,266,230,276,'#eff4d8',1.4);L(238,266,238,276,'#eff4d8',1.4);
R(47,204,380,47,'#0c7165');R(47,204,380,4,'#62bca3');T('Checkers',237,242,42,'#f5f4dd','bold');

// Entrance apron, bollards and customer parking: the entire lower row.
R(0,285,468,143,'#626e67');R(0,285,468,16,'#c9c8af');for(let x=8;x<468;x+=16)L(x,286,x,299,'#afb7a0',.6);
R(204,282,61,20,'#a5ad98');T('ENTRANCE',234,295,7,'#496b5b');
for(const x of [192,278]){C(x+2,296,3,'#2b463e30');C(x,293,2.8,'#d9d7b8');C(x,293,1.2,'#446a59')}
// Four numbered dedicated motorbike bays.
R(8,303,125,69,'#167f6d');T('Sixty60  ·  COLLECTION',70,311,6.8,'#efffec','bold');
paint.strokeStyle='#9ee6c3';paint.lineWidth=1.2;for(let i=0;i<4;i++){const x=13+i*29;paint.strokeRect(x,317,25,47);T('60',x+12.5,359,8,'#def9da');T('0'+(i+1),x+12.5,326,5,'#b4e7ca')}
paint.setLineDash([3,3]);paint.strokeStyle='#8bffd5';paint.strokeRect(42,317,25,47);paint.setLineDash([]);
// Parked Sixty60 motorbike: seat, tank and crate, deliberately no rider.
paint.save();paint.translate(25,341);paint.rotate(-.09);paint.fillStyle='#153d343b';paint.beginPath();paint.ellipse(4,3,8,19,0,0,TAU);paint.fill();R(-2.5,-18,5,10,'#1a2a2b');R(-2.5,10,5,10,'#1a2a2b');L(-2,-14,-2,12,'#c1cfbb',1.2);L(2,-14,2,12,'#738e84',1.2);R(-4,-9,8,20,'#dbe7cd');R(-3,-7,6,11,'#153d3b');L(-8,-12,8,-12,'#b9d6c0',1.2);C(-8,-14,1.5,'#cce2cd');C(8,-14,1.5,'#cce2cd');R(-6,6,13,12,'#005e58');R(-7,3,13,11,'#21b7a1');R(-6,4,11,1,'#9fefd5');T('60',-.5,12,5,'#fff','bold');L(3,6,8,10,'#8ca397',1.2);paint.restore();
// Open tubular trolley corral, with recognizable nested wire baskets.
const tx=150;R(tx,305,39,65,'#71807455');
L(tx+3,309,tx+3,363,'#d1d9c5',1.8);L(tx+36,309,tx+36,363,'#d1d9c5',1.8);L(tx+3,309,tx+36,309,'#d1d9c5',1.8);
for(const y of [311,359])for(const x of [tx+3,tx+36]){C(x+1,y+2,2,'#2b473d55');C(x,y,1.6,'#e5e4ce')}
paint.save();paint.translate(tx+19.5,335);paint.scale(.48,.48);paint.translate(-(tx+19.5),-335);for(let k=0;k<5;k++){const y=309+k*10;paint.strokeStyle='#dce4ce';paint.lineWidth=1.1;paint.beginPath();paint.moveTo(tx+11,y);paint.lineTo(tx+28,y);paint.lineTo(tx+31,y+20);paint.lineTo(tx+8,y+20);paint.closePath();paint.stroke();
 for(let j=1;j<4;j++)L(tx+10+j*4.5,y+2,tx+8+j*5.6,y+18,'#bdc9b6',.55);
 for(let j=1;j<4;j++)L(tx+10-j*.6,y+j*5,tx+29+j*.6,y+j*5,'#bdc9b6',.55);
 L(tx+8,y+20,tx+7,y+24,'#e2e6cd',1);L(tx+31,y+20,tx+32,y+24,'#e2e6cd',1);
 C(tx+9,y+18,1.8,'#273c34');C(tx+29,y+18,1.8,'#273c34');L(tx+6,y+24,tx+33,y+24,'#1db69c',2.4);
}
paint.restore();
// Smaller nested carts sit inside the full-size tubular corral.
T('TROLLEYS',tx+19.5,376,5.5,'#e9ebd3');
// Ground-painted accessible bay and customer parking.
R(267,307,43,66,'#428ac14d');
// Fine wear marks keep the blue treatment reading as paint on asphalt.
for(let k=0;k<18;k++){const x=270+(k*17)%37,y=310+(k*23)%59;R(x,y,1.8,.6,'#626e6766')}
C(287,320,3.2,'#f6f5df');L(286,326,286,339,'#f6f5df',2.8);L(286,333,295,333,'#f6f5df',2.8);L(295,333,300,345,'#f6f5df',2.8);paint.strokeStyle='#f6f5df';paint.lineWidth=2.8;paint.beginPath();paint.arc(284,341,9,.15,Math.PI*1.5);paint.stroke();T('RESERVED',288,364,4.5,'#fff');
for(let i=0;i<4;i++){const x=267+i*44;L(x,307,x,373,'#e2dfbc',1.2);L(x,373,x+41,373,'#e2dfbc',1.2)}L(443,307,443,373,'#e2dfbc',1.2);T('CUSTOMER PARKING',355,386,6,'#c8d2bd');

// Clear side access on both ends of the parking aisle.
R(-27,380,27,40,'#626e67');R(468,380,27,40,'#626e67');

paint.restore();}
