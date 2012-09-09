
createTestGroup("Various");

/**
 *
 */
window.testVariousAreIdentical = function() {
  var data = [ 1, 2, 3, 4 ];
  Test.areIdentical(data, data, function(reply) {
    assertTrue(reply);
  });
};

/**
 *
 */
window.testVariousScriptSessionBindingListener = function() {
  Test.checkScriptSessionBindingListener(waitDwrVerifyCallbackOptions());
};

/**
 *
 */
window.testVariousImHere = function() {
  Test.checkImHere(waitDwrVerifyCallbackOptions());
};

/**
 *
 */
window.testVariousCheckContext = function() {
  Test.checkContext(common.getContextPath(), waitDwrVerifyCallbackOptions());
};
