
createTestGroup("Security");

window.testSecurityDisallowNonIncludedMethods = function() {
  CreatorMethodInclusions.included(waitDwrCallbackOptions(function (data) {
    verifyTrue(data);
  }));
  CreatorMethodInclusions.included2(waitDwrCallbackOptions(function (data) {
    verifyTrue(data);
  }));  
  CreatorMethodInclusions.notIncluded(waitDwrExceptionHandlerOptions(function(message, ex) {
    verifyEqual(message, ex.message);
    // What's thrown is a org.directwebremoting.ConversionException, but that
    // isn't mapped so the type we see is just the basic java.lang.Throwable
    verifyEqual(ex.javaClassName, "java.lang.Throwable");
  }));
};

window.testSecurityDisallowExcludedMethods = function() {
  CreatorMethodExclusions.notExcluded(waitDwrCallbackOptions(function (data) {
    verifyTrue(data);
  }));  
  
  CreatorMethodExclusions.excluded(waitDwrExceptionHandlerOptions(function(message, ex) {
    verifyEqual(message, ex.message);
    // What's thrown is a org.directwebremoting.ConversionException, but that
    // isn't mapped so the type we see is just the basic java.lang.Throwable
    verifyEqual(ex.javaClassName, "java.lang.Throwable");
  }));
    
  CreatorMethodExclusions.excluded2(waitDwrExceptionHandlerOptions(function(message, ex) {
    verifyEqual(message, ex.message);
    // What's thrown is a org.directwebremoting.ConversionException, but that
    // isn't mapped so the type we see is just the basic java.lang.Throwable
    verifyEqual(ex.javaClassName, "java.lang.Throwable");
  }));
};

window.testSecurityPrivateProtectedMethodAccess = function() {
  CreatorMethodAccess.publicAccess(waitDwrCallbackOptions(function (data) {
    verifyTrue(data);
  }));    
  verifyUndefined(CreatorMethodAccess.packageProtectedAccess);
  verifyUndefined(CreatorMethodAccess.privateAccess);
  verifyUndefined(CreatorMethodAccess.protectedAccess);  
};
