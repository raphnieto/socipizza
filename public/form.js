// Sends Soci forms to book@socipizza.com via Web3Forms.
(function () {
  var ENDPOINT = 'https://api.web3forms.com/submit';
  var ACCESS_KEY = 'WEB3FORMS_KEY';
  // Google Ads conversion label for booking requests (fill in from Google Ads > Goals > Conversions)
  var ADS_SEND_TO = window.SOCI_ADS_SEND_TO || '';
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var status = form.querySelector('.form-status');
      var data = {};
      new FormData(form).forEach(function (v, k) {
        if (data[k]) data[k] += ', ' + v; else data[k] = v;
      });
      // "Other" text boxes replace the word "Other"
      form.querySelectorAll('[data-other-for]').forEach(function (inp) {
        var key = inp.getAttribute('data-other-for');
        if (data[key] === 'Other' && inp.value.trim()) data[key] = 'Other: ' + inp.value.trim();
        delete data[inp.name];
      });
      if (data.botcheck) return; // spam bot filled the hidden field
      delete data.botcheck;
      data.access_key = ACCESS_KEY;
      data.subject = form.getAttribute('data-subject');
      data.from_name = 'Soci Pizza website';
      if (data.Email) data.replyto = data.Email;
      btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…';
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.success) throw new Error(j.message || 'Error'); }); })
        .then(function () {
          form.innerHTML = '<p class="form-thanks">' + form.getAttribute('data-thanks') + '</p>';
          if (window.gtag) {
            if (ADS_SEND_TO) gtag('event', 'conversion', { send_to: ADS_SEND_TO });
            gtag('event', 'generate_lead', { form: form.getAttribute('data-form') });
          }
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = btn.dataset.label;
          status.textContent = 'Sorry, something went wrong. Please email book@socipizza.com or call (667) 290-4315.';
        });
    });
  });
  // show/hide "Other" text boxes
  document.querySelectorAll('[data-other-for]').forEach(function (inp) {
    var key = inp.getAttribute('data-other-for');
    var form = inp.form;
    function sync() {
      var sel = form.querySelector('[name="' + key + '"]:checked') || form.querySelector('select[name="' + key + '"]');
      var on = sel && sel.value === 'Other';
      inp.hidden = !on;
    }
    form.addEventListener('change', sync); sync();
  });
})();
