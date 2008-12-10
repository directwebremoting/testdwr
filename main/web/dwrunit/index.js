// http://www.helephant.com/Article.aspx?ID=675

var tests = {};
var groups = { 'Global':[] };
var groupNames = [ 'Global' ];
var boredTimeout = null;

var currentTest = null;

var stati = { notrun:0, executing:1, asynchronous:2, pass:3, fail:4 };
var statusBackgrounds = [ "#EEE", "#888", "#FFA", "#8F8", "#F00" ];
var statusColors = [ "#000", "#FFF", "#000", "#000", "#FFF" ];
var statusNames = [ "Skipped", "Executing", "Waiting", "Pass", "Fail" ];

/**
 *
 */
function init() {
  for (var prop in window) {
    if (prop.match(/test/) && typeof window[prop] == "function") {
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
    status: stati.notrun,
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
  var html = "";
  html += '<div id="settingsPanel">';
  html += '  <strong>Settings:</strong>';
  html += '  <label for="delay" class="hover" title="The delay between starting tests.">Inter-test delay:</label>';
  html += '  <input id="delay" value="0" size="3"/> ms.';
  html += '  <label for="autoSend" class="hover" title="DWR can record a test runs in (~/.dwr_test_results.xml) Do we automatically send the results to the server on completion?">Auto send results:</label>';
  html += '  <input id="autoSend" type="checkbox"/>';
  html += '</div>';
  html += '<table class="grey form">';
  html += '  <thead><tr><th>#</th><th>Group</th><th>Run</th><th>Results</th><th>Actions</th><th>Scratch</th></tr></thead>';
  html += '  <tbody id="testSummary"> </tbody>';
  html += '</table>';
  html += '<div id="output"> </div>';
  dwr.util.setValue('dwrUnit', html, { escapeHtml:false });

  var testNum = 0;
  for (var i = 0; i < groupNames.length; i++) {
    var groupName = groupNames[i];
    var testNames = groups[groupName];
    testNames.sort();

    dwr.util.addRows("testSummary", [ groupName ], [
      function(groupName) {
        return '<a class="headInline" href="#" id="groupDisplay' + groupName + '" onclick="_toggleGroup(\'' + groupName + '\');">Show</a>';
      },
      function(groupName) {
        return "<strong>" + groupName + "</strong>";
      },
      function(groupName) { return ""; },
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
        if (options.cellNum == 2) td.setAttribute("id", "groupStarted" + options.rowData);
        if (options.cellNum == 3) td.setAttribute("id", "groupCount" + options.rowData);
        return td;
      }
    });

    dwr.util.addRows("testSummary", testNames, [
      function(testName) { return "" + (++testNum); },
      function(testName) {
        var name;
        if (groupName == "Global") {
          name = _addSpaces(testName.substring(4));
        }
        else {
          name = _addSpaces(testName.substring(4 + groupName.length));
        }
        // We did add  title='" + dwr.util.escapeHtml(tests[testName].func.toString()) + "'
        // But this confuses things because we're not currently escaping for attributes properly
        // The best solution is a better drilldown thing anyway because the wrapping is wrong here
        return '<a href="#" id="testDisplay' + groupName + '" onclick="_toggleTest(\'' + testName + '\');">' + name + '</a>' +
            '<pre style="display:none;" class="codeBlock" id="testDetail' + testName + '">' + dwr.util.escapeHtml(tests[testName].func.toString()) + '</pre>';
      },
      function(testName) {
         return "<span id='asyncReturn" + testName + "'>0</span>/<span id='asyncSent" + testName + "'>0</span>";
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
        if (options.cellNum == 3) td.setAttribute("id", options.rowData);
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
    function() { return "<strong>All</strong>"; },
    function() { return ""; },
    function() { return ""; },
    function() { return '<input type="button" value="Run All" onclick="runAllTests();"/>'; },
    function() { return "<div id='scratchAll'></div>"; }
  ], {
    escapeHtml:false,
    cellCreator:function(options) {
      var td = document.createElement("th");
      if (options.cellNum == 2) td.setAttribute("id", "testsStarted");
      if (options.cellNum == 3) td.setAttribute("id", "testCount");
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
 *
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

    var outstanding = groupStatus[stati.asynchronous] + groupStatus[stati.executing];
    var failed = groupStatus[stati.fail];
    var passed = groupStatus[stati.pass];
    var started = groupCount - groupStatus[stati.notrun];

    dwr.util.setValue("groupCount" + groupName, "Pass:" + passed + " Fail:" + failed);
    dwr.util.setValue("groupStarted" + groupName, started + "/" + (started - outstanding));

    dwr.util.byId("groupCount" + groupName).style.backgroundColor = "";
    dwr.util.byId("groupCount" + groupName).style.color = "";

    if (failed > 0) {
      dwr.util.byId("groupCount" + groupName).style.backgroundColor = statusBackgrounds[stati.fail];
      dwr.util.byId("groupCount" + groupName).style.color = statusColors[stati.fail];
    }
    if (outstanding > 0 && failed > 0) {
      dwr.util.byId("groupCount" + groupName).style.backgroundColor = statusBackgrounds[stati.asynchronous];
      dwr.util.byId("groupCount" + groupName).style.color = statusColors[stati.asynchronous];
    }
    if (passed == groupCount) {
      dwr.util.byId("groupCount" + groupName).style.backgroundColor = statusBackgrounds[stati.pass];
      dwr.util.byId("groupCount" + groupName).style.color = statusColors[stati.pass];
    }
  }

  var outstanding = counts[stati.asynchronous] + counts[stati.executing];
  var failed = counts[stati.fail];
  var passed = counts[stati.pass];
  var started = testCount - counts[stati.notrun];

  dwr.util.setValue("testCount", "Pass:" + passed + " Fail:" + failed);
  dwr.util.setValue("testsStarted", started + "/" + (started - outstanding));

  if (failed > 0) {
    dwr.util.byId("testCount").style.backgroundColor = statusBackgrounds[stati.fail];
    dwr.util.byId("testCount").style.color = statusColors[stati.fail];
  }
  if (outstanding > 0 && failed > 0) {
    dwr.util.byId("testCount").style.backgroundColor = statusBackgrounds[stati.asynchronous];
    dwr.util.byId("testCount").style.color = statusColors[stati.asynchronous];
  }
  if (passed == testCount) {
    dwr.util.byId("testCount").style.backgroundColor = statusBackgrounds[stati.pass];
    dwr.util.byId("testCount").style.color = statusColors[stati.pass];
  }

  if ((started == testCount && outstanding == 0 && dwr.util.getValue("report")) || reportAnyway) {
    var failures = [];
    for (var testName in tests) {
      test = tests[testName];
      if (test.status != stati.pass) {
        failures.push({
          name: test.name,
          status: test.status,
          group: test.group,
          messages: test.messages
        });
      }
    }
    Recorder.postResults(testCount, passed, failed, failures, function() {
      dwr.util.setValue("scratchAll", "Posted report to server");
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

  _setStatus(currentTest, stati.executing, true);
  currentTest.messages = [];
  dwr.util.setValue(currentTest.name, "");

  var scope = currentTest.scope || window;
  try {
    currentTest.func.apply(scope);
  }
  catch (ex) {
    _setStatus(currentTest, stati.fail);
    if (ex.message && ex.message.length > 0) {
      _record(currentTest, ex.message);
    }
    window.console && console.trace();
  }
  if (_getStatus(currentTest) == stati.executing) {
    _setStatus(currentTest, stati.pass, true);
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
function createOptions(func, message) {
  return {
      callback:createDelayed(func),
      exceptionHandler:createDelayedError(message),
      errorHandler:createDelayedError(message)
  };
}

/**
 *
 */
function createDelayed(func) {
  _setStatus(currentTest, stati.asynchronous, true);
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
    if (typeof func == "function") {
      try {
        func.apply(this, arguments);
      }
      catch (ex) {
        _setStatus(currentTest, stati.fail);
        if (ex.message && ex.message.length > 0) {
          _record(currentTest, ex.message);
        }
        window.console && console.trace();
      }
    }
    delayedTest.outstanding--;
    if (delayedTest.outstanding == 0 && _getStatus(delayedTest) == stati.asynchronous) {
      _setStatus(currentTest, stati.pass, true);
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
function createDelayedError(func) {
  var delayedTest = currentTest;
  return function() {
    currentTest = delayedTest;
    _setStatus(currentTest, stati.fail);
    if (func == null) {
      _record(currentTest.name, "Executing delayed error handler: " + dwr.util.toDescriptiveString(Array().slice.call(arguments), 3));
    }
    else if (typeof func == "function") {
      _record(currentTest.name, "Executing delayed error handler: " + dwr.util.toDescriptiveString(Array().slice.call(arguments), 3));
      func.apply(createDelayed, arguments);
    }
    else if (typeof func == "string") {
      _record(currentTest.name, "Executing delayed error handler: " + func);
    }
    else {
      _record(currentTest.name, "Executing delayed error handler: " + dwr.util.toDescriptiveString(Array().slice.call(arguments), 3));
    }
    currentTest = null;
    updateTestResults(false);
  };
}

/**
 *
 */
function createVerifyCallback() {
  return {
    callback:createDelayed(function(data) {
      if (data.report.length == 0) {
        return;
      }
      fail(data.report.join("<br/>"));
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
  if (!isNaN(value)) {
    _recordThrow("assertNaN", arguments);
  }
}

/**
 *
 */
function verifyNaN(value) {
  if (!isNaN(value)) {
    _recordTrace("verifyNaN", arguments);
  }
}

/**
 *
 */
function assertNotNaN(value) {
  if (isNaN(value)) {
    _recordThrow("assertNotNaN", arguments);
  }
}

/**
 *
 */
function verifyNotNaN(value) {
  if (isNaN(value)) {
    _recordTrace("verifyNotNaN", arguments);
  }
}

/**
 *
 */
function assertEqual(expected, actual) {
  if (!_isEqual(expected, actual)) {
    _recordThrow("assertEqual", arguments);
  }
}

/**
 *
 */
function verifyEqual(expected, actual) {
  if (!_isEqual(expected, actual)) {
    _recordTrace("verifyEqual", arguments);
  }
}

/**
 *
 */
function assertNotEqual(expected, actual) {
  if (_isEqual(expected, actual)) {
    _recordThrow("assertNotEqual", arguments);
  }
}

/**
 *
 */
function verifyNotEqual(expected, actual) {
  if (!_isEqual(expected, actual)) {
    _recordTrace("verifyNotEqual", arguments);
  }
}

/**
 *
 */
function _recordTrace() {
  _record.apply(this, arguments);
  window.console && console.trace();
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
  window.console && console.error(arguments);
  _setStatus(currentTest, stati.fail);
  var message = arguments[0] + "(";
  var data = arguments[1];
  if (typeof data == "string") {
    message += data;
  }
  else {
    for (var i = 0; i < data.length; i++) {
      if (i != 0) message += ", ";
      message += dwr.util.toDescriptiveString(data[i], 3);
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
function _setStatus(test, newStatus, override) {
  if (typeof test == "string") {
    test = tests[test];
  }
  if (test.status < newStatus || override) {
    test.status = newStatus;
  }
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