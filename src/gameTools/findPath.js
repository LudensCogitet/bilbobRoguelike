function findPath(map, start, end, testType = 'direct', impassable = [1]){
  var open = [{pos: start, parent: null}];
  var closed = [];
  var finalPos = false;

  var shouldPass = (option,current)=>{
      return option.x < 0 ||
             option.x >= map.width ||
             option.y < 0 ||
             option.y >= map.height ||
             closed.some(el=>{return el.pos.x == option.x && el.pos.y == option.y;});
  }

  while(open.length != 0){
    var current = open.pop();

    if(current.pos.x == end.x && current.pos.y == end.y){
      if(testType == 'exists'){
        return true;
      }
      else{
        finalPos = current;
        break;
      }
    }
    else{
      var options = [{x: current.pos.x-1,y: current.pos.y},
                     {x: current.pos.x+1, y: current.pos.y},
                     {x: current.pos.x, y: current.pos.y-1},
                     {x: current.pos.x, y: current.pos.y+1},
                     {x: current.pos.x-1, y: current.pos.y-1},
                     {x: current.pos.x+1, y: current.pos.y-1},
                     {x: current.pos.x+1, y: current.pos.y+1},
                     {x: current.pos.x-1, y: current.pos.y+1}];

      options.forEach(option=>{
                      if(shouldPass(option,current)){
                        return;
                      }
                      else{
                        if(impassable.some(el=>{return el == map.cells[option.y][option.x];})){
                          closed.push({pos: option, parent: current});
                        }
                        else{
                          open.push({pos: option, parent: current});
                        }
                      }
                     });
      closed.push(current);
    }
  }

  if(finalPos == false){
    return false;
  }
  else{
    var currentNode = finalPos;
    var path = [];

    while(currentNode.parent != null){
      path.unshift(currentNode.pos);
      currentNode = currentNode.parent;
    }

    //console.log(start, end);
    //console.log(path);
    return path;
  }
}

export default findPath;
