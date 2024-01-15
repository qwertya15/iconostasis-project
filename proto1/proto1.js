/* TODO:

fix scaling/positioning of canvas img, elements, and tooltip....



*/

// old sidebar stuff
// let sb=document.querySelector('#sidebar');
// function toggleSidebar(open=sb.classList.contains('hidden')) {
//   sb.classList[open ? 'remove' : 'add']('hidden');
// }

function redirectToV2() {
  document.body.innerHTML=('<h1>redirecting to v2...</h1>');
  setTimeout(()=>location='proto2/proto2.html',1000);
  throw new Error('');
}
redirectToV2();

// canvas rendering stuff
let C = {
  c:document.querySelector('#canvas'),
  w:0,h:0,
  //ox:0,oy:0,
  ix:0,iy:0,
  ctx:null,
  cont:document.querySelector('#container'),
  s:1,
  scale:(d)=>{
    let s1=Math.min(24,Math.max(0.5,C.s+d));
    if (C.s != s1) {
      let d=s1-C.s;
      // C.ox+=((IMG.width/2) - M.x)*d;
      // C.oy+=((IMG.height/2) - M.y)*d;
      C.s=s1;
    }
  },
  zoomIn:()=>{C.scale(0.2),C.draw()},
  zoomOut:()=>{C.scale(-0.2),C.draw()},
  resize:()=>{
    C.w=C.c.width=C.cont.offsetWidth;
    C.h=C.c.height=C.cont.offsetHeight;
  },
  onresize:()=>{
    C.resize();
    C.draw();
  },
  init:()=>{
    C.ctx=C.c.getContext('2d',{alpha:false});
    C.ctx.clear=function() {
      C.ctx.clearRect(0,0,C.c.width,C.c.height);
    }
    C.ctx.fill=function(fs=null) {
      if (fs) C.ctx.fillStyle=fs;
      C.ctx.fillRect(0,0,C.c.width,C.c.height);
    }
    window.onresize=C.onresize;
    C.resize();
    C.c.addEventListener('wheel',(e)=>{
      C.scale(e.deltaY/-32);
      C.draw();
    },{'passive':true});
  },
  draw:()=>{
    C.ctx.clear();
    C.ctx.fill('#aaa');
    // draw map/img/etc...
    // let x=(M.x1 /* * C.s*/) - ((IMG.width/2) * C.s),
    //     y=(M.y1 /* * C.s*/) - ((IMG.height/2) * C.s),
    //     w=IMG.width  * C.s,
    //     h=IMG.height * C.s;
    let cx=C.c.width/2,
        cy=C.c.height/2;
    C.ix= (M.x1+cx) - ((IMG.width/2) * C.s);
    C.iy= (M.y1+cy) - ((IMG.height/2) * C.s);
    let w=IMG.width  * C.s,
        h=IMG.height * C.s;
    C.ctx.drawImage(IMG,C.ix,C.iy,w,h);
    E.render(C.ix,C.iy);
    T.render(C.ix,C.iy);
  },
  reset:()=>{
    M.x=0;
    M.y=0;
    M.x0=0;
    M.y0=0;
    M.x1=0;
    M.y1=0;
    C.s=1;
    T.toggle(false);
    C.draw();
  }
}
// mouse position/events etc.
let M = {
  down:false,
  x:0,y:0, // x,y pos
  x0:0,y0:0, // x,y of start of drag
  x1:0,y1:0, // x,y of drag
  ox:0,oy:0, // x,y of origin of resize
  init:()=>{
    C.cont.onpointerdown=M.pd;
    C.cont.onpointermove=M.pm;
    C.cont.onpointerup=M.pu;
    // prevent page zooming
    window.addEventListener('keydown',(e)=>{
      if (e.ctrlKey && ['-','='].includes(e.key)) return e.preventDefault();
    });
    window.addEventListener('wheel',(e)=>{
      if (e.ctrlKey) return e.preventDefault();
    },{'passive':false});
  },
  e:(e)=>{
    M.x=e.offsetX;
    M.y=e.offsetY;
    M.x1=M.x-M.x0;
    M.y1=M.y-M.y0;
  },
  e0:(e)=>{
    M.x0=e.offsetX-M.x1;
    M.y0=e.offsetY-M.y1;
    M.e(e);
  },
  pd:(e)=>{
    e.preventDefault();
    M.e0(e);
    M.down=true;
    C.draw();
    C.cont.classList.add('active');
  },
  pm:(e)=>{
    if (M.down) {
      M.e(e);
      C.draw();
    }
    pos.textContent=`(${Math.floor(e.offsetX)},${Math.floor(e.offsetY)}) [${Math.floor(C.ix)},${Math.floor(C.iy)}]`;
  },
  pu:(e)=>{
    M.down=false;
    C.draw();
    C.cont.classList.remove('active');
  }
}

