{% load static %}


{% block pwa_cached_urls %}
cached_urls = ['{% static "pwa_batteries/pwa_batteries.js" %}']
{% endblock %}

{% block pwa_initial_state %}
initial_state = {}
{% endblock %}

{% block pwa_install %}
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cache_name).then(function (cache) {
      var p1 = cache.addAll(cached_urls);
      var p2 = cache.put("initial", initial_state);
      return Promise.all([p1, p2]);
    })
  );
});
{% endblock %}
