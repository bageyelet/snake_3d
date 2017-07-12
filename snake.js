"use strict";

function* genForward() {
    var inc = linear_interpolation(speed, 0, max_curr, 0, 1);
    var tot=0;
    for (var i=0; i<max_curr/speed ; i++) {
        yield [tot, 0];
        tot+=inc;
    }
    yield [1, 0];
    yield [1, 0];
}
var forwardArray = [];

var delta = 0.28;
function* genForwardRotation() {
    var inc_x = linear_interpolation(speed, 0, max_curr, 0, 1-delta);
    var inc_y = linear_interpolation(speed, 0, max_curr, 0, delta);
    var inc_angle = linear_interpolation(speed, 0, max_curr, 0, 35);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<max_curr/speed ; i++) {
        yield [[tot[0], tot[1]], tot_angle];
        tot[0] += inc_x;
        tot[1] += inc_y;
        tot_angle += inc_angle;
    }
    yield [[1-delta, delta], 35];
    yield [[1-delta, delta], 35];
}
var forwardRotationArray = [];

function* genStraigthen() {
    var inc_x = linear_interpolation(speed, 0, max_curr, 0, 1-delta);
    var inc_y = linear_interpolation(speed, 0, max_curr, 0, delta);
    var inc_angle = linear_interpolation(speed, 0, max_curr, 0, 55);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<max_curr/speed ; i++) {
        yield [[tot[0], tot[1]], tot_angle];
        tot[0] += inc_x;
        tot[1] += inc_y;
        tot_angle += inc_angle;
    }
    yield [[1-delta, delta], 55];
    yield [[1-delta, delta], 55];
}
var straigthenArray = [];

function* genFurtherRotation() {
    var inc_x = linear_interpolation(speed, 0, max_curr, 0, 1-2*delta);
    var inc_angle = linear_interpolation(speed, 0, max_curr, 0, 90);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<max_curr/speed ; i++) {
        yield [[tot[0], 0], tot_angle];
        tot[0] += inc_x;
        tot_angle += inc_angle;
    }
    yield [[1-2*delta, 0], 90];
    yield [[1-2*delta, 0], 90];
}
var furtherRotationArray = [];

function* genFurtherRotation2() {
    var inc_x = linear_interpolation(speed, 0, max_curr, 0, 1-2*delta);
    var inc_y = linear_interpolation(speed, 0, max_curr, 0, 2*delta);
    var inc_angle = linear_interpolation(speed, 0, max_curr, 0, -20);
    var tot = [0, 0]; var tot_angle = 0;
    for (var i=0; i<max_curr/speed ; i++) {
        yield [[tot[0], tot[1]], tot_angle];
        tot[0] += inc_x;
        tot[1] += inc_y;
        tot_angle += inc_angle;
    }
    yield [[1-2*delta, 2*delta], -20];
    yield [[1-2*delta, 2*delta], -20];
}
var furtherRotation2Array = [];

var gFor; var gForRot; var gStr; var gFurRot; var gFur2Rot;
function initializePositionUpdater() {
    gFor = genForward();
    gForRot = genForwardRotation();
    gStr = genStraigthen();
    gFurRot = genFurtherRotation();
    gFur2Rot = genFurtherRotation2();

    for (var i=0; i<max_curr + speed + 1; i+=speed) {
        forwardRotationArray[i] = gForRot.next().value;
        forwardArray[i] = gFor.next().value;
        straigthenArray[i] = gStr.next().value;
        furtherRotationArray[i] = gFurRot.next().value;
        furtherRotation2Array[i] = gFur2Rot.next().value;
        
    }
}

function initializeOldPos(snake) {
    snake.data.old_pos = snake.data.pos.slice();
    snake.data.old_angle = snake.data.angle;
    snake.data.old_anim = snake.data.anim;
    snake.data.old_direction = snake.data.direction;
    if (snake.next != null )
        initializeOldPos(snake.next);
}

