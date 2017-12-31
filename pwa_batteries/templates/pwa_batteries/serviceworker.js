{% load static %}

{% block pwa_initial_state %}
cached_urls = ['{% static "pwa_batteries/pwa_batteries.js" %}'];
initial_state = {endpoint_url: '{% url "pwa_endpoint_json" %}'};
cache_name = "pwa_batteries-v1";
{% endblock %}

{% block pwa_install %}
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cache_name).then(function (cache) {
      var p1 = cache.addAll(cached_urls);
      var p2 = cache.put("pwa_batteries", initial_state);
      return Promise.all([p1, p2]);
    })
  );
});
{% endblock %}


{% block pwa_activate %}
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});
{% endblock %}



{% block pwa_fetch %}
self.addEventListener('fetch', function (event) {

  // live reload function
  if (event.request.url.indexOf('/browser-sync/') !== -1) {
    //fetch(..) is the new XMLHttpRequest
    event.respondWith(fetch(event.request));
    return;
  }
  // don't use cache
  if (event.request.url.indexOf('{% url "pwa_endpoint_json" %})' !== -1 && (event.request.method == "PUT" || event.request.method == "DELETE") ) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.headers["pwa-cache-name"] && event.request.method == "POST"){
    cache_name = event.request.headers["pwa-cache-name"];
  } else {
    cache_name = event.request;
  }

  //if request in cache then return it, otherwise fetch it from the network
  event.respondWith(
    caches.match(cache_name).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
{% endblock %}
