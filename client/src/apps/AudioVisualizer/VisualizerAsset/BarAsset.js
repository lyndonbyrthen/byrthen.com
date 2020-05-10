import Matter from 'matter-js';
import { default as appSS } from './styles';

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

export default class BarAsset {

    world = null;
    mapIdx = 0;
    minBarHeight = 3;
    barWidth = 20;
    wheelRotation = 0;
    yOffset = .75;
    barRes = 128;

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

        this.bars = [];

        this.barWidth = (WIDTH / this.barRes);

        for (let i = 0, x = 0; i < this.barRes; i++) {

            this.bars.push(Bodies.rectangle(x, 500, this.barWidth, this.minBarHeight, {
                isStatic: true,
                render: {
                    fillStyle: appSS.barFillStyle,
                }
            }))
            x += this.barWidth
        }

        World.add(this._world, this.bars);
    }

    addBouncers = () => {
        const {
            WIDTH,
            centerX,
            centerY,
        } = this.getStageProps();

        const rowCount = 33 * window.innerWidth / 1000;
        const pyramid = Composites.pyramid(35, 0, rowCount, 3, 0, 0, function (x, y) {
            return Bodies.circle(x, y, Common.random(5, 18), {
                restitution: 1,
                friction: 0,
                render: appSS.ballStyle1,
            });
        });

        this.bouncers = Composite.allBodies(pyramid);

        World.add(this._world, this.bouncers);

        this.auditBodies();
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

        const len = this.bars.length;

        for (let i = 0; i < len; i++) {

            const barHeight = arr[i] > this.minBarHeight ? arr[i] : this.minBarHeight;

            let v = Vertices.fromPath('L 0 0 L ' + this.barWidth + ' 0 L ' + this.barWidth + ' ' + barHeight + ' L 0 ' + barHeight)
            // Body.set(this.bars[i],{vertices:v}) 
            let y = HEIGHT * this.yOffset;
            // let y = HEIGHT*this.yOffset-barHeight/2; 

            /*let y = this.dataArray[i] > 20 ?this.dataArray[i] : 20;
            y = HEIGHT*this.yOffset - y*this.yFactor;*/

            let rgba = [];

            rgba.push(Math.round(barHeight + (22 * (i / len))));
            rgba.push(Math.round(200 * (i / len)));
            rgba.push(150)
            rgba.push(.2)

            this.bars[i].render.fillStyle = 'rgba(' + rgba.join(',') + ')'

            Body.set(this.bars[i], { vertices: v, position: { x: this.bars[i].position.x, y: y } })
        }
    }

    auditBodies = () => {
        for (let i in this.bouncers) {
            let b = this.bouncers[i];

            if (b.position.x < 0 || b.position.x > window.innerWidth
                || b.position.y < 0 || b.position.y > window.innerHeight) {
                Body.set(b, { position: { x: Common.random(15, window.innerWidth - 15), y: 0 } });
            }
        }
    }

    resetOutOfBounds = (body) => {
        Body.set(body, { position: { x: Common.random(15, window.innerWidth - 15), y: 0 } });
        if (body.render.strokeStyle === appSS.ballStyle1.strokeStyle) {
            body.render.strokeStyle = appSS.ballStyle2.strokeStyle;
        } else {
            body.render.strokeStyle = appSS.ballStyle1.strokeStyle;
        }
    }

}