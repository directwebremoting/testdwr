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
package org.testdwr.custom;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.util.LocalUtil;

public class CustomResponseServlet extends HttpServlet
{
    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        this.doPost(request, response);
    }

    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        String pathInfo = request.getPathInfo();
        String homePage = request.getContextPath() + request.getServletPath() + "/";

        if (pathInfo == null)
        {
            response.sendRedirect(homePage);
            return;
        }

        if (pathInfo.matches("\\/[1-9][0-9][0-9]\\/?.*"))
        {
            String responseCodeStr = pathInfo.substring(1, 4);
            int responseCode = Integer.parseInt(responseCodeStr);

            String extra = "";
            if (pathInfo.length() == 4)
            {
                if (responseCode == HttpServletResponse.SC_TEMPORARY_REDIRECT)
                {
                    extra = homePage;
                }
            }
            else
            {
                if (pathInfo.charAt(4) != '/')
                {
                    response.sendError(404);
                }
                else
                {
                    extra = URLDecoder.decode(pathInfo.substring(5), "utf-8");
                    if (!extra.startsWith("http"))
                    {
                        extra = homePage;
                    }
                }
            }

            log.info("Sending " + responseCode + ":" + extra + "(" + pathInfo + ")");
            switch (responseCode)
            {
            case HttpServletResponse.SC_MULTIPLE_CHOICES:
            case HttpServletResponse.SC_MOVED_PERMANENTLY:
            case HttpServletResponse.SC_FOUND:
            case HttpServletResponse.SC_SEE_OTHER:
                response.setHeader("Location", "/" + extra);
                response.setStatus(responseCode);
                break;

            case HttpServletResponse.SC_TEMPORARY_REDIRECT:
                response.sendRedirect(extra);
                break;

            default:
                response.sendError(responseCode, "/" + extra);
                break;
            }
        }
        else
        {
            InputStream in = getClass().getResourceAsStream(RESOURCE_HELP);
            if (in == null)
            {
                log.error("Missing file " + RESOURCE_HELP);
                response.sendError(500, "Missing file " + RESOURCE_HELP);
            }
            else
            {
                response.setContentType("text/html");
                ServletOutputStream out = response.getOutputStream();
                LocalUtil.readFully(in, out);
            }
        }
    }

    private static final String RESOURCE_HELP = "/org/testdwr/custom/index.html";

    /**
     * The log stream
     */
    private static final Log log = LogFactory.getLog(CustomResponseServlet.class);
}
