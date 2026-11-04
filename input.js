// Pointer IDs keep each thumb independent; keyboard and touch share the same game.
const joystick={pointer:null,x:0,y:0};
const keyboardHeld=new Set(),touchHeld=new Map();
function usingTouchLayout(){return innerWidth<=900||!!window.matchMedia?.('(pointer: coarse)').matches}
function isPortraitBlocked(){return usingTouchLayout()&&innerHeight>innerWidth}
function syncDrivingKey(key){keys[key]=keyboardHeld.has(key)||Array.from(touchHeld.values()).some(p=>p.key===key)}
function syncTouchButtons(){document.querySelectorAll('[data-drive]').forEach(b=>b.classList.toggle('held',Array.from(touchHeld.values()).some(p=>p.button===b)))}
function releaseDrivingPointer(id){const held=touchHeld.get(id);if(!held)return;touchHeld.delete(id);syncDrivingKey(held.key);syncTouchButtons()}
function resetJoystick(){joystick.pointer=null;joystick.x=joystick.y=0;const knob=$("joystickKnob");if(knob?.style)knob.style.transform="translate(0px,0px)"}
function moveJoystick(event){if(event.pointerId!==joystick.pointer)return;event.preventDefault();const rect=$("driveJoystick").getBoundingClientRect(),radius=rect.width*.32;let x=(event.clientX-rect.left-rect.width/2)/radius,y=(event.clientY-rect.top-rect.height/2)/radius;const length=Math.hypot(x,y);if(length>1){x/=length;y/=length}const dead=.16;joystick.x=Math.abs(x)>dead?(Math.abs(x)-dead)/(1-dead)*Math.sign(x):0;joystick.y=Math.abs(y)>dead?(Math.abs(y)-dead)/(1-dead)*Math.sign(y):0;$("joystickKnob").style.transform=`translate(${x*radius}px,${y*radius}px)`}
function clearDrivingInput(){resetJoystick();keyboardHeld.clear();touchHeld.clear();keys={};syncTouchButtons()}
function pressDrivingPointer(event,button){event.preventDefault();if(paused||isPortraitBlocked()||fuelRecovery>0)return;if(touchHeld.has(event.pointerId))releaseDrivingPointer(event.pointerId);touchHeld.set(event.pointerId,{key:button.dataset.drive,button});syncDrivingKey(button.dataset.drive);syncTouchButtons();try{button.setPointerCapture(event.pointerId)}catch{releaseDrivingPointer(event.pointerId)}}
function fitPhoneMap(){const map=$('gpsMap'),rect=map?.getBoundingClientRect?.();if(!rect||rect.width<1||rect.height<1)return;const width=Math.round(rect.width*2),height=Math.round(rect.height*2);if(map.width!==width)map.width=width;if(map.height!==height)map.height=height}
function setPhoneExpanded(open){document.documentElement?.classList.toggle('phone-expanded',open);$('phoneToggle').ariaExpanded=String(open);$('phoneToggle').ariaLabel=open?'Minimise delivery phone':'Expand delivery phone';if(open)clearDrivingInput();fitPhoneMap()}
function togglePhone(){setPhoneExpanded(!document.documentElement?.classList.contains('phone-expanded'))}
function toggleMap(){fullMap=!fullMap;$('mapTouch').ariaPressed=String(fullMap)}
function updateTouchAction(){const label=state==='call'?'Accept':'Phone';if(!$('touchActionLabel'))return;$('touchActionLabel').textContent=label;$('touchAction').ariaLabel=label==='Phone'?'Open delivery phone':label+' order';$('touchAction').classList.toggle('action-ready',state==='call')}
function applyInputLayout(){const blocked=isPortraitBlocked();$('rotatePrompt').classList.toggle('hidden',!blocked);if(blocked)clearDrivingInput();const root=document.documentElement;if(root){root.classList.toggle('touch-layout',usingTouchLayout());root.style.setProperty('--game-height',innerHeight+'px')}if(!usingTouchLayout())setPhoneExpanded(false);if($('fullscreenTouch'))$('fullscreenTouch').hidden=!document.documentElement?.requestFullscreen;updateTouchAction();fitPhoneMap()}
async function toggleFullscreen(){clearDrivingInput();try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement?.requestFullscreen)await document.documentElement.requestFullscreen()}catch{toast('Full screen is unavailable in this browser.')}}
function initialiseInput(){
 window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(isPortraitBlocked()||fuelRecovery>0){e.preventDefault();return}if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key))e.preventDefault();keyboardHeld.add(key);syncDrivingKey(key);if(e.repeat)return;if(key==='e')interact();if(key==='m')toggleMap();if(key==='p'||key==='escape')togglePause()});
 window.addEventListener('keyup',e=>{const key=e.key.toLowerCase();keyboardHeld.delete(key);syncDrivingKey(key)});
 window.addEventListener('blur',()=>{clearDrivingInput();if(!paused)togglePause()});
 document.addEventListener?.('visibilitychange',()=>{if(document.hidden){clearDrivingInput();if(!paused)togglePause()}});
 window.addEventListener('orientationchange',clearDrivingInput);
 document.querySelectorAll('[data-drive]').forEach(button=>{button.onpointerdown=e=>pressDrivingPointer(e,button);button.onpointerup=button.onpointercancel=button.onlostpointercapture=e=>releaseDrivingPointer(e.pointerId);button.oncontextmenu=e=>e.preventDefault()});
 const stick=$('driveJoystick');if(stick){stick.onpointerdown=e=>{e.preventDefault();if(paused||isPortraitBlocked()||fuelRecovery>0||joystick.pointer!==null)return;joystick.pointer=e.pointerId;try{stick.setPointerCapture(e.pointerId)}catch{resetJoystick();return}moveJoystick(e)};stick.onpointermove=moveJoystick;stick.onpointerup=stick.onpointercancel=stick.onlostpointercapture=e=>{if(e.pointerId===joystick.pointer)resetJoystick()};stick.oncontextmenu=e=>e.preventDefault()}
 // Safety net for releases outside a button or browser-managed cancellation.
 window.addEventListener('pointerup',e=>releaseDrivingPointer(e.pointerId));window.addEventListener('pointercancel',e=>releaseDrivingPointer(e.pointerId));
 if($('touchAction'))$('touchAction').onclick=()=>{if(paused)return;if(state==='roam'||state==='delivery'||state==='pickup')togglePhone();else interact()};if($('mapTouch'))$('mapTouch').onclick=()=>{clearDrivingInput();toggleMap()};if($('fullscreenTouch'))$('fullscreenTouch').onclick=toggleFullscreen;
 $('phoneToggle').onclick=togglePhone;$('phoneShade').onclick=()=>setPhoneExpanded(false);
}
