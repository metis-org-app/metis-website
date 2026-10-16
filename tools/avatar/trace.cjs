const path=require('path');const fs=require('fs');
// Traces source/avatar.png into parts.json (one SVG path per layer/part).
// Requires `npm ci` in tools/avatar (pngjs, potrace). Output is committed; tracing is only re-run when the source art changes.
const {PNG}=require('pngjs');const potrace=require('potrace');
const src=PNG.sync.read(fs.readFileSync(path.join(__dirname,'source','avatar.png')));const OUT=__dirname;
const W=src.width,H=src.height,N=W*H,D=src.data;
const L=new Float32Array(N),brown=new Uint8Array(N),sat=new Float32Array(N);
for(let i=0;i<N;i++){const r=D[i*4],g=D[i*4+1],b=D[i*4+2];L[i]=0.299*r+0.587*g+0.114*b;sat[i]=Math.max(r,g,b)-Math.min(r,g,b);brown[i]=(r-b>38&&r>=g)?1:0;}
const ink=new Uint8Array(N),gdark=new Uint8Array(N),gfill=new Uint8Array(N),gray=new Uint8Array(N);
for(let i=0;i<N;i++){if(brown[i]){if(L[i]<150)gdark[i]=1;else if(sat[i]>30&&L[i]<235)gfill[i]=1;}else if(L[i]<150)ink[i]=1;}
function dilate(m,r){const a=new Uint8Array(N),b=new Uint8Array(N);
 for(let y=0;y<H;y++){let c=0;for(let x=-r;x<W;x++){if(x+r<W&&m[y*W+x+r])c++;if(x-r-1>=0&&m[y*W+x-r-1])c--;if(x>=0)a[y*W+x]=c>0?1:0;}}
 for(let x=0;x<W;x++){let c=0;for(let y=-r;y<H;y++){if(y+r<H&&a[(y+r)*W+x])c++;if(y-r-1>=0&&a[(y-r-1)*W+x])c--;if(y>=0)b[y*W+x]=c>0?1:0;}}return b;}
function erode(m,r){const inv=new Uint8Array(N);for(let i=0;i<N;i++)inv[i]=m[i]?0:1;const d=dilate(inv,r);const o=new Uint8Array(N);for(let i=0;i<N;i++)o[i]=d[i]?0:1;return o;}
function fillFromBorder(block){const bg=new Uint8Array(N);const st=[];for(let x=0;x<W;x++){st.push(x,(H-1)*W+x);}for(let y=0;y<H;y++){st.push(y*W,y*W+W-1);}
 while(st.length){const p=st.pop();if(bg[p]||block[p])continue;bg[p]=1;const x=p%W,y=(p/W)|0;if(x>0)st.push(p-1);if(x<W-1)st.push(p+1);if(y>0)st.push(p-W);if(y<H-1)st.push(p+W);}
 const sil=new Uint8Array(N);for(let i=0;i<N;i++)sil[i]=bg[i]?0:1;return sil;}
const inkNear=dilate(ink,2);
for(let i=0;i<N;i++){if(!brown[i]&&!ink[i]&&L[i]>=150&&L[i]<222&&sat[i]<30&&!inkNear[i])gray[i]=1;}
function label(m){const lab=new Int32Array(N).fill(-1);const comps=[];const st=new Int32Array(N);
 for(let s=0;s<N;s++){if(!m[s]||lab[s]>=0)continue;let sp=0;st[sp++]=s;lab[s]=comps.length;let c={id:comps.length,px:[],x0:1e9,y0:1e9,x1:-1,y1:-1,sx:0,sy:0};
  while(sp){const p=st[--sp];const x=p%W,y=(p/W)|0;c.px.push(p);c.sx+=x;c.sy+=y;if(x<c.x0)c.x0=x;if(y<c.y0)c.y0=y;if(x>c.x1)c.x1=x;if(y>c.y1)c.y1=y;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const q=ny*W+nx;if(m[q]&&lab[q]<0){lab[q]=c.id;st[sp++]=q;}}}
  c.area=c.px.length;c.cx=c.sx/c.area;c.cy=c.sy/c.area;comps.push(c);}return comps;}
