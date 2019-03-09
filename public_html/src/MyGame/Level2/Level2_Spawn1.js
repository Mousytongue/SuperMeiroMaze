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

Level2.prototype.SpawnWorld1 = function () {
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
    var Row0 = "1111111111111111111111111111111111111111111111";  
    var Row1 = "0000000000000000000000100000060000000000000000";
    var Row2 = "000000000000000000003001000000600000X000000000";
    var Row3 = "0000000000X00000000003001000000600000000000000";
    var Row4 = "0000000000000000000010300000000060000000000000";
    var Row5 = "0000000000000000000001000000000006000000000000";
    var Row6 = "0000000000000003000000X00000X00000600000000000";
    var Row7 = "0000000000000030000000000000000000060000000000";
    var Row8 = "000000000000030000000X000000000000000000000000";
    var Row9 = "000000000000300000000000000000X000000000000000";
    var Ro10 = "1111111111111111111111111111111111111111111111"; 
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
    //
    this.SpawnWorldFromArray();                  
};

Level2.prototype.Spawn1Init = function () {
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