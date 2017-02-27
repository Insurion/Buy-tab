'use strict';

var JButton = React.createClass({
	displayName : 'JButton',

	getDefaultProps : function() {
		//return {className: 'ui-btn ui-shadow ui-corner-all ui-btn-inline', caption:'+', code: undefined};
		return {className: 'ui-btn ui-shadow ui-btn-inline', caption:'+', code: undefined};
	},

	getInitialState : function() {
		return {};
	},

	render : function() {
		return (
				React.DOM.div({style:this.props.style, className : this.props.className, onClick : this.props.onClick, 'data-code': this.props.code}, this.props.caption)
				)
	}
});
JButton = React.createFactory(JButton);

var JHref = React.createClass({
	displayName : 'JHref',

	getDefaultProps : function() {
		return {className: '', caption:'+', code: undefined};
	},

	getInitialState : function() {
		return {};
	},

	render : function() {
		return (
				React.DOM.div({style:this.props.style}, React.DOM.a({className : this.props.className, href: '#', onClick : this.props.onClick, 'data-code': this.props.code}, this.props.caption))
				)
	}
});
JHref = React.createFactory(JHref);

var JPictButton = React.createClass({
	displayName : 'JPictButton',

	getDefaultProps : function() {
		return {className: 'ui-btn ui-shadow ui-corner-all ui-btn-inline', src:undefined, type:'home', hover:undefined, code: undefined};
	},

	getInitialState : function() {
		return {};
	},
	
	componentWillMount: function() {		
		var src = this.props.src;
		if(!src){
			src = './home.png';
			if(this.props.type == 'delete'){
				src = './delete.png';
			} else if(this.props.type == 'add'){
				src = './add.png';
			}
		}
        this.setState({src: src});
    },

	render : function() {
		var img = null;
		//if(this.props.hover){
			img = React.DOM.img({src: this.state.src, onClick : this.props.onClick, 'data-code': this.props.code});
		//}
		return (
				//React.DOM.div({style:this.props.style, 'data-code': this.props.code}, img)
				React.DOM.div({style:this.props.style}, React.DOM.a({className : this.props.className, onClick : this.props.onClick, 'data-code': this.props.code}, img))
		)
	}
});
JPictButton = React.createFactory(JPictButton);

var JControlLoading = React.createClass({
	displayName : 'JControlLoading',

	getDefaultProps : function() {
		return {width:'32pt', src: 'loading.gif', loading: false, error:undefined};
	},

	getInitialState : function() {
		return {};
	},

	render : function() {
		if(this.props.loading){
			return (React.DOM.p(null, React.DOM.img({src: this.props.src, style:{width: this.props.width}})))
		} else if(this.props.loading){
			return (React.DOM.p(null, React.DOM.span(this.props.error)));
		} else {
			return null
		}
	}
});
JControlLoading = React.createFactory(JControlLoading);

var JInputText = React.createClass({
	displayName : 'JInputText',

	getDefaultProps : function() {
		return {name:'Поле ввода', width:'150pt', readonly:false, type:'text', bold:false, placeholder: undefined, format:'str', underline:false, tooltip:undefined, color:undefined};
	},

	getInitialState : function() {
		return {value:undefined, tid: Math.random()};
	},
	
	componentWillMount: function() {
        this.setState({
           value: this.props.defaultValue
        });
    },
	
	componentDidMount: function() {
		if(this.props.tooltip){
			var el = document.getElementById(this.state.tid);
			if(el){
				el.setAttribute('tooltip', this.props.tooltip);
			}
		}
	},
	
	value : function() {
		return this.state.value;
	},
	
	onChange : function(ev) {
		this.setState({value:ev.target.value});
		if(this.props.onChange){
			this.props.onChange(ev);
		}
	},
	
	onKeyPress : function(ev) {
		if(this.props.onKeyPress){
			this.props.onKeyPress(ev);
		}
	},

	render : function() {
		var st = null;
		if(this.props.tooltip){
			//st = React.DOM.div({id: this.state.tid, style:{display:'inline-block'}}, React.DOM.span(null, '?'));
			st = React.DOM.div({id: this.state.tid, style:{display:'inline-block'}}, React.DOM.img({src: 'q2.png'}));
			//st = {id: this.state.tid, style:{display:'inline-block', width:this.props.width}};
		} else {;
			st = null
			//st = {style:{display:'inline-block', width:this.props.width}};
		}
		if(this.props.readonly){
			return (
				React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, 
						React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span({style:{fontWeight:(this.props.bold)?'bold':'normal'}}, this.props.name), st, React.DOM.span(null, ': ')), 
						React.DOM.div({style:{display:'inline-block', float:(this.props.format=='num')?'right':''}}, React.DOM.span((this.props.color)?{style:{color:this.props.color}}:null, this.props.defaultValue)),
						(this.props.underline)?React.DOM.div({className:'input-underline'}):null
				))
		} else {
			return (
					React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, 
							React.DOM.div({style:{display:'inline-block', width:this.props.width}}, 
									React.DOM.span({style:{fontWeight:(this.props.bold)?'bold':'normal'}}, (this.props.name + ': '))
							), 
							React.DOM.div({style:{display:'inline-block', float:(this.props.format=='num')?'right':''}}, 
									React.DOM.input({maxLength:(this.props.maxlength)?this.props.maxlength:'', type:this.props.type, placeholder: this.props.placeholder, id:this.props.id, defaultValue:this.props.defaultValue, onChange:this.onChange, onKeyPress: this.onKeyPress}))
							)
					)
		}
	}
});
JInputText = React.createFactory(JInputText);

