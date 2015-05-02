'use strict';

var React = require('react/addons');
var fire = require('../db/firebase');
var LinkBox = React.createClass({
	getInitialState: function(){
    	return {
    		text:"",
    		name:'',
    		linkID:'',
    		link:"",
    		pos: this.props.initialPos,
      		dragging: false,
      		rel: null, // position relative to the cursor
      		showVideo:'none',
      		showText:'block',
      		zIndex: 0
    	};
  	},

  	getDefaultProps: function(){
  		return {
  			initialPos: {x: 0, y: 0},
    	};
  	},

	componentWillMount:function(){
		var linkDone = 'https://www.youtube.com/embed/' + this.props.data.val.linkID;
		this.setState({
			text:this.props.data.val.text,
			name:this.props.data.val.name,
	      	link: linkDone,
	      	linkID: this.props.data.val.linkID,
	      	showVideo:this.props.data.val.showVideo,
			showText:this.props.data.val.showText,
			pos: this.props.data.val.pos,
			zIndex: this.props.data.val.zIndex
	    });
	},

  	componentDidMount:function() {
	    this.fire = fire.getRef().child('clips/'+this.props.data.val.parentID+'/'+this.props.data.id);
	},

  	componentWillReceiveProps: function(nextProps) {

		var linkDone = 'https://www.youtube.com/embed/' + nextProps.data.val.linkID;
		var showVideo = nextProps.data.val.showVideo;
		if(nextProps.data.val.linkID!='')
			showVideo='block'

		this.setState({
			text:nextProps.data.val.text,
			name:nextProps.data.val.name,
	      	link: linkDone,
	      	linkID: nextProps.data.val.linkID,
	      	showVideo: showVideo,
			showText:nextProps.data.val.showText,
			pos: nextProps.data.val.pos,
			zIndex: nextProps.data.val.zIndex
	    });
	},
  	componentDidUpdate: function (props, state) {
	    if (this.state.dragging && !state.dragging) {
	      document.addEventListener('mousemove', this.mouseMove);
	      document.addEventListener('mouseup', this.mouseUp);
	    } else if (!this.state.dragging && state.dragging) {
	      document.removeEventListener('mousemove', this.mouseMove);
	      document.removeEventListener('mouseup', this.mouseUp);
	    }
  	},

  	mouseDown: function(e){
   		if (e.button !== 0) return;
	    
	    var pos = this.getDOMNode();

	    var posY = 0;
		if(e.pageY - pos.offsetTop>0)
	  			posY = e.pageY - pos.offsetTop;

	  	var posX = 0;
  		if(e.pageX - pos.offsetLeft>0)
  			posX = e.pageX - pos.offsetLeft;	

	    this.setState({
	      dragging: true,
	      rel: {
	        x: posX,
	        y: posY
	      },
	      zIndex:1000
	    });
  	},

  	mouseMove: function(e){
  		if (!this.state.dragging) return;

  		var posY = 0;
  		if(e.pageY - this.state.rel.y>0)
  			posY = e.pageY - this.state.rel.y;

  		var posX = 0;
  		if(e.pageX - this.state.rel.x>0)
  			posX = e.pageX - this.state.rel.x;	

  		var pos = {
	        x: posX,
	        y: posY
	      }

	    this.setState({
	      pos: pos
	    });

	    this.fire.update({pos});

	    e.stopPropagation();
	    e.preventDefault();
  	},

  	mouseUp: function(e){
  		this.setState({
  			dragging: false,
  			zIndex: this.props.data.val.zIndex
  		});
  	},

  	handleChange: function(evt) {
  		var text = evt.target.value;
    	var regExp =/(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@#?&%=+\/\$_.-]*/ig;
	    var match = text.match(regExp);
	    var linkID = '';
	   	var link='';
	   	var showVideo='none';
		var showText='block';
	    if(match && match.length==1)
	    {
	    	linkID = (match[0].replace(regExp, '$1'));
		    if(linkID){
				link = 'https://www.youtube.com/embed/' + linkID;
				showVideo='block';
				showText ='none'

		    }

			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
     		//text = text.replace(exp,"<a href='$1'>$1</a>"); 

	    }
	  
	  	this.setState({
	      text: text,
	      linkID: linkID,
	      link:link,
	      showText:showText,
	      showVideo:showVideo
	    });

	    this.fire.update({text,linkID,link,showVideo,showText});
 	},

 	handleChangeTitle: function(evt) {
 		var name = evt.target.value;
	    this.setState({
	      name: name
	    });

	    this.fire.update({name});
 	},

 	closeButton: function(evt) {
 		this.fire.remove();
 	},

	render: function() {
		return (
		  <div className = "linkBox" 
		  onMouseDown = {this.mouseDown} 
		  style = {{position: 'absolute', top: this.state.pos.y+ 'px', left: this.state.pos.x + 'px',  zIndex:this.state.zIndex}} >
		  	<div className = "headerBox">
		  		<input type="text" className="titleText" name="title" value={this.state.name} onChange={this.handleChangeTitle}></input>
		  		<button className="closeButton" onClick={this.closeButton}>X</button>
		  	</div>
		  	<div className="containerBox">
		  		<iframe style = {{display: this.state.showVideo}} className="iframe_YTB" allowFullScreen="1" webKitAllowFullScreen="1" width="403" height="256" frameBorder="0" scrolling="no" src={this.state.link}></iframe>
		  		<textarea style = {{display: this.state.showText}} className="areaText" value={this.state.text} onChange={this.handleChange}></textarea>
		  	</div>
		  </div>
		);
  	}
});
module.exports = LinkBox;