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

function build_env(env_w, env_h) {
    var ris = [];
    for (var i=0; i<env_w; i++) {
        ris.push([]);
        for (var j=0; j<env_h; j++) {
            if (i==0 || j==0 || i==env_w-1 || j==env_h-1)
                ris[i][j] = PIRAMID;
            else if ((i==3 && j==3) || (i==10 && j==12))
                ris[i][j] = PARALLELEPIPED;
            else
                ris[i][j] = VOID;
        }
    }
    return ris;
}