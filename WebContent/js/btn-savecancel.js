'use strict';

var JBtnSaveCancel = React.createClass({
	displayName : 'JBtnSaveCancel',

	getDefaultProps : function() {
		return {loading:'0', captionSave: 'Сохранить', captionCancel: 'Отмена'};
	},

	getInitialState : function() {
		return {};
	},
	
	onSave : function() {
		if(this.props.onSave){
			this.props.onSave();
		}
	},
	
	onCancel : function() {
		if(this.props.onCancel){
			this.props.onCancel();
		}
	},

	render : function() {
		var v = this.props.defaultValue;
		return (
				React.DOM.div({style:{padding:'0 10%'}}, 
				React.DOM.table({width:'20%', border:'1pt'}, React.DOM.tbody(null, React.DOM.tr(null, 
						React.DOM.td(null, 
								(this.props.loading!="1")?null:React.DOM.img({src: "loading.gif", style:{width:"16pt", verticalAlign:"middle"}})
						), 
						React.DOM.td(null, 
								React.DOM.a({className : 'ui-btn ui-shadow ui-corner-all ui-btn-inline', onClick : this.onSave}, this.props.captionSave)
						),
						React.DOM.td(null, 
							React.DOM.a({className : 'ui-btn ui-shadow ui-corner-all ui-btn-inline', onClick : this.onCancel}, this.props.captionCancel)
						)
			))))
				)
	}
});
JBtnSaveCancel = React.createFactory(JBtnSaveCancel);
