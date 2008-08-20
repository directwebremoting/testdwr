
/**
 *
 */
function testMemoryLeaks(count) {
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
}

/**
 * Changing the _path clashes with other tests
 */
function testErrorRedirect(){
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
}

/**
 *
 */
function testServerChecks() {
  Test.serverChecks({
    callback:createDelayed(),
    exceptionHandler:createDelayedError()
  });
}

