// Sends Soci forms to book@socipizza.com via Web3Forms.
(function () {
  var ENDPOINT = 'https://api.web3forms.com/submit';
  var ACCESS_KEY = '0a445442-6022-4f68-a6e0-ef4ffae840a6'; // public key, safe in browser code
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
      // show dates the way you write them: "Saturday, June 12, 2027"
      form.querySelectorAll('input[type=date]').forEach(function (d) {
        if (d.value) data[d.name] = new Date(d.value + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      });
      if (data.botcheck) return; // spam bot filled the hidden field
      delete data.botcheck;
      // where they came from (first visit), saved by the site header script
      try {
        var s = JSON.parse(localStorage.getItem('soci_src') || 'null');
        if (s) { data['Source (auto-detected)'] = s.src; data['First page visited'] = s.landing; }
      } catch (e) {}
      data = (form.getAttribute('data-form') === 'booking') ? bookingEmail(data) : buildEmail(data);
      data.access_key = ACCESS_KEY;
      if (data.Email) data.replyto = data.Email;
      btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…';
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.success) throw new Error(j.message || 'Error'); }); })
        .then(function () {
          var go = form.getAttribute('data-redirect');
          if (go) { location.href = go; return; }
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
  function first(n) { return String(n || '').trim().split(/\s+/)[0] || 'Someone'; }
  // Subject shows the essentials on your phone's lock screen
  function bookingEmail(d) {
    var role = d['What role will Soci Pizza play?'], pkg = d['Which package are you interested in?'];
    var guests = d['How many guests will be eating pizza?'];
    var out = {
      subject: '🍕 ' + first(d.Name) + "'s booking request, " + (d['Event date'] || 'date TBD') + ' (' + (pkg || 'package TBD') + ', ' + (guests || '?') + ' guests) · ' + (d['Event location'] || ''),
      from_name: 'Soci Pizza 🍕 New booking request',
      'Guests': guests, 'Date': d['Event date'], 'Time': d['Service time'], 'Location': d['Event location'],
      'Package': pkg, 'Role': role, 'Name': d.Name, 'Email': d.Email, 'Phone': d.Phone,
      'Notes': d["Anything else you'd like to share?"] || '—',
      'How they found us': d['How did you find us?'] || '—',
      'Source (auto-detected)': d['Source (auto-detected)'] || 'Unknown', 'First page visited': d['First page visited'] || '—'
    };
    return out;
  }
  function buildEmail(d) {
    var name = ((d['First Name'] || '') + ' ' + (d['Last Name'] || '')).trim();
    var out = { subject: '🛻 Soci Build request · ' + name + ' · ' + (d['What type of business is it for?'] || '') + ' · Budget: ' + (d['What is the approximate budget for your project?'] || '?'), from_name: 'Soci Build 🛻 New request' };
    for (var k in d) out[k] = d[k];
    return out;
  }

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
