
createTestGroup("RemoteDwr");

/**
 * 
 */
window.testRemoteDwrSetValue = function() {
  useHtml('<input id="remoteDwrSetValue" value="start"/>');
  
  Test.setValue("remoteDwrSetValue", "changed", waitDwrCallbackOptions(function(data) {
    assertEqual("changed", data);
    var remoteDwrSetValue = dwr.util.getValue("remoteDwrSetValue");
    assertEqual("changed", remoteDwrSetValue);
  }));
};

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
