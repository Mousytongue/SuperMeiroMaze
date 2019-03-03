/*
 * File: ParticleLevel.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2, Reticle,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
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
    this.bg = null;
    this.mWorldObjects = null;
    this.mHero = null;
    this.mReticle = null;
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
    else if(this.LevelSelect==="Gameover"){
        gEngine.Core.startScene(new GameOver());
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
    this.bg = new TextureRenderable(this.kBG);
    this.bg.getXform().setSize(200,160);
    this.bg.getXform().setPosition(30,20);
    
    //World
    this.mWorldObjects = new GameObjectSet();
    this.worldSpawn();
    
    //Hero (ship)
    this.mHero = new Hero(this.kMinionSprite);
    
    //Reticle
    this.mReticle = new Reticle(this.kMinionSprite);
    //console.log(this.mReticle);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level0.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();
    this.bg.draw(this.mCamera);
    this.UIHealth.draw(this.mCamera);
    this.UIEnergy.draw(this.mCamera);
    
    // console.log(this.mReticle);`    `
    this.mHero.draw(this.mCamera);
    this.mWorldObjects.draw(this.mCamera);
    this.mReticle.draw(this.mCamera);
};

Level0.prototype.update = function () {
    this.UIHealth.update();
    this.UIEnergy.update();
    this.mHero.update();
    this.mReticle.update();
    
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
    if (mCamY > 110)
            mCamY = 110;
    if (mCamY < -35)
        mCamY = -35;
    var p = vec2.fromValues(mCamX, mCamY);
    this.mReticle.setDirection(p);
    console.log(this.mReticle.getXform().getPosition());
};

Level0.prototype.nextLevel = function(){
    this.LevelSelect="Level1";
    gEngine.GameLoop.stop();
};

Level0.prototype.gameOver = function(){
    this.LevelSelect="Gameover";
    gEngine.GameLoop.stop();
};

Level0.prototype.hpUp = function (){
    this.UIHealth.incCurrentHP(10);  
};

Level0.prototype.hpDown = function (){
    this.UIHealth.incCurrentHP(-10);  
};

Level0.prototype.energyUp = function (){
    this.UIEnergy.incCurrentHP(10);  
};

Level0.prototype.energyDown = function (){
    this.UIEnergy.incCurrentHP(-10);  
};

Level0.prototype.worldSpawn = function () {
    var mTopWall = new TextureRenderable(this.kWallTexture);
    mTopWall.setColor([1,1,1,0]);
    mTopWall.getXform().setSize(100,100);
    mTopWall.getXform().setPosition(50,120);    
    this.mWorldObjects.addToSet(mTopWall);
    
    var mBotWall = new TextureRenderable(this.kWallTexture);
    mBotWall.setColor([1,1,1,0]);
    mBotWall.getXform().setSize(100,100);
    mBotWall.getXform().setPosition(50,-40);    
    this.mWorldObjects.addToSet(mBotWall);
};