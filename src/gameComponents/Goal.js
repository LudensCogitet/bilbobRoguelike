import getRandomInt from '../gameTools/getRandomInt';

class Goal{
  constructor(x,y,image,level){
    this.type = 'goal';
    this.subtype = 'none';
    this.translucent = true;
    this.solid = false;
    this.pos = {x: x,
                y: y};
    this.image = image;
    this.imageLayer = 1;
    this.level = level;

    this.emitMessageEvery = getRandomInt(10,21);
    this.currentTick = 0;
    this.level.broadcast(this,'ping');
  }

  act(cause, action = null){
    if(cause.type == 'level'){
      this.currentTick++;
      if(this.currentTick == this.emitMessageEvery){
        this.emitMessageEvery = getRandomInt(10,21);
        this.currentTick = 0;
        this.level.player.act(this,'ping');
      }
    }
    if(cause.type == 'player' && action == 'collision'){
      this.level.broadcast(this,'collision');
      this.level.deleteEntity(this);
    }
  }
}

export default Goal;
