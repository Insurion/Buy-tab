'use strict';

var JDictList = React.createClass({
	displayName : 'JDictList',

	getDefaultProps : function() {
		return {readonly:false, f:[{name:'id', id:'num'}, {name:'code', id:'str'}, {name:'value', id:'str'}, {name:'description', id:'str'}],
		        cols: [{name:'Id'}, {name:'Код'}, {name:'Значение'}, {name:'Описание'}]
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
		Rest.ajax2({method: "dictionaries"}, function(data) {
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
			edt = JDictEdit({childUpdated:this.childUpdated, row: this.state.row});
		}
		var self = this;
		return (React.DOM.div(null, edt, 
				JTable({rows: this.state.rows, f: this.props.f, cols: this.props.cols, readonly:false, rowClicked: this.rowClicked, addClicked: this.rowClicked, childUpdated:this.childUpdated})
		));
	}
});
JDictList = React.createFactory(JDictList);

var JDictEdit = React.createClass({
	displayName : 'JDictEdit',

	getDefaultProps : function() {
		return {
			f:['code', 'value', 'description']
		};
	},

	getInitialState : function() {
		return {
			loading : false
		};
	},

	doSave : function() {
		var props = this.props;
		var row = this.props.row;
		var self = this;
		self.setState({loading:true});
		var data = {};
		this.props.f.map( function(v) { 
			data[v] = self.refs[v].state.value;
		} );
		data['id'] = (row && row.id)?row.id:'0';
		data['method'] = 'savedict';
		Rest.ajax2(data, 				
		function(data) {
			self.setState({loading:false});
			if(data.error){
				alert('Error: ' + data.error);
				return;
			}
			if(props.childUpdated){
				props.childUpdated();
			}
		}, function(a, b, c) {
			self.setState({loading:false});
		});
	},
	
	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	render : function() {
		var row = {};
		if(this.props.row != undefined){
			row = this.props.row;
		}
		return (
				JModalContainer(null,
						JTitleDiv({title:'Общие параметры'}, 
							JInputText({ref : 'code', name:'Код', defaultValue:row.code}),
							JInputText({ref : 'value', name:'Значение', defaultValue:row.value}),
							JInputText({ref : 'description', name:'Описание', defaultValue:row.description})
						),
						
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel})
		))
	}
});
JDictEdit = React.createFactory(JDictEdit);


