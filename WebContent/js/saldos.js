'use strict';

var JSaldos = React.createClass({
	displayName : 'JSaldos',

	getDefaultProps : function() {
		return {};
	},

	getInitialState : function() {
		var data = {s: [0, 0]};
		return {
			balance : '', 
			data: data 
		};
	},
	
	loadData : function() {
		var props = this.props;
		var self = this;
		Rest.ajax2({method: 'saldos'}, function(data) {
			self.setState({data: data});
		});
	},

	componentWillMount : function() {
		this.loadData();
	},

	componentDidMount : function() {
		
	},

	componentWillUnmount : function() {
	},

	render : function() {
		return (React.DOM.div(null, 
				JInputText({name:'Обязательства по эквайрингу', readonly:true, defaultValue:num2(this.state.data.s[0]) + ' руб.', format:'num'}),
				JInputText({name:'Доход по эквайрингу', readonly:true, defaultValue:num2(this.state.data.s[1]) + ' руб.', format:'num'})
			))
	}
});
JSaldos = React.createFactory(JSaldos);
