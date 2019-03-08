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

Level0.prototype.SpawnWorld1 = function () {
    this.Spawn1Init();

    //1 = regular wall
    //r = right slanted wall
    //t = left slanted wall
    //2 = destructable wall
    //3 = small closing door  
    //4 = large closing door   
    //5 = lazers! or falling rocks, TBD
    //6 = FallingRockSpawner
                                                              //450 units 
    var Row0 = "0000000111111111111111111111111111111111111111";  
    var Row1 = "0000000000000000000000100000060000000000000000";
    var Row2 = "0000000000000000000030010000006000000000000000";
    var Row3 = "0000000000000000000003001000000600000000000000";
    var Row4 = "0000000000000000000010300000000060000000000000";
    var Row5 = "0000000000000000000001000000000006000000000000";
    var Row6 = "0000000000000003000000100000000000600000000000";
    var Row7 = "0000000000000030000000000000000000060000000000";
    var Row8 = "0000000000000300000000000000000000000000000000";
    var Row9 = "0000000000003000000000000000000000000000000000";
    var Ro10 = "0000000111111111111111111111111111111111111111"; 
    this.mWorldArray[0] = Row0.split("");
    this.mWorldArray[1] = Row1.split("");
    this.mWorldArray[2] = Row2.split("");
    this.mWorldArray[3] = Row3.split("");
    this.mWorldArray[4] = Row4.split("");
    this.mWorldArray[5] = Row5.split("");
    this.mWorldArray[6] = Row6.split("");
    this.mWorldArray[7] = Row7.split("");
    this.mWorldArray[8] = Row8.split("");
    this.mWorldArray[9] = Row9.split("");
    this.mWorldArray[10] = Ro10.split("");
  
    for (var i = 0; i <this.mWorldArray.length; i++){
        for (var j = 0; j < this.mWorldArray[i].length; j++){
            if (this.mWorldArray[i][j] === "1")
                this.spawnWall(j*10, 100 - (i*10));
            if (this.mWorldArray[i][j] === "2")
                this.spawnDestructWall(j*10, 100 - (i*10));          
            if (this.mWorldArray[i][j] === "3")
                this.spawnSmallDoor(j*10, 100 - (i*10), j*10);
            if (this.mWorldArray[i][j] === "4")
                this.spawnLargeDoor(j*10, 100 - (i*10), j*10);
            if (this.mWorldArray[i][j] === "r")
                this.spawnWallRight(j*10, 100 - (i*10));
             if (this.mWorldArray[i][j] === "t")
                this.spawnWallLeft(j*10, 100 - (i*10));
            if (this.mWorldArray[i][j] === "_")
                this.spawnRigidWall(j*10, 100 - (i*10), 0);
            if (this.mWorldArray[i][j] === "6")
                this.spawnFallingRocks(j*10, 100 - (i*10));
            
        }
    }   
};

Level0.prototype.Spawn1Init = function () {
  this.mCamera = new Camera(
        vec2.fromValues(30, 50), // position of the camera
        200,                     // width of camera
        [0, 0, mScreenX, mScreenY]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
        
    //Background
    this.mBg = new TextureRenderable(this.kBG);
    this.mBg.getXform().setSize(200,180);
    this.mBg.getXform().setPosition(30,20);
    
    this.mHero = new Hero(this.kShipSprite);
    this.mReticle = new Reticle(this.kReticleSprite);  
    this.mWorldObjects = new GameObjectSet();
    this.mDoorObjects = new GameObjectSet();
    this.mMissileSet = new GameObjectSet();
    this.mTargetSet = new GameObjectSet();
    this.mBreakableSet = new GameObjectSet();  
};