'use strict';

var JClientList = React.createClass({
	displayName : 'JClientList',

	getDefaultProps : function() {
		return {
			type: 'A', 
			fA:[{name:'id', id:'num'}, {name:'fullname', id:'str'}, {name:'lastname', id:'str'}, {name:'firstname', id:'str'}, {name:'middlename', id:'str'}],
     		colsA: [{name:'Id'}, {name:'Наименование'}, {name:'Фамилия'}, {name:'Имя'}, {name:'Отчество'}],
     		fB:[{name:'id', id:'num'}, {name:'fullname', id:'str'}],
     		colsB: [{name:'Id'}, {name:'Наименование'}]
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
		Rest.ajax2({method:"getclients", ctp:this.props.type}, function(data) {
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
		if (this.props.type == 'A') {
			return this.renderA();
		}
		if (this.props.type == 'B') {
			return this.renderB();
		}
		return null;
	},

	renderA : function() {
		if (this.state.loading) {
			return JControlLoading({loading:this.state.loading});
		}
		var edt;
		if(this.state.route == 'edit'){
			edt = JClientEdit({childUpdated:this.childUpdated, row: this.state.row, type:this.props.type});
		}
		var self = this;
		return (React.DOM.div(null, edt, 
				JTable({rows: this.state.rows, f: this.props.fA, cols: this.props.colsA, delmethod: 'delclient', readonly:this.props.readonly, rowClicked: this.rowClicked, addClicked: this.rowClicked, childUpdated:this.childUpdated})
		));
	},
	
	renderB : function() {
		if (this.state.loading) {
			return JControlLoading({loading:this.state.loading});
		}
		var edt;
		if(this.state.route == 'edit'){
			edt = JClientEdit({childUpdated:this.childUpdated, row: this.state.row, type:this.props.type});
		}
		var self = this;
		return (React.DOM.div(null, edt, 
				JTable({rows: this.state.rows, f: this.props.fB, cols: this.props.colsB, delmethod: 'delclient', readonly:this.props.readonly, rowClicked: this.rowClicked, addClicked: this.rowClicked, childUpdated:this.childUpdated})
		));
	}
});
JClientList = React.createFactory(JClientList);
