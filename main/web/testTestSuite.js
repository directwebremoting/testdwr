
createTestGroup("TestSuite");

function testTestSuiteNothing() {
}

function testTestSuiteWillFail() {
  verifyTrue(false);
  fail("This should fail");
  verifyFalse(true);
}

function testTestSuiteWillFailLater() {
  setTimeout(createDelayed(function() {
    verifyTrue(false);
    fail("This should fail");
    verifyFalse(true);
  }), 1000);
}

function testTestSuiteWillPassLater() {
  setTimeout(createDelayed(function() {
    verifyTrue(true);
  }), 1000);
}

function testTestSuiteWillDelayError() {
  setTimeout(createDelayedError(function() {
    verifyTrue(false);
  }), 1000);
}

function testTestSuiteWillNotComplete() {
  createDelayed(function() {
    verifyTrue(true);
  });
}

function testTestSuitePartialComplete() {
  createDelayed(function() {
    verifyTrue(true);
  });
  setTimeout(createDelayed(function() {
    verifyTrue(true);
  }), 1000);
}

function testTestSuiteSyncAsync() {
  createDelayed(function() {
    verifyTrue(true);
  })();
}

/**
 * The ability to test the groups isn't working
 */
createTestGroup("Combination");
function testCombinationMarshalling() {
  dwr.engine.setAsync(true);
  runTestGroup('Marshall');
  dwr.engine.setAsync(false);
}
