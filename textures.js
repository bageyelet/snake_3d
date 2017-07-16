var texSize = 2048;
var v;

var imageSquareWhite = new Uint8Array(4*texSize*texSize);
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            if ((i>=0 && i<0.15*texSize) || (j>=0 && j<0.15*texSize) || (i<texSize && i>=texSize-0.15*texSize) || (j<texSize && j>=texSize-0.15*texSize)) {
                imageSquareWhite[4*i*texSize+4*j  ] = 60;
                imageSquareWhite[4*i*texSize+4*j+1] = 60;
                imageSquareWhite[4*i*texSize+4*j+2] = 60;
                imageSquareWhite[4*i*texSize+4*j+3] = 255;
            } else {
                imageSquareWhite[4*i*texSize+4*j  ] = 200;
                imageSquareWhite[4*i*texSize+4*j+1] = 200;
                imageSquareWhite[4*i*texSize+4*j+2] = 200;
                imageSquareWhite[4*i*texSize+4*j+3] = 255;
            }
        }
    }

var textureSquareWhite;
function initSquareWhiteTexture(gl) {
    textureSquareWhite = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, textureSquareWhite );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageSquareWhite);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
}

var imageSquareBlue = new Uint8Array(4*texSize*texSize);
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            if ((i>=0 && i<0.15*texSize) || (j>=0 && j<0.15*texSize) || (i<texSize && i>=texSize-0.15*texSize) || (j<texSize && j>=texSize-0.15*texSize)) {
                imageSquareBlue[4*i*texSize+4*j  ] = 0;
                imageSquareBlue[4*i*texSize+4*j+1] = 0;
                imageSquareBlue[4*i*texSize+4*j+2] = 100;
                imageSquareBlue[4*i*texSize+4*j+3] = 255;
            } else {
                imageSquareBlue[4*i*texSize+4*j  ] = 0;
                imageSquareBlue[4*i*texSize+4*j+1] = 0;
                imageSquareBlue[4*i*texSize+4*j+2] = 200;
                imageSquareBlue[4*i*texSize+4*j+3] = 255;
            }
        }
    }

var textureSquareBlue;
function initSquareBlueTexture(gl) {
    textureSquareBlue = gl.createTexture();
    gl.activeTexture( gl.TEXTURE3 );
    gl.bindTexture( gl.TEXTURE_2D, textureSquareBlue );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageSquareBlue);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
}

var imageSquareGreen = new Uint8Array(4*texSize*texSize);
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            if ((i>=0 && i<0.15*texSize) || (j>=0 && j<0.15*texSize) || (i<texSize && i>=texSize-0.15*texSize) || (j<texSize && j>=texSize-0.15*texSize)) {
                imageSquareGreen[4*i*texSize+4*j  ] = 0;
                imageSquareGreen[4*i*texSize+4*j+1] = 100;
                imageSquareGreen[4*i*texSize+4*j+2] = 0;
                imageSquareGreen[4*i*texSize+4*j+3] = 255;
            } else {
                imageSquareGreen[4*i*texSize+4*j  ] = 0;
                imageSquareGreen[4*i*texSize+4*j+1] = 200;
                imageSquareGreen[4*i*texSize+4*j+2] = 0;
                imageSquareGreen[4*i*texSize+4*j+3] = 255;
            }
        }
    }
var textureSquareGreen;
function initSquareGreenTexture(gl) {
    textureSquareGreen = gl.createTexture();
    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, textureSquareGreen );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageSquareGreen);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

var imageTriangleWhite = new Uint8Array(4*texSize*texSize);
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            if ((i>=0 && i<0.05*texSize) || (j>=0 && j<0.05*texSize) || (abs(i-j) >= 0 && abs(i-j) <= 0.05*texSize) || 
                        (i<texSize && i>=texSize-0.05*texSize) || (j<texSize && j>=texSize-0.05*texSize)) {
                imageTriangleWhite[4*i*texSize+4*j  ] = 60;
                imageTriangleWhite[4*i*texSize+4*j+1] = 60;
                imageTriangleWhite[4*i*texSize+4*j+2] = 60;
                imageTriangleWhite[4*i*texSize+4*j+3] = 255;
            } else {
                imageTriangleWhite[4*i*texSize+4*j  ] = 200;
                imageTriangleWhite[4*i*texSize+4*j+1] = 200;
                imageTriangleWhite[4*i*texSize+4*j+2] = 200;
                imageTriangleWhite[4*i*texSize+4*j+3] = 255;
            }
        }
    }
var textureTriangleWhite;
function initTriangleWhiteTexture(gl) {
    textureTriangleWhite = gl.createTexture();
    gl.activeTexture( gl.TEXTURE4 );
    gl.bindTexture( gl.TEXTURE_2D, textureTriangleWhite );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageTriangleWhite);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

var imageTriangleRed = new Uint8Array(4*texSize*texSize);
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            if ((i>=0 && i<0.05*texSize) || (j>=0 && j<0.05*texSize) || (abs(i-j) >= 0 && abs(i-j) <= 0.05*texSize) || 
                        (i<texSize && i>=texSize-0.05*texSize) || (j<texSize && j>=texSize-0.05*texSize)) {
                imageTriangleRed[4*i*texSize+4*j  ] = 100;
                imageTriangleRed[4*i*texSize+4*j+1] = 0;
                imageTriangleRed[4*i*texSize+4*j+2] = 0;
                imageTriangleRed[4*i*texSize+4*j+3] = 255;
            } else if (abs(i-j) > 0.05*texSize && abs(i-j) <= 0.05*texSize + 5) {
                imageTriangleRed[4*i*texSize+4*j  ] = 150;
                imageTriangleRed[4*i*texSize+4*j+1] = 0;
                imageTriangleRed[4*i*texSize+4*j+2] = 0;
                imageTriangleRed[4*i*texSize+4*j+3] = 255;
            } else {
                imageTriangleRed[4*i*texSize+4*j  ] = 200;
                imageTriangleRed[4*i*texSize+4*j+1] = 0;
                imageTriangleRed[4*i*texSize+4*j+2] = 0;
                imageTriangleRed[4*i*texSize+4*j+3] = 255;
            }
        }
    }
var textureTriangleRed;
function initTriangleRedTexture(gl) {
    textureTriangleRed = gl.createTexture();
    gl.activeTexture( gl.TEXTURE2 );
    gl.bindTexture( gl.TEXTURE_2D, textureTriangleRed );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageTriangleRed);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

var texCoord = [
    vec2(0  , 0  ),
    vec2(0  , 1  ),
    vec2(1  , 1  ),
    vec2(1  , 0  ),
    vec2(0  , 0.5),
    vec2(0.5, 0  )
];

var texCoord1 = [
    vec2(0.1, 0.1),
    vec2(0.1, 0.9),
    vec2(0.9, 0.9),
    vec2(0.9, 0.1)
];

// for (var i=0; i<400; i++)
//     texCoordsSquareArray.push(vec2(0,0));

