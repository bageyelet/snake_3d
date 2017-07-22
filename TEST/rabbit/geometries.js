var parallelepiped_vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];
var parallelepiped_normals = [
    vec4(  1.0,  0.0,  0.0, 0.0 ),
    vec4( -1.0,  0.0,  0.0, 0.0 ),
    vec4(  0.0,  1.0,  0.0, 0.0 ),
    vec4(  0.0, -1.0,  0.0, 0.0 ),
    vec4(  0.0,  0.0,  1.0, 0.0 ),
    vec4(  0.0,  0.0, -1.0, 0.0 )
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

var parallelepipedNormalsArray =
[ parallelepiped_normals[4], parallelepiped_normals[4], parallelepiped_normals[4],
  parallelepiped_normals[4], parallelepiped_normals[4], parallelepiped_normals[4],
  parallelepiped_normals[3], parallelepiped_normals[3], parallelepiped_normals[3],
  parallelepiped_normals[3], parallelepiped_normals[3], parallelepiped_normals[3],
  parallelepiped_normals[0], parallelepiped_normals[0], parallelepiped_normals[0],
  parallelepiped_normals[0], parallelepiped_normals[0], parallelepiped_normals[0],
  parallelepiped_normals[5], parallelepiped_normals[5], parallelepiped_normals[5],
  parallelepiped_normals[5], parallelepiped_normals[5], parallelepiped_normals[5],
  parallelepiped_normals[1], parallelepiped_normals[1], parallelepiped_normals[1],
  parallelepiped_normals[1], parallelepiped_normals[1], parallelepiped_normals[1],
  parallelepiped_normals[2], parallelepiped_normals[2], parallelepiped_normals[2],
  parallelepiped_normals[2], parallelepiped_normals[2], parallelepiped_normals[2]];

var RED1 = vec4(1.00, 0.0, 0.0, 1.0);
var RED2 = vec4(0.95, 0.0, 0.0, 1.0);
var RED3 = vec4(0.90, 0.0, 0.0, 1.0);
var RED4 = vec4(0.85, 0.0, 0.0, 1.0);
var RED5 = vec4(0.80, 0.0, 0.0, 1.0);
var RED6 = vec4(0.75, 0.0, 0.0, 1.0);

var parallelepipedColorsArray =
[ RED1, RED1, RED1,
  RED1, RED1, RED1,
  RED2, RED2, RED2,
  RED2, RED2, RED2,
  RED3, RED3, RED3,
  RED3, RED3, RED3,
  RED4, RED4, RED4,
  RED4, RED4, RED4,
  RED5, RED5, RED5,
  RED5, RED5, RED5,
  RED6, RED6, RED6,
  RED6, RED6, RED6];
