
createTestGroup("Vulnerabilities");

window.testVulnerabilitiesXssScriptTag = function() {
    dwr.engine.beginBatch();
    dwr.engine._batch.fileUpload = true; // trigger iframe mode
    var hackstr = "</script><script>alert('HACKED!');</script>";
	Test.stringParam(hackstr, waitDwrCallbackOptions(function(retval) {
      verifyEqual(retval, hackstr);
	}));
    dwr.engine.endBatch();
};

// See https://www.owasp.org/index.php/XML_External_Entity_%28XXE%29_Processing
window.testVulnerabilitiesXmlExternalEntity = function() {

};

