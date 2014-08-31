
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
    dwr.engine.setAsync(false);
    var webXMLPath = Test.getWebXMLPath();
    verifyTrue(webXMLPath.length > 0);
    dwr.engine.setAsync(true);
    var convertFunction =  dwr.engine.serialize.convert;
    dwr.engine.serialize.convert = function(batch, directrefmap, otherrefmap, data, name, depth) {
      batch.map[name] =  'xml:<!DOCTYPE+root+[<!ENTITY+foo+SYSTEM+"' + webXMLPath + '">]><text>%26foo;</text>';
    }
    var c = new dwrunit.SingleAsyncCompletor;
    Test.testVulnerabilitiesXmlExternalEntity(null, waitAsync(c, function(data) {
      verifyTrue(data.lastIndexOf('<?xml version="1.0" encoding="ISO-8859-1"?>', 0) === -1);
    }));
    dwr.engine.serialize.convert = convertFunction;
};