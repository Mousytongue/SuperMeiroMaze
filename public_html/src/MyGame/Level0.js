/*
 * File: ParticleLevel.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Level0() {
    this.kUIButton = "assets/UI/button.png";
    this.kUIBar = "assets/UI/healthbar.png";
    this.kBG = "assets/DyeAssets/bg.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.LevelSelect = null;
    this.UIHealth = null;
    this.UIEnergy = null;
    this.bg = null;
}
gEngine.Core.inheritPrototype(Level0, Scene);


Level0.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kUIBar);
    gEngine.Textures.loadTexture(this.kBG);
};

Level0.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kUIBar);
    gEngine.Textures.unloadTexture(this.kBG);
    
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
    this.UIHealth = new UIHealthBar(this.kUIBar,[250,500],[380,20],0);
    this.UIEnergy = new UIHealthBar(this.kUIBar,[250,550],[380,20],0);
    
    //Background
    this.bg = new TextureRenderable(this.kBG);
    this.bg.getXform().setSize(200,160);
    this.bg.getXform().setPosition(30,20);

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
};

Level0.prototype.update = function () {
    this.UIHealth.update();
    this.UIEnergy.update();
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

Level0.prototype.hpUp = function (){
    this.UIHealth.incCurrentHP(-10);  
};

Level0.prototype.energyUp = function (){
    this.UIEnergy.incCurrentHP(10);  
};

Level0.prototype.energyUp = function (){
    this.UIEnergy.incCurrentHP(-10);  
};