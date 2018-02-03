{% load static %}

{% block pwa_initial_state %}
cached_urls = ['{% url "pwa_batteries_helper" %}'];
cache_name = "pwa_batteries-v1";
{% endblock %}


{% block pwa_helpers %}

function use_cache(cache_ob_name) {
  return caches.open(cache_name).then(function (cache) {
    return cache.match(cache_ob_name).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

// return in error case old cache object
function update_and_return(request, cache_ob_name) {
  return caches.open(cache_name).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(cache_ob_name, response).then(function(){
        return response;
      });
    }, function (response) {
      return cache.match(cache_ob_name).then(function (matching) {
        return matching || Promise.reject('no-match');
      });
    });
  });
}

{% endblock %}




{% block pwa_install %}
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cache_name).then(function (cache) {
      return cache.addAll(cached_urls);
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
  // use pwa-cache-name if available
  var cache_ob_name;
  if (event.request.headers["pwa-cache-name"]){
    cache_ob_name = event.request.headers["pwa-cache-name"];
  } else {
    cache_ob_name = event.request;
  }

  // fetch if not POST and endpoint or GET
  if ((event.request.method !== "POST" ||  event.request.url.indexOf('{% url "pwa_endpoint_json" %})' == -1)) && event.request.method !== "GET"){
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.headers["pwa-cache-fresh"] === "true"){
    // use fresh object
    event.respondWith(update_and_return(event.request, cache_ob_name));
  } else {
    //if request in cache then return it, otherwise fetch it from the network
    event.respondWith(use_cache(cache_ob_name) || fetch(event.request));
  }
});
{% endblock %}
