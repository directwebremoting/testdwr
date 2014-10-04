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
 * Single-shot test:
 *   {
 * 	   call: ["callback", "exceptionHandler", "errorHandler"],
 *     expected: ["call.callback"]
 *   }
 * 
 * Batch test:
 *   {
 *     call1: ["callback"],
 *     call2_exception: ["callback", "exceptionHandler"],
 *     batch: ["errorHandler"],
 *     expected: ["call1.callback", "call2.exceptionHandler"]
 *   }
 */
function handlerTest(conf) {
  handlerTest2(conf, false);
  handlerTest2(conf, true);
}
var oldDebugFunc;
var debugOverrideCount = 0;
function debugOverrideFunc(arg1) {
  if (arg1.addTestResult) {
    arg1.addTestResult();
  }
  oldDebugFunc.apply(dwr.engine, arguments);
}
function handlerTest2(conf, throwExceptionInHandlers) {
  var confWithoutExpected = {};
  for(p in conf) {
    if (p != "expected") confWithoutExpected[p] = conf[p];
  }
  var confstr = dwr.util.toDescriptiveString(confWithoutExpected, 10, {childIndent:"", lineTerminator:""});

  // Save refs to internals we override for the test
  var oldWarningHandler = dwr.engine._warningHandler;
  var oldErrorHandler = dwr.engine._errorHandler;
  var oldSend = dwr.engine.transport.send;
  if (debugOverrideCount == 0) oldDebugFunc = dwr.engine._debug;
  debugOverrideCount++;

  // Creates a callback/*Handler function that will save its id in the result list
  // and may also throw an exception if desired to test resilience to bugs in user code 
  function makeHandler(id, throwException) {
    return function() {
      results.push(id);
      if (throwException) {
        expected.push("global._debug");
        expectedDebug.push(id);
        var ex = new Error("Testing exception in handler.");
        ex.addTestResult = function() {
          results.push("global._debug"); 
          resultsDebug.push(id);
        }
        throw ex;
      }
    }
  }

  // Override internals 
  dwr.engine.setWarningHandler(makeHandler("global.warningHandler", throwExceptionInHandlers));
  dwr.engine.setErrorHandler(makeHandler("global.errorHandler", throwExceptionInHandlers));
  dwr.engine._debug = debugOverrideFunc;

  var isSingleShot = false;
  var isBatch = false;
  var isBatchStarted = false;
  var results = [];
  var resultsDebug = [];
  var expected = [];
  var expectedDebug = [];
  var batchOpt = {};

  // Test sequence is:
  // - open Completor
  // - wait for the batch to end through postHook
  // - check results
  // - close Completor
  
  var c = new dwrunit.ExplicitAsyncCompletor;

  var postHook = waitAsync(c, function() {
    compareResultAndFinish();
  });

  function compareResultAndFinish() {
    // Handlers called
    expected.sort();
    results.sort();
    var same = true;
    if (expected.length != results.length) 
      same = false;
    if (same) {
      for(var i=0; i<expected.length; i++) {
        if (expected[i] != results[i]) 
          same = false;
      }
    }
    var basemsg = "Test " + confstr;
    if (!same) {
      var expectedstr = dwr.util.toDescriptiveString(expected, 10, {childIndent:"", lineTerminator:""});
      var resultstr = dwr.util.toDescriptiveString(results, 10, {childIndent:"", lineTerminator:""});
      dwrunit.fail(basemsg + " expected:" + expectedstr + " results: " + resultstr);
    }

    // Debug calls
    expectedDebug.sort();
    resultsDebug.sort();
    var same = true;
    if (expectedDebug.length != resultsDebug.length) 
      same = false;
    if (same) {
      for(var i=0; i<expectedDebug.length; i++) {
        if (expectedDebug[i] != resultsDebug[i]) 
          same = false;
      }
    }
    if (!same) {
      var expectedstr = dwr.util.toDescriptiveString(expectedDebug, 10, {childIndent:"", lineTerminator:""});
      var resultstr = dwr.util.toDescriptiveString(resultsDebug, 10, {childIndent:"", lineTerminator:""});
      dwrunit.fail(basemsg + " expectedDebug:" + expectedstr + " resultsDebug: " + resultstr);
    }

  	c.complete();
    cleanup();
  }
  
  function cleanup() {
    debugOverrideCount--;
    if (debugOverrideCount == 0) dwr.engine._debug = oldDebugFunc;
  }
  
  // Utilities
  
  function startBatchIfNeeded() {
    isBatch = true;
    if (isSingleShot) throw new Error("Not allowed to mix test configuration for single-call and batches.");
    if (!isBatchStarted) {
      dwr.engine.beginBatch();
      batchOpt.postHook = postHook;
      isBatchStarted = true;
    }
  }

  function forceErrorNextBatch() {
    dwr.engine.transport.send = function(batch) {
      dwr.engine.transport.send = oldSend;
      setTimeout(waitAsync(c, function() {
        dwr.engine._handleError(batch, new Error("Simulated batch error."));
        setTimeout(waitAsync(c, function() {
          compareResultAndFinish();
        }), 200);
      }), 50);
    }
  }

  // Set up and execute test according to configuration
  
  try {
    for(p in conf) {
      var value = conf[p];
      var match = p.match(/([^_]*)(?:_(.*))?/);
      var key = match[1];
      var oper = match[2];
      if (key.startsWith("call")) {
        var callOpt = {};
        if (key == "call") {
          isSingleShot = true;
          if (isBatch) throw new Error("Not allowed to mix test configuration for single-call and batches.");
          callOpt.postHook = postHook;
        } else {
          startBatchIfNeeded();
        }
        for(i=0; i<value.length; i++) {
          var handler = value[i];
          if (handler == "callback") callOpt.callback = makeHandler(key + ".callback", throwExceptionInHandlers);
          else if (handler == "exceptionHandler") callOpt.exceptionHandler = makeHandler(key + ".exceptionHandler", throwExceptionInHandlers);
          else if (handler == "errorHandler") callOpt.errorHandler = makeHandler(key + ".errorHandler", throwExceptionInHandlers);
          else if (handler == "warningHandler") callOpt.warningHandler = makeHandler(key + ".warningHandler", throwExceptionInHandlers);
          else throw new Error("Unrecognized handler: " + handler);
        }
        if (oper == "error") {
          forceErrorNextBatch();
        }
        var hasOpts = false;
        for(p in callOpt) hasOpts = true;
        if (!oper || oper == "") {
          if (hasOpts)
            Test.doNothing(callOpt);
          else
            Test.doNothing();
        } else if (oper == "exception") {
          if (hasOpts)
            Test.throwNPE(callOpt);
          else
            Test.throwNPE();
        }
      } else if (key == "batch") {
        startBatchIfNeeded();
        for(i=0; i<value.length; i++) {
          var handler = value[i];
          if (handler == "errorHandler") batchOpt.errorHandler = makeHandler("batch.errorHandler", throwExceptionInHandlers);
        }
        if (oper == "error") {
          forceErrorNextBatch();
        }
      } else if (key == "expected") {
        expected = expected.concat(value);
      }
    }
  } catch(ex) {
    dwrunit.fail("Test " + confstr + " threw exception: " + ex.message);
    if (!isBatchStarted) c.complete();
    cleanup();
  }
  
  if (isBatchStarted) dwr.engine.endBatch(batchOpt);

  dwr.engine.setWarningHandler(oldWarningHandler);
  dwr.engine.setErrorHandler(oldErrorHandler);
  dwr.engine.transport.send = oldSend;
}

