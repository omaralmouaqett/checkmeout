const cursor=document.querySelector('.cursor');
const ring=document.querySelector('.cursor-ring');
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;

window.addEventListener('mousemove',e=>{
  mx=e.clientX;
  my=e.clientY;
  cursor.style.left=mx+'px';
  cursor.style.top=my+'px'
});

function cursorLoop(){
  rx+=(mx-rx)*.16;
  ry+=(my-ry)*.16;
  ring.style.left=rx+'px';
  ring.style.top=ry+'px';
  requestAnimationFrame(cursorLoop)
}

cursorLoop();

document.querySelectorAll('a,.magnetic').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    ring.classList.add('hover')
  });

  el.addEventListener('mouseleave',()=>{
    ring.classList.remove('hover')
  })
});

document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.12;
    const y=(e.clientY-r.top-r.height/2)*.12;
    el.style.transform=`translate(${x}px,${y}px)`
  });

  el.addEventListener('mouseleave',()=>{
    el.style.transform='translate(0,0)'
  })
});

const observer=new IntersectionObserver(
  entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target)
    }
  }),
  {threshold:.12}
);

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('[data-parallax]').forEach(el=>
  window.addEventListener(
    'scroll',
    ()=>{
      const amount=Number(el.dataset.parallax);
      const y=window.scrollY*amount;
      el.style.transform=`translateY(${y}px)`
    },
    {passive:true}
  )
);

const art=document.getElementById('neuralArt');
const canvas=document.createElement('canvas');
art.appendChild(canvas);

const ctx=canvas.getContext('2d');

let W,H,nodes=[];

function resize(){
  W=canvas.width=art.clientWidth*devicePixelRatio;
  H=canvas.height=art.clientHeight*devicePixelRatio;

  canvas.style.width=art.clientWidth+'px';
  canvas.style.height=art.clientHeight+'px';

  nodes=Array.from(
    {length:42},
    ()=>({
      x:Math.random()*W,
      y:Math.random()*H,
      vx:(Math.random()-.5)*.35*devicePixelRatio,
      vy:(Math.random()-.5)*.35*devicePixelRatio,
      r:(Math.random()*1.5+1.2)*devicePixelRatio
    })
  )
}

function draw(){
  ctx.clearRect(0,0,W,H);

  for(let i=0;i<nodes.length;i++){
    const a=nodes[i];

    a.x+=a.vx;
    a.y+=a.vy;

    if(a.x<0||a.x>W)a.vx*=-1;
    if(a.y<0||a.y>H)a.vy*=-1;

    for(let j=i+1;j<nodes.length;j++){
      const b=nodes[j];

      const dx=a.x-b.x;
      const dy=a.y-b.y;
      const d=Math.hypot(dx,dy);

      if(d<170*devicePixelRatio){
        ctx.strokeStyle=`rgba(224,214,201,${(1-d/(170*devicePixelRatio))*.22})`;
        ctx.lineWidth=devicePixelRatio;

        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke()
      }
    }

    ctx.fillStyle='rgba(220,205,191,.75)';
    ctx.beginPath();
    ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
    ctx.fill()
  }

  requestAnimationFrame(draw)
}

resize();

window.addEventListener('resize',resize);

draw();

document.getElementById('year').textContent=new Date().getFullYear();