var JLoginInput = React.createClass({
	displayName : 'JLoginInput',

	getDefaultProps : function() {
		return {name:undefined, width:'150pt', textwidth:undefined, readonly:false, type:'text', bold:false, placeholder: undefined, format:'str', underline:false, tooltip:undefined, color:undefined};
	},

	getInitialState : function() {
		return {value:undefined, tid: Math.random()};
	},
	
	componentWillMount: function() {
        this.setState({
           value: this.props.defaultValue
        });
    },
	
	componentDidMount: function() {
		if(this.props.tooltip){
			var el = document.getElementById(this.state.tid);
			if(el){
				el.setAttribute('tooltip', this.props.tooltip);
			}
		}
	},
	
	value : function() {
		return this.state.value;
	},
	
	onChange : function(ev) {
		this.setState({value:ev.target.value});
		if(this.props.onChange){
			this.props.onChange(ev);
		}
	},
	
	onKeyPress : function(ev) {
		if(this.props.onKeyPress){
			this.props.onKeyPress(ev);
		}
	},

	render : function() {
		var st = null;
		if(this.props.tooltip){
			//st = React.DOM.div({id: this.state.tid, style:{display:'inline-block'}}, React.DOM.span(null, '?'));
			st = React.DOM.div({id: this.state.tid, style:{display:'inline-block'}}, React.DOM.img({src: 'q2.png'}));
			//st = {id: this.state.tid, style:{display:'inline-block', width:this.props.width}};
		} else {;
			st = null
			//st = {style:{display:'inline-block', width:this.props.width}};
		}
		if(this.props.readonly){
			return (
				React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, 
						React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span({style:{fontWeight:(this.props.bold)?'bold':'normal'}}, this.props.name), st, React.DOM.span(null, ': ')), 
						React.DOM.div({style:{display:'inline-block', float:(this.props.format=='num')?'right':''}}, React.DOM.span((this.props.color)?{style:{color:this.props.color}}:null, this.props.defaultValue)),
						(this.props.underline)?React.DOM.div({className:'input-underline'}):st
				))
		} else {
			return (
					React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, 
							(this.props.name)?React.DOM.div({style:{display:'inline-block', width:this.props.width}}, 
									React.DOM.span({style:{fontWeight:(this.props.bold)?'bold':'normal'}}, (this.props.name + ': '))
							):null, 
							React.DOM.div({style:{display:'inline-block', width:'100%', float:(this.props.format=='num')?'right':''}}, 
									React.DOM.input({className:'ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset', style:{padding:'5pt 0pt', width:'100%'}, maxlength:(this.props.maxlength)?this.props.maxlength:'', type:this.props.type, placeholder: this.props.placeholder, id:this.props.id, defaultValue:this.props.defaultValue, onChange:this.onChange, onKeyPress: this.onKeyPress}))
							)
					)
		}
	}
});
JLoginInput = React.createFactory(JLoginInput);

