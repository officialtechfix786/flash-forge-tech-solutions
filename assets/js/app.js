(() => {
 const devices=(window.FLASH_FORGE_DEVICES||[]).slice().sort((a,b)=>a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
 const grid=document.getElementById("device-grid"),search=document.getElementById("device-search"),count=document.getElementById("result-count"),modal=document.getElementById("device-modal");
 let activeBrand="all";
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function render(){
  const q=(search.value||"").trim().toLowerCase();
  const rows=devices.filter(d=>(activeBrand==="all"||d.brand===activeBrand)&&[d.brand,d.model,String(d.year),d.category,d.description].join(" ").toLowerCase().includes(q));
  count.textContent=rows.length+" models • "+new Set(rows.map(d=>d.brand)).size+" brands in current catalog";
  grid.innerHTML=rows.length?rows.map(d=>'<button class="device-card" data-id="'+esc(d.id)+'"><span class="device-top"><span class="device-brand">'+esc(d.brand.toUpperCase())+'</span><span class="device-year">'+esc(d.year)+'</span></span><span class="device-image"><img src="'+esc(d.image)+'" alt="'+esc(d.brand+" "+d.model)+'" loading="lazy" onerror="this.closest(\'.device-image\').classList.add(\'image-fallback\');this.remove()"></span><h3>'+esc(d.model)+'</h3><small>'+esc(d.category)+' · Open device details ↗</small></button>').join(""):'<p class="database-note">No matching model in the current catalog. Try another brand or model name.</p>';
  const brands=[...new Set(devices.map(d=>d.brand))].sort((a,b)=>a.localeCompare(b));
  const strip=document.getElementById("brand-strip");
  if(strip)strip.innerHTML=brands.map(b=>'<button class="brand-chip '+(activeBrand===b?'active':'')+'" data-brand-chip="'+esc(b)+'">'+esc(b)+'</button>').join("");
 }
 function openDevice(id){
  const d=devices.find(x=>x.id===id);if(!d)return;
  document.getElementById("modal-brand").textContent=d.brand.toUpperCase()+" / "+d.year;
  document.getElementById("modal-title").textContent=d.model;
  document.getElementById("modal-description").textContent=d.description;
  const image=document.getElementById("modal-image");image.src=d.image;image.alt=d.brand+" "+d.model;
  const specs=document.getElementById("spec-grid");
  specs.innerHTML=Object.entries(d.specs||{}).map(([k,v])=>'<div><small>'+esc(k.replace(/([A-Z])/g," $1"))+'</small><b>'+esc(v)+'</b></div>').join("");
  document.getElementById("service-list").innerHTML=(d.services||[]).map(s=>'<div class="service-row"><span>'+esc(s.name)+'</span><span>'+esc(s.price)+'</span></div>').join("");
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
 }
 function close(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";}
 grid.addEventListener("click",e=>{const card=e.target.closest("[data-id]");if(card)openDevice(card.dataset.id)});
 search.addEventListener("input",()=>{activeBrand="all";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.brand==="all"));render()});
 document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelector(".filter.active")?.classList.remove("active");b.classList.add("active");activeBrand=b.dataset.brand;render()}));
 document.getElementById("brand-strip")?.addEventListener("click",e=>{const b=e.target.closest("[data-brand-chip]");if(!b)return;activeBrand=b.dataset.brandChip;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.brand===activeBrand));render()});
 modal.addEventListener("click",e=>{if(e.target.matches("[data-close]"))close()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
 const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav-links");menu?.addEventListener("click",()=>{const shown=nav.classList.toggle("show");menu.setAttribute("aria-expanded",String(shown))});
 const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
 render();
})();