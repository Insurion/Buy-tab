'use strict';

var JUserEdit = React.createClass({
	displayName : 'JUserEdit',

	getDefaultProps : function() {
		return {
			f:['status', 'createdate', 'username', 'lastname', 'firstname', 'middlename', 'sex', 'email', 'phone', 'dtp', 'dul', 'dulkem', 
			   'duldt', 'city', 'street', 'dom', 'flat', 'bankbic', 'bankacc'],
			dtp:[{key:'A', value: 'Паспорт РФ'}]
		};
	},

	getInitialState : function() {
		return {
			loading : false
		};
	},

	doSave : function() {
		if(!checkMaskedDate(this.refs['duldt'])){return;};
		if(!checkMaskedDate(this.refs['createdate'])){return;};
		var props = this.props;
		var row = this.props.row;
		var self = this;
		self.setState({loading:true});
		var data = {};
		this.props.f.map( function(v) { 
			data[v] = self.refs[v].state.value;
		} );
		data['duldt'] = this.refs['duldt'].value();
		data['createdate'] = this.refs['createdate'].value();
		data['iduser'] = (row && row.id)?row.id:'0';
		//data['ctp'] = this.refs['ctp'].value();
		data['method'] = 'saveuser';
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
	
	doPwd : function() {
		this.setState({route:'pwd'});
	},
	
	doWthdrw : function() {
		this.setState({route:'wthdrw'});
	},

	childUpdated : function() {
		this.setState({route:'main', key: Math.random()});
	},

	render : function() {
		if(this.state.route == 'pwd'){
			return (
					JChangePwd({username:this.props.row.client.name, childUpdated: this.childUpdated})
			)
		}
		
		if(this.state.route == 'wthdrw'){
			return (
					JWithdrawConfirm({sum:0, userid:this.props.row.id,  lg:this.props.row.name, childUpdated: this.childUpdated})
			)
		}
		
		var row = {};
		if(this.props.row != undefined){
			row = this.props.row;
		}
		var c = row.client;
		if(!c){
			c = {};
		}
		return (
				JModalContainer(null,
						JTitleDiv({title:'Действия', width:'130pt'}, 
							JButton({onClick : this.doPwd, caption:'Смена пароля'}),
							JButton({onClick : this.doWthdrw, caption:'Подтв. вывод'})
						),
						JTitleDiv({title:'Состояние счета'}, 
							JBalance({lg:row.name})
						),
						JTitleDiv({title:'Личные данные'}, 
							JMaskedDate({ref : 'createdate', name:'Дата создания', defaultValue:c.createdate, id:'dt_createdate'}),
							JInputText({ref : 'username', name:'Логин', defaultValue:row.name}),
							JSelect({ref : 'status', name:'Статус', defaultValue:row.status, firstEmpty:true, data:[{key:'INIT', value: 'INIT'}, {key:'REG', value: 'REG'}, {key:'INVEST', value: 'INVEST'}, {key:'BLOCKED', value: 'BLOCKED'}]}),
							JInputText({name:'Админ', defaultValue:((row.admin==1)?'Да':'Нет'), readonly:true}),
							JInputText({ref : 'lastname', name:'Фамилия', defaultValue:c.lastname}),
							JInputText({ref : 'firstname', name:'Имя', defaultValue:c.firstname}),
							JInputText({ref : 'middlename', name:'Отчество', defaultValue:c.middlename}),
							JSelect({ref : 'sex', name:'Пол', defaultValue:c.sex, firstEmpty:true, data:[{key:'M', value: 'Муж.'}, {key:'F', value: 'Жен.'}]}),
							JInputText({ref : 'email', name:'E-mail', defaultValue:row.email}),
							JInputText({ref : 'phone', name:'Телефон', defaultValue:c.phone})
						),
						JTitleDiv({title:'Паспортные данные'},
							JSelect({ref : 'dtp', name:'Тип паспорта', defaultValue:c.dtp, firstEmpty:true, data:this.props.dtp}),
							JInputText({ref : 'dul', name:'Номер документа', defaultValue:c.dul}),
							JInputText({ref : 'dulkem', name:'Кем выдан', defaultValue:c.dulkem}),
							JMaskedDate({ref : 'duldt', name:'Дата выдачи', defaultValue:c.duldt, id:'dt_duldt'})
						),
						JTitleDiv({title:'Данные прописки'}, 
							JInputText({ref : 'city', name:'Город', defaultValue:c.city}),
							JInputText({ref : 'street', name:'Улица', defaultValue:c.street}),
							JInputText({ref : 'dom', name:'Дом и корпус', defaultValue:c.dom}),
							JInputText({ref : 'flat', name:'Квартира', defaultValue:c.flat})
						),
						JTitleDiv({title:'Банковские реквизиты'}, 
							JInputText({maxlength:'9', ref : 'bankbic', name:'БИК банка', defaultValue:c.bankbic}),
							JInputText({maxlength:'20', ref : 'bankacc', name:'Номер счета', defaultValue:c.bankacc})
						),
						
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel}),						
						React.DOM.div(null, JUserDealsList({key:this.state.key, iduser:row.id, status:row.status, lg:c.name, readonly:(row && row.id)?false:true, childUpdated:this.childUpdated}))
		))
	}
});
JUserEdit = React.createFactory(JUserEdit);

