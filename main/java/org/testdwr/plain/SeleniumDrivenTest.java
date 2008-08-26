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
package org.testdwr.plain;

import junit.framework.TestCase;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.thoughtworks.selenium.DefaultSelenium;
import com.thoughtworks.selenium.Selenium;

/**
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class SeleniumDrivenTest extends TestCase
{
    private static final String[] ONE_TO_FIVE = new String[] { "One", "Two", "Three", "Four", "Five" };

    private static final String[] EMPTY = new String[0];

    @Override
    protected void setUp() throws Exception
    {
        super.setUp();
        selenium = new DefaultSelenium("localhost", 4444, "*firefox", "http://localhost:8080");
        selenium.start();
    }

    @Override
    protected void tearDown() throws Exception
    {
        selenium.stop();
        super.tearDown();
    }

    /**
     * @throws Exception
     */
    public void testNew() throws Exception
    {
        selenium.open("http://localhost:8080/testdwr/test/dhtml.html");
        assertEquals(selenium.getSelectOptions("removeOptions"), ONE_TO_FIVE);

        selenium.click("//button[@onclick='testRemoveOptions();']");
        assertEquals(selenium.getSelectOptions("removeOptions"), EMPTY);
        assertEquals(selenium.getSelectOptions("testAddOptionsBasic"), EMPTY);

        selenium.click("//button[@onclick='testAddOptionsBasic();']");
        assertEquals(selenium.getSelectOptions("testAddOptionsBasic"), ONE_TO_FIVE);
        assertEquals(selenium.getSelectOptions("testAddOptionsObject1"), EMPTY);

        selenium.click("//button[@onclick='testAddOptionsObject1();']");
        assertEquals(selenium.getSelectOptions("testAddOptionsObject1"), ONE_TO_FIVE);
        assertEquals(selenium.getSelectOptions("testAddOptionsObject2"), EMPTY);

        selenium.click("//button[@onclick='testAddOptionsObject2();']");
        assertEquals(selenium.getSelectOptions("testAddOptionsObject2"), ONE_TO_FIVE);
    }

    private Selenium selenium;

    /**
     * The log stream
     */
    protected static final Log log = LogFactory.getLog(SeleniumDrivenTest.class);
}
