function castRays(pos,level,range,angle,callback){
    var cast = (x,y)=>{
      var ox = pos.x+0.5;
      var oy = pos.y+0.5;
      for(let i = 0; i < range; i++){
        var oxFloor = Math.floor(ox);
        var oyFloor = Math.floor(oy);

        if(level.checkCell(oxFloor,oyFloor)){
          if(callback(oxFloor,oyFloor) == false){
            break;
          }
        }
        else{
          break;
        }

        ox += x;
        oy += y;
      }
    }

    var run;
    var rise;

    for(let i = angle.start; i < angle.end; i += 0.5){
      run = Math.cos(i*0.01745);
      rise = Math.sin(i*0.01745);
      cast(run,rise);
    }
  }

  export default castRays;