var JMaskedDate = React.createClass({
	displayName : 'JMaskedDate',

	getDefaultProps : function() {
		return {name:'Поле ввода', width:'150pt', readonly:false, type:'text', id:'dt', onChange:undefined, underline:undefined};
	},

	getInitialState : function() {
		return {value:undefined};
	},
	
	componentWillMount: function() {
        this.setState({
           value: this.props.defaultValue
        });
    },
	
	value : function() {
		var a = $('#' + this.props.id)[0];
		return (a)?a.value:undefined;
	},
	
	componentDidMount: function() {
		$('#' + this.props.id).mask("99.99.9999", {placeholder:"dd.mm.yyyy"});
    },    
    
    componentDidUpdate: function() {
		$('#' + this.props.id).mask("99.99.9999", {placeholder:"dd.mm.yyyy"});
    },    
    
    componentWillUnmount: function() {
    	var v = this.value();
    	this.setState({value: this.value()});
    },    

    onChange: function(ev) {
    	if(this.props.onChange){
    		this.props.onChange(ev);
    	}
    },  	
    
    render : function() {
		if(this.props.readonly){
			return (
				React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span(null, (this.props.name + ': '))), 
						React.DOM.div({style:{display:'inline-block'}}, React.DOM.span(null, this.props.defaultValue)),
						(this.props.underline)?React.DOM.div({className:'input-underline'}):null
					)
				)
		} else {
			return (
					React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span(null, (this.props.name + ': '))), 
							React.DOM.div({style:{display:'inline-block'}}, 								
								React.DOM.input({id: this.props.id, maxLength:'10', placeholder: 'dd.mm.yyyy', defaultValue:this.props.defaultValue, onChange:this.onChange })))
					)
		}
	}
});
JMaskedDate = React.createFactory(JMaskedDate);

var JMaskedInput = React.createClass({
	displayName : 'JMaskedInput',

	getDefaultProps : function() {
		return {name:'Поле ввода', width:'150pt', readonly:false, type:'text', id:'dt', onChange:undefined, underline:undefined};
	},

	getInitialState : function() {
		return {value:undefined};
	},
	
	componentWillMount: function() {
        this.setState({
           value: this.props.defaultValue
        });
    },
	
	value : function() {
		var a = $('#' + this.props.id)[0];
		return (a)?a.value:undefined;
	},
	
	componentDidMount: function() {
		$('#' + this.props.id).mask(this.props.mask, {placeholder:this.props.placeholder});
    },    
    
    componentDidUpdate: function() {
		$('#' + this.props.id).mask(this.props.mask, {placeholder:this.props.placeholder});
    },    
    
    componentWillUnmount: function() {
    	var v = this.value();
    	this.setState({value: this.value()});
    },    

    onChange: function(ev) {
    	if(this.props.onChange){
    		this.props.onChange(ev);
    	}
    },  	
    
    render : function() {
		if(this.props.readonly){
			return (
				React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span(null, (this.props.name + ': '))), 
						React.DOM.div({style:{display:'inline-block'}}, React.DOM.span(null, this.props.defaultValue)),
						(this.props.underline)?React.DOM.div({className:'input-underline'}):null
					)
				)
		} else {
			return (
					React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span(null, (this.props.name + ': '))), 
							React.DOM.div({style:{display:'inline-block'}}, 								
								React.DOM.input({id: this.props.id, maxLength:'11', placeholder: this.props.placeholder, defaultValue:this.props.defaultValue, onChange:this.onChange })))
					)
		}
	}
});
JMaskedInput = React.createFactory(JMaskedInput);

var JSelect = React.createClass({
	displayName : 'JSelect',

	getDefaultProps : function() {
		return {name:'Выбор из списка', width:'150pt', data:[], firstEmpty:false, readonly:false, onChange:undefined};
	},

	getInitialState : function() {
		return {value:undefined};
	},
	
	componentWillMount: function() {
        this.setState({
           value: this.props.defaultValue
        });
    },
	
	value : function() {
		return this.state.value;
	},
	
	onChange : function(ev) {
		this.setState({value:ev.target.value});
		if(this.props.onChange){
			this.props.onChange(ev.target.value);
		}
	},

	render : function() {
		if(this.props.readonly){
			var v = '';
			var self = this;
			this.props.data.map(function(row, i) {
				if(row.key == self.props.defaultValue){v = row.value;}
			})
			return (
				React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, React.DOM.div({style:{display:'inline-block', width:this.props.width}}, React.DOM.span(null, (this.props.name + ': '))), 
						React.DOM.div({style:{display:'inline-block'}}, React.DOM.span(null, v)))
				)
		} else {
			return (
				React.DOM.div({style:{display:'block', padding:'.1em .1em'}}, 
						React.DOM.div({style:{display:'block', width:this.props.width}}, React.DOM.span(null, (this.props.name + ': '))),
						React.DOM.div({style:{display:'block'}}, 
								React.DOM.select({defaultValue:this.props.defaultValue, onChange:this.onChange}, 
										(this.props.firstEmpty)?React.DOM.option({key: 0, value: ''}, '-'):null,
										this.props.data.map(function(row, i) {
											return (React.DOM.option({key:i, value: row.key}, row.value));
										}))
								)
						)
				)
		}
	}
});
JSelect = React.createFactory(JSelect);

