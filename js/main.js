// Napvera — small enhancements (the site works without JavaScript)
(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

// Contact form
// To connect a backend, set data-endpoint on <form id="contact-form"> in index.html.
// Fields are POSTed as FormData: name, company, email, phone, type, message.
// Until an endpoint is set, the form opens the visitor's email app instead.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var TO = 'info@napvera.com';
  var status = document.getElementById('cf-status');
  var button = form.querySelector('button[type="submit"]');
  var controls = form.querySelectorAll('input:not([type="radio"]):not([name="website"]), textarea');

  function setStatus(message, state) {
    status.textContent = message;
    if (state) status.setAttribute('data-state', state);
    else status.removeAttribute('data-state');
  }

  function matches(el, selector) {
    try { return el.matches(selector); } catch (e) { return false; }
  }

  // Keep aria-invalid in step with the error the visitor can see
  function syncAria(el) {
    if (!el || !el.willValidate || el.type === 'radio') return;
    var shown = form.classList.contains('was-submitted') ? !el.validity.valid : matches(el, ':user-invalid');
    if (shown) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  }
  form.addEventListener('blur', function (e) { syncAria(e.target); }, true);
  form.addEventListener('input', function (e) {
    if (e.target.getAttribute('aria-invalid') === 'true') syncAria(e.target);
  });

  function clearState() {
    form.classList.remove('was-submitted');
    controls.forEach(function (el) { el.removeAttribute('aria-invalid'); });
  }

  function openEmail(data) {
    var body = [
      'Name: ' + data.get('name'),
      'Company: ' + (data.get('company') || '-'),
      'Email: ' + data.get('email'),
      'Phone: ' + (data.get('phone') || '-'),
      'I am a: ' + data.get('type'),
      '',
      data.get('message')
    ].join('\n');
    var subject = 'Website inquiry from ' + data.get('name');
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    setStatus('Your email app is opening with your message. Press send there to finish.');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Spam trap: people never see this field
    if (form.elements.website && form.elements.website.value) return;

    if (!form.checkValidity()) {
      form.classList.add('was-submitted');
      controls.forEach(syncAria);
      var first = form.querySelector('input:invalid, textarea:invalid');
      if (first) first.focus();
      setStatus('Please fill in the highlighted fields.', 'error');
      return;
    }

    var data = new FormData(form);
    data.delete('website');
    var endpoint = (form.getAttribute('data-endpoint') || '').trim();

    if (!endpoint) {
      openEmail(data);
      return;
    }

    button.disabled = true;
    setStatus('Sending your message…');
    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        clearState();
        setStatus('Message sent. We will reply by email.', 'success');
      })
      .catch(function () {
        setStatus('Your message was not sent. Please try again, or email us at ' + TO + '.', 'error');
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
