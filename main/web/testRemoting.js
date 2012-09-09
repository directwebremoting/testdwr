
createTestGroup("Remoting");

/**
 *
 */
window.testRemotingGetPath = function() {
  Test.getPath(waitDwrCallbackOptions(function(data) {
    verifyEqual(common.getContextPath(), data);
  }));
};

/**
 *
 */
window.testRemotingVarious = function() {
  Test.variousChecks(waitDwrVerifyCallbackOptions());
};

window.testRemotingStatic = function() {
  Test.staticMethod(waitDwrCallbackOptions(function (data) {
    verifyEqual("static SpringServletTest.staticMethod() says hello.", data);
  }));
};

/**
 *
 */
window.testRemotingScopeAndArgs = function() {
  var someArgs = [ 1, "two" ];
  var someObj = { };
  var someParam = "data";

  someObj.someFunc = function(returnData, passedArgs) {
    verifyEqual(returnData, someParam, "return data wrong");
    verifyEqual(this, someObj, "scope wrong");
    verifyEqual(passedArgs, someArgs, "args wrong");
  };

  Test.stringParam(someParam, waitDwrCallbackOptions({
    callback:someObj.someFunc,
    scope:someObj,
    arg:someArgs
  }));
};

/**
 *
 */
window.testRemotingAsyncNesting = function() {
  var count = 0;
  Test.slowStringParam("1", 1000, waitDwrCallbackOptions(function(data1) {
    verifyEqual(data1, 1);
    count++;
    verifyEqual(count, 2);

    Test.slowStringParam("2", 2000, waitDwrCallbackOptions(function(data2) {
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
window.testRemotingAttributesInCall = function() {
  Test.listParameters(waitDwrCallbackOptions({
    callback:function(data) {
      verifyEqual(data.param1, "value1");
      verifyEqual(data.param2, "value2");
      verifyUndefined(data.param3);
    },
    attributes:{
      'param1':'value1',
      'param2':'value2'
    }
  }));
};

/**
 *
 */
window.testRemotingAttributesGlobal = function() {
  dwr.engine.setAttributes({
    'param1':'value1',
    'param2':'value2'
  });
  Test.listParameters(waitDwrCallbackOptions(function(data) {
    verifyEqual(data.param1, "value1");
    verifyEqual(data.param2, "value2");
    verifyUndefined(data.param3);
    dwr.engine.setAttributes(null);
  }));
};

/**
 *
 */
window.testRemotingHeaders = function() {
  var addedHeaders = {
    'Param1':'value1',
    'Param2':'value2'
  };

  Test.listHeaders(waitDwrCallbackOptions({
    callback:function(data) {
      var param1 = data.Param1 || data.param1;
      var param2 = data.Param2 || data.param2;
      verifyEqual(param1, addedHeaders.Param1);
      verifyEqual(param2, addedHeaders.Param2);
      verifyUndefined(data.param3);
      verifyUndefined(data.Param3);
    },
    headers:addedHeaders
  }));
};

/**
 *
 */
window.testRemotingTimeout = function() {
  Test.waitFor(3000, waitDwrErrorHandlerOptions({
    timeout:1000,
    errorHandler:function(message, ex) {
      verifyNotNull(ex);
    }
  }));
};
