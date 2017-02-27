'use strict';

var JClientDropDown = React.createClass({
	displayName : 'JClientDropDown',

	getDefaultProps : function() {
		return {
			name:'Выбор из списка', width:'150pt', readonly:false, firstEmpty:false
		};
	},

	getInitialState : function() {
		return {
			value:'0'
		};
	},

	loadData : function() {
		var props = this.props;
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'getclients', ctp: this.props.ctp}, function(data) {
			self.setState({loading:false});			
			self.setState({rows: data});
			if(!self.props.defaultValue && data && data.length > 0){
				self.setState({value:data[0].id});
			}
		}, function(m) {
			self.setState({loading:false});
		});
	},
	
	componentDidMount : function() {
		this.loadData();
	},
	
	componentWillMount: function() {
        this.setState({
           value: this.props.defaultValue
        });
    },
	
	getValue : function() {
		return this.state.value;
	},
	
	onChange : function(ev) {
		this.setState({value:ev.target.value});
	},

	render : function() {
		var v = this.props.defaultValue;
		
		if(this.props.readonly){
			var v = '';
			var self = this;
			if(this.state.rows){
				this.state.rows.map(function(row, i) {
					if(row.id == self.props.defaultValue){v = (row.fullname)?row.fullname + ' ':'' + row.lastname + ' ' + row.firstname + ' ' + row.middlename;}
				})
			}
			return (
				React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span(null, (this.props.name + ': '))), 
						React.DOM.div({style:{display:'inline-block'}}, React.DOM.span(null, v)))
				)
		} else {
			return (
					
					React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span(null, (this.props.name + ': '))), 
							React.DOM.div({style:{display:'inline-block'}}, 
							React.DOM.select({style:{width:'130pt'}, value: this.state.value, onChange:this.onChange}, 
									(this.props.firstEmpty)?React.DOM.option({value: ''}, '-'):null,
									((this.state.rows)?
									this.state.rows.map(function(row, i) {
										
										return (React.DOM.option({key:row.id, value: row.id}, (row.fullname)?row.fullname + ' ':'' + row.lastname + ' ' + row.firstname + ' ' + row.middlename));
									}):React.DOM.option({value: '-1'}, "...")))
							))
					
					
			)
		}
	}
});
JClientDropDown = React.createFactory(JClientDropDown);
