'use strict';

var JList = React.createClass({
  displayName: 'JList',

  getDefaultProps: function() {
    return {
    	className: 'jqm-list',
    	restUrl: jsonRoot
    		};
  },
  
  onClick: function(key) {
	  //alert('onClick: ' + key);
	    //this.setState({liked: !this.state.liked});
  },
  
  doClick: function(folder) {
	  currentFolder = folder;
	  this.forceUpdate();
	  
	  //alert('JList.doClick: ' + currentFolder);
	    //this.setState({liked: !this.state.liked});
  },
  
  loadData: function () {
	  consoleLog('loadData...' + getDoctype());	  
      $.ajax({
          url: this.props.restUrl,
          dataType: "json",
          data: {method: "folders", idrequest: getID(), systemcode: systemcode, type: getType(), doctype: getDoctype()},
          success: function (data) {
              this.setState({
            	  folders: data.folders
              });
		          
          }.bind(this),
          error: function (xhr, status, err) {
        	  consoleLog(this.props.url, status, err.toString());
          }.bind(this)
      });
  },
  
  componentWillMount: function () {
	  //document.addEventListener('click', this.doClick);
  },
  
  componentDidMount: function () {
      this.loadData();
  },
  
  componentWillUnmount: function() {
	  //document.removeEventListener('click', this.doClick);
  },
  
  render: function() {
	  consoleLog('render...');
	  //return React.DOM.div(null, React.DOM.ul({id: 'items'}, React.DOM.li(null, 'Some text'), React.DOM.li(null, 'Some text2')));
	  if (!this.state || !this.state.folders) {
          return React.DOM.p(null, React.DOM.b(null, 'Загрузка...'));
      }
	  var vClick = this.onClick;
	  var doClick = this.doClick;
	  return (			  
			    //React.DOM.table({className: "table-stroke table-stripe", border: "1px"}, 
			  React.DOM.table({className: "table-list"}, 
			      /*React.DOM.thead(null, 
			        React.DOM.tr(null, this.state.images.map(function(img) {
			            return React.DOM.th({key: img}, img);
			          })
			        )
			      ), */
			      React.DOM.tbody(null, this.state.folders.map(function(row, i) {
			    	  
			    	  return (
			    	            //React.DOM.tr({key: i}, React.DOM.td({onClick: vClick.bind(null, row.code), key: row.code}, 
			    	            //		JFolder({name: row.name, code: row.code, cbClick: doClick})))
			    			  	React.DOM.tr({onClick: vClick.bind(null, row.code), key: row.code}, React.DOM.td(null,
					    	            		JFolder({name: row.name, code: row.code, cbClick: doClick})))
			    	         
			    	          );
			        })
			      )
			    )
			  );
  }
});
JList = React.createFactory(JList);

