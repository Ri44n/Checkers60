// Twelve fixed roadside advertisements: six per side, two blocks apart.
function roadsideBillboards(){
 const boards=[];
 for(let side=0;side<2;side++)for(let row=0;row<11;row+=2)
 boards.push({side,row,x:side?townBounds.right+38:townBounds.left-216,y:ROAD_Y[row]+250,design:(row/2+side)%3});
 return boards;
}
function drawRoadsideBillboards(c,view){
 for(const board of roadsideBillboards()){
  if(board.x+200<view.x||board.x-12>view.x+view.w||board.y+135<view.y||board.y-12>view.y+view.h)continue;
  drawCheckersBillboard(c,board.x,board.y,board.design);
 }
}
function drawCheckersBillboard(c,x,y,design){
 c.save();c.translate(x,y);
 const R=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)},L=(x,y,xx,yy,color,w=1)=>{c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},O=(x,y,r,color)=>{c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()},T=(s,x,y,size,color,weight='bold')=>{c.fillStyle=color;c.font=weight+' '+size+'px Arial';c.textAlign='left';c.fillText(s,x,y)};
 // Steel supports, concrete feet, frame depth and a cast shadow.
 c.fillStyle='#203e3438';c.beginPath();c.moveTo(8,16);c.lineTo(190,30);c.lineTo(197,124);c.lineTo(21,112);c.closePath();c.fill();
 for(const xx of [28,145]){R(xx,84,5,33,'#536b62');R(xx-5,114,16,6,'#b4b4a0');L(xx+1,86,xx+1,114,'#a3afa0');}
 R(3,4,180,94,'#344f47');R(-3,-3,184,98,'#b9c2b1');R(0,0,178,92,design===1?'#f0ebd6':'#13a79e');
 const ink=design===1?'#087f78':'#ffffff';
 T('Checkers',10,23,18,ink);T('Sixty60',10,50,27,ink,'italic bold');
 // Check mark echoes the Sixty60 logo at readable map scale.
 c.strokeStyle=ink;c.lineWidth=2;c.beginPath();c.arc(150,27,14,0,Math.PI*2);c.stroke();L(143,27,149,33,ink,2.5);L(149,33,158,21,ink,2.5);
 if(design===0){
  // Fresh produce and a grocery bag.
  R(136,49,28,25,'#e8cd88');L(142,49,142,43,'#e8cd88',2);L(158,49,158,43,'#e8cd88',2);L(142,43,158,43,'#e8cd88',2);
  O(141,49,5,'#e47d57');O(153,47,6,'#81b66a');L(153,41,154,38,'#416d4e',2);
 }else if(design===1){
  R(130,47,36,27,'#1aa79a');R(133,50,30,3,'#91d2b7');T('60',137,67,16,'#fff');
  O(136,77,3,'#35584f');O(161,77,3,'#35584f');L(126,54,131,54,'#486f5b',2);
 }else{
  R(133,48,11,26,'#eee9d0');R(135,44,7,5,'#dfc66f');R(135,57,7,8,'#81b79c');
  O(155,61,9,'#e7b26d');L(151,55,149,61,'#b7804f',1);L(157,55,155,61,'#b7804f',1);
 }
 R(0,78,178,14,'#08796f');
 T(['Fresh finds. Delivered.','Your groceries. Delivered.','Everyday essentials.'][design],8,88,8,'#f5f5df');
 L(1,1,177,1,'#e4ebd4',1);L(1,1,1,91,'#e4ebd4',1);
 c.restore();
}
