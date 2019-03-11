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

function Level2() {
    this.kUIButton = "assets/UI/button.png";
    this.kHealthBar = "assets/UI/healthbar.png";
    this.kEnergyBar = "assets/UI/energybar.png";
    this.kBG = "assets/OpenSource/cave.png";
    this.kWallTexture = "assets/RigidShape/Rock.png";
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
    this.mAllFire = null;
    
    //Testing 2d array for world generation
    this.mWorldArray = [];
    this.LevelCounter = 0;
}
gEngine.Core.inheritPrototype(Level2, Scene);


Level2.prototype.loadScene = function () {
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

Level2.prototype.unloadScene = function () {
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
    if (this.LevelSelect==="YouWin"){
        gEngine.Core.startScene(new MyGame());
    }
    if (this.LevelSelect==="MyGame"){
        gEngine.Core.startScene(new MyGame());
    }
};

Level2.prototype.initialize = function () {
    //UI
    this.UIHealth1 = new UIHealthBar(this.kHealthBar,[30,670],[20,20],0);
    this.UIHealth2 = new UIHealthBar(this.kHealthBar,[55,670],[20,20],0);
    this.UIHealth3 = new UIHealthBar(this.kHealthBar,[80,670],[20,20],0);
    this.UIHealth4 = new UIHealthBar(this.kHealthBar,[105,670],[20,20],0);
    this.UIHealth5 = new UIHealthBar(this.kHealthBar,[130,670],[20,20],0);
    this.UIHealth6 = new UIHealthBar(this.kHealthBar,[155,670],[20,20],0);
    this.UIHealth7 = new UIHealthBar(this.kHealthBar,[180,670],[20,20],0);
    this.UIHealth8 = new UIHealthBar(this.kHealthBar,[205,670],[20,20],0);
    this.UIHealth9 = new UIHealthBar(this.kHealthBar,[230,670],[20,20],0);
    this.UIHealth10 = new UIHealthBar(this.kHealthBar,[255,670],[20,20],0);
    this.UIEnergy = new UIHealthBar(this.kEnergyBar,[120,645],[200,20],0);
    this.UITextLevel = new UIText("World 2-1",[1200,700],3,1,0,[0,1,1,1]);
    this.UITextLives = new UIText("Lives", [40, 700], 2,1,0,[0,1,1,1]);
    this.UITextEnergy = new UIText("Energy", [45,635], 2,1,0,[0,1,1,1]);
    
    //Hero/World/Camera/Background will be recreated within each new spawn world call
    //Spawn world 1
    this.SpawnWorld1();
    this.LevelCounter++;
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level2.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();
    this.mBg.draw(this.mCamera);
    this.UIHealth1.draw(this.mCamera);
    this.UIHealth2.draw(this.mCamera);
    this.UIHealth3.draw(this.mCamera);
    this.UIHealth4.draw(this.mCamera);
    this.UIHealth5.draw(this.mCamera);
    this.UIHealth6.draw(this.mCamera);
    this.UIHealth7.draw(this.mCamera);
    this.UIHealth8.draw(this.mCamera);
    this.UIHealth9.draw(this.mCamera);
    this.UIHealth10.draw(this.mCamera);
    this.UIEnergy.draw(this.mCamera);
    this.mMissileSet.draw(this.mCamera);
    this.mTargetSet.draw(this.mCamera);    
    this.mHero.draw(this.mCamera);
    this.mDoorObjects.draw(this.mCamera);
    this.mBreakableSet.draw(this.mCamera);
    this.mWorldObjects.draw(this.mCamera); 
    this.mReticle.draw(this.mCamera);
    this.UITextLevel.draw(this.mCamera);
    this.UITextLives.draw(this.mCamera);
    this.UITextEnergy.draw(this.mCamera);
    this.mAllFire.draw(this.mCamera);
};

Level2.prototype.update = function () {
    
    //Physics
    gEngine.Physics.processCollision(this.mBreakableSet, this.mCollisionInfos);
    gEngine.ParticleSystem.update(this.mAllFire);
    //gEngine.ParticleSystem.collideWithRigidSet(this.mBreakableSet, this.mAllParticles);
    //Update Objects and UI
    this.UIHealth1.update();
    this.UIHealth2.update();
    this.UIHealth3.update();
    this.UIHealth4.update();
    this.UIHealth5.update();
    this.UIHealth6.update();
    this.UIHealth7.update();
    this.UIHealth8.update();
    this.UIHealth9.update();
    this.UIHealth10.update();
    this.UIEnergy.update();
    if (!this.mIsPaused){       
        this.mHero.update(this.mCamera);
        if (this.mIsSlowed && this.mUpdateThrot === 2){
            this.mUpdateThrot = 0;
            this.mDoorObjects.update();
            this.mCamera.update();
            this.mReticle.update(this.mCamera);
            this.mMissileSet.update();
            this.mBreakableSet.update();
            this.mWorldObjects.update();
            this.panLevel();
            this.detectCollide();
            this.detectEnd();
            this.detectSlow();
        }
        else if (!this.mIsSlowed)
        {
            this.mUpdateThrot = 0;
            this.mDoorObjects.update();
            this.mCamera.update();
            this.mReticle.update(this.mCamera);
            this.mMissileSet.update();
            this.mBreakableSet.update();
            this.mWorldObjects.update();
            this.panLevel();
            this.detectCollide();
            this.detectEnd();
            this.detectSlow();
        }
        this.mUpdateThrot++;
    }
    
    //missle spawn    
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        this.missileSpawn(this.mHero.getXform().getPosition());      
    }
    //Esc menu pause
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Esc)){
        if (this.mIsPaused)
        {
            this.mIsPaused = false;
        }
        else
        {
            this.mIsPaused = true;
        }
    }     

    //For testing purposes
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.N)) 
        this.mHero.getXform().incXPosBy(450);  
    
};

