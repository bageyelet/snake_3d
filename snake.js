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

var delta = 0.28;
function* genForwardRotation() {
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

var gFor; var gForRot; var gStr;
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

function initializeOldPos(snake) {
    snake.data.old_pos = snake.data.pos.slice();
    snake.data.old_angle = snake.data.angle;
    snake.data.old_anim = snake.data.anim;
    if (snake.next != null )
        initializeOldPos(snake.next);
}

function updateSnakePositions(snake_node, i) {
    var prev = snake_node.prev;
    if (prev == null)
        throw "updateSnakePositions(): it will not update the head position!";
    switch (prev.data.anim) {
        case FORWARD:
        case ROTATION_LEFT_BODY:
            switch (prev.data.direction) {
                case NORTH:
                    if (snake_node.data.old_anim == FORWARD || snake_node.data.old_anim == COMPLETING_ROTATION_LEFT_BODY) {
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = NORTH;
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardArray[i][0];
                    } else if (snake_node.data.old_anim == ROTATION_LEFT_BODY) {
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = NORTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                    } else {
                        throw "updateSnakePositions(): invalid old_anim";
                    }
                    break;
                case SOUTH:
                    if (snake_node.data.old_anim == FORWARD || snake_node.data.old_anim == COMPLETING_ROTATION_LEFT_BODY) {
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = SOUTH;
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardArray[i][0];
                    } else if (snake_node.data.old_anim == ROTATION_LEFT_BODY) {
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = SOUTH;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][1];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][0];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                    } else {
                        throw "updateSnakePositions(): invalid old_anim";
                    }
                    break;
                case EAST:
                    if (snake_node.data.old_anim == FORWARD || snake_node.data.old_anim == COMPLETING_ROTATION_LEFT_BODY) {
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = EAST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardArray[i][0]; 
                    } else if (snake_node.data.old_anim == ROTATION_LEFT_BODY) {
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = EAST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] - straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] - straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                    } else {
                        throw "updateSnakePositions(): invalid old_anim";
                    }
                    break;
                case WEST:
                    if (snake_node.data.old_anim == FORWARD || snake_node.data.old_anim == COMPLETING_ROTATION_LEFT_BODY) {
                        snake_node.data.anim = FORWARD;
                        snake_node.data.direction = WEST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardArray[i][0]; 
                    } else if (snake_node.data.old_anim == ROTATION_LEFT_BODY) {
                        snake_node.data.anim = COMPLETING_ROTATION_LEFT_BODY;
                        snake_node.data.direction = WEST;
                        snake_node.data.pos[0] = snake_node.data.old_pos[0] + straigthenArray[i][0][0];
                        snake_node.data.pos[1] = snake_node.data.old_pos[1] + straigthenArray[i][0][1];
                        snake_node.data.angle = snake_node.data.old_angle + straigthenArray[i][1];
                    } else {
                        throw "updateSnakePositions(): invalid old_anim";
                    }
                    break;
                default:
                    throw "updateSnakePositions(): invalid prev.data.direction";
            }
            break;
        case ROTATION_LEFT:
        case COMPLETING_ROTATION_LEFT_BODY:        
            switch (prev.data.direction) {
                case NORTH:
                    snake_node.data.anim = ROTATION_LEFT_BODY;
                    snake_node.data.direction = EAST;
                    snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][0];
                    snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][1];
                    snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                    break;
                case WEST:
                    snake_node.data.anim = ROTATION_LEFT_BODY;
                    snake_node.data.direction = NORTH;
                    snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][1];
                    snake_node.data.pos[1] = snake_node.data.old_pos[1] + forwardRotationArray[i][0][0];
                    snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                    break;
                case EAST:
                    snake_node.data.anim = ROTATION_LEFT_BODY;
                    snake_node.data.direction = SOUTH;
                    snake_node.data.pos[0] = snake_node.data.old_pos[0] - forwardRotationArray[i][0][1];
                    snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][0];
                    snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                    break;
                case SOUTH:
                    snake_node.data.anim = ROTATION_LEFT_BODY;
                    snake_node.data.direction = WEST;
                    snake_node.data.pos[0] = snake_node.data.old_pos[0] + forwardRotationArray[i][0][0];
                    snake_node.data.pos[1] = snake_node.data.old_pos[1] - forwardRotationArray[i][0][1];
                    snake_node.data.angle = snake_node.data.old_angle + forwardRotationArray[i][1];
                    break;
            }
            break;
        case ROTATION_RIGHT:
            break;
        default:
            break;
    }
    if (snake_node.next != null)
        updateSnakePositions(snake_node.next, i);
}