
// Eight approved house/yard models, repeated with stable placement, roof and reflection variation.
const residentialYards=[],yardWater=[];
const homeRoofs=['#a87d62','#8c9d91','#a6a184','#7c929a','#9e8b78','#8c9f83','#aaa78d','#9d8a82'];
const homeSpecs=[
 {parts:[[49,63,102,82]],gates:[100]},
 {parts:[[23,67,98,79]],gates:[75],drive:[137,182],car:[159,174],water:[134,31,48,78]},
 {parts:[[23,32,142,67],[23,89,65,67]],gates:[126]},
 {parts:[[43,65,117,91]],gates:[104],drive:[10,43],car:[27,180],height:26},
 {parts:[[18,57,74,88],[108,57,74,88]],gates:[54,144],duplex:true},
 {parts:[[22,25,152,58],[22,76,43,80],[131,76,43,80]],gates:[98]},
 {parts:[[86,61,94,79],[107,15,68,27],[35,160,37,26]],gates:[111]},
 {parts:[[20,52,110,74],[132,79,48,61],[124,89,17,31]],gates:[84],drive:[141,184],car:[163,178]}
];
function yardPoint(g,x,y){return {x:g.x+(g.mirror?200-x:x)*g.w/200,y:g.y+(g.front==='north'?208-y:y)*g.h/208}}
function yardRect(g,r){const a=yardPoint(g,r[0],r[1]),b=yardPoint(g,r[0]+r[2],r[1]+r[3]);return {x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x),h:Math.abs(a.y-b.y)}}
function createResidentialYard(block,row,col){
 const pw=block.w/5,ph=block.h/2;
 let hash=(Math.imul(block.bx+11,73856093)^Math.imul(block.by+7,19349663)^Math.imul(row+3,83492791)^Math.imul(col+1,2654435761))>>>0;
 hash=(hash^(hash>>>16))>>>0;
 const g={x:block.x+col*pw+3,y:block.y+row*ph+3,w:pw-6,h:ph-6,front:row?'south':'north',variant:hash%8,mirror:!!(hash&16),roof:homeRoofs[(hash>>>8)%homeRoofs.length],secondaryRoof:homeRoofs[((hash>>>8)+3)%homeRoofs.length],block,row,col,customResidential:true};
 yards.push(g);residentialYards.push(g);const spec=homeSpecs[g.variant],parts=[];
 for(let i=0;i<spec.parts.length;i++){
  const r=yardRect(g,spec.parts[i]),house=addBuilding(r.x,r.y,r.w,r.h,i&&g.variant===6?'garage':'house',{block,yard:g,customResidential:true,height:spec.height||6,sceneryOnly:i>0&&!spec.duplex});
  parts.push(house);if(i===0||spec.duplex)block.houses.push(house);
 }
 for(let unit=0;unit<spec.gates.length;unit++){
  const n=2+block.by*500+block.bx*40+col*2+row,number=spec.duplex?String(n)+(unit?'B':'A'):n;
  const a=addressFor(parts[unit]||parts[0],block,g.front,number),gate=yardPoint(g,spec.gates[unit],208);
  a.x=gate.x;a.access.x=gate.x;a.yard=g;
 }
 if(spec.water)yardWater.push(yardRect(g,spec.water));
 if(spec.car){
  const p=yardPoint(g,...spec.car);
  parkedCars.push({horizontal:false,dir:g.front==='north'?1:-1,lane:p.x,pos:p.y,type:['hatch','sedan','suv'][(hash>>>4)%3],length:50,width:25,color:['#d4c5a1','#607f84','#ded9c2','#a96f55'][(hash>>>6)%4],yard:g});
 }
 return g;
}
function hitsYardWater(x,y){return yardWater.some(r=>x>r.x-8&&x<r.x+r.w+8&&y>r.y-8&&y<r.y+r.h+8)}
function renderResidentialYard(c,yard){
 c.save();c.translate(yard.x+(yard.mirror?yard.w:0),yard.y+(yard.front==='north'?yard.h:0));c.scale((yard.mirror?-1:1)*yard.w/200,(yard.front==='north'?-1:1)*yard.h/208);
 const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},L=(x,y,xx,yy,col,w=1)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},O=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()},P=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};
