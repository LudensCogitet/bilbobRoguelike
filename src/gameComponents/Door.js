import imageLibrary from '../gameTools/ImageLibrary';

class Door{
  constructor(x,y,level){
    this.type = 'door';
    this.subtype = 'none';
    this.translucent = false;
    this.solid = false;
    this.pos = {x: x,
                y: y};
    this.level = level;
    this.image = imageLibrary.getImage('doorClosed');
    this.imageLayer = 4;
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
