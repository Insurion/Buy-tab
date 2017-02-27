'use strict';

var JLoginBuy = React.createClass({
	displayName : 'JLoginBuy',

	getDefaultProps : function() {
		return {
			f:['lastname', 'firstname', 'middlename', 'e-mail', 'phone', 'dul', 'dulkem', 'duldt', 'fnum', 'fdt', 'card'],
			n:['Фамилия', 'Имя', 'Отчество', 'E-mail', 'Телефон', 'Номер паспорта', 'Кем выдан', 'Дата выдачи', 'Номер рейса', 'Дата вылета', 'Номер карты для возмещения'],
			m:[true, true, true, true, true, true, true, true, true, false, true]
		};
	},
	
	getInitialState : function() {
		return {route:'0', ro:false, status:'0', sum : 99, loading: false};
	},
	
	validatePhone: function (v) {
		return v.match(/\d/g).length===10;
	},
	
	validateEmail: function (v) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(v);
	},
	
	showDonate : function() {
		var self = this;
		var b = true;
		this.props.f.map(function(row, i) {
			var el = document.getElementById(row);
			if(self.props.m[i] && (!el || !el.value || el.value == '')){
				if(b)alert('Заполните значение поля "' + self.props.n[i] + '"');
				b = false;
				return;
			}
			Store.set(row, document.getElementById(row).value);
		});
		if(!b){
			return;
		}
		
		/*if(!this.validatePhone(Store.get('phone'))){
			alert('Неверный формат поля "Телефон"');
			return;
		}*/
		if(!this.validateEmail(Store.get('e-mail'))){
			alert('Неверный формат поля "E-mail"');
			return;
		}
		/*if(!this.validatePhone(Store.get('dul'))){
			alert('Неверный формат поля "Номер паспорта"');
			return;
		}*/
		
		this.setState({
			status : '2',
			lastname:document.getElementById('lastname').value,
			firstname:document.getElementById('firstname').value,
			middlename:document.getElementById('middlename').value,
			email:document.getElementById('e-mail').value,
			phone:document.getElementById('phone').value,
			dul:document.getElementById('dul').value,
			dulkem:document.getElementById('dulkem').value,
			duldt:document.getElementById('duldt').value,
			fnum:document.getElementById('fnum').value,
			fdt:document.getElementById('fdt').value,
			card:document.getElementById('card').value
		});
	},
	
	hideDonate : function() {
		this.setState({
			status : '0', id: 0
		});
	},
	
	doDonate : function() {
		if(Number(this.state.sum) <= 0){
			alert('Неверная сумма');
			return;
		}
		
		if(!Store.get('login') || Store.get('login') == ''){
			Store.set('login', 'payer');
		}
		this.setState({loading:true});
		var props = this.props;
		var self = this;
		Rest.ajax2({method: 'buyop', data: JSON.stringify(this.state), sum: this.state.sum}, 
		function(data) {
			self.setState({loading:false});
			var op = data.op;
			if(op && Number(op.id) > 0){		
				self.setState({op:op, status:'2'});
				self.setPayment();
				self.paySubmit();
				/*if(props.childUpdated){
					props.childUpdated();
				}*/
			} else {
				alert('Произола ошибка');
			}
		},
		function(data) {
			self.setState({loading:false});
		});
	},
	
	paySubmit : function() {
		//document.getElementById("payform").submit();
		var form = document.getElementById("payform");
		mandarin.payForm(form);
	},
	
	setPayment : function() {
		$('#price').val(this.state.op.price);
		//$('#name').val('Fund income No.' + this.state.op.id);
		$('#email').val(this.state.op.email);
		$('#orderId').val(this.state.op.id);
		$('#sign').val(this.state.op.sign);
		$('#merchantId').val(this.state.op.merchantId);
		$('#customName1').val(this.state.op.name1);
		$('#customValue1').val(this.state.op.value1);
	},
	
	mandarinpay: function() {
		var f = $('#payform');
		mandarin.payForm(f);
	},

	render : function() {
		return (
				React.DOM.div({key:this.state.key, className: 'div-login'}, 
					React.DOM.div({style:{marginLeft:'45pt'}}, JHeader({title : 'Insurion'})),
					React.DOM.div({style:{textAlign:'center', marginTop:'5pt'}}, React.DOM.span({style:{fontSize:'14pt', fontFamily: 'PFDinTextProLight'}}, 'Покупка страховки')),
					React.DOM.div(null,
							JTitleDiv({title:'Личные данные'}, 
								JInputText({id : 'lastname', name:'*Фамилия', defaultValue:Store.get('lastname'), maxlength:100, readonly:this.state.ro}),
								JInputText({id : 'firstname', name:'*Имя', defaultValue:Store.get('firstname'), maxlength:100, readonly:this.state.ro}),
								JInputText({id : 'middlename', name:'*Отчество', defaultValue:Store.get('middlename'), maxlength:100, readonly:this.state.ro}),
								JInputText({id : 'e-mail', name:'*E-mail', defaultValue:Store.get('e-mail'), maxlength:50, readonly:this.state.ro}),
								JInputText({id : 'phone', name:'*Телефон', defaultValue:Store.get('phone'), maxlength:50, readonly:this.state.ro})
							),
							JTitleDiv({title:'Паспортные данные'},
								JInputText({id : 'dul', name:'*Серия и номер паспорта', defaultValue:Store.get('dul'), maxlength:50, readonly:this.state.ro}),
								JInputText({id : 'dulkem', name:'*Кем выдан', defaultValue:Store.get('dulkem'), maxlength:100, readonly:this.state.ro}),
								JMaskedDate({id : 'duldt', name:'*Дата выдачи', defaultValue:Store.get('duldt'), readonly:this.state.ro})
							),
							JTitleDiv({title:'Рейс'},
								JInputText({id : 'fnum', name:'*Номер рейса', defaultValue:Store.get('fnum'), maxlength:20, readonly:this.state.ro}),
								JMaskedDate({id : 'fdt', name:'Дата вылылета', defaultValue:Store.get('fdt'), readonly:this.state.ro})
							),
							JTitleDiv({title:'Возмещение'},
								React.DOM.span(null, 'На указанную Вами карту будут выплачиваться возмещения. Обычно деньги поступают на карту в течении 2-х минут, однако максимальный срок перевода составляет 3 раб. дня'),
								JInputText({id : 'card', name:'*Номер карты для возмещения', defaultValue:Store.get('card'), maxlength:19, readonly:this.state.ro})
							)
					),
					React.DOM.div(null, 
							//(this.state.route == '1')?JDonateBuy({data: this.state}):JButton({caption: 'Подтверждаю', onClick:this.onConfirm})
							//JDonateBuy({data: this.state})
							this.renderBuy()
					)
				)
				
		)
	},
	
	renderBuy: function() {
		if (this.state.status == '0') {
			return (
					React.DOM.div({style:{width: '150pt'}}, 
						JButton({style:{width: '100%'}, onClick : this.showDonate, caption: 'Купить (99.00 RUB)'})
					)
			)
		} else if (this.state.status == '1') {
			return (
					JModalContainer(null,
						JTitleDiv({title:'Введите сумму вносимых средств'}, 
							JInputText({ref : 'sum', name:'Сумма, руб.', defaultValue:num2(0)})
						),
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doStage2, onCancel:this.hideDonate, captionSave: 'Продолжить'})
					)
			)
		} else if (this.state.status == '2') {
			var self = this;
			var txt = 'После нажатия на кнопку "Оплатить" Вы будете перенаправлены на страницу платежной системы, где сможете завершить платеж';
			return (
					JModalContainer(null,
							JTitleDiv({title:'Личные данные'}, 
									this.props.f.map(function(row, i) {
										return JInputText({name:self.props.n[i], defaultValue:Store.get(row), readonly:true})
									})
							),
							JTitleDiv({title:'Переход в платежную систему'}, React.DOM.div(null,
									JInputText({name:'Сумма внесения, руб.', defaultValue:num2(this.state.sum), bold:true, readonly:true}),
									JInputText({name:'ВНИМАНИЕ!', defaultValue:txt, bold:true, color:'red', readonly:true}),
									React.DOM.form({id:'payform', method:'POST', action:'https://secure.mandarinpay.com/Pay/'}, 
									  React.DOM.input({type:'hidden', name:'price', id:'price'}),
									  React.DOM.input({type:'hidden', name:'orderId', id:'orderId'}), 
									  React.DOM.input({type:'hidden', name:'email', id:'email'}),
									  React.DOM.input({type:'hidden', name:'merchantId', id:'merchantId'}),
									  React.DOM.input({type:'hidden', name:'sign', id:'sign'}),
									  React.DOM.input({type:'hidden', name:'customName1', id:'customName1'}),
									  React.DOM.input({type:'hidden', name:'customValue1', id:'customValue1'})
									),
									JBtnSaveCancel({loading: this.state.loading, onSave:this.doDonate, onCancel:this.hideDonate, captionSave: 'Оплатить'})
								)
							)
					)
			)
		}
	}
});
JLoginBuy = React.createFactory(JLoginBuy);
