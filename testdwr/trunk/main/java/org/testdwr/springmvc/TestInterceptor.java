package org.testdwr.springmvc;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.ui.ModelMap;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.WebRequestInterceptor;

public class TestInterceptor implements WebRequestInterceptor
{

    private static Log logger =  LogFactory.getLog(TestInterceptor.class);

    public void afterCompletion(WebRequest arg0, Exception arg1) throws Exception
    {
        logger.debug("[afterCompletion] invoked on MVC interceptor");
    }

    public void postHandle(WebRequest arg0, ModelMap arg1) throws Exception
    {
        logger.debug("[postHandle] invoked on MVC interceptor");
    }

    public void preHandle(WebRequest arg0) throws Exception
    {
        logger.debug("[preHandle] invoked on MVC interceptor");
    }

}
