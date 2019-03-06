/*
 * File: ParticleLevel.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2, Reticle,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObj, mGlobalSpeed ect */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Level0() {
    this.kUIButton = "assets/UI/button.png";
    this.kHealthBar = "assets/UI/healthbar.png";
    this.kEnergyBar = "assets/UI/energybar.png";
    this.kBG = "assets/DyeAssets/bg.png";
    this.kWallTexture = "assets/DyeAssets/bg2.png";
    this.kMinionSprite = "assets/DyeAssets/minion_sprite.png";
    this.kReticleSprite = "assets/OpenSource/crosshairs.png";
    this.kTargetSprite = "assets/OpenSource/target.png";
    this.kShipSprite = "assets/OpenSource/player_plane.png";
    this.kMissileSprite = "assets/OpenSource/shot.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.LevelSelect = null;
    this.UIHealth = null;
    this.UIEnergy = null;
    this.mBg = null;
    this.mWorldObjects = null;
    this.mDoorObjects = null;
    this.mHero = null;
    this.mPanSpeed = 0.3;   
    this.mReticle = null;
    
    this.mMissileSet = null;
    this.mTargetSet = null;
    this.mBreakableSet = null;
    
    //Testing 2d array for world generation
    this.mWorldArray = [];
    
    mGlobalSpeed = 1.0;
}
gEngine.Core.inheritPrototype(Level0, Scene);


Level0.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kHealthBar);
    gEngine.Textures.loadTexture(this.kEnergyBar);
    gEngine.Textures.loadTexture(this.kBG);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kReticleSprite);
    gEngine.Textures.loadTexture(this.kTargetSprite);
    gEngine.Textures.loadTexture(this.kShipSprite);
    gEngine.Textures.loadTexture(this.kMissileSprite);
};

Level0.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kEnergyBar);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kReticleSprite);
    gEngine.Textures.unloadTexture(this.kTargetSprite);
    gEngine.Textures.unloadTexture(this.kShipSprite);
    gEngine.Textures.unloadTexture(this.kMissileSprite);
    
    if(this.LevelSelect==="Level1"){
        gEngine.Core.startScene(new Level1());
    }
    if(this.LevelSelect==="Gameover"){
        gEngine.Core.startScene(new GameOver());
    }
    if (this.LevelSelect==="MyGame"){
        gEngine.Core.startScene(new MyGame());
    }
};

Level0.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(30, 50), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    //UI
    this.UIHealth = new UIHealthBar(this.kHealthBar,[175,575],[300,20],0);
    this.UIEnergy = new UIHealthBar(this.kEnergyBar,[175,550],[300,20],0);
    
    //Background
    this.mBg = new TextureRenderable(this.kBG);
    this.mBg.getXform().setSize(200,160);
    this.mBg.getXform().setPosition(30,20);
    
    //Hero objects
    this.mHero = new Hero(this.kShipSprite);
    this.mReticle = new Reticle(this.kReticleSprite);  
    
    //World object sets
    this.mWorldObjects = new GameObjectSet();
    this.mDoorObjects = new GameObjectSet();
    this.mMissileSet = new GameObjectSet();
    this.mTargetSet = new GameObjectSet();
    this.mBreakableSet = new GameObjectSet();
    
    //Create world
    this.worldSpawn();
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level0.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();
    this.mBg.draw(this.mCamera);
    this.UIHealth.draw(this.mCamera);
    this.UIEnergy.draw(this.mCamera);
    // console.log(this.mReticle);
    this.mMissileSet.draw(this.mCamera);
    this.mTargetSet.draw(this.mCamera);
    this.mBreakableSet.draw(this.mCamera);
    this.mHero.draw(this.mCamera);
    this.mDoorObjects.draw(this.mCamera);
    this.mWorldObjects.draw(this.mCamera); 
    this.mReticle.draw(this.mCamera);
};

Level0.prototype.update = function () {
    //Update Objects and UI
    this.UIHealth.update();
    this.UIEnergy.update();
    this.mHero.update(this.mCamera);
    this.mDoorObjects.update();
    this.mCamera.update();
    this.mReticle.update(this.mCamera);
    this.mMissileSet.update();
    this.panLevel();
    this.detectCollide();
    
    //GameOver -currently just reload MyGame
    if (this.UIHealth.getCurrentHP() === 0)
        this.restart();
    
    
    //Global slow
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
        mGlobalSpeed = 0.5;
        this.energyDown(0.2);
    }
    if(gEngine.Input.isKeyReleased(gEngine.Input.keys.Space))
        mGlobalSpeed = 1.0;
   
    //missle spawn    
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        this.missileSpawn(this.mHero.getXform().getPosition());      
    }
};

