function detectCollision(newX, newY){
  var collision = false;
  if(newX >= 0 && newX < this.level.width &&
     newY >= 0 && newY < this.level.height){
    if(this.level.map[newY][newX].solid == false){
      this.level.entities.forEach(entity=>{
        if(entity.pos.x == newX && entity.pos.y == newY && entity != this){
          entity.act(this,'collision');
          if(entity.solid == true)
            collision = true;
        }
      });
    }
    else{
      collision = true;
    }
  }
  else{
    collision = true;
  }
  return collision;
}

export default detectCollision;
