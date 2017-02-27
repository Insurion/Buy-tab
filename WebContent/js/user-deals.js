'use strict';

var JUserDealInvest = React.createClass({
	displayName : 'JUserDealInvest',

	getDefaultProps : function() {
		return {iduser:0, iddeal:0, sum:0};
	},
	
	getInitialState : function() {
		return {loading:false, saldo:0};
	},
	
	componentWillMount: function() {
        this.setState({
        	saldo: this.props.saldo
        });
    },
	
	doSave : function() {
		if(!confirm('Проинвестировать?')){
			return;
		}
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'usrdealinv', iddeal:this.props.iddeal, iduser:this.props.iduser, amount:this.refs.amount.state.value}, function(data) {
			self.setState({loading:false, saldo:data.saldo});
			self.props.investBack(self.state.saldo);
		}, function(data) {
			self.setState({loading:false});
		});
	},

	doCancel : function() {
		if(this.props.investBack){
			this.props.investBack();
		}
	},

	render : function() {
		return (
				JModalContainer(null,
						JTitleDiv({title:'Проинвестировать'}, 
							JInputText({ref : 'amount', name:'Сумма', defaultValue:0.00})
						),
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel})
				)

		);
	}
});
JUserDealInvest = React.createFactory(JUserDealInvest);

var JUserDealsRow = React.createClass({
	displayName : 'JUserDealsRow',

	getDefaultProps : function() {
		return {readonly:true};
	},

	getInitialState : function() {
		return {route:'0'};
	},
	
	deleteRow : function() {
		if(Number(this.props.row.invest) > 0){
			alert('Невозможно удалить. Риск проинвестирован');
			return;
		}
		if(!confirm('Удалить запись?')){
			return;
		}
		consoleLog('deleteRow...');
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: "deluserdeal", iddeal:this.props.row.deal.id, iduser:this.props.iduser}, function(data) {
			self.setState({loading:false});
			self.childUpdated();
		}, function(data) {
			self.setState({loading:false});
		});
	},

	handleClick : function(ev) {
		if(this.props.rowClicked){
			this.props.rowClicked(this.props.row);
		}
	},
	
	childUpdated : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	delClick : function(ev) {
		this.deleteRow();
	},
	
	investClick : function(ev) {
		this.setState({route:'1'});
	},
	
	investBack : function(saldo) {
		if(saldo){
			this.props.row.deal.invest = saldo;
		}
		this.setState({route:'0'});
	},

	render : function() {
		if(this.state.route == '1'){
			return(
					JUserDealInvest({iddeal:this.props.row.deal.id, iduser:this.props.iduser, lg: this.props.lg, saldo:this.props.row.invest, investBack:this.investBack})
			)
		}
		
		var className = 'table-row';
		className = (currentDoc == this.props.row.deal.id)?className + ' row-selected':className;
		if (this.props.num % 2 == 0){
			className = className + ' row-even';
		}
		
		var p = parseFloat(this.props.row.deal.invest)*100/parseFloat(this.props.row.deal.sum);
		var c = this.props.row.deal.client;
		var canDel = (this.props.row.deal.status.code=='EDIT');
		var canInv = (this.props.row.deal.status.code=='INVEST');
		if(isMobile.any()){
			return(
				React.DOM.tr({className:className, onClick: this.handleClick}, 
						(this.props.readonly || !canDel)?React.DOM.td({id: "num"}):React.DOM.td({id: "num"}, JPictButton({src:'./delete.png', onClick : this.delClick})),
								(this.props.readonly || !canInv)?React.DOM.td({id: "num"}):React.DOM.td({id: "num"}, JPictButton({src:'./dollar.png', onClick : this.investClick})),
					React.DOM.td({id: "str"}, React.DOM.p(null, React.DOM.span(null, this.props.row.deal.status.name.substring(0,1)))),
					React.DOM.td({id: "str"}, React.DOM.p(null, React.DOM.span(null, this.props.row.deal.createdate))),
					React.DOM.td({id: "str"}, React.DOM.p(null, React.DOM.span(null, this.props.row.deal.term))),
					React.DOM.td({id: "num"}, React.DOM.p(null, React.DOM.span(null, num2(this.props.row.deal.expectedprofit)))),
					React.DOM.td({id: "num"}, React.DOM.p(null, React.DOM.span(null, num2(this.props.row.deal.profit) + ' руб.')))
			));
		} else {
			return ( 
				React.DOM.tr({className:className, onClick: this.handleClick}, 
					(this.props.readonly || !canDel)?React.DOM.td({id: "num"}):React.DOM.td({id: "num"}, JPictButton({src:'./delete.png', onClick : this.delClick})),
					(this.props.readonly || !canInv)?React.DOM.td({id: "num"}):React.DOM.td({id: "num"}, JPictButton({src:'./dollar.png', onClick : this.investClick})),
					React.DOM.td({id: "str"}, React.DOM.span(null, this.props.row.deal.status.name)),
					React.DOM.td({id: "str"}, React.DOM.p(null, React.DOM.span(null, this.props.row.deal.createdate))),
					React.DOM.td({id: "str"}, React.DOM.p(null, React.DOM.span(null, this.props.row.deal.term))),
					React.DOM.td({id: "str"}, React.DOM.p(null, React.DOM.span(null, this.props.row.deal.client.fio))),
					React.DOM.td({id: "str"}, React.DOM.p(null, React.DOM.span(null, this.props.row.deal.objectinsurance))),
					React.DOM.td({id: "num"}, React.DOM.p(null, React.DOM.span(null, num2(this.props.row.deal.sum)))),
					React.DOM.td({id: "num"}, React.DOM.p(null, React.DOM.span(null, num2(this.props.row.deal.premium)))),
					React.DOM.td({id: "num"}, React.DOM.p(null, React.DOM.span(null, num2(this.props.row.deal.expectedprofit) + ' руб.'))),
					React.DOM.td({id: "num"}, React.DOM.p(null, React.DOM.span(null, num2(this.props.row.deal.profit) + ' руб.')))
					//React.DOM.td({id: "num"}, React.DOM.p(null, React.DOM.span(null, num2(p) + '%')))
			));
		}
	}
});
JUserDealsRow = React.createFactory(JUserDealsRow);