function updateFirstBodyPosition(snake_node, i) {
    switch (snake_node.prev.data.anim) {
        case FORWARD:
            switch(snake_node.prev.data.direction) {
                case NORTH:
                    if (snake_node.data.old_anim == FORWARD || snake_node.data.old_anim == COMPLETING_ROTATION_LEFT_BODY || snake_node.data.old_anim ==     COMPLETING_ROTATION_RIGHT_BODY) {
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = NORTH;
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardArray[i][0];
                        snake_node.data.pos[0] = snake_node.data.old_pos[0];
                    } else if (snake_node.data.old_anim == ROTATION_LEFT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_LEFT || 
                                snake_node.data.old_anim == FURTHER_ROTATION2_LEFT) {
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = NORTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                    } else if (snake_node.data.old_anim == ROTATION_RIGHT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_RIGHT) {
                        snake_node.data.anim = COMPLETING_ROTATION_RIGHT_BODY;
                        snake_node.data.direction = NORTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - straigthenArray[i][1]; 
                    } else {
                        throw "updateFirstBodyPosition(): invalid old_anim";
                    }
                    break;
                case SOUTH:
                    if (snake_node.data.old_anim == FORWARD || snake_node.data.old_anim == COMPLETING_ROTATION_LEFT_BODY || snake_node.data.old_anim ==     COMPLETING_ROTATION_RIGHT_BODY) {
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = SOUTH;
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardArray[i][0];
                        snake_node.data.pos[0] = snake_node.data.old_pos[0];
                    } else if (snake_node.data.old_anim == ROTATION_LEFT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_LEFT || 
                                snake_node.data.old_anim == FURTHER_ROTATION2_LEFT) {
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = SOUTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                    } else if (snake_node.data.old_anim == ROTATION_RIGHT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_RIGHT) {
                        snake_node.data.anim = COMPLETING_ROTATION_RIGHT_BODY;
                        snake_node.data.direction = SOUTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - straigthenArray[i][1]; 
                    } else {
                        throw "updateFirstBodyPosition(): invalid old_anim";
                    }
                    break;
                case EAST:
                    if (snake_node.data.old_anim == FORWARD || snake_node.data.old_anim == COMPLETING_ROTATION_LEFT_BODY || snake_node.data.old_anim ==     COMPLETING_ROTATION_RIGHT_BODY) {
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = EAST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardArray[i][0]; 
                        snake_node.data.pos[1] = snake_node.data.old_pos[1];
                    } else if (snake_node.data.old_anim == ROTATION_LEFT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_LEFT || 
                                snake_node.data.old_anim == FURTHER_ROTATION2_LEFT) {
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = EAST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                    } else if (snake_node.data.old_anim == ROTATION_RIGHT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_RIGHT) {
                        snake_node.data.anim = COMPLETING_ROTATION_RIGHT_BODY;
                        snake_node.data.direction = EAST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - straigthenArray[i][1];
                    } else {
                        throw "updateFirstBodyPosition(): invalid old_anim";
                    }
                    break;
                case WEST:
                    if (snake_node.data.old_anim == FORWARD || snake_node.data.old_anim == COMPLETING_ROTATION_LEFT_BODY || snake_node.data.old_anim ==     COMPLETING_ROTATION_RIGHT_BODY) {
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = WEST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardArray[i][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1];
                    } else if (snake_node.data.old_anim == ROTATION_LEFT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_LEFT || 
                                snake_node.data.old_anim == FURTHER_ROTATION2_LEFT) {
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = WEST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                    } else if (snake_node.data.old_anim == ROTATION_RIGHT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_RIGHT) {
                        snake_node.data.anim = COMPLETING_ROTATION_RIGHT_BODY;
                        snake_node.data.direction = WEST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - straigthenArray[i][1];
                    } else {
                        throw "updateFirstBodyPosition(): invalid old_anim";
                    }
                    break;
                default:
                    throw "updateFirstBodyPosition(): invalid prev.data.direction";
            }
            break;
        case ROTATION_LEFT:
            switch (snake_node.prev.data.direction) {
                case NORTH:
                    snake_node.data.direction = EAST;
                    if (snake_node.data.old_anim == ROTATION_LEFT_BODY) {
                        snake_node.data.anim = FURTHER_ROTATION_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotationArray[i][1];
                    } else if (snake_node.data.old_anim == ROTATION_RIGHT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_RIGHT) {
                        snake_node.data.anim = FURTHER_ROTATION2_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotation2Array[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotation2Array[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotation2Array[i][1];
                    } else {
                        snake_node.data.anim = ROTATION_LEFT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                    }
                    break;
                case WEST:
                    snake_node.data.direction = NORTH;
                    if (snake_node.data.old_anim == ROTATION_LEFT_BODY) {
                        snake_node.data.anim = FURTHER_ROTATION_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotationArray[i][1];
                    } else if (snake_node.data.old_anim == ROTATION_RIGHT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_RIGHT) {
                        snake_node.data.anim = FURTHER_ROTATION2_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotation2Array[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotation2Array[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotation2Array[i][1];
                    } else {
                        snake_node.data.anim = ROTATION_LEFT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                    }
                    break;
                case EAST:
                    snake_node.data.direction = SOUTH;
                    if (snake_node.data.old_anim == ROTATION_LEFT_BODY) {
                        snake_node.data.anim = FURTHER_ROTATION_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotationArray[i][1];
                    } else if (snake_node.data.old_anim == ROTATION_RIGHT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_RIGHT) {
                        snake_node.data.anim = FURTHER_ROTATION2_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotation2Array[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotation2Array[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotation2Array[i][1];
                    } else {
                        snake_node.data.anim = ROTATION_LEFT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                    }
                    break;
                case SOUTH:
                    snake_node.data.direction = WEST;
                    if (snake_node.data.old_anim == ROTATION_LEFT_BODY) {
                        snake_node.data.anim = FURTHER_ROTATION_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotationArray[i][1];
                    } else if (snake_node.data.old_anim == ROTATION_RIGHT_BODY || snake_node.data.old_anim == FURTHER_ROTATION_RIGHT) {
                        snake_node.data.anim = FURTHER_ROTATION2_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotation2Array[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotation2Array[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotation2Array[i][1];
                    } else {
                        snake_node.data.anim = ROTATION_LEFT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                    }
                    break;
            }
            break;
        case ROTATION_RIGHT:
            switch (snake_node.prev.data.direction) {
                case NORTH:
                    snake_node.data.direction = WEST;
                    if (snake_node.data.old_anim == ROTATION_RIGHT_BODY) {
                        snake_node.data.anim = FURTHER_ROTATION_RIGHT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - furtherRotationArray[i][1];
                    } else {
                        snake_node.data.anim = ROTATION_RIGHT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - forwardRotationArray[i][1];
                    }
                    break;
                case WEST:
                    snake_node.data.direction = SOUTH;
                    if (snake_node.data.old_anim == ROTATION_RIGHT_BODY) {
                        snake_node.data.anim = FURTHER_ROTATION_RIGHT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - furtherRotationArray[i][1];
                    } else {
                        snake_node.data.anim = ROTATION_RIGHT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - forwardRotationArray[i][1];
                    }
                    break;
                case EAST:
                    snake_node.data.direction = NORTH;
                    if (snake_node.data.old_anim == ROTATION_RIGHT_BODY) {
                        snake_node.data.anim = FURTHER_ROTATION_RIGHT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - furtherRotationArray[i][1];
                    } else {
                        snake_node.data.anim = ROTATION_RIGHT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - forwardRotationArray[i][1];
                    }
                    break;
                case SOUTH:
                    snake_node.data.direction = EAST;
                    if (snake_node.data.old_anim == ROTATION_RIGHT_BODY) {
                        snake_node.data.anim = FURTHER_ROTATION_RIGHT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - furtherRotationArray[i][1];
                    } else {
                        snake_node.data.anim = ROTATION_RIGHT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - forwardRotationArray[i][1];
                    }
                    break;
            }
            break;
        default:
            throw "updateFirstBodyPosition(): invalid snake_node.prev.data.anim";
    }
}

function updateSnakePositions(snake_node, i) {
    var prev = snake_node.prev;
    if (prev == null)
        throw "updateSnakePositions(): it will not update the head position!";
    if (prev.data.type == SNAKEHEAD) {
        updateFirstBodyPosition(snake_node, i);
    } else {
        switch (prev.data.old_anim) {
            case FORWARD:
                switch (prev.data.old_direction) {
                    case NORTH:
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = NORTH;
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardArray[i][0];
                        break;
                    case SOUTH:
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = SOUTH;
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardArray[i][0];
                        break;
                    case EAST:
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = EAST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardArray[i][0]; 
                        break;
                    case WEST:
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = WEST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardArray[i][0]; 
                        break;
                    default:
                        throw "updateSnakePositions(): invalid prev.data.direction";
                }
                break;
            case ROTATION_LEFT_BODY:
                switch (prev.data.old_direction) {
                    case EAST:
                        snake_node.data.direction = EAST;
                        snake_node.data.anim = ROTATION_LEFT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                        break;
                    case NORTH:
                        snake_node.data.direction = NORTH;
                        snake_node.data.anim = ROTATION_LEFT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                        break;
                    case SOUTH:
                        snake_node.data.direction = SOUTH;
                        snake_node.data.anim = ROTATION_LEFT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                        break;
                    case WEST:
                        snake_node.data.direction = WEST;
                        snake_node.data.anim = ROTATION_LEFT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                        break;
                }
                break;
            case ROTATION_RIGHT_BODY:
                switch (prev.data.old_direction) {
                    case WEST:
                        snake_node.data.direction = WEST;
                        snake_node.data.anim = ROTATION_RIGHT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - forwardRotationArray[i][1];
                        break;
                    case SOUTH:
                        snake_node.data.direction = SOUTH;
                        snake_node.data.anim = ROTATION_RIGHT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - forwardRotationArray[i][1];
                        break;
                    case NORTH:
                        snake_node.data.direction = NORTH;
                        snake_node.data.anim = ROTATION_RIGHT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - forwardRotationArray[i][1];
                        break;
                    case EAST:
                        snake_node.data.direction = EAST;
                        snake_node.data.anim = ROTATION_RIGHT_BODY;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - forwardRotationArray[i][1];
                        break;
                }
                break;
            case COMPLETING_ROTATION_LEFT_BODY:
                switch (prev.data.old_direction) {
                    case NORTH:
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = NORTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                        break;
                    case SOUTH:
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = SOUTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                        break;
                    case EAST:
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = EAST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                        break;
                    case WEST:
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = WEST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                        break;
                    default:
                        throw "updateSnakePositions(): invalid prev.data.direction";
                }
                break;
            case FURTHER_ROTATION_LEFT: 
                switch (prev.data.old_direction) {
                    case SOUTH:
                        snake_node.data.direction = SOUTH;
                        snake_node.data.anim = FURTHER_ROTATION_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotationArray[i][1];
                        break;
                    case WEST:
                        snake_node.data.direction = WEST;
                        snake_node.data.anim = FURTHER_ROTATION_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotationArray[i][1];
                        break;
                    case EAST:
                        snake_node.data.direction = EAST;
                        snake_node.data.anim = FURTHER_ROTATION_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotationArray[i][1];
                        break;
                    case NORTH:
                        snake_node.data.direction = NORTH;
                        snake_node.data.anim = FURTHER_ROTATION_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotationArray[i][1];
                        break;
                }
                break;
            case COMPLETING_ROTATION_RIGHT_BODY:
                switch (prev.data.old_direction) {
                    case NORTH:
                        snake_node.data.anim = COMPLETING_ROTATION_RIGHT_BODY;
                        snake_node.data.direction = NORTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - straigthenArray[i][1]; 
                        break;
                    case SOUTH:
                        snake_node.data.anim = COMPLETING_ROTATION_RIGHT_BODY;
                        snake_node.data.direction = SOUTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - straigthenArray[i][1]; 
                        break;
                    case EAST:
                        snake_node.data.anim = COMPLETING_ROTATION_RIGHT_BODY;
                        snake_node.data.direction = EAST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - straigthenArray[i][1];
                        break;
                    case WEST:
                        snake_node.data.anim = COMPLETING_ROTATION_RIGHT_BODY;
                        snake_node.data.direction = WEST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - straigthenArray[i][1];
                        break;
                    default:
                        throw "updateSnakePositions(): invalid prev.data.direction";
                }
                break;
            case FURTHER_ROTATION_RIGHT:
                switch (prev.data.old_direction) {
                    case WEST:
                        snake_node.data.direction = WEST;
                        snake_node.data.anim = FURTHER_ROTATION_RIGHT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - furtherRotationArray[i][1];
                        break;
                    case SOUTH:
                        snake_node.data.direction = SOUTH;
                        snake_node.data.anim = FURTHER_ROTATION_RIGHT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - furtherRotationArray[i][1];
                        break;
                    case NORTH:
                        snake_node.data.direction = NORTH;
                        snake_node.data.anim = FURTHER_ROTATION_RIGHT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotationArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotationArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle - furtherRotationArray[i][1];
                        break;
                    case EAST:
                        snake_node.data.direction = EAST;
                        snake_node.data.anim = FURTHER_ROTATION_RIGHT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotationArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotationArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle - furtherRotationArray[i][1];
                        break;
                }
                break;
            case FURTHER_ROTATION2_LEFT:
                switch (prev.data.old_direction) {
                    case SOUTH:
                        snake_node.data.direction = SOUTH;
                        snake_node.data.anim = FURTHER_ROTATION2_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotation2Array[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotation2Array[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotation2Array[i][1];
                        break;
                    case WEST:
                        snake_node.data.direction = WEST;
                        snake_node.data.anim = FURTHER_ROTATION2_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotation2Array[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - furtherRotation2Array[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotation2Array[i][1];
                        break;
                    case EAST:
                        snake_node.data.direction = EAST;
                        snake_node.data.anim = FURTHER_ROTATION2_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - furtherRotation2Array[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotation2Array[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotation2Array[i][1];
                        break;
                    case NORTH:
                        snake_node.data.direction = NORTH;
                        snake_node.data.anim = FURTHER_ROTATION2_LEFT;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + furtherRotation2Array[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + furtherRotation2Array[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + furtherRotation2Array[i][1];
                        break;
                }
                break;
            default:
                break;
        }
    }
    if (snake_node.next != null)
        updateSnakePositions(snake_node.next, i);
}