
createTestGroup("Binary");

// For IE as it does not allow you to dynamically 
// add an onload handler, but you can reassign one. 
function binaryOnload() {};

window.testBinarySimple = function() {
  Test.binary("Hello", createOptions(function(retval) {
    useHtml('<iframe id="byIdTestBinarySimple" onload="binaryOnload();" src="' + retval + '"></iframe>');
    var iframe = dwr.util.byId("byIdTestBinarySimple");
    binaryOnload = createDelayed(function() {
      verifyEqual(iframe.contentDocument.body.innerHTML, "<p>Hello</p>");
    });	  
  }));
};
