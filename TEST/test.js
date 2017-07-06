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

var m = [[1,2,3], [4,5,6], [7,8,9]];
m.matrix = true;

var v = [1,2,3];

console.log(mult_mat_vec(m, v));

function dump_matrix(mat) {
	ris = "";
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

console.log(dump_matrix(m));
