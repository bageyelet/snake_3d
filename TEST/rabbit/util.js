"use strict";

// CONSTANTS
var RABBIT_BODY         = 0;
var RABBIT_LEG_UP_L     = 1;
var RABBIT_LEG_DOWN_L   = 2;
var RABBIT_LEG_UP_R     = 3;
var RABBIT_LEG_DOWN_R   = 4;
var RABBIT_ARM_L        = 5;
var RABBIT_ARM_R        = 6;
var RABBIT_HEAD         = 7;
var RABBIT_EAR_L        = 8;
var RABBIT_EAR_R        = 9;
var RABBIT_NOSE         = 10;

var scale = 0.4;

var rabbit_body_dim = {};
rabbit_body_dim.x = scale*0.5; rabbit_body_dim.y = scale*0.5; rabbit_body_dim.z = scale*0.8;

var rabbit_arm_dim = {};
rabbit_arm_dim.x = scale*0.15; rabbit_arm_dim.y = scale*0.5; rabbit_arm_dim.z = scale*0.15;

var rabbit_leg_up_dim = {};
rabbit_leg_up_dim.x = scale*0.2; rabbit_leg_up_dim.y = scale*0.45; rabbit_leg_up_dim.z = scale*0.45;

var rabbit_leg_down_dim = {};
rabbit_leg_down_dim.x = scale*0.2; rabbit_leg_down_dim.y = scale*0.05; rabbit_leg_down_dim.z = scale*0.45;

var rabbit_head_dim = {};
rabbit_head_dim.x = scale*0.4; rabbit_head_dim.y = scale*0.4; rabbit_head_dim.z = scale*0.4;

var rabbit_ear_dim = {};
rabbit_ear_dim.x = scale*0.15; rabbit_ear_dim.y = scale*0.35; rabbit_ear_dim.z = scale*0.1;

var rabbit_nose_dim = {};
rabbit_nose_dim.x = scale*0.05; rabbit_nose_dim.y = scale*0.05; rabbit_nose_dim.z = scale*0.05; 

// UTIL FUNCTIONS
function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

function linear_interpolation(v1, min1, max1, min2, max2) {
    var v2;
    v2 = v1 * ((max2-min2) / (max1 - min1));
    return v2;
}
