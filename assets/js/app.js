(() => {
 const devices = (window.FLASH_FORGE_DEVICES || []).slice().sort((a,b)=>a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
 const grid=document.getElementById("device-grid"), search=document.getElementById("device-search"), count=document.getElementById("result-count"), modal=document.getElementById("device-modal");
 let activeBrand="all";
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function render(){
  const q=(search.value||"").trim().toLowerCase();
  const rows=devices.filter(d=>(activeBrand==="all"||d.brand===activeBrand)&&[d.brand,d.model,String(d.year),d.category].join(" ").toLowerCase().includes(q));
  count.textContent=rows.length+" device"+(rows.length===1?"":"s")+" in starter index";
  grid.innerHTML=rows.length?rows.map(d=>`<button class="device-card" data-id="${esc(d.id)}"><span class="device-top"><span class="device-brand">${esc(d.brand.toUpperCase())}</span><span class="device-year">${esc(d.year)}</span></span><span class="device-thumb" aria-hidden="true"></span><h3>${esc(d.model)}</h3><small>${esc(d.category)} · View services ↗</small></button>`).join(""):'<p class="database-note">No matching device in the current starter index. More verified models will be added in batches.</p>';
 }
 function openDevice(id){
  const d=devices.find(x=>x.id===id);if(!d)return;
  document.getElementById("modal-brand").textContent=d.brand.toUpperCase()+" / "+d.year;
  document.getElementById("modal-title").textContent=d.model;
  document.getElementById("modal-description").textContent=d.description;
  document.getElementById("service-list").innerHTML=d.services.map(s=>`<div class="service-row"><span>${esc(s.name)}</span><span>${esc(s.price)}</span></div>`).join("");
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