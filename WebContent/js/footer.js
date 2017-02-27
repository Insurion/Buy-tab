'use strict';

var JFooter = React.createClass({
	getInitialState : function() {
		return {route:'main'};
	},
	
	childUpdated : function() {
		var key = Math.random();
		this.setState({ route: 'main' });
	},
	
	clickPayWay : function() {
		this.setState({route:'pw'});
	},

	clickAbandon : function() {
		this.setState({route:'ab'});
	},
	
	clickSend : function() {
		this.setState({route:'s'});
	},
	
	doSend : function() {
		var props = this.props;
		var self = this;
		var msg = this.refs.msg.value;
		if(!msg || msg.trim() == ''){
			alert('Введите текст сообщения');
			return;
		}
		this.setState({loading:true});
		Rest.ajax2({method: 'sendmsg', msg: msg, cont: this.refs.cont.value()}, 
			function(data) {
				alert('Ваше сообщение успешно отправлено');
				self.setState({loading:false});
				self.childUpdated();
			}
		);
	},
	
	render : function() {
		var r;
		if(this.state.route == 'pw'){
			r = JLoadHtml({html:'pay-way.html', childUpdated: this.childUpdated});
		} else if(this.state.route == 'ab'){
			r = JLoadHtml({html:'abandon.html', childUpdated: this.childUpdated});
		} else if (this.state.route == 's') {
			r = JModalContainer(null,
						JTitleDiv({title:'Форма обратной связи Службы сопровождения Insurion'}, 
							JInputText({ref : 'cont', name:'Ваш контакт (необязательно)'}),
							React.DOM.div(null, React.DOM.span(null, 'Текст сообщения:')),
							React.DOM.textarea({ref : 'msg', cols:'50', rows:'5', placeholder:'Текст сообщения'})
						),
						JBtnSaveCancel({loading: this.state.loading, onSave:this.doSend, onCancel:this.childUpdated, captionSave: 'Отправить'})
					)
		}
		return React.DOM.div({className:'main-footer', 'datarole':'footer', 'dataposition':'fixed'}, r,
					React.DOM.div({style:{display:'inline-block', padding:'20pt 5pt', verticalAlign:'top'}},
						JButton({style: {width:'100%', whiteSpace: 'initial'}, caption: 'СООБЩИТЬ ОБ ОШИБКЕ', onClick: this.clickSend})
					),
					React.DOM.div({className:'div-footer-txt', style:{verticalAlign:'top', padding:'10pt 1pt'}},
						React.DOM.div({style:{display:'inline-block', padding:'10pt 20pt'}},
							React.DOM.img({height:'24pt', src: './visa32.png'})
						),
						React.DOM.div({style:{display:'inline-block', padding:'10pt 5pt'}},
							React.DOM.img({height:'32pt', src: './mc32.png'})
						)
					),
					React.DOM.div({className:'div-footer-txt'},
						React.DOM.div(null, React.DOM.a( {href:'http://media.wix.com/ugd/920dc7_ed23af48e5a541efa790b6fa1dae4117.pdf',
							style:{textDecoration:'none', fontWeight:'inherit',color:'#000'}}, 'Пользовательское соглашение')),
						React.DOM.div({style:{cursor:'pointer'}, onClick: this.clickAbandon}, 
								'Отказ от услуги'),
						React.DOM.div({style:{cursor:'pointer'}, onClick: this.clickPayWay},
								'Способы внесения средств')
					),
					React.DOM.div({className:'div-footer-txt'},
						React.DOM.div(null, 'ИП Кокорин Артем Михайлович'),
						React.DOM.div(null, 'ОГРНИП 316500900058764'),
						React.DOM.div(null, 'ИНН 500909120644')
					),
					React.DOM.div({className:'div-footer-txt'},
						React.DOM.div(null, 'akokorin@insurion.org'),
						React.DOM.div(null, 'Tel: +7 (926) 336 8322'),
						React.DOM.div(null, 'Москва, Просп. Андропова, 18к3')
					)
			)
	}
});
JFooter = React.createFactory(JFooter);

