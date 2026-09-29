'use strict';
const menu=document.querySelector('#site-nav');
const toggle=document.querySelector('.menu-toggle');
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','فتح القائمة');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'إغلاق القائمة':'فتح القائمة');});
menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.masthead'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open')){closeMenu();toggle.focus();}});
matchMedia('(min-width:901px)').addEventListener('change',closeMenu);
document.querySelectorAll('.year').forEach(span=>span.textContent=new Date().getFullYear());

const gallery=document.querySelector('#gallery');
if(gallery){
const galleryItems=[...document.querySelectorAll('.portfolio-item')];
const filters=document.querySelector('.gallery-filters');
const more=document.querySelector('#showMore');
const count=document.querySelector('#galleryCount');
let activeFilter='all',visibleLimit=6;
function filteredItems(){return galleryItems.filter(item=>activeFilter==='all'||item.dataset.category===activeFilter);}
function update(){const items=filteredItems();galleryItems.forEach(item=>item.hidden=true);items.slice(0,visibleLimit).forEach(item=>item.hidden=false);more.hidden=visibleLimit>=items.length;count.textContent=`عرض ${Math.min(visibleLimit,items.length)} من ${items.length} صورة`;}
filters.hidden=false;
filters.addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button)return;activeFilter=button.dataset.filter;visibleLimit=6;filters.querySelectorAll('button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});update();});
more.addEventListener('click',()=>{const items=filteredItems();const next=items[visibleLimit];visibleLimit=items.length;update();next?.focus({preventScroll:true});});
update();
const lightbox=document.querySelector('#lightbox');
let currentImage=0,imageSet=[],opener;
function displayImage(index){currentImage=(index+imageSet.length)%imageSet.length;const item=imageSet[currentImage];const image=document.querySelector('#lightboxImage');image.src=item.getAttribute('href');image.alt=item.querySelector('img').alt;document.querySelector('#lightboxTitle').textContent=item.dataset.title;document.querySelector('#lightboxLabel').textContent=item.dataset.label;document.querySelector('#lightboxCounter').textContent=`${currentImage+1} / ${imageSet.length}`;}
gallery.addEventListener('click',event=>{const item=event.target.closest('.portfolio-item');if(!item||event.ctrlKey||event.metaKey)return;event.preventDefault();opener=item;imageSet=filteredItems();displayImage(imageSet.indexOf(item));lightbox.showModal();document.body.classList.add('lightbox-open');});
document.querySelector('#closeLightbox').addEventListener('click',()=>lightbox.close());
document.querySelector('#nextImage').addEventListener('click',()=>displayImage(currentImage+1));
document.querySelector('#previousImage').addEventListener('click',()=>displayImage(currentImage-1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();displayImage(currentImage+1);}if(event.key==='ArrowRight'){event.preventDefault();displayImage(currentImage-1);}});
lightbox.addEventListener('click',event=>{if(event.target===lightbox){const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();}});
lightbox.addEventListener('close',()=>{document.body.classList.remove('lightbox-open');if(opener.hidden){visibleLimit=imageSet.length;update();}opener.focus({preventScroll:true});});
let touchStart=null;
lightbox.addEventListener('touchstart',event=>{touchStart=event.changedTouches[0].clientX;},{passive:true});
lightbox.addEventListener('touchend',event=>{if(touchStart===null)return;const delta=event.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>65)displayImage(currentImage+(delta>0?1:-1));touchStart=null;},{passive:true});
}
