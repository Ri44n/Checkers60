
// Approved school artwork, with a closed, solid campus perimeter.
const schoolBlocks=[];
function createSchoolBlock(block){
 block.layout='school-campus';block.type='school';block.name=block.by<5?'Northwest School':'Southeast School';block.houses=[];schoolBlocks.push(block);
 const main=addBuilding(block.x+40,block.y+42,440,88,'school',{block,schoolBlock:true,height:8});
 for(const [x,y]of [[40,186],[286,186],[40,312]])addBuilding(block.x+x,block.y+y,190,66,'school',{block,schoolBlock:true,sceneryOnly:true,height:6});
 block.gate={x:block.x+260,y:block.y+block.h+18};
 const address=addressFor(main,block,'south',block.by<5?7820:7800);address.x=block.gate.x;address.name=block.name+' entrance';block.deliveryAddress=address;
}
function hitsSchoolFence(x,y){
 return schoolBlocks.some(b=>x>b.x-5&&x<b.x+b.w+5&&y>b.y-6&&y<b.y+b.h+5);
}
function renderSchoolBlock(c,block){
 c.save();c.translate(block.x,block.y);
 const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},L=(x,y,xx,yy,col,w=1)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},O=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()},T=(s,x,y,size=12,col='#eff0dd',align='center')=>{c.fillStyle=col;c.font=`bold ${size}px Arial`;c.textAlign=align;c.fillText(s,x,y)},P=(points,col)=>{c.fillStyle=col;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};

 function tree(x,y,r=17){O(x+7,y+9,r+2,r,'#203f343e');O(x,y,r,r,'#476e4d');O(x-4,y-5,r*.74,r*.72,'#729261');O(x-6,y-7,r*.3,r*.3,'#829e6b');}
