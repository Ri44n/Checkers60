
const shoppingCentres=[],shoppingObstacles=[];
function createShoppingCentre(block){
 block.layout='suburban-shopping';block.type='shopping-centre';block.houses=[];block.shoppingVariant=block.bx<5?0:1;block.name=block.shoppingVariant?'East Shopping Centre':'West Shopping Centre';
 block.drive={x:block.x+612,y:ROAD_Y[block.by+1]};shoppingCentres.push(block);
 const names=block.shoppingVariant?['Fresh Mart','Chemist','Pet Supplies','Bakery','Coffee']:['Local Market','Pharmacy','Bakery','Hardware','Cafe'];
 for(let i=0;i<5;i++){
  const building=addBuilding(block.x+15+i*192,block.y+24,184,164,'shop',{block,shoppingCentre:true,height:14});
  const a=addressFor(building,block,'south',7000+block.shoppingVariant*20+i);
  a.name=names[i]+' · '+block.name;a.x=block.x+107+i*192;a.y=block.y+210;a.access=block.drive;a.shoppingCentre=block;
 }
 for(const [i,row,color]of [[2,0,'#c5ad83'],[5,0,'#557a7d'],[8,0,'#d9d5c2'],[12,0,'#a86e54'],[3,1,'#89988e'],[7,1,'#dfd1a8'],[10,1,'#68858b']])
 parkedCars.push({horizontal:false,dir:-1,lane:block.x+48+i*43,pos:block.y+(row?370:257),type:'hatch',length:54,width:26,color,shoppingCentre:block});
 for(let i=0;i<3;i++)shoppingObstacles.push({x:block.x+31+i*43,y:block.y+356,w:16,h:31});
 shoppingObstacles.push({x:block.x+818,y:block.y+280,w:132,h:60});
}
function renderShoppingCentre(c,block){
 c.save();c.translate(block.x,block.y);
 const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},L=(x,y,xx,yy,col,w=1)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},O=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()},T=(s,x,y,size=12,col='#eff0dd',align='center')=>{c.fillStyle=col;c.font=`bold ${size}px Arial`;c.textAlign=align;c.fillText(s,x,y)},P=(points,col)=>{c.fillStyle=col;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};

 function tree(x,y,r=17){O(x+7,y+9,r+2,r,'#203f343e');O(x,y,r,r,'#476e4d');O(x-4,y-5,r*.74,r*.72,'#729261');O(x-6,y-7,r*.3,r*.3,'#829e6b');}
