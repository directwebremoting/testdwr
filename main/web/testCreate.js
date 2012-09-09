createTestGroup("Create");

window.testCreateStaticWithGetInstanceMethod = function() {
  SingletonGetInstance.disallowed(
    waitDwrExceptionHandlerOptions(
      function(message, ex) {
        verifyEqual(message, ex.message);
        // What's thrown is a org.directwebremoting.ConversionException, but that
        // isn't mapped so the type we see is just the basic java.lang.Throwable
        verifyEqual(ex.javaClassName, "java.lang.Throwable");
      }
    )
  );
  SingletonGetInstance.allowed(waitDwrCallbackOptions(function (data) {
    verifyEqual(data, "SUCCESS");
  }));
};

window.testCreateStaticWithCustomInstanceMethod = function() {
  SingletonCustomMethodName.disallowed(
    waitDwrExceptionHandlerOptions(
      function(message, ex) {
        verifyEqual(message, ex.message);
        // What's thrown is a org.directwebremoting.ConversionException, but that
        // isn't mapped so the type we see is just the basic java.lang.Throwable
        verifyEqual(ex.javaClassName, "java.lang.Throwable");
      }
    )
  );
  SingletonCustomMethodName.allowed(waitDwrCallbackOptions(function (data) {
    verifyEqual(data, "SUCCESS");
  }));
};

window.testCreateScriptedSingleton = function() {
	TestScriptedSingleton.method1(waitDwrCallbackOptions(function (data) {
	    verifyEqual(data, "SUCCESS");
    }));
};