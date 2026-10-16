```javascript
"use strict";

/* =========================================
   قعدة مبدعين — التفاعلات الأساسية
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. عناصر الواجهة */

  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  const navLinks = document.querySelectorAll(".primary-nav a");

  const backToTop = document.querySelector(".back-to-top");

  const copyrightYear = document.querySelector("#copyright-year");


  /* =========================================
     2. تحديث سنة حقوق النشر
  ========================================= */

  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }


  /* =========================================
     3. قائمة التنقل على الهاتف
  ========================================= */

  function closeMenu() {

    if (!menuToggle || !primaryNav) {
      return;
    }

    menuToggle.setAttribute("aria-expanded", "false");

    primaryNav.classList.remove("is-open");

    const label = menuToggle.querySelector(".visually-hidden");

    if (label) {
      label.textContent = "فتح قائمة التنقل";
    }
  }


  function openMenu() {

    if (!menuToggle || !primaryNav) {
      return;
    }

    menuToggle.setAttribute("aria-expanded", "true");

    primaryNav.classList.add("is-open");

    const label = menuToggle.querySelector(".visually-hidden");

    if (label) {
      label.textContent = "إغلاق قائمة التنقل";
    }
  }


  if (menuToggle && primaryNav) {

    menuToggle.addEventListener("click", () => {

      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }

    });


    /* إغلاق القائمة بعد اختيار قسم */

    navLinks.forEach((link) => {

      link.addEventListener("click", () => {
        closeMenu();
      });

    });


    /* إغلاق القائمة عند الضغط على Escape */

    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {

        const isExpanded =
          menuToggle.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
          closeMenu();
          menuToggle.focus();
        }

      }

    });


    /* إغلاق القائمة عند الانتقال إلى شاشة كبيرة */

    window.addEventListener("resize", () => {

      if (window.innerWidth > 800) {
        closeMenu();
      }

    });

  }


  /* =========================================
     4. زر العودة إلى أعلى الصفحة
  ========================================= */

  function updateBackToTop() {

    if (!backToTop) {
      return;
    }

    if (window.scrollY > 450) {

      backToTop.classList.add("is-visible");

    } else {

      backToTop.classList.remove("is-visible");

    }

  }


  window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
  );


  updateBackToTop();


  if (backToTop) {

    backToTop.addEventListener("click", () => {

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });

    });

  }


  /* =========================================
     5. تحديد القسم الحالي في قائمة التنقل
  ========================================= */

  const observedSections = Array.from(navLinks)
    .map((link) => {

      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return null;
      }

      return document.querySelector(href);

    })
    .filter(Boolean);


  function setActiveLink(sectionId) {

    navLinks.forEach((link) => {

      const isActive =
        link.getAttribute("href") === `#${sectionId}`;

      if (isActive) {

        link.classList.add("is-active");

        link.setAttribute("aria-current", "location");

      } else {

        link.classList.remove("is-active");

        link.removeAttribute("aria-current");

      }

    });

  }


  if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
      (entries) => {

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {

            return b.intersectionRatio - a.intersectionRatio;

          });

        if (visibleEntries.length > 0) {

          setActiveLink(visibleEntries[0].target.id);

        }

      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );


    observedSections.forEach((section) => {

      sectionObserver.observe(section);

    });

  }


  /* =========================================
     6. فحص الصور وإظهار بديل عند الفشل
  ========================================= */

  const images = document.querySelectorAll("img");


  images.forEach((img) => {

    function markImageFailure() {

      const figure = img.closest("figure");

      const container = figure || img.parentElement;

      if (!container || container.querySelector(".image-fallback")) {
        return;
      }

      const fallback = document.createElement("div");

      fallback.className = "image-fallback";

      fallback.setAttribute("role", "status");

      fallback.textContent =
        "تعذر تحميل الصورة. تحققي من اسم الملف ومساره.";

      fallback.style.cssText = `
        min-height: 140px;
        padding: 24px;
        display: grid;
        place-items: center;
        text-align: center;
        background: #D8DFD4;
        color: #263F38;
        border: 1px solid #B17B54;
        font-family: "IBM Plex Sans Arabic", Tahoma, sans-serif;
        font-size: 13px;
        line-height: 1.9;
      `;

      img.hidden = true;

      container.appendChild(fallback);

    }


    img.addEventListener("error", markImageFailure);


    /* فحص الصور التي فشل تحميلها قبل تفعيل المستمع */

    if (img.complete && img.naturalWidth === 0) {
      markImageFailure();
    }

  });


  /* =========================================
     7. الروابط الخارجية
  ========================================= */

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {

    if (!link.relList.contains("noopener")) {
      link.relList.add("noopener");
    }

    if (!link.relList.contains("noreferrer")) {
      link.relList.add("noreferrer");
    }

  });


  /* =========================================
     8. التحقق من وجود أهداف الروابط الداخلية
  ========================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);

    if (!target) {

      console.warn(
        `رابط داخلي يشير إلى قسم غير موجود: ${href}`
      );

    }

  });


  /* =========================================
     9. تسجيل نجاح تهيئة الواجهة
  ========================================= */

  document.documentElement.classList.add("js-ready");

});
```
