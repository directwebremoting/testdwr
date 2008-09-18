
/**
 *
 */
window.testAreIdentical = function() {
  var data = [ 1, 2, 3, 4 ];
  Test.areIdentical(data, data, function(reply) {
    assertTrue(reply);
  });
};

/**
 *
 */
window.testScriptSessionBindingListener = function() {
  Test.checkScriptSessionBindingListener(createReplyIsErrorCallback());
};

/**
 *
 */
window.testImHere = function() {
  Test.checkImHere(createReplyIsErrorCallback());
};
