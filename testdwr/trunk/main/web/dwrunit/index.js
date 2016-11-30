
var tests = {};
var groups = {};
var groupNames = [];
createTestGroup("no_group");

var stati = { notrun:0, executing:1, pass:2, fail:3 };
var statusBackgrounds = [ "#EEE", "#FFA", "#8F8", "#F00" ];
var statusColors = [ "#000", "#000", "#000", "#FFF" ];
var statusNames = [ "Skipped", "Executing", "Pass", "Fail" ];

//
// API USED BY TEST PAGE
//

/**
 * Initialize on page load
 */
function init() {
  // Add functions beginning with "test" as test cases
  for (var prop in window) {
    if (prop.match(/^test/) && typeof window[prop] == "function") {
      addTest(prop, window[prop]);
    }
  }
  // Initialize test case table 
  displayTestTable();
  updateTestResults();
  
  if (window.location.href.match(/autoRun=true/)) {
    runAllTests();
  }
}

/**
 * Add test case to test database
 */
function addTest(testName, func) {
  var groupName = "no_group"; // default
  for (var i = 0; i < groupNames.length; i++) {
    if (testName.indexOf("test" + groupNames[i]) == 0) {
      groupName = groupNames[i];
    }
  }

  if (!groups[groupName]) {
  	groups[groupName] = [];
  }

  groups[groupName].push(testName);
  tests[testName] = {
    func: func,
    name: testName,
    status: stati.notrun,
    group: groupName,
    messages: []
  };
  dwrunit.addTest(testName, func);
}

/**
 * Add test group
 */
function createTestGroup(groupName) {
  groupNames.push(groupName);
  groups[groupName] = [];
}

/**
 * Create html result table with headings and all tests
 */
function displayTestTable() {
  var html = "";
  html += '<div id="settingsPanel">';
  html += '  <strong>Settings:</strong>';
  html += '</div>';
  html += '<table class="grey form">';
  html += '  <thead><tr><th>#</th><th>Group</th><th>Results</th><th>Actions</th><th>Scratch</th></tr></thead>';
  html += '  <tbody id="testSummary"> </tbody>';
  html += '</table>';
  html += '<div id="output"> </div>';
  dwr.util.setValue('dwrUnit', html, { escapeHtml:false });

  var testNum = 0;
  for (var i = 0; i < groupNames.length; i++) {
    var groupName = groupNames[i];
    var testNames = groups[groupName];
    if (testNames.length == 0) continue;
    testNames.sort();

    dwr.util.addRows("testSummary", [ groupName ], [
      function(groupName) {
        return '<a class="headInline" href="#" id="groupDisplay' + groupName + '" onclick="_toggleGroup(\'' + groupName + '\'); return false;">Show</a>';
      },
      function(groupName) {
        return "<strong>" + groupName + "</strong>";
      },
      function(groupName) { return ""; },
      function(groupName) { return '<input type="button" value="Run Group" onclick="runTestGroup(\'' + groupName + '\')"/>'; },
      function(groupName) { return "<div id='scratch" + groupName + "'></div>"; }
    ], {
      escapeHtml:false,
      cellCreator:function(options) {
        if (options.cellNum == 0) {
          return document.createElement("th");
        }
        var td = document.createElement("td");
        if (options.cellNum == 2) td.setAttribute("id", "groupCount" + options.rowData);
        return td;
      }
    });

    dwr.util.addRows("testSummary", testNames, [
      function(testName) { return "" + (++testNum); },
      function(testName) {
        var name;
        if (groupName == "no_group") {
          name = _addSpaces(testName.substring(4));
        }
        else {
          name = _addSpaces(testName.substring(4 + groupName.length));
        }
        // We did add  title='" + dwr.util.escapeHtml(tests[testName].func.toString()) + "'
        // But this confuses things because we're not currently escaping for attributes properly
        // The best solution is a better drilldown thing anyway because the wrapping is wrong here
        return '<a href="#" id="testDisplay' + groupName + '" onclick="_toggleTest(\'' + testName + '\'); return false;">' + name + '</a>' +
            '<pre style="display:none;" class="codeBlock" id="testDetail' + testName + '">' + dwr.util.escapeHtml(tests[testName].func.toString()) + '</pre>';
      },
      function(testName) { return ""; },
      function(testName) {
        return "<input type='button' value='Run Test' onclick='runTest(\"" + testName + "\");'/>";
      },
      function(testName) { return "<div id='scratch" + testName + "'></div>"; }
    ], {
      escapeHtml:false,
      cellCreator:function(options) {
        if (options.cellNum == 0) {
          return document.createElement("th");
        }
        var td = document.createElement("td");
        if (options.cellNum == 2) td.setAttribute("id", options.rowData);
        return td;
      },
      rowCreator:function(options) {
        var tr = document.createElement("tr");
        tr.className = "groupDetail" + groupName;
        return tr;
      }
    });
    _toggleGroup(groupName);
  }

  dwr.util.addRows("testSummary", [ 1 ], [
    function() { return ""; },
    function() { return "<strong>Total:<span id='totalCount'></span></strong>"; },
    function() { return ""; },
    function() { return '<input type="button" value="Run All" onclick="runAllTests();"/>'; },
    function() { return "<div id='scratchAll'></div>"; }
  ], {
    escapeHtml:false,
    cellCreator:function(options) {
      var td = document.createElement("th");
      if (options.cellNum == 2) td.setAttribute("id", "testCount");
      return td;
    }
  });

  var test;
  for (var testName in tests) {
    test = tests[testName];
    test.scratch = dwr.util.byId("scratch" + testName);
  }
}

