import illuminate from '../gameTools/illuminate';
import detectCollision from '../gameTools/detectCollision';
import getRandomInt from '../gameTools/getRandomInt';

class Player{
  constructor(x,y,image,game){
    this.type = 'player';
    this.subtype = 'none';

    this.translucent = true;
    this.solid = false;

    this.pos = {x: x,
                y: x};

    this.image = image;
    this.imageLayer = 2;

    this.game = game;
    this.level = null;
    this.camera = null;

    this.lightsOn = true;
    this.haveKeys = false;

    this.lightDirections = {east:        {start: 320, end: 405},
                            west:         {start: 140, end: 225},
                            north:           {start: 230, end: 315},
                            south:         {start: 50,  end: 135},
                            northwest:       {start: 180, end: 270},
                            northeast:      {start: 270, end: 360},
                            southeast:    {start: 0,   end: 90},
                            southwest:     {start: 90,  end: 180},
                            lineOfSight:  {start: 0,   end: 360}
                           };

    this.lightAngle = null;
    this.facing = 'lightsOn';

    this.lightLevels = {full: 0,
                        dark: 0};
    this.lightRadius = 0;

    this.illuminate = illuminate.bind(this);
    this.detectCollision = detectCollision.bind(this);
  }

  addLevel(level){
    this.level = level;
    //this.illuminate();
  }

  addCamera(camera){
    this.camera = camera;

    var maxLevelDimension = this.camera.width > this.camera.height ? this.camera.width : this.camera.height;
    this.lightLevels.full = maxLevelDimension;
    this.lightLevels.dark = Math.floor(maxLevelDimension/4 > 4 ? maxLevelDimension/4 : 4);

    this.look()
  }

  act(cause, action = null){
    //console.log(cause, action);
     if(action == 'ping'){
       var northSouth = '';
       var eastWest = '';
       var comment = '';

       if(cause.pos.y < this.pos.y -1)
         northSouth = 'north';
       else if(cause.pos.y > this.pos.y +1)
         northSouth = 'south';

       if(cause.pos.x < this.pos.x -1)
         eastWest = 'west';
       else if(cause.pos.x > this.pos.x +1)
         eastWest= 'east';

       var bigDimension = Math.max(this.level.width, this.level.height);

       if(Math.abs(cause.pos.x - this.pos.x) > bigDimension/2 || Math.abs(cause.pos.y - this.pos.y) > bigDimension/2){
         comment = '. It\'s pretty far off.';
       }
       else if(Math.abs(cause.pos.x - this.pos.x) < bigDimension/3 || Math.abs(cause.pos.y - this.pos.y) < bigDimension/3){
         comment ='. It\'s close...';
       }

       if(cause.type == 'goal'){
         var textOptions = ['The unsettling sound of jangling keys and mouth-breathing can be heard from the '+northSouth+eastWest+comment,
                            'A mischievous cackle reaches your ears from the '+northSouth+eastWest+comment,
                            'You can hear the pitter-patter of that little bastard\'s tiny feet coming from the '+northSouth+eastWest+comment];

         this.game.logText(textOptions[getRandomInt(0,3)]);
       }
       else if(cause.type == 'door'){
         this.game.logText('You hear a door slam open somewhere to the '+northSouth+eastWest+comment);
       }
       else if(cause.type == 'enemy'){
        switch(this.level.map[cause.pos.y][cause.pos.x].subtype){
          case 'wet':
            this.game.logText('Something splashes through a puddle to the '+northSouth+eastWest+comment);
          break;
          case 'crunchy':
            this.game.logText('You hear claws clacking on stones to the '+northSouth+eastWest+comment);
          break;
          case 'soft':
            this.game.logText('There\'s a rustling sound to the '+northSouth+eastWest+comment);
          break;
          default:
            this.game.logText('You hear a terrible howling coming from the '+northSouth+eastWest+comment);
        }
       }
      }
      else{
        if(cause.type == 'manager' && action == 'lights out'){
          this.lightsOn = !this.lightsOn;
          this.lightRadius = 0;
          this.level.makeDark();
          this.game.logText('"Crap! What now? Who turned out the lights? Where\'s my flashlight?"');
        }
        else if(cause.type == 'goal'){
          this.haveKeys = true;
          this.game.logText('"\'Don\'t know where the little bastard went, but I got the keys at least... Now to get back to the front door"');
        }
        else if(cause.type == 'ground'){
          if(cause.subtype != 'none'){
            this.level.broadcast(this,'loud step');
          }
          if(cause.subtype == 'wet'){
            this.game.logText('You splash through the puddle on the floor, breaking the dead silence.');
          }
          else if(cause.subtype == 'crunchy'){
            this.game.logText('Pebbles slip and rattle under your feet');
          }
          else if(cause.subtype == 'soft'){
            this.game.logText('You kick your way through the leaves. Who knew rustling could be so loud?');
          }
          else if(cause.subtype == 'start'){
            if(this.haveKeys == true){
              this.game.logText('<div style="text-align: center; font-weight: bold; background-color: black; margin-left: -6px">Well, you don\'t mind saying that was scary as Hell. But, you got your keys back, and it\'ll sure make a great story at the bars. Speaking of which... you need a drink. <h3>YOU WIN</h3><p /> (hit refresh to play again)</div>');
              this.game.stopPlaying();
            }
            else{
              this.game.logText('"I ain\'t leaving without my keys!"');
            }
          }
        }
        else if(cause.type == 'enemy' && action == 'collision'){
          this.game.logText('<div style="text-align: center; font-weight: bold; background-color: black; margin-left: -6px">The horrible, snarling creature leaps upon you, and in a terrifying instant your days of haulin\' ass and gettin\' paid are at an end. <h3>GAME OVER</h3><p /> (hit refresh to play again)</div>');
          //cause.pos.x = this.pos.x;
          //cause.pos.y = this.pos.y;
          this.game.stopPlaying();
        }
      }
    }

  look(dx = null, dy = null){
    if(dx != null && dy != null && this.lightsOn == false){
      if(dx < 0 && dy < 0)
        this.facing = 'northwest';
      else if(dx > 0 && dy > 0)
        this.facing = 'southeast';
      else if(dx < 0 && dy > 0)
        this.facing = 'southwest';
      else if(dx > 0 && dy < 0)
        this.facing = 'northeast';
      else if(dx == 0 && dy > 0)
        this.facing = 'south';
      else if(dx == 0 && dy < 0)
        this.facing = 'north';
      else if(dx < 0 && dy == 0)
        this.facing = 'west';
      else if(dx > 0 && dy == 0)
        this.facing = 'east';
    }

    if(this.lightsOn == false){
      this.lightAngle = this.lightDirections[this.facing];
      this.lightRadius = this.lightLevels.dark;
    }
    else{
      this.lightAngle = this.lightDirections.lineOfSight;
      this.lightRadius = this.lightLevels.full;
    }
  }

  move(dx,dy){
    if(this.level == null){
      console.log(this,' Not in level. Cannot move.');
      return;
    }

    var oldFacing = this.facing;

    this.look(dx,dy);

    if(oldFacing != this.facing && this.lightsOn == false){
      return false;
    }

    var newX = this.pos.x + dx;
    var newY = this.pos.y + dy;

    var didMove = false;

    if(!this.detectCollision(newX, newY)){
      this.pos.x = newX;
      this.pos.y = newY;

      if(this.level.map[newY][newX].subtype != 'none'){
        this.act({type:'ground',subtype:this.level.map[newY][newX].subtype},'stepped on');
      }

      didMove = true;
    }


    return didMove;
  }
}

export default Player;
