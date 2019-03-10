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

Level1.prototype.SpawnWorld3 = function () {
    this.Spawn3Init();
    //1 = regular wall
    //r = right slanted wall
    //t = left slanted wall
    //2 = destructable wall
    //3 = small closing door  
    //4 = large closing door   
    //5 = lazers! or falling rocks, TBD
    //X = Saw!
                        //Start                                //450 units     
    var Row0 = "S11111111111111111111111111111161616161616111E";
    var Row1 = "S00000000000000000020000000200000x00000000000E";
    var Row2 = "S000000000000000000200000002000000000x0000000E";
    var Row3 = "S000000000000000000200000002000000000x0000000E";
    var Row4 = "S00000000000000001121111111211000x00000000000E";
    var Row5 = "S00000004440000001121111111211000x0000000X000E";
    var Row6 = "S00000000000000001121111111211000x00000000000E";
    var Row7 = "S000000000000000000200000002000000000x0000000E";
    var Row8 = "S000000000000000000200000002000000000x0000000E";
    var Row9 = "S00000000000000000020000000200000x00000000000E";
    var Ro10 = "S111111111111111111_1111111_11111111111111111E"; 
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
    this.SpawnWorldFromArray();   
};

Level1.prototype.Spawn3Init = function (){
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
    this.UITextLevel.setText("World 1-3");
};