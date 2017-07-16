"use strict";

function createNode(transform, render, sibling, child) {
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}

var stack = [];
var modelViewMatrix = mat4();
function traverse(figure, Id) {
    if(Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render(modelViewMatrix);
    if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
    if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function mult_mat_vec(mat, vec) {
    if (!mat.matrix) 
        throw "mult_mat_vec(): the first argument is not a matrix";
    if (mat[0].length != vec.length)
        throw "mult_mat_vec(): wrong dimensions";

    var ris = Array.apply(null, Array(mat.length)).map(Number.prototype.valueOf,0);

    for ( var i = 0; i < mat.length; ++i ) {
        for ( var j = 0; j < mat[0].length; ++j ) {
            ris[i] += mat[i][j] * vec[j];
        }
    }

    return ris;
}

function apply_matrix3(mat, vec) {
    if (!mat.matrix) 
        throw "apply_matrix3(): the first argument is not a matrix";
    if (mat[0].length < 3 || vec.length < 3)
        throw "mult_mat_vec(): wrong dimensions";

    var ris = Array.apply(null, Array(3)).map(Number.prototype.valueOf,0);

    for ( var i = 0; i < 3; ++i ) {
        for ( var j = 0; j < 3; ++j ) {
            ris[i] += mat[i][j] * vec[j];
        }
    }

    return ris;
}

function apply_matrix4(mat, vec) {
    if (!mat.matrix) 
        throw "apply_matrix3(): the first argument is not a matrix";
    if (mat[0].length < 4 || vec.length < 4)
        throw "mult_mat_vec(): wrong dimensions";

    var ris = Array.apply(null, Array(4)).map(Number.prototype.valueOf,0);

    for ( var i = 0; i < 4; ++i ) {
        for ( var j = 0; j < 4; ++j ) {
            ris[i] += mat[i][j] * vec[j];
        }
    }

    return ris;
}

function dump_matrix(mat) {
    var ris = "";
    for ( var i = 0; i < mat.length; ++i ) {
        for ( var j = 0; j < mat[0].length; ++j ) {
            if (j < mat[0].length - 1)
                ris += mat[i][j].toString() + ", ";
            else ris += mat[i][j].toString();
        }
        ris += "\n";
    }
    return ris;
}

function linear_interpolation(v1, min1, max1, min2, max2) {
    var v2;
    v2 = v1 * ((max2-min2) / (max1 - min1));
    return v2;
}

function fix_round_error(val, mult) {
    var tmp = val/mult;
    tmp = Math.round(tmp);
    return mult*tmp;
}

function sign(val) {
    if (val > 0) return +1;
    else if (val == 0) return 0;
    else return -1;
}

function min(v1,v2) {
    if (v1<v2) return v1;
    else return v2;
}

function abs(v) {
    if (v>0)
        return v;
    else return -v;
}

function build_env_matrix(env_w, env_h, food, obstacles) {
    var ris = [];
    for (var i=0; i<env_w; i++) {
        ris.push([]);
        for (var j=0; j<env_h; j++) {
            var el = {};
            el.element = VOID;
            for (var k=0; k<food.length; k++) {
                if (food[k][0] == i && food[k][1] == j) {
                    el.element = PARALLELEPIPED;
                    break;
                }
            }
            for (var k=0; k<obstacles.length; k++) {
                if (obstacles[k][0] == i && obstacles[k][1] == j) {
                    el.element = PIRAMID;
                    break;
                }
            }
            el.color = vec4( linear_interpolation(i, 0, env_w, 0.1, 0.9), 
                             linear_interpolation(i+j, 0, env_w+env_h, 0.1, 0.9), 
                             linear_interpolation(j, 0, env_h, 0.1, 0.9), 1.0);
            var square_scalematrix = scalem(tile_size_min,1.0,tile_size_min);
            el.modelView = mult(translate(tile_size_min/2 + tile_size_max*i , 0.0, tile_size_min/2 + tile_size_max*j), square_scalematrix);
            ris[i][j] = el;
        }
        
    }
    return ris;
}

function generateFood(env_w, env_h, env) {
    var fpos = [];
    do {
        fpos[0] = Math.round(Math.random()*100) % env_w;
        fpos[1] = Math.round(Math.random()*100) % env_h;
        // console.log("ITERATION", fpos);
    } while (env[fpos[0]][fpos[1]].element != VOID);
    env[fpos[0]][fpos[1]].element = PARALLELEPIPED;
    return fpos;
}

function updatePoints(points) {
    document.getElementById("points").innerHTML = "POINTS: "+points;
}