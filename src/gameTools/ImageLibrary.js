class ImageLibrary{
  constructor(){
    this.images = {'wall': new Image(),
                  'floor': new Image(),
                  'doorClosed': new Image(),
                  'doorOpen': new Image(),
                  'darkness': new Image(),
                  'player': new Image(),
                  'rat': new Image(),
                  'imp': new Image(),
                  'keys': new Image(),
                  'floorCrunchy': new Image(),
                  'floorWet': new Image(),
                  'floorSoft': new Image(),
                  'Compass': new Image(),
                  'startDoor': new Image()};

      this.images['wall'].src = 'https://ludenscogitet.github.io/wall.png';
      this.images['floor'].src = 'https://ludenscogitet.github.io/floor.png';
      this.images['doorClosed'].src = 'https://ludenscogitet.github.io/door.png';
      this.images['doorOpen'].src = 'https://ludenscogitet.github.io/dooropen.png';
      this.images['darkness'].src = 'https://ludenscogitet.github.io/darkness.png';
      this.images['player'].src = 'https://ludenscogitet.github.io/billbob.png';
      this.images['rat'].src = 'https://ludenscogitet.github.io/rat.png';
      this.images['imp'].src = 'https://ludenscogitet.github.io/imp.png';
      this.images['keys'].src = 'https://ludenscogitet.github.io/keys.png';
      this.images['floorCrunchy'].src = 'https://ludenscogitet.github.io/floorcruncy.png';
      this.images['floorWet'].src = 'https://ludenscogitet.github.io/floorwet.png';
      this.images['floorSoft'].src = 'https://ludenscogitet.github.io/floorsoft.png';
      this.images['Compass'].src = 'https://ludenscogitet.github.io/Compass.png';
      this.images['startDoor'].src = 'https://ludenscogitet.github.io/enddoor.png';
  }

  getImage(imageName){
    return this.images[imageName].src;
  }
}

const imageLibrary = new ImageLibrary();

export default imageLibrary;
