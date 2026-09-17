// DOM interaction checks. These do not emulate browser layout or camera hardware.
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const requests = [];
const products = Array.from({length:7}, (_, i) => ({id:String(i+1).padStart(24,'0'),title:i===0?'<img src=x onerror=alert(1)>':`Product ${i+1}`,desc:'A useful product',price:12.5,created_at:'2026-09-17T08:00:00Z'}));
let failList = false, noMatch = false, cameraStopped = false;
const dom = new JSDOM(fs.readFileSync(path.join(root,'static/index.html'),'utf8'), {url:'http://localhost/',runScripts:'dangerously',pretendToBeVisual:true});
const w = dom.window;
const $ = selector => w.document.querySelector(selector);
const $$ = selector => [...w.document.querySelectorAll(selector)];
w.HTMLDialogElement.prototype.showModal = function() {this.open=true;};
w.HTMLDialogElement.prototype.close = function() {this.open=false;this.dispatchEvent(new w.Event('close'));};
w.URL.createObjectURL = () => 'blob:test';
w.URL.revokeObjectURL = () => {};
w.createImageBitmap = async () => ({close(){}});
w.fetch = async (url, options={}) => {
  requests.push({url,options});
  await wait(15);
  if(options.signal?.aborted) throw new w.DOMException('Aborted','AbortError');
  const uri = new URL(url,'http://localhost');
  let data = {}, status = 200;
  if(uri.pathname === '/app-config') data={max_image_mb:5};
  else if(uri.pathname === '/products') {
    if(failList) throw new TypeError('Offline');
    const size=Number(uri.searchParams.get('page_size')), page=Number(uri.searchParams.get('page'));
    const search=(uri.searchParams.get('search')||'').toLowerCase();
    const list=products.filter(p=>(p.title+' '+p.desc).toLowerCase().includes(search));
    data={total:list.length,total_pages:Math.ceil(list.length/size),page,page_size:size,data:list.slice((page-1)*size,page*size)};
  } else if(uri.pathname === '/getProductByImage') {
    if(noMatch) status=404; else data={success:true,similarity:.94,product:products[0]};
  } else if(uri.pathname === '/addProduct') {
    products.unshift({id:'000000000000000000000099',title:options.body.get('title'),desc:options.body.get('desc'),price:Number(options.body.get('price'))});
    data={success:true};
  } else if(options.method === 'PUT') {
    const product=products.find(p=>p.id===uri.pathname.split('/')[2]);
    Object.assign(product,{title:options.body.get('title'),price:Number(options.body.get('price')),desc:options.body.get('desc')});
    data={success:true};
  } else if(options.method === 'DELETE') {
    products.splice(products.findIndex(p=>p.id===uri.pathname.split('/')[2]),1);data={success:true};
  }
  return {ok:status<400,status,json:async()=>data};
};
const script=w.document.createElement('script');script.textContent=fs.readFileSync(path.join(root,'static/app.js'),'utf8');w.document.body.append(script);

