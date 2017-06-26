import castRays from './castRays';

function illuminate(makeLight = true){
  if(this.level == null){
    console.log("Can't illuminate. No level loaded.");
    return;
  }
  castRays(this.pos,this.level,this.lightRadius,this.lightAngle,(oxFloor,oyFloor)=>{
                     this.level.map[oyFloor][oxFloor].lit = makeLight;
                     return this.level.checkCell(oxFloor,oyFloor,'translucent',true);
                    });
}

export default illuminate;
