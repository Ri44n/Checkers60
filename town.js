// A non-uniform rectilinear grid: short city streets, long suburban streets.
const FIELD_MARGIN=480,CITY_WIDTH=660,SUBURB_WIDTH=1180,BLOCK_HEIGHT=620;
const ROAD_X=[FIELD_MARGIN],ROAD_Y=[FIELD_MARGIN];
for(let i=0;i<11;i++){ROAD_X.push(ROAD_X.at(-1)+(i>=3&&i<=7?CITY_WIDTH:SUBURB_WIDTH));ROAD_Y.push(ROAD_Y.at(-1)+BLOCK_HEIGHT)}
const WORLD_W=ROAD_X.at(-1)+FIELD_MARGIN,WORLD_H=ROAD_Y.at(-1)+FIELD_MARGIN;
const townBounds={left:ROAD_X[0]-96,top:ROAD_Y[0]-96,right:ROAD_X.at(-1)+96,bottom:ROAD_Y.at(-1)+96};
// These short city avenues end at T-junctions. Above and below the centre,
// their parcels merge into longer suburban blocks instead of squeezing houses.
const verticalStreetRanges=ROAD_X.map((x,i)=>({x,low:[4,6,7].includes(i)?ROAD_Y[3]:ROAD_Y[0],high:[4,6,7].includes(i)?ROAD_Y[8]:ROAD_Y.at(-1)}));
const addresses=[],restrictedZones=[],fieldDetails=[];
let collectionPoint,startPoint;
function closestRoad(value,roads){return roads.reduce((best,p)=>Math.abs(value-p)<Math.abs(value-best)?p:best,roads[0])}
function outsideTown(x,y,pad=0){return x<townBounds.left+pad||x>townBounds.right-pad||y<townBounds.top+pad||y>townBounds.bottom-pad}
function addressFor(building,block,side,number){const centre={x:building.x+building.w/2,y:building.y+building.h/2};let x=centre.x,y=centre.y,access;
 if(side==='north'){y=block.y-18;access={x,y:ROAD_Y[block.by]}}else if(side==='south'){y=block.y+block.h+18;access={x,y:ROAD_Y[block.by+1]}}else if(side==='west'){x=block.x-18;access={x:ROAD_X[block.bx],y}}else{x=block.x+block.w+18;access={x:ROAD_X[block.bx+1],y}}
 const street=side==='north'||side==='south'?roadNames[(block.by+(side==='south'?1:0))%roadNames.length]:['Acacia Avenue','Palm Avenue','Olive Road','Garden Road','Oak Avenue','Sunset Road'][block.bx%6];
 const d={x,y,access,side,building,block,number,name:number+' '+street.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()),...newCustomerDetails(),items:pick(['Fresh fruit, milk & a little something sweet','Tonight’s dinner essentials','Coffee, bread & breakfast favourites','Pantry top-up & fresh vegetables','Weekend groceries'])};addresses.push(d);building.address=d;return d;
}
function townLot(block,x,y,w,h,name='CUSTOMER PARKING',reserve=false){const entrance={x:ROAD_X[block.bx],y:y+h*.7};const l={x,y,w,h,name,side:'left',entrance,block};lots.push(l);for(let k=0;k<Math.floor(w/38);k++){if(reserve&&k<3)continue;if(rand()>.45)parkedCars.push({horizontal:false,dir:1,lane:x+19+k*38,pos:y+34,type:pick(['hatch','sedan','suv']),color:pick(['#b8c0b2','#bf8b6a','#587b80','#d6c79d']),length:55,width:25})}return l;}
function cityGrid(block,index){if(block.type==='checkers'){createCheckersBlock(block);return}const cw=block.w/3,ch=block.h/3;block.layout='city-3x3';block.cells=[];
 const recipes=[['market','cafe','shop','brick'],['deco','tower','apartment','shop'],['apartment','brick','cafe','apartment'],['clinic','apartment','shop','deco'],['sawtooth','brick','shop','sawtooth'],['cafe','bakery','shop','brick'],['tower','tower','cafe','deco'],['library','college','brick','shop'],['apartment','cafe','deco','brick'],['shop','shop','market','brick'],['civic','deco','brick','shop'],['cinema','cafe','shop','brick'],['supermarket','shop','cafe','brick'],['hotel','tower','cafe','apartment'],['arcade','brick','shop','cafe'],['fire','shop','brick','deco'],['college','library','brick','cafe'],['club','apartment','cafe','deco'],['sawtooth','sawtooth','brick','shop'],['mall','shop','cafe','deco'],['church','brick','apartment','shop'],['brick','brick','tower','cafe'],['shop','sawtooth','cafe','brick'],['apartment','apartment','brick','cafe'],['cafe','bakery','market','shop']];
 for(let row=0;row<3;row++)for(let col=0;col<3;col++){const core=row===1&&col===1;const cell={x:block.x+col*cw,y:block.y+row*ch,w:cw,h:ch,row,col,core};block.cells.push(cell);
 if(block.type==='checkers'&&row===2&&col<2){const l=townLot(block,cell.x,cell.y+4,cw-3,ch-8,col?'CUSTOMER PARKING':'SIXTY60 COLLECTION',col===0);if(col===0){block.collect={x:l.x+46,y:l.y+66};collectionPoint={...block.collect,access:l.entrance,lot:l};startPoint={x:l.x+46,y:l.y+ch-29,a:-Math.PI/2}}else l.entrance={x:l.x+l.w/2,y:ROAD_Y[block.by+1]};continue}
 const inset=col===0?14:col===2?18:16,type=recipes[index][(row*3+col)%4];const b=addBuilding(cell.x+inset,cell.y+17,cw-inset-14,ch-34,type,{height:core?24:type==='tower'?24:type==='deco'?17:11,roof:pick(['#959d8e','#b1a38e','#a8b3a1','#8b9c98','#baaa90']),core,block,slot:row*3+col,shop:block.type==='checkers'&&row===0&&col===1});
 if(row===0&&col===0){b.w=85;const l={x:cell.x+111,y:cell.y+10,w:40,h:94,name:'P',side:'north',entrance:{x:cell.x+131,y:ROAD_Y[block.by]},block};lots.push(l);if(index%2===0)parkedCars.push({horizontal:false,dir:-1,lane:l.x+20,pos:l.y+35,type:'hatch',color:'#899d94',length:52,width:24})}
 if(b.shop){b.type='supermarket';b.roof='#bdcdb8'}
 if(core){restrictedZones.push({...cell,block});b.type=['tower','courtyard','church','deco'][index%4];b.sceneryOnly=true;}
 else{const side=row===0?'north':row===2?'south':col===0?'west':'east';addressFor(b,block,side,100+block.by*200+block.bx*12+row*3+col);}
 }
 for(let k=0;k<3;k++){trees.push({x:block.x+22+k*(block.w-44)/2,y:block.y+block.h+8,r:9});}
}
function suburbanGrid(block){if(block.bx===9&&block.by===7||block.bx===1&&block.by===3){createSchoolBlock(block);return}if(block.bx===1&&block.by===7||block.bx===9&&block.by===3){createChurchBlock(block);return}if((block.bx===1||block.bx===9)&&block.by===5){createShoppingCentre(block);return}const parkIndex=[[1,1],[9,1],[1,9],[9,9]].findIndex(([x,y])=>x===block.bx&&y===block.by);if(parkIndex>=0){block.parkVariant=parkIndex;createCornerPark(block);return}block.layout='suburb-2x5';block.houses=[];for(let row=0;row<2;row++)for(let col=0;col<5;col++)createResidentialYard(block,row,col);
}

