"use strict";

var square_vertices = [
    vec4( -0.5, 0.0,  0.5, 1.0 ),
    vec4( -0.5, 0.0, -0.5, 1.0 ),
    vec4(  0.5, 0.0, -0.5, 1.0 ),
    vec4(  0.5, 0.0,  0.5, 1.0 )
];
//gl.TRIANGLE_FAN
var squareArray = square_vertices;
var lenSquareArray = 4;
// **********************************************************************************
var piramid_vertices = [
    vec4(  1.0,  0.0,  1.0, 1.0 ),
    vec4(  1.0,  0.0, -1.0, 1.0 ),
    vec4( -1.0,  0.0, -1.0, 1.0 ),
    vec4( -1.0,  0.0,  1.0, 1.0 ),
    vec4(  0.0,  1.0,  0.0, 1.0 )
];
// gl.TRIANGLES
var piramidArray =
[piramid_vertices[0], piramid_vertices[1], piramid_vertices[2],
 piramid_vertices[0], piramid_vertices[2], piramid_vertices[3],
 piramid_vertices[0], piramid_vertices[1], piramid_vertices[4],
 piramid_vertices[0], piramid_vertices[3], piramid_vertices[4],
 piramid_vertices[3], piramid_vertices[2], piramid_vertices[4],
 piramid_vertices[2], piramid_vertices[1], piramid_vertices[4]];
var lenPiramidArray = 18;

var piramid_scalematrix = scalem(0.11,0.16,0.11);
// **********************************************************************************
var parallelepiped_vertices = [
    vec4( -0.5, 0.0,  0.5, 1.0 ),
    vec4( -0.5, 0.0, -0.5, 1.0 ),
    vec4(  0.5, 0.0, -0.5, 1.0 ),
    vec4(  0.5, 0.0,  0.5, 1.0 ),
    vec4( -0.5, 1.0,  0.5, 1.0 ),
    vec4( -0.5, 1.0, -0.5, 1.0 ),
    vec4(  0.5, 1.0, -0.5, 1.0 ),
    vec4(  0.5, 1.0,  0.5, 1.0 )
];
// gl.TRIANGLES
var parallelepipedArray =
[ parallelepiped_vertices[0], parallelepiped_vertices[1], parallelepiped_vertices[3],
  parallelepiped_vertices[2], parallelepiped_vertices[1], parallelepiped_vertices[3],
  parallelepiped_vertices[0], parallelepiped_vertices[4], parallelepiped_vertices[3],
  parallelepiped_vertices[3], parallelepiped_vertices[4], parallelepiped_vertices[7],
  parallelepiped_vertices[3], parallelepiped_vertices[7], parallelepiped_vertices[2],
  parallelepiped_vertices[7], parallelepiped_vertices[2], parallelepiped_vertices[6],
  parallelepiped_vertices[7], parallelepiped_vertices[4], parallelepiped_vertices[5],
  parallelepiped_vertices[7], parallelepiped_vertices[5], parallelepiped_vertices[6],
  parallelepiped_vertices[0], parallelepiped_vertices[1], parallelepiped_vertices[5],
  parallelepiped_vertices[0], parallelepiped_vertices[4], parallelepiped_vertices[5],
  parallelepiped_vertices[1], parallelepiped_vertices[2], parallelepiped_vertices[6],
  parallelepiped_vertices[1], parallelepiped_vertices[6], parallelepiped_vertices[5]];
var lenParallelepipedArray = 36;

