/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function HealthPowerUp(spriteTexture) {

    this.mHealthPowerUp = new SpriteRenderable(spriteTexture);
    this.mHealthPowerUp.setColor([1, 1, 1, 0]);
    this.mHealthPowerUp.setElementPixelPositions(120, 300, 0, 180);
    GameObject.call(this, this.mHealthPowerUp);

    //this.toggleDrawRenderable();
   // this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(HealthPowerUp, GameObject);

HealthPowerUp.prototype.update = function () {
    GameObject.prototype.update.call(this);
};
