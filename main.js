"use strict";
var gl; var canvas; var program;

var square_size = 1.0;
var tile_size_max = 0.25;
var tile_size_min = 0.23;

var env_size_w = 23;
var env_size_h = 29;
var poss;

var environment;
var curr_position = [Math.ceil(env_size_w/2), Math.ceil(env_size_h/2)];
var facing_direction = NORTH;

var at_eye  = vec3(curr_position[0]*tile_size_max + tile_size_min/2, 0.0 , curr_position[1]*tile_size_max + tile_size_min/2);
var eye_pos = vec3(at_eye[0], 1.0, at_eye[2]-2.0);
var up_eye  = vec3(0.0, 1.0 , 0.0);

var cameraMatrix; var projectionMatrix;

function renderTile(modelViewMatrix) {
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"),
                        false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function renderEnv() {
    program = initShaders( gl, "vs-env", "fs-env");

    gl.useProgram( program );

    var pointsArray = squareArray;
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
        false, flatten(projectionMatrix));

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "cameraMatrix"),
        false, flatten(cameraMatrix));

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
            program = initShaders( gl, "vs-env", "fs-env");

            gl.useProgram( program );

            var pointsArray = piramidArray;
            var vBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

            var vPosition = gl.getAttribLocation( program, "vPosition" );
            gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );

            gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
                false, flatten(projectionMatrix));

            gl.uniformMatrix4fv( gl.getUniformLocation(program, "cameraMatrix"),
                false, flatten(cameraMatrix));

            gl.uniform4fv( gl.getUniformLocation(program, "color"), RED);

            var scalematrix = scalem(0.11,0.16,0.11);
            for (var i=0; i<len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX , 0.01,tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, scalematrix);
                gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"),
                                    false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, 0, lenPiramidArray);
            }

            break;
        case PARALLELEPIPED:
            program = initShaders( gl, "vs-env", "fs-env");

            gl.useProgram( program );

            var pointsArray = parallelepipedArray;
            var vBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

            var vPosition = gl.getAttribLocation( program, "vPosition" );
            gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );

            gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
                false, flatten(projectionMatrix));

            gl.uniformMatrix4fv( gl.getUniformLocation(program, "cameraMatrix"),
                false, flatten(cameraMatrix));

            gl.uniform4fv( gl.getUniformLocation(program, "color"), BLUE);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var scalematrix = scalem(0.11,0.11,0.05);
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, scalematrix));
                gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"),
                                    false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
            }
            break;
        case AT:
            program = initShaders( gl, "vs-env", "fs-env");

            gl.useProgram( program );

            var pointsArray = parallelepipedArray;
            var vBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

            var vPosition = gl.getAttribLocation( program, "vPosition" );
            gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );

            gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
                false, flatten(projectionMatrix));

            gl.uniformMatrix4fv( gl.getUniformLocation(program, "cameraMatrix"),
                false, flatten(cameraMatrix));

            gl.uniform4fv( gl.getUniformLocation(program, "color"), GREEN);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var scalematrix = scalem(0.05,0.20,0.05);

                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, scalematrix));
                gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"),
                                    false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
            }
        default:
            return -1;
    }
}

var isViewChanged = false; var topView = false;
var leftKeyPressed = false; var rightKeyPressed = false; var upKeyPressed = false;
function bindButtons() {
    document.getElementById("switchView").onclick = function(){isViewChanged = true; topView = !topView;};
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
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var near = 0.3; var far = 50.0; var  fovy = 45.0; var  aspect = canvas.width/canvas.height;
    projectionMatrix = perspective(fovy, aspect, near, far);
    cameraMatrix = lookAt(eye_pos, at_eye , up_eye);

    renderEnv();
    poss = []; var k = 0;
    for (var i=0; i<env_size_w; i++) {
        poss[k] = [i, 0]; k+=1;
        poss[k] = [i, env_size_h-1]; k+=1;
    } for (var i=1; i<env_size_h-1; i++) {
        poss[k] = [0, i]; k+=1;
        poss[k] = [env_size_w-1, i]; k+=1;
    }

    renderObject(PIRAMID, poss, 0);
    renderObject(PARALLELEPIPED, [[10, 10], [11, 16]], 0);
    renderObject(AT, [[curr_position]], 0);
    bindButtons();
    render();
}

var rotationmatrix_left;
var rotationmatrix_right;
var forward_matrix;

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
                        return -1;
                }
                window.requestAnimationFrame(render);
            } else {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var eye_pos4 = eye_pos.slice();
                eye_pos4.push(1.0);
                eye_pos4 = apply_matrix4(rotationmatrix_left, eye_pos4);
                eye_pos = vec3(eye_pos4);
                cameraMatrix = lookAt(eye_pos, at_eye, up_eye);

                renderEnv();
                renderObject(PIRAMID, poss, 0);
                theta = (theta + 2) % 360;
                renderObject(PARALLELEPIPED, [[10, 10], [11, 18]], theta);
                renderObject(AT, [curr_position], 0);

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
                        return -1;
                }
                window.requestAnimationFrame(render);
            } else {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var eye_pos4 = eye_pos.slice();
                eye_pos4.push(1.0);
                eye_pos4 = apply_matrix4(rotationmatrix_right, eye_pos4);
                eye_pos = vec3(eye_pos4);
                cameraMatrix = lookAt(eye_pos, at_eye, up_eye);

                renderEnv();
                renderObject(PIRAMID, poss, 0);
                theta = (theta + 1) % 360;
                renderObject(PARALLELEPIPED, [[10, 10], [11, 18]], theta);
                renderObject(AT, [curr_position], 0);

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
                            curr_position[0] += 1;
                            break;
                        case EAST:
                            forward_matrix = translate(-0.01, 0.0, 0.0);
                            curr_position[0] -= 1;
                            break;
                        case NORTH:
                            forward_matrix = translate(0.0, 0.0, 0.01);
                            curr_position[1] += 1;
                            break;
                        case SOUTH:
                            forward_matrix = translate(0.0, 0.0, -0.01);
                            curr_position[1] -= 1;
                            break;
                        default:
                            return -1;
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

                    renderEnv();
                    renderObject(PIRAMID, poss, 0);
                    theta = (theta + 1) % 360;
                    renderObject(PARALLELEPIPED, [[10, 10], [11, 18]], theta);
                    renderObject(AT, [curr_position], 0);

                    window.requestAnimationFrame(function() {
                        animation(FORWARD, curr+0.01);
                    });
                }
            break;
        default:
            return -1;
    }
}

var theta = 0;
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
    if (isViewChanged) {
        if (topView) {
            eye_pos = vec3(0.0, 10.0, 0.0); at_eye  = vec3(0.0, 0.0, 0.0); up_eye  = vec3(0.0, 0.0, 1.0);
            cameraMatrix = lookAt(eye_pos, at_eye , up_eye);
        } else {
            eye_pos = vec3(0.0, 1.0, -2.0); at_eye  = vec3(0.0, 0.0, 0.0); up_eye  = vec3(0.0, 1.0, 0.0);
            cameraMatrix = lookAt(eye_pos, at_eye , up_eye);
        }
        isViewChanged = false;
    }

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderEnv();
    renderObject(PIRAMID, poss, 0);
    theta = (theta + 1) % 360;
    renderObject(PARALLELEPIPED, [[10, 10], [11, 18]], theta);
    renderObject(AT, [curr_position], 0);

    window.requestAnimationFrame(render);
}
