/*
 * File: ParticleLevel.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
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
    
    // The camera to view the scene
    this.mCamera = null;
    this.LevelSelect = null;
    this.UIHealth = null;
    this.UIEnergy = null;
    this.mBg = null;
    this.mWorldObjects = null;
    this.mDoorObjects = null;
    this.mHero = null;
    this.mPanSpeed = .3;
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
};

Level0.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kHealthBar);
    gEngine.Textures.unloadTexture(this.kEnergyBar);
    gEngine.Textures.unloadTexture(this.kBG);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    
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
        vec2.fromValues(50, 40), // position of the camera
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
    
    //World
    this.mWorldObjects = new GameObjectSet();
    this.mDoorObjects = new GameObjectSet();
    this.worldSpawn();
    
    //Hero (ship)
    this.mHero = new Hero(this.kMinionSprite);    
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
    this.mHero.draw(this.mCamera);
    this.mDoorObjects.draw(this.mCamera);
    this.mWorldObjects.draw(this.mCamera); 
};

Level0.prototype.update = function () {
    //Update Objects and UI
    this.UIHealth.update();
    this.UIEnergy.update();
    this.mHero.update();
    this.mDoorObjects.update();
    this.mCamera.update();
    
    //Call level pan
    this.panLevel();
    
    //GameOver -currently just reload MyGame
    if (this.UIHealth.getCurrentHP() === 0)
        this.restart();
    
    //Collision detection
    this.detectCollide();
    
    //Global slow
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)){
        mGlobalSpeed = 0.5;
        this.energyDown(0.2);
    }
    if(gEngine.Input.isKeyReleased(gEngine.Input.keys.Space))
        mGlobalSpeed = 1.0;
    
    //Testing functions to be removed later
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up))
        this.hpUp();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down))
        this.hpDown();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right))
        this.energyUp();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left))
        this.energyDown();
    var mCamX = this.mCamera.mouseWCX();
    var mCamY = this.mCamera.mouseWCY();
    var p = vec2.fromValues(mCamX, mCamY);
    //console.log(p);
};

Level0.prototype.detectCollide = function() {
  var h = [];  
  for (var i = 0; i < this.mWorldObjects.size(); i++){
        if(!this.mHero.isInvunerable()){
           if (this.mHero.pixelTouches(this.mWorldObjects.getObjectAt(i), h)){
                this.hpDown(34);
                this.resetPosition();
                this.mHero.setInvunerable(180);
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
                }
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
};

Level0.prototype.nextLevel = function(){
    this.LevelSelect="Level1";
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
    //Walls
    var mTopWall = new Wall(this.kWallTexture);
    mTopWall.getXform().setSize(100,100);
    mTopWall.getXform().setPosition(50,120);    
    this.mWorldObjects.addToSet(mTopWall);
    
    mTopWall = new Wall(this.kWallTexture);
    mTopWall.getXform().setSize(100,100);
    mTopWall.getXform().setPosition(150,120);    
    this.mWorldObjects.addToSet(mTopWall);
    
    mTopWall = new Wall(this.kWallTexture);
    mTopWall.getXform().setSize(100,100);
    mTopWall.getXform().setPosition(250,120);    
    this.mWorldObjects.addToSet(mTopWall);
    
    var mBotWall = new Wall(this.kWallTexture);
    mBotWall.getXform().setSize(100,100);
    mBotWall.getXform().setPosition(50,-40);    
    this.mWorldObjects.addToSet(mBotWall);
    
    mBotWall = new Wall(this.kWallTexture);
    mBotWall.getXform().setSize(100,100);
    mBotWall.getXform().setPosition(150,-40);    
    this.mWorldObjects.addToSet(mBotWall);
    
    mBotWall = new Wall(this.kWallTexture);
    mBotWall.getXform().setSize(100,100);
    mBotWall.getXform().setPosition(250,-40);    
    this.mWorldObjects.addToSet(mBotWall);
    
    
    //First Set of doors
    var mDoor = new MovingDoor(this.kMinionSprite);
    mDoor.setXCenter(100);
    mDoor.setInitialDelay(30);
    this.mDoorObjects.addToSet(mDoor);
    mDoor = new MovingDoor(this.kMinionSprite);
    mDoor.setXCenter(110);
    mDoor.setInitialDelay(50);
    this.mDoorObjects.addToSet(mDoor);
    mDoor = new MovingDoor(this.kMinionSprite);
    mDoor.setXCenter(120);
    mDoor.setInitialDelay(70);
    this.mDoorObjects.addToSet(mDoor);
    mDoor = new MovingDoor(this.kMinionSprite);
    mDoor.setXCenter(130);
    mDoor.setInitialDelay(90);
    this.mDoorObjects.addToSet(mDoor);
    mDoor = new MovingDoor(this.kMinionSprite);
    mDoor.setXCenter(140);
    mDoor.setInitialDelay(110);
    this.mDoorObjects.addToSet(mDoor);
};