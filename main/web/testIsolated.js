
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
window.testIsolatedReverseAjaxPushStreamingDefaultMode = function() {
  _testReverseAjax(dwr.engine, Test, [2000, 2000, 2000], 1500, null);
}
window.testIsolatedReverseAjaxPushStreamingIframeMode = function() {
  _testReverseAjax(dwr.engine, Test, [2000, 2000, 2000], 1500, dwr.engine.transport.iframe);
}
window.testIsolatedReverseAjaxPushStreamingScriptTagMode = function() {
  _testReverseAjax(dwr.engine, Test, [2000, 2000, 2000], 1500, dwr.engine.transport.scriptTag);
}

/**
 * 
 */
window.testIsolatedReverseAjaxPushPollingDefaultMode = function() {
  require(["dwrpoll/amd/engine", "dwrpoll/amd/interface/Test"], waitAsync(function(dwrEngine, Test) {
    _testReverseAjax(dwrEngine, Test, [2000, 2000, 2000], 2000, null);
  }));
};
window.testIsolatedReverseAjaxPushPollingIframeMode = function() {
  require(["dwrpoll/amd/engine", "dwrpoll/amd/interface/Test"], waitAsync(function(dwrEngine, Test) {
    _testReverseAjax(dwrEngine, Test, [2000, 2000, 2000], 2000, dwrEngine.transport.iframe);
  }));
};
window.testIsolatedReverseAjaxPushPollingScriptTagMode = function() {
  require(["dwrpoll/amd/engine", "dwrpoll/amd/interface/Test"], waitAsync(function(dwrEngine, Test) {
    _testReverseAjax(dwrEngine, Test, [2000, 2000, 2000], 2000, dwrEngine.transport.scriptTag);
  }));
};

function _testReverseAjax(dwrEngine, Test, callIntervals, allowedDelay, transportType) {
  var origSend2 = dwrEngine.transport.send2;
  if (transportType) {
    dwrEngine.transport.send2 = function(batch) {
      dwrEngine.batch.prepareToSend(batch);
      batch.transport = transportType;
      return batch.transport.send(batch);
    };
  }
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
  
  Test.reverseAjaxCallFunction(fnName, callIntervals, waitDwrCallbackOptions());
  dwrEngine.setActiveReverseAjax(true);
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
    dwrEngine.setActiveReverseAjax(false);
    if (transportType) dwrEngine.transport.send2 = origSend2;
  }), 9000);
}

/**
 * 
 */
window.testIsolatedReverseAjaxPushPassiveDefaultMode = function() {
  _testPassiveReverseAjax(null);
};
window.testIsolatedReverseAjaxPushPassiveIframeMode = function() {
  _testPassiveReverseAjax(dwr.engine.transport.iframe);
};
window.testIsolatedReverseAjaxPushPassiveScriptTagMode = function() {
  _testPassiveReverseAjax(dwr.engine.transport.scriptTag);
};

function _testPassiveReverseAjax(transportType) {
  var origSend2 = dwr.engine.transport.send2;
  if (transportType) {
    dwr.engine.transport.send2 = function(batch) {
      dwr.engine.batch.prepareToSend(batch);
      batch.transport = transportType;
      return batch.transport.send(batch);
    };
  }
  var c = new dwrunit.ExplicitAsyncCompletor;
  var fnName = "_testReverseAjax_" + (new Date).getTime();
  var replies = [];
  window[fnName] = waitAsync(c, function(callIndex) {
    replies.push("piggyback");
  });
  
  Test.reverseAjaxCallFunction(fnName, [500], waitDwrCallbackOptions(function() {
    replies.push("addpiggyback");
  }));
  setTimeout(waitAsync(c, function() {
    Test.doNothing(waitDwrCallbackOptions(function() {
      replies.push("checkpiggyback");
      setTimeout(waitAsync(c, function() {
        verifyEqual(replies, ["addpiggyback", "piggyback", "checkpiggyback"]);
        c.complete();
        if (transportType) dwr.engine.transport.send2 = origSend2;
      }), 500);
    }));
  }), 1000);
}

function deleteCookie(name, path) {
  document.cookie = name + "=; path=" + path + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
}

window.testIsolatedDwrSessionCollision = function() {
  // Start out with no JSESSIONID and no DWRSESSIONID
  var match = document.cookie.match(/(?:^|; )DWRSESSIONID=([^;]+)/);
  var origDwrSessionId = match && match[1];
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
      deleteCookie("JSESSIONID", path);
      if (origDwrSessionId) dwr.engine.transport.setDwrSession(origDwrSessionId);
    } else {
      setTimeout(waitAsync(c, function() {
        checkStatus();
      }), 500);
    }
  }
  checkStatus();
}

