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

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.Browser;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ScriptSessionFilter;
import org.directwebremoting.ScriptSessions;
import org.directwebremoting.ServerContext;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.WidenScope;
import org.directwebremoting.event.ScriptSessionBindingEvent;
import org.directwebremoting.event.ScriptSessionBindingListener;
import org.directwebremoting.extend.InboundContext;
import org.directwebremoting.io.FileTransfer;
import org.directwebremoting.io.JavascriptFunction;
import org.directwebremoting.ui.browser.Document;
import org.directwebremoting.ui.browser.Window;
import org.directwebremoting.util.ClasspathScanner;
import org.junit.runner.Description;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunListener;
import org.testdwr.convert.AbstractBase;
import org.testdwr.convert.ConcreteBBase;
import org.testdwr.convert.ConcreteCBase;
import org.testdwr.convert.ConcreteIFace;
import org.testdwr.convert.IFace;
import org.testdwr.convert.MyFancyException;
import org.testdwr.convert.MyFancyExceptionInPackage;
import org.testdwr.convert.MyUnmappedException;
import org.testdwr.convert.ObjectWithLightClassMapping;
import org.testdwr.convert.OnePackage;
import org.testdwr.convert.TwoPackages;
import org.testdwr.event.Test2ScriptSessionListener;
import org.testdwr.event.TestScriptSessionListener;
import org.xml.sax.SAXParseException;

