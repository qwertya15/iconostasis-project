/* TODO:

make fencing more strict: done?

*/
// version number
const _ver='0.2.6';
console.log(`v${v.textContent=_ver}`);

// zoom using mouse scroll wheel
document.addEventListener('wheel',(e)=>{
  if (e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
  }
}, {passive:false});

// elements manager
let E = {
  json:null,
  b:[],
  a:null,
  init:()=>{
    fetch('/elements.json').then((rs)=>{
      if (rs.ok) return rs.json();
      else alert('error fetching the elements!');
    }).then((json)=>{
      setTimeout(()=>E.loadElems(json),500);
    });
  },
  offset:{x:-1170,y:-1750,scale:2.12}, // temporary, to help with moving elems for different images
  loadElems:(json)=>{
    if (json==null) return alert('json is null!');
    //console.log('got json:',json);
    E.json=json;
    I.e.querySelectorAll('.element').forEach(b=>b.remove());
    for (let [id,e] of Object.entries(E.json.elements)) {
      let b=`<button class="element" id="${id}"></button>`;
      I.e.insertAdjacentHTML('beforeend',b);
      b=I.e.lastElementChild;
      b.style.setProperty('--x',(e.x*E.offset.scale)+E.offset.x+'px');
      b.style.setProperty('--y',(e.y*E.offset.scale)+E.offset.y+'px');
      E.b.push(b);
      b.onclick=()=>E.elem(b,String(id));
    }
    requestAnimationFrame(()=>I.updatePZ());
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
    let e=E.json.elements[id];
    T.show(b,e);
  },
  update:(s)=>{ for (let b of E.b)  b.style.scale=`min(5,max(0.4,${s}))`; },
}