function generateTown(){for(let by=0;by<11;by++)for(let bx=0;bx<11;){const central=bx>=3&&bx<=7&&by>=3&&by<=7,index=central?(by-3)*5+bx-3:-1,span=(by<3||by>7)?(bx===3?2:bx===5?3:1):1;const block={bx,by,span,x:ROAD_X[bx]+96,y:ROAD_Y[by]+96,w:ROAD_X[bx+span]-ROAD_X[bx]-192,h:BLOCK_HEIGHT-192,type:central?blockDesigns[index][1]:'residential',name:central?blockDesigns[index][0]:'Garden residences',pools:[]};cityBlocks.push(block);if(central)cityGrid(block,index);else suburbanGrid(block);
 for(let k=0;k<Math.floor(block.w/150);k++)streetProps.push({x:block.x+25+k*150,y:block.y-13});bx+=span;}
 for(let i=0;i<2100;i++){const x=rand()*WORLD_W,y=rand()*WORLD_H;if(outsideTown(x,y,-35))fieldDetails.push({x,y,r:1+rand()*4})}
}
function districtAt(x,y){const bx=ROAD_X.findIndex((p,i)=>i<11&&x>=p&&x<ROAD_X[i+1]),by=ROAD_Y.findIndex((p,i)=>i<11&&y>=p&&y<ROAD_Y[i+1]);if(bx>=3&&bx<=7&&by>=3&&by<=7)return bx>5?'EAST CITY':by<5?'CITY CENTRE':'GARDENS';return by<3?'PALM HEIGHTS':by>7?'ORANJEZICHT':bx<3?'OAKRIDGE':'SUNSET ESTATE'}
function renderRoadSurface(c){const corridors=[];
 for(const r of verticalStreetRanges){const top=r.low===ROAD_Y[0]?townBounds.top:r.low,bottom=r.high===ROAD_Y.at(-1)?townBounds.bottom:r.high;corridors.push({vertical:true,centre:r.x,start:top,length:bottom-top})}
 for(const y of ROAD_Y)corridors.push({vertical:false,centre:y,start:townBounds.left,length:townBounds.right-townBounds.left});
 // Complete each material layer across the entire network before the next.
 // Otherwise a later road's pavement cuts a grey strip across an earlier one.
 for(const [halfWidth,color] of [[96,'#bfc1af'],[74,'#7b8478'],[69,'#4c5755']]){
  c.fillStyle=color;for(const r of corridors){if(r.vertical)c.fillRect(r.centre-halfWidth,r.start,halfWidth*2,r.length);else c.fillRect(r.start,r.centre-halfWidth,r.length,halfWidth*2)}
 }
}
function renderTown(c,view={x:0,y:0,w:WORLD_W,h:WORLD_H}){const visible=(b,pad=35)=>b.x+b.w+pad>=view.x&&b.y+b.h+pad>=view.y&&b.x-pad<view.x+view.w&&b.y-pad<view.y+view.h;
 const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},L=(x,y,xx,yy,col,w=1)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()},C=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()},T=(t,x,y,s=10,col='#e5e4ce')=>{c.fillStyle=col;c.font='600 '+s+'px sans-serif';c.textAlign='center';c.fillText(t,x,y)};
 R(view.x,view.y,view.w,view.h,'#9aab77');drawBoundaryScenery(c,view);for(const f of fieldDetails.filter(f=>f.y>townBounds.top&&f.y<townBounds.bottom))if(visible({x:f.x,y:f.y,w:6,h:6},0)){C(f.x,f.y,f.r,'#738e5a55');L(f.x-2,f.y+4,f.x+2,f.y+4,'#c5bd8244')}
 // All roads stop at the town's fenced perimeter; fields continue beyond it.
 renderRoadSurface(c);
 c.setLineDash([20,24]);for(const r of verticalStreetRanges)L(r.x,r.low+120,r.x,r.high-120,'#d9d3b08c',1.5);for(const y of ROAD_Y)L(ROAD_X[0]+120,y,ROAD_X.at(-1)-120,y,'#d9d3b08c',1.5);c.setLineDash([]);
 for(const r of verticalStreetRanges)for(const y of ROAD_Y){const x=r.x;if(y<r.low||y>r.high||!visible({x:x-120,y:y-120,w:240,h:240}))continue;R(x-69,y-69,138,138,'#4c5755');for(let k=0;k<7;k++){if(y>r.low)R(x-46+k*14,y-100,7,22,'#e9e4cdac');if(y<r.high)R(x-46+k*14,y+78,7,22,'#e9e4cdac');if(x>ROAD_X[0])R(x-100,y-46+k*14,22,7,'#e9e4cdac');if(x<ROAD_X.at(-1))R(x+78,y-46+k*14,22,7,'#e9e4cdac')}}
 for(const b of cityBlocks){if(!visible(b))continue;R(b.x,b.y,b.w,b.h,b.type==='residential'?'#8ea478':'#b9b6a0');T(roadNames[b.by%roadNames.length],b.x+b.w/2,b.y-72,9,'#d0d5bf55');if(b.cells){for(const cell of b.cells){R(cell.x+2,cell.y+2,cell.w-4,cell.h-4,cell.core?'#929c88':'#b9b7a2');}const core=b.cells[4];c.strokeStyle='#66796b';c.lineWidth=3;c.strokeRect(core.x+2,core.y+2,core.w-4,core.h-4);}
 }
 drawPetrolGround(c,view);
 for(const g of yards){if(!visible(g))continue;if(g.customResidential){renderResidentialYard(c,g);continue;}R(g.x,g.y,g.w,g.h,'#90a679');L(g.x,g.y,g.x,g.y+g.h,'#d7cfb1',2);L(g.x+g.w,g.y,g.x+g.w,g.y+g.h,'#d7cfb1',2);const back=g.front==='north'?g.y+g.h:g.y;L(g.x,back,g.x+g.w,back,'#c5c5a6',3);const fy=g.front==='north'?g.y:g.y+g.h;L(g.x,fy,g.x+45,fy,'#e0d7b7',3);L(g.x+85,fy,g.x+g.w-52,fy,'#e0d7b7',3);const d=g.drive;R(d.x,d.y,d.w,d.h,'#b8b6a0');R(g.x+57,g.front==='north'?g.y:g.y+120,15,g.front==='north'?70:g.h-120,'#c8c1a5');}
 for(const l of lots){if(l.checkersStore||!visible(l))continue;R(l.x-2,l.y-2,l.w+4,l.h+4,'#c8c6ab');R(l.x,l.y,l.w,l.h,'#626e67');if(l.h>60){if(l.side==='north')R(l.x,l.entrance.y+69,l.w,l.y-l.entrance.y-69,'#626e67');else if(l.entrance.y>l.y+l.h)R(l.entrance.x-20,l.y+l.h,40,l.entrance.y-l.y-l.h-69,'#626e67');else R(l.entrance.x+69,l.entrance.y-23,l.x-l.entrance.x-69+8,46,'#626e67');for(let k=0;k<Math.floor(l.w/38);k++){L(l.x+k*38,l.y+4,l.x+k*38,l.y+63,'#e2dfbd99',1.4);L(l.x+k*38,l.y+63,l.x+k*38+35,l.y+63,'#e2dfbd99',1.4)}}T(l.name,l.x+l.w/2,l.y+l.h-13,7,'#e0e2c9');}
 for(const b of buildings)if(!b.checkersStore&&!b.shoppingCentre&&!b.churchBlock&&!b.schoolBlock&&!b.customResidential&&visible(b))renderBuilding(c,b);
 for(const b of schoolBlocks)if(visible(b,30))renderSchoolBlock(c,b);
 for(const b of churchBlocks)if(visible(b,30))renderChurchBlock(c,b);
 for(const b of shoppingCentres)if(visible(b,30))renderShoppingCentre(c,b);
 for(const b of cityBlocks)if(b.layout==='park'&&visible(b,30))renderCornerPark(c,b);
 for(const b of cityBlocks)if(b.type==='checkers'&&visible(b,45))renderCheckersStore(c,b);
 for(const b of cityBlocks){if(!visible(b))continue;for(const p of b.pools){R(p.x-3,p.y-3,p.w+6,p.h+6,'#d8cbaa');R(p.x,p.y,p.w,p.h,'#70b7b1');L(p.x+2,p.y+4,p.x+p.w-2,p.y+4,'#c4ddcb')}
 if(b.collect){const p=b.collect;R(p.x-30,p.y-28,60,56,'#138f7c88');c.strokeStyle='#56dfb8';c.lineWidth=2;c.strokeRect(p.x-30,p.y-28,60,56);T('SIXTY60',p.x,p.y-5,7,'#c0f5d9');T('COLLECT',p.x,p.y+8,7,'#c0f5d9');}}
 // Frontage numbers identify real delivery addresses, including side-facing shops.
 drawPetrolDetail(c,view);
 for(const a of addresses){if(!visible({x:a.x,y:a.y,w:1,h:1}))continue;const {x,y}=a;R(x-12,y-5,24,10,'#526f65');T(String(a.number),x,y+3,6,'#e5e4c9');}
 for(const t of trees)if(visible({x:t.x,y:t.y,w:t.r,h:t.r})){C(t.x+6,t.y+8,t.r+2,'#183c3330');C(t.x,t.y,t.r,'#456c4e');C(t.x-3,t.y-4,t.r*.76,'#64875a');}
 for(const p of streetProps)if(visible({x:p.x,y:p.y,w:8,h:28})){R(p.x,p.y,2,22,'#536d5b');R(p.x-3,p.y-1,9,4,'#d6cea1');}
 drawRoadsideBillboards(c,view);
 renderPerimeterPavement(c);
 const b=townBounds;L(b.left-2,b.top-2,b.right+2,b.top-2,'#52694a',4);L(b.left-2,b.bottom+2,b.right+2,b.bottom+2,'#52694a',4);L(b.left-2,b.top-2,b.left-2,b.bottom+2,'#52694a',4);L(b.right+2,b.top-2,b.right+2,b.bottom+2,'#52694a',4);
 for(let x=b.left;x<=b.right;x+=65){R(x,b.top-5,3,8,'#c4bda1');R(x,b.bottom-3,3,8,'#c4bda1')}for(let y=b.top;y<=b.bottom;y+=65){R(b.left-5,y,8,3,'#c4bda1');R(b.right-3,y,8,3,'#c4bda1')}
}
// A bounded tile cache avoids a huge, full-resolution canvas for the expanded map.
const sceneryTiles=new Map(),TILE=768,TILE_GUTTER=4;let townOverview=null,sceneryFrame=null;
function drawTown(view,overview=false){if(overview){if(!townOverview){townOverview=document.createElement('canvas');townOverview.width=Math.ceil(WORLD_W*.17);townOverview.height=Math.ceil(WORLD_H*.17);const c=townOverview.getContext('2d');c.scale(.17,.17);renderTown(c)}ctx.drawImage(townOverview,0,0,WORLD_W,WORLD_H);return}
 // Include neighbouring pixels, then stitch tiles at integer coordinates before
 // applying the camera's fractional translation and zoom to one continuous image.
 // Filtering individual tile edges can expose background or leave rounding lines.
 sceneryFrame??=document.createElement('canvas');const frameX=Math.floor(view.x),frameY=Math.floor(view.y),frameW=Math.ceil(view.w)+2,frameH=Math.ceil(view.h)+2;
 if(sceneryFrame.width!==frameW)sceneryFrame.width=frameW;if(sceneryFrame.height!==frameH)sceneryFrame.height=frameH;const frame=sceneryFrame.getContext('2d');frame.fillStyle='#9aab77';frame.fillRect(0,0,frameW,frameH);
 for(let ty=Math.floor(view.y/TILE);ty<=Math.floor((view.y+view.h)/TILE);ty++)for(let tx=Math.floor(view.x/TILE);tx<=Math.floor((view.x+view.w)/TILE);tx++){const key=tx+','+ty,x=tx*TILE-TILE_GUTTER,y=ty*TILE-TILE_GUTTER;let tile=sceneryTiles.get(key);if(!tile){tile=document.createElement('canvas');tile.width=tile.height=TILE+TILE_GUTTER*2;const c=tile.getContext('2d');c.translate(-x,-y);renderTown(c,{x,y,w:tile.width,h:tile.height});sceneryTiles.set(key,tile);if(sceneryTiles.size>24)sceneryTiles.delete(sceneryTiles.keys().next().value)}else{sceneryTiles.delete(key);sceneryTiles.set(key,tile)}frame.drawImage(tile,x-frameX,y-frameY)}
 ctx.drawImage(sceneryFrame,frameX,frameY);
}
function pickDelivery(){const pool=addresses.filter(a=>a.building!==order?.building&&!customers.some(p=>p.order.building===a.building));return {...pool[Math.floor(rand()*pool.length)],...newCustomerDetails()}}
function nearestStreetPoint(p){const candidates=verticalStreetRanges.filter(r=>p.y>=r.low&&p.y<=r.high).map(r=>r.x),x=closestRoad(p.x,candidates),y=closestRoad(p.y,ROAD_Y);return Math.abs(p.x-x)<Math.abs(p.y-y)?{x,y:p.y,vertical:true}:{x:p.x,y,vertical:false}}
function gpsRoute(){const t=target();if(!t){route=[];return}if(t===store&&inCollectionArea()){route=[{x:player.x,y:player.y}];return}const a=t.access||t,l=collectionPoint.lot;let source=nearestStreetPoint(player);const inLot=player.x>=l.x-24&&player.x<=l.x+l.w+12&&player.y>=l.y-20&&player.y<=l.y+l.h+12;
 route=[{x:player.x,y:player.y}];const mall=shoppingCentres.find(b=>player.x>=b.x&&player.x<=b.x+b.w&&player.y>=b.y&&player.y<=b.y+b.h+60);
 if(mall){route.push(...shoppingExitRoute(mall));if(t.shoppingCentre===mall){route.push({x:t.x,y:t.y});return}source={...mall.drive,vertical:false};route.push(source)}
 if(inLot){if(t===store){route.push({x:player.x,y:l.entrance.y},{x:t.x,y:l.entrance.y},{x:t.x,y:t.y});return}source={...l.entrance,vertical:true};route.push({x:player.x,y:source.y})}route.push(source);
 const vertical=source.vertical,av=verticalStreetRanges.some(r=>r.x===a.x&&a.y>=r.low&&a.y<=r.high);
 const validX=verticalStreetRanges.filter(r=>Math.min(source.y,a.y)>=r.low&&Math.max(source.y,a.y)<=r.high).map(r=>r.x);
 if(vertical&&av){const sr=verticalStreetRanges.find(r=>r.x===source.x),ar=verticalStreetRanges.find(r=>r.x===a.x);const cross=closestRoad(Math.max(sr.low,Math.min(sr.high,Math.max(ar.low,Math.min(ar.high,source.y)))),ROAD_Y);route.push({x:source.x,y:cross},{x:a.x,y:cross})}else if(vertical&&validX.includes(source.x))route.push({x:source.x,y:a.y});else if(!vertical&&av&&validX.includes(a.x))route.push({x:a.x,y:source.y});else{const cross=closestRoad(source.x,validX);if(vertical)route.push({x:source.x,y:closestRoad(source.y,ROAD_Y)});const sy=vertical?closestRoad(source.y,ROAD_Y):source.y;route.push({x:cross,y:sy},{x:cross,y:av?closestRoad(a.y,ROAD_Y):a.y});if(av)route.push({x:a.x,y:closestRoad(a.y,ROAD_Y)})}
 route.push(a);if(t.shoppingCentre){const b=t.shoppingCentre;route.push({x:b.drive.x,y:b.y+210},{x:t.x,y:t.y});return}if(t===store)route.push({x:t.x,y:a.y});route.push({x:t.x,y:t.y});}


