'use strict';

var JInvest = React.createClass({
	displayName : 'JInvest',

	getDefaultProps : function() {
		return {
			tabs: [{tab:'account', name: 'Счет'}, {tab:'profile', name: 'Профиль'}, {tab:'exit', name: 'Выход', onClick:this.logout}]
		};
	},

	getInitialState : function() {
		return {
			code : currentFolder,
			tab:'account'
		};
	},
	
	logout : function() {
		this.props.onLogoutSuccess();
	},
	
	onTabClick : function(tab) {
		this.setState({tab: tab});
		this.setState({key: Math.random()});
	},
	
	render : function() {
		var tab;
		if(this.state.tab=='account'){
			tab = JInvestAccTab({key:this.state.key, user:this.state.user});
		} else if(this.state.tab=='profile'){
			tab = JInvestInfo();
		}
		var tabs = [{tab:'account', name: 'Счет'}, {tab:'profile', name: 'Профиль'}, {tab:'exit', name: 'Выход', onClick:this.logout}];
		tab = React.DOM.div(null, JShortHelp(), tab);
		return (React.DOM.div(null,  
				React.DOM.div({style:{display:'inline-block', width:'100%'}}, 				
				JTabs({tab:this.state.tab, onClick:this.onTabClick, tabs:tabs}),
					tab
				)
				
			)
		)
	}
});
JInvest = React.createFactory(JInvest);
