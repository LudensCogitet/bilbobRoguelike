class GameObject{
  constructor(type,subtype,translucent,solid,x,y,image,imageLayer,level){
    this.type = type;
    this.subtype = subtype;
    this.translucent = translucent;
    this.solid = solid;
    this.pos = {x: x,
                y: y};

    this.image = image;
    this.imageLayer = imageLayer;
    this.level = level;
  }

  act(cause,action = null){
    cause.act(this,'react');
  }
}

export default GameObject;
