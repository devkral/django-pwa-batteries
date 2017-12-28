function create_pwa(endpoint_url, initial_state={}){
  o.endpoint_url = endpoint_url;
  if (initial_state["cache"]){
    o.cache = initial_state["cache"];
  } else {
    o.cache = {};
  }
  if (initial_state["headers"]){
    o.headers = initial_state["headers"];
  } else {
    o.headers = {};
  }

  if (initial_state["timeout"]){
    o.timeout = initial_state["timeout"];
  } else {
    o.timeout = 0;
  }

  // real request
  function _request(payload, requesttype, callback_func, timeout){
    if (typeof payload === 'string' || payload instanceof String){
      payloadstr = payload;
    } else {
      payloadstr = JSON.stringify(payload);
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(requesttype, o.endpoint_url, true); // async request
    xmlHttp.onreadystatechange = function() {
      if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        callback_func(JSON.parse(http.responseText));
      }
    };
    if (timeout){
      xmlHttp.timeout = timeout
    } else {
      xmlHttp.timeout = o.timeout
    }
    for (var header in o.headers) {
      xmlHttp.setRequestHeader(header, o.headers[header]);
    }
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.setRequestHeader("Content-length", payloadstr.length);
    xmlHttp.setRequestHeader("Connection", "close");
    xmlHttp.send(payloadstr);
  };
  function _update_cache_cb(name, callback_func){
    return function(data){
      o.cache[name] = data;
      callback_func(data);
    };
  };

  // fetch pwa model data
  o.fetch = function(payload, callback_func, name=null, timeout=null) {
    var callback_f = callback_func;
    if (name && (callback_func || o.cache[name])){
      callback_f = _update_cache_cb(name, callback_func);
    }
    // request data
    var ret = _request(payload, "POST", callback_f, timeout);
    if (name && o.cache[name]){
      return o.cache[name];
    }
    return undefined;
  };

  // update pwa model data
  o.update = function(payload, callback_func) {
    return _request(payload, "PUT", callback_func, 0);
  };

  // delete pwa model data
  o.delete = function(payload, callback_func) {
    return _request(payload, "DELETE", callback_func, 0);
  };
  return o;
};
