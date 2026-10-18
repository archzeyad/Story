(()=>{
  const s=window.STORY;
  const stage=document.querySelector('.stage');
  const cover=document.querySelector('#cover');
  const coverImage=document.querySelector('#coverImage');
  const art=document.querySelector('#art');
  const prev=document.querySelector('#prev');
  const next=document.querySelector('#next');
  const label=document.querySelector('#label');
  const count=document.querySelector('#count');
  let page=-1;

  document.title=s.title;
  document.querySelector('#storyName').textContent=s.title;
  document.querySelector('#title').textContent=s.title;
  document.querySelector('#subtitle').textContent=s.subtitle;
  coverImage.loading='eager';
  coverImage.decoding='async';
  coverImage.src=s.cover;
  coverImage.alt=`غلاف قصة ${s.title}`;
  art.decoding='async';

  function preload(index){
    if(index<0||index>=s.pages.length)return;
    const image=new Image();
    image.decoding='async';
    image.src=s.pages[index].src;
  }

  function draw(){
    const onCover=page<0;
    cover.hidden=!onCover;
    art.hidden=onCover;
    if(onCover){
      stage.classList.remove('loading');
      preload(0);
    }else{
      const current=s.pages[page];
      art.alt=current.alt||`صفحة ${page+1} من قصة ${s.title}`;
      if(art.getAttribute('src')!==current.src){
        stage.classList.add('loading');
        art.onload=()=>{stage.classList.remove('loading');preload(page+1)};
        art.onerror=()=>stage.classList.remove('loading');
        art.src=current.src;
      }else{
        stage.classList.remove('loading');
        preload(page+1);
      }
    }
    prev.disabled=onCover;
    next.disabled=page===s.pages.length-1;
    label.textContent=onCover?'الغلاف':`صفحة ${page+1} من ${s.pages.length}`;
    count.textContent=onCover?'اضغط التالي لبدء القصة':'استخدم الأزرار أو مفاتيح الأسهم';
  }

  function go(delta){
    page=Math.max(-1,Math.min(s.pages.length-1,page+delta));
    draw();
  }

  prev.addEventListener('click',()=>go(-1));
  next.addEventListener('click',()=>go(1));
  addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft')go(1);
    if(e.key==='ArrowRight')go(-1);
  });
  let x=0;
  addEventListener('touchstart',e=>x=e.changedTouches[0].screenX,{passive:true});
  addEventListener('touchend',e=>{
    const d=e.changedTouches[0].screenX-x;
    if(Math.abs(d)>55)go(d<0?1:-1);
  },{passive:true});
  draw();
})();

