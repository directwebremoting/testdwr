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

import java.lang.reflect.Method;

import org.directwebremoting.AjaxFilter;
import org.directwebremoting.AjaxFilterChain;

/**
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class Test2Filter implements AjaxFilter
{
    /* (non-Javadoc)
     * @see org.directwebremoting.AjaxFilter#doFilter(java.lang.Object, java.lang.reflect.Method, java.lang.Object[], org.directwebremoting.AjaxFilterChain)
     */
    public Object doFilter(Object obj, Method method, Object[] params, AjaxFilterChain chain) throws Exception
    {
        try
        {
            local.set(true);
            return chain.doFilter(obj, method, params);
        }
        finally
        {
            local.remove();
        }
    }

    /**
     * Is the current thread inside the doFilter method?
     */
    public static boolean isFiltered()
    {
        return local.get();
    }

    private static ThreadLocal<Boolean> local = new ThreadLocal<Boolean>();
}
