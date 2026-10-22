(()=>{
const ids=['rest','sleep','kind','focus','morning','night','body','commute','boundaries','exam','gratitude','reset','lonely','slow-night'];
function imageFor(p){const i=ids.indexOf(p.id);return CARD_IMAGES[i<0?(Number(p.art)||0):i]}
artStyle=function(p){return `background-image:url('${imageFor(p)}');background-size:cover;background-position:center`};
const selectBefore=select;select=function(p){selectBefore(p);if(p){$('#player-bg').style.backgroundImage=`linear-gradient(#27352544,#142511cc),url('${imageFor(p)}')`;$('#player-bg').style.backgroundSize='cover';$('#player-bg').style.backgroundPosition='center'}};
})();
