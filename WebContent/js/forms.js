'use strict';

var JChangePwd = React.createClass({
	displayName : 'JChangePwd',

	getDefaultProps : function() {
		return {username:''};
	},

	getInitialState : function() {
		return {pwdfailed: false};
	},
	
	doSave : function() {
		if(this.refs.new1.state.value != this.refs.new2.state.value){
			this.setState({pwdfailed:true});
			return;
		}
		
		this.setState({pwdfailed:false});
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method:'chngpwd', user:this.props.username, p1:this.refs.old.state.value, p2:this.refs.new1.state.value}, 				
		function(data) {
			self.setState({loading:false});
			if(data.error){
				alert('Error: ' + data.error);
				return;
			}
			//Store.set('digest', '');
			if(self.props.childUpdated){
				self.props.childUpdated();
			}
		}, function() {
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
					JTitleDiv({title:'Смена пароля'}, 
						JInputText({name:'Пользователь', defaultValue:this.props.username, readonly:true}),
						JInputText({type: 'password', ref : 'old', name:'Старый пароль', defaultValue:''}),
						JInputText({type: 'password', ref : 'new1', name:'Новый пароль', defaultValue:''}),	
						JInputText({type: 'password', ref : 'new2', name:'Повтор нового пароля', defaultValue:''}),	
						React.DOM.div(null, (this.state.pwdfailed)?React.DOM.span({style:{color:"red", fontSize:"9pt"}}, "Повтор нового пароля введен неверно"):null)
					),
					JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel})
		))
	}
});
JChangePwd = React.createFactory(JChangePwd);

var JWithdraw = React.createClass({
	displayName : 'JWithdraw',

	getDefaultProps : function() {
		return {};
	},

	getInitialState : function() {
		return {sum: 0, wc: 0};
	},
	
	componentWillMount : function() {
		this.loadData();
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
		Rest.ajax2({method: 'dictv', code: 'withdrawCommission'}, function(data) {
			self.setState({wc : data.value});
		});
	},
	
	doSave : function() {
		this.setState({sum: this.refs.sum.state.value});
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method:'withdraw', iduser:this.state.user.id, sum:this.refs.sum.state.value}, 				
		function(data) {
			self.setState({loading:false});
			if(data.error){
				alert('Error: ' + data.error);
				return;
			}
			if(self.props.childUpdated){
				self.props.childUpdated();
			}
		}, function() {
			self.setState({loading:false});
		});
	},
	
	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	sumChange : function(ev) {
		this.setState({sum: ev.target.value});
		
	},

	render : function() {
		if (this.state.loading || !this.state.user) {
			return JControlLoading({loading:this.state.loading});
		}
		var u = this.state.user;
		var c = u.client;
		var csum = this.state.wc*this.state.sum/100;
		var ta = this.state.sum - csum;
		return (
			React.DOM.div(null,
				JTitleDiv({title:'Сумма'}, 
					JInputText({ref : 'sum', name:'Сумма вывода, руб.', defaultValue:num2(this.state.sum), onChange:this.sumChange}),
					JInputText({ref : 'wc', name:'Комиссия за вывод, '+ num2(this.state.wc) + '%, руб.', defaultValue:num2(csum), readonly:true}),
					JInputText({ref : 'ta', name:'Сумма поступления на счет, руб.', defaultValue:num2(ta), readonly:true})
				),
				JTitleDiv({title:'Реквизиты'}, 
					JInputText({maxlength:'9', ref : 'bankbic', name:'БИК банка', defaultValue:c.bankbic, readonly:true}),
					JInputText({maxlength:'20', ref : 'bankacc', name:'Номер счета', defaultValue:c.bankacc, readonly:true})
				),
				JBtnSaveCancel({loading: this.state.loading, captionSave:'Оставить заявку', onSave:this.doSave, onCancel:this.doCancel})
		))
	}
});
JWithdraw = React.createFactory(JWithdraw);

var JWithdrawConfirm = React.createClass({
	displayName : 'JWithdrawConfirm',

	getDefaultProps : function() {
		return {sum: '0.00'};
	},

	getInitialState : function() {
		return {sum: '0.00'};
	},
	
	loadData : function() {
		var props = this.props;
		var self = this;
		Rest.ajax2({method: "usrsaldo", user: this.props.lg}, function(data) {
			self.setState({key: Math.random(), sum: data.s[4]});
		});
	},
	
	doSave : function() {
		this.setState({sum: this.refs.sum.state.value});
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method:'withdrawc', iduser:this.props.userid, sum:this.refs.sum.state.value}, 				
		function(data) {
			self.setState({loading:false});
			if(data.error){
				alert('Error: ' + data.error);
				return;
			}
			if(self.props.childUpdated){
				self.props.childUpdated();
			}
		}, function() {
			self.setState({loading:false});
		});
	},
	
	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	componentWillMount : function() {
		this.loadData();
	},

	render : function() {
		return (
				JModalContainer({key: this.state.key}, 
					JTitleDiv({title:'Подтверждение вывода'}, 
						JInputText({ref : 'sum', name:'Сумма, руб.', defaultValue:num2(this.state.sum)})
					),
					JBtnSaveCancel({loading: this.state.loading, onSave:this.doSave, onCancel:this.doCancel})
		))
	}
});
JWithdrawConfirm = React.createFactory(JWithdrawConfirm);
