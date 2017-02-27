'use strict';

var JBtnCovering = React.createClass({
	displayName : 'JBtnCovering',

	getDefaultProps : function() {
		return {balance : '', userstatus : '', lg:Store.get('login')};
	},
	
	getInitialState : function() {
		return {loading: false, route: 'main'};
	},
	
	startCovering : function() {
		var props = this.props;
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'valusr', user: this.props.lg}, 
			function(data) {
				self.setState({loading:false});
				var s = '';
				for (var i = 0; i < data.length; i++) {
					s = s + '- ' + data[i] + ';\r\n';
				}
				if(s.length > 0){
					alert('Пожалуйста, заполните поля на закладке Профиль: \r\n' + s + '');
					return;
				}
				self.setState({route:'c'});
				if(props.childUpdated){
					props.childUpdated();
				}
		});
	},
	
	stopCovering : function() {
		if(!confirm('Остановить покрытие рисков?')){
			return;
		}		var props = this.props;
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: 'covering', user: Store.get('login'), st: '0'}, 
			function(data) {
				self.setState({loading:false});
				if(props.childUpdated){
					props.childUpdated();
				}
		});
	},
	
	clickWithdraw : function(ev) {
		this.setState({route:'w'});
	},
	
	childUpdated : function() {
		var key = Math.random();
		this.setState({ route: 'main' });
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},

	render : function() {
		if (this.state.loading) {
			return JControlLoading({loading:this.state.loading});
		}
		
		var w = (this.state.route == 'w')?this.renderWithdraw():null;
		var c = (this.state.route == 'c')?this.renderConfirm():null;
		
		var saldo = parseInt(this.props.balance, 0);
		var btnName = '';
		var r = null;
		if(this.props.userstatus == 'REG' /*&& saldo > 0*/){
			r = JButton({style: {width:'100%', whiteSpace: 'initial', borderColor:'#FF0000'}, caption: 'НАЧАТЬ ПОКРЫТИЕ', onClick: this.startCovering});
		} else if(this.props.userstatus == 'INVEST'){
			r = JButton({style: {width:'100%', whiteSpace: 'initial'}, caption: 'ОСТАНОВИТЬ ПОКРЫТИЕ', onClick: this.stopCovering});
		} else {
			
		}
		var r2 = null;
		r2 = JButton({style: {width:'100%', whiteSpace: 'initial'}, caption: 'ВЫВЕСТИ СРЕДСТВА', onClick: this.clickWithdraw});
		return (
				React.DOM.div({style:{width: '150pt'}}, w, c, r, r2)
		);
	},
	
	renderWithdraw : function() {
		return (
				JModalContainer(null,
						JWithdraw({childUpdated: this.childUpdated})
				)
		);
	},
	
	renderConfirm : function() {
		return (
				JModalContainer(null,
						JCoveringConfirm({childUpdated: this.childUpdated})
				)
		);
	}
});
JBtnCovering = React.createFactory(JBtnCovering);

var JCoveringConfirm = React.createClass({
	displayName : 'JCoveringConfirm',

	getDefaultProps : function() {
		return {txt: 'Текст соглашения'};
	},

	getInitialState : function() {
		return {};
	},
	
	loadData : function() {
		/*var props = this.props;
		var self = this;
		Rest.ajax2({method: "usrsaldo", user: this.props.lg}, function(data) {
			self.setState({key: Math.random(), sum: data.s[4]});
		});*/
	},
	
	doSave : function() {
		var chk = this.refs.chk;
		if(!chk.checked){
			alert('Для продолжения Вы должны подтвердить согласие с Пользовательским соглашением');
			return;
		}
		
		var props = this.props;
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: "covering", user: Store.get('login'), st: "1"}, 
			function(data) {
				self.setState({loading:false});
				if(props.childUpdated){
					props.childUpdated();
				}
			},
			function(data) {
				self.setState({loading:false});
			}
		);
	},
	
	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	componentWillMount : function() {
		this.loadData();
	},
	
	componentDidMount: function() {
		$("#txt").load("aggr.html");
		this.doresize();
		window.onresize = this.onresize;
	},
	
	onresize : function() {
		this.doresize();
	},
	
	doresize : function() {
		var bh = $("#btm").height();
		var h = (window.innerHeight - bh*2)*3/4;
		$("#txt").height(h + 'pt');
	},

	render : function() {
		var h = window.innerHeight - 200;
		return (
				JModalContainer({key: this.state.key}, 
					React.DOM.div(null,
							React.DOM.span({style:{fontWeight: 'bold'}}, 'ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ:')
					), 						
					React.DOM.div({id:'txt', style:{overflowY:'scroll'}}, ''),
					React.DOM.div({id:'btm'},
							React.DOM.span({style:{fontWeight: 'bold'}}, React.DOM.input({ref:'chk', type:'checkbox',}), 'Я согласен(на) с условиями Пользовательского соглашения'),
							JBtnSaveCancel({loading: this.state.loading, captionSave:'Начать', captionCancel:'Отказаться', onSave:this.doSave, onCancel:this.doCancel})
					)
		))
	}
});
JCoveringConfirm = React.createFactory(JCoveringConfirm);
