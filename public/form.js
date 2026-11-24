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
          var go = form.getAttribute('data-redirect'), kind = form.getAttribute('data-form');
          // Analytics: one event per real submission (not per thank-you page view)
          var evName = kind === 'booking' ? 'booking_submitted' : kind + '_submitted';
          if (go) {
            var done = false, leave = function () { if (!done) { done = true; location.href = go; } };
            if (window.gtag) { gtag('event', evName, { form: kind, event_callback: leave, event_timeout: 1500 }); setTimeout(leave, 1600); } else leave();
            return;
          }
          form.innerHTML = '<p class="form-thanks">' + form.getAttribute('data-thanks') + '</p>';
          if (window.gtag) {
            if (ADS_SEND_TO) gtag('event', 'conversion', { send_to: ADS_SEND_TO });
            gtag('event', 'generate_lead', { form: form.getAttribute('data-form') });
            gtag('event', evName, { form: kind });
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
    var name = ((d['First Name'] || '') + ' ' + (d['Last Name'] || '')).trim();
    var out = {
      subject: 'Form Submission - Booking Request',
      from_name: 'Soci Pizza',
      'Guests': guests, 'Date': d['Event date'], 'Time': d['Service time'], 'Location': d['Event location'],
      'Package': pkg || 'Not picked', 'Role': role, 'Name': name, 'Email': d.Email, 'Phone': d.Phone,
      'Notes': d["Anything else you'd like to share?"] || '—',
      'How they found us': d['How did you find us?'] || '—',
      'Keep me posted': d['Keep me posted'] === 'Yes' ? 'Yes' : 'No',
      'Source (auto-detected)': d['Source (auto-detected)'] || 'Unknown', 'First page visited': d['First page visited'] || '—'
    };
    return out;
  }
  function buildEmail(d) {
    var name = ((d['First Name'] || '') + ' ' + (d['Last Name'] || '')).trim();
    var out = { subject: 'Form Submission - Soci Build Request', from_name: 'Soci Pizza' };
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

  // Address / venue autocomplete (Mapbox Search Box, biased to the Triangle)
  var MAPBOX = window.SOCI_MAPBOX || '';
  document.querySelectorAll('input[data-address]').forEach(function (inp) {
    var session = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()), list = document.createElement('ul'), timer, items = [], active = -1;
    list.className = 'addr-list'; list.hidden = true; inp.parentNode.appendChild(list);
    function close() { list.hidden = true; active = -1; }
    function pick(i) {
      var it = items[i]; if (!it) return;
      inp.value = it.name && it.full && it.full.indexOf(it.name) !== 0 ? it.name + ', ' + it.full : (it.full || it.name);
      close();
      fetch('https://api.mapbox.com/search/searchbox/v1/retrieve/' + it.id + '?session_token=' + session + '&access_token=' + MAPBOX).catch(function () {});
    }
    function render() {
      list.innerHTML = '';
      items.forEach(function (it, i) {
        var li = document.createElement('li'); li.className = i === active ? 'on' : '';
        li.innerHTML = '<strong></strong><small></small>'; li.firstChild.textContent = it.name; li.lastChild.textContent = it.full || '';
        li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(i); });
        list.appendChild(li);
      });
      list.hidden = !items.length;
    }
    inp.addEventListener('input', function () {
      clearTimeout(timer); var q = inp.value.trim();
      if (q.length < 3) { items = []; render(); return; }
      timer = setTimeout(function () {
        fetch('https://api.mapbox.com/search/searchbox/v1/suggest?q=' + encodeURIComponent(q) + '&language=en&country=us&limit=5&types=address,poi,place&proximity=-78.9,35.8&session_token=' + session + '&access_token=' + MAPBOX)
          .then(function (r) { return r.json(); })
          .then(function (j) { items = (j.suggestions || []).map(function (s) { return { id: s.mapbox_id, name: s.name, full: s.full_address || s.place_formatted || '' }; }); active = -1; render(); })
          .catch(function () {});
      }, 250);
    });
    inp.addEventListener('keydown', function (e) {
      if (list.hidden) return;
      if (e.key === 'ArrowDown') { active = Math.min(active + 1, items.length - 1); render(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { active = Math.max(active - 1, 0); render(); e.preventDefault(); }
      else if (e.key === 'Enter' && active > -1) { pick(active); e.preventDefault(); }
      else if (e.key === 'Escape') close();
    });
    inp.addEventListener('blur', function () { setTimeout(close, 150); });
  });
})();

// Event dates: only today through 5 years ahead, so a typo like year 0001 can't be submitted
(function () {
  var t = new Date(), iso = function (d) { return d.toISOString().slice(0, 10); };
  var max = new Date(t); max.setFullYear(t.getFullYear() + 5);
  document.querySelectorAll('form[data-form] input[type=date]').forEach(function (d) { d.min = iso(t); d.max = iso(max); });
})();
