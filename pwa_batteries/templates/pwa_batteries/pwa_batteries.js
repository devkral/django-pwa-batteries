

function create_pwa(){
  var o = new Object();
{% block pwa_batteries_config %}
  o.endpoint_url = '{% url "pwa_endpoint_json" %}';
  o.headers = '{% url "pwa_endpoint_json" %}';
{% endblock %}

  function _request(payload, requesttype, cache_item, pwa_cache_control){
    var blob;
    if (typeof payload === 'string' || payload instanceof String){
      payloadstr = payload;
    } else {
      payloadstr = JSON.stringify(payload);
    }
    var reqHeaders = Object.assign({}, o.headers);
    reqHeaders["Content-type"] = "application/json";
    reqHeaders["Content-length"] = payloadstr.length;
    reqHeaders["Connection"] = "close";
    if (cache_item){
      reqHeaders["pwa-cache-name"] = cache_item;
    }
    if (pwa_cache_control){
      reqHeaders["pwa-cache-control"] = pwa_cache_control;
    }

    var initReq = {
      method: requesttype,
      body: payloadstr,
      headers: reqHeaders,
      mode: 'cors',
      cache: 'default',
      credentials: 'include'
    };
    return fetch(new Request(o.endpoint_url, initReq));
  };

  // fetch pwa model data
  o.fetch = function(payload, cache_item=null, pwa_cache_control=null) {
    // request data
    return _request(payload, "POST", cache_item, pwa_cache_control);
  };

  // update pwa model data
  o.update = function(payload) {
    return _request(payload, "PUT", null, false);
  };

  // delete pwa model data
  o.delete = function(payload) {
    return _request(payload, "DELETE", null, false);
  };

  return o;
};

{% block pwa_batteries_init %}
pwa = create_pwa();
{% endblock %}
