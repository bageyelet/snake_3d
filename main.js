"use strict";
var gl; var canvas; var program;
var stats;

var square_size = 1.0;
var tile_size_max = 0.25;
var tile_size_min = 0.22;

var env_size_w = 25;
var env_size_h = 25;
var poss;
var food; var theta_food = 0;

var environment;
var snake_head;
var snakeList = new List();
var facing_direction = NORTH;

var curr_position = [Math.ceil(env_size_w/2), Math.ceil(env_size_h/2)];
var at_eye  = vec3(curr_position[0]*tile_size_max + tile_size_min/2, 0.0 , curr_position[1]*tile_size_max + tile_size_min/2);
var eye_pos = vec3(at_eye[0], 1.25, at_eye[2]-2.0);
var up_eye  = vec3(0.0, 1.0 , 0.0);

var cameraMatrix; var projectionMatrix;
var vBuffer; var vPosition;
var nBuffer; var vNormal;
var buffer_indexes = {};
var uColor;
var uModelViewMatrix; var uProjectionMatrix; var uCameraMatrix;
var uDiffuseProduct; var uSpecularProduct; var uShininess;

function setCamera(eye, at, update_global) {
    // eye.delta_transl; eye.delta_angle;
    // at.delta_transl; at.delta_angle; <-- not implemented!

    var old_eye_pos = eye_pos.slice();
    var old_at_eye = at_eye.slice();
    old_eye_pos.push(1.0);
    old_at_eye.push(1.0);

    var mat_eye  = translate(-old_at_eye[0], 0.0, -old_at_eye[2]);
    mat_eye = mult(rotate( eye.delta_angle , [0, 1, 0] ), mat_eye);
    mat_eye = mult(translate(old_at_eye[0], 0.0, old_at_eye[2]), mat_eye);
    mat_eye = mult(translate( eye.delta_transl[0] , eye.delta_transl[1], eye.delta_transl[2]), mat_eye);

    var mat_at  = translate( at.delta_transl[0] , at.delta_transl[1], at.delta_transl[2]);

    old_eye_pos = vec3(apply_matrix4(mat_eye, old_eye_pos));
    old_at_eye = vec3(apply_matrix4(mat_at, old_at_eye));

    cameraMatrix = lookAt(old_eye_pos, old_at_eye, up_eye);
    gl.uniformMatrix4fv( uCameraMatrix, false, flatten(cameraMatrix));

    if (update_global) {
        eye_pos = vec3(old_eye_pos);
        at_eye = vec3(old_at_eye);
    }

}

function renderTile(modelViewMatrix) {
    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, buffer_indexes[SQUARE], lenSquareArray);
}

