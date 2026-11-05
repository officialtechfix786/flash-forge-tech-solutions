(() => {
 const devices=(window.FLASH_FORGE_DEVICES||[]).slice().sort((a,b)=>a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
 const software=Array.from(new Map((window.FLASH_FORGE_SOFTWARE||[]).map(x=>[x.id,x])).values());
 const grid=document.getElementById("device-grid"),search=document.getElementById("device-search"),count=document.getElementById("result-count"),modal=document.getElementById("device-modal");
 let activeBrand="all";
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const brandDomain={Apple:"apple.com",Samsung:"samsung.com",Vivo:"vivo.com",Xiaomi:"mi.com",OPPO:"oppo.com",Infinix:"infinixmobility.com",Tecno:"tecno-mobile.com",Google:"google.com",OnePlus:"oneplus.com",Motorola:"motorola.com",Realme:"realme.com",Huawei:"huawei.com",Nokia:"nokia.com"};
 function render(){
  const q=(search.value||"").trim().toLowerCase();
  const matchedDevices=devices.filter(d=>(activeBrand==="all"||d.brand===activeBrand)&&[d.brand,d.model,String(d.year),d.category].join(" ").toLowerCase().includes(q));
  const matchedSoftware=q?software.filter(s=>[s.name,s.type,s.platform,s.description,s.keywords,s.category].join(" ").toLowerCase().includes(q)).slice(0,50):[];
  count.textContent=matchedDevices.length+" devices"+(q?" · "+matchedSoftware.length+" software/tools":"")+" in shared database";
  const deviceCards=matchedDevices.map(d=>{const domain=brandDomain[d.brand]||"google.com";const art=d.category==="iPhone"?"assets/images/category-iphone.svg":"assets/images/category-android.svg";return '<button class="device-card" data-id="'+esc(d.id)+'"><span class="device-top"><span class="device-brand"><img src="https://www.google.com/s2/favicons?domain='+domain+'&sz=64" alt="" loading="lazy">'+esc(d.brand.toUpperCase())+'</span><span class="device-year">'+esc(d.year)+'</span></span><span class="device-thumb" style="background-image:url(\''+art+'\')"></span><h3>'+esc(d.model)+'</h3><small>'+esc(d.category)+' · View services ↗</small></button>';}).join("");
  const toolCards=matchedSoftware.map(s=>'<a class="device-card software-result" href="downloads.html#'+esc(s.category)+'"><span class="device-top"><span class="device-brand">SOFTWARE / '+esc(s.category.toUpperCase())+'</span><span class="device-year">↗</span></span><span class="tool-result-icon">⬡</span><h3>'+esc(s.name)+'</h3><small>'+esc(s.type)+' · Open publisher link in downloads ↗</small></a>').join("");
  grid.innerHTML=(deviceCards+toolCards)||'<p class="database-note">No matching device or software found in the current database.</p>';
 }
 function openDevice(id){
  const d=devices.find(x=>x.id===id);if(!d)return;
  document.getElementById("modal-brand").textContent=d.brand.toUpperCase()+" / "+d.year;
  document.getElementById("modal-title").textContent=d.model;
  document.getElementById("modal-description").textContent=d.description;
  document.getElementById("service-list").innerHTML=d.services.map(s=>'<div class="service-row"><span>'+esc(s.name)+'</span><span>'+esc(s.price)+'</span></div>').join("");
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
 }
 function close(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";}
 grid.addEventListener("click",e=>{const card=e.target.closest("[data-id]");if(card)openDevice(card.dataset.id)});
 search.addEventListener("input",render);
 document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelector(".filter.active")?.classList.remove("active");b.classList.add("active");activeBrand=b.dataset.brand;render()}));
 modal.addEventListener("click",e=>{if(e.target.matches("[data-close]"))close()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
 const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav-links");menu.addEventListener("click",()=>{const shown=nav.classList.toggle("show");menu.setAttribute("aria-expanded",String(shown))});
 document.getElementById("year").textContent=new Date().getFullYear();render();
})();