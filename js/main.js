(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    // Safety net: ensure nothing stays hidden if the observer misses an element.
    window.setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }, 2500);
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Footer year
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Contact form — submit via fetch, show inline status (no page reload).
  var form = document.getElementById("contactForm");
  if (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      status.className = "form-status";
      status.textContent = form.getAttribute("data-sending") || "…";
      btn.disabled = true;
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) {
            status.textContent = form.getAttribute("data-sent") || "OK";
            status.classList.add("ok");
            form.reset();
          } else {
            status.textContent = form.getAttribute("data-error") || "Error";
            status.classList.add("err");
          }
        })
        .catch(function () {
          status.textContent = form.getAttribute("data-error") || "Error";
          status.classList.add("err");
        })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
