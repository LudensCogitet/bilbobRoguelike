import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Console from './reactComponents/Console';
import Screen from './reactComponents/Screen';
import Buttons from './reactComponents/Buttons';
import {_compassDimensions as compassDimensions} from './reactComponents/Buttons';

import Camera from './gameComponents/Camera';
import Level from './gameComponents/Level';
import Player from './gameComponents/Player';

import imageLibrary from './gameTools/ImageLibrary';

class App extends React.Component{
  constructor(props){
    super(props);

    var width = (window.innerWidth * 0.85);
    var height = (window.innerHeight * 0.6);

    var cameraWidth = Math.floor(width/props.cellSize);
    var cameraHeight = Math.floor(height/props.cellSize);

    if(cameraWidth % 2 == 0){
      cameraWidth--;
    }

    if(cameraHeight % 2 == 0){
      cameraHeight--;
    }

    var focus = 1;


    this.player = new Player(0,0,imageLibrary.getImage('player'),this);
    this.level = new Level(props.levelWidth,props.levelHeight,this.player,this);
    this.camera = new Camera(cameraWidth,cameraHeight,this.level,this.player,focus);
    this.consoleText = 'Everything had been going great.<p />'+
                       'Nice steak dinner tucked away...<br />Rad tunes on the radio...<br />'+
                       'Nothin\' but you, the road, and the 18 wheeled love of your life, Bessy, in it for the long hall until dawn.<p />'+
                       'Then, the frikin\' tires blew, as in more than one frikin\' tire of the 18 brand-spanking-new ones you\'d just had put on.<p />'+
                       'So you get out in the dead of night to survey the damage on some godforsaken back mountain road, \'looks like you\'re about to get jumped by Bela Lugosi or some crap,<p />'+
      'and a goblin steals your truck keys.<p />'+
      'You\'ve followed him into this spooky old castle. \'Look\'s abandoned except there are lights on all over the place.<br />'+
      'Whatever.. you need to get those keys back, or you\'re up a creek.<p />'+
      'You can still hear the little bastard jingling \'em and giggling somewhere inside, to the west.<p /><p />';
    this.textStagingArea = '';
    this.textStagingAreaColor = 'rgba(255,255,255,0.2)';

    this.outerDiv = null;
    this.setupScreenDiv = this.setupScreenDiv.bind(this);
    this.setupButtonDiv = this.setupButtonDiv.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
    this.takeTurn = this.takeTurn.bind(this);
    this.playing = true;
    this.stopPlay = false;

    this.state = {screen: this.renderScreen(),
                  consoleText: this.consoleText};
  }

  setupScreenDiv(screenDiv){
    this.screenDiv = screenDiv;
  }

  setupButtonDiv(buttonDiv){
    this.buttonDiv = buttonDiv;
  }

  stopPlaying(){
    this.stopPlay = true;
  }

  logText(text){
    this.textStagingArea += text + '<p />';
  }

  renderScreen(){
    return <Screen getScreenRef={this.setupScreenDiv} cellSize = {this.props.cellSize} cells={this.camera.takeSnapshot()} />;
  }

  takeTurn(dx,dy){
    if(this.playing){
        this.level.makeDark();
        this.player.move(dx,dy);
        this.player.illuminate();
        this.camera.checkMove();
        this.level.act();

        if(this.textStagingArea != ''){
          this.consoleText += '<div style="background-color:'+
            this.textStagingAreaColor+'">' + this.textStagingArea + '</div>';
          this.textStagingArea = '';
          this.textStagingAreaColor = this.textStagingAreaColor == 'rgba(255,255,255,0.2)' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)';
          }

        this.setState({screen: this.renderScreen(),
                       consoleText: this.consoleText});

        if(this.stopPlay)
          this.playing = false;
    }
  }

  componentDidMount(){
    this.outerDiv.style.width = this.screenDiv.clientWidth + "px";
    console.log("BUTTON", this.buttonDiv.getBoundingClientRect());
    this.setState({buttons: <Buttons handleClick={this.takeTurn} dimensions={this.buttonDiv.getBoundingClientRect()} />});
  }

  render(){
    return (
      <div ref={(container=>{this.outerDiv = container;})}
           style={{
            display: 'table',
            position: 'relative',
            margin: '0 auto',
            fontSize: 0}}>
        {this.state.screen}
        {this.state.buttons}
        <div ref={this.setupButtonDiv}
           style={{position: 'absolute',
                   zIndex: 1000,
                   right: 0,
                   bottom: window.innerHeight*0.3,
                   width: compassDimensions,
                   height: compassDimensions}}>
      <img style={{opacity: 0.3, width: '100%', height: '100%'}} src={imageLibrary.getImage('Compass')} />
      </div>
        <Console text={this.state.consoleText} />
      </div>
     );
   }
}
export default App;
