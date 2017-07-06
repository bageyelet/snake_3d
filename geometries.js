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
// **********************************************************************************
