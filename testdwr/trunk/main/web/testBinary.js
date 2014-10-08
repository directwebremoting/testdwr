
createTestGroup("Binary");

// For IE as it does not allow you to dynamically 
// add an onload handler, but you can reassign one. 
function binaryOnload() {};

window.testBinarySimple = function() {
  Test.binary("Hello", waitDwrCallbackOptions(function(downloadUrl) {
    useHtml('<iframe id="byIdTestBinarySimple" onload="binaryOnload();" src="' + downloadUrl + '"></iframe>');
    var iframe = dwr.util.byId("byIdTestBinarySimple");
    binaryOnload = waitAsync(function() {
      verifyTrue(iframe.contentDocument.body.innerHTML.indexOf("Hello") >= 0);
    });	  
  }));
};
