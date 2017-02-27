'use strict';

var JDealView = React.createClass({
	displayName : 'JDealView',

	getDefaultProps : function() {
		return {allowInv:false,  route:'1'};
	},

	getInitialState : function() {
		return {loading:false};
	},

	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	doInv : function() {
		var row = this.props.row;
		var self = this;
		
		self.setState({loading:true});
		Rest.ajax2({method: 'usrinv', iddeal: row.id, 'stage':'1'}, 
			function(data) {
				self.setState({loading:false, route:'2'});
				self.showCovering(self);
			}
		);
	},
	
	doSave : function() {
		var row = this.props.row;
		var self = this;
		
		self.setState({loading:true});
		Rest.ajax2({method: 'usrinv', iddeal: row.id, 'stage':'2'}, 
			function(data) {
				self.setState({loading:false, route:'1'});				
				
				if(self.props.childUpdated){
					self.props.childUpdated();
				}
		});
	},
	
	showCovering: function(self) {
		$("#txt").load("aggr.html");
		self.doresize();
		window.onresize = self.onresize;
	},
	
	onresize : function(self) {
		self.doresize();
	},
	
	doresize : function() {
		var bh = $("#btm").height();
		var h = (window.innerHeight - bh*2)*3/4;
		$("#txt").height(h + 'pt');
	},
	
	render : function() {
		var row = this.props.row;
		var readonly = true;
		if(this.state.route == '2'){
			return this.renderCovering();
		}
		return (
				JModalContainer({key: this.state.key}, close, 
						JTitleDiv({title:'Данные Риска'}, 
							//JSelect({ref : 'status', name:'Статус Риска', defaultValue:row.status.id, readonly:readonly, data:[{key:'1', value: 'Редактируется'}, {key:'2', value: 'Инвестирован'}, {key:'3', value: 'Завершен'}, {key:'4', value: 'Отменен'}]}),
							JInputText({ref : 'status', name:'Статус Риска', defaultValue:row.status.name, readonly:readonly, underline:true}),
							JMaskedDate({ref : 'createdate', name:'Дата создания', defaultValue:(row && row.id)?row.createdate:moment().format('DD.MM.YYYY'), id:'dt_createdate', readonly:readonly, underline:true}),
							JInputText({ref : 'idclient', name:'Клиент', defaultValue:row.client.fio, readonly:readonly, underline:true}),
							JInputText({ref : 'idcpty', name:'Агент', defaultValue:row.cpty.fullname, readonly:readonly, underline:true}),
							JInputText({ref : 'sum', name:'Страховая сумма, руб.', defaultValue:num2(row.sum), readonly:readonly, underline:true}),
							JInputText({ref : 'premium', name:'Страховая премия, руб.', defaultValue:num2(row.premium), readonly:readonly, underline:true}),
							JInputText({ref : 'ep', name:'Ожидаемый доход, руб.', defaultValue:num2(row.expectedprofit), readonly:readonly, underline:true}),
							JMaskedDate({ref : 'begindate', name:'Дата начала Риска', defaultValue:(row && row.id)?row.begindate:moment().format('DD.MM.YYYY'), id:'dt_begindate', readonly:readonly, underline:true}),
							JMaskedDate({ref : 'enddate', name:'Дата завершения Риска', defaultValue:row.enddate, id:'dt_enddate', readonly:readonly, underline:true}),
							JInputText({ref : 'term', name:'Срок', defaultValue:row.term, readonly:true, underline:true}),
							JInputText({ref : 'objectinsurance', name:'Объект страхования', defaultValue:row.objectinsurance, readonly:readonly, underline:true})
						),
						(this.props.allowInv)?JButton({style:{display:'block', width:'100pt'}, onClick : this.doInv, caption:'Начать покрытие'}):null,
						JButton({style:{display:'block', width:'100pt'}, onClick : this.doCancel, caption:'Отмена'})
		))
	},
	
	renderCovering : function() {
		var h = window.innerHeight - 200;
		return (
				JModalContainer({key: this.state.key}, 
					React.DOM.div(null,
							React.DOM.span({style:{fontWeight: 'bold'}}, 'ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ:')
					), 						
					React.DOM.div({id:'txt', style:{overflowY:'scroll'}}, ''),
					React.DOM.div({id:'btm'},
							React.DOM.span({style:{fontWeight: 'bold'}}, React.DOM.input({ref:'chk', type:'checkbox',}), 'Я согласен(на) с условиями Пользовательского соглашения'),
							JBtnSaveCancel({loading: this.state.loading, captionSave:'Начать', captionCancel:'Отказаться', onSave:this.doSave, onCancel:this.doCancel})
					)
		))
	}
});
JDealView = React.createFactory(JDealView);
