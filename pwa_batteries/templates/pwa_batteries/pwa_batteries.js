

function create_pwa(){
  var o = new Object();
{% block pwa_batteries_config %}
  o.endpoint_url = '{% url "pwa_endpoint_json" %}';
  o.headers = {};
{% endblock %}

  function _request(payload, requesttype, cache_item, cache_control){
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

    var initReq = {
      method: requesttype,
      body: payloadstr,
      headers: reqHeaders,
      mode: 'cors',
      cache: cache_control,
      credentials: 'include'
    };
    return fetch(new Request(o.endpoint_url, initReq));
  };

  // fetch pwa model data
  o.fetch = function(payload, cache_item=null, cache_control="default") {
    // request data
    return _request(payload, "POST", cache_item, cache_control);
  };

  // update pwa model data
  o.update = function(payload) {
    return _request(payload, "PUT", null, "no-store");
  };

  // delete pwa model data
  o.delete = function(payload) {
    return _request(payload, "DELETE", null, "no-store");
  };

  return o;
};

{% block pwa_batteries_init %}
pwa = create_pwa();
{% endblock %}
