var PIRAMID         = 0;
var PARALLELEPIPED  = 1;
var VOID            = 2;
var SNAKEHEAD       = 3;
var SNAKEBODY       = 4;
var SNAKETAIL       = 5;
var SQUARE          = 6;

function _argumentsToArray( args )
{
    return [].concat.apply( [], Array.prototype.slice.apply(args) );
}


function vec4()
{
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    case 2: result.push( 0.0 );
    case 3: result.push( 1.0 );
    }

    return result.splice( 0, 4 );
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

function build_env(env_w, env_h, food, obstacles) {
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
            el.color = vec4( linear_interpolation(i, 0, env_w, 0, 1), 
                             linear_interpolation(i+j, 0, env_w+env_h, 0, 1), 
                             linear_interpolation(j, 0, env_h, 0, 1), 1.0);
            ris[i][j] = el;
        }
        
    }
    return ris;
}
var poss = []; var k = 0;
for (var i=0; i<25; i++) {
    poss[k] = [i, 0]; k+=1;
    poss[k] = [i, 25-1]; k+=1;
} for (var i=1; i<25-1; i++) {
    poss[k] = [0, i]; k+=1;
    poss[k] = [25-1, i]; k+=1;
}
console.log(build_env(25, 25, [5,5], poss));