var JUserDealsList = React.createClass({
	displayName : 'JUserDealsList',

	getDefaultProps : function() {
		return {iduser:0, readonly:true,
			f:[{name:'deal.status.name', id:'str'}, {name:'deal.createdate', id:'str'}, {name:'deal.term', id:'str'}, {name:'deal.client.fio', id:'str'}, 
			   {name:'deal.objectinsurance', id:'str'}, {name:'deal.sum', id:'num'}, {name:'deal.premium', id:'num'}, {name:'deal.expectedprofit', id:'num'}, {name:'deal.profit', id:'num'}],
			
			cols: [{name:''}, {name:'Статус'}, {name:'Дата созд.'}, {name:'Срок'}, {name:'Клиент'}, {name:'Объект'}, {name:'Сумма'}, {name:'Премия'}, {name:'Ож.Доход'}, {name:'Доход'}],
			cols2: [{name:''}, {name:'Статус'}, {name:'Дата созд.'}, {name:'Срок'}, {name:'Ож.Доход'}, {name:'Доход'}]
		}
	},

	getInitialState : function() {
		return {rows:[]};
	},
	
	newTableRow : function() {
		this.setState({route: "add"});
	},

	loadData : function() {
		if(this.props.iduser == 0){
			return;
		}
		consoleLog('loadData...');
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: "getuserdeals", iduser: this.props.iduser}, function(data) {
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
		this.setState({row: null, route: "main"});
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	rowClicked : function(row) {
		if(this.props.rowClicked){
			this.props.rowClicked(row);
		}
	},

	render : function() {
		consoleLog('render...');
		
		if (this.state.loading) {
			return JControlLoading({loading:this.state.loading});
		}
		
		var edt = React.DOM.div(null);
		if(this.state.route == 'add'){
			edt = JUserDealAdd({childUpdated:this.childUpdated, iduser:this.props.iduser});
		}
		var self = this;
		var rowRender = function(row, i) {
			if (self.state.rows.length == 0) {
				return null;
			} else {
				return (
				JUserDealsRow({key:i, num: i, row : row, readonly:self.props.readonly, iduser:self.props.iduser, lg: self.props.lg, rowClicked: self.rowClicked, childUpdated:self.childUpdated})
			)};}
		var addDisable = (this.props.readonly || !this.props.iduser || this.props.status != 'INVEST');
		return (
				React.DOM.div(null, edt, //(addDisable || this.props.readonly)?null:JPictButton({type:'add', onClick : self.newTableRow}), 
					React.DOM.div(null, 
						JTable({rows: this.state.rows, f: this.props.f, cols: (isMobile.any())?this.props.cols2:this.props.cols, btn1:!this.props.readonly, btn2:!this.props.readonly, 
								readonly:this.props.readonly, rowClicked: this.rowClicked, addClicked: (addDisable || this.props.readonly)?undefined:this.newTableRow, childUpdated:this.childUpdated, rowRender:rowRender})
					)
				)
		);
	}
});
JUserDealsList = React.createFactory(JUserDealsList);
