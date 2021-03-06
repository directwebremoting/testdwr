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
import org.directwebremoting.util.CopyUtils;

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

        // Redirect from root dir without trailing slash to with trailing slash
        if (pathInfo == null)
        {
            response.sendRedirect(homePage);
            return;
        }
        // Send home page
        else if (pathInfo.equals("/") || pathInfo.startsWith("/page")) {
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
                CopyUtils.copy(in, out);
            }
        } 
        // Send empty page
        else if (pathInfo.startsWith("/empty")) {
            response.setContentType("text/html");
        }
        // Handle redirects
        else if (pathInfo.matches("\\/redirect\\/[1-9][0-9][0-9]\\/.*"))
        {
            String responseCodeStr = pathInfo.substring(10, 10+3);
            int responseCode = Integer.parseInt(responseCodeStr);
            String redirectPath = URLDecoder.decode(pathInfo.substring(13), "utf-8");
            redirectPath = request.getContextPath() + request.getServletPath() + redirectPath;

            log.info("Sending " + responseCode + ":" + redirectPath + "(" + pathInfo + ")");
            switch (responseCode)
            {
            case HttpServletResponse.SC_MULTIPLE_CHOICES:
            case HttpServletResponse.SC_MOVED_PERMANENTLY:
            case HttpServletResponse.SC_FOUND:
            case HttpServletResponse.SC_SEE_OTHER:
                response.setHeader("Location", "/" + redirectPath);
                response.setStatus(responseCode);
                break;

            case HttpServletResponse.SC_TEMPORARY_REDIRECT:
                response.sendRedirect(redirectPath);
                break;

            default:
                response.sendError(responseCode, "/" + redirectPath);
                break;
            }
        }
        // Send 404
        else {
            response.sendError(404);
        }
    }

    /**
     * 
     */
    private static final String RESOURCE_HELP = "/org/testdwr/custom/index.html";

    /**
     * The log stream
     */
    private static final Log log = LogFactory.getLog(CustomResponseServlet.class);
}