Level2.prototype.detectSlow = function () {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space) && this.UIEnergy.getCurrentHP() !== 0){
        //mGlobalSpeed = 0.5;
        this.mIsSlowed = true;
        this.UIEnergy.incCurrentHP(-.5);
    }
    if(!gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
        //mGlobalSpeed = 1.0;
        this.mIsSlowed = false;
        this.UIEnergy.incCurrentHP(.1);
    }
};

Level2.prototype.detectEnd = function () {
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
            console.log("Spawned World 5");
            this.SpawnWorld5();
            this.LevelCounter++;
        }
        else if (this.LevelCounter === 5){
            console.log("Spawn new scene");
            this.nextLevel();
        }
        
    }
};

Level2.prototype.detectCollide = function() {
  var h = [];  
  for (var i = 0; i < this.mWorldObjects.size(); i++){
           if (this.mHero.pixelTouches(this.mWorldObjects.getObjectAt(i), h)){
                this.restart();
                //this.mHero.setInvunerable(180);
                break;
            }
  }
  for (var i = 0; i < this.mDoorObjects.size(); i++){
            var mCurrentSet = this.mDoorObjects.getObjectAt(i);
            var mTopSet = mCurrentSet.getTopSet();
            var mBotSet = mCurrentSet.getBotSet();
            for (var j = 0; j < mTopSet.length; j++){
                if (this.mHero.pixelTouches(mTopSet[j], h) || this.mHero.pixelTouches(mBotSet[j], h)){
                    this.restart();
                    //this.mHero.setInvunerable(180);
                    break;
                }
            }
  }
  for (var i = 0; i < this.mBreakableSet.size(); i++){
          var wall = this.mBreakableSet.getObjectAt(i);
          if (wall.IsDead() === true)
          {             
              this.mBreakableSet.removeFromSet(wall);
              break;
          }
          if (this.mHero.pixelTouches(wall,h)){
              this.restart();
              //this.mHero.setInvunerable(180);
              break;
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
      
        if(tDiff < 5) {
            this.mMissileSet.removeFromSet(missile);
            this.mTargetSet.removeFromSet(target);
            missile.markDead();
        }
        
        for(var j = 0; j < this.mBreakableSet.size(); ++j) {
            var wall = this.mBreakableSet.getObjectAt(j);
            if (wall.IsBreakable()){
              if(missile.pixelTouches(wall, h)) {               
                 wall.MarkDead();
                 this.mMissileSet.removeFromSet(missile);
                 this.mTargetSet.removeFromSet(target);
                 this.mCamera.shake(1, 1, 20,30);
                 missile.markDead();
              } 
            }
        }        
    } 
};

Level2.prototype.panLevel = function () {
    //Camera
    this.mCamera.panBy((this.mPanSpeed * 10), 0.0);
    //Hero
    this.mHero.getXform().incXPosBy(this.mPanSpeed);
    //Background
    this.mBg.getXform().incXPosBy(this.mPanSpeed);
    
    for (var i = 0; i < this.mMissileSet.size(); i++){
       this.mMissileSet.getObjectAt(i).getXform().incXPosBy(this.mPanSpeed); 
    }
    
};

Level2.prototype.nextLevel = function(){
    this.LevelSelect="MyGame";
    gEngine.GameLoop.stop();
};

Level2.prototype.restart = function(){
  if (this.UIHealth2.getCurrentHP() === 0){
      this.LevelSelect="MyGame";
      gEngine.GameLoop.stop();
  }
  else if (this.UIHealth3.getCurrentHP() === 0){
      this.UIHealth2.setCurrentHP(0);
      this.UIHealth2.setVisible(false);
      this.restartLevel();
  }
  else if (this.UIHealth4.getCurrentHP() === 0)
  {
      this.UIHealth3.setCurrentHP(0);
      this.UIHealth3.setVisible(false);
      this.restartLevel();
  }
  else if (this.UIHealth5.getCurrentHP() === 0)
  {
      this.UIHealth4.setCurrentHP(0);
      this.UIHealth4.setVisible(false);
      this.restartLevel();
  }
  else if (this.UIHealth6.getCurrentHP() === 0)
  {
      this.UIHealth5.setCurrentHP(0);
      this.UIHealth5.setVisible(false);
      this.restartLevel();
  }
  else if (this.UIHealth7.getCurrentHP() === 0)
  {
      this.UIHealth6.setCurrentHP(0);
      this.UIHealth6.setVisible(false);
      this.restartLevel();
  }
  else if (this.UIHealth8.getCurrentHP() === 0)
  {
      this.UIHealth7.setCurrentHP(0);
      this.UIHealth7.setVisible(false);
      this.restartLevel();
  }
  else if (this.UIHealth9.getCurrentHP() === 0)
  {
      this.UIHealth8.setCurrentHP(0);
      this.UIHealth8.setVisible(false);
      this.restartLevel();
  }
  else if (this.UIHealth10.getCurrentHP() === 0)
  {
      this.UIHealth9.setCurrentHP(0);
      this.UIHealth9.setVisible(false);
      this.restartLevel();
  }
  else
  {
      this.UIHealth10.setCurrentHP(0);
      this.UIHealth10.setVisible(false);
      this.restartLevel();
  }
  
};

Level2.prototype.restartLevel = function (){
    if (this.LevelCounter === 1){
        this.SpawnWorld1();
    }
    if (this.LevelCounter === 2){
        this.SpawnWorld2();
    }
    if (this.LevelCounter === 3){
        this.SpawnWorld3();
    }
    if (this.LevelCounter === 4){
        this.SpawnWorld4();
    }
    if (this.LevelCounter ===5){
        this.SpawnWorld5();
    }
};