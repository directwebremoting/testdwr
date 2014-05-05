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

import java.io.Serializable;

/**
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class TestBean implements Serializable
{
    /**
     * 
     */
    public TestBean()
    {
    }

    /**
     * 
     */
    public TestBean(int integer, boolean bool, String string, TestBean testBean)
    {
        this.bool = bool;
        this.integer = integer;
        this.string = string;
        this.testBean = testBean;
    }

    /**
     * @return Returns the integer.
     */
    public int getInteger()
    {
        return integer;
    }

    /**
     * @param integer The integer to set.
     */
    public void setInteger(int integer)
    {
        this.integer = integer;
    }

    /**
     * @return Returns the bool.
     */
    public boolean isBool()
    {
        return bool;
    }

    /**
     * @param bool The bool to set.
     */
    public void setBool(boolean bool)
    {
        this.bool = bool;
    }

    /**
     * @return Returns the string.
     */
    public String getString()
    {
        return string;
    }

    /**
     * @param string The string to set.
     */
    public void setString(String string)
    {
        this.string = string;
    }

    /**
     * @return Returns the testBean.
     */
    public TestBean getTestBean()
    {
        return testBean;
    }

    /**
     * @param testBean The testBean to set.
     */
    public void setTestBean(TestBean testBean)
    {
        this.testBean = testBean;
    }

    private int integer = 0;

    private boolean bool = false;

    private String string = "Default initial value";

    private TestBean testBean = null;
}
