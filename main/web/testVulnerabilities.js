
createTestGroup("Vulnerabilities");

window.testVulnerabilitiesXssScriptTag = function() {
    var c = new dwrunit.SingleAsyncCompletor;
    window.youHaveBeenHackedFunc = waitAsync(c, function() {
        dwrunit.fail("YOU'VE BEEN HACKED");
        delete window.youHaveBeenHackedFunc;
    });
    dwr.engine.beginBatch();
    dwr.engine._batch.fileUpload = true; // trigger iframe mode
    var hackstr = "</script><script>window.parent.youHaveBeenHackedFunc();</script>";
    Test.stringParam(hackstr, waitAsync(c, function(retval) {
      verifyEqual(retval, hackstr);
      delete window.youHaveBeenHackedFunc;
    }));
    dwr.engine.endBatch();
};

// See https://www.owasp.org/index.php/XML_External_Entity_%28XXE%29_Processing
window.testVulnerabilitiesXmlExternalEntity = function() {
    var c = new dwrunit.SingleAsyncCompletor;
    var convertFunction =  dwr.engine.serialize.convert;
    dwr.engine.serialize.convert = function(batch, directrefmap, otherrefmap, data, name, depth) {
         batch.map[name] = 'dom:<!DOCTYPE+root+[<!ENTITY+foo+SYSTEM+"/home/david/dev/test.txt">]><text>%26foo;</text>';
    }
    Test.testVulnerabilitiesXmlExternalEntity(null, waitDwrExceptionHandlerOptions(function(message, ex) {
      verifyEqual("Error", message);
      verifyNotNull(ex);
      verifyEqual(ex.message, message);
      verifyEqual("java.lang.Throwable", ex.javaClassName);
    }));
    dwr.engine.serialize.convert = convertFunction;
};

