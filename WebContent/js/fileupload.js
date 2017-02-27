'use strict';

var JFileUploader = React.createClass({
	displayName : 'JFileUploader',

	getDefaultProps : function() {
		return {
			className : 'jqm-doclist',
			restUrl : jsonRoot,
			disable : false
		};
	},

	uploadFile : function() {
		var files = this.refs.file.files;
		var fileCount = files.length;

		for (var i = 0; i < fileCount; i++) {
			// alert(files[i].name);
			if (files[i].size == 0) {
				alert(files[i].name);
			}
		}

		var reader = new FileReader();
		var sendFile = this.sendFileToServer;
		function readFile(index) {
			if (index >= fileCount){
				return;
			}
			reader.onload = function(event) {
				if (files[index].size <= (20 * 1024 * 1024)) {
					// uploadCounter++;
					var mimeType = files[index].type;// MimeType.lookup(files[index].name);
					sendFile(event.target.result.split(',')[1],
							files[index].name, '01', getID(), mimeType);
				} else {
					alert(files[index].name + ': размер файла превышает 20 MB');
					// clearFileInputField();
				}
				// if(index == fileCount - 1) refreshScreen();
				// readFile(index+1);
			};
			reader.readAsDataURL(files[index]);
		}
		readFile(0);
	},

	sendFileToServer : function(data, filename, scode, idreq, mimeType) {
		var callbackDoclist = this.props.callbackDoclist;
		var oReq = new XMLHttpRequest();
		var sEnc = Base64.encode(filename);
		var puturl = window.location.origin + jsonRoot + "?fn=" + sEnc
				+ '&idreq=' + idreq + '&sc=' + scode + '&mt=' + mimeType
				+ '&doctype=' + currentFolder;

		oReq.open("PUT", puturl, true);

		oReq.onreadystatechange = function() {
			try {
				if (oReq.readyState == 4) {
					if (oReq.status == 200) {
						var s = JSON.parse(oReq.responseText);
						if (s.error != undefined) {
							alert(s.error);
						} else {
							// alert(s.uuid);
							callbackDoclist(s.uuid);
						}
					} else {
						// var errjsonJson = JSON.parse(oReq.responseText);
					}
				}
			} catch (e) {
				alert(e);
			}
		};

		oReq.send(data);
	},

	componentWillMount : function() {
	},

	componentDidMount : function() {
	},

	componentWillUnmount : function() {
	},

	render : function() {
		if (this.props.disable) {
			return React.DOM.div();
		} else {
			return (React.DOM.div({
				className : "upload"
			}, React.DOM.input({
				ref : "file",
				type : "file",
				className : "upload-file",
				onChange : this.uploadFile.bind(this, '')
			}))
			);
		}
	}
});

JFileUploader = React.createFactory(JFileUploader);
