
createTestGroup("Remoting");

/**
 *
 */
window.testRemotingGetPath = function() {
  Test.getPath(createDelayed(function(data) {
    verifyEqual("/test-dwr", data);
  }));
};

/**
 *
 */
window.testRemotingVarious = function() {
  Test.variousChecks(createReplyIsErrorCallback());
};

/**
 *
 */
window.testRemotingScopeAndArgs = function() {
  var args = [ 1, "two" ];
  var scope = {
    callback:createDelayed(function(data, passedArgs) {
      verifyEqual("data", data);
      verifyEqual(this, scope);
      verifyEqual(passedArgs, args);
    })
  };

  Test.stringParam("data", {
    callback:scope.callback,
    errorHandler:createDelayedError(),
    scope:scope,
    args:args
  });
};

/**
 *
 */
window.testRemotingAsyncNesting = function() {
  var count = 0;
  Test.slowStringParam("1", 100, createDelayed(function(data1) {
    verifyEqual(data1, 1);
    count++;
    verifyEqual(count, 2);

    Test.slowStringParam("2", 200, createDelayed(function(data2) {
      verifyEqual(data2, 2);
      count++;
      verifyEqual(count, 4);
    }));

    count++;
    verifyEqual(count, 3);
  }));

  count++;
  verifyEqual(count, 1);
};

/**
 *
 */
window.testRemotingSyncNesting = function() {
  dwr.engine.setAsync(false);
  var count = 0;

  Test.slowStringParam("1", 100, createDelayed(function(data1) {
    verifyEqual(data1, "1");
    count++;
    verifyEqual(count, 1);

    Test.slowStringParam("2", 200, createDelayed(function(data2) {
      verifyEqual(data2, "2");
      count++;
      verifyEqual(count, 2);
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
window.testRemotingSyncReturning = function() {
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
window.testRemotingSyncCallMetaData = function() {
  var count = 0;
  Test.slowStringParam("1", 100, {
    async:false,
    callback:createDelayed(function(data) {
      verifyEqual(data, "1");
      count++;
      verifyEqual(count, 1);
    })
  });
  count++;
  verifyEqual(count, 2);
};

/**
 *
 */
window.testRemotingAsyncCallMetaData = function() {
  var count = 0;
  Test.slowStringParam("1", 100, {
    async:true,
    callback:function(data) {
      verifyEqual(data, "1");
      count++;
      verifyEqual(count, 2);
    }
  });
  count++;
  verifyEqual(count, 1);
};

/**
 *
 */
window.testRemotingParameters = function() {
  Test.listParameters({
    callback:createDelayed(function(data) {
      verifyEqual(data.param1, "value1");
      verifyEqual(data.param2, "value2");
      verifyUndefined(data.param3);
    }),
    parameters:{
      'param1':'value1',
      'param2':'value2'
    }
  });
};

/**
 *
 */
window.testRemotingHeaders = function() {
  Test.listHeaders({
    callback:createDelayed(function(data) {
      verifyEqual(data.param1, "value1");
      verifyEqual(data.param2, "value2");
      verifyUndefined(data.param3);
    }),
    headers:{
      'param1':'value1',
      'param2':'value2'
    }
  });
};

/**
 *
 */
window.testRemotingTimeout = function() {
  Test.waitFor(3000, {
    callback:createDelayedError(),
    timeout:1000,
    errorHandler:createDelayed(function(message, ex) {
      verifyNotNull(ex);
    })
  });
};