function renderPerimeterPavement(c){
 const b=townBounds,k=27;c.fillStyle='#bfc1af';
 c.fillRect(b.left,b.top,b.right-b.left,k);c.fillRect(b.left,b.bottom-k,b.right-b.left,k);
 c.fillRect(b.left,b.top,k,b.bottom-b.top);c.fillRect(b.right-k,b.top,k,b.bottom-b.top);
 c.strokeStyle='#e3dfca';c.lineWidth=2;c.strokeRect(b.left+k,b.top+k,b.right-b.left-k*2,b.bottom-b.top-k*2);
}
// Exterior scenery uses fixed mathematical noise, preserving gameplay randomness.
function coastNoise(n){return (Math.sin(n*127.1+311.7)*43758.5453)%1+1-(Math.sin(n*127.1+311.7)*43758.5453>=0?1:0)}
function drawBoundaryScenery(c,v){
 const b=townBounds,poly=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};
 if(v.y<b.top){
  // Overlapping irregular contour bands fade the foothills into the grass.
  const left=Math.floor(v.x/32)*32-64,right=Math.ceil((v.x+v.w)/32)*32+64;
  for(let layer=0;layer<40;layer++){
   const points=[[left,Math.min(-2000,v.y-10)],[right,Math.min(-2000,v.y-10)]];
   for(let x=right;x>=left;x-=32)points.push([x,b.top-15+Math.sin(x*.006)*15+Math.sin(x*.017)*7-layer*4]);
   poly(points,'rgba(105,116,103,0.045)');
  }
  // Table Mountain's broad plateau, with flanking peaks and broken rock faces.
  const scale=WORLD_W/11340;
  const outline=[[-2000,170],[0,170],[1050,145],[1600,55],[2050,155],[2750,190],[3400,100],[4100,42],[7000,42],[7550,125],[8100,90],[8750,168],[9450,75],[10100,146],[11340,175],[13340,175]];
  poly([[-2000,-2000],[WORLD_W+2000,-2000],...outline.slice().reverse().map(([x,y])=>[x*scale,y])],'#718580');
  poly([...outline.map(([x,y])=>[x*scale,y]),[WORLD_W+2000,290],[WORLD_W,310],[10000*scale,280],[8700*scale,330],[7600*scale,275],[6500*scale,315],[4900*scale,290],[3600*scale,335],[2100*scale,285],[0,320],[-2000,290]],'#697467');
  poly([[4100*scale,42],[7000*scale,42],[7550*scale,125],[6800*scale,230],[6100*scale,194],[5100*scale,250],[4250*scale,180]],'#8d8e7b');
  for(let i=0;i<190;i++){const x=-1500+i*(WORLD_W+3000)/190,y=115+coastNoise(i+9)*180;if(x<v.x-80||x>v.x+v.w+80)continue;
   c.strokeStyle=i%3?'#465e5360':'#c2bda160';c.lineWidth=2+coastNoise(i+14)*4;c.beginPath();c.moveTo(x,y);c.lineTo(x-10-coastNoise(i+2)*25,y+30+coastNoise(i+5)*60);c.stroke();
  }
  for(let i=0;i<1100;i++){const x=-1500+coastNoise(i+2400)*(WORLD_W+3000),y=90+coastNoise(i+3000)*205,r=6+coastNoise(i+3500)*22;if(x+r<v.x||x-r>v.x+v.w)continue;
   poly([[x-r,y],[x-r*.3,y-r*.4],[x+r,y-r*.25],[x+r*.7,y+r*.45],[x-r*.65,y+r*.6]],'#455b4b50');
   poly([[x-r,y],[x-r*.3,y-r*.4],[x+r,y-r*.25],[x+r*.6,y+r*.14],[x-r*.7,y+r*.12]],i%3?'#8b8c756b':'#b0a58c60');
  }
  for(let i=0;i<330;i++){const x=-1500+coastNoise(i+500)*(WORLD_W+3000),y=295+coastNoise(i+800)*65;if(x<v.x-25||x>v.x+v.w+25)continue;c.fillStyle=i%3?'#59744d':'#9a9b72';c.beginPath();c.ellipse(x,y,5+coastNoise(i)*9,3+coastNoise(i+1)*5,0,0,Math.PI*2);c.fill();}
 }

 const sand=b.bottom+22,water=b.bottom+190;
 if(v.y+v.h>b.bottom){
  const left=Math.floor(v.x/24)*24-48,right=Math.ceil((v.x+v.w)/24)*24+48,bottom=Math.max(WORLD_H+2000,v.y+v.h+100);
  const coastFill=(offset,color)=>{const points=[[left,bottom],[right,bottom]];for(let x=right;x>=left;x-=24)points.push([x,sand+coastalBend(x)+Math.sin(x*.007)*13+offset]);poly(points,color)};
  for(let i=0;i<32;i++)coastFill(-20+i*1.4,'rgba(235,216,172,0.065)');
  coastFill(24,'#ebd8ac');
  const sea=(offset,color)=>{const pts=[[left,bottom],[right,bottom]];for(let x=right;x>=left;x-=24)pts.push([x,water+coastalBend(x)+Math.sin(x*.012)*7+offset]);poly(pts,color)};
  sea(40,'#459f9f');sea(90,'#328b98');sea(160,'#287d8c');
  for(let i=0;i<600;i++){const x=coastNoise(i+1200)*WORLD_W,y=sand+30+coastNoise(i+1900)*85;if(x<v.x||x>v.x+v.w)continue;c.fillStyle='#bfa67865';c.fillRect(x,y,2+coastNoise(i)*3,1.5);}
 }
 if(v.y+v.h>townBounds.bottom)drawBeachUmbrellas(c,v);
 drawSideWoodland(c,v);
}
function coastalBend(x){const b=townBounds,d=Math.max(0,b.left-x,x-b.right);return d*d/(d+180)*.3+14*Math.sin(x*.002)}
function drawCoastalWaves(c,v,time){
 const shore=townBounds.bottom+190;if(v.y+v.h<shore-50)return;
 const left=Math.floor(v.x/24)*24-24,right=Math.ceil((v.x+v.w)/24)*24+24,bottom=Math.max(WORLD_H+2000,v.y+v.h+100);
 for(let band=0;band<3;band++){
  const phase=time*.7-band*1.6,advance=Math.sin(phase)*18,base=shore+band*55+advance;
  if(band===0){c.beginPath();c.moveTo(left,bottom);for(let x=left;x<=right;x+=24)c.lineTo(x,base-24+coastalBend(x)+Math.sin(x*.012+time*.5)*7+Math.sin(x*.031)*3);c.lineTo(right,bottom);c.closePath();c.fillStyle='#b9b994';c.fill();}
  c.beginPath();c.moveTo(left,bottom);c.lineTo(left,base);
  for(let x=left;x<=right;x+=24)c.lineTo(x,base+coastalBend(x)+Math.sin(x*.012+time*.5+band)*7+Math.sin(x*.031-band)*3);
  c.lineTo(right,bottom);c.closePath();c.fillStyle=band?'#5cb8b31c':'#459f9f';c.fill();
  c.beginPath();for(let x=left;x<=right;x+=16){const y=base+coastalBend(x)+Math.sin(x*.012+time*.5+band)*7+Math.sin(x*.031-band)*3;x===left?c.moveTo(x,y):c.lineTo(x,y);}
  c.strokeStyle='rgba(233,249,228,'+(.3+.22*(.5+.5*Math.sin(phase)))+')';c.lineWidth=band?2:4;c.stroke();
 }
}

