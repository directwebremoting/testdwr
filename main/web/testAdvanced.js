
createTestGroup("Advanced");

/*
 * Redirects are now handled by the error handler, should we remove these tests?
 * window.testAdvancedGlobalRedirectResponse = function() {
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

window.testAdvancedGlobalTextHtmlResponse = function() {
    var oldPath = Test._path;
    Test._path = common.getContextPath() + "/custom/307"; // This only works in Jetty
    var c = new dwrunit.SingleAsyncCompletor;
    dwr.engine.setTextHtmlHandler(waitAsync(c, function(data) {
        verifyEqual(200, data.status);
        verifyTrue(data.htmlResponseText.indexOf("html") != -1);
        verifyEqual("text/html", data.contentType);
    }));
    Test.doNothing({
        callback:waitAsyncAndFail(c, "callback triggered instead of textHtmlHandler.  This application must be deployed to Jetty for this test to pass."),
        exceptionHandler:waitAsyncAndFail(c, "exceptionHandler triggered instead of textHtmlHandler.  This application must be deployed to Jetty for this test to pass."),
        errorHandler:waitAsyncAndFail(c, "errorHandler triggered instead of textHtmlHandler.  This application must be deployed to Jetty for this test to pass.")
    });
    Test._path = oldPath; // by resetting the path immediately after sending we affect no other tests
}

window.testAdvancedTextHtmlResponse = function() {
    var oldPath = Test._path;
    Test._path = common.getContextPath() + "/custom/307"; // This only works in Jetty
    var c = new dwrunit.SingleAsyncCompletor;
    Test.doNothing({
        callback:waitAsyncAndFail(c, "callback triggered instead of textHtmlHandler."),
        exceptionHandler:waitAsyncAndFail(c, "exceptionHandler triggered instead of textHtmlHandler."),
        errorHandler:waitAsyncAndFail(c, "errorHandler triggered instead of textHtmlHandler."),
        textHtmlHandler:waitAsync(c, function(data) {
          verifyTrue(data.htmlResponseText.indexOf("html") != -1);
          verifyEqual("text/html", data.contentType);
        })
    });
    Test._path = oldPath; // by resetting the path immediately after sending we affect no other tests
}

window.testAdvancedIframeTextHtmlResponse = function() {
    dwr.engine.beginBatch();
    dwr.engine._batch.fileUpload = true; // hack    
    window.testAdvancedTextHtmlResponse();
    dwr.engine.endBatch();
}

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