var JModalContainer = React.createClass({
	displayName : 'JModalContainer',

	getDefaultProps : function() {
		return {};
	},

	getInitialState : function() {
		return {};
	},
	
	render : function() {
		return (
				React.DOM.div({className: 'div-edit'}, 
						React.DOM.div({className: 'div-edit-relative'}, 
								React.DOM.div({className: 'div-edit-back'}, 
										this.props.children)))
				)
	},
	
	render1 : function() {
		return (
				React.DOM.div({className: 'div-edit', 'data-role':'page'}, 
						React.DOM.div({className: 'div-edit-relative', 'data-role':'content'}, 
								React.DOM.a({href:"#dialog1", id:"some-dialog", 'data-rel':"dialog", 'data-role':"button"}, 'Open Dialog'),
								React.DOM.div({id:'dialog11', className: 'app-dialog', 'data-role':'dialog'}, 
										this.props.children)))
				)
	}
});
JModalContainer = React.createFactory(JModalContainer);

var JTitleDiv = React.createClass({
	displayName : 'JTitleDiv',

	getDefaultProps : function() {
		var m = isMobile.any();
		return {display:'inline-block', title:'Заголовок', tooltip:undefined};
	},

	render : function() {
		return (
				React.DOM.div({style:{display:this.props.display, width:this.props.width, verticalAlign:'top'}}, 
						JInputText({name:this.props.title, readonly:true, width:'100%', bold:true, tooltip:this.props.tooltip}), 
						React.DOM.div({className:'title-div'}, this.props.children))
				)
	}
});
JTitleDiv = React.createFactory(JTitleDiv);

var JTabs = React.createClass({
	displayName : 'JTabs',

	getDefaultProps : function() {
		return {tab:'', classbody:'ui-tabs', classitem:'ui-tab', tabs:[{tab:'tab1', name: 'Таб1', onClick:undefined, style:undefined}], panel:undefined};
	},

	getInitialState : function() {
		return {};
	},
	
	onClick : function(ev) {
		if(this.props.onClick){
			this.props.onClick(ev.target.dataset.key);
		}
	},
	
	render : function() {
		var self = this; 
		return (
					React.DOM.div({className:self.props.classbody}, 
						this.props.tabs.map( function(v) { 
								return React.DOM.a({style:v.style, key: v.tab, 'data-key':v.tab, className:self.props.classitem+((self.props.tab==v.tab)?'-selected':''), onClick:(v.onClick)?v.onClick:self.onClick}, v.name)
							} 
						)
					)
					//,(this.props.panel)?React.DOM.div(null, this.props.panel):null
				)
	}
});
JTabs = React.createFactory(JTabs);

var JTable = React.createClass({
	displayName : 'JTable',

	getDefaultProps : function() {
		return {
			readonly:false, cols: [], f:[], rows:{}, rowClicked: undefined, addClicked: undefined, childUpdated: undefined, delmethod: undefined, rowRender: undefined,
			btn1:false, btn2:false,
			pagesize: 5
		};
	},
	
	getInitialState : function() {
		return {page: 1};
	},
	
	childUpdated : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	rowClicked : function(row) {
		if(row && this.state.rowId == row.id){
			this.setState({rowId:'0'});
		} else {
			this.setState({rowId:row.id});
		}
		this.setState({row: row});
		if(this.props.rowClicked){
			this.props.rowClicked(row);
		}
	},
	
	addClicked : function() {
		if(this.props.addClicked){
			this.props.addClicked();
		}
	},
	
	pageUp : function() {
		var p = this.state.page + 1;
		var sz = Math.ceil(this.props.rows.length/this.props.pagesize, 1);
		if(p > sz){
			p = this.state.page;
		}
		this.setState({page:p, key: Math.random()});
	},
	
	pageDown : function() {
		var p = this.state.page - 1;
		if(p < 1){
			p = 1;
		}
		this.setState({page:p, key: Math.random()});
	},
	
	render : function() {
		var self = this;
		if(!this.props.rows){
			return null;
		}
		var min = this.state.page*this.props.pagesize - this.props.pagesize + 1;
		var max = this.state.page*this.props.pagesize;
		var sz = Math.ceil(this.props.rows.length/this.props.pagesize, 1);
		var btns = null;
		if(sz > 1){
			btns = React.DOM.div({style:{marginLeft: '100pt', width:'150pt'}}, 
					(this.state.page <= 1)?null:JPictButton({style:{display:'inline-block'}, src: './arrow-left.png', type:'add', onClick : self.pageDown}), 
					React.DOM.span(null, this.state.page + ' из ' + sz), 
					(this.state.page >= sz)?null:JPictButton({style:{display:'inline-block', marginLeft: '5pt'}, src: './arrow-right.png', type:'delete', onClick : self.pageUp})
			)
		}
		var row = this.state.row; 
		return (
				React.DOM.div(null, 
					(this.addClicked && !this.props.readonly)?JPictButton({type:'add', onClick : this.addClicked}):null,
					React.DOM.table({className : "table-deallist", key:this.state.key},
						JTableHead({cols: this.props.cols, readonly:this.props.readonly, btn1:!this.props.readonly, btn2:this.props.btn2}),
						React.DOM.tbody(null, this.props.rows.map(function(row, i) {
							var c = i + 1;
							if(c >= min && c <= max){
								if(self.props.rowRender){
									return self.props.rowRender(row, i);
								}
				return (JTableRow({f:self.props.f, key:i, num: i, row : row, currentId:self.state.rowId, delmethod: self.props.delmethod, readonly:self.props.readonly, rowClicked: self.rowClicked, childUpdated:self.childUpdated}));
							}
						}))),
						btns
					)
					
				);
	}
});
JTable = React.createFactory(JTable);