function renderEnv() {

    gl.uniform4fv( uColor, PURPLE);
    gl.uniform4fv( uDiffuseProduct, flatten(squareDiffuseProduct));
    gl.uniform4fv( uSpecularProduct, flatten(squareSpecularProduct));
    gl.uniform1f( uShininess, squareShininess);
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

            gl.uniform4fv( uColor, RED);
            gl.uniform4fv( uDiffuseProduct, flatten(piramidDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(piramidSpecularProduct));
            gl.uniform1f( uShininess, piramidShininess);

            for (var i=0; i<len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX , 0.01,tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, piramid_scalematrix);
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[PIRAMID], lenPiramidArray);
            }

            break;
        case PARALLELEPIPED:

            gl.uniform4fv( uColor, BLUE);
            gl.uniform4fv( uDiffuseProduct, flatten(parallelepipedDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(parallelepipedSpecularProduct));
            gl.uniform1f( uShininess, parallelepipedShininess);

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

            gl.uniform4fv( uColor, GREEN);
            gl.uniform4fv( uDiffuseProduct, flatten(snakeDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(snakeSpecularProduct));
            gl.uniform1f( uShininess, snakeShininess);

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

            gl.uniform4fv( uColor, GREEN);
            gl.uniform4fv( uDiffuseProduct, flatten(snakeDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(snakeSpecularProduct));
            gl.uniform1f( uShininess, snakeShininess);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta[i], [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, snakebody_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[SNAKEBODY], lenSnakebodyArray);
            }
            break;

        case SNAKETAIL:

            gl.uniform4fv( uColor, GREEN);
            gl.uniform4fv( uDiffuseProduct, flatten(snakeDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(snakeSpecularProduct));
            gl.uniform1f( uShininess, snakeShininess);

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

function renderSnake() {
    var el = snakeList.next();
    if (el.data.type == SNAKEHEAD) {
        renderObject(SNAKEHEAD, [el.data.pos], el.data.angle);
    } else {
        throw "renderSnake(): snakeList in an invalid state";
    }
    el = snakeList.next();
    var positions = []; var angles = [];
    while(el.data.type == SNAKEBODY) {
        positions.push(el.data.pos);
        angles.push(el.data.angle);
        el = snakeList.next();
    }
    renderObject(SNAKEBODY, positions, angles);

    if (el.data.type == SNAKETAIL) {
        renderObject(SNAKETAIL, [el.data.pos], el.data.angle);
    } else {
        throw "renderSnake(): snakeList in an invalid state";
    }

    snakeList.next();
}

// food has two components: the first is the vector of coordinates, the second is the angle
// at is a boolean!
function renderEnvObjects(obstacles, food, snake) {
    renderObject(PIRAMID, obstacles, 0);
    renderObject(PARALLELEPIPED, food[0], food[1]);
    renderSnake();
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

    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '8px';
    stats.domElement.style.top = '8px';
    document.body.appendChild( stats.dom );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.enable(gl.DEPTH_TEST);
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
    uColor = gl.getUniformLocation(program, "color");
    uDiffuseProduct  = gl.getUniformLocation(program, "diffuseProduct");
    uSpecularProduct = gl.getUniformLocation(program, "specularProduct");
    uShininess = gl.getUniformLocation(program, "shininess");

    gl.uniformMatrix4fv( uProjectionMatrix, false, flatten(projectionMatrix));

    gl.uniformMatrix4fv( uCameraMatrix, false, flatten(cameraMatrix));

    // initialize buffer with ALL vertices
    var allVertices = squareArray.concat(piramidArray).concat(parallelepipedArray).concat(snakeheadArray)
                      .concat(snakebodyArray).concat(snaketailArray);

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allVertices), gl.STATIC_DRAW );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
        
    var allNormals = squareNormalsArray.concat(piramidNormalsArray).concat(parallelepipedNormalsArray).concat(snakeheadNormalsArray)
                      .concat(snakebodyNormalsArray).concat(snaketailNormalsArray);

    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allNormals), gl.STATIC_DRAW );
    vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    buffer_indexes[SQUARE] = 0; buffer_indexes[PIRAMID] = 4; buffer_indexes[PARALLELEPIPED] = 22; 
    buffer_indexes[SNAKEHEAD] = 58; buffer_indexes[SNAKEBODY] = 94; buffer_indexes[SNAKETAIL] = 130;

    initializePositionUpdater();

    poss = []; var k = 0;
    for (var i=0; i<env_size_w; i++) {
        poss[k] = [i, 0]; k+=1;
        poss[k] = [i, env_size_h-1]; k+=1;
    } for (var i=1; i<env_size_h-1; i++) {
        poss[k] = [0, i]; k+=1;
        poss[k] = [env_size_w-1, i]; k+=1;
    }

    food = [];
    food.push([8, 10]);
    food.push([11, 16]);

    snake_head = {};
    snake_head.type = SNAKEHEAD;
    snake_head.pos = [Math.ceil(env_size_w/2), Math.ceil(env_size_h/2)];
    snake_head.error_pos = [0,0];
    snake_head.angle = 0;
    snake_head.direction = NORTH;
    snake_head.anim = null;

    snakeList.add({type:SNAKETAIL, pos:[snake_head.pos[0], snake_head.pos[1]-6], angle:snake_head.angle, direction:snake_head.direction, anim: FORWARD});
    snakeList.add({type:SNAKEBODY, pos:[snake_head.pos[0], snake_head.pos[1]-5], angle:snake_head.angle, direction:snake_head.direction, anim: FORWARD});
    snakeList.add({type:SNAKEBODY, pos:[snake_head.pos[0], snake_head.pos[1]-4], angle:snake_head.angle, direction:snake_head.direction, anim: FORWARD});
    snakeList.add({type:SNAKEBODY, pos:[snake_head.pos[0], snake_head.pos[1]-3], angle:snake_head.angle, direction:snake_head.direction, anim: FORWARD});
    snakeList.add({type:SNAKEBODY, pos:[snake_head.pos[0], snake_head.pos[1]-2], angle:snake_head.angle, direction:snake_head.direction, anim: FORWARD});
    snakeList.add({type:SNAKEBODY, pos:[snake_head.pos[0], snake_head.pos[1]-1], angle:snake_head.angle, direction:snake_head.direction, anim: FORWARD});
    snakeList.add(snake_head);

    renderEnv();
    renderEnvObjects(poss, [food, 0]);

    bindButtons();
    render();
}

