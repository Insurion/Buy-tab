'use strict';

var JStatList = React.createClass({
	displayName : 'JStatList',

	getDefaultProps : function() {
		return {readonly:false, f:[{name:'id', id:'num'}, {name:'name', id:'str'}, {name:'cnt', id:'num'}],
		        cols: [{name:'№'}, {name:'Логин'}, {name:'Кол-во'}],
		        type:'day'
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
		Rest.ajax2({method: 'getstat', type:this.props.type}, function(data) {
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
		this.setState({route: "view"});
		
		this.setState({row: row});
		if(this.props.rowClicked){
			this.props.rowClicked(row);
		}
	},

	render : function() {
		if (this.state.loading) {
			return JControlLoading({loading:this.state.loading});
		}
		var view;
		if(this.state.route == 'view'){
			view = JStatView({childUpdated:this.childUpdated, row: this.state.row, type: this.props.type});
		}
		var self = this;
		return (React.DOM.div(null, view, 
				JTable({rows: this.state.rows, f: this.props.f, cols: this.props.cols, readonly:true, rowClicked: this.rowClicked, addClicked: this.rowClicked, childUpdated:this.childUpdated})
		));
	}
});
JStatList = React.createFactory(JStatList);

var JStatView = React.createClass({
	displayName : 'JStatView',

	getDefaultProps : function() {
		return {readonly:false, f:[{name:'method', id:'str'}, {name:'cnt', id:'num'}],
		        cols: [{name:'Метод'}, {name:'Кол-во'}],
		        type:'day'
		       };
	},

	getInitialState : function() {
		return {
			loading : false
		};
	},

	loadData : function() {
		consoleLog('loadData...' + this.props.type);
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'getstatu', usr: this.props.row.name, type:this.props.type}, function(data) {
			self.setState({rows: data});
			self.setState({loading:false});
		}, function(data) {
			self.setState({loading:false});
		});
	},
	
	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	componentWillMount : function() {
		this.loadData();
	},

	childUpdated : function() {
		this.loadData();
		this.setState({route: "main"});
	},
	
	btnClicked : function(row) {
		this.setState({route: "view"});
		
		this.setState({row: row});
		if(this.props.rowClicked){
			this.props.rowClicked(row);
		}
	},

	render : function() {
		var row = {};
		if(this.props.row != undefined){
			row = this.props.row;
		}
		var view;
		if(this.state.route == 'view'){
			view = JStatFullView({childUpdated:this.childUpdated, usr: this.props.row.name, type: this.props.type});
		}
		return (
				JModalContainer(null, view, 
						JTitleDiv({title:'Статистика по "' + this.props.row.name + '"'}, 
							(!this.state.rows)?null:JTable({rows: this.state.rows, pagesize: 10, f: this.props.f, cols: this.props.cols, readonly:true, rowClicked: this.rowClicked, addClicked: this.rowClicked, childUpdated:this.childUpdated})
						),
						React.DOM.div(null,
							JButton({caption:'Ok', onClick: this.doCancel}),
							JButton({caption:'Детали', onClick: this.btnClicked})
						)
		))
	}
});
JStatView = React.createFactory(JStatView);

var JStatFullView = React.createClass({
	displayName : 'JStatFullView',

	getDefaultProps : function() {
		return {readonly:false, f:[{name:'method', id:'str'}, {name:'dt', id:'str'}],
		        cols: [{name:'Метод'}, {name:'Время'}],
		        type:'day',
		        usr:''
		       };
	},

	getInitialState : function() {
		return {
			loading : false
		};
	},

	loadData : function() {
		consoleLog('loadData...' + this.props.type);
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'getstatuf', usr: this.props.usr, type:this.props.type}, function(data) {
			self.setState({rows: data});
			self.setState({loading:false});
		}, function(data) {
			self.setState({loading:false});
		});
	},
	
	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	componentWillMount : function() {
		this.loadData();
	},

	render : function() {
		var row = {};
		if(this.props.row != undefined){
			row = this.props.row;
		}
		return (
				JModalContainer(null,
						JTitleDiv({title:'Детали по "' + this.props.usr + '"'}, 
							(!this.state.rows)?null:JTable({rows: this.state.rows, pagesize: 10, f: this.props.f, cols: this.props.cols, readonly:true, rowClicked: this.rowClicked, addClicked: this.rowClicked, childUpdated:this.childUpdated})
						),						
						React.DOM.div(null,
							JButton({caption:'Ok', onClick: this.doCancel})
						)
		))
	}
});
JStatFullView = React.createFactory(JStatFullView);