function bench(x,y,angle=0){c.save();c.translate(x,y);c.rotate(angle);R(-15,-4,30,10,'#233d3338');R(-14,-6,28,7,'#ae8358');L(-13,-3,13,-3,'#dbc29a');R(-11,2,3,4,'#4b5949');R(9,2,3,4,'#4b5949');c.restore();}
function lamp(x,y){O(x+4,y+4,5,3,'#304c3b35');R(x-1,y-2,2,12,'#4c6558');O(x,y-4,4,4,'#d8d2a9');}
function planter(x,y){R(x-11,y-11,22,22,'#c0b391');O(x,y,9,8,'#4a7751');O(x-3,y-3,4,4,'#8da26a');}
function building(x,y,w,h,name,roof='#a3ada1',sign='#39685d'){
 R(x+8,y+10,w+3,h+3,'#2b443a40');R(x,y,w,h,'#777f71');R(x,y-7,w,h,'#d6d0b9');R(x+4,y-14,w-8,h-4,roof);
 L(x+5,y-14,x+w-5,y-14,'#e5e4cc',2);c.strokeStyle='#e4e2c066';c.lineWidth=2;c.strokeRect(x+11,y-6,w-22,h-24);
 for(let xx=x+16;xx<x+w-22;xx+=33){R(xx,y+h-21,24,13,'#416b6d');L(xx+2,y+h-16,xx+21,y+h-16,'#acc8bf');}
 R(x+4,y+h-39,w-8,17,sign);T(name,x+w/2,y+h-27,Math.min(10,w/12));
 R(x+w/2-12,y+h-18,24,18,'#7d9a93');L(x+w/2,y+h-17,x+w/2,y+h-1,'#d6ddc8');
 R(x+w-43,y+4,25,20,'#708579');O(x+w-31,y+14,7,7,'#4d655d');O(x+w-31,y+14,4,4,'#a2b1a1');
}
function accessible(x,y){c.save();c.strokeStyle='#edf0db';c.lineWidth=2;O(x,y-10,3,3,'#edf0db');L(x,y-5,x+1,y+5,'#edf0db',2.5);L(x,y,x+9,y,'#edf0db',2);L(x,y+5,x+9,y+5,'#edf0db',2);L(x+9,y+5,x+13,y+13,'#edf0db',2);c.beginPath();c.arc(x-2,y+8,9,.1,Math.PI*1.6);c.stroke();c.restore();}
function bike(x,y){R(x-3,y-13,6,29,'#233b35');O(x,y-13,3,5,'#23332e');O(x,y+14,3,5,'#23332e');R(x-5,y-6,10,12,'#19a99b');R(x-6,y+5,12,11,'#12998d');L(x-7,y-9,x+7,y-9,'#a6bcad',2);}
 function shopping(variant){R(0,0,988,428,'#c2bca4');R(16,218,956,194,'#65736b');
 const names=variant?['FRESH MART','CHEMIST','PET SUPPLIES','BAKERY','COFFEE']:['LOCAL MARKET','PHARMACY','BAKERY','HARDWARE','CAFE'];
 const colors=variant?['#378579','#7e8b76','#ab795c','#9d8d69','#547c77']:['#34775d','#5c8894','#bc9168','#818e87','#a36d5b'];
 for(let i=0;i<5;i++){const x=15+i*192;building(x,24,184,164,names[i],i%2?'#b5ac90':'#9da89b',colors[i]);for(let j=0;j<7;j++)R(x+7+j*24,181,24,12,j%2?colors[i]:'#e3d8bd');}
 R(15,202,958,14,'#d4ccb2');for(let x=32;x<980;x+=150){if(x>450&&x<540)continue;planter(x,205);lamp(x+22,209);}
 // Parking occupies the lower three former house plots.
 for(let row=0;row<2;row++)for(let i=0;i<13;i++){const x=28+i*43,y=row?336:223;L(x,y,x,y+68,'#e2ddc0',1.6);L(x,y+68,x+39,y+68,'#e2ddc0',1.6);}
 R(458,225,39,64,'#61929b60');accessible(476,254);
 R(501,225,39,64,'#d8d4b220');for(let y=229;y<284;y+=11)L(504,y,537,y+9,'#e2ddc0',1.5);R(501,210,39,14,'#d8cfb6');
 R(627,223,340,184,'#a8ad94');R(639,232,158,100,'#d2c5a4');for(let i=0;i<3;i++){O(664+i*49,270,15,15,'#896f52');for(let j=0;j<3;j++)O(653+i*49+j*10,287,3,3,'#b3976d');}tree(820,246,21);tree(938,363,20);tree(865,385,17);
 R(818,280,132,60,'#7e8d79');for(let x=830;x<950;x+=30)R(x,287,18,18,'#647465');T('SERVICE YARD',884,327,8);
 R(20,293,55,38,'#65736b');R(570,293,55,135,'#65736b');T('PARKING',310,317,10,'#dfe2c5');
 R(28,336,129,68,'#65736b');for(let i=0;i<=6;i++)L(28+i*21.5,336,28+i*21.5,404,'#e2ddc0',1.5);L(28,404,157,404,'#e2ddc0',1.5);for(let i=0;i<3;i++)bike(39+i*43,371);T('MOTORBIKES',93,415,7);bench(754,366);planter(787,370);
}

 R(570,428,55,27,'#65736b');shopping(block.shoppingVariant);c.restore();
}
function shoppingExitRoute(block){
 const points=[];
 if(player.y>block.y+292)points.push({x:player.x,y:block.y+310},{x:block.drive.x,y:block.y+310});
 else points.push({x:player.x,y:block.y+210});
 points.push({x:block.drive.x,y:block.y+210});return points;
}
