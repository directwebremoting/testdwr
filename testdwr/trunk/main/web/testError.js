createTestGroup("Error");

/**
 *
 */
window.testErrorTransportTypes = function() {

  var exceptionHandler = function(message, ex) {
    verifyNotNull(message);
    verifyNotNull(ex);
    verifyNotNull(ex.message);
    verifyEqual("string", typeof ex.message);
    verifyEqual(ex.message, message);
    verifyEqual("java.lang.NullPointerException", ex.javaClassName);
  };

  var callData = {};

  callData.httpMethod = "POST";
  callData.rpcType = dwr.engine.XMLHttpRequest;
  Test.throwNPE(waitDwrExceptionHandlerOptions(callData));

  callData.rpcType = dwr.engine.IFrame;
  Test.throwNPE(waitDwrExceptionHandlerOptions(callData));

  callData.rpcType = dwr.engine.ScriptTag;
  Test.throwNPE(waitDwrExceptionHandlerOptions(callData));

  callData.httpMethod = "GET";
  callData.rpcType = dwr.engine.XMLHttpRequest;
  Test.throwNPE(waitDwrExceptionHandlerOptions(callData));

  callData.rpcType = dwr.engine.IFrame;
  Test.throwNPE(waitDwrExceptionHandlerOptions(callData));

  callData.rpcType = dwr.engine.ScriptTag;
  Test.throwNPE(waitDwrExceptionHandlerOptions(callData));

  callData.rpcType = dwr.engine.XMLHttpRequest;
};

/**
 *
 */
window.testErrorLevels = function() {
  // Setup
  var oldWarningHandler = dwr.engine._warningHandler;
  var oldErrorHandler = dwr.engine._errorHandler;
  
  // Check handle by global error handler
  var c = new dwrunit.SingleAsyncCompletor;
  dwr.engine.setWarningHandler(waitAsyncAndFail(c, "error gone to global-warning not global-error"));
  dwr.engine.setErrorHandler(waitAsync(c));
  Test.throwNPE("handle by global-error");

  // Check handle by batch handler
  var c = new dwrunit.SingleAsyncCompletor;
  dwr.engine.setErrorHandler(waitAsyncAndFail(c, "error gone to global-error not batch-error"));
  dwr.engine.setWarningHandler(waitAsyncAndFail(c, "error gone to global-warning not batch-error"));
  dwr.engine.beginBatch();
  Test.throwNPE("handle by batch-error");
  dwr.engine.endBatch({
    callback:waitAsyncAndFail(c, "error gone to callback not batch-error"),
    errorHandler:waitAsync(c),
    warningHandler:waitAsyncAndFail(c, "error gone to batch-warning not batch-error")
  });

  // Check handle by call handler
  var c = new dwrunit.SingleAsyncCompletor;
  dwr.engine.setErrorHandler(waitAsyncAndFail(c, "error gone to global-error not call-error"));
  dwr.engine.setWarningHandler(waitAsyncAndFail(c, "error gone to global-warning not call-error"));
  Test.throwNPE("handle by call", {
    callback:waitAsyncAndFail(c, "error gone to callback not call-error"),
    errorHandler:waitAsync(c),
    warningHandler:waitAsyncAndFail(c, "error gone to call-warning not call-error")
  });

  // Undo setup
  dwr.engine.setWarningHandler(oldWarningHandler);
  dwr.engine.setErrorHandler(oldErrorHandler);
};

/**
 *
 */
window.testError404Handling = function() {
  var oldPath = Test._path;
  Test._path = oldPath + "/thisPathDoesNotExist/dwr";
  Test.intParam(1, waitDwrErrorHandlerOptions(function(message, ex) {
    verifyNotNull(message);
    verifyNotNull(ex);
    verifyNotNull(ex.message);
    verifyEqual("string", typeof ex.message);
    verifyEqual(ex.message, message);
    verifyEqual("dwr.engine.http.404", ex.name);
  }));
  Test._path = oldPath; // by resetting the path immediately after sending we affect no other tests
  Test.intParam(1, waitDwrCallbackOptions());
};

/**
 *
 */
window.testErrorExceptionDetail = function() {
  Test.throwNPE("NPE-Message", waitDwrExceptionHandlerOptions(function(message, ex) {
    verifyEqual("NPE-Message", message);
    verifyNotNull(ex);
    verifyEqual(ex.message, message);
    verifyEqual("java.lang.NullPointerException", ex.javaClassName);
  }));

  Test.throwIAE("IAE-Message", waitDwrExceptionHandlerOptions(function(message, ex) {
    verifyEqual("Error", message);
    verifyNotNull(ex);
    verifyEqual(ex.message, message);
    verifyEqual("java.lang.Throwable", ex.javaClassName);
  }));

  Test.throwSPE("SPE-Message", "NPE-Message", waitDwrExceptionHandlerOptions(function(message, ex) {
    verifyEqual("SPE-Message", message);
    verifyNotNull(ex);
    verifyEqual(ex.message, message);
    verifyEqual("org.xml.sax.SAXParseException", ex.javaClassName);
    verifyEqual(42, ex.lineNumber);
    verifyEqual("java.lang.NullPointerException", ex.exception.javaClassName);
    verifyEqual("NPE-Message", ex.exception.message);
  }));
};
