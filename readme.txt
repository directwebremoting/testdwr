
This project is something of a work in progress. The final goal is to have an
ant based set of tests that will automatically run multiple servlet engines
and browsers and configurations, collating the results.

I currently use the eclipse testdwr-jetty target, periodically updating the
dwr.jar file using 'ant update-dwr'.

Other parts of the ant build script download and start Jetty and Tomcat although
this isn't linked into the in browser test suite properly yet.
