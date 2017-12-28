function create_pwa(furl, uurl, durl, init_cache={}){
  o.fetch_url = furl;
  o.update_url = uurl;
  o.delete_url = durl;
  o.cache = init_cache;

  // real request
  function _request(payload, url, callback_func){
    if (typeof payload === 'string' || payload instanceof String){
      payloadstr = payload;
    } else {
      payloadstr = JSON.stringify(payload);
    }

    var xmlHttp = new XMLHttpRequest();
    if (callback_func){
      xmlHttp.open("POST", url, true); // async request
      xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          callback_func(JSON.parse(http.responseText));
        }
      };
    } else{
      xmlHttp.open("POST", url, false); // sync request
    }
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.setRequestHeader("Content-length", payloadstr.length);
    xmlHttp.setRequestHeader("Connection", "close");
    xmlHttp.send(payloadstr);
    if (callback_func){
      return undefined;
    } else {
      return JSON.parse(xmlHttp.responseText);
    }
  };
  function _update_cache_cb(name, callback_func){
    return function(data){
      o.cache[name] = data;
      if(callback_func){
        callback_func(data);
      }
    };
  };

  // fetch pwa model data
  o.fetch = function(payload, callback_func=null, name=null) {
    var callback_f = callback_func;
    if (name && (callback_func || o.cache[name])){
      callback_f = _update_cache_cb(name, callback_func);
    }
    // request data
    var ret = _request(payload, o.fetch_url, callback_f);
    if (name && (o.cache[name] || callback_func)){
      return o.cache[name];
    } else if(name && !o.cache[name]){
      // update cache synchronously
      o.cache[name] = ret;
    }
    return ret;
  };

  // update pwa model data
  o.update = function(payload, callback_func=null) {
    return _request(payload, o.update_url, callback_func);
  };

  // delete pwa model data
  o.delete = function(payload, callback_func=null) {
    return _request(payload, o.delete_url, callback_func);
  };
  return o;
};
