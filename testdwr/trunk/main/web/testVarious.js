
/**
 *
 */
function testAreIdentical() {
  var data = [ 1, 2, 3, 4 ];
  Test.areIdentical(data, data, function(reply) {
    assertTrue(reply);
  });
}

/**
 *
 */
function testScriptSessionBindingListener() {
  Test.checkScriptSessionBindingListener(createReplyIsErrorCallback());
}

/**
 *
 */
function testImHere() {
  Test.checkImHere(createReplyIsErrorCallback());
}
