import React, {Component} from 'react';
import Touch from './Touch';

export const _compassDimensions = 128;

class Buttons extends Component{
  constructor(props){
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {buttons:(<div style={{position: 'absolute', bottom: window.innerHeight*0.3, right: 0, width: _compassDimensions, height: _compassDimensions}}>
                            <Touch
                             x={0}
                             y={0}
                             dx={-1}
                             dy={-1}
                             width={this.props.dimensions.width/4}
                             height={this.props.dimensions.height/4}
                             handleClick={this.props.handleClick}/>
                             <Touch
                             x={this.props.dimensions.width/4}
                             y={0}
                             dx={0}
                             dy={-1}
                             width={this.props.dimensions.width/4*2}
                             height={this.props.dimensions.height/4}
                             handleClick={this.props.handleClick}/>
                            <Touch
                             x={this.props.dimensions.width/4*3}
                             y={0}
                             dx={1}
                             dy={-1}
                             width={this.props.dimensions.width/4}
                             height={this.props.dimensions.height/4}
                             handleClick={this.props.handleClick}/>
                            <Touch
                             x={this.props.dimensions.width/4*3}
                             y={this.props.dimensions.height/4}
                             dx={1}
                             dy={0}
                             width={this.props.dimensions.width/4}
                             height={this.props.dimensions.height/4*2}
                             handleClick={this.props.handleClick}/>
                            <Touch
                             x={this.props.dimensions.width/4*3}
                             y={this.props.dimensions.height/4*3}
                             dx={1}
                             dy={1}
                             width={this.props.dimensions.width/4}
                             height={this.props.dimensions.height/4}
                             handleClick={this.props.handleClick}/>
                            <Touch
                             x={this.props.dimensions.width/4}
                             y={this.props.dimensions.height/4*3}
                             dx={0}
                             dy={1}
                             width={this.props.dimensions.width/4*2}
                             height={this.props.dimensions.height/4}
                             handleClick={this.props.handleClick}/>
                            <Touch
                             x={0}
                             y={this.props.dimensions.height/4*3}
                             dx={-1}
                             dy={1}
                             width={this.props.dimensions.width/4}
                             height={this.props.dimensions.height/4}
                             handleClick={this.props.handleClick}/>
                            <Touch
                             x={0}
                             y={this.props.dimensions.height/4}
                             dx={-1}
                             dy={0}
                             width={this.props.dimensions.width/4}
                             height={this.props.dimensions.height/4*2}
                             handleClick={this.props.handleClick}/>
                           </div>)};
  }

  componentWillMount(){
    document.addEventListener("keydown",this.handleKeyDown);
  }

  handleKeyDown(event){
    var key = event.key

    if(key == 'ArrowLeft' || key == 'a' || key =='4')
        this.props.handleClick(-1,0);
    else if(key == 'ArrowUp' || key == 'w' || key =='8')
        this.props.handleClick(0,-1);
    else if(key == 'ArrowRight' || key == 'd' || key =='6')
        this.props.handleClick(1,0);
    else if(key == 'ArrowDown' || key == 's' || key =='2')
        this.props.handleClick(0,1);
    else if(key == 'q' || key =='7')
        this.props.handleClick(-1,-1);
    else if(key == 'e' || key =='9')
        this.props.handleClick(1,-1);
    else if(key == 'c' || key =='3')
        this.props.handleClick(1,1);
    else if(key == 'z' || key =='1')
        this.props.handleClick(-1,1);
  }

  render(){
    //console.log(this.state.buttons);
    return this.state.buttons;
  }
}

export default Buttons;