/**
 * Methods to help unit test DWR.
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
@SuppressWarnings({"UnnecessaryFullyQualifiedName"})
public class Test
{
    public String getPath()
    {
        return WebContextFactory.get().getContextPath();
    }

    public void throwNPE()
    {
        // This is exported by dwr.xml
        throw new NullPointerException("NullPointerException");
    }

    public void throwNPE(String message)
    {
        // This is exported by dwr.xml
        throw new NullPointerException(message);
    }

    public void throwIAE()
    {
        // This is NOT exported by dwr.xml
        throw new IllegalArgumentException("IllegalArgumentException");
    }

    public void throwSPE() throws SAXParseException
    {
        // This is exported by dwr.xml as a result of it being a SAXException
        throw new SAXParseException("SAXParseException", "publicId", "systemId", 42, 24, new NullPointerException("NullPointerException"));
    }

    public int waitFor(int wait)
    {
        try
        {
            Thread.sleep(wait);
            return wait;
        }
        catch (InterruptedException ex)
        {
            return 0;
        }
    }

    public void slowAsync(final int wait, final String function)
    {
        WebContext context = WebContextFactory.get();
        final String sessionId = context.getScriptSession().getId();

        new Thread()
        {
            @Override
            public void run()
            {
                Browser.withSession(sessionId, new Runnable()
                {
                    public void run()
                    {
                        try
                        {
                            Thread.sleep(wait);
                            ScriptSessions.addFunctionCall(function);
                        }
                        catch (InterruptedException ex)
                        {
                        }
                    }
                });
            }
        }.start();
    }

    public void doNothing()
    {
    }

    public boolean areIdentical(List<String> a, List<String> b)
    {
        return a == b;
    }

    public ObjA getLooped()
    {
        ObjA objA = new ObjA();
        ObjB objB = new ObjB();
        objA.setObjB(objB);
        objB.setObjA(objA);
        return objA;
    }

    public ObjA testLooped(ObjA objA)
    {
        ObjA nestedA = objA.getObjB().getObjA();

        if (nestedA != objA)
        {
            throw new IllegalStateException("Non matching obja != obja.objb.obja");
        }

        if (nestedA.getObjB() != objA.getObjB())
        {
            throw new IllegalStateException("Non matching objb != objb.obja.objb");
        }

        return objA;
    }

    public void voidParam()
    {
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

    public boolean[] booleanArrayParam(boolean[] test)
    {
        return test;
    }

    public char[] charArrayParam(char[] test)
    {
        return test;
    }

    public byte[] byteArrayParam(byte[] test)
    {
        return test;
    }

    public short[] shortArrayParam(short[] test)
    {
        return test;
    }

    public int[] intArrayParam(int[] test)
    {
        return test;
    }

    public long[] longArrayParam(long[] test)
    {
        return test;
    }

    public float[] floatArrayParam(float[] test)
    {
        return test;
    }

    public double[] doubleArrayParam(double[] test)
    {
        return test;
    }

    public double[][] double2DArrayParam(double[][] test)
    {
        return test;
    }

    public double[][][] double3DArrayParam(double[][][] test)
    {
        return test;
    }

    public double[][][][] double4DArrayParam(double[][][][] test)
    {
        return test;
    }

    public double[][][][][] double5DArrayParam(double[][][][][] test)
    {
        return test;
    }

    public BigInteger bigIntegerParam(BigInteger test)
    {
        return test;
    }

    public BigDecimal bigDecimalParam(BigDecimal test)
    {
        return test;
    }

    public String[] stringArrayParam(String[] test)
    {
        return test;
    }

    public Collection<String> stringCollectionParam(Collection<String> test)
    {
        return test;
    }

    public LinkedList<String> stringLinkedListParam(LinkedList<String> test)
    {
        return test;
    }

    public ArrayList<String> stringArrayListParam(ArrayList<String> test)
    {
        return test;
    }

    public List<String> stringListParam(List<String> test)
    {
        return test;
    }

    public Set<String> stringSetParam(Set<String> test)
    {
        return test;
    }

    public org.dom4j.Element dom4jElementParam(org.dom4j.Element test)
    {
        return test;
    }

    public org.dom4j.Document dom4jDocumentParam(org.dom4j.Document test)
    {
        return test;
    }

    public nu.xom.Element xomElementParam(nu.xom.Element test)
    {
        return test;
    }

    public nu.xom.Document xomDocumentParam(nu.xom.Document test)
    {
        return test;
    }

    public org.jdom.Element jdomElementParam(org.jdom.Element test)
    {
        return test;
    }

    public org.jdom.Document jdomDocumentParam(org.jdom.Document test)
    {
        return test;
    }

    public org.w3c.dom.Element domElementParam(org.w3c.dom.Element test)
    {
        return test;
    }

    public org.w3c.dom.Document domDocumentParam(org.w3c.dom.Document test)
    {
        return test;
    }

    public Set<TestBean> testBeanSetParam(Set<TestBean> test)
    {
        if (test.size() > 1)
        {
            for (Iterator<TestBean> it = test.iterator(); it.hasNext();)
            {
                TestBean ele = it.next();
                TestBean ignore = ele;
                ele = ignore;
            }
        }

        return test;
    }

    public List<TestBean> testBeanListParam(List<TestBean> test)
    {
        if (test.size() > 1)
        {
            for (Iterator<TestBean> it = test.iterator(); it.hasNext();)
            {
                TestBean ele = it.next();
                TestBean ignore = ele;
                ele = ignore;
            }
        }

        return test;
    }

    @SuppressWarnings("unchecked")
    public List<?> untypedTestBeanListParam(List<?> test)
    {
        if (test.size() > 1)
        {
            for (Iterator<TestBean> it = (Iterator<TestBean>) test.iterator(); it.hasNext();)
            {
                TestBean ele = it.next();
                TestBean ignore = ele;
                ele = ignore;
            }
        }

        return test;
    }

    public HashSet<String> stringHashSetParam(HashSet<String> test)
    {
        return test;
    }

    public TreeSet<String> stringTreeSetParam(TreeSet<String> test)
    {
        return test;
    }

    public TestBean testBeanParam(TestBean test)
    {
        return test;
    }

    public Map<String, String> stringStringMapParam(Map<String, String> test)
    {
        return test;
    }

    public Map<Character, TestBean> charTestBeanMapParam(Map<Character, TestBean> test)
    {
        return test;
    }

    public Map<String, String> stringStringHashMapParam(HashMap<String, String> test)
    {
        return test;
    }

    public Map<String, String> stringStringTreeMapParam(TreeMap<String, String> test)
    {
        return test;
    }

    public TestBean[] testBeanArrayParam(TestBean[] test)
    {
        return test;
    }

    public FinalBean finalBeanParam(FinalBean test)
    {
        return test;
    }

    public FinalBean[] finalBeanArrayParam(FinalBean[] test)
    {
        return test;
    }

    public List<List<Map<String, TestBean>>> testComplex(List<List<Map<String, TestBean>>> test)
    {
        return test;
    }

    public FileTransfer binary(String text)
    {
        String html = "<html><body><p>" + text + "</p></body></html>";
        return new FileTransfer(null, "text/html", html.getBytes());
    }

    public TestBean inheritanceTest(int type)
    {
        switch (type)
        {
        case 0:
            return new TestBean();

        case 1:
            return new StaticInnerSubTestBean();

        case 2:
            return new InnerSubTestBean();

        case 3:
            return new TestBean() { };

        case 4:
            return (TestBean) Proxy.newProxyInstance(TestBean.class.getClassLoader(), new Class[] { TestBean.class }, new TestBeanInvocationHandler());

        default :
            throw new IllegalArgumentException("" + type);
        }
    }

    public String[] stringVarArgs(String... value)
    {
        return value;
    }

    public TestBean[] testBeanVarArgs(TestBean... value)
    {
        return value;
    }

    public class InnerSubTestBean extends TestBean
    {
    }

    public static class StaticInnerSubTestBean extends TestBean
    {
    }

    static class TestBeanInvocationHandler implements InvocationHandler
    {
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable
        {
            if ("getInteger".equals(method.getName()))
            {
                return 42;
            }

            if ("getString".equals(method.getName()))
            {
                return "Slartibartfast";
            }

            if ("equals".equals(method.getName()))
            {
                return equals(args[0]);
            }

            if ("hashCode".equals(method.getName()))
            {
                return hashCode();
            }

            log.error("Failed on method: " + method);
            return null;
        }
    }

    public Map<String, Comparable<?>> dateTest(Date client)
    {
        Date server = new Date();

        Map<String, Comparable<?>> reply = new HashMap<String, Comparable<?>>();

        reply.put("client-object", client);
        reply.put("client-string", client.toString());
        reply.put("server-object", server);
        reply.put("server-string", server.toString());

        return reply;
    }

    public Foo inheritanceFooTest(int type)
    {
        switch (type)
        {
        case 0:
            return new InnerFoo();

        case 1:
            return new Foo() { public String getString() { return "anon foo"; }};

        case 4:
            return (Foo) Proxy.newProxyInstance(Foo.class.getClassLoader(), new Class[] { Foo.class }, new TestBeanInvocationHandler());

        default :
            throw new IllegalArgumentException("" + type);
        }
    }

    public interface Foo
    {
        String getString();
    }

    public class InnerFoo implements Foo
    {
        public String getString() { return "inner foo"; }
    }

    public String httpServletRequestParam(HttpServletRequest req)
    {
        return req.getRemoteAddr();
    }

    @SuppressWarnings("unchecked")
    public Map<String, String> listParameters(HttpServletRequest request)
    {
        Map<String, String> reply = new HashMap<String, String>();

        Enumeration<String> names = request.getAttributeNames();
        while (names.hasMoreElements())
        {
            String name = names.nextElement();
            String value = request.getAttribute(name).toString();
            reply.put(name, value);
        }

        return reply;
    }

    @SuppressWarnings("unchecked")
    public Map<String, String> listHeaders(HttpServletRequest request)
    {
        Map<String, String> reply = new HashMap<String, String>();

        Enumeration<String> names = request.getHeaderNames();
        while (names.hasMoreElements())
        {
            String name = names.nextElement();
            Enumeration<String> values = request.getHeaders(name);
            StringBuilder value = new StringBuilder();
            while (values.hasMoreElements())
            {
                String single = values.nextElement();
                value.append(single);
                if (values.hasMoreElements())
                {
                    value.append(", ");
                }
            }

            reply.put(name, value.toString());
        }

        return reply;
    }

    public String httpObjectParams(HttpServletRequest req, int i, HttpServletResponse resp, String s, HttpSession session, short[] ss, ServletContext scx, Date d, ServletConfig scfg)
    {
        return req.getRemoteAddr() + i + resp.hashCode() + s + session.getId() + ss.length + scx.getMajorVersion() + d.getTime() + scfg.getServletName();
    }

    public TestBean[] getNestingTest()
    {
        TestBean a = new TestBean(0, "!\"$%^&*()_1", null);
        TestBean b = new TestBean(0, "!\"$%^&*()_2", a);
        TestBean c = new TestBean(0, "!\"$%^&*()_3", b);
        TestBean d = new TestBean(0, "!\"$%^&*()_4", c);

        TestBean[] reply = new TestBean[]
        {
            a, c, d, d,
        };

        return reply;
    }

    public String slowStringParam(String param, long delay) throws InterruptedException
    {
        log.debug("About to wait for: " + delay);
        synchronized (this)
        {
            wait(delay);
        }
        log.debug("Done waiting for: " + delay);

        return param;
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

    public AbstractBase[] downloadMapped()
    {
        return new AbstractBase[] { new ConcreteBBase(), new ConcreteCBase() };
    }

    public String uploadMapped(AbstractBase abstractBase)
    {
        if (abstractBase == null)
        {
            return "null";
        }
        return abstractBase.getClass().getName();
    }

    public String uploadMappedToUnmappedParamClass(Object unmappedBase)
    {
        if (unmappedBase == null)
        {
            return "null";
        }
        return unmappedBase.getClass().getName();
    }

    public ObjectWithLightClassMapping downloadLightlyMapped()
    {
        return new ObjectWithLightClassMapping();
    }

    public String uploadLightlyMapped(ObjectWithLightClassMapping lightObj)
    {
        if (lightObj == null)
        {
            return "null";
        }
        return lightObj.getClass().getName();
    }

    public ConcreteIFace readOnlyProperty()
    {
        return new ConcreteIFace() {{
            setI(10);
            setFieldAbstract(5.0);
        }};
    }

    public void throwMapped() throws MyFancyException
    {
        throw new MyFancyException("fancy");
    }

    public void throwUnmapped() throws MyUnmappedException
    {
        throw new MyUnmappedException("unmapped");
    }

    public String uploadInterface(IFace impl)
    {
        if (impl == null)
        {
            return "null";
        }
        return impl.getClass().getName();
    }

    public OnePackage package1(OnePackage obj)
    {
        obj.i++;
        return obj;
    }

    public TwoPackages package2(TwoPackages obj)
    {
        obj.i++;
        return obj;
    }

    public void packagedException() throws MyFancyExceptionInPackage
    {
        throw new MyFancyExceptionInPackage("fancy");
    }

    public String serverChecks()
    {
        ScriptSession scriptSession = WebContextFactory.get().getScriptSession();
        scriptSession.invalidate();

        if (scriptSession.isInvalidated())
        {
            return "invalidateMe() succeeded";
        }
        else
        {
            return "invalidateMe() failed";
        }
    }

    public String setValue(String elementId, String value)
    {
        ScriptSessions.addFunctionCall("dwr.util.setValue", elementId, value);
        return value;
    }

    public void setCookie(String name, String value)
    {
        Document.setCookie(name, value);
    }

    public List<String> checkScriptSessionBindingListener()
    {
        final AtomicInteger bound = new AtomicInteger();
        final AtomicInteger unbound = new AtomicInteger();

        ScriptSession session = WebContextFactory.get().getScriptSession();
        ScriptSessionBindingListener listener = new ScriptSessionBindingListener()
        {
            /* (non-Javadoc)
             * @see org.directwebremoting.event.ScriptSessionBindingListener#valueBound(org.directwebremoting.event.ScriptSessionBindingEvent)
             */
            public void valueBound(ScriptSessionBindingEvent event)
            {
                bound.addAndGet(1);
            }

            /* (non-Javadoc)
             * @see org.directwebremoting.event.ScriptSessionBindingListener#valueUnbound(org.directwebremoting.event.ScriptSessionBindingEvent)
             */
            public void valueUnbound(ScriptSessionBindingEvent event)
            {
                unbound.addAndGet(1);
            }
        };

        Verify verify = new Verify();
        verify.equals("Start, bound", bound.get(), 0);
        verify.equals("Start, unbound", unbound.get(), 0);

        session.setAttribute("test", listener);
        verify.equals("After set, bound", bound.get(), 1);
        verify.equals("After set, unbound", unbound.get(), 0);

        session.setAttribute("irrelevant", 0);
        verify.equals("After set, bound", bound.get(), 1);
        verify.equals("After set, unbound", unbound.get(), 0);

        session.removeAttribute("test");
        verify.equals("After set, bound", bound.get(), 1);
        verify.equals("After set, unbound", unbound.get(), 1);

        return verify.getReport();
    }
    
    public List<String> checkScriptSessionListener(final JavascriptFunction progress1, final JavascriptFunction progress2)
    {
        final ServerContext serverContext = ServerContextFactory.get();
        final String testPage = serverContext.getContextPath() + "/checkSession.html";

        Verify verify = new Verify();

        final int createdBefore = TestScriptSessionListener.created;
        final int createdBefore2 = Test2ScriptSessionListener.created;
        final int destroyedBefore = TestScriptSessionListener.destroyed;
        final int destroyedBefore2 = Test2ScriptSessionListener.destroyed;

        // At least one test window is open ...
        verify.isTrue("createdBefore > 0", createdBefore > 0);
        verify.isTrue("createdBefore2 > 0", createdBefore2 > 0);

        // Open a new window
        Window.open(testPage, "checkSession");

        // We'll fill these in in the first cron, and use them in the second
        final AtomicInteger createdMid = new AtomicInteger();
        final AtomicInteger createdMid2 = new AtomicInteger();
        final AtomicInteger destroyedMid = new AtomicInteger();
        final AtomicInteger destroyedMid2 = new AtomicInteger();

        // Give it a second to open, check counters and close it
        ScheduledThreadPoolExecutor executorService = serverContext.getContainer().getBean(ScheduledThreadPoolExecutor.class);
        executorService.schedule(new Runnable()
        {
            public void run()
            {
                createdMid.set(TestScriptSessionListener.created);
                createdMid2.set(Test2ScriptSessionListener.created);
                destroyedMid.set(TestScriptSessionListener.destroyed);
                destroyedMid2.set(Test2ScriptSessionListener.destroyed);

                Verify verify1 = new Verify();
                verify1.isTrue("createdMid > createdBefore", createdMid.intValue() > createdBefore);
                verify1.isTrue("createdMid2 > createdBefore2", createdMid2.intValue() > createdBefore2);
                verify1.equals("destroyedMid == destroyedBefore", destroyedMid.intValue(), destroyedBefore);
                verify1.equals("destroyedMid2 == destroyedBefore2", destroyedMid2.intValue(), destroyedBefore2);

                // Find it and close it
                Browser.withPage(testPage, new Runnable()
                {
                    public void run()
                    {
                        Window.close();
                    }
                });
                progress1.executeAndClose(verify1.getReport());
            }
        }, 1, TimeUnit.SECONDS);

        // Give it 2 seconds to open and be closed then check counters again
        executorService.schedule(new Runnable()
        {
            public void run()
            {
                int createdAfter = TestScriptSessionListener.created;
                int createdAfter2 = Test2ScriptSessionListener.created;
                int destroyedAfter = TestScriptSessionListener.destroyed;
                int destroyedAfter2 = Test2ScriptSessionListener.destroyed;

                Verify verify2 = new Verify();
                verify2.equals("createdAfter == createdMid", createdAfter, createdMid.intValue());
                verify2.equals("createdAfter2 == createdMid2", createdAfter2, createdMid2.intValue());
                verify2.isTrue("destroyedAfter > destroyedMid", destroyedAfter > destroyedMid.intValue());
                verify2.isTrue("destroyedAfter2 > destroyedMid2", destroyedAfter2 > destroyedMid2.intValue());

                progress2.executeAndClose(verify2.getReport());
            }
        }, 2, TimeUnit.SECONDS);

        return verify.getReport();
    }

    public List<String> checkImHere()
    {
        final String attributeName = "attr:" + System.currentTimeMillis();
        final Verify verify = new Verify();

        WebContext webContext = WebContextFactory.get();
        ScriptSession scriptSession = webContext.getScriptSession();
        scriptSession.setAttribute(attributeName, true);

        ScriptSessionFilter filter = new TestScriptSessionFilter(attributeName);
        String page = webContext.getCurrentPage();

        Browser.withPage(page, new FilterCheckSingle("withPage:Auto", attributeName, verify));
        Browser.withAllSessions(new FilterCheckSingle("withAllSessions:Auto", attributeName, verify));
        Browser.withCurrentPage(new FilterCheckSingle("withCurrentPage:Auto", attributeName, verify));
        Browser.withSession(scriptSession.getId(), new FilterCheckSingle("withSession:Auto", attributeName, verify));

        Browser.withPageFiltered(page, filter, new CheckSingle("withPageFiltered:Auto", verify));
        Browser.withAllSessionsFiltered(filter, new CheckSingle("withAllSessionsFiltered:Auto", verify));
        Browser.withCurrentPageFiltered(filter, new CheckSingle("withCurrentPageFiltered:Auto", verify));
/*
        ServerContext serverContext = ServerContextFactory.get();
        log.debug("** Testing Browser against local context: " + serverContext);

        Browser.withPage(serverContext, page, new FilterCheckSingle("withPage:Context", attributeName, verify));
        Browser.withAllSessions(serverContext, new FilterCheckSingle("withAllSessions:Context", attributeName, verify));
        Browser.withSession(serverContext, scriptSession.getId(), new FilterCheckSingle("withSession:Context", attributeName, verify));

        Browser.withPageFiltered(serverContext, page, filter, new CheckSingle("withPageFiltered:Context", verify));
        Browser.withAllSessionsFiltered(serverContext, filter, new CheckSingle("withAllSessionsFiltered:Context", verify));

        Collection<ServerContext> contexts = StartupUtil.getAllServerContexts();
        for (ServerContext otherContext : contexts)
        {
            if (otherContext.getServletConfig().equals(serverContext.getServletConfig()))
            {
                log.debug("** Skipping current config: " + otherContext);
                continue;
            }

            log.debug("** Testing Browser against other context: " + otherContext);

            Browser.withPage(otherContext, page, new FilterCheckNone("withPage:Other", attributeName, verify));
            Browser.withAllSessions(otherContext, new FilterCheckNone("withAllSessions:Other", attributeName, verify));
            Browser.withSession(otherContext, scriptSession.getId(), new FilterCheckNone("withSession:Other", attributeName, verify));

            Browser.withPageFiltered(otherContext, page, filter, new CheckNone("withPageFiltered:Other", verify));
        }
*/
        return verify.getReport();
    }

    public List<String> variousChecks()
    {
        Verify verify = new Verify();

        if (!Test1Filter.isFiltered())
        {
            verify.fail("Missing Test1Filter (should be global in dwr.xml)");
        }

        if (!Test2Filter.isFiltered())
        {
            verify.fail("Missing Test2Filter (should be local to Test in dwr.xml)");
        }

        return verify.getReport();
    }

    protected class FilterCheckSingle implements Runnable
    {
        protected FilterCheckSingle(String context, String attributeName, Verify verify)
        {
            this.context = context;
            this.attributeName = attributeName;
            this.verify = verify;
        }

        /* (non-Javadoc)
         * @see java.lang.Runnable#run()
         */
        public void run()
        {
            int found = 0;
            Collection<ScriptSession> sessions = WidenScope.browserGetTargetSessions();
            for (ScriptSession session : sessions)
            {
                Object check = session.getAttribute(attributeName);
                if (check != null && check.equals(Boolean.TRUE))
                {
                    found++;
                }
            }
            verify.equals(context, found, 1);
        }

        private String context;
        private String attributeName;
        private Verify verify;
    }

    protected class TestScriptSessionFilter implements ScriptSessionFilter
    {
        public TestScriptSessionFilter(String attributeName)
        {
            this.attributeName = attributeName;
        }

        /* (non-Javadoc)
         * @see org.directwebremoting.ScriptSessionFilter#match(org.directwebremoting.ScriptSession)
         */
        public boolean match(ScriptSession session)
        {
            Object check = session.getAttribute(attributeName);
            return (check != null && check.equals(Boolean.TRUE));
        }

        private String attributeName;
    }

    protected class CheckSingle implements Runnable
    {
        protected CheckSingle(String context, Verify verify)
        {
            this.context = context;
            this.verify = verify;
        }

        /* (non-Javadoc)
         * @see java.lang.Runnable#run()
         */
        public void run()
        {
            Collection<ScriptSession> sessions = WidenScope.browserGetTargetSessions();
            verify.equals(context, sessions.size(), 1);
        }

        private String context;
        private Verify verify;
    }

    protected class FilterCheckNone implements Runnable
    {
        protected FilterCheckNone(String context, String attributeName, Verify verify)
        {
            this.context = context;
            this.attributeName = attributeName;
            this.verify = verify;
        }

        /* (non-Javadoc)
         * @see java.lang.Runnable#run()
         */
        public void run()
        {
            int found = 0;
            Collection<ScriptSession> sessions = WidenScope.browserGetTargetSessions();
            for (ScriptSession session : sessions)
            {
                Object check = session.getAttribute(attributeName);
                if (check != null && check.equals(Boolean.TRUE))
                {
                    found++;
                }
            }
            verify.equals(context, found, 0);
        }

        private String context;
        private String attributeName;
        private Verify verify;
    }

    protected class CheckNone implements Runnable
    {
        protected CheckNone(String context, Verify verify)
        {
            this.context = context;
            this.verify = verify;
        }

        /* (non-Javadoc)
         * @see java.lang.Runnable#run()
         */
        public void run()
        {
            Collection<ScriptSession> sessions = WidenScope.browserGetTargetSessions();
            verify.equals(context, sessions.size(), 0);
        }

        private String context;
        private Verify verify;
    }

    /**
     * JUnit test runner!
     */
    public List<String> runAllJUnitTests(final JavascriptFunction noteProgressInScratch)
    {
        ClasspathScanner scanner = new ClasspathScanner("org.directwebremoting", true);
        Set<String> classNames = scanner.getClasses();
        Set<Class<?>> tests = new HashSet<Class<?>>();

        for (Iterator<String> it = classNames.iterator(); it.hasNext();)
        {
            String className = it.next();

            if (className.endsWith("Test"))
            {
                try
                {
                    Class<?> type = Class.forName(className);
                    tests.add(type);
                }
                catch (ClassNotFoundException ex)
                {
                    // ignore
                }
            }
        }

        JUnitCore core = new JUnitCore();
        core.addListener(new RunListener()
        {
            int completed = 0;
            int failures = 0;

            @Override
            public void testFailure(Failure failure) throws Exception
            {
                failures++;
            }

            @Override
            public void testFinished(Description description) throws Exception
            {
                completed++;
                noteProgressInScratch.execute();
            }
        });

        Class<?>[] testArray = tests.toArray(new Class<?>[tests.size()]);
        Result results = core.run(testArray);

        Verify verify = new Verify();
        for (Failure failure : results.getFailures())
        {
            verify.fail("Desc: " + failure.getDescription() +
                        "Header: " + failure.getTestHeader() +
                        "Message: " + failure.getMessage());
        }

        return verify.getReport();
    }

    /**
     * The log stream
     */
    protected static final Log log = LogFactory.getLog(Test.class);
}
