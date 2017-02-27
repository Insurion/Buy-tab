'use strict';

var JFolder = React.createClass({
	displayName : 'JFolder',

	getDefaultProps : function() {
		return {
			className : 'jqm-folder',
			src: "folder2.png",
			eventSource : 'JFolder'
		};
	},

	handleClick : function(ev) {
		consoleLog('folder.handleClick:' + this.props.code);
		if(this.cbClick != undefined){
			this.cbClick(this.props.code);
		}
		// alert('JFolder.click');
		//this.setState({selected: !this.state.selected});
		//this.forceUpdate();
	},

	componentWillMount : function() {
		this.cbClick = this.props.cbClick;
		this.setState({selected: false});
	},

	componentDidMount : function() {

	},

	render : function() {
		var vClick = this.handleClick;
		var className = 'table-row';
		className = (currentFolder == this.props.code)?className + ' row-selected':className;
		var data = {'data-src': this.props.eventSource, 'data-code': this.props.code};
		return (React.DOM.table(null, React.DOM.tbody(null, React.DOM.tr({className: className, onClick: vClick.bind(null, this.props.code)}, 
				React.DOM.td(data, React.DOM.img( {src: this.props.src, alt: this.props.name, 'data-src': this.props.eventSource, 'data-code': this.props.code})),
				React.DOM.td(data, React.DOM.div({className: "table-list-folder-name", 'data-src': this.props.eventSource, 'data-code': this.props.code}, React.DOM.span(data, this.props.name)))
		))));
		/*return (
				React.DOM.div(data, React.DOM.img( {src: this.props.src, alt: this.props.name, 'data-src': this.props.eventSource, 'data-code': this.props.code}))),
				React.DOM.div(data, React.DOM.p(null, React.DOM.span(data, this.props.name))
		);*/
	}
});
JFolder = React.createFactory(JFolder);
