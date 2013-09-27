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

import java.io.IOException;
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

import junit.framework.Assert;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.Browser;
import org.directwebremoting.Container;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ScriptSessionFilter;
import org.directwebremoting.ScriptSessions;
import org.directwebremoting.ServerContext;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.dwrunit.Verify;
import org.directwebremoting.event.ScriptSessionBindingEvent;
import org.directwebremoting.event.ScriptSessionBindingListener;
import org.directwebremoting.extend.InboundContext;
import org.directwebremoting.impl.DefaultContainer;
import org.directwebremoting.impl.ImplWidenScope;
import org.directwebremoting.io.FileTransfer;
import org.directwebremoting.io.JavascriptFunction;
import org.directwebremoting.ui.browser.Document;
import org.directwebremoting.ui.browser.Window;
import org.directwebremoting.util.ClasspathScanner;
import org.directwebremoting.util.VersionUtil;
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
import org.testdwr.convert.OnePackageObject;
import org.testdwr.convert.StrangeNameObject;
import org.testdwr.convert.StrangeNameWithPackageObject;
import org.testdwr.convert.TwoPackagesObject;
import org.testdwr.convert.wildcards.flat.WildcardObjectContainer;
import org.testdwr.convert.wildcards.recursive.WildcardRecursiveObjectContainer;
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
    public Verify checkContext(String contextPath)
    {
        ServerContext serverContext = ServerContextFactory.get();
        Container container = serverContext.getContainer();
        Verify verify = new Verify();

        verify.equals("ContextPath", contextPath, serverContext.getContextPath());
        verify.equals("Version", VersionUtil.getLabel(), serverContext.getVersion());
        verify.equals("Container.class", DefaultContainer.class.getName(), container.getClass().getName());
        verify.equals("Container.getBean", "DwrServlet", container.getBean("ContainerType"));

        return verify;
    }

    public void debug()
    {
        ImplWidenScope.defaultScriptSessionManagerDebug();
    }

    public String getPath()
    {
        return WebContextFactory.get().getContextPath();
    }

    public void throwNPE()
    {
        // This is exported by dwr.xml
        throw new NullPointerException("No message for NPE");
    }

    public void throwNPE(String message)
    {
        // This is exported by dwr.xml
        throw new NullPointerException(message);
    }

    public void throwIAE()
    {
        // This is NOT exported by dwr.xml
        throw new IllegalArgumentException("No message for IAE");
    }

    public void throwIAE(String message)
    {
        // This is NOT exported by dwr.xml
        throw new IllegalArgumentException(message);
    }

    public void throwSPE() throws SAXParseException
    {
        // This is exported by dwr.xml as a result of it being a SAXException
        throw new SAXParseException("No message for SPE", "publicId", "systemId", 42, 24, new NullPointerException("No message for NPE"));
    }

    public void throwSPE(String messageSpe, String messageNpe) throws SAXParseException
    {
        // This is exported by dwr.xml as a result of it being a SAXException
        throw new SAXParseException(messageSpe, "publicId", "systemId", 42, 24, new NullPointerException(messageNpe));
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
    
    public String[] stringArrayParam(String[] test)
    {
        return test;
    }

    public String[][] string2DArrayParam(String[][] test)
    {
        return test;
    }

    public String[][][] string3DArrayParam(String[][][] test)
    {
        return test;
    }

    public String[][][][] string4DArrayParam(String[][][][] test)
    {
        return test;
    }

    public String[][][][][] string5DArrayParam(String[][][][][] test)
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

    public String testEmptyListParams(List<String> list1, List<String> list2)
    {
        if (list1 == list2) 
        {
            try
            {
                list1.add("new item");
                return "error: same lists and modifiable";
            }
            catch(RuntimeException ex)
            {
                return "same lists but unmodifiable";
            }
        }
        else
        {
            return "different lists";
        }
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

    public TestBeanWithList testBeanWithListParam(TestBeanWithList test)
    {
        if (test.getList().size() > 1)
        {
            for (Iterator<TestBean> it = test.getList().iterator(); it.hasNext();)
            {
                TestBean ele = it.next();
                TestBean ignore = ele;
                ele = ignore;
            }
        }

        return test;
    }

    public List<TestObject> testObjectListParam(List<TestObject> test)
    {
        if (test.size() > 1)
        {
            for (Iterator<TestObject> it = test.iterator(); it.hasNext();)
            {
                TestObject ele = it.next();
                TestObject ignore = ele;
                ele = ignore;
            }
        }

        return test;
    }

    public TestObjectWithList testObjectWithListParam(TestObjectWithList test)
    {
        if (test.list.size() > 1)
        {
            for (Iterator<TestObject> it = test.list.iterator(); it.hasNext();)
            {
                TestObject ele = it.next();
                TestObject ignore = ele;
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
    
    public List<TestBean> testBeanListReturn()
    {
        List<TestBean> testBeanList = new ArrayList<TestBean>();
        TestBean childTestBean = new TestBean(1, "ChildTestBean", null);
        TestBean testBean = new TestBean(1, "TestBean", childTestBean);
        testBeanList.add(testBean);        
        testBeanList.add(testBean);
        return testBeanList;
    }
    
    public List<TestBean> testBeanListReturnForJSONP() {
        List<TestBean> testBeanList = testBeanListReturn();
        // Add the bean to the list again, to test that DWR does not create references for JSON.
        testBeanList.add(testBeanList.get(0));
        return testBeanList;
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

    public Map<String, Boolean> stringBooleanMapParam(Map<String, Boolean> map) 
    {
        return map;
    }
    
    public Map<String, String> stringStringMapParam(Map<String, String> test)
    {
        return test;
    }

    public Map<String, String[]> stringArrayMapParam(Map<String, String[]> test)
    {
        return test;
    }
    
    public Map<String, TestBean[]> stringBeanArrayMapParam(Map<String, TestBean[]> test)
    {
        return test;
    } 
   
    public Map<Character, TestBean> charTestBeanMapParam(Map<Character, TestBean> test)
    {
        return test;
    }

    public Map<Object, Boolean> nullKeyMap()
    {
        Map<Object, Boolean> map = new HashMap<Object, Boolean>();
        map.put(null, true);
        return map;
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
    
    public TestBean[] testStringBeanVarArgs(String value, TestBean... testBean) {
    	return testBean;
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

    public HttpObjectParamsBean httpObjectParams(HttpServletRequest req, int i, HttpServletResponse resp, String s, HttpSession session, short[] ss, ServletContext scx, Date d, ServletConfig scfg)
    {
        HttpObjectParamsBean httpObjectParamsBean = new HttpObjectParamsBean();
        httpObjectParamsBean.setIntValue(i);
        httpObjectParamsBean.setStringValue(s);
        httpObjectParamsBean.setShortArrayValue(ss);
        httpObjectParamsBean.setDateValue(d);
    	httpObjectParamsBean.setRequestHeaderValue(listParameters(req));
    	return httpObjectParamsBean;
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

    public String dangerOverload(String param1, int param2)
    {
        return param1 + "," + param2;
    }
    
    public String dangerOverload(String param1)
    {
        return param1;
    }

    public String dangerOverload()
    {
        return "hello";
    }
    
    public String dangerOverload(@SuppressWarnings("unused") String[] params) 
    {
        return "helloarray";        
    }
    
    public String dangerOverload(@SuppressWarnings("unused") TestBean test) 
    {
        return "hellotestbean";        
    }
    
    public int dangerOverload(int param1)
    {
        return param1;
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
        ObjectWithLightClassMapping lightObj = new ObjectWithLightClassMapping();
        lightObj.obj = new ObjectWithLightClassMapping();
        lightObj.array = new ObjectWithLightClassMapping[] { new ObjectWithLightClassMapping() };
        return lightObj;
    }

    public boolean uploadLightlyMapped(ObjectWithLightClassMapping lightObj)
    {
        Assert.assertSame(lightObj.getClass(), ObjectWithLightClassMapping.class);
        Assert.assertSame(lightObj.obj.getClass(), ObjectWithLightClassMapping.class);
        Assert.assertSame(lightObj.array[0].getClass(), ObjectWithLightClassMapping.class);
        return true;
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

    public OnePackageObject package1(OnePackageObject obj)
    {
        obj.i++;
        return obj;
    }

    public TwoPackagesObject package2(TwoPackagesObject obj)
    {
        obj.i++;
        return obj;
    }

    public void packagedException() throws MyFancyExceptionInPackage
    {
        throw new MyFancyExceptionInPackage("fancy");
    }

    public WildcardObjectContainer flatWildcardObjects(WildcardObjectContainer in)
    {
        return in;
    }
    
    public WildcardRecursiveObjectContainer recursiveWildcardObjects(WildcardRecursiveObjectContainer in)
    {
        return in;
    }

    public StrangeNameObject strangeName(StrangeNameObject obj)
    {
        obj.i++;
        return obj;
    }

    public StrangeNameWithPackageObject strangeNameWithPackage(StrangeNameWithPackageObject obj)
    {
        obj.i++;
        return obj;
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

    public Verify checkScriptSessionBindingListener()
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

        return verify;
    }
    
    public Verify checkScriptSessionListener(final JavascriptFunction progress1, final JavascriptFunction progress2)
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
                progress1.executeAndClose(verify1);
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

                progress2.executeAndClose(verify2);
            }
        }, 2, TimeUnit.SECONDS);

        return verify;
    }

    public Verify variousChecks()
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

        return verify;
    }
     
    public void testRedirectResponse(HttpServletResponse response) throws IOException 
    {
    	response.setStatus(302);
    }
    
    public Verify checkImHere()
    {
        WebContext webContext = WebContextFactory.get();
        ScriptSession scriptSession = webContext.getScriptSession();

        String attributeName = "attr:" + scriptSession.getId().substring(0, 4) + ":" + scriptSession.getPage();
        Verify verify = new Verify();

        scriptSession.setAttribute(attributeName, true);

        ScriptSessionFilter filter = new TestScriptSessionFilter(attributeName);
        String page = webContext.getCurrentPage();

        Browser.withPage(page, new CheckCount(1, attributeName, false, "withPage", verify));
        Browser.withAllSessions(new CheckCount(1, attributeName, false, "withAllSessions", verify));
        Browser.withCurrentPage(new CheckCount(1, attributeName, false, "withCurrentPage", verify));
        Browser.withSession(scriptSession.getId(), new CheckCount(1, attributeName, false, "withSession", verify));

        Browser.withPageFiltered(page, filter, new CheckCount(1, attributeName, true, "withPageFiltered", verify));
        Browser.withAllSessionsFiltered(filter, new CheckCount(1, attributeName, true, "withAllSessionsFiltered", verify));
        Browser.withCurrentPageFiltered(filter, new CheckCount(1, attributeName, true, "withCurrentPageFiltered", verify));

        ServerContext serverContext = ServerContextFactory.get();
        log.debug("** Testing Browser against local context: " + serverContext);

        Browser.withPage(serverContext, page, new CheckCount(1, attributeName, false, "withPage+Context", verify));
        Browser.withAllSessions(serverContext, new CheckCount(1, attributeName, false, "withAllSessions+Context", verify));
        Browser.withSession(serverContext, scriptSession.getId(), new CheckCount(1, attributeName, false, "withSession+Context", verify));

        Browser.withPageFiltered(serverContext, page, filter, new CheckCount(1, attributeName, true, "withPageFiltered+Context", verify));
        Browser.withAllSessionsFiltered(serverContext, filter, new CheckCount(1, attributeName, true, "withAllSessionsFiltered+Context", verify));

        /*
        // Using a single page talking to multiple DWR servlets is not supported
        Collection<ServerContext> contexts = StartupUtil.getAllServerContexts();
        for (ServerContext otherContext : contexts)
        {
            if (otherContext.getServletConfig().equals(serverContext.getServletConfig()))
            {
                log.debug("** Skipping current config: " + otherContext);
                continue;
            }

            log.debug("** Testing Browser against other context: " + otherContext);

            Browser.withPage(otherContext, page, new CheckCount(0, attributeName, false, "withPage+Other", verify));
            Browser.withAllSessions(otherContext, new CheckCount(0, attributeName, false, "withAllSessions+Other", verify));
            Browser.withSession(otherContext, scriptSession.getId(), new CheckCount(0, attributeName, false, "withSession+Other", verify));

            Browser.withPageFiltered(otherContext, page, filter, new CheckCount(0, attributeName, true, "withPageFiltered+Other", verify));
        }
        */
        return verify;
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
    
    /**
     * A checker that ensures there are a given number of matching sessions
     */
    protected class CheckCount implements Runnable
    {
        /**
         * Ctor if we wish to filter by attributeName
         */
        protected CheckCount(int expected, String attributeName, boolean filtered, String debugMsg, Verify verify)
        {
            this.expected = expected;
            this.attributeName = attributeName;
            this.filtered = filtered;
            this.debugMsg = debugMsg;
            this.verify = verify;
        }

        /* (non-Javadoc)
         * @see java.lang.Runnable#run()
         */
        public void run()
        {
            Collection<ScriptSession> sessions = Browser.getTargetSessions();
            if (filtered)
            {
                verify.equals(debugMsg + "+WrongCount", expected, sessions.size());

                for (ScriptSession session : sessions)
                {
                    verify.isNotNull(debugMsg + "+NoAttr+" + session, session.getAttribute(attributeName));
                }
            }
            else
            {
                int found = 0;
                for (ScriptSession session : sessions)
                {
                    Object check = session.getAttribute(attributeName);
                    if (check != null)
                    {
                        found++;
                    }
                }
                verify.equals(debugMsg, expected, found);
            }
        }

        private final int expected;
        private final String attributeName;
        private final boolean filtered;
        private final String debugMsg;
        private final Verify verify;
    }

    /**
     * JUnit test runner!
     */
    public Verify runAllJUnitTests(final JavascriptFunction noteProgressInScratch)
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

        return verify;
    }
   
    /**
     * The log stream
     */
    protected static final Log log = LogFactory.getLog(Test.class);
}
