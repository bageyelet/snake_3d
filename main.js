"use strict";
var gl; var canvas; var program;

var square_size = 1.0;
var tile_size_max = 0.25;
var tile_size_min = 0.22;

var env_size_w = 23;
var env_size_h = 29;
var poss;
var food; var theta_food = 0;

var environment;
var curr_position = [Math.ceil(env_size_w/2), Math.ceil(env_size_h/2)];
var facing_direction = NORTH;
var angle_head = 0;

var at_eye  = vec3(curr_position[0]*tile_size_max + tile_size_min/2, 0.0 , curr_position[1]*tile_size_max + tile_size_min/2);
var eye_pos = vec3(at_eye[0], 1.0, at_eye[2]-2.0);
var up_eye  = vec3(0.0, 1.0 , 0.0);

var cameraMatrix; var projectionMatrix;
var vBuffer; var vPosition;
var buffer_indexes = {};
var uColor;
var uModelViewMatrix; var uProjectionMatrix; var uCameraMatrix;

function renderTile(modelViewMatrix) {
    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, buffer_indexes[SQUARE], lenSquareArray);
}

function renderEnv() {

    gl.uniform4fv( gl.getUniformLocation(program, "color"), PURPLE);

    var scalematrix = scalem(tile_size_min,1.0,tile_size_min);

    for (var i=0; i<env_size_w; i++) {
        for (var j=0; j<env_size_h; j++) {
            renderTile(mult(translate(tile_size_min/2 + tile_size_max*i , 0.0, tile_size_min/2 + tile_size_max*j), scalematrix));
        }
    }
}

function renderObject(type, positions, theta) {
    var len = positions.length;
    switch(type) {
        case PIRAMID:

            gl.uniform4fv( gl.getUniformLocation(program, "color"), RED);

            for (var i=0; i<len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX , 0.01,tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, piramid_scalematrix);
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[PIRAMID], lenPiramidArray);
            }

            break;
        case PARALLELEPIPED:

            gl.uniform4fv( gl.getUniformLocation(program, "color"), BLUE);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, parallelepiped_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELEPIPED], lenParallelepipedArray);
            }
            break;
        case SNAKEHEAD:

            gl.uniform4fv( gl.getUniformLocation(program, "color"), GREEN);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, snakehead_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[SNAKEHEAD], lenSnakeheadArray);
            }
            break;
        case SNAKEBODY:

            gl.uniform4fv( gl.getUniformLocation(program, "color"), GREEN);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, snakebody_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[SNAKEBODY], lenSnakebodyArray);
            }
            break;

        case SNAKETAIL:

            gl.uniform4fv( gl.getUniformLocation(program, "color"), GREEN);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, snaketail_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[SNAKETAIL], lenSnaketailArray);
            }
            break;
        default:
            throw "renderObject(): wrong type";
    }
}

// food has two components: the first is the vector of coordinates, the second is the angle
// snake has two components: the first is the vector of coordinates, the second is the angle
// at is a boolean!
function renderEnvObjects(obstacles, food, snake) {
    renderObject(PIRAMID, obstacles, 0);
    renderObject(PARALLELEPIPED, food[0], food[1]);
    renderObject(SNAKEHEAD, [snake[0]], snake[1]);
    renderObject(SNAKEBODY, [[snake[0][0], snake[0][1] -1 ], [snake[0][0], snake[0][1] -2 ]], 0);
    renderObject(SNAKETAIL, [[snake[0][0], snake[0][1] -3 ]], 0);
}