const C={ink:label(ink),gdark:label(gdark),gfill:label(gfill),gray:label(gray)};
const inBox=(c,x0,y0,x1,y1)=>c.cx>=x0&&c.cx<=x1&&c.cy>=y0&&c.cy<=y1;
const bboxIn=(c,x0,y0,x1,y1)=>c.x0>=x0&&c.x1<=x1&&c.y0>=y0&&c.y1<=y1;
// figure silhouette from big ink + all gold
const figBlock=new Uint8Array(N);for(const c of C.ink)if(c.area>4000)for(const p of c.px)figBlock[p]=1;for(let i=0;i<N;i++)if(gdark[i]||gfill[i])figBlock[i]=1;
const figSilRaw=fillFromBorder(dilate(figBlock,6));
const groups={};const add=(g,layer,c)=>{(groups[g]=groups[g]||{});(groups[g][layer]=groups[g][layer]||[]).push(c);};
for(const layer of ['ink','gdark','gfill','gray'])for(const c of C[layer]){
 if(c.area<6)continue;
 if(inBox(c,862,598,1002,772)){add('owl',(layer==='ink'&&c.area>400)?'gdark':layer,c);continue;}
 if(inBox(c,85,350,250,505)&&c.area<20000){add('bookL',layer,c);continue;}
 if(inBox(c,905,380,1050,495)&&c.area<20000){add('bookR',layer,c);continue;}
 if(layer==='ink'&&bboxIn(c,532,525,628,595)){add('mouth',layer,c);continue;}
 if(layer==='ink'&&(bboxIn(c,430,385,530,440)||bboxIn(c,635,385,745,450))){add(c.cx<596?'browL':'browR',layer,c);continue;}
 if(layer==='ink'&&(bboxIn(c,410,450,540,510)||bboxIn(c,625,450,755,510))){add(c.cx<596?'eyeL':'eyeR',layer,c);continue;}
 if(layer==='gfill'&&c.cy<385&&c.cx>290&&c.cx<905){add('leaf',layer,c);continue;}
 if(layer==='gdark'&&c.cy<385&&c.cx>290&&c.cx<905){add('laurelLine',layer,c);continue;}
 const small=Math.max(c.x1-c.x0,c.y1-c.y0)<=80&&c.area<3000;
 const centerIn=figSilRaw[Math.round(c.cy)*W+Math.round(c.cx)];
 if(layer==='ink'&&small&&!centerIn){add('spark',layer,c);continue;}
 if(layer==='gray'&&small&&!centerIn){continue;}
 add('figure',layer,c);}
