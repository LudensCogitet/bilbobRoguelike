import React, { Component } from 'react';

class Console extends Component{
  constructor(props){
    super(props);

    this.textarea = null;
    this.firstRender = true;
  }

  componentDidMount(){
    this.forceUpdate();
  }

  componentDidUpdate(){
    if(this.firstRender == true){
      this.textarea.scrollTop = 0;
      this.firstRender = false;
    }
    else{
      this.textarea.scrollTop = this.textarea.scrollHeight;
    }
  }

  render(){
    return (<div     className='consoleDiv'
                     ref={(textarea)=>{this.textarea = textarea;}}
                     style={{
                     height: (window.innerHeight*0.3),
                     backgroundColor: 'black',
                     color: 'white',
                     width: '100%',
                     margin: 0,
                     paddingLeft: 6,
                     boxSizing: 'border-box',
                     fontFamily: 'monospace',
                     fontSize: '12pt',
                     overflowY: 'auto'}}
                     dangerouslySetInnerHTML={{__html:this.props.text}}>
              </div>
           );
  }
}

export default Console;
