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

function Level1() {
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
    this.kBreakableSprite = "assets/OpenSource/BreakableWall.png";
    this.kFallingRock = "assets/OpenSource/boulder2.png";
    this.kNinjaStar = "assets/OpenSource/stockphoto_NinjaStar.png";
    
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
    this.mRigidSet = null;
    
    //Testing 2d array for world generation
    this.mWorldArray = [];
    this.LevelCounter = 0;
}
gEngine.Core.inheritPrototype(Level1, Scene);


Level1.prototype.loadScene = function () {
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
    gEngine.Textures.loadTexture(this.kBreakableSprite);
    gEngine.Textures.loadTexture(this.kFallingRock);
    gEngine.Textures.loadTexture(this.kNinjaStar);
};

Level1.prototype.unloadScene = function () {
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
    gEngine.Textures.unloadTexture(this.kBreakableSprite);
    gEngine.Textures.unloadTexture(this.kFallingRock);
    gEngine.Textures.unloadTexture(this.kNinjaStar);
    
    if(this.LevelSelect==="Level1"){
        gEngine.Core.startScene(new Level1());
    }
    if(this.LevelSelect==="Level2"){
        gEngine.Core.startScene(new Level2());
    }
    if(this.LevelSelect==="Gameover"){
        gEngine.Core.startScene(new GameOver());
    }
    if (this.LevelSelect==="MyGame"){
        gEngine.Core.startScene(new MyGame());
    }
};

Level1.prototype.initialize = function () {
    //UI
    this.UIHealth = new UIHealthBar(this.kHealthBar,[175,675],[300,20],0);
    this.UIEnergy = new UIHealthBar(this.kEnergyBar,[175,650],[300,20],0);

    
    //Hero/World/Camera/Background will be recreated within each new spawn world call
    //Spawn world 1
    this.SpawnWorld1();
    this.LevelCounter++;
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level1.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();
    this.mBg.draw(this.mCamera);
    this.UIHealth.draw(this.mCamera);
    this.UIEnergy.draw(this.mCamera);
    this.mMissileSet.draw(this.mCamera);
    this.mTargetSet.draw(this.mCamera);    
    this.mHero.draw(this.mCamera);
    this.mDoorObjects.draw(this.mCamera);
    this.mBreakableSet.draw(this.mCamera);
    this.mWorldObjects.draw(this.mCamera); 
    this.mReticle.draw(this.mCamera);
};

Level1.prototype.update = function () {
    //Update Objects and UI
    this.UIHealth.update();
    this.UIEnergy.update();
    this.mHero.update(this.mCamera);
    this.mDoorObjects.update();
    this.mCamera.update();
    this.mReticle.update(this.mCamera);
    this.mMissileSet.update();
    this.mBreakableSet.update();
    this.mWorldObjects.update();
    this.panLevel();
    this.detectCollide();
    
    //GameOver -currently just reload MyGame
    if (this.UIHealth.getCurrentHP() === 0)
        this.gameOver();
    
    //Global slow
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
        mGlobalSpeed = 0.5;
        this.UIEnergy.incCurrentHP(-.2);
    }
    if(gEngine.Input.isKeyReleased(gEngine.Input.keys.Space))
        mGlobalSpeed = 1.0;
   
    //missle spawn    
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        this.missileSpawn(this.mHero.getXform().getPosition());      
    }
    
    //Physics and particles
    gEngine.Physics.processCollision(this.mBreakableSet, this.mCollisionInfos);
    //gEngine.ParticleSystem.collideWithRigidSet(this.mBreakableSet, this.mRigidSet);
    
    
    //console.log(this.mHero.getXform().getPosition());
    //Detect if person is ready to spawn next world
    if (this.mHero.getXform().getXPos() > 450){
        if (this.LevelCounter === 1)
        {   
            console.log("Spawned World 2");
            this.SpawnWorld2();
            this.LevelCounter++;
        }
        else if (this.LevelCounter === 2)
        {
            console.log("Spawned World 3");
            this.SpawnWorld3();
            this.LevelCounter++;
        }
        else if (this.LevelCounter === 3)
        {
            console.log("Spawned World 4");
            this.SpawnWorld4();
            this.LevelCounter++;
        }
        else if (this.LevelCounter === 4){
            console.log("sspawned world 5");
            this.SpawnWorld5();
            this.LevelCounter++;
        }
        else if (this.LevelCounter === 5){
            console.log("Spawn new scene");
            this.nextLevel();
        }
        
    }
    
    
    //For testing purposes
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.N)) 
        this.mHero.getXform().incXPosBy(450);  
    
};

Level1.prototype.detectCollide = function() {
  var h = [];  
  for (var i = 0; i < this.mWorldObjects.size(); i++){
        if(!this.mHero.isInvunerable()){
           if (this.mHero.pixelTouches(this.mWorldObjects.getObjectAt(i), h)){
                this.UIHealth.incCurrentHP(-10);
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
                    this.UIHealth.incCurrentHP(-10); 
                    this.mHero.setInvunerable(180);
                    break;
                }
            }
        }
  }
  for (var i = 0; i < this.mBreakableSet.size(); i++){
      if(!this.mHero.isInvunerable()){
          var wall = this.mBreakableSet.getObjectAt(i);
          if (wall.IsDead() === true)
          {             
              this.mBreakableSet.removeFromSet(wall);
              break;
          }
          if (this.mHero.pixelTouches(wall,h)){
              this.UIHealth.incCurrentHP(-10);
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
      
        if(tDiff < 1) {
            this.mMissileSet.removeFromSet(missile);
            this.mTargetSet.removeFromSet(target);
        }
        
        for(var j = 0; j < this.mBreakableSet.size(); ++j) {
            var wall = this.mBreakableSet.getObjectAt(j);
            if(missile.pixelTouches(wall, h)) {
                console.log("missle touched breakable");
                wall.MarkDead();
                this.mMissileSet.removeFromSet(missile);
                this.mTargetSet.removeFromSet(target);
            }          
        }        
    }   
};

Level1.prototype.resetPosition = function() {
  var mCamWC = this.mCamera.getWCCenter();
  this.mHero.getXform().setPosition(mCamWC[0], mCamWC[1]);
  this.mHero.setInvunerable(180);
};

Level1.prototype.panLevel = function () {
    //Camera
    this.mCamera.panBy((this.mPanSpeed * 10) * mGlobalSpeed, 0.0);
    //Hero
    this.mHero.getXform().incXPosBy(this.mPanSpeed * mGlobalSpeed);
    //Background
    this.mBg.getXform().incXPosBy(this.mPanSpeed * mGlobalSpeed);
    
    for (var i = 0; i < this.mMissileSet.size(); i++){
       this.mMissileSet.getObjectAt(i).getXform().incXPosBy(this.mPanSpeed * mGlobalSpeed); 
    }
    
};

Level1.prototype.nextLevel = function(){
    this.LevelSelect="Level2";
    gEngine.GameLoop.stop();
};

Level1.prototype.gameOver = function(){
    this.LevelSelect="Level1";
    gEngine.GameLoop.stop();
};

Level1.prototype.restart = function(){
  this.LevelSelect="GameOver";
  gEngine.GameLoop.stop();
};
