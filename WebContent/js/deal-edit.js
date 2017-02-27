'use strict';

var JDealEdit = React.createClass({
	displayName : 'JDealEdit',

	getDefaultProps : function() {
		return {f:['status', 'idclient', 'idcpty', 'premium', 'sum', 'term', 'objectinsurance', 'begindate', 'enddate'],
			row:{status:{id:1, code:'EDIT'}}
		}
	},

	getInitialState : function() {
		return {
			loading:false,
			route: 'main'
		};
	},

	doSave : function(p) {
		var props = this.props;
		var row = this.props.row;
		var readonly = (row.status.id != '1')?true:false;
		var self = this;
		self.setState({loading:true});
		var data = {};
		this.props.f.map( function(v) { 
			if(self.refs[v]){
				data[v] = self.refs[v].state.value;
			}
		} );
		if(p && p.status){
			data.status = p.status;
		}
		if(!readonly){
			data.createdate = this.refs.createdate.value();
			data.begindate = this.refs.begindate.value();
			data.enddate = this.refs.enddate.value();
		}
		data.id = (row && row.id)?row.id:'0';
		data.method = 'savedeal';
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
	
	closeDeal : function() {
		var data = {};
		var self = this;
		data.id = this.props.row.id;
		data.method = 'closedeal';
		Rest.ajax2(data, 				
		function(data) {
			self.setState({loading:false});
			if(data.error){
				alert('Error: ' + data.error);
				return;
			}
			if(self.props.childUpdated){
				self.props.childUpdated();
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
	
	saveStatusClose : function() {
		this.setState({route:'close', key: Math.random()});
		//this.closeDeal();
	},
	
	saveStatusInv : function() {
		this.setState({route:'inv', key: Math.random()});
	},
	
	saveStatusCancel : function() {
		if(!confirm('Отменить риск?')){
			return;
		}
		this.doSave({status:'4'});
	},
	
	saveStatusEdit : function() {
		if(!confirm('Редактировать риск?')){
			return;
		}
		this.doSave({status:'1'});
	},
	
	render : function() {
		var row = {};
		if(this.props.row != undefined){
			row = this.props.row;
			if(!row.status){
				row.status = {id: '1', code: 'EDIT'};
			}
		}
		var close;
		if(this.state.route == 'close'){
			close = JDealClose({childUpdated:this.props.childUpdated, row: this.props.row});
		}
		if(this.state.route == 'inv'){
			close = JDealInvest({childUpdated:this.props.childUpdated, row: this.props.row});
		}
		var readonly = (row.status.id != '1')?true:false;
		
		return (
				JModalContainer({key: this.state.key}, close, 
						JTitleDiv({title:'Действия', width:'150pt'}, 
							(row.status.code=='EDIT' || row.status.code=='INVEST')?JButton({style: {width:'70%'}, caption : 'Отменить', onClick:this.saveStatusCancel}):null,
							(row.status.code=='CANCEL')?JButton({style: {width:'70%'}, caption : 'Редактировать', onClick:this.saveStatusEdit}):null,
							(row.status.code=='EDIT')?JButton({style: {width:'70%'}, caption : 'Инвестировать', onClick:this.saveStatusInv}):null,
							(row.status.code=='INVEST')?JButton({style: {width:'70%'}, caption : 'Закрыть', onClick:this.saveStatusClose}):null
						),
						JTitleDiv({title:'Данные Риска'}, 
							JSelect({ref : 'status', name:'Статус Риска', defaultValue:row.status.id, readonly:true, data:[{key:'1', value: 'Редактируется'}, {key:'2', value: 'Инвестирован'}, {key:'3', value: 'Завершен'}, {key:'4', value: 'Отменен'}]}),
							JMaskedDate({ref : 'createdate', name:'Дата создания', defaultValue:(row && row.id)?row.createdate:moment().format('DD.MM.YYYY'), id:'dt_createdate', readonly:readonly}),
							JClientDropDown({name:'Клиент', ctp:'A',ref:'idclient',defaultValue:(row.client)?row.client.id:'0', firstEmpty:true, readonly:readonly}),
							JClientDropDown({name:'Агент', ctp:'B',ref:'idcpty',defaultValue:(row.client)?row.cpty.id:'0', firstEmpty:true, readonly:readonly}),
							JInputText({ref : 'sum', name:'Страховая сумма, руб.', defaultValue:num2(row.sum), readonly:readonly}),
							JInputText({ref : 'premium', name:'Страховая премия, руб.', defaultValue:num2(row.premium), readonly:readonly}),
							JMaskedDate({ref : 'begindate', name:'Дата начала Риска', defaultValue:(row && row.id)?row.begindate:moment().format('DD.MM.YYYY'), id:'dt_begindate', readonly:readonly}),
							JMaskedDate({ref : 'enddate', name:'Дата завершения Риска', defaultValue:row.enddate, id:'dt_enddate', readonly:readonly}),
							JInputText({ref : 'term', name:'Срок', defaultValue:row.term, readonly:true}),
							JInputText({ref : 'objectinsurance', name:'Объект страхования', defaultValue:row.objectinsurance, readonly:readonly})
						),
						JTitleDiv({title:'Дополнительные данные', width:'200pt'}, 
							JInputText({ref : 'saldo', name:'Сумма покрытия, руб.', defaultValue:num2(row.saldo), readonly:true}),
							JInputText({ref : 'p', name:'Процент покрытия инвесторами', defaultValue:num2(row.saldo*100/row.sum)  + '%', readonly:true}),
							JInputText({ref : 'loss', name:'Сумма убытка, руб.', defaultValue:num2(row.loss), readonly:true}),
							JInputText({ref : 'ourprem', name:'Комиссия Insurion, руб.', defaultValue:num2(row.ourprem), readonly:true}),
							JInputText({ref : 'ep', name:'Ожидаемый доход, руб.', defaultValue:num2(row.expectedprofit), readonly:true}),
							JInputText({ref : 'risklevel', name:'Уровень риска', defaultValue:'A', readonly:true})
						),
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel}),
						React.DOM.div(null, JDealUsersList({key:this.state.key, iddeal:row.id, readonly:false, childUpdated:this.childUpdated}))
		))
	}
});
JDealEdit = React.createFactory(JDealEdit);
var JDealClose = React.createClass({
	displayName : 'JDealClose',

	getDefaultProps : function() {
		return {row:{}, childUpdated: undefined};
	},

	getInitialState : function() {
		return {
			loading:false
		};
	},

	doSave : function() {
		if(!confirm('Закрыть риск?')){
			return;
		}

		var data = {};
		var self = this;
		data.id = this.props.row.id;
		data.method = 'closedeal';
		data.loss = this.refs.loss.state.value;
		//data.ourprem = this.refs.ourprem.state.value;
		Rest.ajax2(data, 				
		function(data) {
			self.setState({loading:false});
			if(data.error){
				alert('Error: ' + data.error);
				return;
			}
			if(self.props.childUpdated){
				self.props.childUpdated();
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
				JModalContainer({key: this.state.key},
						JTitleDiv({title:'Закрытие риска'}, 
							JInputText({ref : 'loss', name:'Сумма убытка, руб.', defaultValue:num2(0)})
							//JInputText({ref : 'ourprem', name:'Комиссия Insurion, руб.', defaultValue:num2(this.props.row.premium*10/100)})
						),
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel, captionSave: 'Закрыть риск'})
		))
	}
});
JDealClose = React.createFactory(JDealClose);

var JDealInvest = React.createClass({
	displayName : 'JDealInvest',

	getDefaultProps : function() {
		return {row:{}, childUpdated: undefined};
	},

	getInitialState : function() {
		return {
			loading:false
		};
	},

	doSave : function() {
		if(!confirm('Инвестировать риск?')){
			return;
		}

		var data = {};
		var self = this;
		data.id = this.props.row.id;
		data.method = 'investdeal';
		//data.loss = this.refs.loss.state.value;
		data.ourprem = this.refs.ourprem.state.value;
		Rest.ajax2(data, 				
		function(data) {
			self.setState({loading:false});
			if(data.error){
				alert('Error: ' + data.error);
				return;
			}
			if(self.props.childUpdated){
				self.props.childUpdated();
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
				JModalContainer({key: this.state.key},
						JTitleDiv({title:'Начать инвестировать риск'}, 
							JInputText({ref : 'ourprem', name:'Комиссия Insurion, руб.', defaultValue:num2(this.props.row.premium*10/100)})
						),
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel, captionSave: 'Инвестировать риск'})
		))
	}
});
JDealInvest = React.createFactory(JDealInvest);

