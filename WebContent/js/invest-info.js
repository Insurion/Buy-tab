'use strict';

var JInvestInfo = React.createClass({
	displayName : 'JInvestInfo',

	getDefaultProps : function() {
		return {
			f:['username', 'lastname', 'firstname', 'middlename', 'sex', 'email', 'phone', 'dtp', 'dul', 'dulkem', 'duldt', 'city', 'street', 'dom', 'flat', 'bankbic', 'bankacc'],
			dtp:[{key:'A', value: 'Паспорт РФ'}]
		};
	},

	getInitialState : function() {
		return {
			loading:false, readonly:true
		};
	},

	loadData : function() {
		var props = this.props;
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'getuser', user: Store.get('login')}, function(data) {
			self.setState({loading:false, user : data});
		}, function(a, b, c) {
			self.setState({loading:false});
		});
	},
	
	doEdit : function() {
		this.loadData();
		this.setState({readonly:false});
	},
	
	doSave : function() {
		var duldt = this.refs['duldt'].value();
		if(duldt){
			var formats = [moment.ISO_8601, 'DD.MM.YYYY'];
			if(!moment(duldt, formats, true).isValid()){
				alert('Неверная Дата');
				return;
			}
		}
		var v = this.refs['username'].value();
		if(!v || v.trim() == ''){
			alert('Поле не заполнено: Логин');
			return;
		}
		v = this.refs['email'].value();
		if(!v || v.trim() == ''){
			alert('Поле не заполнено: E-mail');
			return;
		}		
		var self = this;
		var row = this.state.user;
		var c = this.state.user.client;
		self.setState({loading:true});
		var data = {};
		this.props.f.map( function(v) { 
			if(self.refs[v]){
				data[v] = self.refs[v].state.value;
				c[v] = data[v];
			}
		} );
		data['duldt'] = duldt;
		data['dul'] = this.refs['dul'].value();
		data['phone'] = this.refs['phone'].value();
		data['iduser'] = (row && row.id)?row.id:'0';
		data['method'] = 'saveuser';
		Rest.ajax2(data, 				
		function(data) {
			if(data.error){
				alert('Error: ' + data.error);
				return;
			}			
			self.loadData();
			self.setState({loading:false, readonly:true});
		}, function() {
			self.setState({loading:false});
		});
	},
	
	doSaveCancel : function() {
		this.setState({readonly:true});
		this.loadData();
	},
	
	doPwd : function() {
		this.setState({route:'pwd'});
	},

	componentWillMount : function() {
		this.loadData();
	},
	
	childUpdated : function() {
		this.loadData();
		this.setState({route: "main"});
	},
	
	render : function() {
		if (this.state.loading || !this.state.user) {
			return JControlLoading({loading:this.state.loading});
		}
		
		if(this.state.route == 'pwd'){
			return (
					JChangePwd({username:this.state.user.client.name, childUpdated: this.childUpdated})
			)
		}
		
		var u = this.state.user;
		var c = u.client;
		return (
				React.DOM.div({className:'div-main-child'}, 
						JTitleDiv({title:'Личные данные'}, 
								JInputText({ref : 'username', name:'Логин', defaultValue:c.name, readonly:this.state.readonly}),
								JInputText({ref : 'lastname', name:'Фамилия', defaultValue:c.lastname, readonly:this.state.readonly}),
								JInputText({ref : 'firstname', name:'Имя', defaultValue:c.firstname, readonly:this.state.readonly}),
								JInputText({ref : 'middlename', name:'Отчество', defaultValue:c.middlename, readonly:this.state.readonly}),
								JSelect({ref : 'sex', name:'Пол', defaultValue:c.sex, firstEmpty:true, readonly:this.state.readonly, data:[{key:'M', value: 'Муж.'}, {key:'F', value: 'Жен.'}]}),
								JInputText({ref : 'email', name:'E-mail', defaultValue:u.email, readonly:this.state.readonly}),
								//JInputText({ref : 'phone', name:'Телефон', defaultValue:c.phone, readonly:this.state.readonly})
								JMaskedInput({ref : 'phone', id:'phone', name:'Телефон', defaultValue:c.phone, readonly:this.state.readonly, mask:'(999) 999-9999', placeholder:'(NNN) NNN-NNNN'})
						),
						JTitleDiv({title:'Паспортные данные'}, 
								JSelect({ref : 'dtp', name:'Тип паспорта', defaultValue:c.dtp, firstEmpty:true, readonly:this.state.readonly, data:this.props.dtp}),
								//JInputText({ref : 'dul', name:'Номер документа', defaultValue:c.dul, readonly:this.state.readonly}),
								JMaskedInput({ref : 'dul', id:'dul', name:'Номер документа', defaultValue:c.dul, readonly:this.state.readonly, mask:'9999 999999', placeholder:'NNNN NNNNNN'}),
								JInputText({ref : 'dulkem', name:'Кем выдан', defaultValue:c.dulkem, readonly:this.state.readonly}),
								JMaskedDate({ref : 'duldt', name:'Дата выдачи', defaultValue:c.duldt, readonly:this.state.readonly})
						),
						JTitleDiv({title:'Данные прописки'}, 
								JInputText({ref : 'city', name:'Город', defaultValue:c.city, readonly:this.state.readonly}),
								JInputText({ref : 'street', name:'Улица', defaultValue:c.street, readonly:this.state.readonly}),
								JInputText({ref : 'dom', name:'Дом и корпус', defaultValue:c.dom, readonly:this.state.readonly}),
								JInputText({ref : 'flat', name:'Квартира', defaultValue:c.flat, readonly:this.state.readonly})
						)
						,
						JTitleDiv({title:'Банковские реквизиты'}, 
								JInputText({maxlength:'9', ref : 'bankbic', name:'БИК банка', defaultValue:c.bankbic, readonly:this.state.readonly}),
								JInputText({maxlength:'20', ref : 'bankacc', name:'Номер счета', defaultValue:c.bankacc, readonly:this.state.readonly})
						),
						
						React.DOM.div(null, 
							JControlLoading({loading:this.state.loading}),
							(this.state.readonly)?JButton({style:{display:'inline-block'}, onClick : this.doEdit, caption:'Редактировать'}):null,
							(this.state.readonly)?JButton({style:{display:'inline-block'}, onClick : this.doPwd, caption:'Сменить пароль'}):null,		
							(!this.state.readonly)?JButton({style:{display:'inline-block'}, onClick : this.doSave, caption:'Сохранить'}):null,
							(!this.state.readonly)?JButton({style:{display:'inline-block'}, onClick : this.doSaveCancel, caption:'Отмена'}):null
						)
		))
	}
});
JInvestInfo = React.createFactory(JInvestInfo);
