import findPath from './findPath';
import getRandomInt from './getRandomInt';

class MapGenerator{
  makeMap(width, height, removePoints, removeWalls, specialTileDensity, numMonsterSpawners = 0){
    var numTiles = width*height;

    var specialTileTypes = [5,6,7];

    var genMap = ()=>{
      var map = [];
      for(let y = 0; y < height; y++){
        map.push([]);
        for(let x = 0; x < width; x++){
          map[y].push(0);
        }
      }

      var numSpecialTiles = (numTiles - width+height*2)*specialTileDensity;
      while(numSpecialTiles > 0){
        let x = getRandomInt(1,width-2);
        let y = getRandomInt(1,height-2);

        if(map[y][x] == 0){
          map[y][x] = specialTileTypes[getRandomInt(0,3)];
          numSpecialTiles--;
        }
      }

      var divisionsX = Math.floor(width/2);
      var divisionsY = Math.floor(height/2);

      var hLines = [];
      for(let y = 2; y < divisionsY*2; y+=2){
        hLines.push(y);
      }

      var vLines = [];
      for(let x = 2; x < divisionsX*2; x+=2){
        vLines.push(x);
      }

      var points = [];

      var outer = hLines;
      var inner = vLines;

      if(vLines.length > hLines.length){
        outer = vLines;
        inner = hLines;
      }

      outer.forEach((line)=>{
        inner.forEach((otherLine)=>{
          points.push({x: line, y: otherLine, plotted: false});
        });
      });

      var toRemove = Math.floor(points.length*removePoints);
      for(let i = 0; i < toRemove; i++){
        points.splice(getRandomInt(0,points.length),1);
      }

      var edgePoints = [];
      for(let y = 0; y <= height-1; y += height-1){
        for(let x = 2; x <= width-2; x += 2){
          edgePoints.push({x: x, y: y});
        }
      }

      for(let x = 0; x <= width-1; x += width-1){
        for(let y = 2; y <= height-2; y += 2){
          edgePoints.push({x: x, y: y});
        }
      }

      points = points.concat(edgePoints);

      var walls = [];
      var count = 1;

      points.forEach(point=>{
        var xNeighbors = points.filter(isNeighbor=>{
          return isNeighbor.x == point.x;
        });

        var yNeighbors = points.filter(isNeighbor=>{
          return isNeighbor.y == point.y;
        });

        xNeighbors.sort((a,b)=>{
          return a.y - b.y;
        });

        yNeighbors.sort((a,b)=>{
          return a.x - b.x;
        });

        var xLocation = xNeighbors.indexOf(point);
        var yLocation = yNeighbors.indexOf(point);

        var nearestNeighbors = [];

        if(xLocation > 0){
         // if(xNeighbors[xLocation-1].plotted == false)
            nearestNeighbors.push(xNeighbors[xLocation-1]);
        }

        if(xLocation < xNeighbors.length-1){
         // if(xNeighbors[xLocation+1].plotted == false)
            nearestNeighbors.push(xNeighbors[xLocation+1]);
        }

        if(yLocation > 0){
         // if(yNeighbors[yLocation-1].plotted == false)
            nearestNeighbors.push(yNeighbors[yLocation-1]);
        }

        if(yLocation < yNeighbors.length-1){
         // if(yNeighbors[yLocation+1].plotted == false)
            nearestNeighbors.push(yNeighbors[yLocation+1]);
        }

        point.plotted = true;

        for(let i = 0; i < nearestNeighbors.length; i++){
          var newWall = [point,nearestNeighbors[i]];
          newWall.sort((a,b)=>{return (a.x - b.x) + (a.y - b.y);});
          if(walls.findIndex(wall=>{return newWall[0].x == wall[0].x && newWall[0].y == wall[0].y && newWall[1].x == wall[1].x && newWall[1].y == wall[1].y;}) == -1)
            walls.push(newWall);
        }
      });

      toRemove = Math.floor(walls.length*removeWalls);
      for(let i = 0; i < toRemove; i++){
        walls.splice(getRandomInt(0,walls.length),1);
      }

      walls.forEach(wall=>{
        if(wall[0].x == wall[1].x){
          var x = wall[0].x;
          for(let y = wall[0].y; y <= wall[1].y; y++){
            map[y][x] = 1;
          }
          map[getRandomInt(wall[0].y+1,wall[1].y)][x] = 2;
        }
        else{
          var y = wall[0].y;
          for(let x = wall[0].x; x <= wall[1].x; x++){
            map[y][x] = 1;
          }
          map[y][getRandomInt(wall[0].x+1,wall[1].x)] = 2;
        }
      });

      for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
          if(y == 0 || y == height-1 || x == 0 || x == width -1)
            map[y][x] = 1;
        }
      }

