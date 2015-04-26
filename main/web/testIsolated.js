
createTestGroup("Isolated");

/**
 *
 */
window.testIsolatedSyncNesting = function() {
  dwr.engine.setAsync(false);
  var count = 0;

  Test.slowStringParam("1", 100, waitDwrCallbackOptions(function(data1) {
    count++;
    verifyEqual(count, 1);
    verifyEqual(data1, "1");

    Test.slowStringParam("2", 200, waitDwrCallbackOptions(function(data2) {
      count++;
      verifyEqual(count, 2);
      verifyEqual(data2, "2");
    }));
    count++;
    verifyEqual(count, 3);
  }));

  count++;
  verifyEqual(count, 4);

  dwr.engine.setAsync(true);
};

/**
 *
 */
window.testIsolatedSyncReturning = function() {
  dwr.engine.setAsync(false);
  var data1 = Test.slowStringParam("1", 100);
  verifyEqual(data1, "1");
  var data2 = Test.slowStringParam("SyncNesting-2", 100);
  verifyEqual(data2, "SyncNesting-2");
  dwr.engine.setAsync(true);
};

/**
 * 
 */
window.testIsolatedActiveReverseAjaxDefaultMode = function() {
  _testReverseAjax([2000, 2000, 2000], 1500);
}
window.testIsolatedActiveReverseAjaxIframeMode = function() {
  var origSend2 = dwr.engine.transport.send2;
  dwr.engine.transport.send2 = function(batch) {
    dwr.engine.batch.prepareToSend(batch);
    batch.transport = dwr.engine.transport.iframe;
    return batch.transport.send(batch);
  };
  _testReverseAjax([2000, 2000, 2000], 1500, function() {dwr.engine.transport.send2 = origSend2;});
}
window.testIsolatedActiveReverseAjaxScriptTagMode = function() {
  var origSend2 = dwr.engine.transport.send2;
  dwr.engine.transport.send2 = function(batch) {
    dwr.engine.batch.prepareToSend(batch);
    batch.transport = dwr.engine.transport.scriptTag;
    return batch.transport.send(batch);
  };
  _testReverseAjax([2000, 2000, 2000], 1500, function() {dwr.engine.transport.send2 = origSend2;});
}
function _testReverseAjax(callIntervals, allowedDelay, completeCb) {
  var c = new dwrunit.ExplicitAsyncCompletor;
  var expectedMaxCallTimes = [];
  var totalSoFar = 0;
  for(var i=0; i<callIntervals.length; i++) {
    expectedMaxCallTimes[i] = totalSoFar + callIntervals[i] + allowedDelay;
    totalSoFar += callIntervals[i];
  }
  var resultCallTimes = [];
  var startTime = new Date().getTime();
  var fnName = "_testReverseAjax_" + startTime;
  window[fnName] = waitAsync(c, function(callIndex) {
    if (resultCallTimes[callIndex] != null) {
      dwrunit.fail("Multiple calls to call index " + callIndex + ".");
    } else {
      resultCallTimes[callIndex] = (new Date().getTime()) - startTime;
    }
  });
  
  Test.reverseAjaxCallFunction(fnName, callIntervals, waitDwrCallbackOptions(c));
  dwr.engine.setActiveReverseAjax(true);
  setTimeout(waitAsync(c, function() {
    var ok = true;
    if (resultCallTimes.length != expectedMaxCallTimes.length) {
      dwrunit.fail("Expected " + expectedMaxCallTimes.length + " pushed calls but got " + resultCallTimes.length + ".");
      ok = false;
    } else {
      for(var i=0; i<resultCallTimes.length; i++) {
        if (resultCallTimes[i] == null || resultCallTimes[i] > expectedMaxCallTimes[i]) ok = false;
      }
    }
    if (!ok) {
      dwrunit.fail("Allowed call times: [" + expectedMaxCallTimes + "] msec");
      dwrunit.fail("Resulting call times: [" + resultCallTimes + "] msec");
    }
    c.complete();
    dwr.engine.setActiveReverseAjax(false);
    if (completeCb) completeCb();
  }), 9000);
}

window.testIsolatedDwrSessionCollision = function() {
  // Start out with no JSESSIONID and no DWRSESSIONID
  function deleteCookie(name, path) {
      document.cookie = name + "=; path=" + path + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
  }
  var path = dwr.engine._contextPath;
  deleteCookie("JSESSIONID", path);
  deleteCookie("DWRSESSIONID", path);
  
  var windows = [];
  for(var i=0; i<10; i++) {
    var pwin = window.open("pageTestDwrSession.html");
    if (!pwin) throw new Error("Popup window needed for test was blocked.");
    windows.push(pwin);
  }

  var c = new dwrunit.ExplicitAsyncCompletor;
  function checkStatus() {
    if (windows.length > 0) {
      var notready = [];
      for(var i=0; i<windows.length; i++) {
        var pwin = windows[i];
        var done = false;
        try {
          var stat = pwin.document && pwin.document.getElementById("status");
          if (stat) {
            var status = stat.innerHTML;
            if (status) {
              done = true;
              if (status == "OK") {
                pwin.close();
              } else {
                dwrunit.fail(status);
              }
            }
          }
        }
        catch(ex) {
          // NOP
        }
        if (!done) {
          notready.push(pwin);
        }
      }
      windows = notready;
    }
    if (windows.length == 0) {
      c.complete();
    } else {
      setTimeout(waitAsync(c, function() {
        checkStatus();
      }), 500);
    }
  }
  checkStatus();
}
