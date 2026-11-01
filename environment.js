const BLOCK_COUNT=11;
const blockDesigns=[
 ['Market square','market'],['Art deco offices','deco'],['Courtyard apartments','courtyard'],['Medical centre','clinic'],['Railway workshops','workshop'],
 ['Corner cafés','cafe'],['Glass office campus','glass'],['City library','library'],['Botanical square','park'],['Terraced shops','shops'],
 ['Civic gardens','civic'],['Cinema plaza','cinema'],['Checkers Gardens','checkers'],['Hotel & pool','hotel'],['Old town arcade','arcade'],
 ['Fire station','fire'],['University court','college'],['Sports club','sport'],['Warehouse district','warehouse'],['Neighbourhood mall','mall'],
 ['Church gardens','church'],['Redbrick lofts','lofts'],['Petrol station','fuel'],['Garden apartments','apartments'],['Food courtyard','food']
];
const cityBlocks=[],lots=[],yards=[],parkedCars=[],streetProps=[];
function addBuilding(x,y,w,h,type='flat',extra={}){const b={x,y,w,h,type,height:type==='tower'?25:type==='house'?5:12,color:pick(['#d8cdb5','#c9c8b4','#e2d9c7','#b6c2bb']),roof:pick(['#8d9990','#a7a998','#9b978a']),...extra};buildings.push(b);return b}

function renderBuilding(c,b){const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},L=(x,y,xx,yy,col,w=1)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},C=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()},T=(t,x,y,s=10,col='#e5e4ce')=>{c.fillStyle=col;c.font=`600 ${s}px sans-serif`;c.textAlign='center';c.fillText(t,x,y)};
const {x,y,w,h,type}=b,z=b.height||10;R(x+z*.7,y+z,w+5,h+5,'#243d3540');R(x,y,w,h,'#777d6c');R(x,y-5,w,h,b.color);R(x+4,y-z,w-8,h-5,b.roof);L(x+5,y-z,x+w-5,y-z,'#f3eed655',2);R(x+5,y+h-z-5,w-10,3,'#4d60595e');
 if(type==='house'||type==='garage'||type==='church'){const ridge=x+w*.5;R(x+4,y-z,w*.48,h-5,b.roof);R(ridge,y-z,w*.48-4,h-5,'#182b261c');L(ridge,y-z,ridge,y+h-z-6,'#e2c8a38c',2);for(let yy=y-z+7;yy<y+h-z-8;yy+=8)L(x+7,yy,x+w-7,yy,'#392d2520');if(type!=='garage'){R(x+15,y-z+15,7,13,'#c6b7a0');R(x+14,y-z+13,9,4,'#6d6858');R(x+w-25,y+h-z-18,13,9,'#6c9290');L(x+w-25,y+h-z-14,x+w-12,y+h-z-14,'#c4d7c5');}if(b.houseStyle===4){R(x+21,y-z+9,40,25,'#355861');for(let k=0;k<4;k++)L(x+23+k*10,y-z+10,x+23+k*10,y-z+31,'#8ca8a6',1)}}
 else if(type==='tower'){R(x+8,y-z+5,w-16,h-15,'#4c7477');for(let xx=x+12;xx<x+w-10;xx+=16)L(xx,y-z+7,xx,y+h-z-12,'#acd4cd7a',2);for(let yy=y-z+14;yy<y+h-z-12;yy+=19)L(x+10,yy,x+w-10,yy,'#c2d9cb60',2);R(x+22,y-z+20,28,36,'#aec1b3');}
 else if(type==='sawtooth'){for(let xx=x+7;xx<x+w-10;xx+=32){R(xx,y-z+6,22,h-22,'#b7b5a0');R(xx+18,y-z+6,5,h-22,'#537274');}for(let k=0;k<3;k++)R(x+15+k*35,y+h-10,27,10,'#4c625c');}
 else {c.strokeStyle='#e4e2c05c';c.lineWidth=2;c.strokeRect(x+10,y-z+10,w-20,h-27);if(['brick','lofts','arcade','college','apartment'].includes(type)){for(let yy=y-z+13;yy<y+h-z-14;yy+=8)L(x+11,yy,x+w-11,yy,'#6c6b5b27');}
 for(let xx=x+16;xx<x+w-20;xx+=44){R(xx,y-z+18,24,21,'#566e68');R(xx+2,y-z+20,20,16,'#a4b3a4');L(xx+5,y-z+23,xx+19,y-z+23,'#71897e',2)}if(h>100){R(x+w-53,y+h-z-48,26,24,'#72867b');C(x+w-40,y+h-z-36,8,'#485e58');C(x+w-40,y+h-z-36,5,'#9ba99b');}
 if(['hotel','apartment','deco','clinic'].includes(type)){for(let xx=x+10;xx<x+w-15;xx+=23){R(xx,y+h-7,15,6,'#35595e');R(xx,y-7,15,4,'#5e7b7a')}for(let yy=y+10;yy<y+h-15;yy+=25)R(x+w-5,yy,4,15,'#4a6b69');}
 }
 const signs={supermarket:'Checkers',cinema:'GARDENS CINEMA',clinic:'MEDICAL +',library:'CITY LIBRARY',civic:'CITY HALL',fire:'FIRE & RESCUE',college:'GARDENS COLLEGE',mall:'GARDENS SQUARE',cafe:'COFFEE & CO.',bakery:'THE DAILY LOAF',market:'FRESH MARKET',arcade:'OLD TOWN ARCADE',hotel:'THE PALM HOTEL',club:'GARDENS CLUB',shop:'LOCAL & CO.'};if(signs[type]){R(x+2,y+h-23,w-4,22,type==='supermarket'?'#008c79':type==='fire'?'#a15f4b':'#3f6460');T(signs[type],x+w/2,y+h-8,Math.min(13,w/12),'#f4eddb');}if(b.shop){R(x+20,y-z+48,w-40,55,'#e6e5ce');T('sixty60',x+w/2,y-z+83,29,'#008c79');}if(type==='clinic'){R(x+w/2-5,y-z+53,10,31,'#bf6756');R(x+w/2-15,y-z+63,30,10,'#bf6756');}
 }