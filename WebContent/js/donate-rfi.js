'use strict';

var JDonate = React.createClass({
	displayName : 'JDonate',

	getDefaultProps : function() {
		return {
			className : 'donate'
		};
	},

	getInitialState : function() {
		return {
			status : '0'
		};
	},

	showDonate : function() {
		this.setState({
			status : '1'
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
		Rest.ajax2({method: 'saveop', user: Store.get('login'), sum: this.state.sum}, 
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
		document.getElementById("payform").submit();
	},
	
	setPayment : function() {
		$('#cost').val(this.state.op.sum);
		//$('#name').val('Внесение средств №' + this.state.op.id);
		$('#name').val('Fund income No.' + this.state.op.id);
		//$('#name').val(this.state.op.id);
		$('#default_email').val(this.state.op.email);
		$('#order_id').val(this.state.op.id);
	},

	render : function() {
		if (this.state.status == '0') {
			return (
					React.DOM.div({style:{width: '150pt'}}, 
						JButton({style:{width: '100%'}, onClick : this.showDonate, caption: 'ВНЕСТИ СРЕДСТВА'})
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
							JTitleDiv({title:'Переход в платежную систему'}, React.DOM.div(null,
									JInputText({name:'Сумма внесения, руб.', defaultValue:num2(this.state.sum), bold:true, readonly:true}),
									//JInputText({name:'Ваш E-mail', defaultValue:this.state.op.email, bold:true, readonly:true}),
									JInputText({name:'ВНИМАНИЕ!', defaultValue:txt, bold:true, color:'red', readonly:true}),
									React.DOM.form({id: 'payform', method:'POST', class:'application',  acceptCharset:'UTF-8', action:'https://partner.rficb.ru/alba/input/',
									    onSubmit: function(e) {alert('Pay Button press')}}, 
									  React.DOM.input({type:'hidden', name:'key', value:'JHdLq9Cn5QfQwxzTos4mdxSNSNcuBf286Gp4DBJDpEs:'}), 
									  React.DOM.input({type:'hidden', name:'cost', id:'cost'}),
									  React.DOM.input({type:'hidden', name:'name', id:'name'}), 
									  React.DOM.input({type:'hidden', name:'default_email', id:'default_email'}), 
									  React.DOM.input({type:'hidden', name:'order_id', id:'order_id'}), 
									  //React.DOM.input({type:'hidden', name:'test', id:'test', value:'1'}), 
									  //React.DOM.img({style:{border:'0pt'}, id:'a1lite_button', src:'https://partner.rficb.ru/gui/images/a1lite_buttons/button_small.png', value:'Оплатить', onClick:this.paySubmit})
									  JBtnSaveCancel({loading: this.state.loading, onSave:this.doDonate, onCancel:this.hideDonate, captionSave: 'Оплатить'})
									  //JButton({caption:'Оплатить', onClick:this.paySubmit}), JButton({caption:'Отмена', onClick:this.hideDonate})
									)
								)
							)
					)
			)
		}
	}
});
JDonate = React.createFactory(JDonate);
