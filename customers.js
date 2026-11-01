// Fictional profiles approved for this game; identity never comes from a name guess.
const customerProfiles=[
 {name:'Amara',gender:'female',group:'darker',skin:'brown'},
 {name:'James',gender:'male',group:'white',skin:'light'},
 {name:'Lerato',gender:'female',group:'darker',skin:'dark'},
 {name:'Zoe',gender:'female',group:'white',skin:'light'},
 {name:'Daniel',gender:'male',group:'white',skin:'light'},
 {name:'Aisha',gender:'female',group:'darker',skin:'brown'},
 {name:'Thabo',gender:'male',group:'darker',skin:'dark'},
 {name:'Mia',gender:'female',group:'white',skin:'light'},
 {name:'Sipho',gender:'male',group:'darker',skin:'dark'},
 {name:'Nadia',gender:'female',group:'white',skin:'light'},
 {name:'Jan',gender:'male',group:'white',skin:'light'}
];
const customerShirts=[
 {name:'yellow',base:'#c89e42',shade:'#ae8335',light:'#e2bb5f',sleeve:'#d7ae51',seam:'#95722f'},
 {name:'coral',base:'#bd746d',shade:'#9d5957',light:'#d99789',sleeve:'#cc8b7f',seam:'#8d5150'},
 {name:'teal',base:'#398e80',shade:'#286d64',light:'#65b09b',sleeve:'#54a18f',seam:'#235e58'},
 {name:'blue',base:'#557fa9',shade:'#3d6085',light:'#82a5c8',sleeve:'#7197bd',seam:'#344f70'},
 {name:'purple',base:'#916b9c',shade:'#70517c',light:'#b494bf',sleeve:'#a180af',seam:'#65476f'}
];
const customerSkin={
 light:{base:'#dfb392',shade:'#bc8a6b',light:'#edc7a6',deep:'#9e7055'},
 brown:{base:'#b17a55',shade:'#925e40',light:'#c8956b',deep:'#72452f'},
 dark:{base:'#835333',shade:'#663c26',light:'#a6744d',deep:'#4e3022'}
};
const customers=[];let activeCustomer=null;
function newCustomerDetails(){const group=rand()<.7?'white':'darker',profile=pick(customerProfiles.filter(p=>p.group===group));return {person:profile.name,customerProfile:profile,shirtIndex:Math.floor(rand()*customerShirts.length)}}
function spawnCustomer(deliveryOrder){if(activeCustomer?.order===deliveryOrder)return activeCustomer;
 const profile=deliveryOrder.customerProfile||customerProfiles.find(p=>p.name===deliveryOrder.person)||customerProfiles[0];
 deliveryOrder.customerProfile=profile;deliveryOrder.person=profile.name;deliveryOrder.shirtIndex??=Math.floor(rand()*customerShirts.length);
 const customer={x:deliveryOrder.x,y:deliveryOrder.y,profile,shirtIndex:deliveryOrder.shirtIndex,order:deliveryOrder,armLift:1,phase:rand()*Math.PI*2,delivered:false,departurePoint:null};customers.push(customer);activeCustomer=customer;return customer;
}
function completeCustomer(){if(!activeCustomer)return;activeCustomer.delivered=true;activeCustomer.departurePoint={x:player.x,y:player.y};activeCustomer=null}
function resetCustomers(){customers.length=0;activeCustomer=null}
function drivingView(){const zoom=usingTouchLayout()?(innerWidth>innerHeight?1.05:1.15):1.4,anchor=usingTouchLayout()?(innerWidth>innerHeight?.43:.47):.48;return {x:camera.x-innerWidth/2/zoom,y:camera.y-innerHeight*anchor/zoom,w:innerWidth/zoom,h:innerHeight/zoom}}
function customerInView(customer,view,pad=40){return customer.x+pad>=view.x&&customer.x-pad<=view.x+view.w&&customer.y+pad>=view.y&&customer.y-pad<=view.y+view.h}
function updateCustomers(dt){const view=drivingView();for(let i=customers.length-1;i>=0;i--){const p=customers[i];p.phase+=dt*4;p.armLift=p.delivered?Math.max(0,p.armLift-dt*2.5):1;
 // The overview and a resize alone must not cause a visible customer to vanish.
 if(p.delivered&&!fullMap&&!customerInView(p,view)&&distance(player,p.departurePoint)>80)customers.splice(i,1);
}}
function drawCustomers(c,view){for(const p of customers)if(customerInView(p,view))drawCustomerModel(c,p.x,p.y-11.5,p)}
function drawCustomerModel(c,x,y,customer){
 const female=customer.profile.gender==='female',skin=customerSkin[customer.profile.skin],shirt=customerShirts[customer.shirtIndex],lift=customer.armLift,wave=Math.sin(customer.phase)*1.2*lift;
 c.save();c.translate(x,y);c.scale(1,.82);c.lineCap='round';c.lineJoin='round';
 const oval=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()},line=(x,y,xx,yy,color,w)=>{c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},poly=(pts,color)=>{c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()},mix=(a,b)=>a+(b-a)*lift;
 oval(4,14,9,3.2,'#183c3345');
 line(-2.3,-.5,-2.6,11.3,'#253b4c',3.2);line(2.3,-.5,2.6,11.3,'#30485a',3.2);
 line(-2.5,1,-2.6,10.6,'#426073',.65);line(2.5,1,2.6,10.6,'#4b6678',.65);
 oval(-2.7,12.9,1.65,1.65,'#d6ddcb');oval(2.7,12.9,1.65,1.65,'#e4e6d6');
 line(-3.8,14,-1.6,14,'#6d8b7e',.55);line(1.6,14,3.8,14,'#6d8b7e',.55);
 if(female){oval(-4.1,-15.5,2.5,3.2,'#28312d');line(-4.4,-14,-5.4,-8.2,'#303a31',3.1);oval(-5.4,-7.5,1.9,2.5,'#28312d');line(-5.2,-13.4,-3.6,-13.1,'#ddbd75',.8)}
 line(-4.6,-7.9,-6.8,-1.8,skin.shade,3);line(-6.8,-1.8,-5.6,2.2,skin.base,2.5);oval(-5.5,3.2,1.7,2,skin.light);
 const ex=mix(6.3,8.8),ey=mix(-1.8,-13.2),hx=mix(5.7,10.5)+wave,hy=mix(3.2,-21);
 line(4.6,-8,ex,ey,skin.shade,3.1);line(ex,ey,hx,hy+1.5,skin.base,2.4);oval(hx,hy,1.7,2,skin.light);
 if(lift>.1){line(hx-1.1,hy-.8,hx-1.5,hy-3*lift,skin.light,.85);line(hx,hy-1.3,hx,hy-3.7*lift,skin.light,.9);line(hx+1,hy-.7,hx+1.6,hy-2.8*lift,skin.light,.85);line(hx-1.3,hy+.7,hx-2.7,hy-.2,skin.light,.8)}
 poly([[-5.4,-9.7],[-2.3,-11],[2.3,-11],[5.4,-9.5],[4.4,0],[-4.1,0]],shirt.base);
 poly([[-5.4,-9.7],[-2.3,-11],[-2.7,-1],[-4.1,0]],shirt.shade);
 poly([[-2.3,-11],[2.3,-11],[5.4,-9.5],[3.5,-6.7],[-3.7,-6.7]],shirt.light);
 line(-4.8,-8.8,-6.2,-4.6,shirt.sleeve,4);line(4.5,-8.9,mix(5.9,6.8),mix(-4.6,-11.6),shirt.light,4);
 line(-3.6,-.1,3.9,-.1,shirt.seam,.9);line(2.8,-5.7,2.5,-1.9,shirt.light+'5c',.7);
 oval(0,-11.4,2.1,2.3,skin.shade);oval(0,-10.7,2.6,1.4,shirt.shade);
 oval(.4,-14.1,4.1,4.4,skin.deep);oval(0,-14.8,3.9,4.5,skin.base);
 oval(-3.7,-14.7,.85,1.4,skin.shade);oval(3.7,-14.7,.85,1.4,skin.light);
 poly([[-3.7,-14],[-4,-17.2],[-2.8,-19.4],[-.5,-20],[2,-19.6],[3.8,-17.4],[3.4,-13.2],[2.2,-14.1],[-1.9,-14.4]],'#24332f');
 oval(-1.1,-18.1,2.4,1.3,'#3d4b3d');oval(.1,-11.7,.8,.65,skin.light);c.restore();
}
