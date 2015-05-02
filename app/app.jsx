'use strict';

var React = require('react/addons');
var HeaderBar = require('./components/HeaderBar')
var MainDock = require('./components/MainDock')

var App = React.createClass({
  render: function() {
    return (
    	<div>
    		<HeaderBar></HeaderBar>
    		<MainDock></MainDock>
    	</div>
    );
  }
});

module.exports = App;