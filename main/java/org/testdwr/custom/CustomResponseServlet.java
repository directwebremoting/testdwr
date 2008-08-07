package org.testdwr.custom;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class CustomResponseServlet extends HttpServlet
{
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        super.doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        String pathInfo = request.getPathInfo();
        log.error(pathInfo);

        if ("500".equals(pathInfo))
        {
            response.sendError(500, "Eat my 500");
        }
        else
        {
            PrintWriter writer = response.getWriter();
            writer.append("Hello");
        }
    }

    /**
     * The log stream
     */
    private static final Log log = LogFactory.getLog(CustomResponseServlet.class);
}
