import imageLibrary from '../../gameTools/ImageLibrary';
import GameObject from './GameObject';

class Door extends GameObject{
  constructor(x,y,level){
    super('door','none',false,false,x,y,imageLibrary.getImage('doorClosed'),4,level);
  }

  act(cause, action = null){
    if((cause.type == 'player' || cause.type == 'enemy') && action == 'collision'){
      if(this.image == imageLibrary.getImage('doorClosed')){
        this.image = imageLibrary.getImage('doorOpen');
        if(cause.type == 'enemy'){
          this.level.player.act(this,'ping');
        }
      }
      if(this.translucent == false)
        this.translucent = true;
    }
  }
}

export default Door;
