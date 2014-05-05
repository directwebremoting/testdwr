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

import java.util.List;

/**
 * @author Mike Wilson
 */
public class TestBeanWithList
{
    /**
     * 
     */
    public TestBeanWithList()
    {
    }

    /**
     * 
     */
    public TestBeanWithList(int integer, boolean bool, String string, TestBean testBean, List<TestBean> list)
    {
        this.integer = integer;
        this.bool = bool;
        this.string = string;
        this.testBean = testBean;
        this.list = list;
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

    /**
     * @return Returns the list.
     */
    public List<TestBean> getList()
    {
        return list;
    }

    /**
     * @param list The list to set.
     */
    public void setList(List<TestBean> list)
    {
        this.list = list;
    }

    private int integer = 0;

    private boolean bool = false;

    private String string = "Default initial value";

    private TestBean testBean = null;
    
    private List<TestBean> list = null;
}
