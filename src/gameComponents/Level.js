import Goal from './gameObjects/Goal';
import Door from './gameObjects/Door';
import Manager from './Manager';
import mapGenerator from '../gameTools/MapGenerator';

import imageLibrary from '../gameTools/ImageLibrary';

class Level{
  constructor(width, height, player, game){
    this.map = [];
    this.collisionMap = [];
    this.player = player;
    this.game = game;
    this.entities = [this.player];
    this.type = 'level';
    this.subtype = 'none';

    this.player.addLevel(this);

    this.deleteEntity = this.deleteEntity.bind(this);
    this.addEntity = this.addEntity.bind(this);
    this.broadcast = this.broadcast.bind(this);

    this.generateMap = this.generateMap.bind(this);
    this.act = this.act.bind(this);
    this.checkCell = this.checkCell.bind(this);

    if(width % 2 == 0)
      width++;
    if(height % 2 == 0)
      height++;

    this.width = width;
    this.height = height;

    this.generateMap(this.width, this.height);
    this.makeDark = this.makeDark.bind(this);
  }

  addEntity(entity){
    //console.log(entity);
    this.entities.unshift(entity);
  }

  deleteEntity(entity){
    var index = this.entities.findIndex(e=>{return e == entity});
    if(index != -1){
      this.entities.splice(index,1);
    }
  }

  broadcast(cause,action = null){
    this.entities.forEach((entity)=>{
      if(entity != cause)
        entity.act(cause,action);
    });
  }

  generateMap(width, height){
    this.collisionMap = mapGenerator.makeMap(width,height,0.75,0.5,0.1,1);
    console.log(mapGenerator.printMap(this.collisionMap));
    var manager = new Manager(this);
    for(let y = 0; y < height; y++){
      this.map.push([]);
      for(let x = 0; x < width; x++){
        var type = 'ground';
        var subtype = 'none';
        var image = imageLibrary.getImage('floor');
        var translucent = true;
        var solid = false;

        switch(this.collisionMap.cells[y][x]){
          case 1:
            type = 'wall';
            image = imageLibrary.getImage('wall');
            translucent = false;
            solid = true;
          break;
          case 2:
            this.addEntity(new Door(x,y,this))
          break;
          case 3:
            this.addEntity(new Goal(x,y,imageLibrary.getImage('keys'),this));
          break;
          case 4:
            subtype='start';
            image = imageLibrary.getImage('startDoor');
            translucent = false;
            solid = false;
            this.player.pos.x = x;
            this.player.pos.y = y;
          break;
          case 5:
            subtype='crunchy';
            image = imageLibrary.getImage('floorCrunchy');
          break;
          case 6:
            subtype='wet';
            image = imageLibrary.getImage('floorWet');
          break;
          case 7:
            subtype='soft'
            image = imageLibrary.getImage('floorSoft');
          break;
          case 8:
            manager.addEnemySpawner({x:x, y: y});
          break;
        }

        let newTile = {type: type,
                       subtype: subtype,
                       image: image,
                       translucent: translucent,
                       solid: solid,
                       lit: false};
        this.map[y].push(newTile);
      }
    }
    this.addEntity(manager);
  }

  act(cause){
    this.entities.forEach((entity)=>{entity.act(this);});
  }

  checkCell(x,y,toCheck = 'exists', value = null){
    if(x < 0 || x > this.width-1 || y < 0 || y > this.height-1){
      return false;
    }
    else if(toCheck == 'exists'){
      return true;
    }
    else if (value != null){
      let cellEntities = this.entities.filter(element=>{
        return (element.pos.x == x && element.pos.y == y);
      });

      //console.log(cellEntities);

      var matches = cellEntities.filter(element=>{
                                            if(typeof element == "object"){
                                               return element.hasOwnProperty(toCheck);
                                            }
                                          });

      //console.log(match);
      if(matches.length > 0){
        return matches.some(el=>{return el[toCheck] == value});
      }
      else{
        let cell = this.map[y][x];
        if(!cell.hasOwnProperty(toCheck)){
          return false;
        }
        else{
          return cell[toCheck] == value;
        }
      }
    }
  }

  makeDark(){
    this.map.forEach(row=>{
      row.forEach(cell=>{
        cell.lit = false;
      });
    });
  }
}

export default Level;