/**
 * Show/hide test group test cases
 */
function _toggleGroup(groupName) {
  var toToggle = _getElementsByClass("groupDetail" + groupName);
  if (toToggle.length == 0) {
    dwr.engine._debug("No tests in group: " + groupName);
    return;
  }
  if (toToggle[0].style.display == "none") {
    for (var i = 0; i < toToggle.length; i++) {
      toToggle[i].style.display = "";
    }
    dwr.util.setValue("groupDisplay" + groupName, "Hide");
  }
  else {
    for (var i = 0; i < toToggle.length; i++) {
      toToggle[i].style.display = "none";
    }
    dwr.util.setValue("groupDisplay" + groupName, "Show");
  }
}

/**
 * Show/hide test function details
 */
function _toggleTest(testName) {
  var toToggle = dwr.util.byId("testDetail" + testName);
  if (toToggle.style.display == "none") {
    toToggle.style.display = "block";
  }
  else {
    toToggle.style.display = "none";
  }
}

/**
 * Update html table from test case database and possibly send report to server
 */
function updateTestResults(reportAnyway) {
  var counts = [ 0, 0, 0, 0 ];
  var groupCounts = {};
  for(var name in groups) {
    groupCounts[name] = [ 0, 0, 0, 0 ];
  }

  var testCount = 0;
  for (var testName in tests) {
    var test = tests[testName];
    counts[test.status]++;
    groupCounts[test.group][test.status]++
    testCount++;
  }

  for (var i = 0; i < groupNames.length; i++) {
    var groupName = groupNames[i];
    var groupCount = groups[groupName].length;
    var groupStatus = groupCounts[groupName];

    var outstanding = groupStatus[stati.executing];
    var failed = groupStatus[stati.fail];
    var passed = groupStatus[stati.pass];
    var started = groupCount - groupStatus[stati.notrun];

	if (dwr.util.byId("groupCount" + groupName) == null) continue;
	
    dwr.util.setValue("groupCount" + groupName, "Pass:" + passed + " Fail:" + failed);

    dwr.util.byId("groupCount" + groupName).style.backgroundColor = "";
    dwr.util.byId("groupCount" + groupName).style.color = "";

    if (failed > 0) {
      dwr.util.byId("groupCount" + groupName).style.backgroundColor = statusBackgrounds[stati.fail];
      dwr.util.byId("groupCount" + groupName).style.color = statusColors[stati.fail];
    }
    if (outstanding > 0 && failed > 0) {
      dwr.util.byId("groupCount" + groupName).style.backgroundColor = statusBackgrounds[stati.executing];
      dwr.util.byId("groupCount" + groupName).style.color = statusColors[stati.executing];
    }
    if (passed == groupCount) {
      dwr.util.byId("groupCount" + groupName).style.backgroundColor = statusBackgrounds[stati.pass];
      dwr.util.byId("groupCount" + groupName).style.color = statusColors[stati.pass];
    }
  }

  var outstanding = counts[stati.executing];
  var failed = counts[stati.fail];
  var passed = counts[stati.pass];
  var started = testCount - counts[stati.notrun];

  dwr.util.setValue("totalCount", testCount);
  dwr.util.setValue("testCount", "Pass:" + passed + " Fail:" + failed);

  if (failed > 0) {
    dwr.util.byId("testCount").style.backgroundColor = statusBackgrounds[stati.fail];
    dwr.util.byId("testCount").style.color = statusColors[stati.fail];
  }
  if (outstanding > 0 && failed > 0) {
    dwr.util.byId("testCount").style.backgroundColor = statusBackgrounds[stati.executing];
    dwr.util.byId("testCount").style.color = statusColors[stati.executing];
  }
  if (passed == testCount) {
    dwr.util.byId("testCount").style.backgroundColor = statusBackgrounds[stati.pass];
    dwr.util.byId("testCount").style.color = statusColors[stati.pass];
  }
}

