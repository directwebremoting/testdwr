
/**
 *
 */
window.testMemoryLeaks = function(count) {
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
        testMemoryLeaks(next);
      }, 0);
    });
  }
};

/**
 * Changing the _path clashes with other tests
 */
window.testErrorRedirect = function(){
  var oldPath = Test._path;
  Test._path = "/test-dwr/custom/307";
  Test.doNothing({
    callback:createDelayedError(),
    exceptionHandler:createDelayedError(),
    textHtmlHandler:createDelayed(function(data) {
      verifyEqual(200, data.status);
      verifyTrue(data.responseText.indexOf("html") != -1);
      verifyEqual("text/html", data.contentType);
      Test._path = oldPath;
    })
  });
};

/**
 *
 */
window.testServerChecks = function() {
  Test.serverChecks({
    callback:createDelayed(),
    exceptionHandler:createDelayedError()
  });
};

/**
 * This doesn't always work when there is lots going on, and it requires to not
 * be the last test in a run because it delays reports
 */
window.testScriptSessionListener = function() {
  var progress1 = createDelayed(function(data) {
    if (data.report.length == 0) {
      return;
    }
    fail(data.report.join("<br/>"));
  });
  var progress2 = createDelayed(function(data) {
    if (data.report.length == 0) {
      return;
    }
    fail(data.report.join("<br/>"));
  });
  Test.checkScriptSessionListener(progress1, progress2, createVerifyCallback());
};

