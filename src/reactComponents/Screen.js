import React, {Component} from 'react';
import Row from './Row';

class Screen extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
    <div ref={this.props.getScreenRef} className='screenDiv' style={{fontSize: 0, margin: 0, border: 0}}>
      {this.props.cells.map((el,index)=>{return <Row key={index} cellSize={this.props.cellSize} cells={el} />;})};
    </div>
    );
  }
}

export default Screen;
