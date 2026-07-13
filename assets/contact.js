// Shared contact handler (no bot token in client). Replace /api/send with your server endpoint.
(function(){
  function showSuccess(msg){
    var el = document.getElementById('success');
    if(!el) return;
    el.textContent = msg||el.textContent;
    el.style.display = 'block';
    setTimeout(function(){el.style.display = 'none';},5000);
  }

  function fallbackMail(phone, page){
    var subject = encodeURIComponent('Заявка с сайта: ' + (page||location.pathname));
    var body = encodeURIComponent('Телефон: ' + phone + '\nСтраница: ' + (page||location.href));
    window.location.href = 'mailto:contact@mobimedx.example?subject=' + subject + '&body=' + body;
  }

  var form = document.getElementById('tg');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var phone = (document.getElementById('user_phone')||{}).value || '';
    if(!phone || phone.length<10){
      showSuccess('Пожалуйста, укажите корректный телефон.');
      return;
    }

    // Try server endpoint first (recommended). Server should send to Telegram securely.
    fetch('/api/send', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({phone:phone, page:location.pathname})
    }).then(function(res){
      if(res.ok){
        (document.getElementById('user_phone')||{}).value='';
        showSuccess('Заявка отправлена. Мы скоро свяжемся.');
      } else {
        // fallback to mailto
        fallbackMail(phone, location.pathname);
        showSuccess('Сервер недоступен, откроется почта.');
      }
    }).catch(function(){
      // no server — fallback to mail
      fallbackMail(phone, location.pathname);
      showSuccess('Сервер недоступен, откроется почта.');
    });
  });
})();
