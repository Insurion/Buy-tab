'use strict';

var JDealList = React.createClass({
	displayName : 'JDealList',

	getDefaultProps : function() {
		return {readonly:false, f:[{name:'id', id:'num'}, {name:'status.name', id:'str'}, {name:'createdate', id:'str'}, {name:'client.fullname', id:'str'}, {name:'cpty.fullname', id:'str'}, {name:'premium', id:'sum'},
		        			         {name:'sum', id:'sum'}, {name:'term', id:'num'}, {name:'objectinsurance', id:'str'}, {name:'saldo', id:'sum'}, {name:'expectedprofit', id:'sum'}],
		        cols: [{name:'Id'}, {name:'Статус'}, {name:'Дата созд.'}, {name:'Клиент'}, {name:'Агент'}, {name:'Премия'}, {name:'Сумма'}, {name:'Срок'}, {name:'Объект'}, {name:'Покрытие'}, {name:'Ож.Доход'}]
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
		Rest.ajax2({method: 'getdeals'}, function(data) {
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
		//this.setState({rowId:row.id});
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
		var edt;
		if(this.state.route == 'edit'){
			edt = JDealEdit({childUpdated:this.childUpdated, row: this.state.row});
		}
		var self = this;
		return (React.DOM.div(null, edt, 
				JTable({rows: this.state.rows, f: this.props.f, cols: this.props.cols, delmethod: 'deldeal', readonly:this.props.readonly, rowClicked: this.rowClicked, addClicked: this.rowClicked, childUpdated:this.childUpdated})
		));
	}
});
JDealList = React.createFactory(JDealList);
