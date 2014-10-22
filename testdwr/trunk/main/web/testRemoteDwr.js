
createTestGroup("RemoteDwr");

/**
 * 
 */
window.testRemoteDwrSetValue = function() {
  _remoteDwrSetValue("testRemoteDwrSetValue");
};
window.testRemoteDwrSetValueIframeMode = function() {
  dwr.engine.beginBatch();
  dwr.engine._batch.fileUpload = true;
  _remoteDwrSetValue("testRemoteDwrSetValueIframeMode");
  dwr.engine.endBatch();
};
window.testRemoteDwrSetValueScriptTagMode = function() {
  var origSend2 = dwr.engine.transport.send2;
  dwr.engine.transport.send2 = function(batch) {
  	dwr.engine.batch.prepareToSend(batch);
  	batch.transport = dwr.engine.transport.scriptTag;
  	return batch.transport.send(batch);
  };
  _remoteDwrSetValue("testRemoteDwrSetValueScriptTagMode");
  dwr.engine.transport.send2 = origSend2;
};
function _remoteDwrSetValue(id) {
  id = id + "InputField";
  useHtml('<input id="' + id + '" value="start"/>');
  Test.setValue(id, "changed", waitDwrCallbackOptions(function(data) {
    assertEqual("changed", data);
    var remoteDwrSetValue = dwr.util.getValue(id);
    assertEqual("changed", remoteDwrSetValue);
  }));
}

/**
 * 
 */
window.testRemoteDwrSetCookie = function() {
  var value = "someCookieValue\\!!\'\"&&amp";
  Test.setCookie("someCookieName", value, waitDwrCallbackOptions(function() {
    var result = document.cookie;
    verifyTrue(result.indexOf("someCookieName") > -1);
    verifyTrue(result.indexOf(value) > -1);
  }));
};
