// http://www.helephant.com/Article.aspx?ID=675

var tests = {};
var groups = { 'Global':[] };
var groupNames = [ 'Global' ];
var boredTimeout = null;

var currentTest = null;

var status = { notrun:0, executing:1, asynchronous:2, pass:3, fail:4 };
var statusBackgrounds = [ "#EEE", "#888", "#FFA", "#8F8", "#F00" ];
var statusColors = [ "#000", "#FFF", "#000", "#000", "#FFF" ];
var statusNames = [ "Skipped", "Executing", "Waiting for results", "Pass", "Fail" ];

/**
 *
 */
function init() {
  for (var prop in window) {
    if (prop.match(/test/) && typeof window[prop] == "function" && prop != "testEquals") {
      addTest(prop, window[prop]);
    }
  }
  displayTestTable();
  updateTestResults();
  if (window.location.href.match(/autoRun=true/)) {
    runAllTests();
  }
  var delayMatch = window.location.href.match(/delay=(\d+)/);
  if (delayMatch != null && delayMatch.length >= 1) {
    var delay = delayMatch[1] - 0;
    dwr.util.setValue("delay", delay);
  }
  if (window.location.href.match(/autoSend=true/)) {
    dwr.util.setValue("autoSend", true);
  }
}

/**
 *
 */
function addTest(testName, func) {
  var groupName = "Global";
  for (var i = 0; i < groupNames.length; i++) {
    if (testName.indexOf("test" + groupNames[i]) == 0) {
      groupName = groupNames[i];
    }
  }

  groups[groupName].push(testName);
  tests[testName] = {
    func: func,
    name: testName,
    status: status.notrun,
    group: groupName,
    messages: []
  };
}

/**
 * 
 */
function createTestGroup(groupName) {
  groupNames.push(groupName);
  groups[groupName] = [];
}

/**
 *
 */
