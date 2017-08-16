"use strict";

var gl;

var modelViewMatrix; var instanceMatrix;
var modelViewMatrixLoc;

var theta = [];
theta[RABBIT_BODY] = -20; theta[RABBIT_LEG_UP_L] = 0; theta[RABBIT_LEG_UP_R] = 0;
theta[RABBIT_ARM_L] = 20; theta[RABBIT_ARM_R] = 20;
theta[RABBIT_HEAD] = 20;
theta[RABBIT_LEG_DOWN_L] = 20; theta[RABBIT_LEG_DOWN_R] = 20;
theta[RABBIT_EAR_L] = 15; theta[RABBIT_EAR_R] = -15;

var facing_angle = 0;

var pos_body = [0, 0.05, 0];
var rabbit_pos;
var rabbit_facing_direction = NORTH;
 
var rabbit = [];

function render_body() {
    instanceMatrix =mult(modelViewMatrix, scalem(rabbit_body_dim.x, rabbit_body_dim.y, rabbit_body_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELEPIPED], lenParallelepipedArray);
}

function render_leg_up() {
    instanceMatrix = mult(modelViewMatrix, scalem(rabbit_leg_up_dim.x, rabbit_leg_up_dim.y, rabbit_leg_up_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELEPIPED], lenParallelepipedArray);
}

function reder_leg_down() {
    instanceMatrix = mult(translate(0, 0, rabbit_leg_down_dim.z/2), scalem(rabbit_leg_down_dim.x, rabbit_leg_down_dim.y, rabbit_leg_down_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELEPIPED], lenParallelepipedArray);
}

function render_arm() {
    instanceMatrix = mult(translate(0, -rabbit_arm_dim.y/2, 0), scalem(rabbit_arm_dim.x, rabbit_arm_dim.y, rabbit_arm_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELEPIPED], lenParallelepipedArray);
}

function render_head() {
    instanceMatrix = mult(modelViewMatrix, scalem(rabbit_head_dim.x, rabbit_head_dim.y, rabbit_head_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELEPIPED], lenParallelepipedArray);
}

function render_ear() {
    instanceMatrix = mult(translate(0, rabbit_ear_dim.y/2, 0), scalem(rabbit_ear_dim.x, rabbit_ear_dim.y, rabbit_ear_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELEPIPED], lenParallelepipedArray);
}

