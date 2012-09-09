
//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

dwrunit.addTest("sync test", function(tr) {
	dwrunit.assert(true);
}, "pass");

dwrunit.addTest("sync failing test", function(tr) {
	dwrunit.assert(false, "an error message");
}, "fail");

dwrunit.addTest("sync test with execution error", function(tr) {
	undefinedFunction();
}, "fail");

dwrunit.addTest("sync test with nested wrappers called synchronously", function(tr) {
	var func = dwrunit.waitAsync(function() {
		dwrunit.assert(true);
	});
	dwrunit.assert(true);
	func();
	dwrunit.assert(true);
}, "pass");

dwrunit.addTest("async default completor test", function(tr) {
	dwrunit.assert(true);
	setTimeout(dwrunit.waitAsync(function() {
		dwrunit.assert(true);
	}), 500);
	dwrunit.assert(true);
}, "pass");

dwrunit.addTest("async default completor failing test", function(tr) {
	dwrunit.assert(true);
	setTimeout(dwrunit.waitAsync(function() {
		dwrunit.assert(false, "an error message");
	}), 500);
	dwrunit.assert(true);
}, "fail");

dwrunit.addTest("async default completor test failing with timeout", function(tr) {
	dwrunit.assert(true);
	setTimeout(dwrunit.waitAsync(function() {
		dwrunit.assert(true);
	}), 6000);
	dwrunit.assert(true);
}, "fail");

dwrunit.addTest("async default completor failing test with forgotten wrapper (will succeed and errors arrive later in console)", function(tr) {
	dwrunit.assert(true);
	setTimeout(function() {
		dwrunit.assert(false, "an error message");
	}, 500);
	dwrunit.assert(true);
}, "pass");

dwrunit.addTest("async default completor multiple failing test", function(tr) {
	dwrunit.assert(true);
	setTimeout(dwrunit.waitAsync(function() {
		dwrunit.verify(false, "an error message");
		dwrunit.verify(false, "another error message");
	}), 500);
	dwrunit.assert(true);
}, "fail");

dwrunit.addTest("async default completor test with execution error", function(tr) {
	dwrunit.assert(true);
	setTimeout(dwrunit.waitAsync(function() {
		undefinedFunction();
	}), 500);
	dwrunit.assert(true);
}, "fail");

dwrunit.addTest("async explicit completor test", function(tr) {
	dwrunit.assert(true);
	var c = new dwrunit.ExplicitAsyncCompletor;
	var count = 10;
	var i = setInterval(dwrunit.waitAsync(c, function() {
		dwrunit.assert(true);
		count--;
		if (count == 0) {
			clearInterval(i);
			c.complete();
		}
	}), 300);
}, "pass");

dwrunit.addTest("async explicit completor failing test", function(tr) {
	dwrunit.assert(true);
	var c = new dwrunit.ExplicitAsyncCompletor;
	var count = 10;
	var i = setInterval(dwrunit.waitAsync(c, function() {
		dwrunit.assert(true);
		count--;
		if (count == 0) {
			clearInterval(i);
			c.complete();
			dwrunit.assert(false, "an error message");
		}
	}), 50);
}, "fail");

dwrunit.addTest("async too many completions failing test (will succeed and errors arrive later in console)", function(tr) {
	dwrunit.assert(true);
	var c = new dwrunit.SingleAsyncCompletor;
	var f1 = dwrunit.waitAsync(c, function(){dwrunit.assert(true);});
	var f2 = dwrunit.waitAsync(c, function(){dwrunit.assert(true);});
	setTimeout(f1, 500);
	setTimeout(f2, 1000);
}, "pass");

dwrunit.addTest("multi completor test", function(tr) {
	dwrunit.assert(true);
	var xc = new dwrunit.SingleAsyncCompletor;
	var x1 = dwrunit.waitAsync(xc, function(){dwrunit.assert(true);});
	var x2 = dwrunit.waitAsync(xc, function(){dwrunit.assert(true);});
	var yc = new dwrunit.SingleAsyncCompletor;
	var y1 = dwrunit.waitAsync(yc, function(){dwrunit.assert(true);});
	var y2 = dwrunit.waitAsync(yc, function(){dwrunit.assert(true);});
	setTimeout(x2, 500);
	setTimeout(y2, 2000);
}, "pass");

dwrunit.addTest("dwr call test", function(tr) {
	dwrunit.assert(true);
	var c = new dwrunit.SingleAsyncCompletor;
	var callOptions = {
		callback: dwrunit.waitAsync(c, function(data) {
			dwrunit.assert(data == "hello", "wrong data");
		}),
		exceptionHandler: dwrunit.waitAsync(c, function(ex) {}),
		errorHandler: dwrunit.waitAsync(c, function(error) {})
	};
	// Simulate asynchronous call
	//   remote.method("hello", callOptions)
	// with timeout:
	setTimeout(function(){callOptions.callback("hello")}, 500);
}, "pass");

//-----------------------------------------------------------------------------
// Test runner and presentation
//-----------------------------------------------------------------------------

dwrunit.runTests(
	dwrunit.getTestNames(), 
	{
		startCallback: function(ts) {
			logPage("Started: " + ts.getName());
		},
		statusCallback: function(ts) {
			if (ts.isPassed() && ts.getData() != "pass" || ts.isFailed() && ts.getData() != "fail") {
				logPage("-> UNEXPECTED:");
			}
			if (ts.isPassed()) {
				logPage("-> PASS: " + ts.getName());
			} else {
				logPageAndConsole("-> FAIL: " + ts.getName());
				var errors = ts.getErrors();
				for(var i=0; i<errors.length; i++) {
					logConsoleFallbackToPage(errors[i]);
				}
				logConsoleFallbackToPage(" ");
			}
		},
		completionCallback: function() {
			logPage("-> DONE: All tests complete.");
		},
		timeout: 5000
	}
);

function logPageAndConsole(p) {
	logPage(p);
	logConsole(p);
}

function logConsoleFallbackToPage(p) {
	if (!logConsole(p)) logPage(p);
}

function logPage(p) {
	var message;
	if (typeof p == "string") {
		message = p;
	} else if (p instanceof Error) {
		var ex = p;
		message = indentString(ex.toString(), 2);
		if (exceptionStackString(ex)) {
			message += "\n" + indentString(exceptionStackString(ex), 4);
		}
	} else {
		return false;
	}
	
	var out = document.getElementById("output");
	if ("textContent" in out) {
		out.textContent += message + "\n";
	} else {
		out.innerText += message + "\n";
	}
	
	return true;
}

function logConsole(p) {
	var handled = false;
	if (typeof p == "string") {
		var message = p;
		if (typeof console != "undefined" && console && console.log) {
			console.log(message);
			handled = true;
		}
	} else if (p instanceof Error) {
		var ex = p;
		if (typeof console != "undefined" && console && console.exception) {
			console.exception(ex);
			handled = true;
		} else if (typeof console != "undefined" && console && console.log) {
			var message = indentString(ex.toString(), 2);
			if (exceptionStackString(ex)) {
				message += "\n" + indentString(exceptionStackString(ex), 4);
			}
			console.log(message);
			handled = true;
		}
	}
	return handled;
}

function exceptionStackString(ex) {
	return ex.stack;
}

function indentString(str, indent) {
	var indented = "";
	var lines = str.split("\n");
	for(var i=0; i<lines.length; i++) {
		var line = lines[i];
		if (line != "") {
			if (indented != "") indented += "\n";
			indented += new Array(indent+1).join(" ") + line;
		}
	}
	return indented;
}