var rotationmatrix_left;
var rotationmatrix_right;
var forward_matrix; var xSnake; var ySnake;

var inc_tran={x:0, y:0};
var tot_tran={x:0, y:0};
var inc_rot=0;
var tot_rot=0;

var inc_pos={x:0, y:0};

function animation(type, curr) {
    switch(type) {
        case ROTATION_LEFT:
            if (curr == 0) {
                initializeOldPos(snakeList.head);
                snake_head.anim = ROTATION_LEFT;
                switch (snake_head.old_direction) {
                    case NORTH:
                        snake_head.direction = WEST;
                        inc_pos.x = linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case SOUTH:
                        snake_head.direction = EAST;
                        inc_pos.x = -linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = -linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case EAST:
                        snake_head.direction = NORTH;
                        inc_pos.x = 0;
                        inc_pos.y = linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        break;
                    case WEST:
                        snake_head.direction = SOUTH;
                        inc_pos.x = 0;
                        inc_pos.y = -linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = -linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        break;
                    default:
                        throw "animation(): facing_direction corrupted";
                }

                inc_rot = linear_interpolation(speed, 0, max_curr, 0, 90);
                tot_tran.x=0; tot_tran.y=0; tot_rot=0;

            }
            if (curr >= max_curr) {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                snake_head.angle = fix_round_error(snake_head.angle, 90)%360;

                var eye={};
                eye.delta_transl = [NaN, 0.0, NaN];
                eye.delta_angle = 90;

                var at={};
                at.delta_transl = [];

                if (inc_tran.y == 0) {
                    eye.delta_transl[2] = 0.0;
                    if (inc_tran.x>0) {
                        eye.delta_transl[0] = tile_size_max;
                    } else {
                        eye.delta_transl[0] = -tile_size_max;
                    }
                } else if (inc_tran.x == 0) {
                    eye.delta_transl[0] = 0.0;
                    if (inc_tran.y>0) {
                        eye.delta_transl[2] = tile_size_max;
                    } else {
                        eye.delta_transl[2] = -tile_size_max;
                    }
                } else {
                    throw "animation(): inconsistent inc_tran state"
                }
                at.delta_transl = eye.delta_transl;
                setCamera(eye, at, true);

                renderEnv();
                theta_food = (theta_food + 1) % 360;
                snake_head.pos = [snake_head.old_pos[0] + 1*sign(inc_tran.x), snake_head.old_pos[1] + 1*sign(inc_tran.y)];
                updateSnakePositions(snakeList.getSecond(), curr);
                renderEnvObjects(poss, [food, theta_food]);

                window.requestAnimationFrame(render);
            } else {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var eye={};
                eye.delta_transl = [tot_tran.x, 0.0, tot_tran.y];
                eye.delta_angle = tot_rot;

                var at={};
                at.delta_transl = eye.delta_transl;

                setCamera(eye, at, false);
                renderEnv();
                theta_food = (theta_food + 1) % 360;
                updateSnakePositions(snakeList.getSecond(), curr);
                renderEnvObjects(poss, [food, theta_food]);

                tot_rot    += inc_rot;
                tot_tran.x += inc_tran.x;
                tot_tran.y += inc_tran.y;

                snake_head.pos[0] += inc_pos.x;
                snake_head.pos[1] += inc_pos.y;
                snake_head.angle += inc_rot;

                window.requestAnimationFrame(function() {
                    animation(ROTATION_LEFT, curr+speed);
                });
                
            }
            break;
        case ROTATION_RIGHT:
            if (curr == 0) {
                initializeOldPos(snakeList.head);
                snake_head.anim = ROTATION_RIGHT;
                switch (snake_head.old_direction) {
                    case NORTH:
                        snake_head.direction = EAST;
                        inc_pos.x = -linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = -linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case SOUTH:
                        snake_head.direction = WEST;
                        inc_pos.x = linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case EAST:
                        snake_head.direction = SOUTH;
                        inc_pos.x = 0;
                        inc_pos.y = -linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = -linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        break;
                    case WEST:
                        snake_head.direction = NORTH;
                        inc_pos.x = 0;
                        inc_pos.y = linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        break;
                    default:
                        throw "animation(): facing_direction corrupted";
                }

                inc_rot = -linear_interpolation(speed, 0, max_curr, 0, 90);
                tot_tran.x=0; tot_tran.y=0; tot_rot=0;

            } 
            if (curr >= max_curr) {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                snake_head.angle = fix_round_error(snake_head.angle, 90)%360;

                var eye={};
                eye.delta_transl = [NaN, 0.0, NaN];
                eye.delta_angle = -90;

                var at={};

                if (inc_tran.y == 0) {
                    eye.delta_transl[2] = 0.0;
                    if (inc_tran.x>0) {
                        eye.delta_transl[0] = tile_size_max;
                    } else {
                        eye.delta_transl[0] = -tile_size_max;
                    }
                } else if (inc_tran.x == 0) {
                    eye.delta_transl[0] = 0.0;
                    if (inc_tran.y>0) {
                        eye.delta_transl[2] = tile_size_max;
                    } else {
                        eye.delta_transl[2] = -tile_size_max;
                    }
                } else {
                    throw "animation(): inconsistent inc_tran state"
                }
                at.delta_transl = eye.delta_transl;

                setCamera(eye, at, true);
                renderEnv();
                theta_food = (theta_food + 1) % 360;
                snake_head.pos = [snake_head.old_pos[0] + 1*sign(inc_tran.x), snake_head.old_pos[1] + 1*sign(inc_tran.y)];
                updateSnakePositions(snakeList.getSecond(), curr);
                renderEnvObjects(poss, [food, theta_food]);

                window.requestAnimationFrame(render);
            } else {
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var eye={};
                eye.delta_transl = [tot_tran.x, 0.0, tot_tran.y];
                eye.delta_angle = tot_rot;

                var at={};
                at.delta_transl = eye.delta_transl;

                setCamera(eye, at, false);
                renderEnv();
                theta_food = (theta_food + 1) % 360;
                updateSnakePositions(snakeList.getSecond(), curr);
                renderEnvObjects(poss, [food, theta_food]);

                tot_rot    += inc_rot;
                tot_tran.x += inc_tran.x;
                tot_tran.y += inc_tran.y;

                snake_head.pos[0] += inc_pos.x;
                snake_head.pos[1] += inc_pos.y;
                snake_head.angle += inc_rot;

            window.requestAnimationFrame(function() {
                animation(ROTATION_RIGHT, curr+speed);
            });

            }
            break;
        case FORWARD:
                if (curr == 0) {
                    initializeOldPos(snakeList.head);
                    snake_head.anim = FORWARD;
                    switch (snake_head.old_direction) {
                        case WEST:
                            inc_pos.x = linear_interpolation(speed, 0, max_curr/2, 0, 1);
                            inc_pos.y = 0;
                            inc_tran.x = linear_interpolation(speed, 0, max_curr/2, 0, tile_size_max);
                            inc_tran.y = 0;
                            break;
                        case EAST:
                            inc_pos.x = -linear_interpolation(speed, 0, max_curr/2, 0, 1);
                            inc_pos.y = 0;
                            inc_tran.x = -linear_interpolation(speed, 0, max_curr/2, 0, tile_size_max);
                            inc_tran.y = 0;
                            break;
                        case NORTH:
                            inc_pos.x = 0;
                            inc_pos.y = linear_interpolation(speed, 0, max_curr/2, 0, 1);
                            inc_tran.x = 0;
                            inc_tran.y = linear_interpolation(speed, 0, max_curr/2, 0, tile_size_max);
                            break;
                        case SOUTH:
                            inc_pos.x = 0;
                            inc_pos.y = -linear_interpolation(speed, 0, max_curr/2, 0, 1);
                            inc_tran.x = 0;
                            inc_tran.y = -linear_interpolation(speed, 0, max_curr/2, 0, tile_size_max);
                            break;
                        default:
                            throw "animation(): facing_direction corrupted";
                    }
                    tot_tran.x=0; tot_tran.y=0;
                }
                if (curr >= max_curr) {
                    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    var eye={};
                    eye.delta_transl = [NaN, 0.0, NaN];
                    eye.delta_angle = 0;

                    if (inc_tran.y == 0) {
                        eye.delta_transl[2] = 0.0;
                        if (inc_tran.x>0) {
                            eye.delta_transl[0] = tile_size_max;
                        } else {
                            eye.delta_transl[0] = -tile_size_max;
                        }
                    } else if (inc_tran.x == 0) {
                        eye.delta_transl[0] = 0.0;
                        if (inc_tran.y>0) {
                            eye.delta_transl[2] = tile_size_max;
                        } else {
                            eye.delta_transl[2] = -tile_size_max;
                        }
                    } else {
                        throw "animation(): inconsistent inc_tran state"
                    }

                    var at={};
                    at.delta_transl = eye.delta_transl;

                    setCamera(eye, at, true);
                    renderEnv();
                    theta_food = (theta_food + 1) % 360;
                    snake_head.pos = [snake_head.old_pos[0] + 1*sign(inc_tran.x), snake_head.old_pos[1] + 1*sign(inc_tran.y)];
                    updateSnakePositions(snakeList.getSecond(), curr);
                    renderEnvObjects(poss, [food, theta_food]);
                    window.requestAnimationFrame(render);
                } else {
                    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    var eye={};
                    eye.delta_transl = [tot_tran.x, 0.0, tot_tran.y];
                    eye.delta_angle = 0;

                    var at={};
                    at.delta_transl = eye.delta_transl;

                    setCamera(eye, at, false);
                    renderEnv();
                    theta_food = (theta_food + 1) % 360;
                    updateSnakePositions(snakeList.getSecond(), curr);
                    renderEnvObjects(poss, [food, theta_food]);

                    tot_tran.x += inc_tran.x;
                    tot_tran.y += inc_tran.y;

                    snake_head.pos[0] += inc_pos.x;
                    snake_head.pos[1] += inc_pos.y;
           
                    window.requestAnimationFrame(function() {
                        animation(FORWARD, curr+2*speed);
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
    renderEnvObjects(poss, [food, theta_food]);

    window.requestAnimationFrame(render);
}
