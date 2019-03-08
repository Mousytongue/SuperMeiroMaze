/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
var mGlobalSpeed = null;
var mScreenX = 1300;
var mScreenY = 700;
function MyGame() {
    this.kUIButton = "assets/UI/button.png";
    
    // The camera to view the scene
    this.mCamera = null;
    this.StartGameButton = null;
    this.LevelSelectButton = null;
    this.HighScoresButton = null;
    this.LevelSelect = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kUIButton);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kUIButton);
    if(this.LevelSelect==="Level0"){
        gEngine.Core.startScene(new Level0());
    }
    //else if(this.LevelSelect==="LevelSelect"){
    //    gEngine.Core.startScene(new RigidShapeDemo());
    //}
    //else if(this.LevelSelect==="HighScores"){
    //    gEngine.Core.startScene(new UIDemo());
    //}
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 40), // position of the camera
        200,                     // width of camera
        [0, 0, mScreenX, mScreenY]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    this.StartGameButton = new UIButton(this.kUIButton,this.StartGameSelect,this,[400,400],[600,100],"Start Game",8,[1,1,1,1],[0,0,0,1]);
    //this.LevelSelectButton = new UIButton(this.kUIButton,this.LevelSelect,this,[400,300],[750,100],"Level Select (N/A)",8,[1,1,1,1],[0,0,0,1]);
    //this.HighScoresButton =  new UIButton(this.kUIButton,this.HighScoresSelect,this,[400,200],[750,100],"High Scores (N/A)",8,[1,1,1,1],[0,0,0,1]);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    
    this.mCamera.setupViewProjection();
    this.StartGameButton.draw(this.mCamera);
    //this.LevelSelectButton.draw(this.mCamera);
    //this.HighScoresButton.draw(this.mCamera);
    //this.UIText.draw(this.mCamera);
};

MyGame.prototype.update = function () {
    this.StartGameButton.update();
    //this.LevelSelectButton.update();
    //this.HighScoresButton.update();
};

MyGame.prototype.StartGameSelect = function(){
    this.LevelSelect="Level0";
    gEngine.GameLoop.stop();
};

MyGame.prototype.LevelSelect = function(){
    //this.LevelSelect="LevelSelect";
    //gEngine.GameLoop.stop();
};

MyGame.prototype.HighScoresSelect= function(){
   // this.LevelSelect="HighScores";
   // gEngine.GameLoop.stop();
};