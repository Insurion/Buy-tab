'use strict';

var JDocItem = React.createClass({
	displayName : 'JDocItem',

	getDefaultProps : function() {
		return {
			className : 'jqm-docitem',
			pdfSrc: "pdf2.png",
			src: "picture2.png"
		};
	},

	handleClick : function(ev) {
		//alert('click');
		this.props.callbackParent(this.props.row);
		this.setState({uuid: currentDoc});
	},

	componentDidMount : function() {

	},

	render : function() {
		//console.log('docitem.render...');
		var className = 'table-row';
		className = (currentDoc == this.props.row.uuid)?className + ' row-selected':className;
		
		return (React.DOM.table({className : className}, React.DOM.tbody(null, React.DOM.tr({onClick: this.handleClick}, 
				React.DOM.td({id: "docitem_1"}, React.DOM.img( {src: (this.props.row.mimetype == 'application/pdf')?this.props.pdfSrc:this.props.src, alt:this.props.row.filename})),
				React.DOM.td({id: "docitem_2"}, React.DOM.p(null, React.DOM.span(null, this.props.row.filename))),
				React.DOM.td({id: "docitem_3"}, React.DOM.p(null, React.DOM.span(null, this.props.row.userlogin))),
				React.DOM.td({id: "docitem_3"}, React.DOM.p(null, React.DOM.span(null, this.props.row.username))),
				React.DOM.td({id: "docitem_3"}, React.DOM.p(null, React.DOM.span(null, this.props.row.signdatetime)))
		))));
		
		/*return (React.DOM.div({className: "div-item-cont", onClick: this.handleClick}, 
				React.DOM.div({className: "div-left"}, React.DOM.img( {src: (this.props.mimetype == 'application/pdf')?this.props.pdfSrc:this.props.src, alt:this.props.filename})),
				React.DOM.div({className: "div-left div-200px div-font10"}, React.DOM.p(null, React.DOM.span(null, this.props.filename))),
				React.DOM.div({className: "div-left div-200px div-font10"}, React.DOM.p(null, React.DOM.span(null, this.props.signdatetime)))
		));*/
	}
});
JDocItem = React.createFactory(JDocItem);
