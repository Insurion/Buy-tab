/**
 * jQuery Mobile React Example
 * 
 * Main application script. For variety, this example is written in 100%
 * JSHint-compliant JavaScript, not in JSX.
 * 
 * Component structure:
 *  - App |-- JQueryMobilePage (one) | |-- JQueryMobileHeader | |--
 * JQueryMobileContent | | |-- PageOneContent | | |-- JButton | |--
 * JQueryMobileFooter |-- JQueryMobilePage (two) | |-- JQueryMobileHeader | |--
 * JQueryMobileContent | | |-- PageTwoContent | | |-- JButton | |--
 * JQueryMobileFooter |-- JQueryMobilePage (popup) |-- JQueryMobileHeader |--
 * JQueryMobileContent | |-- PagePopUpContent | |-- JButton |--
 * JQueryMobileFooter
 */

/* global document, React */

'use strict';

/** Main application component. */
var App = React.createClass({
	displayName : 'App',

	render : function() {
			return PageOneContent();
	}
});
App = React.createFactory(App);

/** jQuery Mobile page content component. */
var JQueryMobileContent = React.createClass({
	displayName : 'JQueryMobileContent',

	render : function() {
		return React.DOM.div({
			role : 'main',
			className : 'ui-content'
		}, this.props.children);
	}
});
JQueryMobileContent = React.createFactory(JQueryMobileContent);

/** jQuery Mobile page component. */
var JQueryMobilePage = React.createClass({
	displayName : 'JQueryMobilePage',

	getDefaultProps : function() {
		return {
			'data-role' : 'page',
			'data-theme' : 'a',
			headerTheme : 'a'
		};
	},

	render : function() {
		var props = {};
		for ( var key in this.props) {
			props[key] = this.props[key];
		}
		return React.DOM.div(props, JQueryMobileHeader({
			title : '' + this.props.id,
			headerTheme : this.props.headerTheme
		}), JQueryMobileContent(null, this.props.children)
		/* JQueryMobileFooter(null) */
		);
	}
});
JQueryMobilePage = React.createFactory(JQueryMobilePage);

var JHeader = React.createClass({
	displayName : 'JHeader',

	render : function() {
		var style = {};
		var style2 = {};
		if(this.props.page == 'login'){
			style = {paddingLeft:'50%', paddingTop:'5pt', marginLeft:'-50pt'};
			style2 = {paddingLeft:'50%', paddingTop:'5pt', marginLeft:'-50pt'};
		} else {
			style = {paddingLeft:'5pt', paddingTop:'5pt', display:'inline-block'};
			style2 = {paddingLeft:'5pt', paddingTop:'2pt', display:'inline-block'/*, float:'right'*/};
		}
		return React.DOM.div({className:'ui-bar-inherit'}, 
				React.DOM.div({style:style}, React.DOM.a( {href:'http://www.insurion.org'},
						React.DOM.img({height:'32pt', src: './ins-logo64.png'}))
				),
				React.DOM.div({style:style2}, 
						React.DOM.span({style:{color:'#3899EC', fontSize:'8pt', fontFamily: 'PFDinTextProLight' }}, 'Служба поддержки +7 (926) 336 8322')
				)
			)
	}
});
JHeader = React.createFactory(JHeader);

/** Application page one component. */
var PageOneContent = React.createClass({
	displayName : 'PageOneContent',
	
	getInitialState: function() {
	    return { page: 'login' };
	  },

	forceReload : function(newState) {
		this.refs.doclist.forceReload();
	},

	onLoginSuccess : function(data) {
		this.onRoute('a');
	},
	
	onLogoutSuccess : function(data) {
		this.onRoute('login');
	},
	
	onRoute : function(a) {
		this.setState({page: a});
		Store.set('route', a);
	},

	componentWillMount : function() {
		//this.route('login');
		appRoute = this.onRoute;
		var r = Store.get('route');
		//alert('route=' + r);
		if(r){
			this.onRoute(r);
		}
	},

	render : function() {
		var r = (React.DOM.div(null, React.DOM.span(null, 'no route')));
		var head = JHeader({title : 'Insurion', page:this.state.page});
		
		var s = isMobile.any()?'-mob':'';
		r = (React.DOM.div(null, React.DOM.div({className : 'div-center' + s}, 
				JLoginBuy({}))));
		return React.DOM.div(null, 
				//JHeader({title : 'Insurion', page:this.state.page}), 
				JQueryMobileContent(null, r),
				JFooter()
			);
	}
});
PageOneContent = React.createFactory(PageOneContent);

// Render application.
ReactDOM.render(App(null), document.getElementById('content'));
