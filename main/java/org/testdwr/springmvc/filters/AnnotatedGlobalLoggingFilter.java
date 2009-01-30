package org.testdwr.springmvc.filters;

import java.lang.reflect.Method;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.AjaxFilter;
import org.directwebremoting.AjaxFilterChain;
import org.directwebremoting.annotations.GlobalFilter;
import org.directwebremoting.annotations.Param;

/**
 * An annotated global filter.
 *
 * @author Jose Noheda [jose.noheda at gmail]
 *
 */
@GlobalFilter(params = {@Param(name = "prefix", value = "dwr-test")})
public class AnnotatedGlobalLoggingFilter implements AjaxFilter
{

    private static Log logger =  LogFactory.getLog(AnnotatedGlobalLoggingFilter.class);

    public Object doFilter(Object obj, Method method, Object[] params, AjaxFilterChain chain) throws Exception
    {
        logger.info("Annotated global filter executed for [" + method + "] with prefix [" + prefix + "]");
        return chain.doFilter(obj, method, params);
    }

    public void setPrefix(String prefix)
    {
        this.prefix = prefix;
    }

    private String prefix;

}
