/* ============================================================
   栖心 Flow · 探索页（连续单页 · 上滑吸顶）
   - 上半：探索总览（搜索 + 8 宫格 + 30天计划/声音花园 + 设备横幅）
   - 上滑：横向大分类 冥想/课程/备考/少儿 吸顶
   - 冥想：左侧 放松/呼吸/解压/助眠/专注 同步吸顶，右侧真实课卡
   - 课卡 → startSession（真实播放）；声音花园 → 混音台；30天 → 系列课
   - 底部：冥想 / 探索(高亮) / 同频 / 心语 / 我的
   ============================================================ */
(function(){
  const R = 'https://modestomckoan.github.io/roost/';
  const MAIN = '../index.html';

  /* ---------- 图标（栖心绿色线性 SVG） ---------- */
  const I = {
    home: '<path d="M4 11.5l8-6 8 6V19.5h-5v-5.5h-6v5.5H4z"/>',
    book: '<path d="M12 6.2c-2.4-1.2-4.6-1.4-7.6-.8v13.2c3-.6 5.2-.4 7.6.8M12 6.2c2.4-1.2 4.6-1.4 7.6-.8v13.2c-3-.6-5.2-.4-7.6.8M12 6.2v13.2"/>',
    people: '<circle cx="9" cy="8.6" r="3"/><path d="M3.6 19c.5-3.1 2.8-4.4 5.4-4.4s4.9 1.3 5.4 4.4"/><circle cx="16.4" cy="9" r="2.4"/><path d="M15.6 14.7c2 .3 3.7 1.5 4.1 3.9"/>',
    star: '<path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.5l-5.1 2.8 1-5.7-4.1-4 5.7-.8z"/>',
    user: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20c.2-3.7 3.2-5.4 7-5.4s6.8 1.7 7 5.4"/>',
    tomato: '<circle cx="12" cy="13.2" r="7.2"/><path d="M9.4 6.2c.4-1.4 1.3-2 2.6-2s2.2.6 2.6 2"/><path d="M12 9.6v3.6l2.3 1.5"/>',
    breath: '<circle cx="12" cy="12" r="8"/><path d="M10.2 8.8l4.8 3.2-4.8 3.2z" fill="currentColor" stroke="none"/>',
    ear: '<circle cx="9" cy="12" r="4.3"/><circle cx="15" cy="12" r="4.3"/>',
    wave: '<path d="M5 13.5a7 7 0 0 1 14 0"/><circle cx="7.4" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="11.2" r="1.1" fill="currentColor" stroke="none"/><circle cx="16.6" cy="12" r="1.1" fill="currentColor" stroke="none"/>',
    pen: '<path d="M4 20l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M13.5 7.5l3 3"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3.2v3.8M16 3.2v3.8"/>',
    box: '<path d="M3 8l2-3h14l2 3v11H3z"/><path d="M3 8h18M10 12.5h4"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    brain: '<path d="M3 14c3-7 5-7 8 0s4 6 7 0"/><circle cx="15.6" cy="11.6" r="1.4" fill="currentColor" stroke="none"/>',
    leaf: '<path d="M12 20v-8"/><path d="M12 12c-2.5 0-4.5-1.8-4.5-4.5C10.5 7.5 12 9 12 12z"/><path d="M12 12c2.5 0 4.5-1.8 4.5-4.5C13.5 7.5 12 9 12 12z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    cover: '<circle cx="32" cy="32" r="22" opacity=".42"/><circle cx="32" cy="32" r="12.5"/><circle cx="32" cy="32" r="3.4" fill="currentColor" stroke="none"/>'
  };
  function svg(p, box){ box = box || 24; return '<svg viewBox="0 0 '+box+' '+box+'" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }

  /* ---------- 主站 5 Tab（跨页跳回主站） ---------- */
  const DOCK = [
    { key:'home', label:'冥想', icon:I.home, go:'home' },
    { key:'explore', label:'探索', icon:I.book, current:true },
    { key:'community', label:'同频', icon:I.people, go:'community' },
    { key:'affirm', label:'心语', icon:I.star, go:'affirm' },
    { key:'me', label:'我的', icon:I.user, go:'me' }
  ];

  /* ---------- 横向 4 大分类 ---------- */
  const HTABS = [
    { key:'meditate', name:'冥想' },
    { key:'course', name:'课程' },
    { key:'exam', name:'备考' },
    { key:'kids', name:'少儿' }
  ];

  /* ---------- 冥想内 5 项（左竖栏） ---------- */
  const TABS = [
    { key:'relax', name:'放松', days:[7,20,27] },
    { key:'breath', name:'呼吸', days:[1,2,9] },
    { key:'relieve', name:'解压', days:[17,18,19] },
    { key:'sleep', name:'助眠', days:[6,11,14] },
    { key:'focus', name:'专注', days:[3,5,23] }
  ];

  function getProgram(){
    try { return (typeof PROGRAM!=='undefined' && Array.isArray(PROGRAM) && PROGRAM.length) ? PROGRAM : null; }
    catch(e){ return null; }
  }
  function toast(msg){
    let t=document.getElementById('qx-toast');
    if(!t){ t=document.createElement('div'); t.id='qx-toast'; t.className='qx-toast'; document.body.appendChild(t); }
    t.textContent=msg; t.classList.add('show');
    clearTimeout(t._tm); t._tm=setTimeout(()=>t.classList.remove('show'),1900);
  }
  function goMain(href){ window.location.href=href; }

  /* ---------- 顶部标题栏 ---------- */
  function appBar(){
    return '<div class="qx-appbar">' +
      '<button class="qx-icon-btn" data-main="'+MAIN+'#home" aria-label="返回主页">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<div class="ab-title">栖心 Flow · 诗意地栖居</div>' +
      '<button class="qx-icon-btn" data-share aria-label="分享">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h12.5M13 7l5 5-5 5"/><path d="M17 4.5c2.2 0 3 1.4 3 3s-.8 3-3 3"/></svg>' +
      '</button>' +
    '</div>';
  }

  /* ---------- 8 宫格（data-app 索引） ---------- */
  const APPS = [
    { label:'番茄钟', icon:I.tomato, act:'toast' },
    { label:'呼吸', icon:I.breath, act:'breath' },
    { label:'连耳机', icon:I.ear, act:'go:device' },
    { label:'白噪音', icon:I.wave, act:'go:sounds' },
    { label:'社区', icon:I.people, act:'tab:community' },
    { label:'日记', icon:I.pen, act:'toast' },
    { label:'课程', icon:I.calendar, act:'course' },
    { label:'档案', icon:I.box, act:'toast' }
  ];

  /* ---------- 课卡 ---------- */
  function coverSvg(){ return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">'+I.cover+'</svg>'; }
  function lessonCard(d){
    const min = (d && (d.dur || d.duration || d.minutes)) || 15;
    return (
      '<button class="qx-lc" data-day="'+d.day+'"><span class="lc-cover">'+coverSvg()+'</span>' +
      '<span class="lc-info"><span class="lc-title">Day '+d.day+' · '+d.title+'</span>' +
      '<span class="lc-meta">'+min+' 分钟 · 引导冥想</span>' +
      '<span class="lc-desc">跟随你的节奏</span></span></button>'
    );
  }
  function lessonListHtml(tabKey){
    const P = getProgram();
    const t = TABS.find(x=>x.key===tabKey) || TABS[0];
    if(!P) return '<div class="qx-load">课程加载中…</div>';
    return t.days.map(n=>P[n-1]).filter(Boolean).map(lessonCard).join('');
  }

  /* ---------- 空状态 ---------- */
  const EMPTY = {
    course: ['<path d="M12 5v16M12 5C8 2 3 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-2-7-1-10 1Z"/>', '系列课程', '正在精心编排，即将与你见面'],
    exam: ['<path d="M5 19V5h11l3 3v11H5z"/><path d="M8 8h7M8 12h7M8 16h5"/>', '备考专区', '考前专注与减压方案，正在准备中'],
    kids: ['<circle cx="12" cy="8" r="3.2"/><path d="M5 20c.2-3.7 3.2-5.4 7-5.4s6.8 1.7 7 5.4"/>', '少儿启蒙', '孩子的呼吸与情绪小课堂，敬请期待']
  };
  function emptyHtml(key){
    const e = EMPTY[key];
    return '<div class="qx-empty"><span class="e-ic">'+svg(e[0])+'</span><div class="e-t">'+e[1]+'</div><div class="e-s">'+e[2]+'</div></div>';
  }

  /* ---------- 连续页 HTML ---------- */
  function pageHtml(){
    const grid = APPS.map((a,i)=>
      '<button class="gi" data-app="'+i+'"><span class="gi-ic">'+svg(a.icon)+'</span><span class="gi-tx">'+a.label+'</span></button>'
    ).join('');
    const htabs = HTABS.map((h,i)=>'<button class="qx-ht'+(i===0?' on':'')+'" data-ht="'+h.key+'">'+h.name+'</button>').join('');
    const side = TABS.map((t,i)=>'<button class="qx-st'+(i===0?' on':'')+'" data-st="'+t.key+'">'+t.name+'</button>').join('');

    const panels =
      '<div class="qx-hpanel on" data-panel="meditate"><div class="qx-layout">' +
        '<aside class="qx-side">'+side+'</aside>' +
        '<div class="qx-lessons" id="qx-lessons">'+lessonListHtml('relax')+'</div>' +
      '</div></div>' +
      '<div class="qx-hpanel" data-panel="course">'+emptyHtml('course')+'</div>' +
      '<div class="qx-hpanel" data-panel="exam">'+emptyHtml('exam')+'</div>' +
      '<div class="qx-hpanel" data-panel="kids">'+emptyHtml('kids')+'</div>';

    return (
      '<div class="qx-page">'+appBar()+
        '<div class="qx-scroll">'+
          '<div class="qx-searchrow"><span class="qx-chev" data-ht-go="course">'+svg(I.chevron)+'</span>' +
            '<button class="qx-search-pill" data-ht-go="meditate"><span class="sp">'+svg(I.search)+'</span>搜索课程、声音…</button></div>' +
          '<div class="qx-grid">'+grid+'</div>' +
          '<div class="qx-banners">' +
            '<button class="qx-banner green" data-go="program"><span class="b-ic">'+svg(I.calendar)+'</span><div class="b-t">30 天计划</div><div class="b-s">循序渐进，每天一课</div></button>' +
            '<button class="qx-banner blue" data-go="sounds"><span class="b-ic">'+svg(I.leaf)+'</span><div class="b-t">声音花园</div><div class="b-s">自然声音，自由混音</div></button>' +
          '</div>' +
          '<button class="qx-device" data-go="device"><span class="db-ic">'+svg(I.brain)+'</span>' +
            '<span class="db-tx"><span class="db-t">连接设备，开启脑机之旅</span><span class="db-s">让冥想真正有效</span></span>' +
            '<span class="db-go">'+svg(I.chevron)+'</span></button>' +
          '<div class="qx-swipe-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V6M6 12l6-6 6 6"/></svg></div>' +
          '<nav class="qx-htabs">'+htabs+'</nav>' +
          '<div class="qx-panels">'+panels+'</div>' +
        '</div>'+
      '</div>'
    );
  }

  /* ---------- 底部 5 Dock ---------- */
  function buildChrome(){
    const oldTab = document.getElementById('tabbar');
    if(oldTab) oldTab.style.display='none';
    const oldSub = document.getElementById('qx-subtab');
    if(oldSub) oldSub.remove();
    if(document.getElementById('qx-dock')) return;
    const dock = document.createElement('nav');
    dock.id='qx-dock'; dock.className='qx-dock';
    dock.innerHTML = DOCK.map(d=>
      '<button class="di'+(d.current?' on':'')+'" data-dock-go="'+(d.go||'explore')+'"'+(d.current?' aria-current="page"':'')+'><span class="di-ic">'+svg(d.icon)+'</span><span class="dt">'+d.label+'</span></button>'
    ).join('');
    document.body.appendChild(dock);
  }

  /* ---------- 滚动到分类吸顶 ---------- */
  function scrollToTabs(){
    const tabs=document.querySelector('.qx-htabs');
    const sc=document.querySelector('.qx-scroll');
    if(!tabs || !sc) return;
    const d = tabs.getBoundingClientRect().top - sc.getBoundingClientRect().top;
    sc.scrollTop += d;
  }

  /* ---------- 选横向大分类 ---------- */
  function selectHtab(key, scroll){
    document.querySelectorAll('.qx-htabs .qx-ht').forEach(x=>x.classList.toggle('on', x.dataset.ht===key));
    document.querySelectorAll('.qx-hpanel').forEach(p=>p.classList.toggle('on', p.dataset.panel===key));
    if(scroll) scrollToTabs();
  }
  /* ---------- 选冥想左竖栏 ---------- */
  function selectStab(key){
    document.querySelectorAll('.qx-side .qx-st').forEach(x=>x.classList.toggle('on', x.dataset.st===key));
    const el=document.getElementById('qx-lessons');
    if(el) el.innerHTML=lessonListHtml(key);
  }

  /* ---------- 劫持 go()：全部页内切换，无跨文档跳转 ---------- */
  const p0 = go;
  const MAIN_TABS = ['home','explore','community','affirm','me'];
  function setDockActive(key){
    document.querySelectorAll('#qx-dock .di').forEach(b=>
      b.classList.toggle('on', b.dataset.dockGo===key));
  }
  go = function(name){
    const dock = document.getElementById('qx-dock');
    if(dock) dock.classList.toggle('hidden', name==='session');
    if(name==='explore'){
      p0('explore'); setDockActive('explore'); return;
    }
    if(name==='courses'){
      p0('explore'); setDockActive('explore');
      selectHtab('meditate', true); return;
    }
    p0(name);
    if(MAIN_TABS.includes(name)) setDockActive(name);
    if(name==='affirm') renderAffirm();
    if(name==='me') renderMe();
    if(name==='community') renderCommunity();
  };

  /* ---------- 点击代理 ---------- */
  document.addEventListener('click', function(e){
    const dockGoBtn = e.target.closest('#qx-dock [data-dock-go]');
    if(dockGoBtn){ go(dockGoBtn.dataset.dockGo); return; }
    const mainBtn = e.target.closest('[data-main]');
    if(mainBtn){ goMain(mainBtn.dataset.main); return; }
    const shareBtn = e.target.closest('[data-share]');
    if(shareBtn){
      const u=window.location.href;
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(u).then(()=>toast('链接已复制，去分享给同伴吧')).catch(()=>toast('复制链接：'+u)); }
      else toast('复制链接：'+u);
      return;
    }
    const htgo = e.target.closest('[data-ht-go]');
    if(htgo){ selectHtab(htgo.dataset.htGo, true); return; }
    const ht = e.target.closest('.qx-htabs [data-ht]');
    if(ht){ selectHtab(ht.dataset.ht, true); return; }
    const st = e.target.closest('.qx-side [data-st]');
    if(st){ selectStab(st.dataset.st); return; }
    const day = e.target.closest('.qx-lessons [data-day]');
    if(day){
      const n = Number(day.dataset.day);
      if(typeof startSession==='function') startSession(n);
      else if(typeof startLesson==='function') startLesson(n);
      else toast('请稍候，课程正在加载');
      return;
    }
    const goBtn = e.target.closest('[data-go]');
    if(goBtn){ p0(goBtn.dataset.go); return; }
    const app = e.target.closest('[data-app]');
    if(app){
      const a = APPS[Number(app.dataset.app)];
      if(!a) return;
      if(a.act==='toast') toast(a.label+'即将上线，先从一次呼吸开始');
      else if(a.act==='breath'){ selectHtab('meditate',true); selectStab('breath'); }
      else if(a.act==='course'){ selectHtab('course',true); }
      else if(a.act.indexOf('go:')===0){ p0(a.act.slice(3)); }
      else if(a.act.indexOf('tab:')===0){ go(a.act.slice(4)); }
      return;
    }
  });

  /* ============================================================
     额外页：心语 / 我的 / 同频（同一文档内 view，无跳转）
     ============================================================ */
  let afIdx = 0;
  try { afIdx = (typeof dayOfYear==='function') ? dayOfYear() : 0; } catch(e){ afIdx=0; }

  function extraViewsHtml(){
    const affirm =
      '<section class="view" id="view-affirm"><div class="pad">' +
        '<div class="brand">栖心 Flow · 每日心语</div>' +
        '<h1 class="page-title serif">收下一句温柔的话</h1>' +
        '<p class="intro">每天一句，像呼吸一样轻轻提醒。</p>' +
        '<div class="af-card"><span class="af-qm">“</span>' +
          '<blockquote class="af-text" id="afText"></blockquote>' +
          '<div class="af-date" id="afDate"></div></div>' +
        '<div class="af-actions">' +
          '<button class="af-ghost" id="afPrev">上一句</button>' +
          '<button class="cta" id="afCopy">复制这句</button>' +
          '<button class="af-ghost" id="afNext">下一句</button>' +
        '</div>' +
      '</div></section>';

    const me =
      '<section class="view" id="view-me"><div class="pad">' +
        '<div class="brand">栖心 Flow · 我的</div>' +
        '<h1 class="page-title serif">你的练习，都被温柔记得</h1>' +
        '<div class="me-stats">' +
          '<div class="me-stat"><b id="meStatDone">0</b><span>已完成 / 天</span></div>' +
          '<div class="me-stat"><b id="meStatStreak">0</b><span>连续天数</span></div>' +
          '<div class="me-stat"><b id="meStatMin">0</b><span>累计分钟</span></div>' +
        '</div>' +
        '<div class="me-list">' +
          '<button class="me-item" id="meArchive">舒适档案<span class="me-arrow">›</span></button>' +
          '<button class="me-item" id="meProgram">全部课程<span class="me-arrow">›</span></button>' +
          '<button class="me-item" id="meDevice">设备与耳机<span class="me-arrow">›</span></button>' +
          '<button class="me-item danger" id="meClear">清除本机记录<span class="me-arrow">›</span></button>' +
        '</div>' +
        '<p class="me-note">记录仅保存在本机浏览器，不会跨设备同步。</p>' +
      '</div></section>';

    const community =
      '<section class="view" id="view-community"><div class="pad">' +
        '<div class="brand">栖心 Flow · 同频</div>' +
        '<h1 class="page-title serif">和同频的人，一起安静</h1>' +
        '<div class="cm-now">' +
          '<span class="cm-pulse"><span></span></span>' +
          '<div class="cm-now-tx"><b id="cmCount">—</b><p>人正在此刻，与你一起呼吸</p></div>' +
        '</div>' +
        '<button class="cta cm-join" id="cmJoin">加入此刻共修</button>' +
        '<div class="cm-section">同频动态</div>' +
        '<div class="cm-feed" id="cmFeed"></div>' +
        '<p class="cm-note">完整社区正在精心搭建，敬请期待。</p>' +
      '</div></section>';

    return affirm + me + community;
  }

  function addExtraViews(){
    if(document.getElementById('view-affirm')) return;
    const wrap=document.createElement('div');
    wrap.innerHTML=extraViewsHtml();
    const tabbar=document.getElementById('tabbar');
    while(wrap.firstChild){
      const node=wrap.firstChild;
      if(tabbar && tabbar.parentNode) tabbar.parentNode.insertBefore(node,tabbar);
      else document.body.appendChild(node);
    }
    bindExtra();
  }

  function getDAILY(){ try { return (typeof DAILY!=='undefined' && DAILY.length) ? DAILY : []; } catch(e){ return []; } }

  function renderAffirm(){
    const arr=getDAILY(), el=document.getElementById('afText');
    if(!el) return;
    if(!arr.length){ el.textContent='心语正在准备中'; return; }
    afIdx=((afIdx%arr.length)+arr.length)%arr.length;
    el.textContent=arr[afIdx];
    const d=new Date();
    document.getElementById('afDate').textContent=(d.getMonth()+1)+'月'+d.getDate()+'日 · 第'+(afIdx+1)+'句';
  }

  function calcStreak(){
    let s=0,cursor=new Date();
    for(let i=0;i<365;i++){
      const key=cursor.toDateString();
      const has=Object.values(state.done||{}).some(ts=>new Date(ts).toDateString()===key);
      if(has) s++; else if(i>0) break;
      cursor.setDate(cursor.getDate()-1);
    }
    return s;
  }

  function renderMe(){
    const el=document.getElementById('meStatDone'); if(!el) return;
    const done=Object.keys(state.done||{});
    el.textContent=done.length;
    document.getElementById('meStatStreak').textContent=calcStreak();
    const P=getProgram()||[];
    document.getElementById('meStatMin').textContent=
      done.reduce((sum,dd)=>sum+(P[dd-1]?P[dd-1].dur:0),0);
  }

  function renderCommunity(){
    const d=new Date();
    const seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
    const n=120+(seed%480);
    const c=document.getElementById('cmCount'); if(!c) return;
    c.textContent=n;
    const feed=[
      '有人刚刚完成了「一口气的来去」',
      '一位同学正在练习「用双手感受当下」',
      '今晚有许多人选择了「睡前安住」',
      '有人在声音花园里留住了雨声'
    ];
    document.getElementById('cmFeed').innerHTML=feed.map(t=>
      '<div class="cm-feed-item"><span class="cm-dot"></span><span>'+t+'</span></div>').join('');
  }

  function bindExtra(){
    document.getElementById('afPrev').onclick=function(){ afIdx--; renderAffirm(); };
    document.getElementById('afNext').onclick=function(){ afIdx++; renderAffirm(); };
    document.getElementById('afCopy').onclick=function(){
      const arr=getDAILY();
      const t=arr.length?arr[((afIdx%arr.length)+arr.length)%arr.length]:'';
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(()=>toast('已复制这一句')).catch(()=>toast(t)); }
      else toast(t);
    };
    document.getElementById('meArchive').onclick=function(){ go('archive'); };
    document.getElementById('meProgram').onclick=function(){ go('program'); };
    document.getElementById('meDevice').onclick=function(){ go('device'); };
    document.getElementById('meClear').onclick=function(){
      if(confirm('确定清除本机全部练习记录？此操作无法恢复。')){
        try{
          state.done={}; state.anchors=[]; state.scores={};
          ['calm_done','calm_anchors','calm_scores','roost_logs'].forEach(k=>localStorage.removeItem(k));
          save();
        }catch(e){}
        renderMe(); toast('本机记录已清除');
      }
    };
    document.getElementById('cmJoin').onclick=function(){
      try{
        const P=getProgram();
        let day=1;
        if(P){ for(let i=0;i<P.length;i++){ if(!state.done[P[i].day]){ day=P[i].day; break; } } }
        startSession(day);
      }catch(e){ toast('共修即将开始'); }
    };
  }

  /* ---------- 插入连续页视图 ---------- */
  function insertView(){
    if(document.getElementById('view-explore')) return;
    const sec=document.createElement('section');
    sec.className='view'; sec.id='view-explore';
    sec.innerHTML=pageHtml();
    const tabbar=document.getElementById('tabbar');
    if(tabbar && tabbar.parentNode) tabbar.parentNode.insertBefore(sec,tabbar);
    else document.body.appendChild(sec);
  }

  /* ---------- 启动：跳过问卷，立即进连续页 ---------- */
  function showNow(){
    try{
      const onb=document.getElementById('view-onb');
      if(onb) onb.remove();
      localStorage.setItem('calm_onboarded','1');
    }catch(e){}
    buildChrome();
    addExtraViews();
    insertView();
    go('explore');
  }

  /* 课程数据就绪后刷新课卡 */
  function refreshLessons(){
    const on=document.querySelector('.qx-side .qx-st.on');
    selectStab(on?on.dataset.st:'relax');
  }
  function loadProgram(){
    if(getProgram()) return Promise.resolve();
    return fetch(R+'index.html')
      .then(r=>r.text())
      .then(html=>{
        const m=html.match(/const PROGRAM\s*=\s*(\[[\s\S]*?\]);/);
        if(!m) throw new Error('未找到课程数据');
        PROGRAM=JSON.parse(m[1]);
        if(typeof loadProgramData==='function'){ try{ loadProgramData(); }catch(e){} }
      })
      .then(()=>refreshLessons())
      .catch(err=>{ console.error('PROGRAM 加载失败', err); });
  }

  function boot(){
    showNow();
    setTimeout(function(){ loadProgram(); }, 500);
  }

  /* ---------- 移除 roost 悬浮球 ---------- */
  function removeOrb(){
    document.querySelectorAll('body *').forEach(el=>{
      if(el.id==='tabbar' || el.closest('#tabbar')) return;
      if(el.children.length===0 && el.textContent.trim()==='🍃'){
        const s=getComputedStyle(el);
        if(s.position==='fixed' && parseInt(s.zIndex)>900) el.remove();
      }
    });
  }
  new MutationObserver(()=>removeOrb()).observe(document.body,{childList:true,subtree:true});

  let _ref=0;
  const _refTimer=setInterval(()=>{
    if(getProgram()){ refreshLessons(); clearInterval(_refTimer); }
    else if(++_ref>40) clearInterval(_refTimer);
  },1000);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