var parallelepiped_scalematrix = scalem(0.11,0.11,0.05);
// **********************************************************************************
var snakehead_vertices = [
    vec4( 0.0 , 0.0 , 0.3 ),
    vec4( 0.2 , 0.0 ,-0.1 ),
    vec4( 0.0 , 0.2 ,-0.1 ),
    vec4(-0.2 , 0.0 ,-0.1 ),
    vec4(-0.18, 0.0 ,-0.3 ),
    vec4(-0.11, 0.14,-0.3 ),
    vec4( 0.11, 0.14,-0.3 ),
    vec4( 0.18, 0.0 ,-0.3 )
];
// gl.TRIANGLES
var snakeheadArray = 
[ snakehead_vertices[0], snakehead_vertices[3], snakehead_vertices[2],
  snakehead_vertices[0], snakehead_vertices[2], snakehead_vertices[1],
  snakehead_vertices[0], snakehead_vertices[3], snakehead_vertices[1],
  snakehead_vertices[1], snakehead_vertices[7], snakehead_vertices[4],
  snakehead_vertices[4], snakehead_vertices[3], snakehead_vertices[1],
  snakehead_vertices[4], snakehead_vertices[7], snakehead_vertices[5],
  snakehead_vertices[5], snakehead_vertices[6], snakehead_vertices[7],
  snakehead_vertices[5], snakehead_vertices[3], snakehead_vertices[4],
  snakehead_vertices[3], snakehead_vertices[2], snakehead_vertices[5],
  snakehead_vertices[2], snakehead_vertices[6], snakehead_vertices[5],
  snakehead_vertices[2], snakehead_vertices[1], snakehead_vertices[6],
  snakehead_vertices[1], snakehead_vertices[7], snakehead_vertices[6]];
var lenSnakeheadArray = 36;

var snakehead_scalematrix = scalem(0.4,0.5,0.4);
// **********************************************************************************
var snakebody_vertices = [
    vec4(-0.18, 0.0 , 0.1 ),
    vec4(-0.11, 0.14, 0.1 ),
    vec4( 0.11, 0.14, 0.1 ),
    vec4( 0.18, 0.0 , 0.1 ),
    vec4(-0.18, 0.0 ,-0.1 ),
    vec4(-0.11, 0.14,-0.1 ),
    vec4( 0.11, 0.14,-0.1 ),
    vec4( 0.18, 0.0 ,-0.1 )
];
// gl.TRIANGLES
var snakebodyArray =
[ 
  snakebody_vertices[0], snakebody_vertices[3], snakebody_vertices[1],
  snakebody_vertices[1], snakebody_vertices[2], snakebody_vertices[3],
  snakebody_vertices[4], snakebody_vertices[7], snakebody_vertices[5],
  snakebody_vertices[5], snakebody_vertices[6], snakebody_vertices[7],
  snakebody_vertices[0], snakebody_vertices[1], snakebody_vertices[4],
  snakebody_vertices[4], snakebody_vertices[1], snakebody_vertices[5],
  snakebody_vertices[5], snakebody_vertices[1], snakebody_vertices[2],
  snakebody_vertices[2], snakebody_vertices[6], snakebody_vertices[5],
  snakebody_vertices[6], snakebody_vertices[2], snakebody_vertices[3],
  snakebody_vertices[3], snakebody_vertices[7], snakebody_vertices[6],
  snakebody_vertices[0], snakebody_vertices[7], snakebody_vertices[3],
  snakebody_vertices[4], snakebody_vertices[0], snakebody_vertices[7]];
var lenSnakebodyArray = 36;

var snakebody_scalematrix = scalem(0.3,0.5,1.2);
// **********************************************************************************
var snaketail_vertices = [
    vec4(-0.18, 0.0 , 0.2 ),
    vec4(-0.11, 0.14, 0.2 ),
    vec4( 0.11, 0.14, 0.2 ),
    vec4( 0.18, 0.0 , 0.2 ),
    vec4( 0.0 , 0.0 ,-0.2 )
];
// gl.TRIANGLES
var snaketailArray = 
[ snaketail_vertices[0], snaketail_vertices[3], snaketail_vertices[1],
  snaketail_vertices[3], snaketail_vertices[1], snaketail_vertices[2],
  snaketail_vertices[0], snaketail_vertices[3], snaketail_vertices[4],
  snaketail_vertices[0], snaketail_vertices[1], snaketail_vertices[4],
  snaketail_vertices[1], snaketail_vertices[2], snaketail_vertices[4],
  snaketail_vertices[2], snaketail_vertices[3], snaketail_vertices[4]];
var lenSnaketailArray = 18;

var snaketail_scalematrix = scalem(0.3,0.5,0.55);
// **********************************************************************************