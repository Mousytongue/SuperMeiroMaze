/*
 * 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2, Reticle,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObj, mGlobalSpeed ect */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict"

Level0.prototype.spawnWall = function (x, y){
    var mWall = new Wall(this.kWallTexture);
        mWall.getXform().setSize(10,10);
        mWall.getXform().setPosition(x, y);    
        this.mWorldObjects.addToSet(mWall);
};

Level0.prototype.spawnRigidWall = function (x, y) {
    var mWall = new RigidWall(this.kWallTexture);
    mWall.getXform().setSize(10,10);
    mWall.getXform().setPosition(x, y); 
    this.mBreakableSet.addToSet(mWall);
};

Level0.prototype.spawnWallRight = function (x, y){
    var mWall = new Wall(this.kWallTexture);
        mWall.getXform().setSize(10,20);
        mWall.getXform().setPosition(x, y);  
        mWall.getXform().setRotationInDegree(-45); 
        this.mWorldObjects.addToSet(mWall);
};

Level0.prototype.spawnWallLeft = function (x, y){
    var mWall = new Wall(this.kWallTexture);
        mWall.getXform().setSize(10,20);
        mWall.getXform().setPosition(x, y);  
        mWall.getXform().setRotationInDegree(45); 
        this.mWorldObjects.addToSet(mWall);
};

Level0.prototype.spawnDestructWall = function (x, y){
        var mWall = new BreakableWall(this.kBreakableSprite);
        mWall.getXform().setSize(10,10);
        mWall.getXform().setPosition(x, y);
        this.mBreakableSet.addToSet(mWall);
};

Level0.prototype.spawnSmallDoor = function (x, y, d) {
        var mDoor = new MovingDoor(this.kMinionSprite);
        mDoor.setXCenter(x);
        mDoor.setYCenter(y);
        mDoor.setHeight(40);
        mDoor.setInitialDelay(d);
        this.mDoorObjects.addToSet(mDoor);
};

Level0.prototype.spawnLargeDoor = function (x, y, d) {
        var mDoor = new MovingDoor(this.kMinionSprite);
        mDoor.setXCenter(x);
        mDoor.setYCenter(y);
        mDoor.setInitialDelay(d);
        this.mDoorObjects.addToSet(mDoor);
};

Level0.prototype.missileSpawn = function(spawnPos) {
    var mCamX = this.mCamera.mouseWCX();
    var mCamY = this.mCamera.mouseWCY();
    if (mCamY > 110)
            mCamY = 110;
    if (mCamY < -35)
        mCamY = -35;
    var target = vec2.fromValues(mCamX, mCamY);
    console.log(target);
      
    var missile = new Missile(this.kMissileSprite, spawnPos);
    missile.setDirection(target);
    this.mMissileSet.addToSet(missile);
    this.mTargetSet.addToSet(new Target(this.kTargetSprite, target));
};

Level0.prototype.spawnFallingRocks = function(x, y){
  var mRock = new RockSpawner(this.kBreakableSprite, this.kFallingRock, this.mBreakableSet);
  mRock.getXform().setXPos(x);
  mRock.getXform().setYPos(y);
  mRock.getXform().setSize(10,10);
  this.mWorldObjects.addToSet(mRock);
};