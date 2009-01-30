package org.testdwr.springmvc.filters;

import java.lang.reflect.Method;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.AjaxFilter;
import org.directwebremoting.AjaxFilterChain;

/**
 * An annotated global filter.
 *
 * @author Jose Noheda [jose.noheda at gmail]
 *
 */
public class GlobalLoggingFilter implements AjaxFilter
{

    private static Log logger =  LogFactory.getLog(GlobalLoggingFilter.class);

    public Object doFilter(Object obj, Method method, Object[] params, AjaxFilterChain chain) throws Exception
    {
        logger.info("Global filter executed for [" + method + "] with params [" + params + "] and test value [" + test + "]");
        return chain.doFilter(obj, method, params);
    }

    private String test = "no!";

    /**
     * @param test the test to set
     */
    public void setTest(String test)
    {
        this.test = test;
    }

}
