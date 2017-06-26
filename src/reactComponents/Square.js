import React, {Component} from 'react';

class Square extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (<div style={{position: 'relative', display: 'inline-block', width: this.props.cellSize, height: this.props.cellSize}}>
              {this.props.images.map((image,index)=>{return <img src={image} style={{position: 'absolute', width: '100%', height: '100%', zIndex: index+10}} />;})}
            </div>
           );
  }
}

export default Square;
