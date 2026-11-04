
const churchBlocks=[];
function createChurchBlock(block){
 block.layout='church-residential';block.type='church-residential';block.name=block.by<5?'Northeast Church':'Southwest Church';block.houses=[];churchBlocks.push(block);
 const nave=addBuilding(block.x+191,block.y+42,99,192,'church',{block,churchBlock:true,height:18});
 const churchAddress=addressFor(nave,block,'west',block.by<5?7640:7600);churchAddress.y=block.y+247;churchAddress.access.y=churchAddress.y;churchAddress.name=block.name;block.deliveryAddress=churchAddress;
 addBuilding(block.x+126,block.y+106,228,69,'church',{block,churchBlock:true,sceneryOnly:true,height:12});
 for(let i=0;i<2;i++)for(let j=0;j<2;j++){
  const house=addBuilding(block.x+535+i*220,block.y+60+j*210,130,100,'house',{block,churchBlock:true,height:6});
  block.houses.push(house);addressFor(house,block,j?'south':'north',(block.by<5?7650:7610)+i*2+j);
 }
 for(const [x,color]of [[141,'#d1c4a7'],[270,'#6d8e92'],[356,'#c3c6b6']])
 parkedCars.push({horizontal:false,dir:-1,lane:block.x+x,pos:block.y+308,type:'hatch',length:54,width:26,color,churchBlock:block});
}
function renderChurchBlock(c,block){
 c.save();c.translate(block.x,block.y);
 const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},L=(x,y,xx,yy,col,w=1)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},O=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()},T=(s,x,y,size=12,col='#eff0dd',align='center')=>{c.fillStyle=col;c.font=`bold ${size}px Arial`;c.textAlign=align;c.fillText(s,x,y)},P=(points,col)=>{c.fillStyle=col;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};

 function tree(x,y,r=17){O(x+7,y+9,r+2,r,'#203f343e');O(x,y,r,r,'#476e4d');O(x-4,y-5,r*.74,r*.72,'#729261');O(x-6,y-7,r*.3,r*.3,'#829e6b');}
function bench(x,y,angle=0){c.save();c.translate(x,y);c.rotate(angle);R(-15,-4,30,10,'#233d3338');R(-14,-6,28,7,'#ae8358');L(-13,-3,13,-3,'#dbc29a');R(-11,2,3,4,'#4b5949');R(9,2,3,4,'#4b5949');c.restore();}
function pathLine(points,w=15){c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle='#b8b498';c.lineWidth=w+4;c.stroke();c.strokeStyle='#d7ccb0';c.lineWidth=w;c.stroke();c.lineCap='butt';}
function building(x,y,w,h,name,roof='#a3ada1',sign='#39685d'){
 R(x+8,y+10,w+3,h+3,'#2b443a40');R(x,y,w,h,'#777f71');R(x,y-7,w,h,'#d6d0b9');R(x+4,y-14,w-8,h-4,roof);
 L(x+5,y-14,x+w-5,y-14,'#e5e4cc',2);c.strokeStyle='#e4e2c066';c.lineWidth=2;c.strokeRect(x+11,y-6,w-22,h-24);
 for(let xx=x+16;xx<x+w-22;xx+=33){R(xx,y+h-21,24,13,'#416b6d');L(xx+2,y+h-16,xx+21,y+h-16,'#acc8bf');}
 R(x+4,y+h-39,w-8,17,sign);T(name,x+w/2,y+h-27,Math.min(10,w/12));
 R(x+w/2-12,y+h-18,24,18,'#7d9a93');L(x+w/2,y+h-17,x+w/2,y+h-1,'#d6ddc8');
 R(x+w-43,y+4,25,20,'#708579');O(x+w-31,y+14,7,7,'#4d655d');O(x+w-31,y+14,4,4,'#a2b1a1');
}
 function church(){R(0,0,494,428,'#8a9d76');R(494,0,494,428,'#90a679');
 for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=535+i*220,y=35+j*210;R(x-15,y-15,190,185,'#9ab082');building(x,y+25,130,100,'','#b29b7a');tree(x+155,y+130,17);R(x+15,y+140,16,40,'#c6bea1');}
 R(26,269,437,140,'#69786c');R(420,400,43,28,'#69786c');for(let i=0;i<9;i++){L(37+i*43,275,37+i*43,338,'#dedac0',1.5);}
 R(135,56,215,177,'#bcb59d');
 // Cross-shaped church and pitched nave roof.
 R(197,58,99,190,'#304c3540');R(133,116,222,72,'#304c3540');R(191,42,99,192,'#e0d4b8');R(126,106,228,69,'#d9ceb2');R(196,37,89,185,'#846e5f');R(131,100,218,64,'#99826d');R(239,37,46,185,'#6f6257');L(239,37,239,221,'#c9b796',2);
 for(let y=45;y<215;y+=11){L(199,y,236,y,'#c6a98b55');L(243,y,282,y,'#3c3b3426');}R(218,208,44,23,'#567c7b');R(215,222,50,13,'#d9c9a7');
 R(207,51,65,59,'#d6c7a6');R(211,44,57,58,'#af9c7e');P([[207,44],[239,18],[272,44]],'#726958');L(239,17,239,43,'#e1d8bf',4);L(231,25,247,25,'#e1d8bf',4);
 for(let i=0;i<5;i++){R(177,72+i*24,7,13,'#678584');R(297,72+i*24,7,13,'#678584');}
 R(43,85,89,120,'#a4ae8a');pathLine([[42,247],[85,247],[85,205]],11);bench(65,145,Math.PI/2);tree(55,66,23);tree(397,59,25);tree(409,219,22);R(75,239,95,17,'#4c705d');T('COMMUNITY CHURCH',122,251,8);L(494,0,494,428,'#c7c8a7',3);
}

 R(420,428,43,27,'#69786c');church();c.restore();
}
