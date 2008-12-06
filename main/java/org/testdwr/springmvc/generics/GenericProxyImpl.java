package org.testdwr.springmvc.generics;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.testdwr.springmvc.SpringLazyBean;
import org.testdwr.springmvc.model.SpringMvcAnnotatedBean;
import org.testdwr.springservlet.aop.OtherAspected;

@RemoteProxy(name = "GenericProxy")
public class GenericProxyImpl implements GenericProxy
{

    private static Log logger =  LogFactory.getLog(SpringLazyBean.class);

    @OtherAspected
    @RemoteMethod
    public List<SpringMvcAnnotatedBean> convert(int aux, List<SpringMvcAnnotatedBean> beans)
    {
        logger.debug("Converted [" + beans.size() + "] element from generic signature");
        return beans;
    }

}
