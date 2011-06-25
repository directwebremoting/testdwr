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

  var callData = {
    callback:createDelayedError(),
    errorHandler:createDelayedError(),
    warningHandler:createDelayedError()
  };

  callData.httpMethod = "POST";
  callData.rpcType = dwr.engine.XMLHttpRequest;
  callData.exceptionHandler = createDelayed(exceptionHandler);
  Test.throwNPE(callData);

  callData.rpcType = dwr.engine.IFrame;
  callData.exceptionHandler = createDelayed(exceptionHandler);
  Test.throwNPE(callData);

  callData.rpcType = dwr.engine.ScriptTag;
  callData.exceptionHandler = createDelayed(exceptionHandler);
  Test.throwNPE(callData);

  callData.httpMethod = "GET";
  callData.rpcType = dwr.engine.XMLHttpRequest;
  callData.exceptionHandler = createDelayed(exceptionHandler);
  Test.throwNPE(callData);

  callData.rpcType = dwr.engine.IFrame;
  callData.exceptionHandler = createDelayed(exceptionHandler);
  Test.throwNPE(callData);

  callData.rpcType = dwr.engine.ScriptTag;
  callData.exceptionHandler = createDelayed(exceptionHandler);
  Test.throwNPE(callData);

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
  dwr.engine.setWarningHandler(createDelayedError("error gone to global-warning not global-error"));
  dwr.engine.setErrorHandler(createDelayed());
  Test.throwNPE("handle by global-error");

  // Check handle by batch handler
  dwr.engine.setErrorHandler(createDelayedError("error gone to global-error not batch-error"));
  dwr.engine.setWarningHandler(createDelayedError("error gone to global-warning not batch-error"));
  dwr.engine.beginBatch();
  Test.throwNPE("handle by batch-error");
  dwr.engine.endBatch({
    callback:function() {},
    errorHandler:createDelayed(),
    warningHandler:createDelayedError("error gone to batch-warning not batch-error")
  });

  // Check handle by call handler
  dwr.engine.setErrorHandler(createDelayedError("error gone to global-error not call-error"));
  dwr.engine.setWarningHandler(createDelayedError("error gone to global-warning not call-error"));
  Test.throwNPE("handle by call", {
    callback:function() {},
    errorHandler:createDelayed(),
    warningHandler:createDelayedError("error gone to call-warning not call-error")
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
  Test.intParam(1, {
    callback:createDelayedError(),
    errorHandler:createDelayed(function(message, ex) {
      verifyNotNull(message);
      verifyNotNull(ex);
      verifyNotNull(ex.message);
      verifyEqual("string", typeof ex.message);
      verifyEqual(ex.message, message);
      verifyEqual("dwr.engine.http.404", ex.name);
    })
  });
  Test._path = oldPath;
  Test.intParam(1, createDelayed());
};

/**
 *
 */
window.testErrorExceptionDetail = function() {
  Test.throwNPE("NPE-Message", {
    callback:createDelayedError(),
    exceptionHandler:createDelayed(function(message, ex) {
      verifyEqual("NPE-Message", message);
      verifyNotNull(ex);
      verifyEqual(ex.message, message);
      verifyEqual("java.lang.NullPointerException", ex.javaClassName);
    })
  });

  Test.throwIAE("IAE-Message", {
    callback:createDelayedError(),
    exceptionHandler:createDelayed(function(message, ex) {
      verifyEqual("Error", message);
      verifyNotNull(ex);
      verifyEqual(ex.message, message);
      verifyEqual("java.lang.Throwable", ex.javaClassName);
    })
  });

  Test.throwSPE("SPE-Message", "NPE-Message", {
    callback:createDelayedError(),
    exceptionHandler:createDelayed(function(message, ex) {
      verifyEqual("SPE-Message", message);
      verifyNotNull(ex);
      verifyEqual(ex.message, message);
      verifyEqual("org.xml.sax.SAXParseException", ex.javaClassName);
      verifyEqual(42, ex.lineNumber);
      verifyEqual("java.lang.NullPointerException", ex.exception.javaClassName);
      verifyEqual("NPE-Message", ex.exception.message);
    })
  });
};