function render_nose() {
    instanceMatrix = mult(modelViewMatrix, scalem(rabbit_nose_dim.x, rabbit_nose_dim.y, rabbit_nose_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, buffer_indexes[PARALLELEPIPED], lenParallelepipedArray);
}


function initNode(id) {
    var m = mat4();
    switch(id) {
        case RABBIT_BODY:
            m = mult( translate(
                        pos_body[0],
                        pos_body[1],
                        pos_body[2]),
                      rotate(facing_angle, [0,1,0]));
            m = mult( m, rotate(theta[RABBIT_BODY], [1,0,0]));
            rabbit[RABBIT_BODY] = createNode(m, render_body, null, RABBIT_LEG_UP_L);
            break;
        case RABBIT_LEG_UP_L:
            m = mult( translate(
                        rabbit_body_dim.x/2, 
                        -rabbit_body_dim.y/2 + 0.2*rabbit_body_dim.y, 
                        -rabbit_body_dim.z/2+0.2*rabbit_body_dim.z), 
                      rotate(theta[RABBIT_LEG_UP_L], [1,0,0]));
            rabbit[RABBIT_LEG_UP_L] = createNode(m, render_leg_up, RABBIT_LEG_UP_R, RABBIT_LEG_DOWN_L);
            break;
        case RABBIT_LEG_UP_R:
            m = mult( translate(
                        -rabbit_body_dim.x/2, 
                        -rabbit_body_dim.y/2 + 0.2*rabbit_body_dim.y, 
                        -rabbit_body_dim.z/2+0.2*rabbit_body_dim.z), 
                      rotate(theta[RABBIT_LEG_UP_R], [1,0,0]));
            rabbit[RABBIT_LEG_UP_R] = createNode(m, render_leg_up, RABBIT_ARM_L, RABBIT_LEG_DOWN_R);
            break;
        case RABBIT_ARM_L:
            m = mult( translate(
                        rabbit_body_dim.x/2, 
                        -rabbit_body_dim.y/2 + 0.2*rabbit_arm_dim.y , 
                        rabbit_body_dim.z/2 - rabbit_arm_dim.z/2), 
                      rotate(theta[RABBIT_ARM_L], [1,0,0]));
            rabbit[RABBIT_ARM_L] = createNode(m, render_arm, RABBIT_ARM_R, null);
            break;
        case RABBIT_ARM_R:
            m = mult( translate(
                        -rabbit_body_dim.x/2, 
                        -rabbit_body_dim.y/2 + 0.2*rabbit_arm_dim.y, 
                        rabbit_body_dim.z/2 - rabbit_arm_dim.z/2), 
                      rotate(theta[RABBIT_ARM_R], [1,0,0]));
            rabbit[RABBIT_ARM_R] = createNode(m, render_arm, RABBIT_HEAD, null);
            break;
        case RABBIT_HEAD:
            m = mult( translate(
                        0, 
                        rabbit_body_dim.y/4, 
                        rabbit_body_dim.z/2 + rabbit_head_dim.z/2), 
                      rotate(theta[RABBIT_HEAD], [1,0,0]));
            rabbit[RABBIT_HEAD] = createNode(m, render_head, null, RABBIT_EAR_L);
            break;
        case RABBIT_LEG_DOWN_L:
            m = mult( translate(
                        0, 
                        - rabbit_leg_down_dim.y/2, 
                        - rabbit_leg_down_dim.z/2 ), 
                      rotate(theta[RABBIT_LEG_DOWN_L], [1,0,0]));
            rabbit[RABBIT_LEG_DOWN_L] = createNode(m, reder_leg_down, null, null);
            break;
        case RABBIT_LEG_DOWN_R:
            m = mult( translate(
                        0, 
                        - rabbit_leg_down_dim.y/2, 
                        - rabbit_leg_down_dim.z/2 ), 
                      rotate(theta[RABBIT_LEG_DOWN_R], [1,0,0]));
            rabbit[RABBIT_LEG_DOWN_R] = createNode(m, reder_leg_down, null, null);
            break;
        case RABBIT_EAR_L:
            m = mult( translate(
                        - rabbit_head_dim.x/2 + rabbit_ear_dim.x/2 , 
                        rabbit_ear_dim.y/2, 
                        - rabbit_head_dim.z/2 + rabbit_ear_dim.z/2), 
                      rotate(theta[RABBIT_EAR_L], [0,1,0]));
            rabbit[RABBIT_EAR_L] = createNode(m, render_ear, RABBIT_EAR_R, null);
            break;
        case RABBIT_EAR_R:
            m = mult( translate(
                        + rabbit_head_dim.x/2 - rabbit_ear_dim.x/2 , 
                        rabbit_ear_dim.y/2, 
                        - rabbit_head_dim.z/2 + rabbit_ear_dim.z/2), 
                      rotate(theta[RABBIT_EAR_R], [0,1,0]));
            rabbit[RABBIT_EAR_R] = createNode(m, render_ear, RABBIT_NOSE, null);
            break;
        case RABBIT_NOSE:
            m = translate(
                        0, 
                        0, 
                        rabbit_head_dim.z/2 + rabbit_nose_dim.z/2);
            rabbit[RABBIT_NOSE] = createNode(m, render_nose, null, null);
            break;
        default:
            console.log("something wrong");
    }
}

var stack = []
function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, rabbit[Id].transform);
   rabbit[Id].render();
   if(rabbit[Id].child != null) traverse(rabbit[Id].child);
    modelViewMatrix = stack.pop();
   if(rabbit[Id].sibling != null) traverse(rabbit[Id].sibling);
}

function initRabbitStuff(_modelViewMatrixLoc, _gl) {
    modelViewMatrixLoc = _modelViewMatrixLoc;
    modelViewMatrix = mat4();
    instanceMatrix = mat4();
    gl = _gl;
    pos_body[0] = tile_size_min/2 + rabbit_pos[0][0] * tile_size_max;
    pos_body[1] = 0.08;
    pos_body[2] = tile_size_min/2 + rabbit_pos[0][1] * tile_size_max;
}

function renderRabbit() {
    for (var i=0; i<=10; i++)
        initNode(i);
    traverse(RABBIT_BODY);
}

var phase = 0; 

var inc_pos_x = linear_interpolation(speed, 0, max_curr, 0, tile_size_max);
var inc_pos_y = linear_interpolation(speed, 0, 2*max_curr, 0, tile_size_max);

var inc_body_1 = linear_interpolation(speed, 0, max_curr/3, -20, -5);
var inc_feet_1 = linear_interpolation(speed, 0, max_curr/3, 20, 5);
var inc_arm_1  = linear_interpolation(speed, 0, max_curr/3, 20, -40);
var inc_head_1 = linear_interpolation(speed, 0, max_curr/3, 20, 5);

