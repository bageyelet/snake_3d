var PIRAMID = 1;
var PARALLELEPIPED = 2;
var VOID = 3;

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

var env = build_env(20, 20);

console.log(env);