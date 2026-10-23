const P={
1:["在这里安顿",15],2:["一口气的来去",15],3:["用双手感受当下",15],4:["听见整个身体",15],5:["走神之后再回来",15],6:["给紧绷留一点空间",15],7:["第一周的小小归处",15],
8:["脚下的稳定",16],9:["胸腹之间的呼吸",16],10:["肩颈的分寸",16],11:["声音与安静之间",16],12:["边界与舒适距离",16],13:["微小动作的觉察",16],14:["身体是可返回的地方",16],
15:["给情绪一个名字",18],16:["念头只是正在发生",18],17:["疲惫时减少要求",18],18:["与轻微烦躁共处",18],19:["为担心留一个位置",18],20:["对自己说话的方式",18],21:["情绪来时的三个步骤",18],
22:["把觉察打开一点",20],23:["把停顿带进日常",20],24:["听与回应之间",20],25:["从容地开始一件事",20],26:["为变化保留弹性",20],27:["让关怀向外延伸",20],28:["属于你的练习组合",20],29:["回望而不打分",20],30:["带着觉察继续生活",20]
};

const MAP={relax:[7,20,27],breath:[1,2,9],relieve:[17,18,19],sleep:[6,11,14],focus:[3,5,23]};
const NAMES={relax:"放松",breath:"呼吸",relieve:"解压",sleep:"助眠",focus:"专注"};

const APPS=[
["番茄钟",'<circle cx="12" cy="13.2" r="7.2"/><path d="M9.4 6.2c.4-1.4 1.3-2 2.6-2s2.2.6 2.6 2M12 9.6v3.6l2.3 1.5"/>'],
["呼吸",'<circle cx="12" cy="12" r="8"/><path d="M10.2 8.8l4.8 3.2-4.8 3.2z" fill="currentColor" stroke="none"/>'],
["连耳机",'<circle cx="9" cy="12" r="4.3"/><circle cx="15" cy="12" r="4.3"/>'],
["白噪音",'<path d="M5 13.5a7 7 0 0 1 14 0"/><circle cx="7.4" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="11.2" r="1.1" fill="currentColor" stroke="none"/><circle cx="16.6" cy="12" r="1.1" fill="currentColor" stroke="none"/>'],
["社区",'<circle cx="9" cy="8.6" r="3"/><path d="M3.6 19c.5-3.1 2.8-4.4 5.4-4.4s4.9 1.3 5.4 4.4"/><circle cx="16.4" cy="9" r="2.4"/><path d="M15.6 14.7c2 .3 3.7 1.5 4.1 3.9"/>'],
["日记",'<path d="M4 20l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M13.5 7.5l3 3"/>'],
["课程",'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3.2v3.8M16 3.2v3.8"/>'],
["档案",'<path d="M3 8l2-3h14l2 3v11H3z"/><path d="M3 8h18M10 12.5h4"/>']
];
function svg(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
document.getElementById('grid').innerHTML=APPS.map(function(a){
  return '<div class="gi"><span class="ic">'+svg(a[1])+'</span><span class="tx">'+a[0]+'</span></div>';
}).join('');

function cover(){return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="32" cy="32" r="22" opacity=".42"/><circle cx="32" cy="32" r="12.5"/><circle cx="32" cy="32" r="3.4" fill="currentColor" stroke="none"/></svg>';}
function renderLessons(key){
  document.getElementById('lessons').innerHTML=MAP[key].map(function(d){
    var info=P[d];
    return '<div class="lc"><span class="cv">'+cover()+'</span><span class="ci"><span class="ct2">Day '+d+' · '+info[0]+'</span><span class="cm">'+info[1]+' 分钟 · 引导冥想</span><span class="cd">'+NAMES[key]+' · 跟随你的节奏</span></span></div>';
  }).join('');
}
renderLessons('relax');

var badge=document.getElementById('badge');
function badgeShow(t){badge.textContent=t;badge.classList.add('show');clearTimeout(badge._t);badge._t=setTimeout(function(){badge.classList.remove('show');},1400);}
document.querySelectorAll('.htabs .ht').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('.htabs .ht').forEach(function(x){x.classList.remove('on');});
    b.classList.add('on');
    var k=b.dataset.ht;
    document.querySelectorAll('.hpanel').forEach(function(p2){p2.classList.remove('on');});
    document.getElementById('p-'+k).classList.add('on');
  });
});

document.querySelectorAll('#side .st').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('#side .st').forEach(function(x){x.classList.remove('on');});
    b.classList.add('on');
    renderLessons(b.dataset.st);
  });
});

document.querySelectorAll('.gi,.banner,.device-banner,.search-pill').forEach(function(el){
  el.addEventListener('click',function(){badgeShow('预览演示，落地后接入对应功能');});
});
