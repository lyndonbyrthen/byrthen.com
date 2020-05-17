import Matter from 'matter-js';
import { default as appSS } from './styles';
import { getRainbowArray, getRgbaStr } from './AssetUtils';

const {
  Engine,
  Render,
  Runner,
  Body,
  Composite,
  Composites,
  Common,
  Constraint,
  MouseConstraint,
  Mouse,
  World,
  Bodies,
  Vertices,
  Events
} = Matter;

const rad = degree => degree * Math.PI / 180;

export default class WheelAsset {
  bars = [];
  bouncers = [];
  mapIdx = 0;
  minBarHeight = 3;
  barWidth = 20;
  wheelRotation = 0;
  radius = 100;
  rainbow = [];
  barOffset = 0;

  set world(world) {
    this._world = world;
  }

  get world() {
    return this._world;
  }

  getStageProps = () => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    const centerX = WIDTH >> 1;
    const centerY = HEIGHT >> 1;

    return {
      WIDTH,
      HEIGHT,
      centerX,
      centerY
    }
  }

  addBars = () => {
    const {
      WIDTH,
      HEIGHT,
      centerX,
      centerY,
    } = this.getStageProps();

    const {
      minBarHeight
    } = this;

    this.bars = [];

    this.radius = WIDTH > HEIGHT ? HEIGHT * .4 : WIDTH * .4

    const sides = 200, r = this.radius,
      h = 40,
      ang = 360 / sides;

    this.barWidth = 2 * Math.PI * r / sides * .5
    if (this.barWidth < 3) this.barWidth = 3

    for (let i = 0; i < sides; i++) {
      this.bars.push(Bodies.rectangle(
        centerX + (r - h / 2) * Math.cos(rad(i * ang)),
        centerY + (r - h / 2) * Math.sin(rad(i * ang)),
        this.barWidth,
        minBarHeight,
        {
          isStatic: true,
          angle: rad(i * ang - 90),
          render: {
            fillStyle: appSS.ballFillStyle
          }
        }));
    }

    World.add(this._world, this.bars);

    this.rainbow = getRainbowArray(sides);
  }

  addBouncers = () => {
    const {
      WIDTH,
      centerX,
      centerY,
    } = this.getStageProps();

    this.bouncers = [];

    let bcount = Math.floor(35 * WIDTH / 1000);
    const rainbow = getRainbowArray(bcount);

    for (let i = 0; i < bcount; i++) {
      
      this.bouncers.push(
        Bodies.circle(centerX, centerY, Common.random(5, 18), {
          restitution: 1,
          friction: 0,
          render: {...appSS.ballStyle1, strokeStyle:getRgbaStr(rainbow[i],.15)}
        })
      )
    }

    World.add(this._world, this.bouncers);
  }

  update = ({ recordedMap, analyser, dataArray, isMute }) => {

    if (!recordedMap && !analyser) return;
    let arr;

    if (isMute && recordedMap) {
      if (this.mapIdx >= recordedMap.length) this.mapIdx = 0;
      arr = recordedMap[this.mapIdx]
      this.mapIdx++
    } else {
      analyser.getByteFrequencyData(dataArray);
      arr = dataArray;
    }

    const {
      HEIGHT,
      WIDTH,
      centerX,
      centerY,
    } = this.getStageProps();

    const
      r = this.radius,
      ang = 360 / this.bars.length,
      rota = this.wheelRotation,
      len = this.bars.length;

    let barHeight;

    for (let i=0; i<len; i++) {
      const offSet = Math.abs(i + Math.floor(this.barOffset)) % len;
      const rgb = this.rainbow[offSet].concat();
      
      this.bars[i].render.fillStyle = getRgbaStr(rgb,.15);
    }

    for (let i = 0; i < len / 2; i++) {

      barHeight = this.radius * (arr[i] / 250) / 2
      if (barHeight < this.minBarHeight) barHeight = this.minBarHeight

      const v = Vertices.fromPath('L 0 0 L ' + this.barWidth + ' 0 L ' + this.barWidth + ' ' + barHeight + ' L 0 ' + barHeight)

      const x = centerX + (r - barHeight / 2) * Math.cos(rad(i * ang + rota))
      const y = centerY + (r - barHeight / 2) * Math.sin(rad(i * ang + rota))

      Body.setAngle(this.bars[i], rad(0))
      Body.set(this.bars[i], { vertices: v, position: { x: x, y: y } })
      Body.setAngle(this.bars[i], rad(i * ang + rota - 90))
    }

    for (let i = len / 2; i < len; i++) {

      barHeight = this.radius * (arr[len - i] / 250) / 2
      if (barHeight < this.minBarHeight) barHeight = this.minBarHeight

      const v = Vertices.fromPath('L 0 0 L ' + this.barWidth + ' 0 L ' + this.barWidth + ' ' + barHeight + ' L 0 ' + barHeight)

      const x = centerX + (r - barHeight / 2) * Math.cos(rad(i * ang + rota));
      const y = centerY + (r - barHeight / 2) * Math.sin(rad(i * ang + rota));

      Body.setAngle(this.bars[i], rad(0));
      Body.set(this.bars[i], { vertices: v, position: { x: x, y: y } });
      Body.setAngle(this.bars[i], rad(i * ang + rota - 90));
    }

    this.wheelRotation++;
    if (this.wheelRotation > 360) this.wheelRotation = 0;

    this.barOffset += .5;
    if (this.barOffset >= len) {
      this.barOffset = 0;
    }
  }

  auditBodies = () => {
    for (let i in this.bouncers) {
      let b = this.bouncers[i];

      if (b.position.x < 0 || b.position.x > window.innerWidth
        || b.position.y < 0 || b.position.y > window.innerHeight) {
        Body.set(b, { position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } });
      }
    }
  }

  resetOutOfBounds = (body) => {
    Body.set(body, { position: { x: window.innerWidth / 2, y: window.innerHeight / 2 } })

    // if (body.render.strokeStyle === appSS.ballStyle1.strokeStyle) {
    //   body.render.strokeStyle = appSS.ballStyle2.strokeStyle;
    // } else {
    //   body.render.strokeStyle = appSS.ballStyle1.strokeStyle;
    // }
  }

}