/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

//const TARGET_WIDTH = 4;
//const TARGET_HEIGHT = 4;

function BreakableWall(spriteTexture, pos) {

    this.mBreakableWall = new SpriteRenderable(spriteTexture);
    this.mBreakableWall.setColor([1, 1, 1, 0]);
    this.mBreakableWall.getXform().setPosition(pos[0], pos[1]);
    this.mBreakableWall.getXform().setSize(10,10);
    this.mBreakableWall.setElementPixelPositions(120, 300, 0, 180);
    GameObject.call(this, this.mBreakableWall);
    
//    this.mMoveSpeed = 1;
    this.mX = 8;           //Width
    this.mY = 8;          //Height
//    this.mShakePosition = new ShakePosition(0, 0, 0, 0);
}
gEngine.Core.inheritPrototype(BreakableWall, GameObject);

BreakableWall.prototype.update = function () {

};
