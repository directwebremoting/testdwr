
createTestGroup("Vulnerabilities");

window.testVulnerabilitiesXssScriptTag = function() {
  var c = new dwrunit.SingleAsyncCompletor;
  window.youHaveBeenHackedFunc = waitAsync(c, function() {
    dwrunit.fail("YOU'VE BEEN HACKED");
    window.youHaveBeenHackedFunc = undefined; // can't delete in older IEs
  });
  dwr.engine.beginBatch();
  dwr.engine._batch.fileUpload = true; // trigger iframe mode
  var hackstr = "</script><script>window.parent.youHaveBeenHackedFunc();</script>";
  Test.stringParam(hackstr, waitAsync(c, function(retval) {
    verifyEqual(retval, hackstr);
    window.youHaveBeenHackedFunc = undefined; // can't delete in older IEs
  }));
  dwr.engine.endBatch();
};

// See https://www.owasp.org/index.php/XML_External_Entity_%28XXE%29_Processing
window.testVulnerabilitiesXmlExternalEntity = function() {
  // Prepare test
  var secretFilePath = Test.getSecretFilePath({async:false});
  verifyTrue(secretFilePath.length > 0);
  var convertFunction =  dwr.engine.serialize.convert;
  dwr.engine.serialize.convert = function(batch, directrefmap, otherrefmap, data, name, depth) {
    batch.map[name] =  'xml:<!DOCTYPE+root+[<!ENTITY+foo+SYSTEM+"' + secretFilePath + '">]><text>%26foo;</text>';
  }
  var dummy = null; // Supplied node is not used as we have overridden XML serialization above
  var convtype;
  function createDwrOptions(name) {
    return waitDwrHandlerOptions({
      callback: function(result) {
        // It's ok to get a result as long as it doesn't contain the secret file contents
        if (result.innerHTML.contains("secrets-in-private-file")) {
          dwrunit.fail(name + " WAS HACKED");
        }
      },
      exceptionHandler: function(ex) {
        // It's ok to get an exception
      }
    });
  };

  // Run test
  Test.domElementParam(dummy, createDwrOptions("W3C DOM"));
  Test.xomElementParam(dummy, createDwrOptions("XOM"));
  Test.jdomElementParam(dummy, createDwrOptions("JDOM"));
  Test.dom4jElementParam(dummy, createDwrOptions("DOM4J"));

  // Clean up test
  dwr.engine.serialize.convert = convertFunction;
};