      // place goal
      var gX = 1;
      var done = false;
      var leftColumn = null;
      while(!done){
        leftColumn = [];
        map.forEach((row,index)=>{
          if(row[gX] != 1)
            leftColumn.push(index);
        });

        if(leftColumn.length < 1)
          gX++;
        else
          done = true;
      }

      var goalPos = {x:gX,y: leftColumn[getRandomInt(0,leftColumn.length)]};

      // place player start
      var pX = width-1;
      done = false;
      var rightColumn = null;
      while(!done){
        rightColumn = [];
        map.forEach((row,index)=>{
          if(row[pX-1] != 1)
            rightColumn.push(index);
        });

        if(rightColumn.length < 1)
          pX--;
        else
          done = true;
      }

      var startPos = {x:pX,y: rightColumn[getRandomInt(0,rightColumn.length)]};

      var finalMap = {width:width,height:height,cells:map};

     if(findPath(finalMap,startPos,goalPos,'exists') != false){
       // Place monster spawners
      var monsterSpawnerPos = [];
      var coinFlip = Math.random() < 0.5 ? 1 : 2;
      for(let i = 0; i < numMonsterSpawners; i++){
        var mY =  coinFlip % 2 == 0 ? height-2 : 1;
        var mYInc = coinFlip % 2 == 0 ? -1 : 1;
        coinFlip++;

        var spawnAreaMarginLeft = (width/3) - numMonsterSpawners;

        if(spawnAreaMarginLeft < 0)
          spawnAreaMarginLeft = 0;

        var spawnAreaMarginRight = (width - (width/3) + numMonsterSpawners);

        if(spawnAreaMarginRight > width-2)
          spawnAreaMarginLeft = width-2;

        done = false;
        var row = null;
        while(!done){
          row = [];
          map[mY].forEach((cell,index)=>{
            if(cell != 1 && index > spawnAreaMarginLeft
               && index < spawnAreaMarginRight
               && findPath(finalMap,startPos,{x:index, y: mY},'exists'))
              row.push(index);
          });

          if(row.length < 1)
            mY += mYInc;
          else
            done = true;
        }
        monsterSpawnerPos.push({x:row[getRandomInt(0,row.length)], y: mY});
      }

        if(monsterSpawnerPos.length != numMonsterSpawners)
          return false;

        map[goalPos.y][goalPos.x] = 3;
        map[startPos.y][startPos.x] = 4;
        monsterSpawnerPos.forEach(pos=>{map[pos.y][pos.x] = 8});
        return finalMap;
      }
      else{
        return false;
      }
    }

    var done = false;
    var finalMap = null;
    while(!done){
      finalMap = genMap();
      if(finalMap != false)
        done = true;
    }
    return finalMap;
  }

  printMap(map){
    var output = "";
    for(let y = 0; y < map.height; y++){
      for(let x = 0; x < map.width; x++){
        output += map.cells[y][x];
      }
      output += '\n';
    }
    return output;
  }
}

const mapGenerator = new MapGenerator();

export default mapGenerator;
