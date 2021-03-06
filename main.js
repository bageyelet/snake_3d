"use strict";
var canvas; var program;
var stats;

var points = 0;
var difficulty_level = 3;

var poss;
var food; var theta_food = 0;

var snake_head;
var snakeList = new List();
var facing_direction = NORTH;

//var curr_position = [Math.ceil(env_size_w/2), Math.ceil(env_size_h/2)];
var curr_position = [1, 4];
var at_eye  = vec3(curr_position[0]*tile_size_max + tile_size_min/2, 0.0 , curr_position[1]*tile_size_max + tile_size_min/2);
var eye_pos = vec3(at_eye[0], 1.25, at_eye[2]-2.0);
var up_eye  = vec3(0.0, 1.0 , 0.0);

var cameraMatrix; var projectionMatrix;
var vBuffer; var vPosition;
var nBuffer; var vNormal;
var tBuffer; var vTexCoord;

var uColor;
var uModelViewMatrix; var uProjectionMatrix; var uCameraMatrix;
var uDiffuseProduct; var uSpecularProduct; var uShininess;
var uText0;

var pause = true;

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
    gl.uniform4fv( uColor, BLUE);
    gl.uniform4fv( uDiffuseProduct, flatten(squareDiffuseProduct));
    gl.uniform4fv( uSpecularProduct, flatten(squareSpecularProduct));
    gl.uniform1f( uShininess, squareShininess);
    gl.uniform1i( uText0, WHITE_SQUARE_TEXTURES);
    //var scalematrix = scalem(tile_size_min,1.0,tile_size_min);

    for (var i=0; i<env_size_w; i++) {
        for (var j=0; j<env_size_h; j++) {
            if (food[0][0] == i && food[0][1] == j) {
                gl.uniform4fv( uColor, GREEN);
                //renderTile(mult(translate(tile_size_min/2 + tile_size_max*i , 0.0, tile_size_min/2 + tile_size_max*j), scalematrix));
            } else if (!rabbit_eated && rabbit_pos[0][0] == i && rabbit_pos[0][1] == j) {
                gl.uniform4fv( uColor, WHITE);
            } else {
                gl.uniform4fv( uColor, environment[i][j].color);
                //renderTile(mult(translate(tile_size_min/2 + tile_size_max*i , 0.0, tile_size_min/2 + tile_size_max*j), scalematrix));
            }
            renderTile(environment[i][j].modelView);
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

            gl.uniform1i(uText0, WHITE_TRIANGLE_TEXTURES);

            for (var i=0; i<len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX , 0.01,tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, piramid_scalematrix);
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[PIRAMID], lenPiramidArray);
            }

            break;
        case PARALLELEPIPED:

            gl.uniform4fv( uColor, GREEN);
            gl.uniform4fv( uDiffuseProduct, flatten(parallelepipedDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(parallelepipedSpecularProduct));
            gl.uniform1f( uShininess, parallelepipedShininess);

            gl.uniform1i(uText0, WHITE_SQUARE_TEXTURES);

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

            gl.uniform4fv( uColor, PURPLE);
            gl.uniform4fv( uDiffuseProduct, flatten(snakeDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(snakeSpecularProduct));
            gl.uniform1f( uShininess, snakeShininess);

            gl.uniform1i(uText0, WHITE_TRIANGLE_TEXTURES);

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

            gl.uniform4fv( uColor, PURPLE);
            gl.uniform4fv( uDiffuseProduct, flatten(snakeDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(snakeSpecularProduct));
            gl.uniform1f( uShininess, snakeShininess);

            gl.uniform1i(uText0, WHITE_SQUARE_TEXTURES);

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

            gl.uniform4fv( uColor, PURPLE);
            gl.uniform4fv( uDiffuseProduct, flatten(snakeDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(snakeSpecularProduct));
            gl.uniform1f( uShininess, snakeShininess);

            gl.uniform1i(uText0, WHITE_TRIANGLE_TEXTURES);

            for (var i = 0; i < len; i++) {
                var posX = positions[i][0]; var posY = positions[i][1];
                var rotationmatrix = rotate(theta, [0, 1, 0] );
                var translateMatrix = translate(tile_size_min/2 + tile_size_max*posX, 0.01, tile_size_min/2 + tile_size_max*posY);
                var modelViewMatrix = mult(translateMatrix, mult(rotationmatrix, snaketail_scalematrix));
                gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(modelViewMatrix));
                gl.drawArrays(gl.TRIANGLES, buffer_indexes[SNAKETAIL], lenSnaketailArray);
            }
            break;

        case RABBIT:
            gl.uniform4fv( uColor, WHITE);
            gl.uniform4fv( uDiffuseProduct, flatten(parallelepipedDiffuseProduct));
            gl.uniform4fv( uSpecularProduct, flatten(parallelepipedSpecularProduct));
            gl.uniform1f( uShininess, parallelepipedShininess);

            gl.uniform1i(uText0, WHITE_SQUARE_TEXTURES);
            renderRabbit();
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
        } else if (event.keyCode == 80) {
            pause = !pause;
            if (pause) 
                document.getElementById("points").innerHTML += " PAUSED";
            else
                updatePoints(points);
        }
    });

    // document.getElementById("inc_diff").onclick = function() {
    //     pause = true;
    //     max_curr = max_curr<= 50 ? max_curr : max_curr - 50;
    //     initializePositionUpdater();
    //     initializeRabbitIncs();
    //     difficulty_level += 1;
    //     var difficulty = document.getElementById( "difficulty" );
    //     difficulty.innerHTML = "CURRENT DIFFICULTY: " + difficulty_level;
    //     pause = false;
    // };
    // document.getElementById("dec_diff").onclick = function() {
    //     pause = true;
    //     max_curr = max_curr>=300 ? max_curr : max_curr + 50;
    //     initializePositionUpdater();
    //     initializeRabbitIncs();
    //     difficulty_level -= 1;
    //     var difficulty = document.getElementById( "difficulty" );
    //     difficulty.innerHTML = "CURRENT DIFFICULTY: " + difficulty_level;
    //     pause = false;
    // };
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    canvas.width = window.innerWidth-35;
    canvas.height = window.innerHeight-250;
    canvas.style.display = "block";

    var instructions = document.getElementById( "instructions" );
    instructions.style.position = "absolute";
    instructions.style.top = canvas.height + 10;
    instructions.style.left = canvas.width/2;
    instructions.style.color = "white";

    // var difficulty = document.getElementById( "difficulty" );
    // difficulty.style.position = "absolute";
    // difficulty.style.top = canvas.height + 10;
    // difficulty.style.left = canvas.width/2;
    // difficulty.style.color = "white";

    // stats = new Stats();
    // stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.left = '8px';
    // stats.domElement.style.top = '8px';
    // document.body.appendChild( stats.dom );

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
    uText0 = gl.getUniformLocation( program, "Tex0");

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

    var allTextures = squareTexCoordsArray.concat(piramidTexCoordsArray).concat(parallelepipedTexCoordsArray).concat(snakeheadTexCoordsArray)
                        .concat(snakebodyTexCoordsArray).concat(snaketailTexCoordsArray);

    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(allTextures), gl.STATIC_DRAW );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    initSquareWhiteTexture(gl);
    initTriangleWhiteTexture(gl);

    initializePositionUpdater();

    poss = []; var k = 0;
    // for (var i=0; i<env_size_w; i++) {
    //     poss[k] = [i, 0]; k+=1;
    //     poss[k] = [i, env_size_h-1]; k+=1;
    // } for (var i=1; i<env_size_h-1; i++) {
    //     poss[k] = [0, i]; k+=1;
    //     poss[k] = [env_size_w-1, i]; k+=1;
    // }
    poss.push([Math.round(env_size_w/2)-1, Math.round(env_size_h/2)-1]);
    poss.push([Math.round(env_size_w/2)  , Math.round(env_size_h/2)-1]);
    poss.push([Math.round(env_size_w/2)-1, Math.round(env_size_h/2)  ]);
    poss.push([Math.round(env_size_w/2)  , Math.round(env_size_h/2)  ]);    

    food = [[3, 3]];
    rabbit_pos = [[3, 4]];
    initRabbitStuff(uModelViewMatrix, gl);

    environment = build_env_matrix(env_size_w, env_size_h, food, poss, rabbit_pos);

    snake_head = {};
    snake_head.type = SNAKEHEAD;
    snake_head.pos = [1, 4];
    snake_head.angle = 0;
    snake_head.direction = NORTH;
    snake_head.anim = null;

    snakeList.add({type:SNAKETAIL, pos:[snake_head.pos[0], snake_head.pos[1]-2], angle:snake_head.angle, direction:snake_head.direction, anim: FORWARD});
    snakeList.add({type:SNAKEBODY, pos:[snake_head.pos[0], snake_head.pos[1]-1], angle:snake_head.angle, direction:snake_head.direction, anim: FORWARD});
    snakeList.add(snake_head);    

    initializeOldPos(snakeList.head);
    updateSnakeEnv(environment, snakeList.head);

    renderEnv();
    renderEnvObjects(poss, [food, 0]);
    renderObject(RABBIT, rabbit);

    bindButtons();
    anim_counter=0; anim=false; cur_anim = null;
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
                        snake_head.future_position = [snake_head.pos[0]+1, snake_head.pos[1]];
                        inc_pos.x = linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case SOUTH:
                        snake_head.direction = EAST;
                        snake_head.future_position = [snake_head.pos[0]-1, snake_head.pos[1]];
                        inc_pos.x = -linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = -linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case EAST:
                        snake_head.direction = NORTH;
                        snake_head.future_position = [snake_head.pos[0], snake_head.pos[1]+1];
                        inc_pos.x = 0;
                        inc_pos.y = linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        break;
                    case WEST:
                        snake_head.direction = SOUTH;
                        snake_head.future_position = [snake_head.pos[0], snake_head.pos[1]-1];
                        inc_pos.x = 0;
                        inc_pos.y = -linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = -linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        break;
                    default:
                        throw "animation(): facing_direction corrupted";
                }

                if (checkLose()) {
                    alert("you lose");
                    window.location.reload(false);
                }
                if (checkFood()) {
                    points += 1;
                    updatePoints(points);
                    snakeList.copySecond();
                    snakeList.head.next.next.data.copyied = true;
                    food = [generateFood(env_size_w, env_size_h, environment, false)];
                }
                if (checkRabbit()) {
                    points += 5;
                    updatePoints(points);
                    snakeList.copySecond();
                    snakeList.head.next.next.data.copyied = true;
                    // rabbit_pos = null;
                    rabbit_eated = true;
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

                updateSnakeEnv(environment, snakeList.head);
                anim_counter=0; anim=false; cur_anim = null;
                // window.requestAnimationFrame(render);
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

                // window.requestAnimationFrame(function() {
                //     animation(ROTATION_LEFT, curr+speed);
                // });
                
            }
            break;
        case ROTATION_RIGHT:
            if (curr == 0) {
                initializeOldPos(snakeList.head);
                snake_head.anim = ROTATION_RIGHT;
                switch (snake_head.old_direction) {
                    case NORTH:
                        snake_head.direction = EAST;
                        snake_head.future_position = [snake_head.pos[0]-1, snake_head.pos[1]];
                        inc_pos.x = -linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = -linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case SOUTH:
                        snake_head.direction = WEST;
                        snake_head.future_position = [snake_head.pos[0]+1, snake_head.pos[1]];
                        inc_pos.x = linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_pos.y = 0;
                        inc_tran.x = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        inc_tran.y = 0;
                        break;
                    case EAST:
                        snake_head.direction = SOUTH;
                        snake_head.future_position = [snake_head.pos[0], snake_head.pos[1]-1];
                        inc_pos.x = 0;
                        inc_pos.y = -linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = -linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        break;
                    case WEST:
                        snake_head.direction = NORTH;
                        snake_head.future_position = [snake_head.pos[0], snake_head.pos[1]+1];
                        inc_pos.x = 0;
                        inc_pos.y = linear_interpolation(speed, 0, max_curr, 0, 1);
                        inc_tran.x = 0;
                        inc_tran.y = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
                        break;
                    default:
                        throw "animation(): facing_direction corrupted";
                }

                if (checkLose()) {
                    alert("you lose");
                    window.location.reload(false);
                }
                if (checkFood()) {
                    points += 1;
                    updatePoints(points);
                    snakeList.copySecond();
                    snakeList.head.next.next.data.copyied = true;
                    food = [generateFood(env_size_w, env_size_h, environment, false)];
                }
                if (checkRabbit()) {
                    points += 5;
                    updatePoints(points);
                    snakeList.copySecond();
                    snakeList.head.next.next.data.copyied = true;
                    // rabbit_pos = null;
                    rabbit_eated = true;
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

                updateSnakeEnv(environment, snakeList.head);
                anim_counter=0; anim=false; cur_anim = null;
                // window.requestAnimationFrame(render);
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

            // window.requestAnimationFrame(function() {
            //     animation(ROTATION_RIGHT, curr+speed);
            // });

            }
            break;
        case FORWARD:
                if (curr == 0) {
                    initializeOldPos(snakeList.head);
                    snake_head.anim = FORWARD;
                    switch (snake_head.old_direction) {
                        case WEST:
                            snake_head.future_position = [snake_head.pos[0]+1, snake_head.pos[1]];
                            inc_pos.x = linear_interpolation(speed, 0, max_curr/2, 0, 1);
                            inc_pos.y = 0;
                            inc_tran.x = linear_interpolation(speed, 0, max_curr/2, 0, tile_size_max);
                            inc_tran.y = 0;
                            break;
                        case EAST:
                            snake_head.future_position = [snake_head.pos[0]-1, snake_head.pos[1]];
                            inc_pos.x = -linear_interpolation(speed, 0, max_curr/2, 0, 1);
                            inc_pos.y = 0;
                            inc_tran.x = -linear_interpolation(speed, 0, max_curr/2, 0, tile_size_max);
                            inc_tran.y = 0;
                            break;
                        case NORTH:
                            snake_head.future_position = [snake_head.pos[0], snake_head.pos[1]+1];
                            inc_pos.x = 0;
                            inc_pos.y = linear_interpolation(speed, 0, max_curr/2, 0, 1);
                            inc_tran.x = 0;
                            inc_tran.y = linear_interpolation(speed, 0, max_curr/2, 0, tile_size_max);
                            break;
                        case SOUTH:
                            snake_head.future_position = [snake_head.pos[0], snake_head.pos[1]-1];
                            inc_pos.x = 0;
                            inc_pos.y = -linear_interpolation(speed, 0, max_curr/2, 0, 1);
                            inc_tran.x = 0;
                            inc_tran.y = -linear_interpolation(speed, 0, max_curr/2, 0, tile_size_max);
                            break;
                        default:
                            throw "animation(): facing_direction corrupted";
                    }
                    if (checkLose()) {
                        alert("you lose");
                        window.location.reload(false);
                    }
                    if (checkFood()) {
                        points += 1;
                        updatePoints(points);
                        snakeList.copySecond();
                        snakeList.head.next.next.data.copyied = true;
                        food = [generateFood(env_size_w, env_size_h, environment, false)];
                    }
                    if (checkRabbit()) {
                        points += 5;
                        updatePoints(points);
                        snakeList.copySecond();
                        snakeList.head.next.next.data.copyied = true;
                        // rabbit_pos = null;
                        rabbit_eated = true;
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
                    
                    updateSnakeEnv(environment, snakeList.head);

                    anim_counter=0; anim=false; cur_anim = null;
                    // window.requestAnimationFrame(render);
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
           
                    // window.requestAnimationFrame(function() {
                    //     animation(FORWARD, curr+2*speed);
                    // });
                }
            break;
        default:
            throw "animation(): wrong type";
    }
}