function drawBeachUmbrellas(c,v){
 const palettes=[['#df7868','#f4e5bc'],['#61a5b0','#eee0b7'],['#e2b74e','#f2e4bb'],['#9a7ba9','#efc6ac'],['#6aa57e','#eddfa9']];
 for(let i=0;i<18;i++){
  const x=townBounds.left+220+i*(townBounds.right-townBounds.left-440)/17+(coastNoise(i+90)-.5)*140;
  const y=townBounds.bottom+80+coastNoise(i+74)*48+coastalBend(x),r=12+coastNoise(i+79)*4,colors=palettes[i%5];
  if(x+r+40<v.x||x-r-12>v.x+v.w||y+r+25<v.y||y-r>v.y+v.h)continue;
  c.save();c.fillStyle='#5a766338';c.beginPath();c.ellipse(x+8,y+9,r+2,r*.75,0,0,Math.PI*2);c.fill();
  c.translate(x,y);c.rotate(coastNoise(i+95)*Math.PI);
  for(let k=0;k<8;k++){c.fillStyle=colors[k%2];c.beginPath();c.moveTo(0,0);c.arc(0,0,r,k*Math.PI/4,(k+1)*Math.PI/4);c.closePath();c.fill();}
  c.fillStyle='#f3ead1';c.beginPath();c.arc(0,0,1.8,0,Math.PI*2);c.fill();c.restore();
  c.fillStyle='#eee0bb';c.fillRect(x+r+5,y+3,8,21);c.fillStyle=colors[0];c.fillRect(x+r+6,y+7,6,3);
  if(i%3===0){c.fillStyle='#f2e4bf';c.fillRect(x+r+17,y+7,7,19);}
 }
}

