"use strict";

// colors
var RED         = vec4( 1.0, 0.0, 0.0, 1.0 );
var BLUE        = vec4( 0.0, 0.0, 1.0, 1.0 );
var GREEN       = vec4( 0.0, 1.0, 0.0, 1.0 );
var LIGHT_GREY  = vec4( 0.4, 0.4, 0.4, 1.0 );
var PURPLE      = vec4( 0.5, 0.0, 0.5, 1.0 );

// objects
var PIRAMID         = 0;
var PARALLELEPIPED  = 1;
var VOID            = 2;
var SNAKEHEAD       = 3;
var SNAKEBODY       = 4;
var SNAKETAIL       = 5;
var SQUARE          = 6;

// animations
var ROTATION_LEFT       = 50;
var ROTATION_RIGHT      = 51;
var FORWARD             = 52;
var ROTATION_LEFT_BODY  = 53;
var ROTATION_RIGHT_BODY = 54;
var COMPLETING_ROTATION_LEFT_BODY  = 55;
var COMPLETING_ROTATION_RIGHT_BODY = 56;
var FURTHER_ROTATION_LEFT   = 57;
var FURTHER_ROTATION_RIGHT  = 58;
var FURTHER_ROTATION2_LEFT  = 59;
var FURTHER_ROTATION2_RIGHT = 60;

// facing directions
var NORTH = 20;
var SOUTH = 21;
var EAST  = 22;
var WEST  = 23;

var max_curr=200; var speed=10;