'use strict';

var JFullPicture = React.createClass({
	displayName : 'JFullPicture',

	getDefaultProps : function() {
		return {
			className : 'jqm-docitem',
			src: "thumb.png",
			pdfSrc: "pdf.png",			
			loadSrc: "loading.gif",
			restUrl : jsonRoot
		};
	},
	
	componentWillMount : function() {
		this.setState({data: ''});
	},
	
	componentDidMount : function() {
		window.onresize = this.windowResize;
	},

	windowResize : function() {
		this.forceUpdate();
	},

	clickOpen : function(ev) {
		//alert('clickOpen');
		var w = screen.width/2;
		var h = screen.height - 120;
		var row = this.state.row;
		var wo = window.open('data:' + row.mimetype + ';base64,' + this.state.data, row.uuid, 'width=' + w + ',height=' + h);
		//wo.document.title = row.filename + ':' + row.uuid;
		//$(wo.document).find('html').append('<head><title>your title</title></head>');
	},
	
	forceReload : function(row) {
		// alert('JFullPicture:' + uuid);
		if(row == undefined){
			this.setState({data: ''});
			this.forceUpdate();
			return;
		}
		this.setState({loading: true});
		this.forceUpdate();
		
		this.setState({row: row});
		this.loadData(row.uuid, row.mimetype);
		
		// this.forceUpdate();
	},
	
	loadData : function(uuid, mimetype) {
		consoleLog('loadPicture...');
		$.ajax({
			url : this.props.restUrl,
			dataType : "text",
			data : {
				method : "getfile",
				uuid : uuid, 
				type : getType(),
				idrequest : getID()
			},
			success : function(data) {
				// alert('loadData:' + data);
				this.setState({loading: false});
				consoleLog('loadPicture:' + data.length);
				this.setState({data: data});
				this.forceUpdate();
			}.bind(this),
			error : function(xhr, status, err) {
				this.setState({loading: false});
				consoleLog(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	render : function() {
		consoleLog('fullPicture.render...');
		if(this.state.loading){			
			/*return (React.DOM.div(null, React.DOM.img( {src: this.props.loadSrc})));*/
			
			return (React.DOM.table({className: 'table-fullpicture'}, React.DOM.tbody(null, 
					React.DOM.tr(null, React.DOM.td({verticalAlign: "center", width: "180pt", height: "150pt"}, React.DOM.img( {src: this.props.loadSrc})))
					)));
		}
		var row = this.state.row;
		if(this.state.data.length > 0){
			var content = React.DOM.img( {src: 'picture.png', alt:this.props.name, width: 300});
			if(row.mimetype == 'image/jpeg'){
				content = React.DOM.img( {src: 'data:image/jpg;base64,' + this.state.data, alt:this.props.name, width: 300});
			} else if(row.mimetype == 'application/pdf'){
				var objectURL = getPdfObjectURL(this.state.data) + '#zoom=75';
				var h = window.innerHeight - 230;
				content = React.DOM.object( {data: objectURL, type:"application/pdf", width:"400pt", height:h+"pt"});
			}
			
			return (React.DOM.table({className: 'table-fullpicture'}, React.DOM.tbody(null, 
					React.DOM.tr(null, React.DOM.td({colSpan:"2"}, content)),
					React.DOM.tr(null, React.DOM.td(null, React.DOM.span({className: 'btn-open', onClick: this.clickOpen}, 'Открыть'))),
					React.DOM.tr(null, React.DOM.td(null, 'Тип:'), React.DOM.td(null, React.DOM.span(null, row.mimetype))),
					React.DOM.tr(null, React.DOM.td(null, 'Файл:'), React.DOM.td(null, React.DOM.span(null, row.filename))),
					React.DOM.tr(null, React.DOM.td(null, 'Логин:'), React.DOM.td(null, React.DOM.span(null, row.userlogin))),
					React.DOM.tr(null, React.DOM.td(null, 'ФИО:'), React.DOM.td(null, React.DOM.span(null, row.username))),
					React.DOM.tr(null, React.DOM.td(null, 'Должность:'), React.DOM.td(null, React.DOM.span(null, row.userposition))),
					React.DOM.tr(null, React.DOM.td(null, 'Отделение:'), React.DOM.td(null, React.DOM.span(null, row.userbranch))),
					React.DOM.tr(null, React.DOM.td(null, 'Время:'), React.DOM.td(null, React.DOM.span(null, row.signdatetime))),
					React.DOM.tr(null, React.DOM.td(null, 'Есть в ЭА:'), React.DOM.td(null, React.DOM.span(null, ((row.ecmstatus=='1')?'Да':'Нет'))))
					)
					));
		} else {
			return (React.DOM.p(null));
		}
	}
});
JFullPicture = React.createFactory(JFullPicture);