function displayTestTable() {
  for (var i = 0; i < groupNames.length; i++) {
    var groupName = groupNames[i];
    var testNames = groups[groupName];
    testNames.sort();

    dwr.util.cloneNode("groupTemplate", { idSuffix:groupName });

    dwr.util.setValue("groupTitle" + groupName, groupName);
    dwr.util.byId("groupDetail" + groupName).style.display = "none";

    dwr.util.addRows("groupTests" + groupName, testNames, [
      function num(testName, options) { return options.rowNum + 1; },
      function name(testName, options) {
        var name;
        if (groupName == "Global") {
          name = _addSpaces(testName.substring(4));
        }
        else {
          name = _addSpaces(testName.substring(4 + groupName.length));
        }
        return "<div class='hover' title='" + dwr.util.escapeHtml(tests[testName].func.toString()) + "'>" + name + "</div>";
      },
      function async(testName, options) {
        return "<span id='asyncReturn" + testName + "'>0</span>/<span id='asyncSent" + testName + "'>0</span>";
      },
      function action(testName, options) {
        return "<input type='button' value='Run' onclick='runTest(\"" + testName + "\");'/>";
      },
      function results(testName, options) { return ""; },
      function scratchSpace(testName, options) { return "<div id='scratch" + testName + "'></div>"; }
    ], {
      escapeHtml:false,
      cellCreator:function(options) {
        var td = document.createElement("td");
        if (options.cellNum == 4) {
          td.setAttribute("id", options.rowData);
        }
        return td;
      }
    });
  }

  dwr.util.addRows("testSummary", groupNames, [
    function name(groupName) {
      return groupName + '<span class="headInline"> [' +
        '<a href="#" id="groupDisplay' + groupName + '" onclick="_toggleDetail(\'' + groupName + '\');">Show</a>' +
        ']</span>';
    },
    function started(groupName) { return ""; },
    function outstanding(groupName) { return ""; },
    function failed(groupName) { return ""; },
    function passed(groupName) { return ""; },
    function count(groupName) { return ""; },
    function actions(groupName) { return '<input type="button" value="Run" onclick="runTestGroup(\'' + groupName + '\')"/>'; }
  ], {
    escapeHtml:false,
    cellCreator:function(options) {
      if (options.cellNum == 0) {
        return document.createElement("th");
      }
      var td = document.createElement("td");
      if (options.cellNum == 1) td.setAttribute("id", "groupStarted" + options.rowData);
      if (options.cellNum == 2) td.setAttribute("id", "groupOutstanding" + options.rowData);
      if (options.cellNum == 3) td.setAttribute("id", "groupFailed" + options.rowData);
      if (options.cellNum == 4) td.setAttribute("id", "groupPassed" + options.rowData);
      if (options.cellNum == 5) td.setAttribute("id", "groupCount" + options.rowData);
      return td;
    }
  });
  dwr.util.addRows("testSummary", [ 1 ], [
    function name() { return "All"; },
    function started() { return ""; },
    function outstanding() { return ""; },
    function failed() { return ""; },
    function passed() { return ""; },
    function count() { return ""; },
    function actions() { return '<input type="button" value="Run All" onclick="runAllTests();"/>'; }
  ], {
    escapeHtml:false,
    cellCreator:function(options) {
      if (options.cellNum == 0) {
        return document.createElement("th");
      }
      var td = document.createElement("td");
      if (options.cellNum == 1) td.setAttribute("id", "testsStarted");
      if (options.cellNum == 2) td.setAttribute("id", "testsOutstanding");
      if (options.cellNum == 3) td.setAttribute("id", "testsFailed");
      if (options.cellNum == 4) td.setAttribute("id", "testsPassed");
      if (options.cellNum == 5) td.setAttribute("id", "testCount");
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
 *
 */
function _toggleDetail(groupName) {
  var detail = dwr.util.byId("groupDetail" + groupName);
  if (detail.style.display == "none") {
    detail.style.display = "block";
    dwr.util.setValue("groupDisplay" + groupName, "Hide");
  }
  else {
     detail.style.display = "none";
     dwr.util.setValue("groupDisplay" + groupName, "Show");
  }
}

/**
 *
 */
function _toggleDisplay(id) {
  id = dwr.util.byId(id);
  if (id.style.display == "none") {
    id.style.display = "block";
  }
  else {
    id.style.display = "none";
  }
}

/**
 *
 */
function updateTestResults(reportAnyway) {
  var counts = [ 0, 0, 0, 0, 0 ];
  var groupCounts = {};
  for (var i = 0; i < groupNames.length; i++) {
    groupCounts[groupNames[i]] = [ 0, 0, 0, 0, 0 ];
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

    var outstanding = groupStatus[status.asynchronous] + groupStatus[status.executing];
    var failed = groupStatus[status.fail];
    var passed = groupStatus[status.pass];
    var started = groupCount - groupStatus[status.notrun];

    dwr.util.setValue("groupCount" + groupName, groupCount);
    dwr.util.setValue("groupStarted" + groupName, started);
    dwr.util.setValue("groupOutstanding" + groupName, outstanding);
    dwr.util.setValue("groupFailed" + groupName, failed);
    dwr.util.setValue("groupPassed" + groupName, passed);

    dwr.util.byId("groupOutstanding" + groupName).style.backgroundColor = "";
    dwr.util.byId("groupOutstanding" + groupName).style.color = "";
    dwr.util.byId("groupFailed" + groupName).style.backgroundColor = "";
    dwr.util.byId("groupFailed" + groupName).style.color = "";
    dwr.util.byId("groupPassed" + groupName).style.backgroundColor = "";
    dwr.util.byId("groupPassed" + groupName).style.color = "";

    if (failed > 0) {
      dwr.util.byId("groupFailed" + groupName).style.backgroundColor = statusBackgrounds[status.fail];
      dwr.util.byId("groupFailed" + groupName).style.color = statusColors[status.fail];
    }
    if (outstanding > 0 && failed > 0) {
      dwr.util.byId("groupOutstanding" + groupName).style.backgroundColor = statusBackgrounds[status.asynchronous];
      dwr.util.byId("groupOutstanding" + groupName).style.color = statusColors[status.asynchronous];
    }
    if (passed == groupCount) {
      dwr.util.byId("groupPassed" + groupName).style.backgroundColor = statusBackgrounds[status.pass];
      dwr.util.byId("groupPassed" + groupName).style.color = statusColors[status.pass];
    }
  }

  var outstanding = counts[status.asynchronous] + counts[status.executing];
  var failed = counts[status.fail];
  var passed = counts[status.pass];
  var started = testCount - counts[status.notrun];

  dwr.util.setValue("testCount", testCount);
  dwr.util.setValue("testsStarted", started);
  dwr.util.setValue("testsOutstanding", outstanding);
  dwr.util.setValue("testsFailed", failed);
  dwr.util.setValue("testsPassed", passed);

  dwr.util.byId("testsOutstanding").style.backgroundColor = "";
  dwr.util.byId("testsOutstanding").style.color = "";
  dwr.util.byId("testsFailed").style.backgroundColor = "";
  dwr.util.byId("testsFailed").style.color = "";
  dwr.util.byId("testsPassed").style.backgroundColor = "";
  dwr.util.byId("testsPassed").style.color = "";

  if (failed > 0) {
    dwr.util.byId("testsFailed").style.backgroundColor = statusBackgrounds[status.fail];
    dwr.util.byId("testsFailed").style.color = statusColors[status.fail];
  }
  if (outstanding > 0 && failed > 0) {
    dwr.util.byId("testsOutstanding").style.backgroundColor = statusBackgrounds[status.asynchronous];
    dwr.util.byId("testsOutstanding").style.color = statusColors[status.asynchronous];
  }
  if (passed == testCount) {
    dwr.util.byId("testsPassed").style.backgroundColor = statusBackgrounds[status.pass];
    dwr.util.byId("testsPassed").style.color = statusColors[status.pass];
  }

  if ((started == testCount && outstanding == 0 && dwr.util.getValue("report")) || reportAnyway) {
    var failures = [];
    for (var testName in tests) {
      test = tests[testName];
      if (test.status != status.pass) {
        failures.push({
          name: test.name,
          status: test.status,
          group: test.group,
          messages: test.messages
        });
      }
    }
    Recorder.postResults(testCount, passed, failed, failures, function() {
      dwr.util.setValue("reportResult", "Posted report to server");
    });
    clearTimeout(boredTimeout);
  }
}

/**
 *
 */
function runTest(testName) {
  var subTest = (currentTest != null);
  if (!subTest) {
    currentTest = tests[testName];
  }

  _setStatus(currentTest, status.executing, true);
  currentTest.messages = [];
  dwr.util.setValue(currentTest.name, "");

  var scope = currentTest.scope || window;
  try {
    currentTest.func.apply(scope);
  }
  catch (ex) {
    _setStatus(currentTest, status.fail);
    if (ex.message && ex.message.length > 0) {
      _record(currentTest, ex.message);
    }
    console.trace();
  }
  if (_getStatus(currentTest) == status.executing) {
    _setStatus(currentTest, status.pass, true);
  }

  if (!subTest) {
    currentTest = null;
  }
  updateTestResults(false);
}

/**
 *
 */
function runTestGroup(groupName) {
  var testNames = groups[groupName];
  if (testNames == null) {
    throw new Error("No test group called: " + groupName);
  }
  var delay = dwr.util.getValue("delay");

  var pauseAndRunGroup = function(groupName, i) {
    if (i >= testNames.length) {
      return;
    }

    runTest(testNames[i]);
    setTimeout(function() {
      pauseAndRunGroup(groupName, i + 1);
    }, delay);
  }

  pauseAndRunGroup(groupName, 0);
}

/**
 *
 */
function runAllTests() {
  var testNames = [];
  for (var testName in tests) {
    testNames.push(testName);
  }
  testNames.sort();
  var delay = dwr.util.getValue("delay");

  var pauseAndRunAll = function(index) {
    if (index >= testNames.length) {
      boredTimeout = setTimeout(function() {
        updateTestResults(true);
      }, 10000);
      return;
    }
    var testName = testNames[index];
    runTest(testName);

    setTimeout(function() {
      pauseAndRunAll(index + 1);
    }, delay);
  };

  pauseAndRunAll(0);
}

/**
 *
 */
function createDelayed(func, scope) {
  _setStatus(currentTest, status.asynchronous, true);
  var delayedTest = currentTest;
  if (!delayedTest.outstanding) {
    delayedTest.outstanding = 1;
  }
  else {
    delayedTest.outstanding++;
  }
  var sent = dwr.util.getValue("asyncSent" + currentTest.name) - 0;
  dwr.util.setValue("asyncSent" + currentTest.name, sent + 1);

  return function() {
    var isSync = (currentTest != null);
    currentTest = delayedTest;
    var obj = scope || window;
    if (typeof func == "function") {
      try {
        func.apply(obj, arguments);
      }
      catch (ex) {
        _setStatus(currentTest, status.fail);
        if (ex.message && ex.message.length > 0) {
          _record(currentTest, ex.message);
        }
        console.trace();
      }
    }
    delayedTest.outstanding--;
    if (delayedTest.outstanding == 0 && _getStatus(delayedTest) == status.asynchronous) {
      _setStatus(currentTest, status.pass, true);
    }
    var returned = dwr.util.getValue("asyncReturn" + currentTest.name) - 0;
    dwr.util.setValue("asyncReturn" + currentTest.name, returned + 1);

    if (!isSync) {
      currentTest = null;
    }
    updateTestResults(false);
  };
}

/**
 *
 */
function createDelayedError(func, scope) {
  var delayedTest = currentTest;
  return function() {
    currentTest = delayedTest;
    _setStatus(currentTest, status.fail);
    var obj = scope || window;
    if (typeof func == "function") {
      _record(currentTest, "Executing delayed error handler");
      func.apply(obj, arguments);
    }
    else if (typeof func == "string") {
      _record(currentTest, "Executing delayed error handler: " + func);
    }
    else {
      _record(currentTest, "Executing delayed error handler");
    }
    currentTest = null;
    updateTestResults(false);
  };
}

/**
 *
 */
function createReplyIsErrorCallback() {
  return {
    callback:createDelayed(function(data) {
      if (data == null || data.length == 0) {
        return;
      }
      fail(data.join("<br/>"));
    }),
    exceptionHandler:createDelayedError()
  };
}

/**
 *
 */
function useHtml(html) {
  dwr.util.setValue(currentTest.scratch, html, { escapeHtml:false });
}

/**
 *
 */
function fail(message) {
  _recordThrow("fail", arguments);
}

/**
 *
 */
function assertTrue(value) {
  if (!value) {
    _recordThrow("assertTrue", arguments);
  }
}

/**
 *
 */
function verifyTrue(value) {
  if (!value) {
    _recordTrace("verifyTrue", arguments);
  }
}

/**
 *
 */
function assertFalse(value) {
  if (value) {
    _recordThrow("assertFalse", arguments);
  }
}

/**
 *
 */
function verifyFalse(value) {
  if (value) {
    _recordTrace("verifyFalse", arguments);
  }
}

/**
 *
 */
function assertNull(value) {
  if (value !== null) {
    _recordThrow("assertNull", arguments);
  }
}

/**
 *
 */
function verifyNull(value) {
  if (value !== null) {
    _recordTrace("verifyNull", arguments);
  }
}

/**
 *
 */
function assertNotNull(value) {
  if (value === null) {
    _recordThrow("assertNotNull", arguments);
  }
}

/**
 *
 */
function verifyNotNull(value) {
  if (value === null) {
    _recordTrace("verifyNotNull", arguments);
  }
}

/**
 *
 */
function assertUndefined(value) {
  if (value !== undefined) {
    _recordThrow("assertUndefined", arguments);
  }
}

/**
 *
 */
function verifyUndefined(value) {
  if (value !== undefined) {
    _recordTrace("verifyUndefined", arguments);
  }
}

/**
 *
 */
function assertNotUndefined(value) {
  if (value === undefined) {
    _recordThrow("assertNotUndefined", arguments);
  }
}

/**
 *
 */
function verifyNotUndefined(value) {
  if (value === undefined) {
    _recordTrace("verifyNotUndefined", arguments);
  }
}

/**
 *
 */
function assertUndefined(value) {
  if (value !== undefined) {
    _recordThrow("assertUndefined", arguments);
  }
}

/**
 *
 */
function verifyUndefined(value) {
  if (value !== undefined) {
    _recordTrace("verifyUndefined", arguments);
  }
}

/**
 *
 */
function assertNotUndefined(value) {
  if (value === undefined) {
    _recordThrow("assertNotUndefined", arguments);
  }
}

/**
 *
 */
function verifyNotUndefined(value) {
  if (value === undefined) {
    _recordTrace("verifyNotUndefined", arguments);
  }
}

/**
 *
 */
function assertNaN(value) {
  if (value !== NaN) {
    _recordThrow("assertNaN", arguments);
  }
}

/**
 *
 */
function verifyNaN(value) {
  if (value !== NaN) {
    _recordTrace("verifyNaN", arguments);
  }
}

/**
 *
 */
function assertNotNaN(value) {
  if (value === NaN) {
    _recordThrow("assertNotNaN", arguments);
  }
}

/**
 *
 */
function verifyNotNaN(value) {
  if (value === NaN) {
    _recordTrace("verifyNotNaN", arguments);
  }
}

/**
 *
 */
function assertEqual(value1, value2) {
  if (!_isEqual(value1, value2)) {
    _recordThrow("assertEqual", arguments);
  }
}

/**
 *
 */
function verifyEqual(value1, value2) {
  if (!_isEqual(value1, value2)) {
    _recordTrace("verifyEqual", arguments);
  }
}

/**
 *
 */
function assertNotEqual(value1, value2) {
  if (_isEqual(value1, value2)) {
    _recordThrow("assertNotEqual", arguments);
  }
}

/**
 *
 */
function verifyNotEqual(value1, value2) {
  if (!_isEqual(value1, value2)) {
    _recordTrace("verifyNotEqual", arguments);
  }
}

/**
 *
 */
function _recordTrace() {
  _record.apply(this, arguments);
  console.trace();
}

/**
 *
 */
function _recordThrow() {
  _record.apply(this, arguments);
  throw new Error();
}

/**
 *
 */
function success(message) {
  _appendMessage(message);
}

/**
 *
 */
function _record() {
  console.error(arguments);
  _setStatus(currentTest, status.fail);
  var message = arguments[0] + "(";
  var data = arguments[1];
  if (typeof data == "string") {
    message += data;
  }
  else {
    for (var i = 0; i < data.length; i++) {
      if (i != 0) message += ", ";
      message += data[i];
    }
  }
  message += ")";
  _appendMessage(currentTest, message);
}

/**
 *
 */
function _appendMessage(test, message) {
  test.messages.push(message);
  var output = test.messages.join("<br />");
  dwr.util.setValue(test.name, output, { escapeHtml:false });
}

/**
 *
 */
function _setStatus(test, status, override) {
  if (typeof test == "string") {
    test = tests[test];
  }
  if (test.status < status || override) {
    test.status = status;
  }
  dwr.util.byId(test.name).style.backgroundColor = statusBackgrounds[status];
  dwr.util.byId(test.name).style.color = statusColors[status];
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
function _isEqual(actual, expected, depth) {
  if (!depth) depth = 0;
  // Rather than failing we assume that it works!
  if (depth > 10) return true;

  if (expected == null) {
    if (actual != null) {
      return "expected: null, actual non-null: " + dwr.util.toDescriptiveString(actual);
    }
    return true;
  }

  if (isNaN(expected)) {
    if (!isNaN(actual)) {
      return "expected: NaN, actual non-NaN: " + dwr.util.toDescriptiveString(actual);
    }
    return true;
  }

  if (actual == null) {
    if (expected != null) {
      return "actual: null, expected non-null: " + dwr.util.toDescriptiveString(expected);
    }
    return true; // we wont get here of course ...
  }

  if (typeof expected == "object") {
    if (!(typeof actual == "object")) {
      return "expected object, actual not an object";
    }

    var actualLength = 0;
    for (var prop in actual) {
      if (typeof actual[prop] != "function" || typeof expected[prop] != "function") {
        var nest = testEquals(actual[prop], expected[prop], depth + 1);
        if (typeof nest != "boolean" || !nest) {
          return "element '" + prop + "' does not match: " + nest;
        }
      }
      actualLength++;
    }

    // need to check length too
    var expectedLength = 0;
    for (prop in expected) expectedLength++;
    if (actualLength != expectedLength) {
      return "expected object size = " + expectedLength + ", actual object size = " + actualLength;
    }
    return true;
  }

  if (actual != expected) {
    return "expected = " + expected + " (type=" + typeof expected + "), actual = " + actual + " (type=" + typeof actual + ")";
  }

  if (expected instanceof Array) {
    if (!(actual instanceof Array)) {
      return "expected array, actual not an array";
    }
    if (actual.length != expected.length) {
      return "expected array length = " + expected.length + ", actual array length = " + actual.length;
    }
    for (var i = 0; i < actual.length; i++) {
      var inner = testEquals(actual[i], expected[i], depth + 1);
      if (typeof inner != "boolean" || !inner) {
        return "element " + i + " does not match: " + inner;
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

//*
_addEvent(window, 'load', function() {
  init();
});
// */

/*
Each test must conform to the following:
- Its name must begin 'test'
- If the test is asynchronous, it should use createDelayed(). For example:
  window.setTimeout(createDelayed(function(args) {...}), 1000);
  An error handler (that should not be called) can be created with createDelayedError()
- xUnit assert...() functions are available to halt execution
- verify...() functions are also available that do not halt execution
- If you wish to record a failure use fail()
- When a function ends it will be assumed that it failed if an assert or verify
  failed or if fail was called. If testDelayed was called then the final
  assessment will only be made when testCompleted is called. The test
  will be considered a failure until this happens.
  Otherwise the test passes ;-)
*/
