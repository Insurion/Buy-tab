'use strict';

var JBalance = React.createClass({
	displayName : 'JBalance',

	getDefaultProps : function() {
		return {
			className : 'balance',
			lg:Store.get('login')
		};
	},

	getInitialState : function() {
		var data = {s: [0, 0, 0, 0, 0, 0, 0, 0]};
		return {
			balance : '', 
			data: data 
		};
	},
	
	loadData : function() {
		var props = this.props;
		var self = this;
		Rest.ajax2({method: "usrsaldo", user: this.props.lg}, function(data) {
			self.setState({data: data});
			if(self.props.balanceUpdated){
				self.props.balanceUpdated(data.s[1]);
			}
		});
	},

	componentWillMount : function() {
		this.loadData();
	},

	componentDidMount : function() {
		
	},

	componentWillUnmount : function() {
	},

	render : function() {
		return (React.DOM.div(null, 
				JInputText({name:'Внесено', tooltip:'Поле "Внесено" показывает сумму внесенных Вами денежных средств', readonly:true, defaultValue:num2(this.state.data.s[0]) + ' руб.', format:'num', underline:true}),
				JInputText({name:'Доход', tooltip:'Поле "Доход" показывает сумму заработанных денег, полученную в результате покрытия рисков', readonly:true, defaultValue:num2(this.state.data.s[3]) + ' руб.', format:'num', underline:true}),
				JInputText({name:'Инвестированно', tooltip:'Поле "Инвестировано" показывает сколько денег в данный момент участвуют в покрытии рисков. Эти деньги будут постепенно освобождаться для дальнейшего распределения по мере завершения рисков', readonly:true, defaultValue:num2(this.state.data.s[2]) + ' руб.', format:'num', underline:true}),
				JInputText({name:'Резерв на вывод', tooltip:'Поле "Резерв на вывод" показывает сумму денег, которую Вы распорядились перевести на Ваш банковский счет, но которая еще не была переведена', readonly:true, defaultValue:'-' + num2(this.state.data.s[4]) + ' руб.', format:'num', underline:true}),
				JInputText({name:'Выведено', tooltip:'Поле "Выведено" показывает сумму денег, которую Insurion фактически перевел на Ваш банковский счет по Вашему распоряжению', readonly:true, defaultValue:num2(this.state.data.s[5]) + ' руб.', format:'num', underline:true}),
				JInputText({name:'Доступно', tooltip:'Поле "Доступно" показывает сумму денег, доступную для инвестирования в покрытие рисков или для вывода на Ваш банковский счет', readonly:true, defaultValue:num2(this.state.data.s[1]) + ' руб.', format:'num', underline:true}),
				JInputText({name:'Доходность', tooltip:'Поле "Доходность" показывает отношение строки Доход к строке Внесено или сколько вы заработали в процентах', readonly:true, defaultValue:num2(this.state.data.s[6]) + ' %', format:'num', underline:true}),
				JInputText({name:'Ожидаемый Доход', tooltip:'Поле "Ожидаемый Доход" показывает сумму ожидаемых доходов по рискам со статусом "Покрывается" из вкладки "Мои риски"', readonly:true, defaultValue:num2(this.state.data.s[7]) + ' руб.', format:'num', underline:true})
			))
	}
});
JBalance = React.createFactory(JBalance);
