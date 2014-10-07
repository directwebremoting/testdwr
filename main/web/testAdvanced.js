
createTestGroup("Advanced");

/*
 * Redirects are now handled by the error handler, should we remove these tests?
 * 
window.testAdvancedGlobalRedirectResponse = function() {
    var c = new dwrunit.SingleAsyncCompletor;
    dwr.engine.setTextOrRedirectHandler(waitAsync(c, function(data) {
        verifyEqual(302, data.status);
    }));
    Test.testRedirectResponse({
        callback:waitAsyncAndFail(c, "callback triggered instead of textOrRedirectHandler"),
        exceptionHandler:waitAsyncAndFail(c, "exceptionHandler triggered instead of textOrRedirectHandler"),
        errorHandler:waitAsyncAndFail(c, "errorHandler triggered instead of textOrRedirectHandler"),
    });
};

window.testAdvancedRedirectResponse = function() {
    var c = new dwrunit.SingleAsyncCompletor;
    Test.testRedirectResponse({
        callback:waitAsyncAndFail(c, "callback triggered instead of textOrRedirectHandler"),
        exceptionHandler:waitAsyncAndFail(c, "exceptionHandler triggered instead of textOrRedirectHandler"),
        errorHandler:waitAsyncAndFail(c, "errorHandler triggered instead of textOrRedirectHandler"),
        textOrRedirectHandler:waitAsync(c, function(data) {
          verifyEqual(302, data.status);
        })
    });
}*/

(function(){
	var handler = {
		GlobalTextHtmlHandler: "global",
		BatchTextHtmlHandler: "batch",
		TextHtmlErrorHandler: "error"
	};
	var redirect = {
		"": "",
		RedirectTo: "/redirect/307" // this will cause a 307 redirect
	};
	var response = {
		EmptyHtml: {
			path: "/empty",
			verify: function(responseText) {
				assertNotNull(responseText); 
				verifyTrue(!responseText.toLowerCase().contains("<body>") || responseText.toLowerCase().contains("<body></body>"));
			}
		},
		HtmlPage: {
			path: "/page",
			verify: function(responseText) {
				verifyTrue(responseText.indexOf("html") != -1);
			}
		}
	};
	var mode = {
		"": false,
		"InIframeMode": true
	}

	for(var handlerName in handler) {
		for(var redirectName in redirect) {
			for(var responseName in response) {
				for (var modeName in mode) {
					var testFuncName = "testAdvanced" + handlerName + "With" + redirectName + responseName + modeName;
					(function(hand, red, resp, mod) {
						var fullPath = common.getContextPath() + "/custom" + red + resp.path;
						window[testFuncName] = function() {
							testTextHtml(hand, fullPath, resp.verify, mod);
						}
					})(handler[handlerName], redirect[redirectName], response[responseName], mode[modeName]);
				}
			}
		}
	}
	
	function testTextHtml(handler, path, verifyFunc, iframeMode) {
	    if (!dwr.engine._scriptSessionId) Test.doNothing({async:false}); // Make sure we have established scriptSessionId before hacking _path
	    var oldPath = Test._path;
	    Test._path = path;
	    var c = new dwrunit.SingleAsyncCompletor;
	    function verify(ex) {
    		verifyEqual(ex.name, "dwr.engine.textHtmlReply");
    		verifyFunc(ex.responseText);
	    }
    	var oldGlobal = dwr.engine._textHtmlHandler;
	    dwr.engine.setTextHtmlHandler(
	    	handler == "global" ?
	    		waitAsync(c, verify)
	    	:
	        	null
	    );
	    dwr.engine.beginBatch();
	    if (iframeMode) dwr.engine._batch.fileUpload = true; // hack    
	    Test.doNothing({
	        callback: waitAsyncAndFail(c, "wrong handler triggered (callback)"),
	        exceptionHandler: waitAsyncAndFail(c, "wrong handler triggered (exceptionHandler)"),
	        errorHandler: 
	        	handler == "error" ? 
		        	waitAsync(c, function(msg, ex){verify(ex);})
		        :
		        	waitAsyncAndFail(c, "wrong handler triggered (errorHandler)")
	    });
	    dwr.engine.endBatch({
	        textHtmlHandler:
	        	handler == "batch" ? 
		        	waitAsync(c, verify)
		        :
		        	null
		});
	    Test._path = oldPath; // by resetting the path immediately after sending we affect no other tests
    	dwr.engine.setTextHtmlHandler(oldGlobal);
	}
})();

/**
 *
 */
window.testAdvancedServerChecks = function() {
  Test.serverChecks(waitDwrCallbackOptions());
};

/**
 * This doesn't always work when there is lots going on, and it requires to not
 * be the last test in a run because it delays reports
 */
window.testAdvancedScriptSessionListenerDISABLED = function() {
/*
  var progress1 = waitAsync(function(data) {
    // Fail if there are any report messages
    for(var i=0; i<data.report.length; i++) {
      fail(data.report[i]);
    }
  });
  var progress2 = waitAsync(function(data) {
    // Fail if there are any report messages
    for(var i=0; i<data.report.length; i++) {
      fail(data.report[i]);
    }
  });
  Test.checkScriptSessionListener(progress1, progress2, waitDwrVerifyCallbackOptions());
*/
};

