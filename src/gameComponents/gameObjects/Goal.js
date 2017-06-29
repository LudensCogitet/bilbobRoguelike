import getRandomInt from '../../gameTools/getRandomInt';
import GameObject from './GameObject';

class Goal extends GameObject{
  constructor(x,y,image,level){
    super('goal','none',true,false,x,y,image,1,level);

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
