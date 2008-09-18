
createTestGroup("TestSuite");

window.testTestSuiteNothing = function() {
};

window.testTestSuiteWillFail = function() {
  verifyTrue(false);
  fail("This should fail");
  verifyFalse(true);
};

window.testTestSuiteWillFailLater = function() {
  setTimeout(createDelayed(function() {
    verifyTrue(false);
    fail("This should fail");
    verifyFalse(true);
  }), 1000);
};

window.testTestSuiteWillPassLater = function() {
  setTimeout(createDelayed(function() {
    verifyTrue(true);
  }), 1000);
};

window.testTestSuiteWillDelayError = function() {
  setTimeout(createDelayedError(function() {
    verifyTrue(false);
  }), 1000);
};

window.testTestSuiteWillNotComplete = function() {
  createDelayed(function() {
    verifyTrue(true);
  });
};

window.testTestSuitePartialComplete = function() {
  createDelayed(function() {
    verifyTrue(true);
  });
  setTimeout(createDelayed(function() {
    verifyTrue(true);
  }), 1000);
};

window.testTestSuiteSyncAsync = function() {
  createDelayed(function() {
    verifyTrue(true);
  })();
};

/**
 * The ability to test the groups isn't working
 */
createTestGroup("Combination");
window.testCombinationMarshalling = function() {
  dwr.engine.setAsync(true);
  runTestGroup('Marshall');
  dwr.engine.setAsync(false);
};