function tree(x,y,r=13){O(x+4,y+5,r+1,r,'#25433235');O(x,y,r,r,'#4b754d');O(x-3,y-3,r*.73,r*.76,'#7d9c67');O(x-4,y-5,r*.35,r*.3,'#92a974');}
function shrub(x,y,r=5){O(x+2,y+2,r,r,'#34543730');O(x,y,r,r,'#678958');O(x-1,y-1,r*.65,r*.55,'#8ba470');}
function planter(x,y,w=14,h=10){R(x+1,y+2,w,h,'#43563f25');R(x,y,w,h,'#bcaa87');for(let xx=x+3;xx<x+w;xx+=5)shrub(xx,y+h/2,3);}
function terrace(x,y,w,h){R(x,y,w,h,'#ba9d72');for(let yy=y+3;yy<y+h;yy+=5)L(x+1,yy,x+w-1,yy,'#806e553b',.7);}
function table(x,y){O(x+2,y+3,9,7,'#514d3730');O(x,y,8,6,'#b39466');for(const [dx,dy]of [[-11,0],[11,0],[0,-9],[0,9]]){R(x+dx-2,y+dy-2,4,4,'#dfcfaa');}}
function bench(x,y){R(x-10,y-2,20,5,'#a5865e');L(x-9,y,x+9,y,'#d8bd8d',.6);R(x-7,y+3,2,3,'#50634a');R(x+6,y+3,2,3,'#50634a');}
function pathLine(points,w=8,col='#cfc7a8'){c.lineJoin='round';c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.lineWidth=w+2;c.strokeStyle='#919e7c60';c.stroke();c.lineWidth=w;c.strokeStyle=col;c.stroke();c.lineCap='butt';}
function stepping(points){for(const [x,y]of points){R(x-4,y-3,8,6,'#d4ccb0');L(x-3,y-2,x+3,y-2,'#e4dcc4',.5);}}
function fence(gate=100,drive=null,wood=false){
 const edge=wood?'#b19b75':'#d2c9a9';
 L(2,3,198,3,edge,2);L(2,3,2,206,edge,2);L(198,3,198,206,edge,2);
 const gaps=[[gate-7,gate+7],...(drive?[drive]:[])].sort((a,b)=>a[0]-b[0]);let x=2;
 for(const [a,b]of gaps){L(x,206,a,206,edge,2);x=b;}L(x,206,198,206,edge,2);
 for(let y=8;y<204;y+=17){R(1,y,3,3,edge);R(196,y,3,3,edge);}
 if(wood)for(let x=8;x<197;x+=7)L(x,1,x,5,'#817858',.7);
 L(gate-6,207,gate+6,207,'#6e7f64',1);for(let x=gate-5;x<gate+6;x+=3)L(x,204,x,209,'#78866b',.7);
}
function roof(x,y,w,h,color='#a87f61',z=8){
 R(x+z*.5+2,y+z*.7,w+2,h+2,'#263f343d');R(x,y,w,h,'#dfd1b2');R(x,y-z,w,h-2,color);R(x+w/2,y-z,w/2,h-2,'#243a2d20');
 L(x+w/2,y-z,x+w/2,y+h-z-2,'#dec6a1',1.2);L(x,y-z,x+w,y-z,'#e3d6b53f',1);
 for(let yy=y-z+5;yy<y+h-z-3;yy+=5)L(x+2,yy,x+w-2,yy,'#4e48332e',.6);
 for(let xx=x+8;xx<x+w-10;xx+=23){R(xx,y+h-z+1,13,5,'#678b89');L(xx+1,y+h-z+3,xx+11,y+h-z+3,'#bfcebb',.5);}
}
function door(x,y){R(x-5,y-7,10,10,'#64847c');L(x,y-6,x,y+2,'#b6c5ac',.6);R(x-8,y+3,16,4,'#cdbd99');}
function car(){}
function grass(x=0,y=0,w=200,h=208){R(x,y,w,h,'#91aa7b');for(let i=0;i<40;i++){const px=x+5+(i*37)%Math.max(6,w-10),py=y+7+(i*61)%Math.max(8,h-14);L(px,py,px+2,py-1,'#b1be8c2a',.6);}}
function base(){grass();}
function cottage(){base();stepping([[100,200],[100,188],[100,176],[100,164]]);roof(49,63,102,82,yard.roof);terrace(64,145,72,14);door(100,145);R(63,148,74,3,'#d9d0ae');tree(28,30,15);tree(171,37,14);planter(52,154,14,10);planter(134,154,14,10);shrub(27,181,9);shrub(170,176,9);bench(47,184);fence(100,null,true);}
function poolHome(){base();R(137,135,45,88,'#b4b39b');roof(23,67,98,79,yard.roof);door(75,146);pathLine([[75,152],[75,206]],8);terrace(26,24,94,30);table(72,39);
 R(128,25,60,91,'#d8cba6');R(134,31,48,78,'#6faeab');R(138,35,40,70,'#80c9c2');L(139,40,174,40,'#d2e7d9',1);L(141,97,174,97,'#cae5d4',1);
 for(let yy=41;yy<72;yy+=11){R(119,yy,9,5,'#d6c8a4');L(121,yy+1,125,yy+1,'#f0e5c7',.7);}R(145,116,10,17,'#ecdfbf');R(164,116,10,17,'#e4d7b6');car(159,174,'#d4c5a1');tree(28,181,13);planter(89,176,18,11);fence(75,[136,183]);}
