/*
 * Copyright 2005 Joe Walker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.testdwr.fluent;

// import org.directwebremoting.fluent.FluentConfigurator;

/**
 * An equivalent of dwr.xml for demo purposes
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class DemoFluentConfigurator //extends FluentConfigurator
{
    /* (non-Javadoc)
     * @see org.directwebremoting.fluent.FluentConfigurator#configure()
     */
    public void configure()
    {
        /*
        withFilter("com.example.dwr.monitor.MonitoringAjaxFilter");
        withFilter("org.directwebremoting.filter.ExtraLatencyAjaxFilter")
            .addParam("delay", "200");

        // chat
        withCreator("new", "JavaChat")
            .addParam("scope", "application")
            .addParam("class", "com.example.dwr.chat.JavaChat");
        withConverter("bean", "com.example.dwr.chat.Message");


        // resources not in this war file: java.util.Date
        withCreator("new", "JDate")
            .addParam("scope", "session")
            .addParam("class", "java.util.Date")
            .exclude("getHours")
            .withAuth("getMinutes", "admin")
            .withAuth("getMinutes", "devel")
            .addFilter("com.example.dwr.filter.LoggingAjaxFilter");

        // this is a bad idea for live, but can be useful in testing
        withConverter("exception", "java.lang.Exception");
        withConverter("bean", "java.lang.StackTraceElement");
        */
    }
}
