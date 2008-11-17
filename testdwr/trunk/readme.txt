
Project Status
--------------
This project is something of a work in progress. The final goal is to have an
ant based set of tests that will automatically run multiple servlet engines
and browsers and configurations, collating the results.

I currently use the eclipse testdwr-jetty target, periodically updating the
dwr.jar file using 'ant update-dwr'.

Other parts of the ant build script download and start Jetty and Tomcat although
this isn't linked into the in browser test suite properly yet.

Writing Tests
-------------
Step 1.
Ensure that you can run the test suite as is.

Step 2 (optional).
Create a Java function to be called by your Javascript test. If you will be
creating a set of tests then it might be worth adding a new class or even a new
package. The default location for tests is currently:
- main/java/org/directwebremoting/plain/Test.java
Although this may need to be split soon.

Step 3.
Create some test function to exercise the client/server. The tests are located
in main/web/test*.js

If you need to create a new group of tests, create a new file called
main/web/testGroupName.js, and begin it by calling createTestGroup("GroupName");

You should then add functions to this file like this:

window.testGroupNameTestName = function() {
  // test goes here
};

The "window.testGroupNameTestName = function" format is needed because IE
doesn't pick-up functions as members of the window object if they are declared
using the more normal "function testGroupNameTestName() { ...}" syntax.

DwrTest defines all the usual assert*() functions which stop tests executing
and verify*() which just log the failure and carry on.
In addition you can use the useHtml(htmlString) function that inserts your HTML
into a space on the page reserved for your test.

It is common for DWR testing to require some asynchronous element, so we need
a way to associate delayed passes/failures with the test that caused pass/fail.
- createDelayed(function) can be used in this way. For example:
    window.testGroupTimeout = function() {
      var a = 6;
      window.setTimeout(createDelayed(function() {
        assertTrue(a, 5); // Delayed error will go against testGroupTimeout
      }), 1000);
    }
  It could be used with a DWR proxied class 'Remote' as follows:
    window.testGroupRemote1 = function() {
      Remote.getData(createDelayed(function(data) {
        assertTrue(data, "expected");
      }), 1000);
    }
- createDelayedError() is useful when you wish to know if some error handler
  is called. In the above case, if Remote.getData() causes an exception then
  DwrUnit will not be able to associate the error with testGroupRemote1. You can
  therefore do this:
    Remote.getData({
      callback: createDelayed(function(data) {
        assertTrue(data, "expected");
      }),
      exceptionHandler:createDelayedError()
    });
- createOptions() The scenario above is so common that there is a shortcut:
    Remote.getData(createOptions(function(data) {
      assertTrue(data, "expected");
    }));

