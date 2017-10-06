// Physics collisions only happen within local engine.
// So each player needs to check for collisions with all avatars,
// and if it's not theirs, they need to tell the actual owner.

AFRAME.registerSystem("networked-collision", {
  init: function () {
    // Subscribe to data channel for our custom event.
    NAF.connection.subscribeToDataChannel('netcollision', function(fromClient, dataType, data) {
      // Generate a (local) collide event on the body in the entity.
      // FIXME: what if there are multiple?
      var targetEl = NAF.entities.entities[data.target].querySelector('[dynamic-body],[static-body]');
      var bodyEl = NAF.entities.entities[data.body];
      targetEl.emit('collide',{target:{el:targetEl}, body:{el:bodyEl}, contact:{
        bi: bodyEl.body,
        bj: targetEl.body,
        ni: data.contact.ni,
        restitution: data.contact.restitution,
        ri: data.contact.ri,
        rj: data.contact.rj                
      }})
    });          
  }        
});

AFRAME.registerComponent("networked-collision", {
  init: function () {
    var self = this;

    this.el.addEventListener('collide', function (e) {
//            console.log('Player has collided with body #' + e.detail.body.id);

//            e.detail.target.el;  // Original entity (playerEl).
//            e.detail.body.el;    // Other entity, which playerEl touched.
//            e.detail.contact;    // Stats about the collision (CANNON.ContactEquation).
//            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).

      var selfNet = self.el.components['networked-share'];
      var bodyNet = e.detail.body.el.components['networked-share'];
      var owner = selfNet.data.owner;
      if (NAF.clientId === owner) {
/*              
        console.log(selfNet.data.owner + ' ' + selfNet.data.networkId  
                    + ' local collision with ' 
                    + bodyNet.data.owner + ' ' + bodyNet.data.networkId);
*/
        // Real (local) collision, so do something about it.
        self.el.emit('collision', e.detail);
      } else {
/*              
        console.log('CROSS-OWNER ' + selfNet.data.owner + ' ' + selfNet.data.networkId  
                    + ' network collision with ' 
                    + bodyNet.data.owner + ' ' + bodyNet.data.networkId);
*/                          
        // Propagate message about collision to the owner to take action on theirs!
        NAF.connection.sendDataGuaranteed(owner, 'netcollision', {
          target: selfNet.data.networkId,
          body: bodyNet.data.networkId,
          contact: {
            // CIRCULAR! bi: e.detail.contact.bi,
            // CIRCULAR! bj: e.detail.contact.bj,
            ni: e.detail.contact.ni,
            restitution: e.detail.contact.restitution,
            ri: e.detail.contact.ri,
            rj: e.detail.contact.rj
          }});
      }
    });
  }
});
