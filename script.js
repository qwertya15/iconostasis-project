/* TODO:

make fencing more strict: done?

*/
// version number
const _ver='0.2.7';
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
  init:async ()=>{
    let json;
    try {
      // fetch elements info file
      let rsp = await fetch('./elements.json');
      if (rsp && rsp.ok) json = await rsp.json();
    } catch (e) {
      // use backup if file can't be found
      console.error('error fetching elements from JSON file, trying backup...');
      console.warn(e);
      try {
        let bkp = `data:application/json;base64,ewogICJlbGVtZW50cyI6ewogICAgCiAgICAiYWx0YXJfdmVpbCI6ewogICAgICAidGl0bGUiOiJBbHRhciBWZWlsIiwKICAgICAgImltZ191cmwiOiIuL21lZGlhL3ByZXZpZXdzL2FsdGFyX3ZlaWwucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQuIENvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvci4gSW5jaWRpZHVudCB1dCBsYWJvcmUsIGV0IGRvbG9yZSwgbWFnbmEgYWxpcXVhLiIsCiAgICAgICJ4IjoiMTk1MCIsCiAgICAgICJ5IjoiMTY3MCIKICAgIH0sCiAgICAKICAgICJhbHRhcl9pY29uX2plc3VzIjp7CiAgICAgICJ0aXRsZSI6Ikljb24gb2Ygb3VyIExvcmQgSmVzdXMgQ2hyaXN0IiwKICAgICAgImltZ191cmwiOiIuL21lZGlhL3ByZXZpZXdzL2FsdGFyX2ljb25famVzdXMucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiT24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIFJveWFsIGRvb3IgdGhlIGljb24gb2Ygb3VyIExvcmQgSmVzdXMgQ2hyaXN0IGlzIHBsYWNlZC5cblRoaXMgaWNvbiBpcyBhIHJlbWluZGVyIHRoYXQgSmVzdXMgaXMgdGhlIHVuaXF1ZSBnYXRlIGxlYWRpbmcgdG8gdGhlIGhlYXZlbmx5IGtpbmdkb20uXG5cbk9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBlbnRyYW5jZSwgdGhlIGljb24gb2Ygb3VyIExvcmQgSmVzdXMgQ2hyaXN0IGlzIGZpdHRlZC4gSGUgYXBwZWFycyBob2xkaW5nIGEgc2hlZXQgb2YgdGhlIEdvc3BlbCBzaG93aW5nIHRoZSB2ZXJzZSDigJxJIGFtIHRoZSBHb29kIFNoZXBoZXJk4oCdLiBUaGlzIGljb24gcmVtaW5kcyB1cyB0aGF0IEplc3VzIENocmlzdCBpcyB0aGUgdW5pcXVlIGdhdGUgbGVhZGluZyB0byB0aGUgaGVhdmVubHkgS2luZ2RvbS4gSGUgaXMgdGhlIEdvb2QgU2hlcGhlcmQgd2hvIG9wZW5lZCB0aGUgZ2F0ZXMgdG8gaGVhdmVuIHRocm91Z2ggSGlzIGxpZmUtZ2l2aW5nIHNhY3JpZmljZS4iLAogICAgICAieCI6IjIzNjUiLAogICAgICAieSI6IjE2NDAiCiAgICB9LAoKICAgICJhbHRhcl9pY29uX2pvaG5fYmFwdGlzdCI6ewogICAgICAidGl0bGUiOiJJY29uIG9mIFN0LiBKb2huIHRoZSBCYXB0aXN0IiwKICAgICAgImltZ191cmwiOiIuL21lZGlhL3ByZXZpZXdzL2FsdGFyX2ljb25fam9obl9iYXB0aXN0LnBuZyIsCiAgICAgICJkZXNjcmlwdGlvbiI6Ik5leHQgdG8gdGhlIEljb24gb2Ygb3VyIExvcmQgSmVzdXMgQ2hyaXN0IGlzIHRoZSBJY29uIG9mIFN0LiBKb2huIHRoZSBCYXB0aXN0LCB3aG8gcHJlcGFyZWQgdGhlIHdheSBmb3IgdGhlIExvcmTigJlzIGNvbWluZyIsCiAgICAgICJ4IjoiMjUxNSIsCiAgICAgICJ5IjoiMTY0MCIKICAgIH0sCgogICAgImFsdGFyX2ljb25fcGF0cm9uX3NhaW50Ijp7CiAgICAgICJ0aXRsZSI6Ikljb24gb2YgdGhlIFBhdHJvbiBTYWludCBvZiB0aGUgSW5kaXZpZHVhbCBDaHVyY2giLAogICAgICAiaW1nX3VybCI6Ii4vbWVkaWEvcHJldmlld3MvYWx0YXJfaWNvbl9wYXRyb25fc2FpbnQucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiTmV4dCB0byB0aGUgSWNvbiBvZiBTdC4gSm9obiB0aGUgQmFwdGlzdCBjb21lcyB0aGUgSWNvbiBvZiB0aGUgUGF0cm9uIFNhaW50IG9mIHRoZSBjaHVyY2guIFRoaXMgaWNvbiBjYW4gYmUgZm9sbG93ZWQgYnkgYW55IG51bWJlciBvZiBpY29ucyBvZiBzYWludHMgb3IgbWFydHlycyBvciBldmVudHMgZnJvbSBib3RoIHRoZSBOZXcgYW5kIE9sZCBUZXN0YW1lbnRzIiwKICAgICAgIngiOiIyNjYwIiwKICAgICAgInkiOiIxNjQwIgogICAgfSwKCiAgICAiYWx0YXJfaWNvbl90aGVvdG9rb3MiOnsKICAgICAgInRpdGxlIjoiSWNvbiBvZiBUaGVvdG9rb3MgU3QuIE1hcnkiLAogICAgICAiaW1nX3VybCI6Ii4vbWVkaWEvcHJldmlld3MvYWx0YXJfaWNvbl90aGVvdG9rb3MucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiU3QuIE1hcnkgcmVwcmVzZW50cyB0aGUgd2hvbGUgY2h1cmNoIGFuZCB0aGUgUXVlZW4gd2hvIHNpdHMgb24gdGhlIHJpZ2h0IGhhbmQgb2Ygb3VyIExvcmQgSmVzdXMgQ2hyaXN0IiwKICAgICAgIngiOiIxNTQwIiwKICAgICAgInkiOiIxNjQwIgogICAgfSwKCiAgICAiYWx0YXJfaWNvbl9sYXN0X3N1cHBlciI6ewogICAgICAidGl0bGUiOiJUaGUgTGFzdCBTdXBwZXIiLAogICAgICAiaW1nX3VybCI6Ii4vbWVkaWEvcHJldmlld3MvYWx0YXJfaWNvbl9sYXN0X3N1cHBlci5wbmciLAogICAgICAiZGVzY3JpcHRpb24iOiJEaXJlY3RseSBhYm92ZSB0aGUgU2FuY3R1YXJ5IGVudHJhbmNlLCB0aGUgaWNvbiBvZiB0aGUgbGFzdCBzdXBwZXIgaXMgbW91bnRlZC4gSXQgc2hvd3MgQ2hyaXN0IGdpdmluZyBjb21tdW5pb24gdG8gSGlzIGRpc2NpcGxlcywgd2hpY2ggaWxsdXN0cmF0ZXMgYW5kIHNpZ25pZmllcyB0aGUgU2FjcmlmaWNlIGluc3RpdHV0ZWQgYnkgb3VyIExvcmQgQ2hyaXN0LiIsCiAgICAgICJ4IjoiMTk1MCIsCiAgICAgICJ5IjoiMTQ1MCIKICAgIH0sCgogICAgImFsdGFyX2ljb25fYXBvc3RsZXMiOnsKICAgICAgInRpdGxlIjoiVGhlIDEyIEFwb3N0bGVzIiwKICAgICAgImltZ191cmwiOiIuL21lZGlhL3ByZXZpZXdzL2FsdGFyX2ljb25fYXBvc3RsZXMucG5nIiwKICAgICAgImRlc2NyaXB0aW9uIjoiQWxvbmcgdGhlIHRvcCByb3cgb2YgdGhlIGljb25vc3Rhc2lzIGFyZSB0aGUgaWNvbnMgb2YgdGhlIHR3ZWx2ZSBkaXNjaXBsZXMuIFRoZXkgY29uZmlybSB0aGUgYXBvc3RvbGljIG5hdHVyZSBvZiBvdXIgY2h1cmNoLiBPcnRob2RveHkgaXMgZXN0YWJsaXNoZWQgb24gdGhlIGFwb3N0b2xpYyBmYWl0aCwgY29udGludWVzIHRvIGV4aXN0IGluIGFuIGFwb3N0b2xpYyB3YXksIGFuZCBpcyBzaGVwaGVyZGVkIGJ5IGFwb3N0b2xpYyBwYXN0b3JzLiIsCiAgICAgICJ4IjoiMTc0MCIsCiAgICAgICJ5IjoiMTQ1MCIKICAgIH0sCgogICAgImFsdGFyX2ljb25fbmljaGUiOnsKICAgICAgInRpdGxlIjoiTmljaGUvYXBzZSIsCiAgICAgICJpbWdfdXJsIjoiLi9tZWRpYS9wcmV2aWV3cy9hbHRhcl9uaWNoZS5wbmciLAogICAgICAiZGVzY3JpcHRpb24iOiJUaGUgTmljaGUsIG9yIHRoZSBhcHNlLCBpcyB0aGUgc2VtaWNpcmN1bGFyIGVhc3Rlcm4gd2FsbCBvZiB0aGUgU2FuY3R1YXJ5LiBJdCBvZnRlbiBjb250YWlucyB0aGUgaWNvbiBvZiB0aGUgTG9yZCBKZXN1cyBDaHJpc3QsIHN1cnJvdW5kZWQgYnkgdGhlIENoZXJ1YmltIGFuZCB0aGUgU2VyYXBoaW0sIHRoZSBmb3VyIExpdmluZyBjcmVhdHVyZXMsIGFuZCB0aGUgdHdlbnR5IGZvdXIgaGVhdmVubHkgUHJlc2J5dGVycyBvZmZlcmluZyBpbmNlbnNlLlxuXG5UaGUgTG9yZCBhcHBlYXJzIGhvbGRpbmcgdGhlIHBsYW5ldCBFYXJ0aCB3aXRoIG9uZSBoYW5kLCBmb3IgSGUgaXMgdGhlIEFsbWlnaHR5IG9uZSwgYW5kIHRoZSBwYXN0b3JhbCByb2Qgd2l0aCB0aGUgb3RoZXIgaGFuZCwgZm9yIEhlIGlzIHRoZSBTaGVwaGVyZCBhbmQgUmVkZWVtZXIgd2hvIGxpYmVyYXRlcyBtZW4gZnJvbSB0aGUgY2FwdGl2aXR5IG9mIHNpbi4gVGh1cywgdGhlIE5pY2hlIHJlcHJlc2VudHMgdGhlIGJvc29tIG9mIEdvZCwgZm9yIHRoZSBMb3JkIGxvbmdzIGZvciBIaXMgY2h1cmNoLCB3aG8gaW4gdHVybiBhd2FpdHMgSGlzIGNvbWluZy4iLAogICAgICAieCI6IjE5NTAiLAogICAgICAieSI6IjExNTAiCiAgICB9CiAgICAKICB9Cn0=`;
        if (!bkp) throw new Error('no bkp JSON available');
        json = await (await fetch(bkp)).json();
        alert('initial elements info file not found, using backup info...');
      } catch (e) {
        console.error(e);
        return alert('error fetching the elements\' information!');
      }
    }
    setTimeout(()=>E.loadElems(json),500);
  },
  // offset:{x:-1170,y:-1750,scale:2.12}, // (possibly) temporary, to help with moving elems for different images
  offset:{x:0,y:0,scale:1},
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
        T.ti.innerHTML=`<img src="./${e.img_url}"></img>`;
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
    I.c.addEventListener('wheel',(e)=>I.pz.zoomWithWheel(e),{passive:false});
    I.reset();

    // update when window is resized
    window.onresize=()=>I.updatePZ();
  },
  zoomCenter(isIn) {
    I.pz.zoomWithWheel({
      clientX:window.innerWidth/2,
      clientY:window.innerHeight/2,
      deltaY:isIn ? -4 : 4,
      preventDefault(){},
    })
  },
  zoomIn:()=>{
    I.zoomCenter(true);
    // I.updateBtns();
  },
  zoomOut:()=>{
    I.zoomCenter(false);
    // I.updateBtns();
  },
  reset:()=>{
    I.pz.zoom(0,{animate:false});
    // I.pz.pan(0,0);
    // I.updateBtns();
  },
  updateBtns:(s=I.getScale())=>{
    E.update(1/s);
  },
  getScale:()=>I.pz.getScale(),
  getStep:()=>I.pz.getOptions().step,
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