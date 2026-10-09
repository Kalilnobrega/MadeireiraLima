(function () {
  "use strict";

  const cfg = window.SITE_CONFIG;
  if (!cfg) return;

  const $$ = (sel) => document.querySelectorAll(sel);
  const { address: addr, map, whatsapp: wa } = cfg;

  const igRaw = ((cfg.social || {}).instagram || "").trim();
  const igUser = igRaw.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").split(/[/?#]/)[0];
  const igUrl = igUser ? `https://www.instagram.com/${igUser}/` : "";

  const cityState = `${addr.city}/${addr.state}`;
  const binds = {
    storeName: cfg.storeName,
    slogan: cfg.slogan,
    street: addr.street,
    cityState,
    districtCity: addr.district ? `${addr.district} — ${cityState}` : cityState,
    whatsappDisplay: wa.display,
    instagramHandle: igUser ? `@${igUser}` : "",
  };
  $$("[data-bind]").forEach((el) => {
    const value = binds[el.dataset.bind];
    if (value != null) el.textContent = value;
  });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  const waUrl = `https://wa.me/${wa.number.replace(/\D/g, "")}?text=${encodeURIComponent(wa.message)}`;
  $$("[data-whatsapp]").forEach((a) => (a.href = waUrl));

  $$("[data-instagram]").forEach((a) => {
    if (igUrl) a.href = igUrl;
    else (a.closest("[data-instagram-block]") || a).hidden = true;
  });

  const fullAddress = [addr.street, addr.district, `${addr.city} - ${addr.state}`, addr.zip]
    .filter(Boolean)
    .join(", ");
  const hasCoords = typeof map.lat === "number" && typeof map.lng === "number";
  const mapQuery = hasCoords ? `${map.lat},${map.lng}` : `${addr.city}, ${addr.state}`;
  const mapZoom = hasCoords ? map.zoom : 15;

  $$("[data-map]").forEach((f) => {
    f.src = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${mapZoom}&output=embed`;
  });
  $$("[data-maps-link]").forEach((a) => {
    a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  });

  const hoursEl = document.querySelector("[data-hours]");
  if (hoursEl) {
    hoursEl.innerHTML = "";
    cfg.hours.forEach((h) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = h.short;
      dd.textContent = `${h.open} às ${h.close}`;
      row.append(dt, dd);
      hoursEl.append(row);
    });
  }
  $$("[data-hours-inline]").forEach((el) => {
    el.innerHTML = "";
    cfg.hours.forEach((h, i) => {
      if (i) el.append(document.createElement("br"));
      el.append(`${h.short}: ${h.open} às ${h.close}`);
    });
  });

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: cfg.timezone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    const now = `${get("hour")}:${get("minute")}`;
    const isOpen = cfg.hours.some((h) => h.days.includes(day) && now >= h.open && now < h.close);

    $$("[data-open-badge], [data-open-status]").forEach((el) => {
      el.textContent = isOpen ? "Aberto agora" : "Fechado agora";
      el.classList.add(isOpen ? "is-open" : "is-closed");
      el.hidden = false;
    });
  } catch {}

  const socialEl = document.querySelector("[data-social]");
  const socialNames = { facebook: "Facebook" };
  if (socialEl) {
    Object.entries(cfg.social || {}).forEach(([key, url]) => {
      if (!url || key === "instagram") return; // Instagram já tem destaque próprio
      const li = document.createElement("li");
      li.innerHTML = `<a href="" target="_blank" rel="noopener" aria-label="${socialNames[key] || key}">
        <svg class="icon" aria-hidden="true"><use href="#i-${key}"/></svg></a>`;
      li.querySelector("a").href = url;
      socialEl.append(li);
    });
    socialEl.hidden = !socialEl.children.length;
  }

  const ld = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: cfg.storeName,
    slogan: cfg.slogan,
    telephone: `+${wa.number.replace(/\D/g, "")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: addr.street,
      addressLocality: addr.city,
      addressRegion: addr.state,
      postalCode: addr.zip || undefined,
      addressCountry: "BR",
    },
    openingHoursSpecification: cfg.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]),
      opens: h.open,
      closes: h.close,
    })),
    sameAs: Object.values(cfg.social || {}).filter(Boolean),
  };
  if (hasCoords) ld.geo = { "@type": "GeoCoordinates", latitude: map.lat, longitude: map.lng };
  const ldScript = document.createElement("script");
  ldScript.type = "application/ld+json";
  ldScript.textContent = JSON.stringify(ld);
  document.head.append(ldScript);

  const pending = [];
  if (/X/i.test(wa.display) || /^55\d{2}90{8}$/.test(wa.number)) pending.push("número do WhatsApp");
  if (/exemplo/i.test(addr.street)) pending.push("endereço");
  if (!hasCoords) pending.push("coordenadas do mapa");
  if (pending.length) {
    console.warn(`[Madeireira Lima] Dados provisórios em assets/js/config.js: ${pending.join(", ")}.`);
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.Lenis && !reduceMotion) {
    new window.Lenis({
      autoRaf: true,
      lerp: 0.08, // menor = mais suave
      anchors: true,
    });
  }

  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const sticky = document.querySelector(".sticky-wa");
  const heroBtn = document.querySelector(".hero .btn-whatsapp");
  const hideZones = [document.querySelector(".site-footer")];
  if (sticky && heroBtn && "IntersectionObserver" in window) {
    const state = new Map();
    const update = () => {
      const heroVisible = state.get(heroBtn) !== false;
      const zoneVisible = hideZones.some((z) => state.get(z));
      sticky.classList.toggle("is-shown", !heroVisible && !zoneVisible);
    };
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => state.set(e.target, e.isIntersecting));
      update();
    });
    [heroBtn, ...hideZones].filter(Boolean).forEach((el) => so.observe(el));
  }
})();