(async()=>{
  await wait(30);
  assert.equal(w.document.documentElement.dir,'rtl');
  assert.equal(w.document.documentElement.lang,'ar');
  assert.equal($('#scan-button').disabled,true);
  $('#language-toggle').click();
  assert.equal(w.document.documentElement.dir,'ltr');
  assert.equal($('h1').textContent,'Your next find starts with a photo.');
  const translatedKeys=$$('[data-i18n]').map(el=>el.dataset.i18n);
  assert(translatedKeys.every(key=>w.eval(`Object.hasOwn(translations.en, ${JSON.stringify(key)}) && Object.hasOwn(translations.ar, ${JSON.stringify(key)})`)));

  w.location.hash='#products';await wait(5);
  assert.equal($('#products-content').getAttribute('aria-busy'),'true');
  assert($$('.skeleton').length>0);
  await wait(40);
  assert.equal($$('.product-table tbody tr').length,5);
  assert.equal($$('.product-mobile-card').length,5);
  assert.equal($$('.product-cell strong img').length,0,'Product titles are escaped');
  assert.equal($('#previous-page').disabled,true);
  $('#next-page').click();await wait(40);
  assert.equal($$('.product-mobile-card').length,2);
  assert.equal($('#next-page').disabled,true);
  assert(requests.some(r=>r.url.includes('page=2')&&r.url.includes('page_size=5')));

  $('#product-search').value='Product 3';$('#product-search').dispatchEvent(new w.Event('input'));await wait(360);
  assert.equal($$('.product-mobile-card').length,1);
  assert.equal($('.mobile-card-main h3').textContent,'Product 3');
  assert(requests.some(r=>r.url.includes('search=Product+3')));
  $('#product-search').value='zz-no-results';$('#product-search').dispatchEvent(new w.Event('input'));await wait(360);
  assert.equal($('.empty-state h3').textContent,'No products found');
  $('[data-action="clear"]').click();await wait(40);
  $('#page-size').value='10';$('#page-size').dispatchEvent(new w.Event('change'));await wait(40);
  assert.equal($$('.product-mobile-card').length,7);

  failList=true;await w.loadProducts();assert.equal($('.empty-state h3').textContent,'Could not load products');
  failList=false;$('[data-action="retry"]').click();await wait(40);
  assert.equal($$('.product-mobile-card').length,7);

  $('#add-product').click();assert.equal($('#product-dialog').open,true);
  $('#product-title').value='New camera';$('#product-price').value='24.50';
  $('#product-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
  assert.equal($('#form-error').hidden,false,'New product requires an image');
  const file=new w.File(['image'],'camera.png',{type:'image/png'});
  await w.setImage(file,'product');
  $('#product-form').dispatchEvent(new w.Event('submit',{cancelable:true}));await wait(65);
  assert.equal($('#product-dialog').open,false);
  assert.equal($('.mobile-card-main h3').textContent,'New camera');
  assert(requests.some(r=>r.url==='/addProduct'&&r.options.body.get('image')));

  $('.edit-action').click();assert.equal($('#product-dialog').open,true);
  $('#product-title').value='Updated camera';$('#product-desc').value='';
  $('#product-form').dispatchEvent(new w.Event('submit',{cancelable:true}));await wait(65);
  assert.equal($('.mobile-card-main h3').textContent,'Updated camera');
  assert(requests.some(r=>r.options.method==='PUT'&&!r.options.body.get('image')));
  $('.delete-action').click();assert.equal($('#delete-dialog').open,true);
  $('#confirm-delete').click();await wait(65);
  assert.equal($('#delete-dialog').open,false);
  assert.equal(products.length,7);

  w.location.hash='#scan';await wait(20);
  await w.setImage(file,'scan');assert.equal($('#scan-button').disabled,false);
  $('#scan-button').click();assert.equal($('#scan-overlay').hidden,false);
  assert.equal($('#scan-button').disabled,true);await wait(40);
  assert.equal($('#scan-overlay').hidden,true);assert.equal($('#result-dialog').open,true);
  assert.equal($('.match-badge').textContent,'A match from your collection');
  $('#result-dialog').close();noMatch=true;$('#scan-button').click();await wait(40);
  assert.equal($('#result-content h2').textContent,'No match just yet');$('#result-dialog').close();

  $('#floating-camera').click();assert.equal($('#source-dialog').open,true);
  $('#start-camera').click();await wait(20);
  assert($('#camera-message').textContent.includes('HTTPS'));
  $('#camera-dialog').close();
  Object.defineProperty(w,'isSecureContext',{value:true});
  Object.defineProperty(w.navigator,'mediaDevices',{value:{getUserMedia:async()=>({getTracks:()=>[{stop(){cameraStopped=true;}}]})}});
  w.HTMLMediaElement.prototype.play=async()=>{};
  $('#floating-camera').click();$('#start-camera').click();await wait(20);
  assert.equal($('#capture-photo').disabled,false);
  $('#camera-dialog').close();assert.equal(cameraStopped,true,'Camera tracks are stopped when dialog closes');
  $('#remove-image').click();assert.equal($('#scan-button').disabled,true);
  $('#language-toggle').click();assert.equal(w.document.documentElement.dir,'rtl');
  console.log('PASS: Arabic/English, loading, table/cards, server pagination/search, empty/error/retry, escaped content, add/edit/delete, upload, scan/results, camera fallback/cleanup.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>dom.window.close());