function runTests(testNames) {
  dwrunit.runTests(
    testNames,
    {
      startCallback: function(ts) {
        var testinfo = tests[ts.getName()];
        _setStatus(testinfo, stati.executing);
        testinfo.messages = [];
        dwr.util.setValue(testinfo.name, "");
      },
      statusCallback: function(ts) {
        var testinfo = tests[ts.getName()];
        var result;
        if (ts.isPassed()) result = stati.pass;
        if (ts.isFailed()) result = stati.fail;
        _setStatus(testinfo, result);
        if (ts.isFailed()) {
          testinfo.messages = ts.getMessages();
          var output = testinfo.messages.join("<br />");
          dwr.util.setValue(testinfo.name, output, { escapeHtml:false });
          logConsole("FAILED: " + ts.getName());
          for(var i=0; i<ts.getErrors().length; i++) {
            logConsole(ts.getErrors()[i]);
          }
          logConsole(" ");
        }
        updateTestResults(false);
      },
      completeCallback: function() {
    	// Use this for something?
      },
      concurrency: (typeof dwrunitConcurrency != "undefined" ? dwrunitConcurrency : 3),
      pause: (typeof dwrunitPause != "undefined" ? dwrunitPause : 0),
      timeout: 20000
    }
  );
}

function logConsole(p) {
  var handled = false;
  if (typeof p == "string") {
    var message = p;
    if (typeof console != "undefined" && console && console.log) {
      console.log(message);
      handled = true;
    }
  } else if (p instanceof Error) {
    var ex = p;
    if (typeof console != "undefined" && console && console.exception) {
      console.exception(ex);
      handled = true;
    } else if (typeof console != "undefined" && console && console.log) {
      var message = ex.name + ": " + ex.message;
      if (ex.stack) {
        message += "\n" + ex.stack;
      }
      console.log(message);
      handled = true;
    }
  }
  return handled;
}

/**
 * Run one test and update result table after
 */
function runTest(testName) {
  runTests([testName]);	
}

/**
 * Run tests in a test group
 */
function runTestGroup(groupName) {
  var testNames = groups[groupName];
  if (testNames == null) {
    throw new Error("No test group called: " + groupName);
  }
  runTests(testNames);
}

