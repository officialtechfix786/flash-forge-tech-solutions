(() => {
 const devices=Array.from(new Map((window.FLASH_FORGE_DEVICES||[]).map(d=>[d.id,d])).values()).sort((a,b)=>a.brand.localeCompare(b.brand)||b.year-a.year||a.model.localeCompare(b.model));
 const software=Array.from(new Map((window.FLASH_FORGE_SOFTWARE||[]).map(x=>[x.id,x])).values());
 const brandDirectory=document.getElementById("brand-directory");
 const grid=document.getElementById("device-grid"),search=document.getElementById("device-search"),count=document.getElementById("result-count"),modal=document.getElementById("device-modal"),brandStrip=document.getElementById("brand-strip");
 let activeBrand="all";
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const brands=[...new Set(devices.map(d=>d.brand))].sort((a,b)=>a.localeCompare(b));
 brandStrip.innerHTML='<button class="brand-chip active" data-brand="all">All Brands</button>'+brands.map(b=>'<button class="brand-chip" data-brand="'+esc(b)+'">'+esc(b)+'</button>').join("");
 if(brandDirectory)brandDirectory.innerHTML=brands.map(b=>{const n=devices.filter(d=>d.brand===b).length;return '<button class="brand-tile" data-brand="'+esc(b)+'"><span class="brand-tile-mark">'+esc(b.slice(0,2).toUpperCase())+'</span><span><b>'+esc(b)+'</b><small>'+n+' models listed</small></span><i>↗</i></button>'}).join("");
 function render(){
  const q=(search.value||"").trim().toLowerCase();
  const matchedDevices=devices.filter(d=>(activeBrand==="all"||d.brand===activeBrand)&&[d.brand,d.model,String(d.year),d.category,Object.values(d.specs||{}).join(" ")].join(" ").toLowerCase().includes(q));
  const matchedSoftware=q?software.filter(s=>[s.name,s.type,s.platform,s.description,s.keywords,s.category].join(" ").toLowerCase().includes(q)).slice(0,40):[];
  count.textContent=matchedDevices.length+" mobile models"+(q?" · "+matchedSoftware.length+" matching tools":"")+" · "+brands.length+" brands";
  const deviceCards=matchedDevices.map(d=>'<button class="device-card" data-id="'+esc(d.id)+'"><span class="device-top"><span class="device-brand">'+esc(d.brand.toUpperCase())+'</span><span class="device-year">'+esc(d.year)+'</span></span><span class="device-image"><img src="'+esc(d.image||"assets/images/category-android.svg")+'" alt="'+esc(d.brand+" "+d.model)+'" loading="lazy" onerror="this.onerror=null;this.src='assets/images/category-android.svg';this.alt='Device photo unavailable';this.parentElement.classList.add('image-fallback')"></span><h3>'+esc(d.model)+'</h3><small>'+esc(d.category)+' · View details & services ↗</small></button>').join("");
  const toolCards=matchedSoftware.map(s=>'<a class="device-card software-result" href="'+(s.category==="pc"?"pc-software.html":s.category==="android"?"android-tools.html":"iphone-tools.html")+'"><span class="device-top"><span class="device-brand">SOFTWARE / '+esc(s.category.toUpperCase())+'</span><span class="device-year">↗</span></span><span class="tool-result-icon">⬡</span><h3>'+esc(s.name)+'</h3><small>'+esc(s.type)+' · Open publisher link in downloads ↗</small></a>').join("");
  grid.innerHTML=(deviceCards+toolCards)||'<p class="database-note">No matching device or software found in this selection.</p>';
 }
 function openDevice(id){const d=devices.find(x=>x.id===id);if(d)window.location.href="device.html?id="+encodeURIComponent(d.id);}
 function close(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";}
 grid.addEventListener("click",e=>{const card=e.target.closest("[data-id]");if(card)openDevice(card.dataset.id)});
 search.addEventListener("input",render);
 function selectBrand(b){if(!b)return;activeBrand=b.dataset.brand;brandStrip.querySelector(".active")?.classList.remove("active");brandStrip.querySelector('[data-brand="'+CSS.escape(activeBrand)+'"]')?.classList.add("active");render();document.getElementById("devices")?.scrollIntoView({behavior:"smooth"});}
 brandStrip.addEventListener("click",e=>selectBrand(e.target.closest("[data-brand]")));
 if(brandDirectory)brandDirectory.addEventListener("click",e=>selectBrand(e.target.closest("[data-brand]")));
 modal.addEventListener("click",e=>{if(e.target.matches("[data-close]"))close()});document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
 const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav-links");if(menu&&nav)menu.addEventListener("click",()=>{const shown=nav.classList.toggle("show");menu.setAttribute("aria-expanded",String(shown))});
 const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();render();
})();