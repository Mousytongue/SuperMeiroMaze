/* File: TextureObject.js 
 *
 * Defines the behavior of an GameObject that references to a TextureRenderable
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, TextureRenderable*/
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Saw(texture) {
    this.mRenderable = new SpriteRenderable(texture);
    this.mRenderable.setColor([1, 1, 1, 0.1]);
    GameObject.call(this, this.mRenderable);
    this.mSpeed = 5;
}
gEngine.Core.inheritPrototype(Saw, GameObject);

Saw.prototype.update = function () {
    this.mRenderable.getXform().incRotationByDegree(this.mSpeed);
    
};