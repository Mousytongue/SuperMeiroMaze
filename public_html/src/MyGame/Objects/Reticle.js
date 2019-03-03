/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict"

const RETICLE_WIDTH = 20;
const RETICLE_HEIGHT = 20;

function Reticle(spriteTexture) {

    this.mReticle = new SpriteRenderable(spriteTexture);
    this.mReticle.setColor([1, 1, 1, 0]);
    this.mReticle.getXform().setPosition(50,40);
    this.mReticle.getXform().setSize(RETICLE_WIDTH, RETICLE_HEIGHT);
    this.mReticle.setElementPixelPositions(120, 300, 0, 180);
    GameObject.call(this, this.mReticle);
    
//    this.mMoveSpeed = 1;
    this.mX = RETICLE_WIDTH;           //Width
    this.mY = RETICLE_HEIGHT;          //Height
    this.mInterp = null;
//    this.mShakePosition = new ShakePosition(0, 0, 0, 0);
}
gEngine.Core.inheritPrototype(Reticle, GameObject);

Reticle.prototype.update = function () {
    if (this.mInterp !== null){
        this.mInterp.updateInterpolation();
        var pos = this.mInterp.getValue();
        var pX = pos[0];
        var pY = pos[1];
        this.getXform().setPosition(pX, pY);
    }
};

Reticle.prototype.setDirection = function (mousePos){
    if(this.mInterp === null);
        this.mInterp = new InterpolateVec2(this.getXform().getPosition(), 120, 1);
    this.mInterp.setFinalValue(mousePos);
};