let E = {
  json:null,
  b:[],
  a:null,
  init:()=>{
    fetch('./elements.json').then((rs)=>{
      if (rs.ok) return rs.json();
      else alert('error fetching the elements!');
    }).then((json)=>{
      E.loadElems(json);
    });
  },
  loadElems:(json)=>{
    if (json==null) return alert('json is null!');
    console.log('got json:',json);
    E.json=json;
    for (let [id,e] of Object.entries(E.json.elements)) {
      let b=`<button class="element" id="${id}"></button>`;
      C.cont.insertAdjacentHTML('beforeend',b);
      b=C.cont.lastElementChild;
      E.b.push(b);
      b.onclick=()=>E.elem(b,String(id));
    }
  },
  activate:(b1=null)=>{
    if (E.a) E.a.classList.remove('active');
    if (b1) {
      E.a=b1;
      E.a.classList.add('active');
    }
  },
  elem:(b,id)=>{
    E.activate(b);
    b.classList.add('active');
    console.log('elem clicked with id',id);
    let e=E.json.elements[id];
    console.log('corresponding elem:',e);
    T.show(b,e);
  },
  render:(x,y)=>{
    for (let b of E.b) {
      let e=E.json.elements[b.id];
      if (!e) return alert('render error: elem data missin for id:',id);
      else E.renderBtn(
        b,
        x+(Number(e.x)*C.s),
        y+(Number(e.y)*C.s)
      );
    }
  },
  renderBtn:(b,x,y)=>{
    b.style.setProperty('--x',x+'px');
    b.style.setProperty('--y',y+'px');
  }
}

let T = {
  x0:0, y0:0,
  t:document.querySelector('#tooltip'),
  th:null,
  ti:null,
  td:null,
  tc:null,
  toggle:(show=!T.open())=>{
    if (show) T.t.classList.remove('hidden');
    else T.t.classList.add('hidden');
  },
  open:()=>!T.t.classList.contains('hidden'),
  init:()=>{
    T.th=T.t.querySelector('.tt-header');
    T.ti=T.t.querySelector('.tt-img');
    T.td=T.t.querySelector('.tt-desc');
    T.tc=T.t.querySelector('.tt-close');
    T.tc.onclick=()=>T.toggle(false);
    requestAnimationFrame(()=>T.t.classList.add('loaded'));
  },
  goto:(x,y)=>{
    x=(C.c.width/2)-(T.t.offsetWidth/2);
    y=(C.c.height/2)-(T.t.offsetHeight/2);
    T.t.style.setProperty('--x',x+'px');
    T.t.style.setProperty('--y',y+'px');
  },
  show:(b,e)=>{
    let x=b.offsetLeft,
        y=b.offsetTop;
    console.log('TT: btn clicked at',x,y);
    T.x0=x;
    T.y0=y;
    T.goto(x+C.ix,y+C.iy);
    T.th.textContent=e.title;
    if (e.img_url) {
      T.ti.classList.remove('hidden');
      T.ti.innerHTML=`<img src="${e.img_url}"></img>`;
      T.ti.querySelector('img').onload=()=>T.render();
    } else {
      T.ti.classList.add('hidden');
      requestAnimationFrame(T.render);
    }
    T.td.textContent=e.description;
    T.toggle(true);
  },
  render:(x,y)=>{
    T.goto(T.x0+x,T.y0+y);
  }
}

// load the image for the canvas
window.onload=()=>{
  C.init();
  M.init();
  C.ctx.fill('#aaa');
  C.ctx.fillStyle='#444';
  C.ctx.textAlign='center';
  C.ctx.font=(Math.min(C.w,C.h)/12)+'px sans-serif';
  C.ctx.fillText('Loading...',C.w/2,C.h/2);
  loadImg(IMG);
  T.init();
}
// load other stuff
E.init();

// var IMG='./media/1600x1000_placeholder.png';
// var IMG='./media/iconostasis1.png';
var IMG='./media/jk-iconostasis2.jpg';
function loadImg(src) {
  IMG=new Image();
  IMG.onload=()=>{
    IMG.onload=null;
    C.onresize();
    setTimeout(C.draw,100);
  }
  IMG.src=src;
  // IMG.load();
}
// function load2() { loadImg('./media/jk-iconostasis2.jpg'); }