'use strict';

var JDealUsersList = React.createClass({
	displayName : 'JDealUsersList',

	getDefaultProps : function() {
		return {iddeal:0, readonly:true, cols: [{name:'Инвестор'}, {name:'Инвестиция'}, {name:'Процент покрытия'}, {name:'Доход'}],
			f:[{name:'user.client.fio', id:'str'}, {name:'user.invest', id:'sum'}, {name:'user.percent', id:'sum'}, {name:'user.profit', id:'sum'}]
		}
	},

	getInitialState : function() {
		return {rows:[]};
	},

	loadData : function() {
		if(this.props.iduser == 0){
			return;
		}
		consoleLog('loadData...');
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: "getdealusers", iddeal: this.props.iddeal}, function(data) {
			self.setState({rows: data});
			self.setState({loading:false});
		}, function(data) {
			self.setState({loading:false});
		});
	},
	
	componentWillMount : function() {
		this.loadData();
	},
	
	render : function() {
		if (this.state.loading) {
			return JControlLoading({loading:this.state.loading});
		}
		var self = this;
		return (
				React.DOM.div(null, 
						JTable({rows: this.state.rows, f: this.props.f, cols: this.props.cols, readonly:true})
			));
	}
});
JDealUsersList = React.createFactory(JDealUsersList);
