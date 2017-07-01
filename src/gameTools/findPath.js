function findPath(map, start, end, testType = 'direct', impassable = [1]){
  var open = [{pos: start, parent: null, cost: 10000}];
  var closed = [];
  var finalPos = false;

  var shouldPass = (option,current)=>{
      return option.x < 0 ||
             option.x >= map.width ||
             option.y < 0 ||
             option.y >= map.height ||
             closed.some(el=>{return el.pos.x == option.x && el.pos.y == option.y;});
  }

  var optionCheck = option=>{
                      if(shouldPass(option,current)){
                        return;
                      }
                      else{
                        if(impassable.some(el=>{return el == map.cells[option.y][option.x];})){
                          closed.push({pos: option, parent: current});
                        }
                        else{
                          var heuristic = 0;
                          if(testType == 'direct'){
                            let dx = Math.abs(option.x - end.x)
                            let dy = Math.abs(option.y - end.y)
                            heuristic = 1 * (dx + dy) + (1 - 2 * 1) * Math.min(dx, dy); //Math.sqrt(Math.pow(end.x - option.x,2) + Math.pow(end.y - option.y,2));
                            var index = open.findIndex(el=>{return el.cost == heuristic});
                            if(index == -1)
                              index = 0;
                          }
                          open.unshift({pos: option, parent: current, cost: heuristic});
                        }
                      }
                    }

  while(open.length != 0){
    var current = open.shift();
    //console.log(current.distanceToGoal, " ", open.length);

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

      options.forEach(optionCheck);
      closed.push(current);
    }
    if(testType == 'direct')
      open.sort((a,b)=>{return a.cost - b.cost;});
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
