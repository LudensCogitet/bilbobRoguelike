import images from '../gameTools/ImageLibrary';

class Camera{
  constructor(width,height,level,target,focus){
    this.width = width;
    this.height = height;
    this.level = level;
    this.target = target;
    this.target.addCamera(this);
    this.focus = focus;

    this.x = this.target.pos.x - Math.ceil(this.width/2);
    this.y = this.target.pos.y - Math.ceil(this.height/2);

    this.takeSnapshot = this.takeSnapshot.bind(this);
    this.checkMove = this.checkMove.bind(this);
  }

  takeSnapshot(){
    var picture = [];

    for(let y = this.y; y <= this.y + this.height; y++){
      picture.push([]);
      for(let x = this.x; x <= this.x + this.width; x++){
        if(x < 0 || x >= this.level.width || y < 0 || y >= this.level.height){
          picture[picture.length-1].push([images.getImage('darkness')]);
        }
        else{
          if(this.level.map[y][x].lit == false){
            picture[picture.length-1].push([images.getImage('darkness')]);
          }
          else{
            let tileImage = [this.level.map[y][x].image];
            let entities = this.level.entities.filter(function(element){
              return element.pos.x == x && element.pos.y == y;
            });

            entities.sort((a,b)=>{
              return a.imageLayer - b.imageLayer;
            });

            let entityImages = entities.map(entity=>{return entity.image});

            picture[picture.length-1].push(tileImage.concat(entityImages));
          }
        }
      }
    }

    return picture;
  }

  checkMove(){
    var middleX = this.x + Math.ceil(this.width/2);
    var middleY = this.y + Math.ceil(this.height/2);
    var xDiff = Math.abs(this.target.pos.x - middleX);
    var yDiff = Math.abs(this.target.pos.y - middleY);

    var didPan = false;

    if(xDiff > this.focus){
      if(middleX > this.target.pos.x){
        this.x -= xDiff - this.focus;
      }
      else if(middleX < this.target.pos.x){
        this.x += xDiff - this.focus;
      }
      didPan = true;
    }

    if(yDiff > this.focus){
      if(middleY > this.target.pos.y){
        this.y -= yDiff - this.focus;
      }
      else if(middleY < this.target.pos.y){
        this.y += yDiff - this.focus;
      }
      didPan = true;
    }

    return didPan;
  }
}

export default Camera;
