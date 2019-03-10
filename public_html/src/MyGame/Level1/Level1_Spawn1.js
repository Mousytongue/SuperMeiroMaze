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

Level1.prototype.SpawnWorld1 = function () {
    this.Spawn1Init();
                        //Start                                //450 units 
    var Row0 = "S111111111111111111111111111111111111111111111E";
    var Row1 = "S000000111000000000000200000011100000020000000E";
    var Row2 = "S000000011100000000000200000011100000020000000E";
    var Row3 = "S000000001110000000001_100000111000001_1000000E";
    var Row4 = "S000000000111000000001110000011100000111000000E";
    var Row5 = "S000000000011100000001110000011100000111000000E";
    var Row6 = "S000000000001110000001110000011100000111000000E";
    var Row7 = "S000000000000111000001110000011100000111000000E";
    var Row8 = "S000000000000000000001110000002000000111000000E";
    var Row9 = "S000000000000000000001110000002000000111000000E";
    var Ro10 = "S11111111111111111111111111111_111111111111111E"; 
 
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

Level1.prototype.Spawn1Init = function () {
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
    
    this.spawnHelpText();
};

Level1.prototype.spawnHelpText = function (){
    this.mTextSet = new GameObjectSet();
    
    //this.UIText1 = new UIText("W",[400,600],8,1,0,[1,1,1,1]);
    this.mText1 = new FontRenderable("W");
    this.mText1.setFont(this.kFont);
    this._initText(this.mText1, 25, 85, [1, 1, 1, 1], 4);
    
    //this.UIText2 = new UIText("A S D  Movement",[400,600],8,1,0,[1,1,1,1]);
    this.mText2 = new FontRenderable("A S D  Movement");
    this.mText2.setFont(this.kFont);
    this._initText(this.mText2, 20, 80, [1, 1, 1, 1], 4);
    
    //this.UIText3 = new UIText("Left Mouse Button",[400,600],8,1,0,[1,1,1,1]);
    this.mText3 = new FontRenderable("Left Mouse Button - Aim & Shoot");
    this.mText3.setFont(this.kFont);
    this._initText(this.mText3, 120, 80, [1, 1, 1, 1], 4);   
    
    //this.UIText5 = new UIText("Hold SpaceBar for Slowed Time",[400,600],8,1,0,[1,1,1,1]);
    this.mText5 = new FontRenderable("Hold Spacebar to Slow");
    this.mText5.setFont(this.kFont);
    this._initText(this.mText5, 240, 15, [1, 1, 1, 1], 4);
    

    
    this.mTextSet.addToSet(this.mText1);
    this.mTextSet.addToSet(this.mText2);
    this.mTextSet.addToSet(this.mText3);
    this.mTextSet.addToSet(this.mText5); 
};

Level1.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};