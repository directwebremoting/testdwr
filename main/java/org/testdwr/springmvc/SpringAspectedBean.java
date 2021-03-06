/*
 * Copyright 2008 DWR
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
package org.testdwr.springmvc;

import org.testdwr.springservlet.aop.Aspected;

/**
 * Tests AOP proxied beans.
 *
 * @author Jose Noheda [jose.noheda@gmail.com]
 *
 */
public class SpringAspectedBean implements RandomGenerator
{

    @Aspected
    public double random()
    {
        return Math.random()* 1024 * 1024;
    }

}
