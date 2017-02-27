'use strict';

var JShortHelp = React.createClass({
	displayName : 'JShortHelp',

	getDefaultProps : function() {
		return {tooltip: 'test tooltip'};
	},
	
	getInitialState : function() {
		return {tid: Math.random(), 
			popupText:['Заполните все поля во вкладке "Профиль". \n\nПаспортные данные нужны для оформления электронного договора между вами и лицами, чьи риски вы будете покрывать', 
		               'Необходимо внести на счет минимум 500 рублей. Именно такая сумма распределяется для покрытия одного риска', 
		               'Вы можете вручную выбирать риски, которые желаете покрыть, выбрав их на вкладке "Риски к покрытию". \n\nТак же вы можете включить функцию автоматического покрытия, нажав на кнопку "НАЧАТЬ ПОКРЫТИЕ". Система сама распределит ваши средства для покрытия рисков по 500 руб на 1 риск'
		               ]
		}
	},
	
	spanClick: function() {
		var m = document.getElementById('m' + this.state.tid);
		if(m){
			m.style.display = 'none';
		}
	},
	
	popupClick: function() {
		var m = document.getElementById('m' + this.state.tid);
		if(m){
			m.style.display = 'block';
		}
	},
	
	btnClick1: function() {
		this.btnClickA(1);
	},
	
	btnClick2: function() {
		this.btnClickA(2);
	},
	
	btnClick3: function() {
		this.btnClickA(3);
	},
	
	btnClickA: function(idx) {
		this.popupClick();
		var p = document.getElementById('p' + this.state.tid);
		if(p){
			p.innerText = this.state.popupText[idx-1];
		}
	},
	
	render : function() {
		var popup = React.DOM.div({id:'m' + this.state.tid, className:'modal', onClick:this.spanClick},
				React.DOM.div({className:'modal-content', onClick:this.spanClick},
						React.DOM.p({id:'p' + this.state.tid}, '111')
					)
			);
		
		var b1 = JButton({style: {display: 'inline-block', width:'120pt', whiteSpace:'normal', textAlign:'left', fontFamily: 'PFDinTextProLight'}, caption: '1. Заполните данные о себе', onClick:this.btnClick1});
		var b2 = JButton({style: {display: 'inline-block', width:'100pt', whiteSpace:'normal', textAlign:'left', fontFamily: 'PFDinTextProLight'}, caption: '2. Внести на счет от 500 руб', onClick:this.btnClick2});
		var b3 = JButton({style: {display: 'inline-block', width:'150pt', whiteSpace:'normal', textAlign:'left', fontFamily: 'PFDinTextProLight'}, caption: '3. Начните покрытие автоматически или вручную', onClick:this.btnClick3});
		return (
				React.DOM.div({style: {paddingBottom:'8pt', marginBottom:'12pt', borderBottom:'2pt solid #3899EC'}}, React.DOM.div({style: {display: 'block', fontSize:'12pt', padding:'8pt 0pt'}}, React.DOM.span(null, 'Как начать покрывать риски?')),
						React.DOM.div({style: {display: 'block'}}, 
							popup,
							b1,
							b2,
							b3
						)
				)
		);
	}
});
JShortHelp = React.createFactory(JShortHelp);
