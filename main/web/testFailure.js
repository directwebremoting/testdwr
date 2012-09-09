
/**
 * These are tests that deliberately to bad things to the server that it should
 * reject in a sensible way.
 * These are the only tests that give legitimate output on the server console.
 */
createTestGroup("Fail");

/**
 * 
 */
window.testFailEnforceTypesOnMappedArguments = function() {
  var obj = new pkg1.OnePackageObject();

  // Note that we are sending an argument with the wrong type to this method!
  // Either a TwoPackagesObject object or an untyped object should be marshalled and 
  // run for this method, but not a mapped object of the wrong class.
  Test.package2(obj, waitDwrExceptionHandlerOptions(function(message, ex) {
    verifyEqual(message, ex.message);
    // What's thrown is a org.directwebremoting.ConversionException, but that
    // isn't mapped so the type we see is just the basic java.lang.Throwable
    verifyEqual(ex.javaClassName, "java.lang.Throwable");
  }));
};
