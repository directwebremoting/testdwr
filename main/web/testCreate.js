createTestGroup("Create");

window.testCreateStaticWithGetInstanceMethod = function() {
  // We need to hack to call disallowed methods
  verifyUndefined(SingletonGetInstance.disallowed);
  dwr.engine._execute(SingletonGetInstance._path, 'SingletonGetInstance', 'disallowed', [
    waitDwrExceptionHandlerOptions(
      function(message, ex) {
        verifyEqual(message, ex.message);
        // What's thrown is a org.directwebremoting.ConversionException, but that
        // isn't mapped so the type we see is just the basic java.lang.Throwable
        verifyEqual(ex.javaClassName, "java.lang.Throwable");
      }
    )
  ]);
  SingletonGetInstance.allowed(waitDwrCallbackOptions(function (data) {
    verifyEqual(data, "SUCCESS");
  }));
};

window.testCreateStaticWithCustomInstanceMethod = function() {
  // We need to hack to call disallowed methods
  verifyUndefined(SingletonCustomMethodName.disallowed);
  dwr.engine._execute(SingletonCustomMethodName._path, 'SingletonCustomMethodName', 'disallowed', [ 
    waitDwrExceptionHandlerOptions(
      function(message, ex) {
        verifyEqual(message, ex.message);
        // What's thrown is a org.directwebremoting.ConversionException, but that
        // isn't mapped so the type we see is just the basic java.lang.Throwable
        verifyEqual(ex.javaClassName, "java.lang.Throwable");
      }
    )
  ]);
  SingletonCustomMethodName.allowed(waitDwrCallbackOptions(function (data) {
    verifyEqual(data, "SUCCESS");
  }));
};

window.testCreateScriptedSingleton = function() {
	TestScriptedSingleton.method1(waitDwrCallbackOptions(function (data) {
	    verifyEqual(data, "SUCCESS");
    }));
};