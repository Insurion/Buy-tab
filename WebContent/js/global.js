'use strict';

var currentFolder = '';
var currentDoc = '';
var jsonRoot = '/json';
var reqestParams = {};
var user = {};
var appRoute;

var Base64 = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode : function(e) {
		var t = "";
		var n, r, i, s, o, u, a;
		var f = 0;
		e = Base64._utf8_encode(e);
		while (f < e.length) {
			n = e.charCodeAt(f++);
			r = e.charCodeAt(f++);
			i = e.charCodeAt(f++);
			s = n >> 2;
			o = (n & 3) << 4 | r >> 4;
			u = (r & 15) << 2 | i >> 6;
			a = i & 63;
			if (isNaN(r)) {
				u = a = 64;
			} else if (isNaN(i)) {
				a = 64;
			}
			t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o)
					+ this._keyStr.charAt(u) + this._keyStr.charAt(a);
		}
		return t;
	},
	decode : function(e) {
		var t = "";
		var n, r, i;
		var s, o, u, a;
		var f = 0;
		e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (f < e.length) {
			s = this._keyStr.indexOf(e.charAt(f++));
			o = this._keyStr.indexOf(e.charAt(f++));
			u = this._keyStr.indexOf(e.charAt(f++));
			a = this._keyStr.indexOf(e.charAt(f++));
			n = s << 2 | o >> 4;
			r = (o & 15) << 4 | u >> 2;
			i = (u & 3) << 6 | a;
			t = t + String.fromCharCode(n);
			if (u != 64) {
				t = t + String.fromCharCode(r);
			}
			if (a != 64) {
				t = t + String.fromCharCode(i);
			}
		}
		t = Base64._utf8_decode(t);
		return t;
	},
	_utf8_encode : function(e) {
		e = e.replace(/\r\n/g, "\n");
		var t = "";
		for (var n = 0; n < e.length; n++) {
			var r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r);
			} else if (r > 127 && r < 2048) {
				t += String.fromCharCode(r >> 6 | 192);
				t += String.fromCharCode(r & 63 | 128);
			} else {
				t += String.fromCharCode(r >> 12 | 224);
				t += String.fromCharCode(r >> 6 & 63 | 128);
				t += String.fromCharCode(r & 63 | 128);
			}
		}
		return t;
	},
	_utf8_decode : function(e) {
		var t = "";
		var n = 0;
		// var r = c1 = c2 = 0;
		var r = 0;
		var c2 = 0;
		var c3 = 0;
		while (n < e.length) {
			r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r);
				n++;
			} else if (r > 191 && r < 224) {
				c2 = e.charCodeAt(n + 1);
				t += String.fromCharCode((r & 31) << 6 | c2 & 63);
				n += 2;
			} else {
				c2 = e.charCodeAt(n + 1);
				c3 = e.charCodeAt(n + 2);
				t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3
						& 63);
				n += 3;
			}
		}
		return t;
	}
};

var isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i);
	    },
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i);
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
};

var getPdfObjectURL = function(data) {
	var blob = b64toBlob(data, 'application/pdf');
	var urlSrc = URL.createObjectURL(blob);
	return urlSrc;
};

/**
 * Return idrequest from url request
 */
var getID = function() {
	if (reqestParams['idrequest'] == undefined) {
		parseRequest();
	}

	return reqestParams['idrequest'];
};

/**
 * Return type from url request
 */
var getType = function() {
	if (reqestParams['type'] == undefined) {
		parseRequest();
	}

	return reqestParams['type'];
};

/**
 * Return mode from url request
 */
var getMode = function() {
	if (reqestParams['mode'] == undefined) {
		parseRequest();
	}

	return reqestParams['mode'];
};

/**
 * Return mode from url request
 */
var getDoctype = function() {
	if (reqestParams['doctype'] == undefined) {
		parseRequest();
	}

	return reqestParams['doctype'];
};

function parseRequest() {
	var urlVar = window.location.search;
	var arrayVar = []; // ������ ��� �������� ����������
	var valueAndKey = []; // ������ ��� ���������� �������� �������� � �����
	// ����������
	var i = 0;
	arrayVar = (urlVar.substr(1)).split('&');
	if (arrayVar[0] == "")
		return '96c97583-eaed-4177-a903-4e52eda00c1e';
	for (i = 0; i < arrayVar.length; i++) {
		valueAndKey = arrayVar[i].split('=');
		reqestParams[valueAndKey[0]] = valueAndKey[1];
	}
}

function TypedArray(arg1) {
	function subarray(start, end) {
		return this.slice(start, end);
	}

	function set_(array, offset) {
		if (arguments.length < 2)
			offset = 0;
		for (var i = 0, n = array.length; i < n; ++i, ++offset)
			this[offset] = array[i] & 0xFF;
	}
	var result;
	if (typeof arg1 === "number") {
		result = new Array(arg1);
		for (var i = 0; i < arg1; ++i)
			result[i] = 0;
	} else
		result = arg1.slice(0);
	result.subarray = subarray;
	result.buffer = result;
	result.byteLength = result.length;
	result.set = set_;
	if (typeof arg1 === "object" && arg1.buffer)
		result.buffer = arg1.buffer;

	return result;
}

var b64toBlob = function(b64Data, contentType, sliceSize) {
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	//var byteCharacters = Base64.decode(b64Data);
	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);
		// var byteArray = TypedArray(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, {
		type : contentType
	});
	return blob;
};

function consoleLog(text) {
	try {
		if (typeof console !== 'undefined') {
	        console.debug(text);
	      }
	} catch (e) {

	}
}

function checkMaskedDate(masked_date) {
	if(!masked_date){
		return true;
	}
	var dt = masked_date.value();
	if(dt){
		var formats = [moment.ISO_8601, 'DD.MM.YYYY'];
		if(!moment(dt, formats, true).isValid()){
			alert('Неверная Дата');
			return false;
		}
	}
	return true;
}

function num2(v) {
	if(!v){
		return Number(0).toFixed(2);
	}
	return Number(v).toFixed(2);
}