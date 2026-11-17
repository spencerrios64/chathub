// chathub shared bar: injected (as an inline <script>) at the end of <body> in every tool.
// Shares chats between tools through IndexedDB ("chathub") and links tools together.
(function(){try{
if(document.getElementById('hubbar'))return;
var FILE=location.protocol==='file:',P=location.pathname.split('/').filter(Boolean);
var me=FILE?P[P.length-2]:P[0];
var GROUPS=[['Collect','chatzip chatvault'],['Clean','chatscrub chatdedupe'],['Understand','chatstats chatsearch chatgraph chatbrief'],['Reuse','promptbank'],['Use','chatrelay chatbridge chatcompare chatevals'],['All-in-one','chatpipeline']];
var href=function(t){return '../'+t+'/'+(FILE?'index.html':'')+'#hub'};
var hubHref=FILE?'../index.html':'../chathub/';
function open(){return new Promise(function(res,rej){var r=indexedDB.open('chathub',1);r.onupgradeneeded=function(){r.result.createObjectStore('files',{keyPath:'name'})};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
function store(mode,fn){return open().then(function(d){return new Promise(function(res,rej){var t=d.transaction('files',mode),q=fn(t.objectStore('files'));t.oncomplete=function(){res(q&&q.result)};t.onerror=function(){rej(t.error)}})})}
function list(){return store('readonly',function(s){return s.getAll()})}
function keep(fl){var a=Array.prototype.slice.call(fl||[]).filter(function(f){return /\.(json|jsonl|zip)$/i.test(f.name)});
  return Promise.all(a.map(function(f){return store('readwrite',function(s){return s.put({name:f.name,blob:f,ts:Date.now()})})})).then(refresh)}
document.addEventListener('change',function(e){if(e.target&&e.target.type==='file'&&!e.__hub&&e.target===fileInput())keep(e.target.files)},true);
document.addEventListener('drop',function(e){if(!e.__hub&&e.dataTransfer)keep(e.dataTransfer.files)},true);
var st='background:#222736;color:#e6e8ee;border:1px solid #2a2f3d;border-radius:6px;padding:3px 9px;font:inherit;cursor:pointer';
var bar=document.createElement('div');bar.id='hubbar';
bar.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483000;height:34px;display:flex;gap:8px;align-items:center;padding:0 10px;background:#0b0d13;border-bottom:1px solid #2a2f3d;font:13px system-ui,sans-serif;color:#e6e8ee;overflow:hidden;white-space:nowrap';
var opts=GROUPS.map(function(g){return '<optgroup label="'+g[0]+'">'+g[1].split(' ').filter(function(t){return t!==me}).map(function(t){return '<option value="'+t+'">'+t+'</option>'}).join('')+'</optgroup>'}).join('');
bar.innerHTML='<a href="'+hubHref+'" style="color:#7c9cff;font-weight:700;text-decoration:none">chathub</a><span id="hb-n" style="color:#8b92a6;overflow:hidden;text-overflow:ellipsis"></span>'
 +'<button id="hb-load" style="'+st+'" hidden>Load hub chats</button><button id="hb-save" style="'+st+'" hidden>Save hub data</button><button id="hb-clear" style="'+st+'" hidden>Clear</button>'
 +'<select id="hb-go" style="'+st+';margin-left:auto"><option value="">Open these chats in…</option>'+opts+'</select>';
document.body.insertBefore(bar,document.body.firstChild);document.body.style.paddingTop='34px';
function q(id){return document.getElementById(id)}
function fileInput(){return document.querySelector('input[type=file][multiple]')||document.querySelector('input[type=file]')}
function dropEl(){return document.querySelector('.drop,[id*=drop]')}
function load(){return list().then(function(items){if(!items.length)return false;var dt=new DataTransfer();items.forEach(function(i){dt.items.add(new File([i.blob],i.name))});
  var inp=fileInput();if(inp){inp.files=dt.files;var ev=new Event('change',{bubbles:true});ev.__hub=1;inp.dispatchEvent(ev);return true}
  var d=dropEl();if(d){var e2=new DragEvent('drop',{dataTransfer:dt,bubbles:true,cancelable:true});e2.__hub=1;d.dispatchEvent(e2);return true}
  return false})}
function refresh(){return list().then(function(items){var n=items.length;
  q('hb-n').textContent=n?n+' file'+(n>1?'s':'')+' in hub: '+items.map(function(i){return i.name}).join(', '):'hub is empty: load an export in any tool and it is shared with all of them';
  q('hb-load').hidden=!(n&&(fileInput()||dropEl()));q('hb-save').hidden=!n;q('hb-clear').hidden=!n})}
q('hb-load').onclick=load;
q('hb-save').onclick=function(){list().then(function(items){items.forEach(function(i){var a=document.createElement('a');a.href=URL.createObjectURL(i.blob);a.download=i.name;a.click()})})};
q('hb-clear').onclick=function(){if(confirm('Remove the shared chats from the hub? Your original files are not touched.'))store('readwrite',function(s){return s.clear()}).then(refresh)};
q('hb-go').onchange=function(){if(this.value)location.href=href(this.value)};
refresh();
if(location.hash==='#hub')setTimeout(function(){load().then(refresh)},500);
}catch(err){console.warn('hubbar',err)}})();
