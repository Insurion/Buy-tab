'use strict';

var JInvestAccTab = React.createClass({
	displayName : 'JInvestInfo',

	getDefaultProps : function() {
		return {tabs: [{tab:'myrisk', name: 'Мои риски'}, {tab:'risks', name: 'Риски к покрытию'}]};
	},

	getInitialState : function() {
		return {tab:'myrisk'};
	},
	
	componentWillMount : function() {
		this.loadData();
	},
	
	loadData : function() {
		var props = this.props;
		var self = this;
		Rest.ajax2({method: 'getuser', user: Store.get('login')}, function(data) {
			var name = (data.client.firstname != undefined)?data.client.firstname:data.name;
			self.setState({user: data, firstname : name, userstatus : data.status});
		});
	},

	childUpdated : function() {
		var key = Math.random();
		this.setState({key: Math.random(), route: 'main'});
		this.setState({keyt: Math.random()});
	},
	
	coveringUpdated : function() {
		this.loadData();
		this.setState({ key: Math.random(), route: 'main' });
	},
	
	balanceUpdated : function(v) {
		this.setState({ balance: v });
	},
	
	rowClicked : function(row) {
		this.setState({route: 'deal', row: row.deal});
	},
	
	rowClicked2 : function(row) {
		this.setState({route: 'deal2', row: row});
	},
	
	onTabClick : function(tab) {
		this.setState({tab: tab});
		this.setState({keyt: Math.random()});
	},

	render : function() {
		var edt;
		if(this.state.route == 'deal'){
			edt = JDealView({childUpdated:this.childUpdated, row: this.state.row});
		}
		if(this.state.route == 'deal2'){
			edt = JDealView({childUpdated:this.childUpdated, row: this.state.row, allowInv:true});
		}
		
		var tab;
		if(this.state.tab=='myrisk'){
			tab = (this.state.user)?JUserDealsList({ref:'ud', iduser:this.state.user.id, rowClicked: this.rowClicked, childUpdated:self.childUpdated, readonly:true}):null;
		} else if(this.state.tab=='risks'){
			tab = (this.state.user)?JDealInvList({ref:'ud', iduser:this.state.user.id, rowClicked: this.rowClicked2, readonly:true}):null;
		}
		return (
				React.DOM.div({className:'div-main-child'}, edt,
						React.DOM.div({style:{display:'inline-block'}},
							JTitleDiv({display:'block', title:'Данные счета'}, 
									(this.state.user)?JBalance({key: this.state.key, lg: this.state.user.name, balanceUpdated: this.balanceUpdated}):null
							),
							JTitleDiv({display:'block', title:'Операции', tooltip:'Вы можете внести деньги на свой счет в Insurion, нажав кнопку "Внести средства". Сумма будет целиком зачислена на счет. После нажатия кнопки "Начать покрытие" начнется автоматическое распредление ваших Доступных средств на отдельные риски. Если вы решите вывести внесенные вами ранее средства или сумму дохода, нажмите на кнопку "Вывести средства". За данную операцию банком взимается комиссия.'}, 
									JDonate({childUpdated: this.childUpdated}),
									JBtnCovering({balance: this.state.balance, userstatus: (this.state.user)?this.state.user.status:undefined, childUpdated: this.coveringUpdated})
							)
						),
						React.DOM.div({key: this.state.keyt, style:{display:isMobile.any()?'block':'inline-block', verticalAlign:'top'}},
								JTabs({classbody:'ui-tabs-clear', classitem:'ui-tab-clear', tab:this.state.tab, onClick:this.onTabClick, tabs:this.props.tabs}),
								React.DOM.div(null, tab)
						)
						/*React.DOM.div({style:{display:isMobile.any()?'block':'inline-block', verticalAlign:'top'}},
							JTitleDiv({display:'block', title:'Мои риски', width:'600pt'}, 
									(this.state.user)?JUserDealsList({ref:'ud', iduser:this.state.user.id, rowClicked: this.rowClicked, childUpdated:self.childUpdated, readonly:true}):null
							)
							//JTitleDiv({display:'block', title:'Риски к покрытию', width:'450pt'}, 
							//		(this.state.user)?JDealInvList({ref:'ud', iduser:this.state.user.id, sreadonly:true}):null
							//)
						)*/
				)
		)
	}
});
JInvestAccTab = React.createFactory(JInvestAccTab);
