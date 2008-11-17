
createTestGroup("Binary");

/**
 *
 */
window.testBinarySimple = function() {
  Test.binary("Hello", createOptions(function(retval) {
    useHtml('<iframe id="byIdTestBinarySimple" src="' + retval + '"></iframe>');
    var iframe = dwr.util.byId("byIdTestBinarySimple");
    iframe.onload = createDelayed(function() {
      verifyEqual(iframe.contentDocument.body.innerHTML, "<p>Hello</p>");
    });
  }));
};
