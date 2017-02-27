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

	/*render : function() {
		return React.DOM.div({
			className : 'app'
		}, JQueryMobilePage({
			id : 'Insurion'
		}, PageOneContent(null)));
	}*/
	
	render : function() {
			return PageOneContent();
	}
});
App = React.createFactory(App);

/** jQuery Mobile button component. */
var JButton2 = React.createClass({
	displayName : 'JButton2',

	getDefaultProps : function() {
		return {
			className : 'ui-btn ui-shadow ui-corner-all'
		};
	},

	render : function() {
		return React.DOM.p(null, React.DOM.a(this.props, this.props.children));
	}
});
JButton2 = React.createFactory(JButton2);

/** JCustomButton component. */
var JCustomButton = React.createClass({
	displayName : 'JCustomButton',

	getDefaultProps : function() {
		return {
			className : 'ui-btn'
		};
	},

	render : function() {
		return React.DOM.p(null, React.DOM.button({
			onClick : function() {
				alert('click!');
			}
		}, this.props.children));
	}
});
JCustomButton = React.createFactory(JCustomButton);

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

/** jQuery Mobile footer component. */
var JQueryMobileFooter = React.createClass({
	displayName : 'JQueryMobileFooter',

	render : function() {
		return React.DOM.div({
			'data-role' : 'footer'
		}, React.DOM.h4(null, 'Page footer'));
	}
});
JQueryMobileFooter = React.createFactory(JQueryMobileFooter);

/** jQuery Mobile header component. */
var JQueryMobileHeader = React.createClass({
	displayName : 'JQueryMobileHeader',

	render : function() {
		return React.DOM.div({
			'data-role' : 'header',
			'data-theme' : this.props.headerTheme
		}, React.DOM.h1(null, this.props.title));
	}
});
JQueryMobileHeader = React.createFactory(JQueryMobileHeader);

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

/** jQuery Mobile header component. */
var JHeader = React.createClass({
	displayName : 'JHeader',

	render : function() {
		/*return React.DOM.div({'data-role' : 'header', 'data-theme' : this.props.headerTheme}, 
				React.DOM.h1(null, this.props.title), JButton({caption:'Выход'}));*/
		var style = {};
		if(this.props.page == 'login'){
			style = {paddingLeft:'50%', paddingTop:'5pt', marginLeft:'-50pt'};
		} else {
			style = {paddingLeft:'5pt', paddingTop:'5pt'};
		}
		return React.DOM.div({className:'ui-bar-inherit'}, 
				/*React.DOM.div(null, React.DOM.svg( { className: 'my-svg' },
					    React.createElement( 'use', { xlinkHref: 'logo.svg' }, '' )
				)),*/
				//React.DOM.div(null, React.DOM.h1({className:'app-title'}, this.props.title)
				React.DOM.div({style:style}, 
						React.DOM.img({height:'32pt', src: './ins-logo64.png'})
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
		var r = (React.DOM.div(null, React.DOM.span(null, "no route")));
		var head = JHeader({title : 'Insurion', page:this.state.page});
		if(this.state.page == 'a'){
			r = (React.DOM.div(null, head, React.DOM.div({className : "div-left"}, 
					JRiskAdmin({onLogoutSuccess:this.onLogoutSuccess, onRoute:this.onRoute})))
				);
		} else {
			r = (React.DOM.div(null, React.DOM.div({
				className : 'div-center' + (isMobile.any()?'-mob':'') 
			}, JLogin({onLoginSuccess:this.onLoginSuccess, a:"1"}))));
		}  
		return React.DOM.div(null, 
				//JHeader({title : 'Insurion', page:this.state.page, onClick:this.onLogoutSuccess}), 
				JQueryMobileContent(null, r)
			);
	}
});
PageOneContent = React.createFactory(PageOneContent);

/** Application page two component. */
var PageTwoContent = React
		.createClass({
			displayName : 'PageTwoContent',

			render : function() {
				return React.DOM
						.div(
								null,
								React.DOM.h2(null, 'Two'),
								React.DOM
										.p(
												null,
												'I have an id of "two" on my page container. I\'m the second page container in this multi-page template.'),
								React.DOM
										.p(
												null,
												'Notice that the theme is different for this page because we\'ve added a few ',
												React.DOM.code(null,
														'data-theme'),
												' swatch assigments here to show off how flexible it is. You can add any content or widget to these pages, but we\'re keeping these simple.'),
								JButton(
										{
											href : '#one',
											'data-direction' : 'reverse',
											className : 'ui-btn ui-shadow ui-corner-all ui-btn-b'
										}, 'Back to page "one"'));
			}
		});
PageTwoContent = React.createFactory(PageTwoContent);

/** Application popup page component. */
var PagePopUpContent = React
		.createClass({
			displayName : 'PagePopUpContent',

			render : function() {
				return React.DOM
						.div(
								null,
								React.DOM.h2(null, 'Popup'),
								React.DOM
										.p(
												null,
												'I have an id of "popup" on my page container and only look like a dialog because the link to me had a ',
												React.DOM.code(null,
														'data-rel="dialog"'),
												' attribute which gives me this inset look and a ',
												React.DOM
														.code(null,
																'data-transition="pop"'),
												' attribute to change the transition to pop. Without this, I\'d be styled as a normal page.'),
								JButton(
										{
											href : '#one',
											'data-rel' : 'back',
											className : 'ui-btn ui-shadow ui-corner-all ui-btn-inline ui-icon-back ui-btn-icon-left'
										}, 'Back to page "one"'));
			}
		});
PagePopUpContent = React.createFactory(PagePopUpContent);

// Render application.
ReactDOM.render(App(null), document.getElementById('content'));
