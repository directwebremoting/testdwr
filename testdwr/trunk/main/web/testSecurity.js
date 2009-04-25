
createTestGroup("Security");

window.testSecurityDisallowNonIncludedMethods = function() {
  CreatorMethodInclusions.included(createOptions(function (data) {
    verifyTrue(data);
  }));
  CreatorMethodInclusions.included2(createOptions(function (data) {
    verifyTrue(data);
  }));  
  CreatorMethodInclusions.notIncluded({
    callback:function(data) {
      verifyNull(data);
    },
    exceptionHandler:createDelayed(function(message, ex) {
      verifyEqual(message, ex.message);
      // What's thrown is a org.directwebremoting.ConversionException, but that
      // isn't mapped so the type we see is just the basic java.lang.Throwable
      verifyEqual(ex.javaClassName, "java.lang.Throwable");
    })});
};

window.testSecurityDisallowExcludedMethods = function() {
  CreatorMethodExclusions.notExcluded(createOptions(function (data) {
    verifyTrue(data);
  }));  
  
  CreatorMethodExclusions.excluded({
    callback:function(data) {
      verifyNull(data);
    },
    exceptionHandler:createDelayed(function(message, ex) {
      verifyEqual(message, ex.message);
      // What's thrown is a org.directwebremoting.ConversionException, but that
      // isn't mapped so the type we see is just the basic java.lang.Throwable
      verifyEqual(ex.javaClassName, "java.lang.Throwable");
    })});
    
   CreatorMethodExclusions.excluded2({
      callback:function(data) {
        verifyNull(data);
      },
      exceptionHandler:createDelayed(function(message, ex) {
        verifyEqual(message, ex.message);
        // What's thrown is a org.directwebremoting.ConversionException, but that
        // isn't mapped so the type we see is just the basic java.lang.Throwable
        verifyEqual(ex.javaClassName, "java.lang.Throwable");
    })});
};

window.testSecurityPrivateProtectedMethodAccess = function() {
  CreatorMethodAccess.publicAccess(createOptions(function (data) {
    verifyTrue(data);
  }));    
  verifyUndefined(CreatorMethodAccess.packageProtectedAccess);
  verifyUndefined(CreatorMethodAccess.privateAccess);
  verifyUndefined(CreatorMethodAccess.protectedAccess);  
};
