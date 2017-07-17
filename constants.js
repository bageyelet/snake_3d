"use strict";

var gl; 

var square_size = 1.0;
var tile_size_max = 0.25;
var tile_size_min = 0.25;

var max_curr=100; var speed=10;

// colors
var RED         = vec4( 1.0, 0.0, 0.0, 1.0 );
var BLUE        = vec4( 0.0, 0.0, 1.0, 1.0 );
var GREEN       = vec4( 0.1, 0.8, 0.1, 1.0 );
var LIGHT_GREY  = vec4( 0.4, 0.4, 0.4, 1.0 );
var PURPLE      = vec4( 0.5, 0.0, 0.5, 1.0 );
var BLACK       = vec4( 0.0, 0.0, 0.0, 1.0 );
var WHITE       = vec4( 1.0, 1.0, 1.0, 1.0 );

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

// light stuff
var lightDiffuse  = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var parallelepipedDiffuseParameter  = vec4( 0.8, 0.8, 0.6, 1.0 );
var parallelepipedSpecularParameter = vec4( 0.6, 0.6, 0.2, 1.0 );
var parallelepipedShininess = 500.0;
var parallelepipedDiffuseProduct  = mult(parallelepipedDiffuseParameter,  lightSpecular);
var parallelepipedSpecularProduct = mult(parallelepipedSpecularParameter, lightSpecular);

var piramidDiffuseParameter  = vec4( 0.5, 0.5, 0.5, 1.0 );
var piramidSpecularParameter = vec4( 0.8, 0.8, 0.8, 1.0 );
var piramidShininess = 20.0;
var piramidDiffuseProduct  = mult(piramidDiffuseParameter,  lightDiffuse);
var piramidSpecularProduct = mult(piramidSpecularParameter, lightSpecular);

var squareDiffuseParameter  = vec4( 0.8, 0.8, 0.8, 1.0 );
var squareSpecularParameter = vec4( 0.5, 0.5, 0.5, 1.0 );
var squareShininess = 20.0;
var squareDiffuseProduct  = mult(squareDiffuseParameter,  lightDiffuse);
var squareSpecularProduct = mult(squareSpecularParameter, lightSpecular);

var snakeDiffuseParameter  = vec4( 0.5, 0.3, 0.5, 1.0 );
var snakeSpecularParameter = vec4( 0.1, 0.1, 0.1, 1.0 );
var snakeShininess = 500.0;
var snakeDiffuseProduct  = mult(snakeDiffuseParameter, lightDiffuse);
var snakeSpecularProduct = mult(snakeSpecularParameter, lightSpecular);

// textures
var WHITE_SQUARE_TEXTURES       = 0;
var GREEN_SQUARE_TEXTURES       = 1;
var BLUE_SQUARE_TEXTURES        = 3;
var RED_TRIANGLE_TEXTURES       = 2;
var WHITE_TRIANGLE_TEXTURES     = 4;