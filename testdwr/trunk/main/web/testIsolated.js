
createTestGroup("Isolated");

/**
 *
 */
window.testIsolatedSyncNesting = function() {
  dwr.engine.setAsync(false);
  var count = 0;

  Test.slowStringParam("1", 100, createDelayed(function(data1) {
    count++;
    verifyEqual(count, 1);
    verifyEqual(data1, "1");

    Test.slowStringParam("2", 200, createDelayed(function(data2) {
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
  Test.slowStringParam("param", 100, {
    async:false,
    callback:createDelayed(function(param) {
      count++;
      verifyEqual(count, 1, "callback should be first with sync");
      verifyEqual(param, "param");
    })
  });
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