Level0.prototype.detectCollide = function() {
  var h = [];  
  for (var i = 0; i < this.mWorldObjects.size(); i++){
        if(!this.mHero.isInvunerable()){
           if (this.mHero.pixelTouches(this.mWorldObjects.getObjectAt(i), h)){
                this.hpDown(34);
                this.resetPosition();
                this.mHero.setInvunerable(180);
                break;
            }
        }
  }
  for (var i = 0; i < this.mDoorObjects.size(); i++){
        if(!this.mHero.isInvunerable()){
            var mCurrentSet = this.mDoorObjects.getObjectAt(i);
            var mTopSet = mCurrentSet.getTopSet();
            var mBotSet = mCurrentSet.getBotSet();
            for (var j = 0; j < mTopSet.length; j++){
                if (this.mHero.pixelTouches(mTopSet[j], h) || this.mHero.pixelTouches(mBotSet[j], h)){
                    this.hpDown(34);
                    this.mHero.setInvunerable(180);
                    break;
                }
            }
        }
  }
  for (var i = 0; i < this.mBreakableSet.size(); i++){
      if(!this.mHero.isInvunerable()){
          var wall = this.mBreakableSet.getObjectAt(i);
          if (this.mHero.pixelTouches(wall,h)){
              this.hpDown(34);
              this.mHero.setInvunerable(180);
              break;
          }
      }
  }
  
  
  //Missle Loop, need to improve and intergrate into above loops
  for (var i = 0; i < this.mMissileSet.size(); ++i){
        var missile = this.mMissileSet.getObjectAt(i);
        var target = this.mTargetSet.getObjectAt(i);
        var missleVec = missile.getXform().getPosition();
        var targetVec = target.getXform().getPosition();
        var xDiff = missleVec[0] - targetVec[0];
        if (xDiff < 0)
            xDiff *= -1;
        var yDiff = missleVec[1] - targetVec[1];
        if (yDiff < 0)
            yDiff *= -1;
        var tDiff = xDiff+yDiff;
      
        //console.log(tDiff);
        if(tDiff < 1) {
            this.mMissileSet.removeFromSet(missile);
            this.mTargetSet.removeFromSet(target);
        }
        
        for(var j = 0; j < this.mBreakableSet.size(); ++j) {
            var wall = this.mBreakableSet.getObjectAt(j);
            if(missile.pixelTouches(wall, h)) {
                this.mBreakableSet.removeFromSet(wall);
                this.mMissileSet.removeFromSet(missile);
                this.mTargetSet.removeFromSet(target);
            }          
        }        
    }   
};

Level0.prototype.resetPosition = function() {
  var mCamWC = this.mCamera.getWCCenter();
  this.mHero.getXform().setPosition(mCamWC[0], mCamWC[1]);
  this.mHero.setInvunerable(180);
};

Level0.prototype.panLevel = function () {
    //Camera
    this.mCamera.panBy(this.mPanSpeed * 10 * mGlobalSpeed, 0.0);
    //Hero
    this.mHero.getXform().incXPosBy(this.mPanSpeed * mGlobalSpeed);
    //Background
    this.mBg.getXform().incXPosBy(this.mPanSpeed * mGlobalSpeed);
    
    for (var i = 0; i < this.mMissileSet.size(); i++){
       this.mMissileSet.getObjectAt(i).getXform().incXPosBy(this.mPanSpeed * mGlobalSpeed); 
    }
    
};

Level0.prototype.nextLevel = function(){
    this.LevelSelects="Level1";
    gEngine.GameLoop.stop();
};

Level0.prototype.gameOver = function(){
    this.LevelSelect="Gameover";
    gEngine.GameLoop.stop();
};

Level0.prototype.restart = function(){
  this.LevelSelect="MyGame";
  gEngine.GameLoop.stop();
};

Level0.prototype.hpUp = function (n){
    this.UIHealth.incCurrentHP(n);  
};

Level0.prototype.hpDown = function (n){
    this.UIHealth.incCurrentHP(-n);  
};

Level0.prototype.energyUp = function (n){
    this.UIEnergy.incCurrentHP(n);  
};

Level0.prototype.energyDown = function (n){
    this.UIEnergy.incCurrentHP(-n);  
};

