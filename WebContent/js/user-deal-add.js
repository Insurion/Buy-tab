'use strict';

var JUserDealAdd = React.createClass({
	displayName : 'JUserDealAdd',
	
	getDefaultProps : function() {
		return {
			iduser: 0
		};
	},
	
	getInitialState : function() {
		return {loading:false};
	},

	doSave : function() {
		var rowId = this.refs.JDealList.state.row.id;
		var props = this.props;
		var row = this.props.row;
		var self = this;
		this.setState({loading:true});
		Rest.ajax2({
				method: "saveuserdeal", 
				iddeal: rowId,
				iduser: self.props.iduser
			}, 
				
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
		return (
				JModalContainer(null, 
						JTitleDiv({title:'Выберите строку'}, 
								JDealList({ref:'JDealList', readonly:true}),
								JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel})
						)
				)
		)
	}
});
JUserDealAdd = React.createFactory(JUserDealAdd);