var inc_body_2 = linear_interpolation(speed, 0, max_curr/3, -5, -40);
var inc_feet_2 = linear_interpolation(speed, 0, max_curr/3, 5, 60);
var inc_arm_2  = linear_interpolation(speed, 0, max_curr/3, -40, 40);
var inc_head_2 = linear_interpolation(speed, 0, max_curr/3, 5, 20);

var inc_body_3 = linear_interpolation(speed, 0, max_curr/3, -40, -20);
var inc_feet_3 = linear_interpolation(speed, 0, max_curr/3, 60, 20);
var inc_arm_3  = linear_interpolation(speed, 0, max_curr/3, 40, 20);

function animateRabbit(i) {
    console.log("ciao", i);
    if (i==0) {
        switch (rabbit_facing_direction) {
            case NORTH:
                rabbit_pos[0][0] += 0;
                rabbit_pos[0][1] += 1;
                break;
            case SOUTH:
                break;
            case EAST:
                break;
            case WEST:
                break;
        }
    } else if (i >= max_curr) {
        pos_body[0] = tile_size_min/2 + rabbit_pos[0][0] * tile_size_max;
        pos_body[1] = 0.08;
        pos_body[2] = tile_size_min/2 + rabbit_pos[0][1] * tile_size_max;
        theta[RABBIT_BODY] = -20;
        theta[RABBIT_LEG_DOWN_L] = 20;
        theta[RABBIT_LEG_DOWN_R] = 20;
        theta[RABBIT_ARM_L] = 20;
        theta[RABBIT_ARM_R] = 20;
        theta[RABBIT_HEAD] = 20;
    } else {
        if (i < max_curr/3) {
            theta[RABBIT_BODY] += cur_anim == FORWARD?2*inc_body_1:inc_body_1;
            theta[RABBIT_LEG_DOWN_L] += cur_anim == FORWARD?2*inc_feet_1:inc_feet_1;
            theta[RABBIT_LEG_DOWN_R] += cur_anim == FORWARD?2*inc_feet_1:inc_feet_1;
            theta[RABBIT_ARM_L] += cur_anim == FORWARD?2*inc_arm_1:inc_arm_1;
            theta[RABBIT_ARM_R] += cur_anim == FORWARD?2*inc_arm_1:inc_arm_1;
            theta[RABBIT_HEAD] += cur_anim == FORWARD?2*inc_head_1:inc_head_1;
        } else if (i < 2*max_curr/3 && i >= max_curr/3) {
            theta[RABBIT_BODY] += cur_anim == FORWARD?2*inc_body_2:inc_body_2;
            theta[RABBIT_LEG_DOWN_L] += cur_anim == FORWARD?2*inc_feet_2:inc_feet_2;
            theta[RABBIT_LEG_DOWN_R] += cur_anim == FORWARD?2*inc_feet_2:inc_feet_2;
            theta[RABBIT_ARM_L] += cur_anim == FORWARD?2*inc_arm_2:inc_arm_2;
            theta[RABBIT_ARM_R] += cur_anim == FORWARD?2*inc_arm_2:inc_arm_2;
            theta[RABBIT_HEAD] += cur_anim == FORWARD?2*inc_head_2:inc_head_2;
        } else {
            theta[RABBIT_BODY] += cur_anim == FORWARD?2*inc_body_3:inc_body_3;
            theta[RABBIT_LEG_DOWN_L] += cur_anim == FORWARD?2*inc_feet_3:inc_feet_3;
            theta[RABBIT_LEG_DOWN_R] += cur_anim == FORWARD?2*inc_feet_3:inc_feet_3;
            theta[RABBIT_ARM_L] += cur_anim == FORWARD?2*inc_arm_3:inc_arm_3;
            theta[RABBIT_ARM_R] += cur_anim == FORWARD?2*inc_arm_3:inc_arm_3;
        }
        switch (rabbit_facing_direction) {
            case NORTH:
                pos_body[2] += cur_anim == FORWARD?2*inc_pos_x:inc_pos_x;
                break;
            case SOUTH:
                break;
            case EAST:
                break;
            case WEST:
                break;
        }
        if (i<max_curr/2)
            pos_body[1] += cur_anim == FORWARD?2*inc_pos_y:inc_pos_y;
        else
            pos_body[1] -= cur_anim == FORWARD?2*inc_pos_y:inc_pos_y;
    }
}