var leftKeyPressed = false; var rightKeyPressed = false; var upKeyPressed = false;
function bindButtons() {
    // document.getElementById("switchView").onclick = function(){isViewChanged = true; topView = !topView;};
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) {
            leftKeyPressed = true;
        } else if(event.keyCode == 39) {
            rightKeyPressed = true;
        } else if(event.keyCode == 38) {
            upKeyPressed = true;
        }
    });

}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    canvas.width = window.innerWidth-20;
    canvas.height = window.innerHeight-250;
    canvas.style.display = "block";

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    var near = 0.3; var far = 50.0; var  fovy = 45.0; var  aspect = canvas.width/canvas.height;
    projectionMatrix = perspective(fovy, aspect, near, far);
    cameraMatrix = lookAt(eye_pos, at_eye , up_eye);

    program = initShaders( gl, "vs-env", "fs-env");
    gl.useProgram( program );

    uModelViewMatrix = gl.getUniformLocation( program, "modelViewMatrix");
    uProjectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
    uCameraMatrix = gl.getUniformLocation(program, "cameraMatrix");

    gl.uniformMatrix4fv( uProjectionMatrix, false, flatten(projectionMatrix));

    gl.uniformMatrix4fv( uCameraMatrix, false, flatten(cameraMatrix));

    // initialize buffer with ALL vertices
    var allVertices = squareArray.concat(piramidArray).concat(parallelepipedArray).concat(snakeheadArray)
                      .concat(snakebodyArray).concat(snaketailArray);

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allVertices), gl.STATIC_DRAW );
    buffer_indexes[SQUARE] = 0; buffer_indexes[PIRAMID] = 4; buffer_indexes[PARALLELEPIPED] = 22; 
    buffer_indexes[SNAKEHEAD] = 58; buffer_indexes[SNAKEBODY] = 94; buffer_indexes[SNAKETAIL] = 130;

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    poss = []; var k = 0;
    for (var i=0; i<env_size_w; i++) {
        poss[k] = [i, 0]; k+=1;
        poss[k] = [i, env_size_h-1]; k+=1;
    } for (var i=1; i<env_size_h-1; i++) {
        poss[k] = [0, i]; k+=1;
        poss[k] = [env_size_w-1, i]; k+=1;
    }

    food = [];
    food.push([10, 10]);
    food.push([11, 16]);

    renderEnv();
    renderEnvObjects(poss, [food, 0], [curr_position, angle_head]);

    bindButtons();
    render();
}

var rotationmatrix_left;
var rotationmatrix_right;
var forward_matrix; var xSnake; var ySnake;