function lHome(){base();
 // A continuous L footprint and two pitched wings meeting at a roof valley.
 P([[24,42],[169,42],[169,102],[89,102],[89,160],[24,160]],'#233e3438');
 R(23,32,142,67,'#e1d5b8');R(23,89,65,67,'#e1d5b8');
 R(23,24,142,67,yard.roof);R(23,82,65,66,yard.roof);R(56,82,32,66,'#334c3624');R(94,24,71,67,'#334c3624');
 L(23,57,163,57,'#d1c1a0',1.3);L(56,57,56,146,'#d1c1a0',1.3);L(56,57,87,89,'#d8c7a4',1);
 for(let yy=30;yy<87;yy+=5)L(25,yy,162,yy,'#4f4f3930',.6);for(let yy=93;yy<145;yy+=5)L(25,yy,85,yy,'#4f4f3930',.6);
 for(let x=101;x<157;x+=23)R(x,93,14,5,'#71918d');R(81,119,7,18,'#71918d');
 terrace(96,105,65,60);table(126,134);door(126,99);pathLine([[126,168],[126,206]],8);tree(178,183,13);tree(20,182,12);shrub(181,117,8);fence(126);}
function twoStorey(){base();R(10,146,33,77,'#b6b59d');car(27,180,'#607f84');
 // The roof is raised; two window rows and a deep side wall establish height.
 R(50,86,119,85,'#2c443d45');R(43,65,117,91,'#e8dabb');R(160,65,9,91,'#b5ad90');R(43,39,117,91,yard.roof);R(102,39,58,91,'#314b4b25');
 for(let yy=44;yy<128;yy+=6)L(46,yy,157,yy,'#3f5b5c30',.6);L(102,39,102,128,'#c5d2c2',1.2);
 for(const yy of [134,148])for(let xx=53;xx<153;xx+=24){R(xx,yy,15,6,'#4e777f');L(xx+1,yy+2,xx+13,yy+2,'#bed3c1',.6);}
 for(const yy of [91,118,144])R(161,yy,5,10,'#628485');
 R(65,157,71,14,'#b4b5a0');R(66,157,69,4,'#829c94');L(65,170,136,170,'#d0dbc6',1.5);for(let xx=67;xx<136;xx+=9)L(xx,162,xx,170,'#607e76',.8);
 door(104,156);for(let i=0;i<4;i++)R(96-i,173+i*3,17+i*2,3,'#d3c4a1');pathLine([[104,186],[104,206]],8);
 // An airy carport instead of an enclosed garage.
 R(7,143,40,25,'#a9b39d70');for(let xx=9;xx<46;xx+=7)L(xx,143,xx,167,'#778c7a',1.2);for(const xx of [8,44])R(xx,165,2,15,'#718877');tree(24,30,12);tree(178,185,13);fence(104,[9,45]);}
