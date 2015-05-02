'use strict';

var React = require('react/addons');
var LinkBox = require('./LinkBox');
var fire = require('../db/firebase');

var MainDock = React.createClass({

	getInitialState: function(){
    	return {link:"",
    			clips:[]};
  	},

	componentDidMount:function() {
		var pathArray = window.location.pathname.split( '/' );
		var newPostRef;
		if(pathArray && pathArray.length>=2)
		{
			var id = pathArray[1];
			if(id && id !='')
				this.fire = fire.getRef().child('clips/'+id);
		}
		if(!this.fire)
		{
			newPostRef = fire.getRef().child('clips');
			this.fire = newPostRef.push({});
		}
		this.fire.on('value', this.updateMe);
	},

	componentWillUnmount:function() {
		this.fire.off('value', this.updateMe)
	},

	updateMe:function(snapshot) {
		var exists = (snapshot.val() !== null);
		var newPostRef;
		var pathArray = window.location.pathname.split( '/' );
		if(!exists && pathArray && pathArray.length>=2)
		{
			var id = pathArray[1];
			if(id && id !='')
			{
				this.fire.off('value', this.updateMe);
				newPostRef = fire.getRef().child('clips');
				this.fire = newPostRef.push({});
				window.history.pushState(null, "New Clip!", "/");
				this.fire.on('value', this.updateMe);
			}
			
		}
		else
		{
			var clips = this.convertToArray(snapshot.val());
			this.setState({clips})
		}
	},

	convertToArray:function(snapshotVal){
		var array = [];
		if(!snapshotVal) return array;
		for (var key in snapshotVal)
		{
			array.push({id:key, val:snapshotVal[key]});
		}

		return array;
	},

	addClips:function(ev){
		ev.preventDefault();
		this.fire.push({
			text:"Write a text or paste a link",
			name:'New Title',
			linkID:'',
			link:"",
			pos: {x: 0, y: 0},
	  		showVideo:'none',
	  		showText:'block',
	  		zIndex:0,
	  		parentID:this.fire.key()
	    })

	},

	saveClipsLink:function(ev){
		ev.preventDefault();
		window.history.pushState(null, "Clipified!", "/"+this.fire.key());
	},

	render: function() {
	    return (
	      <div className = "mainDock">
	      	{this.state.clips.map(function(result) {
           		return <LinkBox key={result.id} data={result}/>;
        	})}
	      	<div className="plusButton" onClick = {this.addClips} tooltip="Add Clip"></div>
	      	<div className="saveButton" onClick = {this.saveClipsLink} tooltip="Save Clips"></div>
	      </div>
	    );
  	}
});
module.exports = MainDock;