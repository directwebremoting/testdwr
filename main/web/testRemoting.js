
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
  var someArgs = [ 1, "two" ];
  var someObj = { };
  var someParam = "data";

  someObj.someFunc = createDelayed(function(returnData, passedArgs) {
    verifyEqual(returnData, someParam, "return data wrong");
    verifyEqual(this, someObj, "scope wrong");
    verifyEqual(passedArgs, someArgs, "args wrong");
  });

  Test.stringParam(someParam, {
    callback:someObj.someFunc,
    errorHandler:createDelayedError(),
    scope:someObj,
    arg:someArgs
  });
};

/**
 *
 */
window.testRemotingAsyncNesting = function() {
  var count = 0;
  Test.slowStringParam("1", 1000, createDelayed(function(data1) {
    verifyEqual(data1, 1);
    count++;
    verifyEqual(count, 2);

    Test.slowStringParam("2", 2000, createDelayed(function(data2) {
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
