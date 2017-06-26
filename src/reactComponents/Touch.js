import React, {Component} from 'react';

class Touch extends Component{
  constructor(props){
    super(props);

    this.state = {touchStyle:{position: 'absolute',
                              opacity: 0,
                              backgroundColor: 'rgba(0,100,0,0.2)',
                              width: props.width,
                              height: props.height,
                              top: props.y,
                              left: props.x,
                              zIndex: 10000
                              }
                 };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.props.handleClick(this.props.dx,this.props.dy);
  }

  render(){
    return <div className='touchButton' style={this.state.touchStyle} onClick={this.handleClick} />
  }
}

export default Touch;