// Preserve the near-road groves and continue the woodland past the world rectangle.
// Visible world-space cells keep placement stable across camera movement and tiles.
function drawSideWoodland(c,v){
 const b=townBounds;
  // Mixed groves along the green left and right margins, clear of the pavement.
 for(let side=0;side<2;side++)for(let i=0;i<230;i++){
  const x=side?b.right+40+coastNoise(i+70)*280:b.left-40-coastNoise(i+70)*280;
  const y=b.top+35+coastNoise(i+950)*(b.bottom-b.top-70),r=11+coastNoise(i+350)*15;
  if(x+r<v.x||x-r>v.x+v.w||y+r<v.y||y-r>v.y+v.h)continue;
  c.fillStyle='#284d3938';c.beginPath();c.ellipse(x+8,y+10,r+2,r,0,0,Math.PI*2);c.fill();
  c.fillStyle=i%3?'#4e754f':'#6f8956';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
  c.fillStyle='#87a168';c.beginPath();c.arc(x-r*.25,y-r*.3,r*.6,0,Math.PI*2);c.fill();
 }
 const size=74;
 for(let gy=Math.floor((v.y-44)/size);gy<=Math.ceil((v.y+v.h+44)/size);gy++)
 for(let gx=Math.floor((v.x-44)/size);gx<=Math.ceil((v.x+v.w+44)/size);gx++){
  const hash=gx*7919+gy*104729,noise=coastNoise(hash+4300);
  if(noise<.12)continue;
  const x=(gx+.18+coastNoise(hash+70)*.64)*size,y=(gy+.18+coastNoise(hash+950)*.64)*size;
  if(x>b.left-255&&x<b.right+255||y<b.top+30||y>b.bottom-30)continue;
  const r=13+coastNoise(hash+350)*14;
  c.fillStyle='#284d3938';c.beginPath();c.ellipse(x+8,y+10,r+2,r,0,0,Math.PI*2);c.fill();
  c.fillStyle=noise>.45?'#4e754f':'#6f8956';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
  c.fillStyle='#87a168';c.beginPath();c.arc(x-r*.25,y-r*.3,r*.6,0,Math.PI*2);c.fill();
 }
}
