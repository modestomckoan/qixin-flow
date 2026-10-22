/* ============================================================
   栖心 Flow · 探索总览 + 课程库
   复用 roost（栖心）的课程 / 声音 / 播放引擎，仅新增导航与入口
   ============================================================ */
(function(){
  'use strict';

  /* ---------- 图标（线性 SVG，禁 emoji） ---------- */
  const I = {
    timer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6M12 5v0"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 9l5 3-5 3z"/></svg>',
    headphone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="2.5" y="14" width="4" height="6" rx="1.6"/><rect x="17.5" y="14" width="4" height="6" rx="1.6"/></svg>',
    waves:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12c1.8-4 3.6-4 5.4 0s3.6 4 5.4 0 3.6-4 5.4 0"/></svg>',
    people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0111 0"/><path d="M16 5.2a3.2 3.2 0 010 5.6M17.5 19a5.5 5.5 0 00-3-4.9"/></svg>',
    pencil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 4.5l4 4L8 20l-5 1 1-5z"/><path d="M13 7l4 4"/></svg>',
    calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>',
    box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
    leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-9 6-14 14-14 0 9-5 14-14 14z"/><path d="M5 19c2-5 6-8 10-9"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  /* ---------- 课程库：五个方向（真实 Day 映射） + 系列课 ---------- */
  const CATS = [
    {key:'self',  name:'自我关怀', days:[7,20,27]},
    {key:'sleep', name:'睡前安心', days:[6,8,11]},
    {key:'focus', name:'找回专注', days:[5,3,23]},
    {key:'calm',  name:'减轻压力', days:[17,18,19]},
    {key:'grow',  name:'慢慢成长', days:[22,28,30]},
    {key:'series',name:'系列课'},
  ];
  let currentCat = 'self';

  /* ---------- 探索总览宫格 ---------- */
  const APPS = [
    {t:'番茄钟', ic:I.timer,     act:()=>qxToast('番茄钟正在路上，敬请期待')},
    {t:'呼吸',   ic:I.play,      act:()=>go('modes')},
    {t:'连耳机', ic:I.headphone, act:()=>go('device')},
    {t:'白噪音', ic:I.waves,     act:()=>go('sounds')},
    {t:'社区',   ic:I.people,    act:()=>location.href='../index.html'},
    {t:'日记',   ic:I.pencil,    act:()=>go('archive')},
    {t:'课程',   ic:I.calendar,  act:()=>go('courses')},
    {t:'档案',   ic:I.box,       act:()=>go('planner')},
  ];

  function exploreHTML(){
    return `
    <div class="qx-top">
      <div class="brand">栖心 Flow · 诗意地栖居</div>
      <a class="qx-back" href="../index.html">${I.play.replace('1.6','1.6')} 返回主页</a>
    </div>
    <label class="qx-search" onclick="document.getElementById('qxSearchInput').focus()">
      ${I.search}<input id="qxSearchInput" placeholder="搜索课程、声音…" onkeydown="if(event.key==='Enter'){go('courses');qxToast('已为你打开课程库');}">
    </label>
    <div class="qx-grid">
      ${APPS.map((a,i)=>`<button class="qx-app" data-i="${i}"><span class="ico">${a.ic}</span><span>${a.t}</span></button>`).join('')}
    </div>
    <button class="qx-device" onclick="go('device')">
      <span class="d-ico">${I.headphone}</span>
      <span class="d-txt"><span class="d-t">连接设备</span><span class="d-s">开启脑机之旅 · 让冥想真正有效</span></span>
      <span class="d-go">›</span>
    </button>
    <div class="qx-banners">
      <div class="qx-banner b-plan" onclick="go('program')">
        <span class="b-ico">${I.calendar}</span>
        <div><div class="b-t">30 天计划</div><div class="b-s">循序渐进，每天一课</div></div>
      </div>
      <div class="qx-banner b-sound" onclick="go('sounds')">
        <span class="b-ico">${I.leaf}</span>
        <div><div class="b-t">声音花园</div><div class="b-s">自然声音，自由混音</div></div>
      </div>
    </div>`;
  }

  function lessonCard(day){
    const d = PROGRAM[day-1];
    return `<div class="qx-clesson" onclick="startSession(${day})">
      <span class="l-num">${String(day).padStart(2,'0')}</span>
      <span class="l-t"><b>${d.title}</b><small>${d.dur} 分钟 · ${d.breath.name}</small></span>
      <span class="l-go">›</span>
    </div>`;
  }

  function renderCourses(){
    const panel = document.getElementById('qxCoursesPanel');
    if(!panel) return;
    document.querySelectorAll('.qx-rail button').forEach(b=>b.classList.toggle('on', b.dataset.cat===currentCat));
    if(currentCat==='series'){
      panel.innerHTML = `
        <div class="qx-ccat">完整系列课程</div>
        <button class="qx-series" onclick="go('program')">
          <span class="s-ico">${I.calendar}</span>
          <span class="s-t"><b>30 天完整旅程</b><small>慢慢靠近自己 · 共 523 分钟 · 每天一课</small></span>
          <span class="s-go">›</span>
        </button>
        <div class="qx-ccat" style="margin-top:18px;">随时开始的短练习</div>
        <div class="qx-clesson" onclick="go('modes')">
          <span class="l-num">${I.play}</span>
          <span class="l-t"><b>随时练习</b><small>小憩 · 放松 · 专注 · 睡前，5–20 分钟</small></span>
          <span class="l-go">›</span>
        </div>`;
    } else {
      const cat = CATS.find(c=>c.key===currentCat);
      panel.innerHTML = `<div class="qx-ccat">${cat.name} · 为你挑选</div>` + cat.days.map(lessonCard).join('');
    }
  }

  function coursesHTML(){
    return `
    <div class="qx-top">
      <div class="brand">栖心 Flow · 课程库</div>
      <button class="qx-back" onclick="go('explore')">‹ 返回</button>
    </div>
    <div class="qx-courses">
      <div class="qx-rail">
        ${CATS.map(c=>`<button data-cat="${c.key}" class="${c.key===currentCat?'on':''}">${c.name}</button>`).join('')}
      </div>
      <div class="qx-panel" id="qxCoursesPanel"></div>
    </div>`;
  }

  /* ---------- 挂载视图 ---------- */
  addView('explore', exploreHTML());
  addView('courses', coursesHTML());

  /* 宫格点击 */
  document.querySelectorAll('#view-explore .qx-app').forEach(btn=>{
    btn.addEventListener('click', ()=>APPS[+btn.dataset.i].act());
  });
  /* 课程库左分类切换（事件委托，视图重渲染后仍有效） */
  document.addEventListener('click', e=>{
    const railBtn = e.target.closest && e.target.closest('.qx-rail button');
    if(railBtn){ currentCat = railBtn.dataset.cat; renderCourses(); }
  });

  /* ---------- toast ---------- */
  let toastTimer=null;
  function qxToast(msg){
    let el=document.getElementById('qxToast');
    if(!el){el=document.createElement('div');el.id='qxToast';el.className='qx-toast';document.body.appendChild(el);}
    el.textContent=msg;el.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1900);
  }
  window.qxToast=qxToast;

  /* ---------- 给 30 天详情页加返回 ---------- */
  const progTop = document.querySelector('#view-program .topline');
  if(progTop){
    const back=document.createElement('button');
    back.className='qx-back';back.style.border='0';back.style.padding='8px 0';back.style.background='transparent';
    back.innerHTML='‹ 返回课程库';back.onclick=()=>go('courses');
    progTop.appendChild(back);
  }

  /* ---------- 重建底部导航 ---------- */
  const TABS=[
    {v:'explore', t:'首页', svg:'<path d="M3 12l9-9 9 9M5 10v10h14V10"/>'},
    {v:'courses', t:'课程', svg:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z"/><path d="M4 19.5A2.5 2.5 0 016.5 17H20v4H6.5A2.5 2.5 0 014 19.5z"/>'},
    {v:'sounds',  t:'声音', svg:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'},
    {v:'program', t:'计划', svg:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'},
    {v:'device',  t:'耳机', svg:'<path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>'},
  ];
  const tabbar=document.getElementById('tabbar');
  tabbar.innerHTML=TABS.map(t=>`<button data-view="${t.v}" onclick="go('${t.v}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${t.svg}</svg>${t.t}</button>`).join('');

  /* ---------- 路由：进入新视图时渲染 ---------- */
  const _qxGo=go;
  go=function(name){
    _qxGo(name);
    if(name==='courses') renderCourses();
    window.scrollTo(0,0);
  };
  window.go=go;

  /* ---------- 默认进入探索总览 ---------- */
  const _qxEnter=window.enterApp;
  window.enterApp=function(after){
    const onb=document.getElementById('view-onb');
    if(onb) onb.classList.remove('active');
    document.getElementById('tabbar').classList.add('show');
    go('explore');
    if(typeof after==='function') after();
  };
  /* ---------- 启动：先从 roost 在线页加载 30 天课程数据，再进入 ---------- */
  window.__qxProgramReady=(async()=>{
    if(!PROGRAM.length){
      try{
        const base=(typeof ASSET_BASE!=='undefined'&&ASSET_BASE)||'https://modestomckoan.github.io/roost/';
        const html=await fetch(base+'index.html',{cache:'force-cache'}).then(r=>r.text());
        const mt=html.match(/const PROGRAM\s*=\s*(\[[\s\S]*?\]);/);
        if(mt){
          const data=JSON.parse(mt[1]);
          PROGRAM.splice(0,PROGRAM.length,...data);
          if(typeof nextPendingDay==='function'){ try{homeRecommendedDay=nextPendingDay();}catch(e){} }
        }
      }catch(e){ console.warn('30 天课程数据加载失败：',e); }
    }
  })();
  const _qxWait=()=>window.__qxProgramReady.catch(()=>{});
  /* 新用户引导完成 / 老用户自动进入，都等待课程数据就绪 */
  ['finishOnboarding','startRecommended','enterAppFromDay1'].forEach(fn=>{
    const orig=window[fn];
    if(typeof orig==='function'){ window[fn]=function(){ const args=arguments,ctx=this; _qxWait().then(()=>orig.apply(ctx,args)); }; }
  });
  if(localStorage.getItem('calm_onboarded')==='1'){
    _qxWait().then(()=>window.enterApp());
  }
})();
