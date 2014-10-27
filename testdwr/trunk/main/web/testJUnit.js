
createTestGroup("JUnit");

/**
 *
 */
window.testJUnitAll = function() {
  useHtml("<div id='junitStatus'></div>");
  var noteProgressInScratch = function(passed, failed, total) {
    dwr.util.setValue("junitStatus", "Pass:" + passed + " Fail:" + failed + " Total:" + total);
  };

  Test.runAllJUnitTests(noteProgressInScratch, waitDwrCallbackOptions(function(reply) {
    if (reply != null && reply.length != 0) {
      fail(reply);
    }
  }));
};