Level0.prototype.worldSpawn = function () {
    //1 = regular wall
    //2 = destructable wall
    //3 = small closing door   Doors with special delay must be hand created
    //4 = large closing door   Doors with special delay must be hand created
    //5 = lazers! or falling rocks, TBD
    
    var Row0 = "111111111111111111111111111";  //Unseen, above camera
    var Row1 = "111111111111111111111111111";
    var Row2 = "000002200000000000000000000";
    var Row3 = "000002200003330033300333000";
    var Row4 = "000002200000000000000000000";
    var Row5 = "000002204011111111111111104";
    var Row6 = "000002200000000000000000000";
    var Row7 = "000002200003330033300333000";
    var Row8 = "000002200000000000000000000";
    var Row9 = "111111111111111111111111111";
    var Ro10 = "111111111111111111111111111"; //Unseen, below camera
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
                this.spawnSmallDoor(j*10, 100 - (i*10));
            if (this.mWorldArray[i][j] === "4")
                this.spawnLargeDoor(j*10, 100 - (i*10));
        }
    }

    
    
    //Walls
   // for (var i = 0; i < 10 ; i++){
   //     var mTopWall = new Wall(this.kWallTexture);
   //     mTopWall.getXform().setSize(100,100);
   //     mTopWall.getXform().setPosition(100 * i,120);    
   //     this.mWorldObjects.addToSet(mTopWall);
    
   //     var mBotWall = new Wall(this.kWallTexture);
    //    mBotWall.getXform().setSize(100,100);
    //    mBotWall.getXform().setPosition(100 * i,-40);    
    //    this.mWorldObjects.addToSet(mBotWall);
   // }
    
    //First Set of doors
    //for (var i = 0; i < 20; i++){
    //    var mDoor = new MovingDoor(this.kMinionSprite);
    //    mDoor.setXCenter(300 + (10*i));
    //    mDoor.setInitialDelay(30 + (20*i));
   //     this.mDoorObjects.addToSet(mDoor);
   // }
    
    //Breakable wall
   // for (var i = 0; i < 15; i++){
   //      this.mBreakableSet.addToSet(
   //              new BreakableWall(this.kMinionSprite, vec2.fromValues(100, 5 +(i*5))));
   //      this.mBreakableSet.addToSet(
    //             new BreakableWall(this.kMinionSprite, vec2.fromValues(105, 5 +(i*5))));
   //      this.mBreakableSet.addToSet(
    //             new BreakableWall(this.kMinionSprite, vec2.fromValues(110, 5 +(i*5))));
         
    //     this.mBreakableSet.addToSet(
    //             new BreakableWall(this.kMinionSprite, vec2.fromValues(150, 5 +(i*5))));
    //     this.mBreakableSet.addToSet(
    //             new BreakableWall(this.kMinionSprite, vec2.fromValues(155, 5 +(i*5))));
    //     this.mBreakableSet.addToSet(
    //             new BreakableWall(this.kMinionSprite, vec2.fromValues(160, 5 +(i*5))));
         
    //     this.mBreakableSet.addToSet(
    //             new BreakableWall(this.kMinionSprite, vec2.fromValues(200, 5 +(i*5))));
    //     this.mBreakableSet.addToSet(
    //             new BreakableWall(this.kMinionSprite, vec2.fromValues(205, 5 +(i*5))));
    //     this.mBreakableSet.addToSet(
    //             new BreakableWall(this.kMinionSprite, vec2.fromValues(210, 5 +(i*5))));
    //}
   
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

Level0.prototype.spawnWall = function (x, y){
    var mTopWall = new Wall(this.kWallTexture);
        mTopWall.getXform().setSize(10,10);
        mTopWall.getXform().setPosition(x, y);    
        this.mWorldObjects.addToSet(mTopWall);
};

Level0.prototype.spawnDestructWall = function (x, y){
    this.mBreakableSet.addToSet(
            new BreakableWall(this.kMinionSprite, vec2.fromValues(x, y)));
};

Level0.prototype.spawnSmallDoor = function (x, y) {
        var mDoor = new MovingDoor(this.kMinionSprite);
        mDoor.setXCenter(x);
        mDoor.setYCenter(y);
        mDoor.setHeight(40);
        this.mDoorObjects.addToSet(mDoor);
};

Level0.prototype.spawnLargeDoor = function (x, y) {
        var mDoor = new MovingDoor(this.kMinionSprite);
        mDoor.setXCenter(x);
        mDoor.setYCenter(y);
        this.mDoorObjects.addToSet(mDoor);
};