function twins(){base();roof(18,57,74,88,yard.roof);roof(108,57,74,88,yard.secondaryRoof);door(54,145);door(144,145);pathLine([[54,151],[54,206]],7);pathLine([[144,151],[144,206]],7);for(let yy=29;yy<203;yy+=10)shrub(100,yy,4);tree(28,26,12);tree(173,26,12);planter(18,163,18,12);planter(165,163,18,12);bench(28,188);bench(173,188);fence(54);L(137,206,151,206,'#91aa7b',4);L(138,207,150,207,'#6f8468',1);}
function courtyard(){base();
 P([[26,34],[177,34],[177,160],[134,160],[134,86],[68,86],[68,160],[26,160]],'#27433736');
 R(22,25,152,58,'#ddd0ae');R(22,76,43,80,'#ddd0ae');R(131,76,43,80,'#ddd0ae');R(22,18,152,57,yard.roof);R(22,69,43,78,yard.roof);R(131,69,43,78,yard.roof);
 R(44,69,21,78,'#43523b20');R(153,69,21,78,'#43523b20');L(23,46,171,46,'#dac7a0',1.1);L(44,46,44,146,'#dac7a0',1.1);L(153,46,153,146,'#dac7a0',1.1);
 for(let yy=25;yy<73;yy+=6)L(25,yy,171,yy,'#65503b28',.5);for(let yy=80;yy<145;yy+=6){L(25,yy,62,yy,'#65503b28',.5);L(134,yy,171,yy,'#65503b28',.5);}
 R(71,90,54,67,'#cfc5a7');O(98,125,12,12,'#acb28a');tree(98,123,9);bench(98,148);R(61,103,5,17,'#6a8f8b');R(131,103,5,17,'#6a8f8b');door(98,83);pathLine([[98,161],[98,206]],9);shrub(24,183,8);shrub(174,183,8);fence(98);}
function gardenCottage(){base();roof(86,61,94,79,yard.roof);door(132,140);pathLine([[132,146],[132,176],[111,206]],7);
 // Raised beds and a translucent greenhouse give this yard a different purpose.
 for(let yy=28;yy<103;yy+=25){R(17,yy,51,18,'#ad946c');R(20,yy+3,45,12,'#786d4e');for(let xx=25;xx<65;xx+=9){shrub(xx,yy+9,2.7);L(xx-2,yy+4,xx+1,yy+13,'#a9b67a',.6);}}
 R(107,15,68,27,'#b5c6ac');R(109,17,64,23,'#719e9960');for(let xx=110;xx<174;xx+=11)L(xx,16,xx,41,'#dbe0c3',1);L(108,28,175,28,'#dbe0c3',1);
 stepping([[72,104],[73,118],[73,132],[72,146],[75,161]]);R(35,160,37,26,'#9a8c6c');R(37,156,33,24,'#b2ab89');L(53,156,53,178,'#d1c4a0',1);R(46,174,14,12,'#6c8573');
 tree(25,133,11);tree(174,179,12);planter(25,191,24,9);fence(111,null,true);}
function modern(){base();R(17,149,167,59,'#bebca4');for(let i=0;i<90;i++)R(20+(i*37)%160,153+(i*23)%50,1,1,'#8c947a35');
 terrace(26,23,99,27);table(69,36);
 R(25,61,110,74,'#29433c3d');R(20,52,110,74,'#e3dcbf');R(20,43,110,72,'#b9c2ad');R(24,47,102,64,yard.roof);
 R(137,86,48,64,'#29433c3d');R(132,79,48,61,'#ddd5bb');R(132,70,48,58,'#a2b6ad');R(136,74,40,50,yard.secondaryRoof);R(124,89,17,31,'#6b989780');L(128,89,128,119,'#c3d4bb',.7);
 R(31,56,73,37,'#385d67');for(let xx=32;xx<104;xx+=12)L(xx,57,xx,92,'#90b7b8',.8);for(let yy=58;yy<92;yy+=11)L(32,yy,103,yy,'#90b7b8',.7);
 for(let xx=32;xx<122;xx+=25)R(xx,117,18,6,'#5c8588');door(84,126);pathLine([[84,133],[84,206]],8);
 R(140,130,33,9,'#80998e');for(let yy=132;yy<139;yy+=2)L(141,yy,172,yy,'#c3d1b6',.6);R(141,149,43,59,'#a9ac97');car(163,178,'#ded9c2');
 tree(21,186,10);planter(110,181,20,12);O(31,141,5,3,'#8f927e');O(43,144,4,3,'#a5a18a');shrub(187,37,8);fence(84,[140,185]);}
const models=[cottage,poolHome,lHome,twoStorey,twins,courtyard,gardenCottage,modern];

 const spec=homeSpecs[yard.variant];
 if(spec.drive){const road=ROAD_Y[yard.block.by+(yard.front==='south'?1:0)],gap=yard.front==='north'?yard.y-road-69:road-69-yard.y-yard.h;
 R(spec.drive[0],208,spec.drive[1]-spec.drive[0],Math.max(0,gap)*208/yard.h,'#b4b39b');}
 models[yard.variant]();c.restore();
}
