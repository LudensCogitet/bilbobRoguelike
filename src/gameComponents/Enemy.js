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
  }

  look(){
    castRays(this.pos,this.level,this.sightRadius,{start:0,end:360},(oxFloor,oyFloor)=>{
                     if(this.level.checkCell(oxFloor,oyFloor,'type','player')){
                      this.lineOfSightTarget = {x: oxFloor, y: oyFloor};
                      this.path = null;
                      this.currentStep = 0;
                      return false;
                     }
                     else{
                      return this.level.checkCell(oxFloor,oyFloor,'translucent',true);
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
    else if(this.lineOfSightTarget != null){
      var incX = 0;
      var incY = 0;

      if(this.lineOfSightTarget.x < this.pos.x)
        incX = -1;
      else if(this.lineOfSightTarget.x > this.pos.x)
        incX = 1;

      if(this.lineOfSightTarget.y < this.pos.y)
        incY = -1;
      else if(this.lineOfSightTarget.y > this.pos.y)
        incY = 1;

      var newX = this.pos.x += incX;
      var newY = this.pos.y += incY;

      if(!this.detectCollision(newX,newY)){
        this.pos.x = newX;
        this.pos.y = newY;
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
