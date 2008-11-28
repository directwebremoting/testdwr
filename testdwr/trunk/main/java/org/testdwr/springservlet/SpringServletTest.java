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
package org.testdwr.springservlet;

import java.util.List;

import org.directwebremoting.Container;
import org.directwebremoting.ServerContext;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.dwrunit.Verify;
import org.directwebremoting.extend.InboundContext;
import org.directwebremoting.spring.SpringContainer;
import org.directwebremoting.util.VersionUtil;

/**
 * Methods to help unit test DWR that are configured by the SpringServlet.
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class SpringServletTest
{
    @SuppressWarnings("deprecation")
    public List<String> checkContext()
    {
        ServerContext serverContext = ServerContextFactory.get();
        Container container = serverContext.getContainer();
        Verify verify = new Verify();

        verify.equals("ContextPath", "/test-dwr", serverContext.getContextPath());
        verify.equals("Version", VersionUtil.getVersion(), serverContext.getVersion());
        verify.equals("Container.class", SpringContainer.class.getName(), container.getClass().getName());
        verify.equals("Container.getBean", "DwrSpringServlet", container.getBean("ContainerType"));

        return verify.getReport();
    }

    public String getPath()
    {
        return WebContextFactory.get().getContextPath();
    }

    public boolean areIdentical(List<?> a, List<?> b)
    {
        return a == b;
    }

    public SpringServletBean springServletBeanParam(SpringServletBean test)
    {
        return test;
    }

    public boolean booleanParam(boolean test)
    {
        return test;
    }

    public byte byteParam(byte test)
    {
        return test;
    }

    public char charParam(char test)
    {
        return test;
    }

    public short shortParam(short test)
    {
        return test;
    }

    public int intParam(int test)
    {
        return test;
    }

    public long longParam(long test)
    {
        return test;
    }

    public float floatParam(float test)
    {
        return test;
    }

    public double doubleParam(double test)
    {
        return test;
    }

    public String stringParam(String test)
    {
        return test;
    }

    public String delete()
    {
        return "You can't touch me";
    }

    protected String protectedMethod()
    {
        privateMethod();
        return "You can't touch me";
    }

    private String privateMethod()
    {
        return "You can't touch me";
    }

    public static String staticMethod()
    {
        return "static SpringServletTest.staticMethod() says hello.";
    }

    public String dangerOverload(String param1)
    {
        return "SpringServletTest.dangerOverload(" + param1 + ") says hello.";
    }

    public String dangerOverload()
    {
        return "SpringServletTest.dangerOverload() says hello.";
    }

    public String error(InboundContext cx)
    {
        return "You should not see this: " + cx;
    }
}
