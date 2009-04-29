
createTestGroup("Remoting");

/**
 *
 */
window.testRemotingGetPath = function() {
  Test.getPath(createDelayed(function(data) {
    verifyEqual("/testdwr", data);
  }));
};

/**
 *
 */
window.testRemotingVarious = function() {
  Test.variousChecks(createVerifyCallback());
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
    requestAttributes:{
      'param1':'value1',
      'param2':'value2'
    },
    errorHandler:createDelayedError()
  });
  Test.listParameters({
    callback:createDelayed(function(data) {
      verifyEqual(data.param1, "value1");
      verifyEqual(data.param2, "value2");
      verifyUndefined(data.param3);
    }),
    parameters:{
      'param1':'value1',
      'param2':'value2'
    },
    errorHandler:createDelayedError()
  });
};

/**
 *
 */
window.testRemotingHeaders = function() {
  var addedHeaders = {
    'Param1':'value1',
    'Param2':'value2'
  };

  Test.listHeaders({
    callback:createDelayed(function(data) {
      var param1 = data.Param1 || data.param1;
      var param2 = data.Param2 || data.param2;
      verifyEqual(param1, addedHeaders.Param1);
      verifyEqual(param2, addedHeaders.Param2);
      verifyUndefined(data.param3);
      verifyUndefined(data.Param3);
    }),
    headers:addedHeaders,
    errorHandler:createDelayedError()
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