/**
 * Run all tests
 */
function runAllTests() {
  runTests(dwrunit.getTestNames());
}

//
// API FOR TEST CASES
//

function waitAsync(varargs) {
  return dwrunit.waitAsync.apply(dwrunit, arguments);
}

function waitAsyncAndFail(varargs) {
  var args = [];
  var message;
  for(var i=0; i<arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg == "string") {
      message = arg;
    } else if (typeof arg != "function") {
      args.push(arg);
    }
  }
  args.push(function(){fail(message);});
  return dwrunit.waitAsync.apply(dwrunit, args);
}

function waitDwrHandlerOptions(options) {
  var modopt = {};
  for(var p in options) modopt[p] = options[p];
  var c = new dwrunit.SingleAsyncCompletor;
  modopt.callback = waitAsync(c, function() {
    if (options.callback) options.callback.apply(this, arguments);
  });
  modopt.exceptionHandler = waitAsync(c, function() {
    if (options.exceptionHandler) options.exceptionHandler.apply(this, arguments);
  });
  modopt.errorHandler = waitAsync(c, function() {
    if (options.errorHandler) options.errorHandler.apply(this, arguments);
  });
  return modopt;
}

function waitDwrCallbackOptions(handlerOrOptions) {
  var modopt = {};
  var handler;
  if (typeof handlerOrOptions == "function") {
  	handler = handlerOrOptions;
  } else if (handlerOrOptions && typeof handlerOrOptions == "object") {
    for(var p in handlerOrOptions) modopt[p] = handlerOrOptions[p];
  	handler = handlerOrOptions.callback;
  }
  modopt.callback = function() { if (handler) handler.apply(this, arguments); };
  modopt.exceptionHandler = _wrongHandlerCalled;
  modopt.errorHandler = _wrongHandlerCalled;
  return waitDwrHandlerOptions(modopt);
}

function waitDwrExceptionHandlerOptions(handlerOrOptions) {
  var modopt = {};
  var handler;
  if (typeof handlerOrOptions == "function") {
  	handler = handlerOrOptions;
  } else if (handlerOrOptions && typeof handlerOrOptions == "object") {
    for(var p in handlerOrOptions) modopt[p] = handlerOrOptions[p];
  	handler = handlerOrOptions.exceptionHandler;
  }
  modopt.callback = _wrongHandlerCalled;
  modopt.exceptionHandler = function() { if (handler) handler.apply(this, arguments); };
  modopt.errorHandler = _wrongHandlerCalled;
  return waitDwrHandlerOptions(modopt);
}

function waitDwrErrorHandlerOptions(handlerOrOptions) {
  var modopt = {};
  var handler;
  if (typeof handlerOrOptions == "function") {
  	handler = handlerOrOptions;
  } else if (handlerOrOptions && typeof handlerOrOptions == "object") {
    for(var p in handlerOrOptions) modopt[p] = handlerOrOptions[p];
  	handler = handlerOrOptions.errorHandler;
  }
  modopt.callback = _wrongHandlerCalled;
  modopt.exceptionHandler = _wrongHandlerCalled;
  modopt.errorHandler = function() { if (handler) handler.apply(this, arguments); };
  return waitDwrHandlerOptions(modopt);
}

function _wrongHandlerCalled() {
  dwrunit.fail(_buildMessage("Wrong DWR call handler triggered ", arguments));
}

function waitDwrVerifyCallbackOptions() {
  return waitDwrCallbackOptions(function(data) {
  	// Add errors from server-side
  	var errors = data.report;
  	for(var i=0; i<errors.length; i++) {
  	  dwrunit.fail(errors[i]);
  	}
  });
}

/**
 *
 */
function useHtml(html) {
  var testinfo = tests[dwrunit.getRunningTest().getName()];
  dwr.util.setValue(testinfo.scratch, html, { escapeHtml:false });
}