function checkLose() {
    if (snake_head.future_position[0] >= env_size_w || snake_head.future_position[1] >= env_size_h || snake_head.future_position[0] < 0 || snake_head.
            future_position[1] < 0)
        return true;
    var head_env = environment[snake_head.future_position[0]][snake_head.future_position[1]].element;
    if ( head_env == PIRAMID || head_env == SNAKEBODY || head_env == SNAKETAIL ) {
        return true;
    }
    return false;
}

function checkFood() {
    if (environment[snake_head.future_position[0]][snake_head.future_position[1]].element == PARALLELEPIPED)
        return true;
    return false;
}

function checkRabbit() {
    if (!rabbit_eated && snake_head.future_position[0] == rabbit_pos[0][0] && snake_head.future_position[1] == rabbit_pos[0][1])
        return true;
    return false;
}

var anim = false; var cur_anim = null; var anim_counter = 0;
function render() {

    if (pause) {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderEnv();
        theta_food = (theta_food + 1) % 360;
        renderEnvObjects(poss, [food, theta_food]);
    } else {
        if (anim==false) {
            if (rabbit_eated) {
                reinitializeRabbit();
                rabbit_eated = false;
            }
            if (leftKeyPressed) {
                anim = true;
                anim_counter = 0;
                leftKeyPressed = false;
                cur_anim = ROTATION_LEFT;
                // if (!rabbit_eated)
                    animateRabbit(anim_counter);
                animation(ROTATION_LEFT, anim_counter);
            } else if (rightKeyPressed) {
                anim = true;
                anim_counter = 0;
                rightKeyPressed = false;
                cur_anim = ROTATION_RIGHT;
                // if (!rabbit_eated)
                    animateRabbit(anim_counter);
                animation(ROTATION_RIGHT, anim_counter);
            } else if (upKeyPressed) {
                anim = true;
                anim_counter = 0;
                upKeyPressed = false;
                cur_anim = FORWARD;
                // if (!rabbit_eated)
                    animateRabbit(anim_counter);
                animation(FORWARD, anim_counter);
            } else {
                // gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                // renderEnv();
                // theta_food = (theta_food + 1) % 360;
                // renderEnvObjects(poss, [food, theta_food]);
                anim = true;
                anim_counter = 0;
                upKeyPressed = false;
                cur_anim = FORWARD;
                // if (!rabbit_eated)
                    animateRabbit(anim_counter);
                animation(FORWARD, anim_counter);
            }
        } else {
            if (cur_anim == FORWARD)
                anim_counter+=2*speed;
            else
                anim_counter+=speed;
            // if (!rabbit_eated)
                animateRabbit(anim_counter);
            animation(cur_anim, anim_counter);
        }
    }
    // if (!rabbit_eated)
        renderObject(RABBIT, [[]]);
    setTimeout(function() {
        window.requestAnimationFrame(render);
    }, 1000 / 50);

    // window.requestAnimationFrame(render);
}
