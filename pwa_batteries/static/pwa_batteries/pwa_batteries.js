
function create_pwa(cache_name="pwa_batteries-v1", resource="pwa_batteries"){
  var o;
  o.init = caches.open(cache_name).then(function (cache) {
    cache.match(resource).then(function (response) {
      initial_state = JSON.parse(response.body)
      o.endpoint_url = initial_state["endpoint_url"];
      o.headers = initial_state["headers"];
    }
  }

  function _request(payload, requesttype, cache_item, use_fresh){
    var blob;
    if (typeof payload === 'string' || payload instanceof String){
      payloadstr = payload;
    } else {
      payloadstr = JSON.stringify(payload);
    }
    var reqHeaders = o.headers.clone()
    reqHeaders["Content-type"] = "application/json";
    reqHeaders["Content-length"] = payloadstr.length;
    reqHeaders["Connection"] = "close";
    if (cache_item){
      reqHeaders["pwa-cache-name"] = cache_item;
    }
    if (use_fresh){
      reqHeaders["pwa-cache-fresh"] = "true";
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
  o.fetch = function(payload, cache_name=null, use_fresh=false) {
    // request data
    return _request(payload, "POST", cache_name, use_fresh);
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
