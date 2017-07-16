function Node(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
    this.clone = function() {
        var ris = new Node(null);
        ris.data = JSON.parse(JSON.stringify( this.data )); 
        ris.next = this.next;
        ris.prev = this.prev;
        return ris;
    }
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
    this.copySecond = function() {
        if (this.head==null) throw "copySecond(): head is null";
        if (this.head.next==null) throw "copySecond(): head.next is null";
        var second = this.head.next;
        var new_second = second.clone();
        new_second.next = second;
        second.prev = new_second;
        this.head.next = new_second;
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