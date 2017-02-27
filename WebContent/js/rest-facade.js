'use strict';

var Rest = {
  ajaxContext: function(){
	  var w = window.location.pathname;
	  if(w.indexOf('.html') > 0){
		  w = w.substring(0, w.lastIndexOf('/'));
	  }
	  if(w.lastIndexOf('/') != w.length - 1){
		  w = w + '/'; 
	  }
	  return w + 'json';
  },
  
  ajax: function(data, success, error) {
	  consoleLog('ajax...' + data.method);
	  data.digest = Store.get('digest');
	  $.ajax({
		  url : this.ajaxContext,
		  dataType : "json",
		  async : true,
		  data : data,
		  success : success.bind(this),
		  error : error.bind(this)
	  });
  },
  
  ajax2: function(data, onSuccess, onError) {
	  consoleLog('ajax2...' + data.method);
	  if(!data.method){
		  return;
	  }
	  data.digest = Store.get('digest');
	  if(data.forcelogin){
		  data.name = data.forcelogin;
		  data.user = data.forcelogin;
	  } else {
		  data.name = Store.get('login');
	  }
	  
	  Object.keys(data).forEach(function(key) {
	        //console.log(data[key]);
		  data[key] = encodeURI(data[key]);
	    });
	  
	  $.ajax({
		  url : this.ajaxContext(),
		  dataType : "json",
		  async : true,
		  data : data,
		  success : function(data){
			  if(data.error){
				  	consoleLog('Error: ' + data.error);
					alert(data.error);
					if(data.error.indexOf('поставьте флажок, что вы не робот') >= 0){
						location.reload();
					}
					if(onError){
						onError(data.error);
					}
					return;
			  }
			  if(data.access){
				  	consoleLog('Access: ' + data.access);
					alert(data.access);
					if(onError){
						onError(data.access);
					}
					return;
			  }
			  if(data.route && appRoute){
				  appRoute(data.route);
				  return;
			  }			  
			  if(onSuccess){
				  onSuccess(data);
			  }			  
		  }.bind(this),
		  error : function(a, b, c){alert(data.method + '.err:' + c.toString())}.bind(this)
	  });
  },
  
  login1: function(name, password, success, error) {
	  var data = {
			  method : "login",
			  name : name,
			  password : password
	  };
	  this.ajax(data, success, error);
  },
  
  getuser1: function(name, success, error) {
	  var data = {
			  method : "getuser",
			  name : name
	  };
	  this.ajax(data, success, error);
  }
}
