import Enemy from './Enemy';
import imageLibrary from '../gameTools/ImageLibrary';

class Manager{
  constructor(level){
    this.type = 'manager';
    this.subtype = 'none';
    this.translucent = false;
    this.solid = false;
    this.pos = {x: -1,
                y: -1};

    this.enemySpawners = [];

    this.level = level;
    this.timeToLightsOut = 40;

    this.addEnemySpawner = this.addEnemySpawner.bind(this);
  }

  addEnemySpawner(pos){
    this.enemySpawners.push(pos);
  }

  act(cause, action = null){
    if(cause.type == 'level'){
      //console.log(this.timeToLightsOut);
      if(this.timeToLightsOut > -1){
        if(this.timeToLightsOut > 0)
          this.timeToLightsOut--;
        else{
          this.timeToLightsOut = -1;
          this.level.player.act(this,'lights out');

          this.enemySpawners.forEach(pos=>{
            this.level.addEntity(new Enemy(pos.x,pos.y,imageLibrary.getImage('imp'),this.level));
          });
        }
      }
    }
  }
}

export default Manager;
