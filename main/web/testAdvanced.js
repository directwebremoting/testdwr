
createTestGroup("Advanced");

/**
 *
 */
window.testAdvancedMemoryLeaks = function(count) {
  if (count == null) {
    count = 0;
  }
  if (count > 10000) {
    success("testMemoryLeaks");
  }
  else {
    var next = count + 1;
    Test.doNothing(function() {
      setTimeout(function() {
        testAdvancedMemoryLeaks(next);
      }, 0);
    });
  }
};

/**
 * 
 */
window.testAdvancedErrorRedirectDISABLED = function(){
/*
  var oldPath = Test._path;
  Test._path = "/testdwr/custom/307";
  var c = new dwrunit.SingleAsyncCompletor;
  Test.doNothing({
    callback:waitAsyncAndFail(c, "callback triggered instead of textHtmlHandler"),
    exceptionHandler:waitAsyncAndFail(c, "exceptionHandler triggered instead of textHtmlHandler"),
    errorHandler:waitAsyncAndFail(c, "errorHandler triggered instead of textHtmlHandler"),
    textHtmlHandler:waitAsync(c, function(data) {
      verifyEqual(200, data.status);
      verifyTrue(data.responseText.indexOf("html") != -1);
      verifyEqual("text/html", data.contentType);
    })
  });
  Test._path = oldPath; // by resetting the path immediately after sending we affect no other tests
*/
};

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