/**
 *
 */
function fail(message) {
  dwrunit.fail(message);
}

/**
 *
 */
function assertTrue(value) {
  _assert("assertTrue", value, arguments);
}

/**
 *
 */
function verifyTrue(value) {
  _verify("verifyTrue", value, arguments);
}

/**
 *
 */
function assertFalse(value) {
  _assert("assertFalse", !value, arguments);
}

/**
 *
 */
function verifyFalse(value) {
  _verify("verifyFalse", !value, arguments);
}

/**
 *
 */
function assertNull(value) {
  _assert("assertNull", value === null, arguments);
}

/**
 *
 */
function verifyNull(value) {
  _verify("verifyNull", value === null, arguments);
}

/**
 *
 */
function assertNotNull(value) {
  _assert("assertNotNull", value !== null, arguments);
}

/**
 *
 */
function verifyNotNull(value) {
  _verify("verifyNotNull", value !== null, arguments);
}

/**
 *
 */
function assertUndefined(value) {
  _assert("assertUndefined", value === undefined, arguments);
}

/**
 *
 */
function verifyUndefined(value) {
  _verify("verifyUndefined", value === undefined, arguments);
}

/**
 *
 */
function assertNotUndefined(value) {
  _assert("assertNotUndefined", value !== undefined, arguments);
}

/**
 *
 */
function verifyNotUndefined(value) {
  _verify("verifyNotUndefined", value !== undefined, arguments);
}

/**
 *
 */
function assertUndefined(value) {
  _assert("assertUndefined", value === undefined, arguments);
}

/**
 *
 */
function verifyUndefined(value) {
  _verify("verifyUndefined", value === undefined, arguments);
}

/**
 *
 */
function assertNotUndefined(value) {
  _assert("assertNotUndefined", value !== undefined, arguments);
}

/**
 *
 */
function verifyNotUndefined(value) {
  _verify("verifyNotUndefined", value !== undefined, arguments);
}

/**
 *
 */
function assertNaN(value) {
  _assert("assertNaN", isNaN(value), arguments);
}

/**
 *
 */
function verifyNaN(value) {
  _verify("verifyNaN", isNaN(value), arguments);
}

/**
 *
 */
function assertNotNaN(value) {
  _assert("assertNotNaN", !isNaN(value), arguments);
}

/**
 *
 */
function verifyNotNaN(value) {
  _verify("verifyNotNaN", !isNaN(value), arguments);
}

/**
 *
 */
function assertEqual(expected, actual) {
  _assert("assertEqual", _isEqual(expected, actual), arguments);
}

/**
 *
 */
function verifyEqual(expected, actual) {
  _verify("verifyEqual", _isEqual(expected, actual), arguments);
}

/**
 *
 */
function assertNotEqual(expected, actual) {
  _assert("assertNotEqual", !_isEqual(expected, actual), arguments);
}

/**
 *
 */
function verifyNotEqual(expected, actual) {
  _verify("verifyNotEqual", !_isEqual(expected, actual), arguments)
}

/**
 *
 */
function _verify(name, status, args) {
  if (!status) {
    dwrunit.verify(status, _buildMessage(name, args));
  }
}

/**
 *
 */
function _assert(name, status, args) {
  if (!status) {
    dwrunit.assert(status, _buildMessage(name, args));
  }
}

/**
 *
 */
function _buildMessage(name, args) {
  var msg = name + "(";
  for(var i=0; i<args.length; i++) {
    if (i != 0) msg += ", ";
    msg += dwr.util.toDescriptiveString(args[i], 3);
  }
  msg += ")";
  return msg;
}

/**
 *
 */
function _setStatus(test, newStatus) {
  if (typeof test == "string") {
    test = tests[test];
  }
  test.status = newStatus;
  dwr.util.byId(test.name).style.backgroundColor = statusBackgrounds[newStatus];
  dwr.util.byId(test.name).style.color = statusColors[newStatus];
}

