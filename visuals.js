(()=>{
const ids=['rest','sleep','kind','focus','morning','night','body','commute','boundaries','exam','gratitude','reset','lonely','slow-night'];
function imageFor(p){const i=ids.indexOf(p.id);return CARD_IMAGES[i<0?(Number(p.art)||0):i]}
artStyle=function(p){return `background-image:url('${imageFor(p)}');background-size:cover;background-position:center`};
const selectBefore=select;select=function(p){selectBefore(p);if(p){$('#player-bg').style.backgroundImage=`linear-gradient(#27352544,#142511cc),url('${imageFor(p)}')`;$('#player-bg').style.backgroundSize='cover';$('#player-bg').style.backgroundPosition='center'}};
const front=$('.affirm-card');const deck=document.createElement('div');deck.className='affirm-deck';front.before(deck);deck.append(front);front.classList.add('deck-front');front.style.transform='';front.setAttribute('tabindex','0');front.setAttribute('role','group');front.setAttribute('aria-roledescription','可滑动心语卡片');front.setAttribute('aria-label','左右滑动切换心语，也可以使用下方按钮或左右方向键');
function backCard(cls){const c=document.createElement('div');c.className='affirm-card deck-back '+cls;c.setAttribute('aria-hidden','true');c.innerHTML='<span>TODAY’S LITTLE REMINDER</span><blockquote></blockquote><span>栖心 FLOW · 每日心语</span>';deck.prepend(c);return c}
const second=backCard('deck-second'),third=backCard('deck-third');
deck.insertAdjacentHTML('afterend','<div class="deck-caption"><span>← 左右滑动，收下一句温柔 →</span><span id="affirm-index" role="status" aria-live="polite"></span></div>');
let busy=false,pointer=null,startX=0,startY=0,startAt=0,dx=0,horizontal=false,finishTimer;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
function refreshDeck(){second.querySelector('blockquote').textContent=quotes[(qi+1)%quotes.length];third.querySelector('blockquote').textContent=quotes[(qi+2)%quotes.length];$('#affirm-index').textContent=(qi+1)+' / '+quotes.length;}
const renderBefore=render;render=function(){renderBefore();refreshDeck()};
function clearDrag(){front.classList.remove('dragging');front.style.removeProperty('transform');front.style.removeProperty('opacity');deck.classList.remove('deck-moving');dx=0;pointer=null;horizontal=false}
function swap(direction){if(busy)return;busy=true;front.classList.remove('dragging');deck.classList.add('deck-moving');const travel=Math.max(deck.offsetWidth*1.35,440);const sign=direction>0?-1:1;
const done=()=>{clearTimeout(finishTimer);front.removeEventListener('transitionend',onEnd);qi=(qi+direction+quotes.length)%quotes.length;front.classList.add('deck-reset');clearDrag();render();void front.offsetWidth;requestAnimationFrame(()=>front.classList.remove('deck-reset'));busy=false};
const onEnd=e=>{if(e.target===front&&e.propertyName==='transform')done()};if(reduce.matches){done();return}front.addEventListener('transitionend',onEnd);front.style.transform=`translate(${sign*travel}px,18px) rotate(${sign*14}deg)`;front.style.opacity='0';finishTimer=setTimeout(done,360)}
front.addEventListener('pointerdown',e=>{if(busy||e.button!==0)return;pointer=e.pointerId;startX=e.clientX;startY=e.clientY;startAt=performance.now();dx=0;horizontal=false});
front.addEventListener('pointermove',e=>{if(pointer!==e.pointerId||busy)return;const x=e.clientX-startX,y=e.clientY-startY;if(!horizontal){if(Math.abs(y)>12&&Math.abs(y)>Math.abs(x)){pointer=null;return}if(Math.abs(x)<8)return;horizontal=true;front.setPointerCapture(e.pointerId);front.classList.add('dragging');deck.classList.add('deck-moving')}dx=x;front.style.transform=`translate(${dx}px,${Math.abs(dx)*.035}px) rotate(${dx/22}deg)`;front.style.opacity=String(Math.max(.3,1-Math.abs(dx)/(deck.offsetWidth*1.7)))});
function release(e){if(pointer!==e.pointerId||busy)return;const speed=Math.abs(dx)/Math.max(1,performance.now()-startAt);const shouldSwap=horizontal&&(Math.abs(dx)>Math.max(55,deck.offsetWidth*.18)||(Math.abs(dx)>28&&speed>.5));const direction=dx<0?1:-1;pointer=null;if(front.hasPointerCapture(e.pointerId))front.releasePointerCapture(e.pointerId);if(shouldSwap)swap(direction);else clearDrag()}
front.addEventListener('pointerup',release);front.addEventListener('pointercancel',()=>{if(!busy)clearDrag()});front.addEventListener('lostpointercapture',e=>{if(e.target===front&&pointer!==null&&!busy)clearDrag()});front.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();swap(1)}if(e.key==='ArrowLeft'){e.preventDefault();swap(-1)}});
$('#next-affirm').onclick=()=>swap(1);$('#prev-affirm').onclick=()=>swap(-1);render();
})();
