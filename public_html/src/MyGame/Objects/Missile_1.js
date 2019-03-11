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

function Missile(spriteTexture, pos, target, fireset) {
    this.mFireSet = fireset;
    this.mTarget = target;
    this.mMissile = new SpriteRenderable(spriteTexture);
    this.mMissile.setColor([1, 1, 1, 0]);
    this.mMissile.getXform().setPosition(pos[0], pos[1]-5);
    this.mMissile.getXform().setSize(MISSILE_WIDTH, MISSILE_HEIGHT);
    this.mMissile.setElementPixelPositions(10, 35, 0, 40);
    this.mFire = null;

    GameObject.call(this, this.mMissile);
    
    this.mTimer = 0;
    this.mMoveSpeed = 1;
    this.mX = MISSILE_WIDTH;           //Width
    this.mY = MISSILE_HEIGHT;          //Height
    this.mInterp = null;
}
gEngine.Core.inheritPrototype(Missile, GameObject);

Missile.prototype.update = function () {
    this.mTimer += 1;
    
    var pos = this.mMissile.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.mMoveSpeed);
    
    //if (this.mInterp !== null){
    //    this.mInterp.updateInterpolation();
    //    var pos = this.mInterp.getValue();
    //    var pX = pos[0];
    //    var pY = pos[1];
    //    this.getXform().setPosition(pX, pY);        
    //}
    
    //Start chasing target
    if (this.mTimer > 40){
        if (this.mInterp === null)
            this.setDirection(this.mTarget);
       //this.mMoveSpeed = (this.mTimer / 500);
       //this.mInterp.setSpeed(this.mMoveSpeed);
    }
    //Move Forward after 15 miliseconds of hang time
    else if(this.mTimer > 15)
    {
        if (this.mFire === null){
            this.mFire = new Fire(-20,-20,0,0,20,60,0,32,1,1,2.5,0);
                this.mFireSet.addToSet(this.mFire);
        }
        //Insert Sprite or particles of FIRE!
        this.mMissile.getXform().incXPosBy(this.mTimer / 10);
    }
    else{
        this.mMissile.getXform().incYPosBy(-this.mMoveSpeed/2);
    }
    
    
    //Fire
    var xform = this.mMissile.getXform();
    if (this.mFire !== null)
        this.mFire.setPos(xform.getXPos(), xform.getYPos());
};

Missile.prototype.setDirection = function (mousePos){
    if(this.mInterp === null){
        this.mInterp = new InterpolateVec2(this.getXform().getPosition(), 120, .02);
        this.mInterp.setFinalValue(mousePos);
    }
};

Missile.prototype.markDead = function (){
  this.mFireSet.removeFromSet(this.mFire);  
};