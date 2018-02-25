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
  var cache_ob_name=null;
  if (event.request.headers["pwa-cache-name"]){
    cache_ob_name = event.request.headers["pwa-cache-name"];
  }

  // fetch if GET or (not POST and endpoint and cache name)
  if (event.request.method !== "GET" && \
      (event.request.method !== "POST" ||  \
      event.request.url.indexOf('{% url "pwa_endpoint_json" %})' == -1) || \
      !cache_ob_name)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // set cache_ob_name to request if not set
  if (!cache_ob_name){
    cache_ob_name = event.request;
  }

  switch(event.request.headers["pwa-cache-control"]){
    case "fresh":
      // use fresh object if possible and update cache
      // fallback to cache
      event.respondWith(update_and_return(event.request, cache_ob_name) || use_cache(cache_ob_name));
      break;
    case "onlyfresh":
      // use fresh object if possible and update cache
      // no fallback to cache
      event.respondWith(update_and_return(event.request, cache_ob_name)));
      break;
    case "onlycache":
      // use cache only
      event.respondWith((use_cache(cache_ob_name));
      break;
    case "failupdate":
    default:
      // if the request is cached return it,
      // otherwise try to fetch it from the network and update cache
      event.respondWith(use_cache(cache_ob_name) || update_and_return(event.request, cache_ob_name));
  }
});
{% endblock %}
