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

function ParticleLevel() {
    this.kUIButton = "assets/UI/button.png";
    this.kUIBar = "assets/UI/healthbar.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.LevelSelect = null;
    this.UIHealth = null;
    this.UIEnergy = null;
}
gEngine.Core.inheritPrototype(ParticleLevel, Scene);


ParticleLevel.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
    gEngine.Textures.loadTexture(this.kUIBar);
};

ParticleLevel.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    gEngine.Textures.unloadTexture(this.kUIBar);
    
    if(this.LevelSelect==="Level1"){
        gEngine.Core.startScene(new Level1());
    }
    else if(this.LevelSelect==="Gameover"){
        gEngine.Core.startScene(new GameOver());
    }
};

ParticleLevel.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
ParticleLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();


};

ParticleLevel.prototype.update = function () {

};

ParticleLevel.prototype.nextLevel = function(){
    this.LevelSelect="Level1";
    gEngine.GameLoop.stop();
};

ParticleLevel.prototype.gameOver = function(){
    this.LevelSelect="Gameover";
    gEngine.GameLoop.stop();
};
