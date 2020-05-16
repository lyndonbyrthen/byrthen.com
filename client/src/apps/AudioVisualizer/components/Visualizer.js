import Matter from 'matter-js';

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
} = Matter

const vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
  window.cancelAnimationFrame =
    window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

class Visualizer {

  refreshTime = 20;
  dataArray = new Uint8Array(256);
  isMute = true;
  paused = true;

  set asset(asset) {
    this.kill();
    this._asset = asset;
    this.create();
  }

  set parent(parent) {
    this._parent = parent;
  }

  setAnalyser = (analyser) => {
    this.analyser = analyser;
  }

  setRecordedMap = (recordedMap) => {
    this.recordedMap = recordedMap;
  }

  step = () => {
    if (this.paused) return;

    let now = new Date().getTime();
    if (!this.timeStamp || now - this.timeStamp > this.refreshTime) {
      this.timeStamp = now;
      this._asset.update({
        recordedMap: this.recordedMap,
        analyser: this.analyser,
        isMute: this.isMute,
        dataArray: this.dataArray,
      });
    }
    window.requestAnimationFrame(this.step);
  }

  create = () => {

    this.engine = Engine.create();
    this.world = this.engine.world;
    this.world.gravity.y = 1;


    this.render = Render.create({
      element: this._parent,
      engine: this.engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframeBackground: "transparent",
        wireframes: false,
      }
    })

    Render.run(this.render)

    this.runner = Runner.create();

    this._asset.world = this.world;

    this._asset.addBars();

    this._asset.addBouncers();

    let bottom = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 30, window.innerWidth, 20, {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    });
    bottom.label = 'bwall'

    World.add(this.world, [
      bottom,
      Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth, 20,
        {
          isStatic: true,
          render: { fillStyle: 'transparent' }
        }),
      Bodies.rectangle(0, -10, 20, window.innerHeight * 2,
        {
          isStatic: true,
          render: { fillStyle: 'transparent' }
        }),
      Bodies.rectangle(window.innerWidth, -10, 20, window.innerHeight * 2,
        {
          isStatic: true,
          render: { fillStyle: 'transparent' }
        })
    ]);

    this.onCollisionStart = (event) => {
      var pairs = event.pairs;
      // change object colours to show those ending a collision
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if (pair.bodyB.label === 'bwall') {
          this._asset.resetOutOfBounds(pair.bodyA);
        }
      }
    }

    Events.on(this.engine, 'collisionStart', this.onCollisionStart);

    this.mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    World.add(this.world, this.mouseConstraint);

  }

  start = () => {
    this.pause(false)
  }

  pause = (bool = true) => {
    if (bool === this.paused) return
    this.paused = bool
    if (bool) {
      Runner.stop(this.runner);
      window.cancelAnimationFrame(this.updateInterval)
      clearInterval(this.auditInterval);
    } else {
      Runner.run(this.runner, this.engine);
      this.updateInterval = window.requestAnimationFrame(this.step);
      this.auditInterval = setInterval(this._asset.auditBodies, 2000);
    }
  }

  kill = () => {
    if (!this.engine) return;
    Events.off(this.engine, 'collisionStart', this.onCollisionStart);
    Render.stop(this.render);
    Runner.stop(this.runner);
    World.clear(this.engine.world, false, true);
    Engine.clear(this.engine);
    this.render.canvas.remove();
    clearInterval(this.updateInterval);
    clearInterval(this.auditInterval);
    this.paused = true;
  }

}

export default Visualizer;