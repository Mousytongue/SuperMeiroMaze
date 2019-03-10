/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

const MISSILE_WIDTH = 2;
const MISSILE_HEIGHT = 2;

function Missile(spriteTexture, pos, target) {

    this.mTarget = target;
    this.mMissile = new SpriteRenderable(spriteTexture);
    this.mMissile.setColor([1, 1, 1, 0]);
    this.mMissile.getXform().setPosition(pos[0], pos[1]-5);
    this.mMissile.getXform().setSize(MISSILE_WIDTH, MISSILE_HEIGHT);
    this.mMissile.setElementPixelPositions(10, 35, 0, 40);
    GameObject.call(this, this.mMissile);
    
    this.mTimer = 0;
    this.mMoveSpeed = 1;
    this.mX = MISSILE_WIDTH;           //Width
    this.mY = MISSILE_HEIGHT;          //Height
    this.mInterp = null;
//    this.mShakePosition = new ShakePosition(0, 0, 0, 0);
}
gEngine.Core.inheritPrototype(Missile, GameObject);

Missile.prototype.update = function () {
    this.mTimer += 1;
    if (this.mInterp !== null){
        this.mInterp.updateInterpolation();
        var pos = this.mInterp.getValue();
        var pX = pos[0];
        var pY = pos[1];
        this.getXform().setPosition(pX, pY);        
    }
    
    //Move Forward after 15 miliseconds of hang time
    if(this.mTimer > 15)
    {
        //Insert Sprite or particles of FIRE!
        this.mMissile.getXform().incXPosBy(this.mMoveSpeed );
    }
    //Start chasing target
    if (this.mTimer > 30){
        if (this.mInterp === null)
            this.setDirection(this.mTarget);
       this.mMoveSpeed = (this.mTimer / 500);
       this.mInterp.setSpeed(this.mMoveSpeed);
    }
};

Missile.prototype.setDirection = function (mousePos){
    if(this.mInterp === null)
        this.mInterp = new InterpolateVec2(this.getXform().getPosition(), 80, .005);
    this.mInterp.setFinalValue(mousePos);
};