/**
 *
 */
function _getStatus(test) {
  if (typeof test == "string") {
    test = tests[test];
  }
  return test.status;  
}

/**
 *
 */
function _isEqual(expected, actual, depth) {
  if (!depth) depth = 0;
  // Rather than failing we assume that it works!
  if (depth > 10) return true;

  if (expected == null) {
    if (actual != null) {
      dwr.engine._debug("expected: null, actual non-null: " + dwr.util.toDescriptiveString(actual));
      return false;
    }
    return true;
  }

  if (typeof(expected) == "number" && isNaN(expected)) {
    if (!(typeof(actual) == "number" && isNaN(actual))) {
      dwr.engine._debug("expected: NaN, actual non-NaN: " + dwr.util.toDescriptiveString(actual))
      return false;
    }
    return true;
  }

  if (actual == null) {
    if (expected != null) {
      dwr.engine._debug("actual: null, expected non-null: " + dwr.util.toDescriptiveString(expected));
      return false;
    }
    return true; // we wont get here of course ...
  }

  if (typeof expected == "object") {
    if (!(typeof actual == "object")) {
      dwr.engine._debug("expected object, actual not an object");
      return false;
    }

    var actualLength = 0;
    for (var prop in actual) {
      if (typeof actual[prop] != "function" || typeof expected[prop] != "function") {
        var nest = _isEqual(actual[prop], expected[prop], depth + 1);
        if (typeof nest != "boolean" || !nest) {
          dwr.engine._debug("element '" + prop + "' does not match: " + nest);
          return false;
        }
      }
      actualLength++;
    }

    // need to check length too
    var expectedLength = 0;
    for (prop in expected) expectedLength++;
    if (actualLength != expectedLength) {
      dwr.engine._debug("expected object size = " + expectedLength + ", actual object size = " + actualLength);
      return false;
    }
    return true;
  }

  if (actual != expected) {
    dwr.engine._debug("expected = " + expected + " (type=" + typeof expected + "), actual = " + actual + " (type=" + typeof actual + ")");
    return false;
  }

  if (expected instanceof Array) {
    if (!(actual instanceof Array)) {
      dwr.engine._debug("expected array, actual not an array");
      return false;
    }
    if (actual.length != expected.length) {
      dwr.engine._debug("expected array length = " + expected.length + ", actual array length = " + actual.length);
      return false;
    }
    for (var i = 0; i < actual.length; i++) {
      var inner = _isEqual(actual[i], expected[i], depth + 1);
      if (typeof inner != "boolean" || !inner) {
        dwr.engine._debug("element " + i + " does not match: " + inner);
        return false;
      }
    }

    return true;
  }

  return true;
}

/**
 *
 */
function _addSpaces(funcName) {
  funcName = funcName.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  funcName = funcName.replace(/([a-zA-Z])([0-9])/g, "$1 $2");
  return funcName;
}

function _addEvent(obj, event, func) {
  if (obj.addEventListener) obj.addEventListener(event, func, false);
  else if (obj.attachEvent) obj.attachEvent('on' + event, func);
}

function _removeEvent(obj, event, func) {
  if (obj.removeEventListener) obj.removeEventListener(event, func, false);
  else if (obj.detachEvent) obj.detachEvent('on' + event, func);
}

function _getElementsByClass(searchClass, node, tag) {
    var reply = [];
    node = node || document;
    tag = tag || "*";
    var sameTag = node.getElementsByTagName(tag);
    var pattern = new RegExp("(^|\\\\s)"+searchClass+"(\\\\s|$)");
    for (var i = 0; i < sameTag.length; i++) {
        if (pattern.test(sameTag[i].className)) {
            reply[reply.length] = sameTag[i];
        }
    }
    return reply;
}

//*
_addEvent(window, 'load', function() {
  init();
});
// */
