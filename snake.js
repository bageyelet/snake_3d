var increment_rotation = linear_interpolation(5, 0, 200, 0, 90);
var increment_translat = linear_interpolation(5, 0, 200, 0, 1);

function updateSnakePositions(snake_node) {
    var prev = snake_node.prev;
    if (prev == null)
        throw "updateSnakePositions(): it will not update the head position!";
    switch (prev.data.anim) {
        case FORWARD:
            switch (prev.data.direction) {
                case NORTH:
                    snake_node.data.anim = FORWARD;
                    snake_node.data.direction = NORTH;
                    snake_node.data.pos = [prev.data.pos[0]-prev.data.error_pos[0], prev.data.pos[1]-prev.data.error_pos[1]-1];
                    snake_node.data.angle = snake_node.data.angle;
                    break;
                case SOUTH:
                    snake_node.data.anim = FORWARD;
                    snake_node.data.direction = SOUTH;
                    snake_node.data.pos = [prev.data.pos[0], prev.data.pos[1]+1];
                    snake_node.data.angle = snake_node.data.angle;
                    break;
                case EAST:
                    snake_node.data.anim = FORWARD;
                    snake_node.data.direction = EAST;
                    snake_node.data.pos = [prev.data.pos[0]-1, prev.data.pos[1]];
                    snake_node.data.angle = snake_node.data.angle;
                    break;
                case WEST:
                    snake_node.data.anim = FORWARD;
                    snake_node.data.direction = WEST;
                    snake_node.data.pos = [prev.data.pos[0]+1, prev.data.pos[1]];
                    snake_node.data.angle = snake_node.data.angle;
                    break;
                default:
                    throw "updateSnakePositions(): invalid prev.data.direction";
            }
            break;
        case ROTATION_LEFT:
            switch (prev.data.direction) {
                case NORTH:
                    snake_node.data.anim = FORWARD;
                    snake_node.data.direction = EAST;
                    snake_node.data.pos[0] += increment_translat-0.012;
                    snake_node.data.angle += increment_rotation/2;
                    break;
                case WEST:
                    snake_node.data.anim = FORWARD;
                    snake_node.data.direction = NORTH;
                    snake_node.data.pos[1] += increment_translat - increment_translat/4;
                    snake_node.data.error_pos[1] += - increment_translat/4;
                    snake_node.data.pos[0] += increment_translat/4;
                    snake_node.data.error_pos[0] += increment_translat/4;
                    snake_node.data.angle += increment_rotation/2;
                    break;
            }
            break;
        case ROTATION_RIGHT:
            break;
        default:
            break;
    }
    if (snake_node.next != null)
        updateSnakePositions(snake_node.next);
}