var JTableRow = React.createClass({
	displayName : 'JTableRow',

	getDefaultProps : function() {
		return {
			readonly:false, delmethod: undefined,
			f:[]
		};
	},
	
	getInitialState : function() {
		return {};
	},

	handleClick : function(ev) {
		if(ev.target.dataset.code == 'btn-dlt'){
			this.deleteRow();
		} else {
			this.props.rowClicked(this.props.row);
		}
	},
	
	deleteRow : function() {
		if(!this.props.delmethod || !confirm('Удалить строку?')){
			return;
		}
		consoleLog('delete row...' + this.props.delmethod + '.id=' + this.props.row.id);
		var self = this;
		self.setState({loading:true});
		Rest.ajax2({method: this.props.delmethod, id:this.props.row.id}, function(data) {
			self.setState({loading:false});
			if(self.props.childUpdated){
				self.props.childUpdated();
			}
		}, function(data) {
			self.setState({loading:false});
		});
	},
	
	render : function() {
		var className = 'table-row';
		className = (this.props.currentId == this.props.row.id)?className + ' row-selected':className;
		if (this.props.num % 2 == 0){
			className = className + ' row-even';
		}
		var self = this;
		return ( 
			React.DOM.tr({className:className, onClick: this.handleClick}, (this.props.readonly)?React.DOM.td({id: "num"}):React.DOM.td({id: "num"}, JPictButton({style:{display:'inline-block'}, type:'delete', code: 'btn-dlt'})),			
					this.props.f.map(function(f, i) {
						var names = f.name.split('.');
						var v = self.props.row;
						names.forEach(function(n) {
							v = (v)?v[n]:'';
						});
						return (React.DOM.td({key:i, id: f.id}, React.DOM.p(null, React.DOM.span(null, (f.id=='sum')?num2(v):v))))
					}
					
		)));
	}
});
JTableRow = React.createFactory(JTableRow);

var JTableHead = React.createClass({
	displayName : 'JTableHead',

	getDefaultProps : function() {return {cols:[], readonly:false, btn1:false, btn2:false};},
	
	getInitialState : function() {return {};},
	
	render : function() {
		var self = this;
		return (
			//React.DOM.thead(null,React.DOM.tr(null, (this.props.btn1)?React.DOM.th(null, ''):null, (this.props.btn2)?React.DOM.th(null, ''):null, this.props.cols.map(function (col, i) {return React.DOM.th({key: i}, col.name);})))
			React.DOM.thead(null,React.DOM.tr(null, React.DOM.th({key: -1}), this.props.cols.map(function (col, i) {return React.DOM.th({key: i}, col.name);})))
		);
	}
});
JTableHead = React.createFactory(JTableHead);


var JLoadHtml = React.createClass({
	getDefaultProps : function() {
		return {html:'#'};
	},

	getInitialState : function() {
		return {};
	},
	
	doCancel : function() {
		if(this.props.childUpdated){
			this.props.childUpdated();
		}
	},
	
	componentDidMount: function() {
		$('#txt').load(this.props.html);
	},
	
	render : function() {
		return (
				JModalContainer({key: this.state.key}, 
					React.DOM.div({id:'txt', style:{overflowY:'scroll'}}, ''),
					JButton({caption: 'Закрыть', onClick: this.doCancel})
		))
	}
});
JLoadHtml = React.createFactory(JLoadHtml);