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
    this.getSecond = function() {
        if (this.head != null)
            return this.head.next;
        else
            return null;
    }
    this.print = function() {
        var p = this.head;
        while (p!=null) {
            console.log(p.data);
            p=p.next;
        }
    }
}