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
 * @author Mike Wilson
 */
public class TestObject
{
    /**
     * 
     */
    public TestObject()
    {
    }

    /**
     * @param string
     * @param integer
     * @param testObj
     */
    public TestObject(int integer, String string, TestObject testObj)
    {
        this.string = string;
        this.integer = integer;
        this.testObj = testObj;
    }

    public String string = "Default initial value";

    public int integer = 0;

    public TestObject testObj = null;
}
