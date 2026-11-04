// The opening screen owns focus and suspends the shift until Play.
const startScreen=$('startScreen'),playGame=$('playGame');
paused=true;
playGame.onclick=()=>{
 if(!document.body.classList.contains('at-start'))return;
 unlockAudio();
 document.body.classList.remove('at-start');
 startScreen.hidden=true;
 reset();
 last=performance.now();
 canvas.setAttribute('tabindex','-1');
 canvas.focus({preventScroll:true});
};
window.addEventListener('keydown',event=>{
 if(!document.body.classList.contains('at-start'))return;
 if(event.key==='Enter'||event.key===' '){event.preventDefault();playGame.click()}
 event.stopImmediatePropagation();
},true);
playGame.focus({preventScroll:true});