function animation(type, curr) {
    switch(type) {
        case ROTATION_LEFT:
            if (curr == 0) {
                rotationmatrix_left  = translate(-at_eye[0], 0.0, -at_eye[2]);
                rotationmatrix_left = mult(rotate( 2, [0, 1, 0] ), rotationmatrix_left);
                rotationmatrix_left = mult(translate(at_eye[0], 0.0, at_eye[2]), rotationmatrix_left);
            }
            if (curr >= 90) {
                switch (facing_direction) {
                    case NORTH:
                        facing_direction = WEST;
                        break;
                    case SOUTH:
                        facing_direction = EAST;
                        break;
                    case EAST:
                        facing_direction = NORTH;
                        break;
                    case WEST:
                        facing_direction = SOUTH;
                        break;
                    default:
                        throw "animation(): facing_direction corrupted";
                }
                window.requestAnimationFrame(render);
            } else {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var eye_pos4 = eye_pos.slice();
                eye_pos4.push(1.0);
                eye_pos4 = apply_matrix4(rotationmatrix_left, eye_pos4);
                eye_pos = vec3(eye_pos4);
                cameraMatrix = lookAt(eye_pos, at_eye, up_eye);
                gl.uniformMatrix4fv( uCameraMatrix, false, flatten(cameraMatrix));

                renderEnv();
                theta_food = (theta_food + 1) % 360;
                renderEnvObjects(poss, [food, theta_food], [curr_position, angle_head]);

                angle_head += 2;

                window.requestAnimationFrame(function() {
                    animation(ROTATION_LEFT, curr+2);
                });
                
            }
            break;
        case ROTATION_RIGHT:
            if (curr == 0) {
                rotationmatrix_right  = translate(-at_eye[0], 0.0, -at_eye[2]);
                rotationmatrix_right = mult(rotate(-2, [0, 1, 0] ), rotationmatrix_right);
                rotationmatrix_right = mult(translate(at_eye[0], 0.0, at_eye[2]), rotationmatrix_right);
            }
            if (curr >= 90) {
                switch (facing_direction) {
                    case NORTH:
                        facing_direction = EAST;
                        break;
                    case SOUTH:
                        facing_direction = WEST;
                        break;
                    case EAST:
                        facing_direction = SOUTH;
                        break;
                    case WEST:
                        facing_direction = NORTH;
                        break;
                    default:
                        throw "animation(): facing_direction corrupted";
                }
                window.requestAnimationFrame(render);
            } else {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var eye_pos4 = eye_pos.slice();
                eye_pos4.push(1.0);
                eye_pos4 = apply_matrix4(rotationmatrix_right, eye_pos4);
                eye_pos = vec3(eye_pos4);
                cameraMatrix = lookAt(eye_pos, at_eye, up_eye);
                gl.uniformMatrix4fv( uCameraMatrix, false, flatten(cameraMatrix));

                renderEnv();
                theta_food = (theta_food + 1) % 360;
                renderEnvObjects(poss, [food, theta_food], [curr_position, angle_head]);

                angle_head -= 2;

                window.requestAnimationFrame(function() {
                    animation(ROTATION_RIGHT, curr+2);
                });
                
            }
            break;
        case FORWARD:
                if (curr == 0) {
                    switch (facing_direction) {
                        case WEST:
                            forward_matrix = translate(0.01, 0.0, 0.0);
                            xSnake = 1;
                            ySnake = NaN;
                            curr_position[0] += 1;
                            break;
                        case EAST:
                            forward_matrix = translate(-0.01, 0.0, 0.0);
                            xSnake = -1;
                            ySnake = NaN;
                            curr_position[0] -= 1;
                            break;
                        case NORTH:
                            forward_matrix = translate(0.0, 0.0, 0.01);
                            xSnake = NaN;
                            ySnake = 1;
                            curr_position[1] += 1;
                            break;
                        case SOUTH:
                            forward_matrix = translate(0.0, 0.0, -0.01);
                            xSnake = NaN;
                            ySnake = -1;
                            curr_position[1] -= 1;
                            break;
                        default:
                            throw "animation(): facing_direction corrupted";
                    }
                }
                if (curr >= tile_size_max) {
                    window.requestAnimationFrame(render);
                } else {
                    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    var eye_pos4 = eye_pos.slice();
                    eye_pos4.push(1.0);
                    eye_pos4 = apply_matrix4(forward_matrix, eye_pos4);
                    eye_pos = vec3(eye_pos4);
                    var at_eye4 = at_eye.slice();
                    at_eye4.push(1.0);
                    at_eye4 = apply_matrix4(forward_matrix, at_eye4);
                    at_eye = vec3(at_eye4);
                    cameraMatrix = lookAt(eye_pos, at_eye, up_eye);
                    gl.uniformMatrix4fv( uCameraMatrix, false, flatten(cameraMatrix));

                    renderEnv();
                    theta_food = (theta_food + 1) % 360;
                    if (!isNaN(xSnake)) {
                        var inc = xSnake * linear_interpolation(curr, 0, tile_size_max, 0, 1);
                        renderEnvObjects(poss, [food, theta_food], [[curr_position[0] - xSnake + inc, curr_position[1]], angle_head]);
                    } else {
                        var inc = ySnake * linear_interpolation(curr, 0, tile_size_max, 0, 1);
                        renderEnvObjects(poss, [food, theta_food], [[curr_position[0], curr_position[1] - ySnake + inc], angle_head]);
                    }

                    window.requestAnimationFrame(function() {
                        animation(FORWARD, curr+0.01);
                    });
                }
            break;
        default:
            throw "animation(): wrong type";
    }
}

function render() {

    if (leftKeyPressed) {
        leftKeyPressed = false;
        animation(ROTATION_LEFT, 0);
        return;
    }
    if (rightKeyPressed) {
        rightKeyPressed = false;
        animation(ROTATION_RIGHT, 0);
        return;
    }
    if (upKeyPressed) {
        upKeyPressed = false;
        animation(FORWARD, 0);
        return;
    }

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderEnv();
    theta_food = (theta_food + 1) % 360;
    renderEnvObjects(poss, [food, theta_food], [curr_position, angle_head]);

    window.requestAnimationFrame(render);
}
