'use strict';

const translations = {
  ar: {
    brand:'بصرة',workspace:'مساحة العمل',visualSearch:'البحث بالصورة',manageProducts:'إدارة المنتجات',smallIdea:'صورة واحدة. احتمالات كثيرة.',smallIdeaDesc:'حوّل ما تراه إلى ما تبحث عنه.',yourStudio:'استوديو منتجاتك',personalWorkspace:'مساحة عملك الخاصة',seeFind:'شاهد. التقط. اكتشف.',findHeading:'منتجك، على بُعد صورة.',findSubtitle:'التقط صورة أو ارفعها، ودع البحث الذكي يجد المنتج في مجموعتك.',poweredAI:'مدعوم بالذكاء الاصطناعي',imageSearch:'البحث المرئي',startWithImage:'كل اكتشاف يبدأ بصورة',dropHeading:'ضع صورتك هنا',dropDesc:'اسحب وأفلت، أو اختر صورة من جهازك',chooseImage:'اختيار صورة',fileHint:'JPG، PNG، WEBP · حتى {size} ميغابايت',findProduct:'ابحث عن المنتج',scanNote:'نبحث عن أقرب تطابق داخل منتجاتك',editorialTitle:'دع الصورة\nتحكي التفاصيل.',editorialDesc:'من العدسة إلى المنتج.\nتجربة بحث أقرب لما تراه.',visualIntelligence:'رؤية ذكية. بحث أبسط.',betterResults:'لنتائج أفضل',tip1:'ضع المنتج في منتصف الصورة',tip2:'اختر إضاءة واضحة وخلفية بسيطة',tip3:'صوّر منتجاً واحداً في كل مرة',how1:'التقط أو ارفع',how1desc:'ابدأ بصورة واضحة',how2:'دع الذكاء يبحث',how2desc:'نقارنها مع مجموعتك',how3:'اكتشف المنتج',how3desc:'التفاصيل في مكان واحد',footerNote:'تفاصيل أقل. اكتشاف أكثر.',takePhoto:'التقط صورة',openCamera:'فتح الكاميرا',removeImage:'إزالة الصورة',ready:'جاهزة للبحث',scanning:'جارٍ البحث عن منتجك…',yourCollection:'مجموعتك، بتنظيم أجمل',productsSubtitle:'كل منتجاتك في مكان واحد. أضف، عدّل، وابقَ منظّماً.',addProduct:'إضافة منتج',collectionTitle:'مساحة لكل منتجاتك',collectionDesc:'مجموعتك هي نقطة البداية لكل بحث جديد.',allProducts:'جميع المنتجات',searchPlaceholder:'ابحث عن اسم أو وصف…',perPage:'منتجات لكل صفحة',previous:'الصفحة السابقة',next:'الصفحة التالية',newPerspective:'زاوية جديدة',addImage:'أضف صورة',sourceDesc:'التقط اللحظة أو اختر صورة جاهزة.',close:'إغلاق',cameraDesc:'التقط صورة مباشرة',uploadDesc:'من ملفات جهازك',deviceCamera:'استخدام كاميرا الجهاز',capture:'التقاط',productDetails:'تفاصيل تصنع الفرق',productPhoto:'صورة المنتج',chooseOrCapture:'التقط صورة أو اختر ملفاً',productName:'اسم المنتج',price:'السعر',description:'الوصف',optional:'اختياري',namePlaceholder:'مثلاً: سماعات لاسلكية',descriptionPlaceholder:'أضف التفاصيل التي تميّز منتجك…',cancel:'إلغاء',saveProduct:'حفظ المنتج',searchResult:'نتيجة البحث',searchAgain:'بحث جديد',deleteTitle:'حذف المنتج؟',deleteWarning:'سيُحذف المنتج وصورته من مجموعتك. لا يمكن التراجع عن هذا الإجراء.',deleteProduct:'حذف المنتج',editProduct:'تعديل المنتج',edit:'تعديل',delete:'حذف',product:'المنتج',dateAdded:'تاريخ الإضافة',actions:'الإجراءات',noDescription:'لا يوجد وصف',untitled:'منتج بدون اسم',emptyTitle:'مجموعتك تبدأ هنا',emptyDesc:'أضف أول منتج وصورته لبدء البحث المرئي.',noResults:'لا توجد نتائج',noResultsDesc:'جرّب اسماً أو وصفاً آخر للبحث.',clearSearch:'مسح البحث',loadError:'تعذّر تحميل المنتجات',retry:'المحاولة مجدداً',networkError:'تعذّر الاتصال بالخادم. تحقّق من الاتصال وحاول مجدداً.',serverError:'تعذّر إتمام الطلب. حاول مجدداً.',invalidData:'تحقّق من بيانات المنتج وحاول مجدداً.',invalidImage:'اختر صورة بصيغة JPG أو PNG أو WEBP.',largeImage:'يجب ألا يتجاوز حجم الصورة {size} ميغابايت.',requiredImage:'أضف صورة للمنتج أولاً.',requiredTitle:'أدخل اسماً للمنتج.',saved:'تم حفظ المنتج بنجاح',deleted:'تم حذف المنتج',saving:'جارٍ الحفظ…',deleting:'جارٍ الحذف…',matchFound:'وجدنا منتجك',matchLabel:'تم العثور على تطابق',similarity:'درجة التشابه: {score}٪',noMatch:'لم نجد تطابقاً بعد',noMatchDesc:'جرّب صورة أوضح أو أضف المنتج إلى مجموعتك أولاً.',cameraLoading:'جارٍ تشغيل الكاميرا…',cameraReady:'ضع المنتج داخل الإطار ثم التقط الصورة.',cameraError:'تعذّر فتح الكاميرا. اسمح بالوصول إليها، أو استخدم كاميرا الجهاز أو اختر ملفاً.',cameraSecure:'الكاميرا المباشرة تحتاج إلى HTTPS أو localhost. يمكنك استخدام كاميرا الجهاز أدناه أو اختيار ملف.',cameraFailed:'تعذّر التقاط الصورة. حاول مجدداً.',showing:'عرض {from}–{to} من {total}',loading:'جارٍ التحميل…',preview:'معاينة الصورة',notFound:'المنتج لم يعد موجوداً. حدّث القائمة وحاول مجدداً.'
  },
  en: {
    brand:'basra',workspace:'Workspace',visualSearch:'Visual search',manageProducts:'Manage products',smallIdea:'One image. More possibilities.',smallIdeaDesc:'Turn what you see into what you find.',yourStudio:'Your product studio',personalWorkspace:'Your personal workspace',seeFind:'SEE IT. SNAP IT. FIND IT.',findHeading:'Your next find starts with a photo.',findSubtitle:'Snap a photo or upload an image. Let visual search find it in your collection.',poweredAI:'Powered by AI',imageSearch:'Visual search',startWithImage:'Every discovery starts with an image',dropHeading:'Drop your image here',dropDesc:'Drag and drop, or choose an image from your device',chooseImage:'Choose image',fileHint:'JPG, PNG, WEBP · Up to {size} MB',findProduct:'Find my product',scanNote:'Find the closest match in your product collection',editorialTitle:'Let the image\ndo the talking.',editorialDesc:'From your lens to your next find.\nSearch the way you see.',visualIntelligence:'Smart vision. Simple discovery.',betterResults:'A little help for a better match',tip1:'Keep the product in the center',tip2:'Use good lighting and a simple background',tip3:'Capture one product at a time',how1:'Snap or upload',how1desc:'Start with a clear photo',how2:'Let AI look',how2desc:'We search your collection',how3:'Meet your match',how3desc:'All the details, in one place',footerNote:'Less searching. More discovering.',takePhoto:'Take a photo',openCamera:'Open camera',removeImage:'Remove image',ready:'Ready to search',scanning:'Finding your product…',yourCollection:'YOUR COLLECTION, BEAUTIFULLY ORGANIZED',productsSubtitle:'A home for every product. Add, edit, and keep everything in order.',addProduct:'Add product',collectionTitle:'A little space for all your products',collectionDesc:'Your collection is where every new discovery begins.',allProducts:'All products',searchPlaceholder:'Search by name or description…',perPage:'Products per page',previous:'Previous page',next:'Next page',newPerspective:'A NEW PERSPECTIVE',addImage:'Add an image',sourceDesc:'Capture the moment, or choose one you already have.',close:'Close',cameraDesc:'Take a photo right here',uploadDesc:'From your device',deviceCamera:'Use device camera',capture:'Capture',productDetails:'THE DETAILS MAKE THE DIFFERENCE',productPhoto:'Product photo',chooseOrCapture:'Take a photo or choose a file',productName:'Product name',price:'Price',description:'Description',optional:'Optional',namePlaceholder:'e.g. Wireless headphones',descriptionPlaceholder:'Add the details that make your product special…',cancel:'Cancel',saveProduct:'Save product',searchResult:'YOUR SEARCH RESULT',searchAgain:'Search again',deleteTitle:'Delete this product?',deleteWarning:'The product and its image will be removed from your collection. This cannot be undone.',deleteProduct:'Delete product',editProduct:'Edit product',edit:'Edit',delete:'Delete',product:'Product',dateAdded:'Date added',actions:'Actions',noDescription:'No description',untitled:'Untitled product',emptyTitle:'Your collection starts here',emptyDesc:'Add your first product and its photo to start discovering.',noResults:'No products found',noResultsDesc:'Try searching for a different name or description.',clearSearch:'Clear search',loadError:'Could not load products',retry:'Try again',networkError:'Could not connect to the server. Check your connection and try again.',serverError:'Something went wrong. Please try again.',invalidData:'Check your product details and try again.',invalidImage:'Choose a JPG, PNG, or WEBP image.',largeImage:'Your image must be {size} MB or smaller.',requiredImage:'Add a product image first.',requiredTitle:'Enter a product name.',saved:'Product saved successfully',deleted:'Product deleted',saving:'Saving…',deleting:'Deleting…',matchFound:'Meet your match',matchLabel:'A match from your collection',similarity:'Similarity score: {score}%',noMatch:'No match just yet',noMatchDesc:'Try a clearer photo, or add this product to your collection first.',cameraLoading:'Starting your camera…',cameraReady:'Place the product in the frame, then capture your photo.',cameraError:'Could not open the camera. Allow camera access, use your device camera, or choose a file.',cameraSecure:'Live camera requires HTTPS or localhost. Use your device camera below or choose a file.',cameraFailed:'Could not capture a photo. Please try again.',showing:'Showing {from}–{to} of {total}',loading:'Loading…',preview:'Image preview',notFound:'This product no longer exists. Refresh the list and try again.'
  }
};
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let language = 'ar';
try { language = localStorage.getItem('basra-language') === 'en' ? 'en' : 'ar'; } catch (_) { /* Storage is optional. */ }
const state = { page:1, pageSize:5, total:0, totalPages:0, products:[], search:'', loaded:false, loading:false, error:false, scanFile:null, productFile:null, editing:null, deleting:null, scanBusy:false, saving:false, deleteBusy:false, imageTarget:'scan', stream:null, cameraSession:0, maxImageMB:5, imageVersion:0, lastResult:null };
let productsController, searchTimer, toastTimer, scanObjectURL, productObjectURL;
function t(key, values = {}) { return (translations[language][key] || key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? (name === 'size' ? state.maxImageMB : '')); }
function localNumber(value) { return new Intl.NumberFormat(language === 'ar' ? 'ar-LB' : 'en-US').format(value); }
function price(value) { return new Intl.NumberFormat(language === 'ar' ? 'ar-LB' : 'en-US', {minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(value) || 0); }
function productName(product) { return product.title || t('untitled'); }
function imageURL(product) { return `/products/${encodeURIComponent(product.id)}/image?v=${state.imageVersion}`; }
function activePage() { return location.hash === '#products' ? 'products' : 'scan'; }
function translate() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-placeholder]').forEach(el => { el.placeholder = t(el.dataset.placeholder); });
  $$('[data-label]').forEach(el => { el.setAttribute('aria-label',t(el.dataset.label)); el.title = t(el.dataset.label); });
  $('#language-toggle span').textContent = language === 'ar' ? 'English' : 'العربية';
  $('#language-toggle').setAttribute('aria-label',language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  $('#product-search').setAttribute('aria-label', t('searchPlaceholder'));
  $('#scan-preview').alt = t('preview');
  $('#product-preview').alt = t('productPhoto');
  $('#breadcrumb-current').textContent = t(activePage() === 'scan' ? 'visualSearch' : 'manageProducts');
  $('#product-dialog-title').textContent = t(state.editing ? 'editProduct' : 'addProduct');
  const dialogLabels={'product-dialog':'productDetails','source-dialog':'addImage','camera-dialog':'takePhoto','result-dialog':'searchResult','delete-dialog':'deleteTitle'};
  $$('dialog').forEach(dialog=>dialog.setAttribute('aria-label',t(dialogLabels[dialog.id])));
  $('nav').setAttribute('aria-label',t('workspace'));
  if (state.loading) renderSkeleton(); else if (state.loaded || state.error) renderProducts();
  if (state.lastResult) renderResult(state.lastResult);
  if (state.deleting) $('#delete-message').textContent = productName(state.deleting);
  document.title = `${t(activePage() === 'scan' ? 'visualSearch' : 'manageProducts')} | ${t('brand')}`;
}
function toast(message, error = false) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.toggle('error',error); $('#toast').hidden=false; toastTimer=setTimeout(()=> { $('#toast').hidden=true; },4500); }
function showModal(id) { const dialog = $(id); if (!dialog.open) dialog.showModal(); }
function closeModal(id) { $(id).close(); }
function route() {
  const page=activePage();
  $('#scan-page').hidden = page !== 'scan'; $('#products-page').hidden=page !== 'products';
  $('#floating-camera').hidden=page !== 'scan';
  $$('[data-page]').forEach(el => { const active=el.dataset.page===page; el.classList.toggle('active',active); if(active) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current'); });
  $('#breadcrumb-current').dataset.i18n=page==='scan'?'visualSearch':'manageProducts';
  translate();
  if(page==='products' && !state.loading) loadProducts();
}
async function api(url, options = {}) {
  let response;
  try { response=await fetch(url,options); } catch(error) { if(error.name==='AbortError') throw error; throw new Error(t('networkError')); }
  if(!response.ok) {
    let payload; try { payload=await response.json(); } catch(_) { payload={}; }
    const detail=typeof payload.detail==='string' ? payload.detail : payload.detail?.message;
    let message=t('serverError');
    if(response.status===413) message=t('largeImage');
    else if(response.status===422) message=t('invalidData');
    else if(response.status===404) message=t('notFound');
    else if(detail && /image|JPEG|PNG|WEBP/i.test(detail)) message=t('invalidImage');
    const error=new Error(message); error.status=response.status; throw error;
  }
  return response.json();
}
function validateImage(file) {
  if(!file || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error(t('invalidImage'));
  if(file.size>state.maxImageMB*1024*1024) throw new Error(t('largeImage'));
  if(!file.size) throw new Error(t('invalidImage'));
}
async function setImage(file,target) {
  if(!file || (target==='scan' && state.scanBusy) || (target==='product' && state.saving)) return;
  try {
    validateImage(file);
    // Decode before enabling submission so a renamed non-image cannot be uploaded.
    const bitmap=await createImageBitmap(file); bitmap.close();
    if(target==='scan') {
      if(scanObjectURL) URL.revokeObjectURL(scanObjectURL);
      state.scanFile=file; scanObjectURL=URL.createObjectURL(file);
      $('#scan-preview').src=scanObjectURL; $('#scan-preview').hidden=false; $('#upload-empty').hidden=true; $('#remove-image').hidden=false; $('#image-meta').hidden=false; $('#image-filename').textContent=file.name; $('#scan-button').disabled=false;
    } else {
      if(productObjectURL) URL.revokeObjectURL(productObjectURL);
      state.productFile=file; productObjectURL=URL.createObjectURL(file);
      $('#product-preview').src=productObjectURL; $('#product-preview').hidden=false; $('#product-image-empty').hidden=true;
      $('#form-error').hidden=true;
    }
  } catch(error) { toast(error instanceof DOMException ? t('invalidImage') : error.message,true); }
}
function resetScan() { if(state.scanBusy) return; if(scanObjectURL) URL.revokeObjectURL(scanObjectURL); scanObjectURL=null; state.scanFile=null; $('#scan-preview').removeAttribute('src'); $('#scan-preview').hidden=true; $('#upload-empty').hidden=false; $('#remove-image').hidden=true; $('#image-meta').hidden=true; $('#scan-button').disabled=true; $('#scan-file').value=''; }
function openSource(target) { state.imageTarget=target; showModal('#source-dialog'); }
function selectFile() { closeModal('#source-dialog'); $(state.imageTarget==='scan'?'#scan-file':'#product-file').click(); }
async function scan() {
  if(!state.scanFile || state.scanBusy) return;
  state.scanBusy=true; $('#scan-button').disabled=true; $('#floating-camera').disabled=true; $('#remove-image').hidden=true; $('#scan-overlay').hidden=false; $('#dropzone').setAttribute('aria-busy','true');
  const form=new FormData(); form.append('image',state.scanFile);
  try { const result=await api('/getProductByImage',{method:'POST',body:form}); state.lastResult=result; renderResult(result); showModal('#result-dialog'); }
  catch(error) { if(error.status===404) {state.lastResult={noMatch:true};renderResult(state.lastResult);showModal('#result-dialog');} else toast(error.message,true); }
  finally { state.scanBusy=false; $('#scan-overlay').hidden=true; $('#scan-button').disabled=false; $('#floating-camera').disabled=false; $('#remove-image').hidden=false; $('#dropzone').setAttribute('aria-busy','false'); }
}
function renderResult(result) {
  if(result.noMatch) { $('#result-content').innerHTML=`<div class="no-match-icon">${icon('search')}</div><h2>${t('noMatch')}</h2><p class="result-description">${t('noMatchDesc')}</p>`; return; }
  const product=result.product;
  const similarity=Math.min(100,Math.max(0,Math.round(Number(result.similarity)*100)));
  $('#result-content').innerHTML=`<img class="result-image" src="${imageURL(product)}" alt="${escapeHTML(productName(product))}"><span class="match-badge">${icon('check')}${t('matchLabel')}</span><h2>${escapeHTML(productName(product))}</h2><p class="result-description">${escapeHTML(product.desc || t('noDescription'))}</p><p class="result-price">${price(product.price)}</p><p class="result-description">${t('similarity',{score:localNumber(similarity)})}</p><div class="similarity-bar"><span style="width:${similarity}%"></span></div>`;
}
function updatePagination() {
  $('#product-count').textContent=state.loading?'—':localNumber(state.total);
  $('#page-number').textContent=localNumber(state.page);
  $('#previous-page').disabled=state.loading || state.error || state.page<=1;
  $('#next-page').disabled=state.loading || state.error || state.page>=state.totalPages;
  $('#page-summary').textContent=state.loading?t('loading'):t('showing',{from:localNumber(state.total?(state.page-1)*state.pageSize+1:0),to:localNumber(Math.min(state.page*state.pageSize,state.total)),total:localNumber(state.total)});
}
function tableHead() { return `<thead><tr><th>${t('product')}</th><th>${t('description')}</th><th>${t('price')}</th><th>${t('dateAdded')}</th><th>${t('actions')}</th></tr></thead>`; }
function renderSkeleton() {
  const rows=Array.from({length:state.pageSize},()=>`<tr><td><div class="product-cell"><span class="skeleton skeleton-thumb"></span><div><span class="skeleton"></span><span class="skeleton skeleton-line"></span></div></div></td><td><span class="skeleton"></span></td><td><span class="skeleton" style="width:45px"></span></td><td><span class="skeleton" style="width:65px"></span></td><td><span class="skeleton" style="width:62px;height:30px"></span></td></tr>`).join('');
  const cards=Array.from({length:state.pageSize},()=>`<div class="product-mobile-card"><div class="mobile-card-main"><span class="skeleton skeleton-thumb"></span><div><span class="skeleton"></span><span class="skeleton skeleton-line"></span></div></div><div class="mobile-card-bottom"><span class="skeleton" style="width:50px"></span><span class="skeleton" style="width:72px;height:30px"></span></div></div>`).join('');
  $('#products-content').setAttribute('aria-busy','true');
  $('#products-content').innerHTML=`<div class="table-scroll" aria-hidden="true"><table class="product-table">${tableHead()}<tbody>${rows}</tbody></table></div><div class="mobile-products" aria-hidden="true">${cards}</div>`;
  updatePagination();
}
async function loadProducts() {
  productsController?.abort(); const controller=new AbortController();productsController=controller;
  state.loading=true;state.error=false;renderSkeleton();
  const params=new URLSearchParams({page:state.page,page_size:state.pageSize});if(state.search)params.set('search',state.search);
  try {
    const result=await api(`/products?${params}`,{signal:controller.signal});
    if(controller!==productsController) return;
    state.total=result.total;state.totalPages=result.total_pages;
    if(state.page>Math.max(1,state.totalPages)) {state.page=Math.max(1,state.totalPages);return loadProducts();}
    state.products=result.data;state.loaded=true;
  } catch(error) { if(error.name==='AbortError')return; if(controller!==productsController)return;state.error=true; }
  finally { if(controller===productsController) {state.loading=false;renderProducts();} }
}
function actionButtons(product) { return `<div class="row-actions"><button class="icon-button edit-action" data-action="edit" data-id="${escapeHTML(product.id)}" aria-label="${t('edit')} ${escapeHTML(productName(product))}" title="${t('edit')}">${icon('edit')}</button><button class="icon-button delete-action" data-action="delete" data-id="${escapeHTML(product.id)}" aria-label="${t('delete')} ${escapeHTML(productName(product))}" title="${t('delete')}">${icon('trash')}</button></div>`; }
function renderProducts() {
  $('#products-content').setAttribute('aria-busy','false');
  if(state.error) $('#products-content').innerHTML=`<div class="empty-state">${icon('box')}<h3>${t('loadError')}</h3><p>${t('networkError')}</p><button class="button button-outline" data-action="retry">${t('retry')}</button></div>`;
  else if(!state.products.length) $('#products-content').innerHTML=`<div class="empty-state">${icon(state.search?'search':'box')}<h3>${t(state.search?'noResults':'emptyTitle')}</h3><p>${t(state.search?'noResultsDesc':'emptyDesc')}</p><button class="button button-primary" data-action="${state.search?'clear':'add'}">${icon(state.search?'search':'plus')}${t(state.search?'clearSearch':'addProduct')}</button></div>`;
  else {
    const rows=state.products.map(product=> {
      const date=product.created_at?new Date(product.created_at):null;
      const formattedDate=date && !isNaN(date)?date.toLocaleDateString(language==='ar'?'ar-LB':'en-US',{year:'numeric',month:'short',day:'numeric'}):'—';
      return `<tr><td><div class="product-cell"><img class="product-thumbnail" src="${imageURL(product)}" alt="" loading="lazy"><div><strong dir="auto">${escapeHTML(productName(product))}</strong><small class="product-id">#${escapeHTML(product.id.slice(-8))}</small></div></div></td><td><div class="product-description" dir="auto" title="${escapeHTML(product.desc || '')}">${escapeHTML(product.desc || t('noDescription'))}</div></td><td><span class="product-price">${price(product.price)}</span></td><td><span class="product-date">${formattedDate}</span></td><td>${actionButtons(product)}</td></tr>`;
    }).join('');
    const cards=state.products.map(product=>`<article class="product-mobile-card"><div class="mobile-card-main"><img class="product-thumbnail" src="${imageURL(product)}" alt="" loading="lazy"><div><h3 dir="auto">${escapeHTML(productName(product))}</h3><p class="product-description" dir="auto">${escapeHTML(product.desc || t('noDescription'))}</p><span class="product-id">#${escapeHTML(product.id.slice(-8))}</span></div></div><div class="mobile-card-bottom"><span class="product-price">${price(product.price)}</span>${actionButtons(product)}</div></article>`).join('');
    $('#products-content').innerHTML=`<div class="table-scroll" tabindex="0" role="region" aria-label="${t('allProducts')}"><table class="product-table">${tableHead()}<tbody>${rows}</tbody></table></div><div class="mobile-products">${cards}</div>`;
  }
  updatePagination();
}
function openProduct(product=null) {
  state.editing=product;state.productFile=null;$('#product-form').reset();$('#form-error').hidden=true;
  if(productObjectURL)URL.revokeObjectURL(productObjectURL); productObjectURL=null;
  $('#product-dialog-title').textContent=t(product?'editProduct':'addProduct');
  $('#product-title').value=product?.title || '';$('#product-price').value=product?.price ?? '';$('#product-desc').value=product?.desc || '';
  $('#product-preview').hidden=!product;$('#product-image-empty').hidden=!!product;
  if(product)$('#product-preview').src=imageURL(product);else $('#product-preview').removeAttribute('src');
  $('#product-file').value='';showModal('#product-dialog');
}
async function saveProduct(event) {
  event.preventDefault();if(state.saving)return;
  $('#form-error').hidden=true;
  const title=$('#product-title').value.trim();
  if(!title || (!state.editing && !state.productFile)) {$('#form-error').textContent=t(!title?'requiredTitle':'requiredImage');$('#form-error').hidden=false;return;}
  const form=new FormData();form.append('title',title);form.append('price',$('#product-price').value);form.append('desc',$('#product-desc').value.trim());if(state.productFile)form.append('image',state.productFile);
  state.saving=true;$$('#product-form button, #product-form input, #product-form textarea').forEach(el=>{el.disabled=true;});$('#save-product').innerHTML=`<span class="spinner"></span>${t('saving')}`;
  try {
    await api(state.editing?`/products/${encodeURIComponent(state.editing.id)}`:'/addProduct',{method:state.editing?'PUT':'POST',body:form});
    state.imageVersion=Date.now();closeModal('#product-dialog');toast(t('saved'));
    if(!state.editing) {state.page=1;state.search='';$('#product-search').value='';}
    await loadProducts();
  } catch(error) {$('#form-error').textContent=error.message;$('#form-error').hidden=false;}
  finally {state.saving=false;$$('#product-form button, #product-form input, #product-form textarea').forEach(el=>{el.disabled=false;});$('#save-product').innerHTML=`${icon('check')}<span data-i18n="saveProduct">${t('saveProduct')}</span>`;}
}
function openDelete(product) {state.deleting=product;$('#delete-message').textContent=productName(product);$('#delete-error').hidden=true;showModal('#delete-dialog');}
async function deleteProduct() {
  if(!state.deleting || state.deleteBusy)return;
  state.deleteBusy=true;$$('#delete-dialog button').forEach(el=>{el.disabled=true;});$('#confirm-delete').textContent=t('deleting');
  try {await api(`/products/${encodeURIComponent(state.deleting.id)}`,{method:'DELETE'});closeModal('#delete-dialog');toast(t('deleted'));state.deleting=null;await loadProducts();}
  catch(error) {$('#delete-error').textContent=error.message;$('#delete-error').hidden=false;}
  finally {state.deleteBusy=false;$$('#delete-dialog button').forEach(el=>{el.disabled=false;});$('#confirm-delete').textContent=t('deleteProduct');}
}
function stopCamera() {state.cameraSession++;if(state.stream)state.stream.getTracks().forEach(track=>track.stop());state.stream=null;$('#camera-video').srcObject=null;$('#capture-photo').disabled=true;}
async function startCamera() {
  closeModal('#source-dialog');showModal('#camera-dialog');stopCamera();
  const session=state.cameraSession;$('#camera-message').textContent=t('cameraLoading');
  if(!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {$('#camera-message').textContent=t('cameraSecure');return;}
  try {
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1600},height:{ideal:1200}},audio:false});
    if(session!==state.cameraSession || !$('#camera-dialog').open) {stream.getTracks().forEach(track=>track.stop());return;}
    state.stream=stream;const video=$('#camera-video');video.srcObject=stream;await video.play();
    if(session!==state.cameraSession)return;
    $('#capture-photo').disabled=false;$('#camera-message').textContent=t('cameraReady');
  } catch(_) {if(session===state.cameraSession) {stopCamera();$('#camera-message').textContent=t('cameraError');}}
}
async function capturePhoto() {
  const video=$('#camera-video');if(!video.videoWidth || !video.videoHeight) {toast(t('cameraFailed'),true);return;}
  const canvas=document.createElement('canvas');const scale=Math.min(1,1600/video.videoWidth);canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
  const target=state.imageTarget;$('#capture-photo').disabled=true;
  canvas.toBlob(async blob=> {if(blob) {closeModal('#camera-dialog');await setImage(new File([blob],`photo-${Date.now()}.jpg`,{type:'image/jpeg'}),target);}else{toast(t('cameraFailed'),true);$('#capture-photo').disabled=false;}},'image/jpeg',.9);
}

