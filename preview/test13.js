function renderLessons(key){
  document.getElementById('lessons').innerHTML=MAP[key].map(function(d){
    var info=P[d];
    return '<div class="lc"><span class="cv">'+cover()+'</span><span class="ci"><span class="ct2">Day '+d+' · '+info[0]+'</span><span class="cm">'+info[1]+' 分钟 · 引导冥想</span><span class="cd">'+NAMES[key]+' · 跟随你的节奏</span></span></div>';
  }).join('');
}