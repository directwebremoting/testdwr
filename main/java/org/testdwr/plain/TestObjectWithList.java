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
public class TestObjectWithList
{
    /**
     * 
     */
    public TestObjectWithList()
    {
    }

    /**
     * 
     */
    public TestObjectWithList(int integer, boolean bool, String string, TestObject testObj, List<TestObject> list)
    {
        this.integer = integer;
        this.bool = bool;
        this.string = string;
        this.testObj = testObj;
        this.list = list;
    }

    public int integer = 0;

    public boolean bool = false;

    public String string = "Default initial value";

    public TestObject testObj = null;

    public List<TestObject> list = null;
}