// tooltip manager
let T = {
  // x0:0, y0:0,
  t:document.querySelector('#tooltip'),
  th:null,
  ti:null,
  td:null,
  tc:null,
  toggle:(show=!T.open())=>{
    if (show) T.t.classList.remove('hidden');
    else {
      T.t.classList.add('hidden');
      for (let ae of document.querySelectorAll('.element.active'))
        ae.classList.remove('active');
    }
  },
  open:()=>!T.t.classList.contains('hidden'),
  init:()=>{
    T.th=T.t.querySelector('.tt-header');
    T.ti=T.t.querySelector('.tt-img');
    T.td=T.t.querySelector('.tt-desc');
    T.tc=T.t.querySelector('.close');
    T.tc.onclick=()=>T.toggle(false);
    requestAnimationFrame(()=>T.t.classList.add('loaded'));
    // close open tooltip with [Esc]
    window.addEventListener('keydown',(e)=>{
      if (e.key=='Escape' && T.open())
        T.toggle(false);
    });
    T.about.showAbout();
  },
  render:(b)=>{
    let r=b?.getBoundingClientRect();
    if (r) {
      // limit to screen border
      let x=Math.max(0,r.x-(T.t.offsetWidth/2)),
          y=Math.max(0,r.y-(T.t.offsetHeight/2));
      x=Math.min(window.innerWidth-(T.t.offsetWidth),x),
      y=Math.min(window.innerHeight-(T.t.offsetHeight),y);
      T.t.style.setProperty('--x',x+'px');
      T.t.style.setProperty('--y',y+'px');
    } else {
      console.error('couldn\'t get bounding rect for btn!');
    }
  },
  show:(b,e)=>{
    T.toggle(false);
    setTimeout(()=>{
      T.th.textContent=e.title;
      if (e.img_url) {
        T.ti.innerHTML=`<img src="/${e.img_url}"></img>`;
        let i=T.ti.querySelector('img');
        i.onload=i.onerror=()=>{
          i.onload=i.onerror=null;
          setTimeout(()=>{
            T.ti.classList.remove('hidden');
            T.render(b);
            T.toggle(true);
          },0);
        }
      } else {
        T.ti.classList.add('hidden');
        setTimeout(()=>{
          T.render(b);
          T.toggle(true);
        },0);
      }
      T.td.textContent=e.description;
    },250);
  },
  about:{
    title:`The Coptic Iconostasis`,
    desc:`\tClick and drag to move, click on the info buttons to learn more.\n\n\tLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    showAbout:()=>{
      T.th.textContent=T.about.title;
      T.ti.classList.add('hidden');
      requestAnimationFrame(()=>{
        T.t.style.setProperty('--x',((window.innerWidth/2)-(T.t.offsetWidth/2))+'px');
        T.t.style.setProperty('--y',((window.innerHeight/2)-(T.t.offsetHeight/2))+'px');
        T.toggle(true);
      });
      // set the "about" message (and "working on" description)
      T.td.innerHTML=`<b><i>currently working on: improved fencing + new image</i></b><br/><br/>${T.about.desc}`;
    },
  },
}

// PanZoom and image manager
let I = {
  fencing:true,
  fenceMargin:450,
  c:document.querySelector('#container'),
  e:document.querySelector('#img'),
  ie:null,
  pz:null,
  transform:(scale,x,y)=>{
    I.pz.setStyle('transform', `scale(${scale}) translate(${x}px, ${y}px)`);
    I.updateBtns(scale);
  },
  init:()=>{
    I.ie=I.e.querySelector('img');
    I.pz=Panzoom(I.e, {
      canvas: true,
      contain: 'outside',
      /*
      setTransform: (_, { scale, x, y }) => {
        // bad non-working old code
        // let s1=I.pz.getScale()-I.pz.getOptions().maxScale;
        // let s1=1//scale;
        // let w=I.e.offsetWidth,h=I.e.offsetHeight;
        // let dx=(w * s1 * 0.5), dy=(h * s1 * 0.5);
        // let x1=Math.max(Math.min(-dx,x),-w-dx);
        // if (x1 != x) return I.pz.pan(x1,y);
        //if (x + (scale *)) 

        // don't fence if I.fencing is false
        if (!I.fencing) {
          return I.transform(scale,x,y);
        }

        // great working old code
        // calculate constraints
        let xmin = (I.ie.width/2)-(I.fenceMargin*I.getScale());
        let ymin = (I.ie.height/2)-(I.fenceMargin*I.getScale());
        // apply constraints
        let x1 = Math.max(-xmin,Math.min(xmin,x));
        let y1 = Math.max(-ymin,Math.min(ymin,y));
        I.transform(scale,x1,y1);
      },
      */
      setTransform: (_, { scale, x, y }) => {
        // update the element buttons when panning/zooming
        I.updateBtns();
        I.transform(scale,x,y);
      },
      startScale: 0.5,
      minScale: 0.125,
      maxScale: 4,
    });
    I.c.addEventListener('wheel',I.pz.zoomWithWheel,{passive:false});
    I.reset();

    // update when window is resized
    window.onresize=()=>I.updatePZ();
  },
  zoomIn:()=>{
    I.pz.zoomIn({ focal: {x:window.innerWidth/2, y:window.innerHeight/2} });
    // I.updateBtns();
  },
  zoomOut:()=>{
    I.pz.zoomOut({ focal: {x:window.innerWidth/2, y:window.innerHeight/2} });
    // I.updateBtns();
  },
  reset:()=>{
    I.pz.zoom(0,{animate:true});
    // I.pz.pan(0,0);
    // I.updateBtns();
  },
  updateBtns:(s=I.getScale())=>{
    E.update(1/s);
  },
  getScale:()=>I.pz.getScale(),
  updatePZ:()=>I.pz.zoom(I.getScale()),
}

// modal manager
let M = {
  e:document.querySelector('modal'),
  focus:()=>M.e.focus(),
  focused:()=>!!document.activeElement.closest('modal'),
  open:()=>!!M.e.getAttribute('open'),
  toggle:(open=!M.open())=>{
    if (open) {
      T.toggle(false); // close tooltip when modal opens
      M.e.setAttribute('open',true);
      setTimeout(_=>M.focus(),100);
    } else M.e.removeAttribute('open');
  },
  init:()=>{
    // [Esc] to close & keyboard focus trapping (when open)
    document.addEventListener('keydown',(e)=>{
      requestAnimationFrame(_=>{
        if (M.open()) {
          if (!M.focused()) M.focus();
          else if (e.code=='Escape') M.toggle(false);
        }
      });
    },{passive:true});
    M.e.classList.add('loaded');
    M.toggle(false);
  }
}

M.init();
T.init();
E.init();
I.init();

// old dev img switcher
// let imgs=[
//   '/media/jk-iconostasis2.jpg',
//   '/media/jk-iconostasis2-blurred.jpg',
//   '/media/jk-iconostasis2-highlighted.jpg',
//   '/media/jk-iconostasis2-cropped.png',
//   '/media/jk-iconostasis2-cropped2.png'
// ], descs=[
//   'original (1/5)',
//   'blurred (2/5)',
//   '"highlighted" (3/5)',
//   'cropped (unedited) (4/5)',
//   'cropped (padded to fit current elems) (5/5)',
// ], imgId=0;
// function devImgSwitch(btn) {
//   imgId=(imgId+1)%imgs.length;
//   I.ie.src=imgs[imgId];
//   btn.textContent='img: '+descs[imgId];
// }