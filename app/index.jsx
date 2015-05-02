'use strict';


Array.prototype.contains = function (element) {
  for (var i = 0; i < this.length; i++) {
      if (this[i] == element) {
          return true;
      }
  }
  return false;
};

var React = require('react'),
    App = require('./app');
    //require("../css/app.css");
    require("../css/app.scss");


React.render(<App />, document.body);