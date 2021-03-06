
createTestGroup("TestSuite");

window.testTestSuiteNothing = function() {
};

window.testTestSuiteWillFail = function() {
  verifyTrue(false);
  fail("This should fail");
  verifyFalse(true);
};

window.testTestSuiteWillFailLater = function() {
  setTimeout(waitAsync(function() {
    verifyTrue(false);
    fail("This should fail");
    verifyFalse(true);
  }), 1000);
};

window.testTestSuiteWillPassLater = function() {
  setTimeout(waitAsync(function() {
    verifyTrue(true);
  }), 1000);
};

window.testTestSuiteWillNotComplete = function() {
  waitAsync(function() {
    verifyTrue(true);
  });
};

window.testTestSuitePartialComplete = function() {
  waitAsync(function() {
    verifyTrue(true);
  });
  setTimeout(waitAsync(function() {
    verifyTrue(true);
  }), 1000);
};

window.testTestSuiteSyncAsync = function() {
  waitAsync(function() {
    verifyTrue(true);
  })();
};
