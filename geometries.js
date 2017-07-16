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

var squareNormalsArray = [
    vec4( 0.0, 1.0, 0.0, 0.0),
    vec4( 0.0, 1.0, 0.0, 0.0),
    vec4( 0.0, 1.0, 0.0, 0.0),
    vec4( 0.0, 1.0, 0.0, 0.0)
];

var squareTexCoordsArray = [
    texCoord[0], texCoord[1],
    texCoord[2], texCoord[3]
];
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
 piramid_vertices[0], piramid_vertices[4], piramid_vertices[3],
 piramid_vertices[3], piramid_vertices[4], piramid_vertices[2],
 piramid_vertices[2], piramid_vertices[4], piramid_vertices[1]];
var lenPiramidArray = 18;

var piramidNormalsArray = [];
for (var i=0; i<lenPiramidArray/3; i++) {
    var t1 = subtract(piramidArray[i*3+1], piramidArray[i*3+0]);
    var t2 = subtract(piramidArray[i*3+2], piramidArray[i*3+1]);
    for (var j=0; j<3; j++)
      piramidNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var piramid_scalematrix = scalem(0.11,0.20,0.11);

var piramidTexCoordsArray = [
    texCoord[3], texCoord[2], texCoord[1],
    texCoord[3], texCoord[1], texCoord[0],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3]
];
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
[ parallelepiped_vertices[0], parallelepiped_vertices[3], parallelepiped_vertices[1],
  parallelepiped_vertices[1], parallelepiped_vertices[3], parallelepiped_vertices[2],
  parallelepiped_vertices[0], parallelepiped_vertices[3], parallelepiped_vertices[4],
  parallelepiped_vertices[3], parallelepiped_vertices[7], parallelepiped_vertices[4],
  parallelepiped_vertices[3], parallelepiped_vertices[2], parallelepiped_vertices[7],
  parallelepiped_vertices[7], parallelepiped_vertices[2], parallelepiped_vertices[6],
  parallelepiped_vertices[7], parallelepiped_vertices[5], parallelepiped_vertices[4],
  parallelepiped_vertices[7], parallelepiped_vertices[6], parallelepiped_vertices[5],
  parallelepiped_vertices[0], parallelepiped_vertices[5], parallelepiped_vertices[1],
  parallelepiped_vertices[0], parallelepiped_vertices[4], parallelepiped_vertices[5],
  parallelepiped_vertices[1], parallelepiped_vertices[6], parallelepiped_vertices[2],
  parallelepiped_vertices[1], parallelepiped_vertices[5], parallelepiped_vertices[6]];
var lenParallelepipedArray = 36;

var parallelepipedNormalsArray = [];
for (var i=0; i<lenParallelepipedArray/3; i++) {
    var t1 = subtract(parallelepipedArray[i*3+1], parallelepipedArray[i*3+0]);
    var t2 = subtract(parallelepipedArray[i*3+2], parallelepipedArray[i*3+1]);
    for (var j=0; j<3; j++)
      parallelepipedNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var parallelepipedTexCoordsArray = [
    texCoord[0], texCoord[3], texCoord[1],
    texCoord[1], texCoord[3], texCoord[2],
    texCoord[0], texCoord[3], texCoord[1],
    texCoord[3], texCoord[2], texCoord[1],
    texCoord[0], texCoord[3], texCoord[1],
    texCoord[1], texCoord[3], texCoord[2],
    texCoord[3], texCoord[1], texCoord[0],
    texCoord[3], texCoord[2], texCoord[1],
    texCoord[0], texCoord[2], texCoord[3],
    texCoord[0], texCoord[1], texCoord[2],
    texCoord[0], texCoord[2], texCoord[3],
    texCoord[0], texCoord[1], texCoord[2]
];

var parallelepiped_scalematrix = scalem(0.11,0.11,0.03);
// **********************************************************************************
var snakehead_vertices = [
    vec4( 0.0 , 0.0 , 0.35 ),
    vec4( 0.2 , 0.0 ,-0.05 ),
    vec4( 0.0 , 0.2 ,-0.05 ),
    vec4(-0.2 , 0.0 ,-0.05 ),
    vec4(-0.15, 0.0 ,-0.35 ),
    vec4(-0.08, 0.14,-0.35 ),
    vec4( 0.08, 0.14,-0.35 ),
    vec4( 0.15, 0.0 ,-0.35 )
];
// gl.TRIANGLES
var snakeheadArray = 
[ snakehead_vertices[0], snakehead_vertices[2], snakehead_vertices[3],
  snakehead_vertices[0], snakehead_vertices[1], snakehead_vertices[2],
  snakehead_vertices[0], snakehead_vertices[3], snakehead_vertices[1],
  snakehead_vertices[1], snakehead_vertices[4], snakehead_vertices[7],
  snakehead_vertices[4], snakehead_vertices[1], snakehead_vertices[3],
  snakehead_vertices[4], snakehead_vertices[5], snakehead_vertices[7],
  snakehead_vertices[6], snakehead_vertices[7], snakehead_vertices[5],
  snakehead_vertices[5], snakehead_vertices[3], snakehead_vertices[4],
  snakehead_vertices[3], snakehead_vertices[2], snakehead_vertices[5],
  snakehead_vertices[2], snakehead_vertices[6], snakehead_vertices[5],
  snakehead_vertices[2], snakehead_vertices[1], snakehead_vertices[6],
  snakehead_vertices[1], snakehead_vertices[7], snakehead_vertices[6]];
var lenSnakeheadArray = 36;

var snakeheadNormalsArray = [];
for (var i=0; i<lenSnakeheadArray/3; i++) {
    var t1 = subtract(snakeheadArray[i*3+1], snakeheadArray[i*3+0]);
    var t2 = subtract(snakeheadArray[i*3+2], snakeheadArray[i*3+1]);
    for (var j=0; j<3; j++)
      snakeheadNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var snakeheadTexCoordsArray = [
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[4], texCoord[5], texCoord[0],
    texCoord[4], texCoord[5], texCoord[0],
    texCoord[0], texCoord[4], texCoord[5],
    texCoord[0], texCoord[4], texCoord[5],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3],
    texCoord[0], texCoord[1], texCoord[3]
];

var snakehead_scalematrix = scalem(0.43,0.55,0.25);
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
  snakebody_vertices[1], snakebody_vertices[3], snakebody_vertices[2],
  snakebody_vertices[4], snakebody_vertices[7], snakebody_vertices[5],
  snakebody_vertices[6], snakebody_vertices[5], snakebody_vertices[7],
  snakebody_vertices[0], snakebody_vertices[1], snakebody_vertices[4],
  snakebody_vertices[4], snakebody_vertices[1], snakebody_vertices[5],
  snakebody_vertices[5], snakebody_vertices[1], snakebody_vertices[2],
  snakebody_vertices[2], snakebody_vertices[6], snakebody_vertices[5],
  snakebody_vertices[6], snakebody_vertices[2], snakebody_vertices[3],
  snakebody_vertices[3], snakebody_vertices[7], snakebody_vertices[6],
  snakebody_vertices[0], snakebody_vertices[7], snakebody_vertices[3],
  snakebody_vertices[4], snakebody_vertices[0], snakebody_vertices[7]];
