import castRays from '../gameTools/castRays';
import illuminate from '../gameTools/illuminate';
import detectCollision from '../gameTools/detectCollision';
import findPath from '../gameTools/findPath';

class Enemy{
  constructor(x,y,image,level){
    this.type = 'enemy';
    this.subtype = 'none';
    this.translucent = true;
    this.solid = true;
    this.pos = {x: x,
                y: y};

    this.image = image;
    this.imageLayer = 3;
    this.level = level;

    this.sightRadius = 15;

    this.path = null;
    this.currentStep = 0;
    this.lineOfSightTarget = null;

    this.move = this.move.bind(this);
    this.detectCollision = detectCollision.bind(this);
    this.look = this.look.bind(this);

    this.level.player.act(this,'ping');
  }

  look(){
    castRays(this.pos,this.level,this.sightRadius,{start:0,end:360},(oxFloor,oyFloor)=>{
                     var translucent = this.level.checkCell(oxFloor,oyFloor,'translucent',true);
                     if(!translucent){
                      return false;
                     }
                     else if(this.level.checkCell(oxFloor,oyFloor,'type','player')){
                      this.lineOfSightTarget = {x: oxFloor, y: oyFloor};
                      this.path = findPath(this.level.collisionMap,this.pos,this.lineOfSightTarget);
                      this.currentStep = 0;
                      return false;
                     }
                    });
  }

  move(){
    //console.log('Monster moving');
    if(this.path != null){
      if(this.currentStep < this.path.length){
        if(!this.detectCollision(this.path[this.currentStep].x,this.path[this.currentStep].y)){
          this.pos.x = this.path[this.currentStep].x;
          this.pos.y = this.path[this.currentStep].y;
          this.currentStep++;

          if(this.level.map[this.pos.y][this.pos.x].subtype != 'none'){
            this.level.player.act(this,'ping');
          }
        }
      }
      else{
        this.currentStep = 0;
        this.path = null;
      }
    }
  }

  act(cause, action = null){
    if(cause.type == 'player'){
      if(action == 'loud step'){
        this.path = findPath(this.level.collisionMap,this.pos,cause.pos);
        this.currentStep = 0;
        cause.act(this,'ping');
      }
      else if(action == 'collision'){
        cause.act(this,action);
      }
    }
    else if(cause.type == 'level'){
      this.look();
      this.move();
    }
  }
}

export default Enemy;
