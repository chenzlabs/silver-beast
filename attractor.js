AFRAME.registerComponent('attractor', {
  schema: {
    g: {default: 6.67e-11},
    mass: {default: 1e9}
  },

  init: function () {
    this.tempPosition = new CANNON.Vec3();
    this.tempForce = new CANNON.Vec3();
    this.forceDelta = new CANNON.Vec3();
  },

  tick: function (t, dt) {
    var dbs = this.el.sceneEl.querySelectorAll('[dynamic-body]');
    for (var i=0; i<dbs.length; i++) {
      var el = dbs[i];
      var body = el.body;
      // We can catch a new dynamic-body or static-body before physics actually attaches the body.
      if (!body) { continue; }

      // Compute difference between body and attractor position.
      if (this.el.body) {
        this.tempPosition.copy(this.el.body.position);
      } else {
        var position = this.el.getAttribute('position');
        this.tempPosition.set(position.x, position.y, position.z);
      }
      this.tempPosition.vsub(body.position, this.tempForce);
      // Compute distance between them (magnitude of difference).
      var r = this.tempForce.length();
      // Compute attraction strength.
      var f = this.data.g * this.data.mass * body.mass / (r * r);
      // make tempForce have the correct magnitude f.
      this.tempForce.scale(f / r, this.tempForce);
      // Compute force delta. NOTE: we need to know last applied value!
      // FIXME: this will only work for one attractor...
      if (el.lastComputedAttractor) {
        this.tempForce.vsub(el.lastComputedAttractor, this.forceDelta);
      } else {
        el.lastComputedAttractor = new CANNON.Vec3().copy(this.tempForce);
        this.forceDelta.copy(this.tempForce);
      }
      // Apply force delta.
      body.applyLocalImpulse(this.forceDelta, CANNON.Vec3.ZERO);
    }
  }
});
