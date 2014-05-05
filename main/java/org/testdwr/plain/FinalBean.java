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

/**
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class FinalBean
{
    /**
     * @param string
     * @param integer
     * @param testBean
     */
    public FinalBean(int integer, boolean bool, String string, TestBean testBean)
    {
        this.integer = integer;
        this.bool = bool;
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
     * @return Returns the bool.
     */
    public boolean isBool()
    {
        return bool;
    }

    /**
     * @return Returns the string.
     */
    public String getString()
    {
        return string;
    }

    /**
     * @return Returns the testBean.
     */
    public TestBean getTestBean()
    {
        return testBean;
    }

    private final int integer;

    private final boolean bool;

    private final String string;

    private final TestBean testBean;
}
