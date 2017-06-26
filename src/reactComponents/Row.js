import React, {Component} from 'react';
import Square from './Square';

class Row extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
      {this.props.cells.map((el,index)=>{return <Square key={index} cellSize={this.props.cellSize} images={el}/>;})}
      </div>
      );
  }
}

export default Row;
