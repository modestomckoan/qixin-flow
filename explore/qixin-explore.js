/* ============================================================
   栖心 Flow · 探索页（集成进主站的"探索"Tab）
   - 视觉/导航严格对齐《冥想资源库效果图》确认版
   - 底部：冥想 / 探索(高亮) / 同频 / 心语 / 我的（栖心主站 5 Tab）
   - 内部子 tab：探索 / 课程 / 声音 / 场景
   - 30 天课程、声音花园、播放复用 roost 内核（真实可播）
   ============================================================ */
(function(){
  const R = 'https://modestomckoan.github.io/roost/';

  /* ---------- 图标（与效果图一致的栖心绿色线性 SVG） ---------- */
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
  const MAIN = '../index.html';
  const DOCK = [
    { key:'home', label:'冥想', icon:I.home, href:MAIN+'#home' },
    { key:'explore', label:'探索', icon:I.book, current:true },
    { key:'community', label:'同频', icon:I.people, href:MAIN+'#community' },
    { key:'affirm', label:'心语', icon:I.star, href:MAIN+'#affirm' },
    { key:'me', label:'我的', icon:I.user, href:MAIN+'#me' }
  ];
  /* ---------- 探索内部 子 tab ---------- */
  const SUB = [
    { key:'explore', label:'探索' },
    { key:'courses', label:'课程' },
    { key:'sounds', label:'声音' },
    { key:'modes', label:'场景' }
  ];

  /* ---------- 5 个方向（与效果图一致，无系列课标签） ---------- */
  const CATS = [
    { key:'self',  name:'自我关怀', days:[7,20,27] },
    { key:'sleep', name:'睡前安心', days:[6,8,11] },
    { key:'focus', name:'找回专注', days:[3,23,5] },
    { key:'stress',name:'减轻压力', days:[17,18,19] },
    { key:'grow',  name:'慢慢成长', days:[22,28,30] }
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

  /* ---------- 顶部标题栏（与效果图一致） ---------- */
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

  /* ---------- 探索总览（屏一） ---------- */
  const APPS = [
    { label:'番茄钟', icon:I.tomato, action:()=>toast('番茄钟即将上线，先从一次呼吸开始') },
    { label:'呼吸', icon:I.breath, action:()=>go('modes') },
    { label:'连耳机', icon:I.ear, action:()=>go('device') },
    { label:'白噪音', icon:I.wave, action:()=>go('sounds') },
    { label:'社区', icon:I.people, action:()=>goMain(MAIN+'#community') },
    { label:'日记', icon:I.pen, action:()=>go('archive') },
    { label:'课程', icon:I.calendar, action:()=>go('courses') },
    { label:'档案', icon:I.box, action:()=>go('planner') }
  ];

  function exploreHtml(){
    const grid = APPS.map((a,i)=>
      '<button class="gi" data-app="'+i+'"><span class="gi-ic">'+svg(a.icon)+'</span><span class="gi-tx">'+a.label+'</span></button>'
    ).join('');
    return (
      '<div class="qx-explore-page">' + appBar() +
        '<div class="qx-searchrow"><span class="qx-chev" data-go="courses">'+svg(I.chevron)+'</span>' +
          '<button class="qx-search-pill" data-go="sounds"><span class="sp">'+svg(I.search)+'</span>搜索课程、声音…</button>' +
        '</div>' +
        '<div class="grid10">'+grid+'</div>' +
        '<div class="banners">' +
          '<button class="banner green" data-go="program"><span class="b-ic">'+svg(I.calendar)+'</span><div class="b-t">30 天计划</div><div class="b-s">循序渐进，每天一课</div></button>' +
          '<button class="banner blue" data-go="sounds"><span class="b-ic">'+svg(I.leaf)+'</span><div class="b-t">声音花园</div><div class="b-s">自然声音，自由混音</div></button>' +
        '</div>' +
        '<button class="device-banner" data-go="device"><span class="db-ic">'+svg(I.brain)+'</span>' +
          '<span class="db-tx"><span class="db-t">连接设备，开启脑机之旅</span><span class="db-s">让冥想真正有效</span></span>' +
          '<span class="db-go">'+svg(I.chevron)+'</span></button>' +
      '</div>'
    );
  }

  /* ---------- 课程列表（屏二）：左 5 分类 + 右封面课卡 ---------- */
  function coverSvg(){ return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2">'+I.cover+'</svg>'; }
  function lessonCard(d){
    const min = (d && (d.dur || d.duration || d.minutes)) || 15;
    return (
      '<button class="course" data-day="'+d.day+'"><span class="cover">'+coverSvg()+'</span>' +
      '<span class="cinfo"><span class="c-title">Day '+d.day+' · '+d.title+'</span>' +
      '<span class="c-meta">'+min+' 分钟 · 身体扫描</span>' +
      '<span class="c-desc">舒适节律 · 可随时改自然呼吸</span></span></button>'
    );
  }
  function courseListHtml(catKey){
    const P = getProgram();
    const c = CATS.find(x=>x.key===catKey) || CATS[0];
    if(!P) return '<div class="qx-load">课程加载中…</div>';
    return c.days.map(n=>P[n-1]).filter(Boolean).map(lessonCard).join('');
  }
  function coursesHtml(){
    const rail = CATS.map((c,i)=>'<button class="cat'+(i===0?' on':'')+'" data-cat="'+c.key+'">'+c.name+'</button>').join('');
    return appBar() + '<div class="qx-courses-page"><div class="cats" id="qx-cats">'+rail+'</div>' +
      '<div class="courses" id="qx-course-list">'+courseListHtml('self')+'</div></div>';
  }
  function renderCourses(catKey){
    document.querySelectorAll('#qx-cats .cat').forEach(b=>b.classList.toggle('on', b.dataset.cat===catKey));
    const listEl = document.getElementById('qx-course-list');
    if(listEl) listEl.innerHTML = courseListHtml(catKey);
  }

  /* ---------- 注入底部 5 Dock + 子 tab ---------- */
  function buildChrome(){
    const oldTab = document.getElementById('tabbar');
    if(oldTab) oldTab.style.display='none';
    if(document.getElementById('qx-subtab')) return;

    const sub = document.createElement('nav');
    sub.id='qx-subtab'; sub.className='qx-subtab';
    sub.innerHTML = SUB.map(s=>'<button class="st" data-sub="'+s.key+'">'+s.label+'</button>').join('');
    document.body.appendChild(sub);

    const dock = document.createElement('nav');
    dock.id='qx-dock'; dock.className='qx-dock';
    dock.innerHTML = DOCK.map(d=>{
      if(d.current) return '<button class="di on" aria-current="page"><span class="di-ic">'+svg(d.icon)+'</span><span class="dt">'+d.label+'</span></button>';
      return '<button class="di" data-href="'+d.href+'"><span class="di-ic">'+svg(d.icon)+'</span><span class="dt">'+d.label+'</span></button>';
    }).join('');
    document.body.appendChild(dock);
  }

  /* ---------- 按当前视图同步底部高亮 / 显隐 ---------- */
  const SUB_VIEWS = { explore:'explore', courses:'courses', sounds:'sounds', modes:'modes' };
  const CHROME_HIDDEN = ['onb','session'];
  function syncChrome(name){
    const dock=document.getElementById('qx-dock');
    const sub=document.getElementById('qx-subtab');
    if(!dock) return;
    const hide = CHROME_HIDDEN.includes(name);
    dock.classList.toggle('hidden', hide);
    const subKey = SUB_VIEWS[name];
    sub.classList.toggle('hidden', hide || !subKey);
    sub.querySelectorAll('.st').forEach(b=>b.classList.toggle('on', b.dataset.sub===subKey));
  }

  /* ---------- 劫持 go()：旁路 roost 首页，统一到探索视图 ---------- */
  const p0 = go;
  go = function(name){
    if(name==='home' || name==='explore') name='explore';
    p0(name);
    if(name==='courses' && getProgram()){
      const on=document.querySelector('#qx-cats .cat.on');
      renderCourses(on?on.dataset.cat:'self');
    }
    try{ syncChrome(name); }catch(e){}
  };

  /* ---------- 点击代理 ---------- */
  document.addEventListener('click', function(e){
    const hrefBtn = e.target.closest('#qx-dock [data-href]');
    if(hrefBtn){ goMain(hrefBtn.dataset.href); return; }
    const mainBtn = e.target.closest('[data-main]');
    if(mainBtn){ goMain(mainBtn.dataset.main); return; }
    const shareBtn = e.target.closest('[data-share]');
    if(shareBtn){
      const u=window.location.href;
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(u).then(()=>toast('链接已复制，去分享给同伴吧')).catch(()=>toast('复制链接：'+u)); }
      else toast('复制链接：'+u);
      return;
    }
    const subBtn = e.target.closest('#qx-subtab [data-sub]');
    if(subBtn){ go(subBtn.dataset.sub); return; }
    const app = e.target.closest('[data-app]');
    if(app){ const a=APPS[Number(app.dataset.app)]; if(a && a.action) a.action(); return; }
    const goBtn = e.target.closest('[data-go]');
    if(goBtn){ go(goBtn.dataset.go); return; }
    const cat = e.target.closest('#qx-cats [data-cat]');
    if(cat){ renderCourses(cat.dataset.cat); return; }
    const day = e.target.closest('#qx-course-list [data-day]');
    if(day){
      const n = Number(day.dataset.day);
      if(typeof startSession==='function') startSession(n);
      else if(typeof startLesson==='function') startLesson(n);
      else toast('请稍候，课程正在加载');
      return;
    }
  });

  /* ---------- 渲染探索总览 / 课程库（独立视图，旁路 roost 首页） ---------- */
  function insertView(id, inner){
    if(document.getElementById(id)) return;
    const sec=document.createElement('section');
    sec.className='view'; sec.id='view-'+id;
    sec.innerHTML='<div class="qx-screenwrap">'+inner+'</div>';
    const tabbar=document.getElementById('tabbar');
    if(tabbar && tabbar.parentNode) tabbar.parentNode.insertBefore(sec,tabbar);
    else document.body.appendChild(sec);
  }
  function render(){
    insertView('explore', exploreHtml());
    insertView('courses', coursesHtml());
  }

  /* ---------- 启动：跳过问卷，立即进探索总览（不等数据） ---------- */
  function showExploreNow(){
    try{
      const onb=document.getElementById('view-onb');
      if(onb) onb.remove();
      localStorage.setItem('calm_onboarded','1');
    }catch(e){}
    buildChrome();
    render();
    go('explore');
    syncChrome('explore');
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
      .then(()=>{
        const sec=document.getElementById('view-courses');
        if(sec){ const w=sec.querySelector('.qx-screenwrap'); if(w) w.innerHTML=coursesHtml(); }
      })
      .catch(err=>{ console.error('PROGRAM 加载失败', err); });
  }

  function boot(){
    showExploreNow();                          // 立即进总览，splash 淡出后不会露出问卷
    setTimeout(function(){ loadProgram(); }, 500);  // 脱离当前同步执行流再拉数据
  }

  /* ---------- 移除 roost 注入的悬浮球（遮挡导航） ---------- */
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

  /* 课程数据异步就绪后，若停留在课程页则刷新 */
  let _ref=0;
  const _refTimer=setInterval(()=>{
    if(getProgram()){
      const sec=document.getElementById('view-courses');
      if(sec && sec.classList.contains('active')){
        const w=sec.querySelector('.qx-screenwrap');
        if(w) w.innerHTML=coursesHtml();
      }
      clearInterval(_refTimer);
    } else if(++_ref>40) clearInterval(_refTimer);
  },1000);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
