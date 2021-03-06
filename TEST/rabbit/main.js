var gl; var canvas; var program;

var modelViewMatrix; var instanceMatrix; var projectionMatrix;
var modelViewMatrixLoc;

var alpha = 0; var beta = 0; var r = 3;
var eye = vec3(0, 0, r);
var at  = vec3(0.0, 0.0, 0.0); var up  = vec3(0.0, 1.0, 0.0);

var theta = [];
theta[RABBIT_BODY] = -20; theta[RABBIT_LEG_UP_L] = 0; theta[RABBIT_LEG_UP_R] = 0;
theta[RABBIT_ARM_L] = 20; theta[RABBIT_ARM_R] = 20;
theta[RABBIT_HEAD] = 20;
theta[RABBIT_LEG_DOWN_L] = 20; theta[RABBIT_LEG_DOWN_R] = 20;
theta[RABBIT_EAR_L] = 15; theta[RABBIT_EAR_R] = -15;

var facing_angle = 0;

var pos_body = [0, 0, 0];
 
rabbit = [];

var animation = false; var reset = false;

function render_body() {
    instanceMatrix =mult(modelViewMatrix, scalem(rabbit_body_dim.x, rabbit_body_dim.y, rabbit_body_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
}

function render_leg_up() {
    instanceMatrix = mult(modelViewMatrix, scalem(rabbit_leg_up_dim.x, rabbit_leg_up_dim.y, rabbit_leg_up_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
}

function reder_leg_down() {
    instanceMatrix = mult(translate(0, 0, rabbit_leg_down_dim.z/2), scalem(rabbit_leg_down_dim.x, rabbit_leg_down_dim.y, rabbit_leg_down_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
}

function render_arm() {
    instanceMatrix = mult(translate(0, -rabbit_arm_dim.y/2, 0), scalem(rabbit_arm_dim.x, rabbit_arm_dim.y, rabbit_arm_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
}

function render_head() {
    instanceMatrix = mult(modelViewMatrix, scalem(rabbit_head_dim.x, rabbit_head_dim.y, rabbit_head_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
}

function render_ear() {
    instanceMatrix = mult(translate(0, rabbit_ear_dim.y/2, 0), scalem(rabbit_ear_dim.x, rabbit_ear_dim.y, rabbit_ear_dim.z));
    instanceMatrix = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
}

function render_nose() {
    instanceMatrix = mult(modelViewMatrix, scalem(rabbit_nose_dim.x, rabbit_nose_dim.y, rabbit_nose_dim.z));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, lenParallelepipedArray);
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
                        - rabbit_leg_up_dim.y/2, 
                        - rabbit_leg_down_dim.z/2 ), 
                      rotate(theta[RABBIT_LEG_DOWN_L], [1,0,0]));
            rabbit[RABBIT_LEG_DOWN_L] = createNode(m, reder_leg_down, null, null);
            break;
        case RABBIT_LEG_DOWN_R:
            m = mult( translate(
                        0, 
                        - rabbit_leg_up_dim.y/2, 
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

function initButtons() {
    document.getElementById("camera_slider_xz").onchange = function(event) {
        alpha = event.target.value;
        r = 3.0*Math.cos(radians(beta));
        eye = vec3(r*Math.sin(radians(alpha)), r*Math.sin(radians(beta)), r*Math.cos(radians(alpha)));
        cameraMatrix = lookAt(eye, at , up);
        gl.uniformMatrix4fv( gl.getUniformLocation( program, "cameraMatrix"), false, flatten(cameraMatrix) );
    };
    document.getElementById("camera_slider_yz").onchange = function(event) {
        beta = event.target.value;
        r = 3.0*Math.cos(radians(beta));
        eye = vec3(r*Math.sin(radians(alpha)), r*Math.sin(radians(beta)), r*Math.cos(radians(alpha)));
        cameraMatrix = lookAt(eye, at , up);
        gl.uniformMatrix4fv( gl.getUniformLocation( program, "cameraMatrix"), false, flatten(cameraMatrix) );
    };
    document.getElementById("start_animation").onclick = function(){phase =1;};
    document.getElementById("reset").onclick = function(){reset = true;};
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program );
    gl.enable(gl.DEPTH_TEST);

    var pointsArray = parallelepipedArray;
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var colorsArray = parallelepipedColorsArray;
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    instanceMatrix = mat4();
    modelViewMatrix = mat4();

    var near = 0.3; var far = 50.0; var  fovy = 45.0; var  aspect = canvas.width/canvas.height;
    projectionMatrix = perspective(fovy, aspect, near, far);
    cameraMatrix = lookAt(eye, at , up);
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "cameraMatrix"), false, flatten(cameraMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    initButtons();
    for (var i=0; i<=20; i++) initNode(i);

    var event = {}; event.target = {}; event.target.value = 50;
    document.getElementById("camera_slider_xz").onchange(event);
    event = {}; event.target = {}; event.target.value = 30;
    document.getElementById("camera_slider_yz").onchange(event);
    render();
}

var phase = 0; var count = 0; var max = 19;
var inc_body_1 = linear_interpolation(1, 0, max+1, -20, -5);
var inc_feet_1 = linear_interpolation(1, 0, max+1, 20, 5);
var inc_arm_1  = linear_interpolation(1, 0, max+1, 20, -40);
var inc_head_1 = linear_interpolation(1, 0, max+1, 20, 5);

var inc_body_2 = linear_interpolation(1, 0, max+1, -5, -40);
var inc_feet_2 = linear_interpolation(1, 0, max+1, 5, 60);
var inc_arm_2  = linear_interpolation(1, 0, max+1, -40, 40);
var inc_head_2 = linear_interpolation(1, 0, max+1, 5, 20);

var inc_pos_x = linear_interpolation(1, 0, 2*(max+1), 0, 0.2);
var inc_pos_y = linear_interpolation(1, 0, max+1, 0, 0.2);

var inc_body_3 = linear_interpolation(1, 0, max+1, -40, -20);
var inc_feet_3 = linear_interpolation(1, 0, max+1, 60, 20);
var inc_arm_3  = linear_interpolation(1, 0, max+1, 40, 20);
//var inc_head_3 = linear_interpolation(1, 0, max+1, 20, 20);

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    switch (phase) {
        case 1:
            if (count > max) {
                phase=2;
                count=0;
                theta[RABBIT_BODY] = -5;
                theta[RABBIT_LEG_DOWN_L] = 5;
                theta[RABBIT_LEG_DOWN_R] = 5;
                theta[RABBIT_ARM_L] = -40;
                theta[RABBIT_ARM_R] = -40;
                theta[RABBIT_HEAD] = 5;
                for (var i=0; i<=10; i++) {
                    initNode(i);
                }
                console.log(theta[RABBIT_BODY]);
            } else {
                theta[RABBIT_BODY] += inc_body_1;
                theta[RABBIT_LEG_DOWN_L] += inc_feet_1;
                theta[RABBIT_LEG_DOWN_R] += inc_feet_1;
                theta[RABBIT_ARM_L] += inc_arm_1;
                theta[RABBIT_ARM_R] += inc_arm_1;
                theta[RABBIT_HEAD] += inc_head_1;
                for (var i=0; i<=10; i++) {
                    initNode(i);
                }
            }
            count += 1;
            break;
        case 2:
            if (count > max) {
                phase=3;
                count=0;
                theta[RABBIT_BODY] = -40;
                theta[RABBIT_LEG_DOWN_L] = 60;
                theta[RABBIT_LEG_DOWN_R] = 60;
                theta[RABBIT_ARM_L] = 40;
                theta[RABBIT_ARM_R] = 40;
                theta[RABBIT_HEAD] = 20;

                //pos_body[2] = 0.2;
                //pos_body[1] = 0;

                for (var i=0; i<=10; i++) {
                    initNode(i);
                }
                console.log(theta[RABBIT_BODY]);
            } else {
                theta[RABBIT_BODY] += inc_body_2;
                theta[RABBIT_LEG_DOWN_L] += inc_feet_2;
                theta[RABBIT_LEG_DOWN_R] += inc_feet_2;
                theta[RABBIT_ARM_L] += inc_arm_2;
                theta[RABBIT_ARM_R] += inc_arm_2;
                theta[RABBIT_HEAD] += inc_head_2;
                pos_body[2] += inc_pos_x;
                pos_body[1] += inc_pos_y;
                
                for (var i=0; i<=10; i++) {
                    initNode(i);
                }
            }
            count += 1;
            break;
        case 3:
            if (count > max) {
                phase=0;
                count=0;
                theta[RABBIT_BODY] = -20;
                theta[RABBIT_LEG_DOWN_L] = 20;
                theta[RABBIT_LEG_DOWN_R] = 20;
                theta[RABBIT_ARM_L] = 20;
                theta[RABBIT_ARM_R] = 20;
                theta[RABBIT_HEAD] = 20;
                for (var i=0; i<=10; i++) {
                    initNode(i);
                }
                console.log(theta[RABBIT_BODY]);
            } else {
                theta[RABBIT_BODY] += inc_body_3;
                theta[RABBIT_LEG_DOWN_L] += inc_feet_3;
                theta[RABBIT_LEG_DOWN_R] += inc_feet_3;
                theta[RABBIT_ARM_L] += inc_arm_3;
                theta[RABBIT_ARM_R] += inc_arm_3;
                // theta[RABBIT_HEAD] += inc_head_3;
                pos_body[2] += inc_pos_x;
                pos_body[1] -= inc_pos_y;
                for (var i=0; i<=10; i++) {
                    initNode(i);
                }
            }
            count += 1;
            break;
        default:
            break;
    }

    traverse(RABBIT_BODY);
    window.requestAnimFrame(render);
    //facing_angle += 1; 
    for (var i=0; i<=10; i++) {
        initNode(i);
    }


    // if (animation && theta[0] < 90)
    //     for (var i=0; i<=14; i++) {
    //         theta[i] += 0.5;
    //         initNode(i);
    //     }
    // if (reset) {
    //     for (var i=0; i<=14; i++) {
    //         theta[i] = 0.0;
    //         initNode(i);
    //     }
    //     reset = false;
    //     animation = false;
    // }

    // traverse(RABBIT_BODY);
    // window.requestAnimFrame(render);
}
