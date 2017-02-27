'use strict';

var JClientEdit = React.createClass({
	displayName : 'JClientEdit',

	getDefaultProps : function() {
		return {f:['ctp', 'createdate', 'fullname', 'lastname', 'firstname', 'middlename', 'sex', 'email', 
		           'phone', 'dtp', 'dul', 'dulkem', 'duldt', 'address1', 'address2', 'workname', 'workposition', 'workaddress', 'workname', 'inn', 'ogrn',
		           'bankbic', 'bankacc', 'contactname', 'contactposition'],
		        dtp:[{key:'A', value: 'Паспорт РФ'}],
		        ctp:[{key:'A', value: 'Физ. лицо'}, {key:'U', value: 'Юр. лицо'}]};
	},

	getInitialState : function() {
		return {
			loading:false
		};
	},
	
	doSave : function() {
		if(!this.state.ctp){alert('Не задан Тип клиента');return;};
		if(!checkMaskedDate(this.refs['duldt'])){return;};
		if(!checkMaskedDate(this.refs['createdate'])){return;};
		var props = this.props;
		var row = this.props.row;
		var self = this;
		self.setState({loading:true});
		var data = {};
		this.props.f.map( function(v) { 
			if(self.refs[v]){
				data[v] = self.refs[v].state.value;
			}
		} );
		if(this.refs['duldt']){
			data['duldt'] = this.refs['duldt'].value();
		}
		data['createdate'] = this.refs['createdate'].value();
		data['id'] = (row && row.id)?row.id:'0';
		data['method'] = 'saveclient';
		data['ctp'] = this.state.ctp;
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
	
	componentWillMount: function() {
        this.setState({
        	ctp: (this.props.row)?this.props.row.ctp:''
        }); 
        if(this.props.type == 'B'){
        	this.setState({ctp: 'B'});
        }
    },

	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	onCtp : function(v) {
		this.setState({
        	ctp: v
        });
		this.setState({key: Math.random()});
	},
	
	render : function() {
		var c = (this.props.row)?this.props.row:{};
		var ctp = this.state.ctp;
		var fields;
		if(ctp == 'A'){
			fields = this.renderA();
		} else if(this.props.type == 'B'){
			fields = this.renderB();
		} else if(ctp == 'U'){
			fields = this.renderU();
		} else {
			fields = JTitleDiv({title:'Личные данные'}, 
					JSelect({ref : 'ctp', name:'Тип клиента', defaultValue:this.state.ctp, firstEmpty:true, data:this.props.ctp, onChange:this.onCtp}));			
		}
		return (
				JModalContainer({key: this.state.key},
						fields,
						
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel})
				)
		)
	},
	
	renderA : function() {
		var c = (this.props.row)?this.props.row:{};
		return (	React.DOM.div(null,
						JTitleDiv({title:'Личные данные'}, 
							JSelect({ref : 'ctp', name:'Тип клиента', defaultValue:this.state.ctp, firstEmpty:true, data:this.props.ctp, onChange:this.onCtp}),
							JMaskedDate({ref : 'createdate', name:'Дата создания', defaultValue:c.createdate, id:'dt_createdate'}),
							JInputText({ref : 'lastname', name:'Фамилия', defaultValue:c.lastname}),
							JInputText({ref : 'firstname', name:'Имя', defaultValue:c.firstname}),
							JInputText({ref : 'middlename', name:'Отчество', defaultValue:c.middlename}),
							JSelect({ref : 'sex', name:'Пол', defaultValue:c.sex, firstEmpty:true, data:[{key:'M', value: 'Муж.'}, {key:'F', value: 'Жен.'}]}),
							JInputText({ref : 'email', name:'E-mail', defaultValue:c.email}),
							JInputText({ref : 'phone', name:'Телефон', defaultValue:c.phone})
						),
						JTitleDiv({title:'Паспортные данные'},
							JSelect({ref : 'dtp', name:'Тип паспорта', defaultValue:c.dtp, firstEmpty:true, data:this.props.dtp}),
							JInputText({ref : 'dul', name:'Номер документа', defaultValue:c.dul}),
							JInputText({ref : 'dulkem', name:'Кем выдан', defaultValue:c.dulkem}),
							JMaskedDate({ref : 'duldt', name:'Дата выдачи', defaultValue:c.duldt, id:'dt_duldt'})
						),
						JTitleDiv({title:'Данные адреса'}, 
							JInputText({ref : 'address1', name:'Адрес прописки', defaultValue:c.address1}),
							JInputText({ref : 'address2', name:'Фактический адрес', defaultValue:c.address2})
						),
						JTitleDiv({title:'Данные работодателя'}, 
							JInputText({ref : 'workname', name:'Наименование работодателя', defaultValue:c.workname}),
							JInputText({ref : 'workposition', name:'Должность', defaultValue:c.workposition}),
							JInputText({ref : 'workaddress', name:'Адрес работодателя', defaultValue:c.workaddress}),
							JInputText({ref : 'workphone', name:'Телефон работодателя', defaultValue:c.workphone})
						),
						JTitleDiv({title:'Дополнительные данные'}, 
							JInputText({ref : 'riskpast', name:'Кол-во прошлых Рисков', defaultValue:c.riskpast, readonly:true}),
							JInputText({ref : 'riskrealize', name:'Кол-во Реализованных Рисков', defaultValue:c.riskrealize, readonly:true}),
							JInputText({ref : 'sumpremium', name:'Сумма уплаченных Премий', defaultValue:num2(c.sumpremium), readonly:true}),
							JInputText({ref : 'sumunprofit', name:'Сумма выплаченного Убытка', defaultValue:num2(c.sumloss), readonly:true}),
							JInputText({ref : 'unprofitness', name:'Убыточность клиента', defaultValue:num2(c.lossness), readonly:true})
						)
					)
		)
	},
	
	renderB : function() {
		var c = {};
		if(this.props.row != undefined){
			c = this.props.row;
		}
		return (React.DOM.div(null,
					JTitleDiv({title:'Данные Агента'}, 
						JMaskedDate({ref : 'createdate', name:'Дата создания', defaultValue:c.createdate, id:'dt_createdate'}),
						JInputText({ref : 'fullname', name:'Название Агента', defaultValue:c.fullname}),
						JInputText({ref : 'inn', name:'ИНН', defaultValue:c.inn, maxlength:'15'}),
						JInputText({ref : 'ogrn', name:'ОГРН', defaultValue:c.ogrn, maxlength:'13'}),
						JInputText({ref : 'address1', name:'Юридический адрес', defaultValue:c.address1}),
						JInputText({ref : 'address2', name:'Фактический адрес', defaultValue:c.address2}),
						JInputText({ref : 'bankbic', name:'БИК Банка', defaultValue:c.bankbic, maxlength:'9'}),
						JInputText({ref : 'bankacc', name:'Номер счета', defaultValue:c.bankacc, maxlength:'20'}),
						JInputText({ref : 'phone', name:'Телефон', defaultValue:c.phone}),
						JInputText({ref : 'email', name:'E-mail', defaultValue:c.email}),
						JInputText({ref : 'contactname', name:'ФИО контактного лица', defaultValue:c.contactname}),
						JInputText({ref : 'contactposition', name:'Должность контактного лица', defaultValue:c.contactposition})
					),
					JTitleDiv({title:'Дополнительные данные'}, 
						JInputText({ref : 'sumpremium', name:'Сумма Уплаченных премий Клиентами Агента', defaultValue:num2(c.sumpremium), readonly:true}),
						JInputText({ref : 'sumunprofit', name:'Сумма выплаченного Убытка Клиентам Агента', defaultValue:num2(c.sumloss), readonly:true}),
						JInputText({ref : 'unprofitness', name:'Убыточность Агента', defaultValue:num2(c.lossness), readonly:true})
					)
					)
		)
	},
	
	renderU : function() {
		var c = {};
		if(this.props.row != undefined){
			c = this.props.row;
		}
		return (React.DOM.div(null,
					JTitleDiv({title:'Данные юрлица'}, 
						JSelect({ref : 'ctp', name:'Тип клиента', defaultValue:this.state.ctp, firstEmpty:true, data:this.props.ctp, onChange:this.onCtp}),
						JMaskedDate({ref : 'createdate', name:'Дата создания', defaultValue:c.createdate, id:'dt_createdate'}),
						JInputText({ref : 'fullname', name:'Название компании', defaultValue:c.fullname}),
						JInputText({ref : 'inn', name:'ИНН', defaultValue:c.inn, maxlength:'15'}),
						JInputText({ref : 'ogrn', name:'ОГРН', defaultValue:c.ogrn, maxlength:'13'}),
						JInputText({ref : 'address1', name:'Юридический адрес', defaultValue:c.address1}),
						JInputText({ref : 'address2', name:'Фактический адрес', defaultValue:c.address2}),
						JInputText({ref : 'bankbic', name:'БИК Банка', defaultValue:c.bankbic, maxlength:'9'}),
						JInputText({ref : 'bankacc', name:'Номер счета', defaultValue:c.bankacc, maxlength:'20'}),
						JInputText({ref : 'phone', name:'Телефон', defaultValue:c.phone}),
						JInputText({ref : 'email', name:'E-mail', defaultValue:c.email})
					),
					JTitleDiv({title:'Дополнительные данные'}, 
						JInputText({ref : 'riskpast', name:'Кол-во прошлых Рисков', defaultValue:c.riskpast, readonly:true}),
						JInputText({ref : 'riskrealize', name:'Кол-во Реализованных Рисков', defaultValue:c.riskrealize, readonly:true}),
						JInputText({ref : 'sumpremium', name:'Сумма уплаченных Премий', defaultValue:num2(c.sumpremium), readonly:true}),
						JInputText({ref : 'sumunprofit', name:'Сумма выплаченного Убытка', defaultValue:num2(c.sumloss), readonly:true}),
						JInputText({ref : 'unprofitness', name:'Убыточность клиента', defaultValue:num2(c.lossness), readonly:true})
					)
				)
		)
	}
});
JClientEdit = React.createFactory(JClientEdit);
