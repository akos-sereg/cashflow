function HtmlPartsLoader(htmlParts) {
	this.htmlParts = htmlParts;
}

HtmlPartsLoader.prototype.load = function(initContext, next) {
	
	var self = this;
	var initChain = new InitChain();
    
    this.htmlParts.forEach(function(htmlPart) {
        initChain.add(function(context, doNext) { 
            self.loadHtmlPart(htmlPart, context, doNext);
        });
    });

    initChain.run(function() { next(initContext) });
}

HtmlPartsLoader.prototype.loadHtmlPart = function(htmlPart, context, next) {
	var target = $('#' + htmlPart.target);
    if (htmlPart.append) {
        target = $("<div></div>");
        target.appendTo('#' + htmlPart.target);
    }
    
    target.load(htmlPart.path, function() { next(context) }); 
}