/**
 *
 */
window.testErrorLevels = function() {
  // Check handle by global error handler
  handlerTest({
    call_exception: ["callback"],
    expected: ["global.errorHandler"]
  });

  // Check handle by call exceptionHandler
  handlerTest({
    call_exception: ["callback", "exceptionHandler", "warningHandler"],
    expected: ["call.exceptionHandler"]
  });

  // Check handle by call exceptionHandler when errorHandler also defined
  handlerTest({
    call_exception: ["callback", "exceptionHandler", "errorHandler", "warningHandler"],
    expected: ["call.exceptionHandler"]
  });

  // Check handle by call errorHandler
  handlerTest({
    call_exception: ["callback", "errorHandler", "warningHandler"],
    expected: ["call.errorHandler"]
  });
};

/**
 * 
 */
window.testErrorLevelsWithBatch = function() {
  //
  // Call: no handler, Batch: no handler
  //
  handlerTest({
  	call1: ["callback"],
  	call2_exception: ["callback"],
  	batch: [],
  	expected: ["call1.callback", "global.errorHandler"]
  });
  handlerTest({
  	call1: ["callback"],
  	call2: ["callback"],
  	batch_error: [],
  	expected: ["global.errorHandler"]
  });  

  //
  // Call: no handler, Batch: errorHandler
  //
  handlerTest({
  	call1: ["callback"],
  	call2_exception: ["callback"],
  	batch: ["errorHandler"],
  	expected: ["call1.callback", "batch.errorHandler"]
  });
  handlerTest({
  	call1_exception: ["callback"],
  	call2_exception: ["callback"],
  	batch: ["errorHandler"],
  	expected: ["batch.errorHandler", "batch.errorHandler"]
  });
  handlerTest({
  	call1: ["callback"],
  	call2: ["callback"],
  	batch_error: ["errorHandler"],
  	expected: ["batch.errorHandler"]
  });  

  //
  // Call: exceptionHandler, Batch: no handler
  //
  handlerTest({
  	call1: ["callback"],
  	call2_exception: ["callback", "exceptionHandler"],
  	batch: [],
  	expected: ["call1.callback", "call2.exceptionHandler"]
  });
  handlerTest({
  	call1: ["callback", "exceptionHandler"],
  	call2_exception: ["callback", "exceptionHandler"],
  	batch: [],
  	expected: ["call1.callback", "call2.exceptionHandler"]
  });
  handlerTest({
  	call1_exception: ["callback", "exceptionHandler"],
  	call2: ["callback", "exceptionHandler"],
  	batch: [],
  	expected: ["call1.exceptionHandler", "call2.callback"]
  });
  handlerTest({
  	call1: ["callback", "exceptionHandler"],
  	call2: ["callback"],
  	batch_error: [],
  	expected: ["global.errorHandler"]
  });

  //
  // Call: errorHandler, Batch: no handler
  //
  handlerTest({
  	call1: ["callback"],
  	call2_exception: ["callback", "errorHandler"],
  	batch: [],
  	expected: ["call1.callback", "call2.errorHandler"]
  });
  handlerTest({
  	call1: ["callback", "errorHandler"],
  	call2_exception: ["callback", "errorHandler"],
  	batch: [],
  	expected: ["call1.callback", "call2.errorHandler"]
  });
  handlerTest({
  	call1_exception: ["callback", "errorHandler"],
  	call2: ["callback", "errorHandler"],
  	batch: [],
  	expected: ["call1.errorHandler", "call2.callback"]
  });
  handlerTest({
  	call1: ["callback", "errorHandler"],
  	call2: ["callback"],
  	batch_error: [],
  	expected: ["call1.errorHandler", "global.errorHandler"]
  });
  handlerTest({
  	call1: ["callback", "errorHandler"],
  	call2: ["callback", "errorHandler"],
  	batch_error: [],
  	expected: ["call1.errorHandler", "call2.errorHandler"]
  });  

  //
  // Call: exceptionHandler and errorHandler, Batch: no handler
  //
  handlerTest({
  	call1: ["callback"],
  	call2_exception: ["callback", "exceptionHandler", "errorHandler"],
  	batch: [],
  	expected: ["call1.callback", "call2.exceptionHandler"]
  });
  handlerTest({
  	call1: ["callback", "exceptionHandler", "errorHandler"],
  	call2_exception: ["callback", "exceptionHandler", "errorHandler"],
  	batch: [],
  	expected: ["call1.callback", "call2.exceptionHandler"]
  });
  handlerTest({
  	call1_exception: ["callback", "exceptionHandler", "errorHandler"],
  	call2: ["callback", "exceptionHandler", "errorHandler"],
  	batch: [],
  	expected: ["call1.exceptionHandler", "call2.callback"]
  });
  handlerTest({
  	call1: ["callback", "exceptionHandler", "errorHandler"],
  	call2: ["callback", "exceptionHandler"],
  	batch_error: [],
  	expected: ["call1.errorHandler", "global.errorHandler"]
  });

  //
  // Call: exceptionHandler, Batch: errorHandler
  //
  handlerTest({
  	call1: ["callback"],
  	call2_exception: ["callback", "exceptionHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.callback", "call2.exceptionHandler"]
  });
  handlerTest({
  	call1: ["callback", "exceptionHandler"],
  	call2_exception: ["callback", "exceptionHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.callback", "call2.exceptionHandler"]
  });
  handlerTest({
  	call1_exception: ["callback", "exceptionHandler"],
  	call2: ["callback", "exceptionHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.exceptionHandler", "call2.callback"]
  });
  handlerTest({
  	call1: ["callback", "exceptionHandler"],
  	call2: ["callback", "exceptionHandler"],
  	batch_error: ["errorHandler"],
  	expected: ["batch.errorHandler"]
  });

  //
  // Call: errorHandler, Batch: errorHandler
  //
  handlerTest({
  	call1: ["callback"],
  	call2_exception: ["callback", "errorHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.callback", "call2.errorHandler"]
  });
  handlerTest({
  	call1: ["callback", "errorHandler"],
  	call2_exception: ["callback", "errorHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.callback", "call2.errorHandler"]
  });
  handlerTest({
  	call1_exception: ["callback", "errorHandler"],
  	call2: ["callback", "errorHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.errorHandler", "call2.callback"]
  });
  handlerTest({
  	call1: ["callback", "errorHandler"],
  	call2: ["callback"],
  	batch_error: ["errorHandler"],
  	expected: ["call1.errorHandler", "batch.errorHandler"]
  });  
  handlerTest({
  	call1: ["callback", "errorHandler"],
  	call2: ["callback", "errorHandler"],
  	batch_error: ["errorHandler"],
  	expected: ["call1.errorHandler", "call2.errorHandler", "batch.errorHandler"]
  });  

  //
  // Call: exceptionHandler and errorHandler, Batch: errorHandler
  //
  handlerTest({
  	call1: ["callback"],
  	call2_exception: ["callback", "exceptionHandler", "errorHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.callback", "call2.exceptionHandler"]
  });
  handlerTest({
  	call1: ["callback", "exceptionHandler", "errorHandler"],
  	call2_exception: ["callback", "exceptionHandler", "errorHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.callback", "call2.exceptionHandler"]
  });
  handlerTest({
  	call1_exception: ["callback", "exceptionHandler", "errorHandler"],
  	call2: ["callback", "exceptionHandler", "errorHandler"],
  	batch: ["errorHandler"],
  	expected: ["call1.exceptionHandler", "call2.callback"]
  });
  handlerTest({
  	call1: ["callback", "exceptionHandler", "errorHandler"],
  	call2: ["callback", "exceptionHandler", "errorHandler"],
  	batch_error: ["errorHandler"],
  	expected: ["call1.errorHandler", "call2.errorHandler", "batch.errorHandler"]
  });
  
  // Exception thrown in handler

};

/**
 *
 */
window.testErrorInHandler = function() {
	
}

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
