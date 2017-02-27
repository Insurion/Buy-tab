'use strict';

var JInsurionTab = React.createClass({
	displayName : 'JInsurionTab',

	getDefaultProps : function() {
		return {};
	},

	getInitialState : function() {
		return {tab:'day'};
	},
	
	childUpdated : function() {
		var key = Math.random();
		this.setState({ key: Math.random()});
	},
	
	onTabClick : function(tab) {
		this.setState({tab: tab});
		this.setState({key2: Math.random()});
	},
	
	render : function() {
		var tabStat;
		var tabsStat = [{tab:'day', name: 'День'}, {tab:'week', name: 'Неделя'}, {tab:'month', name: 'Месяц'}];
		if(this.state.tab=='day'){
			tabStat = JStatList({key:this.state.key2, type:'day'});
		} else if(this.state.tab=='week'){
			tabStat = JStatList({key:this.state.key2, type:'week'});
		} else if(this.state.tab=='month'){
			tabStat = JStatList({key:this.state.key2, type:'month'});
		}
		
		return (
				React.DOM.div({className:'div-main-child'}, 
						JTitleDiv({display:'block', title:'Справочник'}, 
								JDictList({key:this.state.key})
						),
						JTitleDiv({display:'block', title:'Сумма комиссии'}, 
								JRepComm({key:this.state.key})
						),
						JTitleDiv({display:'block', title:'Остатки'}, 
								JSaldos({key:this.state.key})
						),
						JTitleDiv({display:'block', title:'Статистика'}, 
								JTabs({classbody:'ui-tabs-clear', classitem:'ui-tab-clear', tab:this.state.tab, onClick:this.onTabClick, tabs:tabsStat}),
								React.DOM.div(null, tabStat)
						)
				)
		)
	}
});
JInsurionTab = React.createFactory(JInsurionTab);

var JRepComm = React.createClass({
	displayName : 'JRepComm',

	getDefaultProps : function() {
		return {readonly:false, f:[{name:'sum', id:'sum'}, {name:'month', id:'num'}, {name:'year', id:'num'}],
		        cols: [{name:'Сумма'}, {name:'Месяц'}, {name:'Год'}]
		       };
	},

	getInitialState : function() {
		return {
			loading: false
		};
	},

	loadData : function() {
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: "repcomm"}, function(data) {
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
	},
	
	rowClicked : function(row) {
		if(row && this.state.rowId == row.id){
			this.setState({rowId:'0'});
		} else {
			this.setState({rowId:row.id});
		}
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
JRepComm = React.createFactory(JRepComm);