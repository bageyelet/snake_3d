var speed = 5; var max_curr = 200;

function linear_interpolation(v1, min1, max1, min2, max2) {
    var v2;
    v2 = v1 * ((max2-min2) / (max1 - min1));
    return v2;
}

function* genForward() {
    var inc = linear_interpolation(speed, 0, max_curr, 0, 1);
    var tot=0;
    for (var i=0; i<max_curr/speed; i++) {
        tot+=inc;
        yield [tot, 0];
    }
    yield [1, 0];
}
var forwardArray = [];

var delta = 0.2;
function* genForwardRotation() {
    var inc_x = linear_interpolation(speed, 0, max_curr, 0, -1+delta);
    var inc_y = linear_interpolation(speed, 0, max_curr, 0, -delta);
    var inc_angle = linear_interpolation(speed, 0, max_curr, 0, 45);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<max_curr/speed; i++) {
        tot[0] += inc_x;
        tot[1] += inc_y;
        tot_angle += inc_angle;
        yield [[tot[0], tot[1]], tot_angle];
    }
    yield [[-1+delta, -delta], 45];
}
var forwardRotationArray = [];

function* genStraigthen() {
    var inc_x = linear_interpolation(speed, 0, max_curr, 0, 1-delta);
    var inc_y = linear_interpolation(speed, 0, max_curr, 0, delta);
    var inc_angle = linear_interpolation(speed, 0, max_curr, 0, 45);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<max_curr/speed; i++) {
        tot[0] += inc_x;
        tot[1] += inc_y;
        tot_angle += inc_angle;
        yield [[tot[0], tot[1]], tot_angle];
    }
    yield [[1-delta, delta], 45];
}
var straigthenArray = [];

var gFor; var gForRot;
function initializePositionUpdater() {
    gFor = genForward();
    gForRot = genForwardRotation();
    gStr = genStraigthen();

    for (var i=0; i<max_curr + 1; i+=speed) {
        forwardRotationArray[i] = gForRot.next().value;
        forwardArray[i] = gFor.next().value;
        straigthenArray[i] = gStr.next().value;
    }
}

initializePositionUpdater();
console.log(forwardRotationArray);