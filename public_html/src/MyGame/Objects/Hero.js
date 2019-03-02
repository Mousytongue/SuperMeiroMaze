/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture) {
    this.kDelta = 0.3;

    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(0,30);
    this.mDye.getXform().setSize(9, 12);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mDye);
    
    this.mMoveSpeed = 1;
    this.mX = 9;           //Width
    this.mY = 12;          //Height
    this.mShakePosition = new ShakePosition(0, 0, 0, 0);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    var xform = this.getXform();
    
    //WASD controls
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
        xform.incYPosBy(this.mMoveSpeed);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
        xform.incXPosBy(-this.mMoveSpeed / 1.8);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
        xform.incYPosBy(-this.mMoveSpeed);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
        xform.incXPosBy(this.mMoveSpeed);
    
    
    
    //Shake logic
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
        this.hitShake();      
    if (!this.mShakePosition.shakeDone()){
        var p = this.mShakePosition.getShakeResults();
        xform.setSize(this.mX + p[0], this.mY + p[1]);
    }
    if (this.mShakePosition.shakeDone())
        xform.setSize(this.mX, this.mY);
    
}; 


Hero.prototype.hitShake = function () {
    if (this.mShakePosition.shakeDone())
        this.mShakePosition = new ShakePosition(4.5, 6, 4, 60); 
};