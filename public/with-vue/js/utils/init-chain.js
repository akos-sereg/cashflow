function InitChain() {
	this.position = -1;
	this.chainItems = [];
	this.onAllCompleted = null;
}

InitChain.prototype.add = function(method) {
	if (!this.chainItems) {
		debugger;
	}
	else {
		this.chainItems.push({ method: method });
	}
}

InitChain.prototype.run = function(onAllCompleted) {
	this.onAllCompleted = onAllCompleted;
	this.next(this);
}

InitChain.prototype.next = function(initContext) {

	initContext.position++;
	if (initContext.position == initContext.chainItems.length) {
		initContext.onAllCompleted();
		return;
	}

	initContext.chainItems[initContext.position].method(initContext, initContext.next);
}