// TastyBites — form validation + inline success message
(function () {
  "use strict";

  var CSS = ''
    + '.field-error{border-color:#d4421a!important;background:#fff2ee!important}'
    + '.error-message{color:#d4421a;font-size:.85rem;margin-top:6px;font-weight:600}'
    + '.form-success{background:#fff;border:2px solid #4caf50;border-radius:12px;padding:32px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.06);max-width:700px;margin:0 auto}'
    + '.form-success h3{color:#2e7d32;margin-bottom:8px;font-family:"Fredoka One",cursive;font-size:1.6rem}'
    + '.form-success p{color:#7a6455;margin-bottom:20px}'
    + '.form-success button{background:#d4421a;color:#fff;border:none;padding:12px 28px;border-radius:8px;font-family:"Nunito",sans-serif;font-weight:700;cursor:pointer}'
    + '.form-success button:hover{background:#b8350f}';

  document.addEventListener("DOMContentLoaded", function () {
    injectCSS(CSS, "tb-forms-css");
    document.querySelectorAll("form.form-card").forEach(initForm);
  });

  function injectCSS(css, id) {
    if (document.getElementById(id)) return;
    var s = document.createElement("style"); s.id = id; s.textContent = css;
    document.head.appendChild(s);
  }

  function initForm(form) {
    form.setAttribute("novalidate", "novalidate");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(form);
      var errors = validate(form);
      if (errors.length) { showErrors(form, errors); return; }
      showSuccess(form);
    });
    form.querySelectorAll("input,select,textarea").forEach(function (f) {
      f.addEventListener("input", function () {
        f.classList.remove("field-error");
        var m = f.parentElement.querySelector(".error-message");
        if (m) m.remove();
      });
    });
  }

  function validate(form) {
    var errors = [];
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    form.querySelectorAll("input,select,textarea").forEach(function (f) {
      var v = (f.value || "").trim();
      if (f.hasAttribute("required") && !v) { errors.push({ field: f, msg: "This field is required." }); return; }
      if (v && f.type === "email" && !emailRe.test(v)) errors.push({ field: f, msg: "Please enter a valid email address." });
      if (v && f.type === "tel" && !/^[0-9+\-()\s]{7,}$/.test(v)) errors.push({ field: f, msg: "Please enter a valid phone number." });
    });
    return errors;
  }

  function showErrors(form, errors) {
    errors.forEach(function (err) {
      err.field.classList.add("field-error");
      var n = document.createElement("p");
      n.className = "error-message"; n.textContent = err.msg;
      err.field.parentElement.appendChild(n);
    });
    errors[0].field.focus();
  }

  function clearErrors(form) {
    form.querySelectorAll(".field-error").forEach(function (f) { f.classList.remove("field-error"); });
    form.querySelectorAll(".error-message").forEach(function (m) { m.remove(); });
  }

  function showSuccess(form) {
    var first = form.querySelector('input[name="firstName"],input[name="contactName"]');
    var name = first ? (first.value || "").trim().split(" ")[0] : "";
    var s = document.createElement("div");
    s.className = "form-success";
    s.innerHTML = '<h3>&#10004; Thank you' + (name ? ", " + esc(name) : "") + "!</h3>"
      + "<p>Your message has been received. We'll get back to you within 24 hours.</p>"
      + '<button type="button">Send Another</button>';
    form.style.display = "none";
    form.parentElement.insertBefore(s, form);
    s.querySelector("button").addEventListener("click", function () {
      form.reset(); form.style.display = ""; s.remove();
    });
  }

  function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
})();
