'use strict';

var JLogin = React.createClass({
	displayName : 'JLogin',

	getDefaultProps : function() {
		return {
			route:'login', a:undefined
		};
	},

	getInitialState : function() {
		return {
			loading : false,
			loginFailed : false,
			regOk : false,
			regErr : false,
			regTxt : undefined
		};
	},
	
	componentDidUpdate : function(prevProps, prevState){
		this.mountCaptcha();
	},
	
	componentDidMount : function() {
		this.mountCaptcha();
	},
	
	mountCaptcha : function() {
		var isEmpty = document.getElementById('rdiv').innerHTML === '';
		if(!isEmpty){
			return;
		}
		var self = this;
		var verifyCallback = function( response ) {
		    self.setState({rcptch:response});
		}
		var f = function() { 
			if(!captchaLoaded){
				window.setTimeout(f, 300);
				return;
			}
			grecaptcha.render('rdiv', {sitekey: '6Lcq-woUAAAAAGnWcxf6Cm2XvhNpP55u_xRZpxjw', 
				'callback': verifyCallback}); 
		}
		window.setTimeout(f, 300);
	},

	login : function() {
		var props = this.props;
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'login', forcelogin: this.refs.name.state.value, password: this.refs.password.state.value, a:this.props.a, rcptch:this.state.rcptch}, function(data) {
			self.setState({loading:false});

			if(!data.name){
				//alert('Invalid name or password');
				self.setState({loginFailed:true});
				return;
			}
			//console.log('login:' + data.digest);
			Store.set('digest', data.digest);
			Store.set('login', data.name);
			Store.set('firstname', data.firstname);
			props.onLoginSuccess(data);
		}, function(a, b, c) {
			self.setState({loading:false});
		});
	},
	
	reguser : function() {
		var props = this.props;
		var self = this;
		self.setState({loading:true});
		self.setState({regOk:false});
		Rest.ajax2({method: 'reguser', forcelogin: this.refs.email.state.value, rcptch:this.state.rcptch}, function(data) {
			self.setState({loading:false});
			//self.setState({route:'login'});
			if(data.error){
				self.setState({regErr:true, regTxt:data.error});
				return;
			}
			if(data.status == '1'){
				self.setState({regOk:true});
				return;
			}
		}, function(e) {
			self.setState({loading:false});
			self.setState({regErr:true, regTxt:e});
		});
	},
	
	resuser : function() {
		var props = this.props;
		var self = this;
		self.setState({loading:true});
		self.setState({forgotOk:false});
		Rest.ajax2({method: 'resuser', forcelogin: this.refs.email.state.value, rcptch:this.state.rcptch}, function(data) {
			self.setState({loading:false});
			if(data.error){
				self.setState({forgotErr:true, regTxt:data.error});
				return;
			}
			if(data.status == '1'){
				self.setState({forgotOk:true});
				return;
			}
		}, function(e) {
			self.setState({loading:false});
			self.setState({forgotErr:true, regTxt:e});
		});
	},
	
	onEnterKey : function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			this.login();
	        return false;
	    }
	},
	
	onRegister : function(e) {
		this.setState({route:'reg', key:Math.random()});
	},
	
	onForgot : function(e) {
		this.setState({route:'forgot', key:Math.random()});
	},
	
	onBack : function(e) {
		this.setState({route:'login', key:Math.random(), regOk:false, regErr:false, forgotOk:false, forgotErr:false, regTxt:undefined});
	},

	render : function() {
		var login = Store.get('login');
		login = (login == undefined)?'':login;

		if(this.state.route == 'reg'){
			return (
					React.DOM.div({className: 'div-login'}, 
						React.DOM.div({style:{marginLeft:'45pt'}}, JHeader({title : 'Insurion'})),
						React.DOM.div({style:{textAlign:'center', marginTop:'5pt'}}, React.DOM.span({style:{fontSize:'14pt', fontFamily: 'PFDinTextProLight'}}, 'Регистрация')),
						React.DOM.div(null, 
							JLoginInput({ref: 'email', textwidth:'290px', defaultValue:login, onKeyPress:this.onEnterKey, placeholder:'Введите E-mail', tooltip:'Введите E-mail'}),
							React.DOM.div(null, (this.state.regOk)?React.DOM.span({style:{color:'blue', fontSize:'9pt'}}, 'Вам отправлено письмо с паролем и ссылкой для подтверждения'):null),
							React.DOM.div(null, (this.state.regErr)?React.DOM.span({style:{color:'red', fontSize:'9pt'}}, this.state.regTxt):null),
							JControlLoading({loading:this.state.loading})
						),
						React.DOM.div({className: 'g-recaptcha', id:'rdiv'}),
						React.DOM.div(null, 
							JButton({className: 'ui-btn ui-shadow ui-corner-all ui-btn-inline div-100', style:{display:'inline-block', width:'284px', marginLeft: '0pt'}, onClick : this.reguser, caption:'Зарегистрировать'})
						),
						React.DOM.div(null, 
							JHref({style:{display:'inline-block', margin:'10pt 0'}, onClick : this.onBack, caption:'Назад'})
						)
					)
			)
		}
		
		if(this.state.route == 'forgot'){
			return (
					React.DOM.div({className: 'div-login'},
						React.DOM.div({style:{marginLeft:'45pt'}}, JHeader({title : 'Insurion'})),
						React.DOM.div({style:{textAlign:'center', marginTop:'5pt'}}, React.DOM.span({style:{fontSize:'14pt', fontFamily: 'PFDinTextProLight'}}, 'Восстановление пароля')),
						React.DOM.div({key:this.state.key}, 
							JLoginInput({ref: 'email', textwidth:'290px', defaultValue:login, onKeyPress:this.onEnterKey, placeholder:'Введите E-mail', tooltip:'Введите E-mail'}),
							React.DOM.div(null, (this.state.forgotOk)?React.DOM.span({style:{color:'blue', fontSize:'9pt'}}, 'Вам отправлено письмо с подтверждением'):null),
							React.DOM.div(null, (this.state.forgotErr)?React.DOM.span({style:{color:'red', fontSize:'9pt'}}, this.state.regTxt):null),
							JControlLoading({loading:this.state.loading})
						),
						React.DOM.div({className: 'g-recaptcha', id:'rdiv'}),
						React.DOM.div(null, 							
								(this.state.forgotOk)?null:JButton({className: 'ui-btn ui-shadow ui-corner-all ui-btn-inline div-100', style:{display:'inline-block', width:'284px', marginLeft: '0pt'}, onClick : this.resuser, caption:'Восстановить'})
									//JButton({style:{display:'inline-block'}, onClick : this.resuser, caption:'Восстановить'})
						),
						React.DOM.div(null, 
							JHref({style:{display:'inline-block', margin:'10pt 0'}, onClick : this.onBack, caption:'Назад'})
						)
					)
			)
		}
		return (
				React.DOM.div({key:this.state.key, className: 'div-login'}, 
					React.DOM.div({style:{marginLeft:'45pt'}}, JHeader({title : 'Insurion'})),
					React.DOM.div({style:{textAlign:'center', marginTop:'5pt'}}, React.DOM.span({style:{fontSize:'14pt', fontFamily: 'PFDinTextProLight'}}, 'Вход в личный кабинет')),
					React.DOM.div(null,
						JLoginInput({ref: 'name', textwidth:'290px', autocomplete:'true', defaultValue:login, onKeyPress:this.onEnterKey, placeholder:'Логин'}),
						JLoginInput({ref: 'password', textwidth:'290px', onKeyPress:this.onEnterKey, type: 'password', placeholder:'Пароль'}),
						React.DOM.div(null, (this.state.loginFailed)?React.DOM.span({style:{color:'red', fontSize:'9pt'}}, 'Неверное имя пользователя или пароль'):null),
						JControlLoading({loading:this.state.loading})
					),
					React.DOM.div({className: 'g-recaptcha', id:'rdiv', 'data-size':'compact'}),
					React.DOM.div(null, 
							JButton({className: 'ui-btn ui-shadow ui-corner-all ui-btn-inline div-100', style:{display:'inline-block', width:'284px', marginLeft: '0pt'}, onClick : this.login, caption:'Войти'})
					),
					React.DOM.div(null, 
							JHref({style:{display:'inline-block', margin:'10pt 0'}, onClick : this.onRegister, caption:'Регистрация'})
					),
					React.DOM.div(null, 
							JHref({style:{display:'inline-block'}, onClick : this.onForgot, caption:'Забыл пароль?'})
					)
				)
				
		)
	}
});
JLogin = React.createFactory(JLogin);
