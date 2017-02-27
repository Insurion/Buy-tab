'use strict';

var JUserList = React.createClass({
	displayName : 'JUserList',

	getDefaultProps : function() {
		return {readonly:false, f:[{name:'id', id:'num'}, {name:'name', id:'str'}, {name:'client.lastname', id:'str'}, {name:'client.firstname', id:'str'}, {name:'client.middlename', id:'str'},
		        			         {name:'status', id:'str'}, {name:'admin', id:'num'}],
		        cols: [{name:'Id'}, {name:'Логин'}, {name:'Фамилия'}, {name:'Имя'}, {name:'Отчество'}, {name:'Статус'}, {name:'Админ'}]
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
		Rest.ajax2({method: "getusers"}, function(data) {
			self.setState({rows: data});
			self.setState({loading:false});
		}, function(data) {
			self.setState({loading:false});
		});
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
		var edt;
		if(this.state.route == 'edit'){
			edt = JUserEdit({childUpdated:this.childUpdated, row: this.state.row});
		}
		var self = this;
		return (React.DOM.div(null, edt, 
				JTable({rows: this.state.rows, f: this.props.f, cols: this.props.cols, delmethod: 'deluser', readonly:this.props.readonly, rowClicked: this.rowClicked, addClicked: this.rowClicked, childUpdated:this.childUpdated})
			)
		);
	}
});
JUserList = React.createFactory(JUserList);
