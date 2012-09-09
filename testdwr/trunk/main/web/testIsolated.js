
createTestGroup("Isolated");

/**
 *
 */
window.testIsolatedSyncNesting = function() {
  dwr.engine.setAsync(false);
  var count = 0;

  Test.slowStringParam("1", 100, waitDwrCallbackOptions(function(data1) {
    count++;
    verifyEqual(count, 1);
    verifyEqual(data1, "1");

    Test.slowStringParam("2", 200, waitDwrCallbackOptions(function(data2) {
      count++;
      verifyEqual(count, 2);
      verifyEqual(data2, "2");
    }));
    count++;
    verifyEqual(count, 3);
  }));

  count++;
  verifyEqual(count, 4);

  dwr.engine.setAsync(true);
};

/**
 *
 */
window.testIsolatedSyncReturning = function() {
  dwr.engine.setAsync(false);
  var data1 = Test.slowStringParam("1", 100);
  verifyEqual(data1, "1");
  var data2 = Test.slowStringParam("SyncNesting-2", 100);
  verifyEqual(data2, "SyncNesting-2");
  dwr.engine.setAsync(true);
};

/**
 *
 */
window.testIsolatedSyncCallMetaData = function() {
  var count = 0;
  Test.slowStringParam("param", 100, waitDwrCallbackOptions({
    async:false,
    callback:function(param) {
      count++;
      verifyEqual(count, 1, "callback should be first with sync");
      verifyEqual(param, "param");
    }
  }));
  count++;
  verifyEqual(count, 2, "after should be last with sync");
};

/**
 *
 */
window.testIsolatedAsyncCallMetaData = function() {
  var count = 0;
  Test.slowStringParam("param", 100, {
    async:true, // the default
    callback:function(param) {
      count++;
      verifyEqual(count, 2, "callback should be last with async");
      verifyEqual(param, "param");
    }
  });
  count++;
  verifyEqual(count, 1, "after should be first with async");
};

/**
 *
 */
window.testIsolatedNonLocalhost = function() {
  var path = Test._path;
  var hostPart = window.location.href.split('/')[2];
  assertEqual(hostPart.indexOf('localhost'), 0, "automatic script-tag testing needs http://localhost...");
  hostPart = hostPart.replace(/localhost/, '127.0.0.1');
  Test._path = "http://" + hostPart + path;

  Test.stringParam("param", waitDwrCallbackOptions(function(param){
    verifyEqual(param, "param");
  }));

  Test._path = path;
};
