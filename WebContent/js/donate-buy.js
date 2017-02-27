'use strict';

var JDonateBuy = React.createClass({
	displayName : 'JDonateBuy',

	getDefaultProps : function() {
		return {
			sum : 120
		};
	},

	getInitialState : function() {
		return {
			status : '0', sum : 120
		};
	},
	
	componentDidMount : function() {
		this.setState({
			lastname:document.getElementById('lastname').value,
			firstname:document.getElementById('firstname').value,
			middlename:document.getElementById('middlename').value,
			email:document.getElementById('e-mail').value,
			phone:document.getElementById('phone').value,
			dul:document.getElementById('dul').value,
			dulkem:document.getElementById('dulkem').value,
			duldt:document.getElementById('duldt').value,
			fnum:document.getElementById('fnum').value,
			fdt:document.getElementById('fdt').value
		});
	},

	showDonate : function() {
		this.setState({
			status : '2'
		});
	},
	
	hideDonate : function() {
		this.setState({
			status : '0', id: 0
		});
	},
	
	doStage2 : function() {
		var sum = this.refs.sum.value();
		if(Number(sum) <= 0){
			alert('Неверная сумма');
			return;
		}
		this.setState({sum: sum, status:'2'});
	},
	
	doDonate : function() {
		if(Number(this.state.sum) <= 0){
			alert('Неверная сумма');
			return;
		}
		var props = this.props;
		var self = this;
		Rest.ajax2({method: 'buyop', data: JSON.stringify(this.state), sum: this.state.sum}, 
		function(data) {
			var op = data.op;
			if(Number(op.id) > 0){		
				self.setState({op:op, status:'2'});
				self.setPayment();
				self.paySubmit();
				/*if(props.childUpdated){
					props.childUpdated();
				}*/
			} else {
				alert('Произола ошибка');
			}
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
		
		//$('#customName1').val(this.state.op.name1);
		//$('#customValue1').val(this.state.op.value1);
	},
	
	mandarinpay: function() {
		var f = $('#payform');
		mandarin.payForm(f);
	},

	render : function() {
		if (this.state.status == '0') {
			return (
					React.DOM.div({style:{width: '150pt'}}, 
						JButton({style:{width: '100%'}, onClick : this.showDonate, caption: 'Купить (120.00 RUB)'})
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
			var txt = 'После нажатия на кнопку "Оплатить" Вы будете перенаправлены на страницу платежной системы, где сможете завершить платеж';
			return (
					JModalContainer(null,
							JTitleDiv({title:'Личные данные'}, 
								JInputText({name:'Фамилия', defaultValue:this.state.lastname, readonly:true}),
								JInputText({name:'Имя', defaultValue:this.state.firstname, readonly:true}),
								JInputText({name:'Отчество', defaultValue:this.state.middlename, readonly:true}),
								JInputText({name:'E-mail', defaultValue:this.state.email, readonly:true}),
								JInputText({name:'Телефон', defaultValue:this.state.phone, readonly:true}),
								JInputText({name:'Номер документа', defaultValue:this.state.dul, readonly:true}),
								JInputText({name:'Кем выдан', defaultValue:this.state.dulkem, readonly:true}),
								JMaskedDate({name:'Дата выдачи', defaultValue:this.state.duldt, readonly:true}),
								JInputText({name:'Номер рейса', defaultValue:this.state.fnum, readonly:true}),
								JInputText({name:'Дата вылета', defaultValue:this.state.fdt, readonly:true})
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
JDonateBuy = React.createFactory(JDonateBuy);