function bench(x,y,angle=0){c.save();c.translate(x,y);c.rotate(angle);R(-15,-4,30,10,'#233d3338');R(-14,-6,28,7,'#ae8358');L(-13,-3,13,-3,'#dbc29a');R(-11,2,3,4,'#4b5949');R(9,2,3,4,'#4b5949');c.restore();}
function lamp(x,y){O(x+4,y+4,5,3,'#304c3b35');R(x-1,y-2,2,12,'#4c6558');O(x,y-4,4,4,'#d8d2a9');}
function pathLine(points,w=15){c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle='#b8b498';c.lineWidth=w+4;c.stroke();c.strokeStyle='#d7ccb0';c.lineWidth=w;c.stroke();c.lineCap='butt';}
 function school(){
 R(0,0,988,428,'#90a77e');R(22,20,502,386,'#b9baa0');
 function schoolBuilding(x,y,w,h,roof){
  R(x+7,y+9,w+3,h+3,'#304d3a3b');R(x,y,w,h,'#f1e3b8');R(x+4,y-8,w-8,h-4,roof);
  R(x+w*.51,y-8,w*.49-4,h-4,'#294a3518');L(x+w*.51,y-8,x+w*.51,y+h-13,'#ede6c5',1.5);
  for(let yy=y;yy<y+h-12;yy+=10)L(x+7,yy,x+w-7,yy,'#5e6b5220',.8);
  for(let xx=x+12;xx<x+w-17;xx+=27){R(xx,y+h-10,18,8,'#577d80');L(xx+2,y+h-7,xx+16,y+h-7,'#b3c9b3',1);}
  R(x+w/2-10,y+h-10,20,12,'#718c82');R(x+w/2-14,y+h+2,28,6,'#d6c9a8');
 }
 // One larger building, three brighter classrooms and a junior playground.
 schoolBuilding(40,42,440,88,'#bdcec2');
 schoolBuilding(40,186,190,66,'#a9c9d1');schoolBuilding(286,186,190,66,'#e0ca89');schoolBuilding(40,312,190,66,'#b8cea0');
 pathLine([[260,423],[260,151],[260,136]],13);
 pathLine([[24,278],[514,278]],12);
 O(260,278,22,22,'#d4c8aa');O(260,278,14,14,'#719064');tree(260,276,10);
 bench(170,279);bench(355,279);lamp(274,148);lamp(274,398);
 for(const [x,y]of [[48,151],[473,150],[54,403]])tree(x,y,12);

 // Former fourth classroom: a contained junior play area, clear of the paths.
 R(284,298,215,105,'#d1c29e');R(291,305,201,91,'#b99076');
 // Swing frame, two suspended seats and a soft fall zone.
 R(300,317,75,57,'#d5b599');
 L(309,318,300,363,'#3a827e',2.7);L(309,318,318,363,'#3a827e',2.7);
 L(367,318,358,363,'#3a827e',2.7);L(367,318,376,363,'#3a827e',2.7);
 L(309,318,367,318,'#dfb64e',3.5);
 for(const x of [329,350]){L(x-4,320,x-4,346,'#e2d8b9',1);L(x+4,320,x+4,346,'#e2d8b9',1);R(x-6,345,12,4,'#4c5c58');}
 // A climbing cube with overhead grid, side rungs and visible upright posts.
 R(392,321,54,45,'#514f3e25');
 for(const x of [394,416,438]){L(x,316,x,350,'#66a0a6',1.8);L(x,350,x+4,361,'#377d82',1.8);}
 for(const y of [316,333,350])L(394,y,438,y,'#d5b24f',1.8);
 for(const x of [394,438])L(x,316,x+4,327,'#cf7659',2.5);
 L(398,327,442,327,'#cf7659',2);L(442,327,442,361,'#cf7659',2);L(398,361,442,361,'#cf7659',2);
 for(let y=335;y<360;y+=8)L(438,y,442,y+10,'#e1c777',1.2);
 // Raised slide tower, short ladder and contrasting slide rails.
 R(461,316,25,24,'#7b644b30');R(458,309,25,25,'#d1a65f');
 P([[456,311],[470,300],[485,311],[470,320]],'#dfb64f');
 R(465,334,14,42,'#74b7bf');L(465,336,465,376,'#d9e7c1',2);L(479,336,479,376,'#d9e7c1',2);
 L(450,319,458,319,'#506f6d',2);L(450,334,458,334,'#506f6d',2);for(let y=319;y<=334;y+=5)L(451,y,457,y,'#e0c78c',1.2);
 bench(410,388);

 // A single grass sports pitch; the pavilion sits along its north side.
 R(546,18,422,392,'#84a375');R(611,145,324,216,'#729b63');
 for(let i=0;i<6;i++)R(611+i*54,145,27,216,'#8bad6b22');
 c.strokeStyle='#e2e6ca';c.lineWidth=1.7;c.strokeRect(620,154,306,198);L(773,154,773,352,'#e2e6ca',1.7);
 c.beginPath();c.arc(773,253,30,0,Math.PI*2);c.stroke();
 c.strokeRect(620,206,44,94);c.strokeRect(882,206,44,94);c.strokeRect(609,229,11,48);c.strokeRect(926,229,11,48);
 L(609,229,609,277,'#dfe7ce',2);L(937,229,937,277,'#dfe7ce',2);
 // Large roofed pavilion: tiered benches, divided by a central stair aisle.
 R(594,40,350,82,'#2f4c3c35');R(589,33,350,79,'#aaa98e');
 for(let j=0;j<5;j++){R(600,63+j*9,325,6,'#c7c3a2');L(601,68+j*9,923,68+j*9,'#7d8c71',1);}
 R(755,59,19,53,'#8a957d');for(let yy=61;yy<111;yy+=8)L(756,yy,773,yy,'#c7c6a6',1);
 for(let xx=604;xx<=923;xx+=53)R(xx,58,4,16,'#486a59');
 R(583,24,362,36,'#527e72');R(583,24,362,6,'#71978a');L(586,59,942,59,'#b6c6aa',1.5);
 for(let xx=595;xx<939;xx+=21)L(xx,31,xx,56,'#315e5740',.9);
 // Trees fill the margins while keeping pitch, goals and pavilion clear.
 for(const [x,y,r]of [[565,151,15],[561,210,14],[564,274,16],[563,341,15],[589,390,15],[649,393,15],[710,389,14],[772,395,14],[833,391,15],[897,393,15],[960,158,13],[960,215,13],[960,281,14],[960,347,13]])tree(x,y,r);

 // Closed perimeter fence, including the front gate.
 const fence='#4f6f60';
 L(6,7,982,7,'#304c3e30',6);L(982,7,982,421,'#304c3e30',6);L(982,421,6,421,'#304c3e30',6);L(6,421,6,7,'#304c3e30',6);
 for(const y of [5,417]){L(6,y,982,y,fence,2);L(6,y+5,982,y+5,'#87a28a',1);for(let x=8;x<980;x+=17){L(x,y,x+8,y+5,'#668573',.8);R(x,y-2,3,10,'#4b6b59');}}
 for(const x of [6,980]){L(x,6,x,421,fence,2);for(let y=12;y<420;y+=17){L(x,y,x+4,y+8,'#668573',.8);R(x-2,y,7,3,'#4b6b59');}}
 R(227,414,65,9,'#3b5f50');for(let x=230;x<291;x+=7)L(x,412,x,424,'#93ac92',1);L(260,412,260,424,'#d0d3b6',1.5);
}

 school();c.restore();
}