$('#year').textContent=new Date().getFullYear();
$('#language-toggle').addEventListener('click',()=> {language=language==='ar'?'en':'ar';try {localStorage.setItem('basra-language',language);}catch(_){}translate();});
window.addEventListener('hashchange',route);
$('#browse-image').addEventListener('click',()=>$('#scan-file').click());
$('#floating-camera').addEventListener('click',()=>openSource('scan'));
$('#product-image-picker').addEventListener('click',()=>openSource('product'));
$('#source-upload').addEventListener('click',selectFile);
$('#start-camera').addEventListener('click',startCamera);
$('#capture-photo').addEventListener('click',capturePhoto);
$('#camera-fallback').addEventListener('click',()=>{closeModal('#camera-dialog');$('#capture-file').click();});
$('#camera-dialog').addEventListener('close',stopCamera);
document.addEventListener('visibilitychange',()=>{if(document.hidden && $('#camera-dialog').open)closeModal('#camera-dialog');});
window.addEventListener('pagehide',stopCamera);
[['#scan-file','scan'],['#product-file','product'],['#capture-file',null]].forEach(([selector,target])=>$(selector).addEventListener('change',event=> {const file=event.target.files[0];setImage(file,target || state.imageTarget);event.target.value='';}));
$('#remove-image').addEventListener('click',resetScan);$('#scan-button').addEventListener('click',scan);
['dragenter','dragover'].forEach(name=>$('#dropzone').addEventListener(name,event=>{event.preventDefault();if(!state.scanBusy)$('#dropzone').classList.add('dragging');}));
['dragleave','drop'].forEach(name=>$('#dropzone').addEventListener(name,event=>{event.preventDefault();$('#dropzone').classList.remove('dragging');}));
$('#dropzone').addEventListener('drop',event=>setImage(event.dataTransfer.files[0],'scan'));
$('#product-search').addEventListener('input',event=>{clearTimeout(searchTimer);state.search=event.target.value.trim();state.page=1;productsController?.abort();state.loading=true;renderSkeleton();searchTimer=setTimeout(loadProducts,300);});
$('#page-size').addEventListener('change',event=>{clearTimeout(searchTimer);state.pageSize=Number(event.target.value);state.page=1;loadProducts();});
$('#previous-page').addEventListener('click',()=>{if(state.page>1){state.page--;loadProducts();}});
$('#next-page').addEventListener('click',()=>{if(state.page<state.totalPages){state.page++;loadProducts();}});
$('#add-product').addEventListener('click',()=>openProduct());
$('#product-form').addEventListener('submit',saveProduct);$('#confirm-delete').addEventListener('click',deleteProduct);
$('#products-content').addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');if(!button)return;
  const product=state.products.find(item=>item.id===button.dataset.id);
  switch(button.dataset.action) {case 'edit':if(product)openProduct(product);break;case 'delete':if(product)openDelete(product);break;case 'add':openProduct();break;case 'retry':loadProducts();break;case 'clear':clearTimeout(searchTimer);state.search='';state.page=1;$('#product-search').value='';loadProducts();break;}
});
$$('[data-close]').forEach(button=>button.addEventListener('click',()=>closeModal(`#${button.dataset.close}`)));
$$('dialog').forEach(dialog=>{
  dialog.addEventListener('cancel',event=>{if((dialog.id==='product-dialog'&&state.saving)||(dialog.id==='delete-dialog'&&state.deleteBusy))event.preventDefault();});
  dialog.addEventListener('click',event=>{if(event.target===dialog && !state.saving && !state.deleteBusy) {const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)dialog.close();}});
});
// An unavailable product photo should not expose a broken-image icon.
document.addEventListener('error',event=>{if(event.target instanceof HTMLImageElement && event.target.src.includes('/products/')) {event.target.src='/static/placeholder.svg';}},true);
route();
api('/app-config').then(config=>{if(config.max_image_mb>0) {state.maxImageMB=config.max_image_mb;$$('[data-i18n="fileHint"]').forEach(el=>el.textContent=t('fileHint'));}}).catch(()=>{});
