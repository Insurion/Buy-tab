'use strict';

var LocalStore = {
  set: function(name, value) {
	  localStorage.setItem(name, value);
	  //console.log('store.set.' + name + '.' + value);
  },
  
  remove: function(name) {
	  localStorage.removeItem(name);
  },
  
  get: function(name){
	  return (localStorage.getItem(name) == undefined)?'':localStorage.getItem(name);
  },
  
  setCookie: function (name, value, expires, path, domain, secure) {
      document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
  }
}

var Store = {
		  set: function(name, value) {
			  var date = new Date;
			  date.setDate(date.getDate() + 1);
			  
			  this.setCookie(name, value, date, '/');
		  },
		  
		  remove: function(name) {
			  setCookie(name, '', -1)
		  },
		  
		  get: function(name) {
				var cookie = " " + document.cookie;
				var search = " " + name + "=";
				var setStr = null;
				var offset = 0;
				var end = 0;
				if (cookie.length > 0) {
					offset = cookie.indexOf(search);
					if (offset != -1) {
						offset += search.length;
						end = cookie.indexOf(";", offset)
						if (end == -1) {
							end = cookie.length;
						}
						setStr = unescape(cookie.substring(offset, end));
					}
				}
				return(setStr);
			},
		  
		  setCookie: function (name, value, expires, path, domain, secure) {
		      document.cookie = name + "=" + escape(value) +
		        ((expires) ? "; expires=" + expires : "") +
		        ((path) ? "; path=" + path : "");
		        //((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
		  }
		}

//const Store = new JLocalStorage();