var lenSnakebodyArray = 36;

var snakebodyNormalsArray = [];
for (var i=0; i<lenSnakebodyArray/3; i++) {
    var t1 = subtract(snakebodyArray[i*3+1], snakebodyArray[i*3+0]);
    var t2 = subtract(snakebodyArray[i*3+2], snakebodyArray[i*3+1]);
    for (var j=0; j<3; j++)
      snakebodyNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var snakebodyTexCoordsArray = [
    texCoord1[0], texCoord1[3], texCoord1[1],
    texCoord1[1], texCoord1[3], texCoord1[2],
    texCoord1[0], texCoord1[3], texCoord1[1],
    texCoord1[2], texCoord1[1], texCoord1[3],
    texCoord1[0], texCoord1[1], texCoord1[3],
    texCoord1[1], texCoord1[3], texCoord1[2],
    texCoord1[1], texCoord1[0], texCoord1[3],
    texCoord1[3], texCoord1[2], texCoord1[1],
    texCoord1[1], texCoord1[0], texCoord1[3],
    texCoord1[3], texCoord1[2], texCoord1[1],
    texCoord1[0], texCoord1[2], texCoord1[3],
    texCoord1[1], texCoord1[0], texCoord1[2]
];

var snakebody_scalematrix = scalem(0.3,0.5,0.90);
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
[ snaketail_vertices[0], snaketail_vertices[1], snaketail_vertices[3],
  snaketail_vertices[3], snaketail_vertices[1], snaketail_vertices[2],
  snaketail_vertices[0], snaketail_vertices[3], snaketail_vertices[4],
  snaketail_vertices[0], snaketail_vertices[1], snaketail_vertices[4],
  snaketail_vertices[1], snaketail_vertices[2], snaketail_vertices[4],
  snaketail_vertices[2], snaketail_vertices[3], snaketail_vertices[4]];
var lenSnaketailArray = 18;

var snaketailNormalsArray = [];
for (var i=0; i<lenSnaketailArray/3; i++) {
    var t1 = subtract(snaketailArray[i*3+1], snaketailArray[i*3+0]);
    var t2 = subtract(snaketailArray[i*3+2], snaketailArray[i*3+1]);
    for (var j=0; j<3; j++)
      snaketailNormalsArray.push(vec4(normalize(cross(t1,t2)), 0.0));
}

var snaketailTexCoordsArray = [
    texCoord[0], texCoord[1], texCoord[5],
    texCoord[4], texCoord[5], texCoord[0],
    texCoord[3], texCoord[0], texCoord[1],
    texCoord[3], texCoord[0], texCoord[1],
    texCoord[3], texCoord[0], texCoord[1],
    texCoord[3], texCoord[0], texCoord[1]
];

var snaketail_scalematrix = scalem(0.3,0.5,0.45);
// **********************************************************************************