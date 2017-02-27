'use strict';

var JRiskAdmin = React.createClass({
	displayName : 'JRiskAdmin',

	getDefaultProps : function() {
		return {};
	},

	getInitialState : function() {
		return {route:"main",tab:'user'};
	},
	
	logout : function() {
		var props = this.props;
		props.onLogoutSuccess();
	},
	
	getuser : function() {
		var name = Store.get('login');
		var props = this.props;
		var self = this;
		Rest.ajax2({method: "getuser", name: name}, function(data) {
			var name = (data.firstname != undefined)?data.firstname:data.name;
			self.setState({firstname : name});
			self.setState({userstatus : data.status});
		});
	},
	
	onTabClick : function(tab) {
		this.setState({tab: tab});
		this.setState({key: Math.random()});
	},

	componentDidMount : function() {
		//this.getuser();
	},

	render : function() {
		consoleLog('render...');
		var tab = React.DOM.div(null);
		var strNew;

		if(this.state.tab=='deal'){
			tab = JDealList({key:this.state.key, rowClicked:this.rowClicked});
		} else if(this.state.tab=='client'){
			tab = JClientList({key:this.state.key, rowClicked:this.rowClicked, type:'A'});
		} else if(this.state.tab=='user'){
			tab = JUserList({key:this.state.key, rowClicked:this.rowClicked});
		} else if(this.state.tab=='agent'){
			tab = JClientList({key:this.state.key, rowClicked:this.rowClicked, type:'B'});
		} else if(this.state.tab=='insurion'){
			tab = JInsurionTab();
		}
		var tabs = [{tab:'insurion', name: 'Insurion'}, {tab:'user', name: 'Инвесторы'}, {tab:'deal', name: 'Риски'}, {tab:'client', name: 'Клиенты'}, {tab:'agent', name: 'Агенты'}, 
		            {tab:'exit', name: 'Выход', onClick:this.logout}];
		return (React.DOM.div({className : 'div-main-child'}, 
				JTabs({tab:this.state.tab, onClick:this.onTabClick, tabs:tabs}),
				React.DOM.div(null, tab)
				)
		)
	}
});
JRiskAdmin = React.createFactory(JRiskAdmin);
