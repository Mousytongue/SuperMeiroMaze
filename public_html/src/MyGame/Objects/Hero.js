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
    this.mDye.getXform().setPosition(0,50);
    this.mDye.getXform().setSize(9, 12);
    this.mDye.setElementPixelPositions(0, 60, 78, 128);
    GameObject.call(this, this.mDye);
    
    this.mMoveSpeed = 1;
    this.mX = 9;           //Width
    this.mY = 12;          //Height
    this.mFlashing = true;
    this.mFlashTimer = 0;
    this.mFlashTimer2 = 0;
    this.mFlashTimerMax = 10;
    this.mIsInvunerable = false;
    this.mShakePosition = new ShakePosition(0, 0, 0, 0);
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function (mCamera) {
    var xform = this.getXform();    
    var mCurrentPos = xform.getPosition();
    var mCameraPos = mCamera.getWCCenter();
    
    //WASD controls
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W))
    {
        if (mCurrentPos[1] < 95)
        xform.incYPosBy(this.mMoveSpeed);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
        if (mCurrentPos[0] > mCameraPos[0] -90)
        xform.incXPosBy(-this.mMoveSpeed);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        if (mCurrentPos[1] > 5)
        xform.incYPosBy(-this.mMoveSpeed);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        if(mCurrentPos[0] < mCameraPos[0] + 95)
        xform.incXPosBy(this.mMoveSpeed);
    }
    
    
    //Invunerable flash logic
    //Ticks the timers when invunerable state
    if (this.mIsInvunerable){
        this.mFlashTimer += 1;
        this.mFlashTimer2 += 1;
    }
    //every half second, the ship will change visibility state
    if (this.mFlashTimer2 >= 30){
        if (this.mFlashing === true)
            this.mFlashing = false;
        else
            this.mFlashing = true;
        this.mFlashTimer2 = 0;
    }
    this.setVisibility(this.mFlashing);
    //When time expires, resets the timers and removes invunerable state
    if (this.mFlashTimer >= this.mFlashTimerMax){
        this.mIsInvunerable = false;
        this.mFlashTimer = 0;
        this.mFlashTimer2 = 0;
    }
    //console.log(this.isVisible());
   // console.log(this.getXform().getPosition());
    
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

Hero.prototype.setInvunerable = function (time){
    this.mIsInvunerable = true;
    this.mFlashTimerMax = time;      
};

Hero.prototype.isInvunerable = function (){
    return this.mIsInvunerable;
};

Hero.prototype.hitShake = function () {
    if (this.mShakePosition.shakeDone())
        this.mShakePosition = new ShakePosition(4.5, 6, 4, 60); 
};