window.testIsolatedReverseAjaxGetSessionIdStreaming = function() {
  _testIsolatedReverseAjaxGetSessionId(dwr.engine, Test);
}
window.testIsolatedReverseAjaxGetSessionIdPolling = function() {
  require(["dwrpoll/amd/engine", "dwrpoll/amd/interface/Test"], waitAsync(function(dwrEngine, Test) {
    _testIsolatedReverseAjaxGetSessionId(dwrEngine, Test);
  }));
}
var reverseAjaxGetSessionIdFunc = null;
_testIsolatedReverseAjaxGetSessionId = function(dwrEngine, Test) {
  var c = new dwrunit.ExplicitAsyncCompletor;

  Test.expireJsessionIdCookie(waitAsync(c, function() {
    // Start test after JSESSIONID is cleared
    start();
  }));

  function start() {
    dwrEngine.setActiveReverseAjax(true);
    // Check HttpSession id through Reverse Ajax (should be null)
    reverseAjaxGetSessionIdFunc = waitAsync(c, step1);
    Test.reverseAjaxCheckHttpSessionId("reverseAjaxGetSessionIdFunc");
  }

  function step1(httpSessionId) {
    if (httpSessionId != null) {
      dwrunit.fail("httpSessionId should be null (before creation)");
      end();
    } else {
      step2();
    }
  }

  // Force session and get HttpSession id from server
  var createdHttpSessionId;
  function step2() {
    // Perform as batch so the second operation is performed right after the first on the server
    // without another roundtrip
    dwrEngine.beginBatch();
    Test.createSession(waitAsync(c, function(httpSessionId) {
      createdHttpSessionId = httpSessionId;
    }));
    step3();
    dwrEngine.endBatch();
  }

  // Check HttpSession id through Reverse Ajax (should be set and the same as in previous call)
  function step3() {
    reverseAjaxGetSessionIdFunc = waitAsync(c, step4);
    Test.reverseAjaxCheckHttpSessionId("reverseAjaxGetSessionIdFunc");
  }
  function step4(httpSessionId) {
    if (httpSessionId != createdHttpSessionId) {
      dwrunit.fail("httpSessionId should be '" + createdHttpSessionId + "' but is '" + httpSessionId + "'.");
      end();
    } else {
      step5();
    }
  }

  // Invalidate session on server
  function step5() {
    Test.invalidateSession(waitAsync(c, function() {
      step6();
    }));
  }

  // Check HttpSession id through Reverse Ajax (should be null)
  function step6() {
    reverseAjaxGetSessionIdFunc = waitAsync(c, step7);
    Test.reverseAjaxCheckHttpSessionId("reverseAjaxGetSessionIdFunc");
  }
  function step7(httpSessionId) {
    if (httpSessionId != null) {
      dwrunit.fail("httpSessionId should be null (after invalidation)");
    }
    end();
  }
  function end() {
    c.complete();
    dwrEngine.setActiveReverseAjax(false);
  }
}

window.testIsolatedReverseAjaxCreateSessionFromWorkerThreadStreaming = function() {
  _testIsolatedReverseAjaxCreateSessionFromWorkerThread(dwr.engine, Test);
}
window.testIsolatedReverseAjaxCreateSessionFromWorkerThreadPolling = function() {
  require(["dwrpoll/amd/engine", "dwrpoll/amd/interface/Test"], waitAsync(function(dwrEngine, Test) {
    _testIsolatedReverseAjaxCreateSessionFromWorkerThread(dwrEngine, Test);
  }));
}
var reverseAjaxSessionCreatedFunc = null;
_testIsolatedReverseAjaxCreateSessionFromWorkerThread = function(dwrEngine, Test) {
  var c = new dwrunit.ExplicitAsyncCompletor;

  Test.expireJsessionIdCookie(waitAsync(c, function() {
    // Start test after JSESSIONID is cleared
    start();
  }));

  function start() {
    dwrEngine.setActiveReverseAjax(true);
    reverseAjaxSessionCreatedFunc = waitAsync(c, handleReply);
    Test.reverseAjaxCreateSessionFromWorkerThread("reverseAjaxSessionCreatedFunc");
  }

  function handleReply(status) {
    if (status.indexOf("ok") < 0) dwrunit.fail(status);
    c.complete();
    dwrEngine.setActiveReverseAjax(false);
  }
};

window.testIsolatedDwrSessionIdCookieAttributes = function() {
  deleteCookie("DWRSESSIONID", dwr.engine._contextPath);
  if (document.cookie.match("DWRSESSIONID=")) {
    dwrunit.fail("DWRSESSIONID cookie still set.");
    return;
  }
  dwr.engine._dwrSessionId = null;
  dwr.engine._scriptSessionId = "";
  var c = new dwrunit.ExplicitAsyncCompletor;
  dwr.engine.setCookieAttributes("expires=" + (new Date((new Date).getTime() + 3000)).toGMTString());
  Test.doNothing(waitAsync(c, function() {
    if (!document.cookie.match("DWRSESSIONID=")) dwrunit.fail("DWRSESSIONID cookie not set.");
    checkExpiry(10);
  }));
  function checkExpiry(tries) {
    if (!document.cookie.match("DWRSESSIONID=")) {
      end();
    } else if (tries == 0) {
      dwrunit.fail("DWRSESSIONID cookie not expired.");
      end();
    } else {
      setTimeout(waitAsync(c, function() {
        checkExpiry(tries - 1);
      }), 1000);
    }
  }
  function end() {
    c.complete();
    dwr.engine.setCookieAttributes("");
    deleteCookie("DWRSESSIONID", dwr.engine._contextPath);
    dwr.engine._dwrSessionId = null;
    dwr.engine._scriptSessionId = "";
  }
}