const report=g=>groups[g]?Object.fromEntries(Object.entries(groups[g]).map(([k,v])=>[k,v.length])):null;
console.log('groups',JSON.stringify(Object.fromEntries(Object.keys(groups).map(g=>[g,report(g)]))));
console.log('sparks',JSON.stringify(groups.spark.ink.map(c=>[Math.round(c.cx),Math.round(c.cy)])));
console.log('brows',JSON.stringify(['browL','browR'].map(g=>groups[g]&&groups[g].ink.map(c=>[c.x0,c.y0,c.x1,c.y1]))));
// silhouettes
const unionMask=(cs)=>{const m=new Uint8Array(N);for(const c of cs)for(const p of c.px)m[p]=1;return m;};
const allOf=g=>Object.values(groups[g]||{}).flat();
const figPaper=erode(figSilRaw,4);
const owlSil=erode(fillFromBorder(dilate(unionMask(allOf('owl')),3)),2);
const bookLSil=erode(fillFromBorder(dilate(unionMask(allOf('bookL')),4)),3);
const bookRSil=erode(fillFromBorder(dilate(unionMask(allOf('bookR')),4)),3);
// ---- tracing ----
function bboxOf(m){let x0=W,y0=H,x1=-1,y1=-1;for(let i=0;i<N;i++)if(m[i]){const x=i%W,y=(i/W)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}return [x0,y0,x1,y1];}
function trace(mask,mode,opts={}){ // mode 'lum' or 'bin'
 const [bx0,by0,bx1,by1]=bboxOf(mask);if(bx1<0)return Promise.resolve('');
 const pad=4,x0=Math.max(0,bx0-pad),y0=Math.max(0,by0-pad),x1=Math.min(W-1,bx1+pad),y1=Math.min(H-1,by1+pad);
 const w=x1-x0+1,h=y1-y0+1;const png=new PNG({width:w,height:h});
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y0+y)*W+(x0+x);let v=255;if(mask[i])v=mode==='lum'?Math.min(255,L[i]):0;const o=(y*w+x)*4;png.data[o]=png.data[o+1]=png.data[o+2]=v;png.data[o+3]=255;}
 const buf=PNG.sync.write(png);
 return new Promise((res,rej)=>{const p=new potrace.Potrace({threshold:128,turdSize:opts.turd??4,alphaMax:1,optCurve:true,optTolerance:0.3,turnPolicy:'minority'});
  p.loadImage(buf,(err)=>{if(err)return rej(err);const tag=p.getPathTag('#000');const m=tag.match(/ d="([^"]*)"/);res(m?offset(m[1],x0,y0):'');});});}
function offset(d,ox,oy){let out='';let isX=true;const re=/([MLCZmlcz])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/g;let t;
 while((t=re.exec(d))){if(t[1]){out+=t[1];isX=true;}else{const v=parseFloat(t[2])+(isX?ox:oy);out+=(out.endsWith('M')||out.endsWith('L')||out.endsWith('C')||out.endsWith('Z')?'':' ')+(Math.round(v*10)/10);isX=!isX;}}
 return out.replace(/ ?([MLCZ]) ?/g,'$1');}
const maskOf=(cs,dil)=>{let m=unionMask(cs);if(dil)m=dilate(m,dil);return m;};
(async()=>{
 const P={};
 P.paper=await trace(figPaper,'bin',{turd:40});
 P.figGray=await trace(maskOf(groups.figure.gray||[]),'bin',{turd:6});
 const figInkMask=maskOf(groups.figure.ink);const browRMask=new Uint8Array(N);
 for(let y=403;y<=433;y++){const lim=Math.floor(680+0.733*(y-385)-8);for(let x=658;x<=lim;x++){const i=y*W+x;if(figInkMask[i]){browRMask[i]=1;figInkMask[i]=0;}}}
 P.figInk=await trace(figInkMask,'lum',{turd:6});P.browRcut=await trace(browRMask,'lum',{turd:2});
 P.laurelLine=await trace(maskOf(groups.laurelLine.gdark),'lum',{turd:4});
 P.leaves=[];const leaves=groups.leaf.gfill.filter(c=>c.area>30).sort((a,b)=>a.cx<596&&b.cx<596?b.cy-a.cy:(a.cx>=596&&b.cx>=596?b.cy-a.cy:a.cx-b.cx));
 for(const c of leaves){P.leaves.push({d:await trace(maskOf([c],1),'bin',{turd:2}),cx:Math.round(c.cx),cy:Math.round(c.cy),side:c.cx<596?'L':'R'});}
 P.leafBits=await trace(maskOf(groups.leaf.gfill.filter(c=>c.area<=30),1),'bin',{turd:1});
 for(const g of ['mouth','eyeL','eyeR','browL'])P[g]=groups[g]?await trace(maskOf(groups[g].ink),'lum',{turd:2}):'';
 P.sparks=[];for(const c of groups.spark.ink){P.sparks.push({d:await trace(maskOf([c]),'lum',{turd:2}),cx:Math.round(c.cx),cy:Math.round(c.cy),s:Math.max(c.x1-c.x0,c.y1-c.y0)});}
 P.owl={paper:await trace(owlSil,'bin',{turd:10}),fill:await trace(maskOf(groups.owl.gfill||[],1),'bin',{turd:4}),dark:await trace(maskOf(groups.owl.gdark||[]),'lum',{turd:2}),ink:await trace(maskOf(groups.owl.ink||[]),'lum',{turd:2}),
  pupils:(groups.owl.ink||[]).filter(c=>c.area<260&&c.area>150).map(c=>[Math.round(c.cx*10)/10,Math.round(c.cy*10)/10])};
 for(const b of ['bookL','bookR']){const sil=b==='bookL'?bookLSil:bookRSil;const [x0,y0,x1,y1]=bboxOf(sil);P[b]={paper:await trace(sil,'bin',{turd:10}),gray:await trace(maskOf(groups[b].gray||[]),'bin',{turd:3}),ink:await trace(maskOf(groups[b].ink),'lum',{turd:2}),cx:Math.round((x0+x1)/2),cy:Math.round((y0+y1)/2)};}
 fs.writeFileSync(path.join(OUT,'parts.json'),JSON.stringify(P));
 const sz=(o)=>JSON.stringify(o).length;console.log('sizes',Object.fromEntries(Object.entries(P).map(([k,v])=>[k,sz(v)])),'total',sz(P));
 console.log('owl pupils',JSON.stringify(P.owl.pupils),'books',P.bookL.cx,P.bookL.cy,P.bookR.cx,P.bookR.cy);
})().catch(e=>{console.error(e);process.exit(1);});
