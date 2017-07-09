function Node(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
}

function List() {
    this._length = 0;
    this.head = null;
    this._nextPointer = this.head;
    this.add = function(value) {
        var node = new Node(value);
        var tmp = this.head;
        this.head = node;
        node.next = tmp;
        node.prev = null;
        if (tmp != null)
            tmp.prev = node;
        this._length++;
        return node;
    }
    this.next = function() {
        if (this._nextPointer == null)
            this._nextPointer = this.head;
        else
            this._nextPointer = this._nextPointer.next;
        return this._nextPointer;
    }
    this.print = function() {
        var p = this.head;
        while (p!=null) {
            console.log(p.data);
            p=p.next;
        }
    }
}
var snake = new List();
snake.add({type:1, pos:[1, 1], angle:0});
snake.add({type:2, pos:[1, 2], angle:0});
snake.add({type:3, pos:[1, 3], angle:0});

//console.log(snake);

var el = snake.next();
while (el != null) {
    console.log("node", el.data);
    console.log("prev", el.prev != null? el.prev.data : null);
    el = snake.next();
}