'use strict';

var JDealInvList = React.createClass({
	displayName : 'JDealInvList',

	getDefaultProps : function() {
		return {readonly:false, f:[{name:'status.name', id:'str'}, {name:'createdate', id:'str'}, {name:'term', id:'num'}, {name:'client.fio', id:'str'}, {name:'objectinsurance', id:'str'}, 
		                           {name:'sum', id:'sum'}, {name:'premium', id:'sum'}, {name:'saldo', id:'sum'}, {name:'expectedprofit', id:'sum'}],
		        cols: [{name:'Статус'}, {name:'Дата созд.'}, {name:'Срок'}, {name:'Клиент'}, {name:'Объект'}, {name:'Сумма'}, {name:'Премия'}, {name:'Покрытие'}, {name:'Ож.Доход'}]
		       };
	},

	getInitialState : function() {
		return {
			loading: false
		};
	},

	loadData : function() {
		consoleLog('loadData...' + this.state['code']);
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'getdealsinv', user: Store.get('login')}, function(data) {
			self.setState({rows: data});
			self.setState({loading:false});
		}, function() {self.setState({loading:false})});
	},

	componentWillMount : function() {
		this.loadData();
	},

	childUpdated : function() {
		this.loadData();
		this.setState({route: "main"});
	},
	
	rowClicked : function(row) {
		if(!this.props.readonly){
			this.setState({route: "edit"});
		}
		this.setState({row: row});
		if(this.props.rowClicked){
			this.props.rowClicked(row);
		}
	},

	render : function() {
		if (this.state.loading) {
			return JControlLoading({loading:this.state.loading});
		}
		var self = this;
		return (React.DOM.div(null, 
				JTable({rows: this.state.rows, f: this.props.f, cols: this.props.cols, readonly:true, rowClicked: this.rowClicked, childUpdated:this.childUpdated})
		));
	}
});
JDealInvList = React.createFactory(JDealInvList);
