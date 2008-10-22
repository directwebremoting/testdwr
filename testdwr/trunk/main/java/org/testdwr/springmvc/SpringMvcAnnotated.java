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

import java.util.Locale;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;

/**
 * Tests annotated beans.
 *
 * @author Jose Noheda [jose.noheda@gmail.com]
 *
 */
@RemoteProxy
public class SpringMvcAnnotated
{

    private static Log logger =  LogFactory.getLog(SpringMvcAnnotated.class);

    @RemoteMethod
    public org.testdwr.springservlet.SpringServletBean echo(String something, final Locale locale)
    {
        final String response = "echoed by DWR Spring Mvc [" + something + "]";
        return new org.testdwr.springservlet.SpringServletBean()
        {{
            setName(response);
            setLocale(locale);
        }};
    }

}
