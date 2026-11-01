// All vehicles share one ground scale. Height is projected toward screen-up,
// independent of heading, for a small 2.5D effect without tilting the city map.
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()}
function oval(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function raised(x,y,w,h,z,angle,top,side='#375550',front='#52756b'){
 const dx=-Math.sin(angle)*z,dy=-Math.cos(angle)*z;
 const ground=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],upper=ground.map(([px,py])=>[px+dx,py+dy]);
 for(let i=0;i<4;i++){const j=(i+1)%4;poly([ground[i],ground[j],upper[j],upper[i]],i%2?side:front)}
 poly(upper,top);return {dx,dy};
}
function drawMotorcycle(x,y,heading,{delivery=false,scooter=false,color='#ac5844',rider='#7b89a2',lean=0,braking=false,speed=0}={}){
 const angle=heading+Math.PI/2;ctx.save();ctx.translate(x,y);ctx.rotate(angle);
 const sx=Math.cos(angle)*6+Math.sin(angle)*5,sy=-Math.sin(angle)*6+Math.cos(angle)*5;
 oval(sx,sy+1,8,19,'#10292644');
 // Two narrow tyres, fork legs and exposed alloy rims define the silhouette.
 for(const yy of [-13,13]){oval(0,yy,2.7,6,'#132628');oval(-.4,yy,1.1,4,'#829391');line(-2,yy,2,yy,'#c0cbc1',.8)}
 line(-2,-12,-2,10,'#bbc9c2',1.4);line(2,-12,2,10,'#637c77',1.4);
 // The detached silver protrusion is omitted; the exhaust stays within the frame.
 raised(-3.8,-8,7.6,19,2,angle,delivery?'#eeeedd':color,'#2e5351');
 const lift=raised(-3.5,-5,7,10,4,angle,'#243f3d','#162d2d');
 ctx.save();ctx.translate(lift.dx+lean*1.4,lift.dy);
 // The far leg is hidden by the bike; the visible knee and foot stay tucked in.
 line(3.2,-3,4.7,.5,'#344b52',2.6);line(4.7,.5,4.5,4,'#22393f',2.5);oval(4.7,4.3,1.7,1,'#17282b');
 if(scooter){raised(-5,-10,10,8,1.5,angle,color,'#52655d');}
 // Wide handlebars and tiny chrome mirrors remain visible around the rider.
 line(-7,-10,7,-10,'#b3c5bd',1.3);line(-7,-10,-8,-13,'#819a92',.8);line(7,-10,8,-13,'#819a92',.8);
 oval(-8.5,-13,2,1.2,'#d3e7df');oval(8.5,-13,2,1.2,'#d3e7df');
 line(-4,-3,-5.5,-8,delivery?'#05aa94':rider,3);line(4,-3,5.5,-8,delivery?'#05aa94':rider,3);
 circle(-5.5,-9,1.5,'#293d3d');circle(5.5,-9,1.5,'#293d3d');
 oval(0,-2,5,6,delivery?'#078d7d':rider);line(-3,-1,3,-1,delivery?'#b8eac2':'#b3bca8',1.4);
 // Helmet dome, lit crown, visor and rim.
 oval(0,-7,4,4.6,'#142c32');oval(-1,-8,2.7,3.2,delivery?'#4a7775':'#647379');
 line(-2.9,-9,2.9,-9,'#a2c1b9',1);line(-2,-10,1,-10,'#e4efe1',.7);
 ctx.restore();
 if(delivery){const p=raised(-6.5,5,13,11,6,angle,'#17b9a5','#006c65','#078e80');ctx.save();ctx.translate(p.dx,p.dy);rect(-5.5,5.8,11,1,'#82e6ce');line(-5.8,7,-5.8,14,'#66d7bf',.7);label('sixty',0,10.5,3.6,'#ecfff2');label('60',0,15,5.6,'#fff');rect(5,9,1,3,'#c5efdf');ctx.restore();}
 else if(scooter){raised(-4,7,8,6,3,angle,color,'#46594d');}
 // Headlamp lens and red tail light; brake light brightens on input.
 oval(0,-12.7,3,1.7,'#263e3d');oval(0,-13,2.1,1,'#fff2bd');rect(-2,17,4,1.4,braking?'#ff735a':'#ae4d3d');
 if(Math.abs(speed)>20){poly([[-2,-17],[-20,-77],[20,-77],[2,-17]],'#fff1b309')}
 ctx.restore();
}
function paintTone(hex,amount){const n=parseInt(hex.slice(1),16),to=amount>0?255:0,t=Math.abs(amount);return '#'+[n>>16&255,n>>8&255,n&255].map(v=>Math.round(v+(to-v)*t).toString(16).padStart(2,'0')).join('')}
function roundedPaint(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function carShell(W,L,color,boxy=false){const hw=W/2,hl=L/2,corner=boxy?3:5;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-hw+corner,-hl);ctx.lineTo(hw-corner,-hl);ctx.quadraticCurveTo(hw,-hl,hw,-hl+corner+2);ctx.lineTo(hw,hl-corner);ctx.quadraticCurveTo(hw,hl,hw-corner,hl);ctx.lineTo(-hw+corner,hl);ctx.quadraticCurveTo(-hw,hl,-hw,hl-corner);ctx.lineTo(-hw,-hl+corner+2);ctx.quadraticCurveTo(-hw,-hl,-hw+corner,-hl);ctx.closePath();ctx.fill()}
function windscreen(points){poly(points,'#233d43');const a=points[0],b=points[1];line(a[0]+1,a[1]+1.1,b[0]-1,b[1]+1.1,'#88b0b3',.7)}
function passengerCabin(W,L,paint,type){const hatch=type==='hatch',suv=type==='suv',front=-L*(suv?.30:.29),rear=L*(hatch?.31:suv?.30:.19),roofFront=front+9,roofRear=rear-7;
 windscreen([[-W*.40,front],[W*.40,front],[W*.30,roofFront],[-W*.30,roofFront]]);
 windscreen([[-W*.30,roofRear],[W*.30,roofRear],[W*.39,rear],[-W*.39,rear]]);
 // Narrow side glass sits inside the body footprint, without an extruded dark slab.
 for(const side of [-1,1]){poly([[side*W*.43,front+6],[side*W*.33,roofFront+1],[side*W*.33,roofRear-1],[side*W*.43,rear-4]],'#35545a');line(side*W*.43,(roofFront+roofRear)*.5,side*W*.32,(roofFront+roofRear)*.5,paint,1.3);}
 poly([[-W*.30,roofFront],[W*.30,roofFront],[W*.30,roofRear],[-W*.30,roofRear]],paintTone(paint,.15));
 line(-W*.28,roofFront+1,W*.26,roofFront+1,paintTone(paint,.43),.7);
 line(-W*.30,roofRear,W*.30,roofRear,paintTone(paint,-.15),.65);
 if(suv){for(const side of [-1,1]){line(side*W*.29,roofFront+2,side*W*.29,roofRear-2,'#54635d',1.1);line(side*W*.27,roofFront+3,side*W*.27,roofRear-3,'#b9c3b9',.65)}roundedPaint(-W*.21,roofFront+4,W*.42,Math.max(4,(roofRear-roofFront)*.40),1,'#466165');}
 for(const side of [-1,1])line(side*W*.43,roofFront+3,side*W*.43,roofFront+6,'#d0d4c7',.7);
}
function pickupCabin(W,L,paint){const f=-L*.29,r=L*.055;windscreen([[-W*.41,f],[W*.41,f],[W*.30,f+9],[-W*.30,f+9]]);roundedPaint(-W*.30,f+9,W*.60,r-f-11,1,paintTone(paint,.15));roundedPaint(-W*.29,r-3,W*.58,3,1,'#2e494e');
 for(const side of [-1,1]){poly([[side*W*.43,f+6],[side*W*.33,f+10],[side*W*.33,r-6],[side*W*.43,r-3]],'#36565d');line(side*W*.42,f+18,side*W*.33,f+18,paint,1.1)}
 // The open load bed has a continuous painted rim and a ribbed metal floor.
 const y=L*.12,h=L*.31;roundedPaint(-W*.42,y,W*.84,h,1.7,paintTone(paint,-.16));roundedPaint(-W*.35,y+2.5,W*.70,h-5,1,paintTone(paint,-.29));
 for(let k=-2;k<=2;k++)line(k*W*.115,y+5,k*W*.115,y+h-5,paintTone(paint,-.17),.7);line(-W*.41,y+1,W*.41,y+1,paintTone(paint,.3),.8);
}
function minibusCabin(W,L,paint,taxi){const f=-L*.40,g=f+11,rear=L*.40;
 // A short bonnet, broad windscreen and a full-length cabin identify a minibus.
 windscreen([[-W*.42,f],[W*.42,f],[W*.35,g],[-W*.35,g]]);
 roundedPaint(-W*.34,g+1,W*.68,rear-g-1,2,paintTone(paint,taxi?.16:.10));
 line(-W*.29,g+3,W*.29,g+3,paintTone(paint,.35),.75);
 if(taxi){for(const side of [-1,1]){
   for(let k=0;k<5;k++){const yy=g+2+k*(rear-g-4)/5;poly([[side*W*.45,yy],[side*W*.365,yy+1],[side*W*.365,yy+8.5],[side*W*.45,yy+9.5]],'#263f46');}
   // Taxi side stripes follow the body, rather than crossing the roof.
   line(side*W*.472,g+1,side*W*.472,rear-2,'#d3aa3b',1.1);
   poly([[side*W*.478,g+13],[side*W*.382,g+19],[side*W*.382,g+23],[side*W*.478,g+18]],'#2b8563');
   poly([[side*W*.478,g+10],[side*W*.382,g+16],[side*W*.382,g+18],[side*W*.478,g+13]],'#d45543');
   poly([[side*W*.478,g+19],[side*W*.382,g+25],[side*W*.382,g+27],[side*W*.478,g+22]],'#3977a0');
  }
  roundedPaint(-W*.33,rear+1,W*.66,4,1,'#2d464b');
  // A small passenger permit sits in the windscreen, as on the reference vans.
  roundedPaint(W*.18,f+3,3,3,.3,'#a9c185');
 }else{for(const side of [-1,1]){poly([[side*W*.44,g+1],[side*W*.36,g+2],[side*W*.36,g+10],[side*W*.44,g+12]],'#35565b');line(side*W*.39,g+15,side*W*.39,rear-2,paintTone(paint,-.16),.6)}for(const side of [-1,1])line(side*W*.24,g+6,side*W*.24,rear-5,paintTone(paint,-.09),.6);line(0,rear+3,0,L*.47,paintTone(paint,-.18),.6);}
}
function drawCar(car){const x=car.horizontal?car.pos:car.lane,y=car.horizontal?car.lane:car.pos,heading=car.horizontal?(car.dir>0?0:Math.PI):(car.dir>0?Math.PI/2:-Math.PI/2);
 if(car.type==='motorbike'||car.type==='scooter'){drawMotorcycle(x,y,heading,{scooter:car.type==='scooter',color:car.color,rider:car.rider,speed:car.speed,braking:car.braking});return}
 const W=car.width,L=car.length,paint=car.color,taxi=car.type==='taxi',van=car.type==='van',boxy=taxi||van||car.type==='bakkie',angle=heading+Math.PI/2;
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.lineCap='round';ctx.lineJoin='round';
 // Close contact shadows stay beneath the vehicle instead of becoming side panels.
 ctx.save();ctx.translate(Math.cos(angle)*2+Math.sin(angle)*2,-Math.sin(angle)*2+Math.cos(angle)*2);carShell(W+1,L+1,'#17342d40',boxy);ctx.restore();
 for(const yy of [-L*.31,L*.31])for(const side of [-1,1])roundedPaint(side*W*.48-1.6,yy-4.6,3.2,9.2,1.1,'#20332f');
 carShell(W,L,paintTone(paint,-.12),boxy);
 ctx.save();ctx.translate(-Math.sin(angle)*1.1,-Math.cos(angle)*1.1);carShell(W-1.2,L-1.2,paint,boxy);
 line(-W*.43,-L*.36,-W*.43,L*.36,paintTone(paint,.35),.55);line(W*.43,-L*.33,W*.43,L*.33,paintTone(paint,-.10),.55);
 if(taxi||van)minibusCabin(W,L,paint,taxi);else if(car.type==='bakkie')pickupCabin(W,L,paint);else passengerCabin(W,L,paint,car.type);
 // Bonnet seams, compact bumpers, mirrors and lamps complete the silhouette.
 const bonnet=taxi||van?-L*.43:-L*.35;line(-W*.32,bonnet,W*.32,bonnet,paintTone(paint,-.18),.55);
 const mirrorY=taxi||van?-L*.30:-L*.17;for(const side of [-1,1]){line(side*W*.46,mirrorY,side*(W*.5+1.7),mirrorY+1,paintTone(paint,-.15),.8);roundedPaint(side<0?-W*.5-3:W*.5+.5,mirrorY-1,2.7,3.6,.8,paintTone(paint,-.12));}
 roundedPaint(-W*.24,-L*.5+1.4,W*.48,1.3,.5,'#425450');
 for(const side of [-1,1]){roundedPaint(side<0?-W*.43:W*.28,-L*.5+2.6,W*.15,3,1,'#fff1c5');roundedPaint(side<0?-W*.43:W*.30,L*.5-4,W*.13,2.8,.7,car.braking?'#ff795b':'#b95543');}
 line(-W*.30,L*.5-1,W*.30,L*.5-1,paintTone(paint,-.24),1.1);roundedPaint(-3.3,L*.5-2.2,6.6,1.2,.3,taxi?'#dfcd93':'#c7d1bc');
 ctx.restore();ctx.restore();
}
function drawBike(){drawMotorcycle(player.x,player.y,player.a,{delivery:true,lean:player.lean||0,braking:!!keys[' ']||!!keys.s||!!keys.arrowdown,speed:player.v})}
function hitsVehicle(x,y,car){const cx=car.horizontal?car.pos:car.lane,cy=car.horizontal?car.lane:car.pos;return car.horizontal?Math.abs(x-cx)<car.length/2+6&&Math.abs(y-cy)<car.width/2+6:Math.abs(x-cx)<car.width/2+6&&Math.abs(y-cy)<car.length/2+6}
