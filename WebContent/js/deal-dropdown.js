'use strict';

var JDealDropDown = React.createClass({
	displayName : 'JDealDropDown',

	getDefaultProps : function() {
		return {};
	},

	getInitialState : function() {
		return {
			selected:'0'
		};
	},

	loadData : function() {
		var props = this.props;
		var self = this;
		Rest.ajax2({method: 'getdeals'}, function(data) {
			self.setState({rows: data.rows});
			self.setState({loadingStr: ''});
			if(!self.props.defaultValue && data.rows && data.rows.length > 0){
				self.setState({selected:data.rows[0].id});
			}
		});
	},
	
	componentDidMount : function() {
		this.loadData();
	},
	
	componentWillMount: function() {
        this.setState({
           selected: this.props.defaultValue
        });
    },
	
	getValue : function() {
		return this.state.selected;
	},
	
	onChange : function(ev) {
		this.setState({selected:ev.target.value});
	},

	render : function() {
		var v = this.props.defaultValue;
		return (React.DOM.select({style:{width:'180pt'}, value: this.state.selected, onChange:this.onChange}, 
				((this.state.rows)?
				this.state.rows.map(function(row, i) {
					
					return (React.DOM.option({key:row.id, value: row.id}, row.name));
				}):React.DOM.option({value: '-1'}, "..."))
		))
	}
});
JDealDropDown = React.createFactory(JDealDropDown);
