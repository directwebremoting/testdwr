package org.directwebremoting.impl;

import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.Container;
import org.directwebremoting.ServerContext;
import org.directwebremoting.extend.ScriptSessionManager;

public class ImplWidenScope
{
    public static void defaultScriptSessionManagerDebug()
    {
        log.info("DWR DEBUG inspecting " + StartupUtil.getAllServerContexts().size() + " ServerContexts");

        for (ServerContext serverContext : StartupUtil.getAllServerContexts())
        {
            log.info("- For ServerContext deployed to " + serverContext.getContextPath() + " - " + serverContext.toString());

            // Debug the Container
            Container container = serverContext.getContainer();
            log.info("  - Container: " + container);
            log.info("    - Container.getBeanNames.size() = " + container.getBeanNames().size());
            if (container.getClass() != DefaultContainer.class)
            {
                log.info("    - Container implementation class: " + container.getClass().getName());
            }

            // Debug the UrlProcessor
            /*
            UrlProcessor urlProcessor = container.getBean(UrlProcessor.class);
            log.info("  - UrlProcessor: " + urlProcessor);
            log.info("    - UrlProcessor.urlMapping has " + urlProcessor.urlMapping.size() + " entries");
            for (Map.Entry<String, DefaultScriptSession> entry : urlProcessor.urlMapping.entrySet())
            {
                DefaultScriptSession scriptSession = entry.getValue();
                log.info("    - " + scriptSession.getDebugName() + " on " + scriptSession.getPage());
            }
            */

            // Debug the ScriptSessionManager
            ScriptSessionManager sessionManager = container.getBean(ScriptSessionManager.class);
            log.info("  - ScriptSessionManager: " + sessionManager);
            if (sessionManager instanceof DefaultScriptSessionManager)
            {
                DefaultScriptSessionManager dssm = (DefaultScriptSessionManager) sessionManager;

                log.info("    - DefaultScriptSessionManager.sessionMap has " + dssm.sessionMap.size() + " entries");
                for (Map.Entry<String, DefaultScriptSession> entry : dssm.sessionMap.entrySet())
                {
                    DefaultScriptSession scriptSession = entry.getValue();
                    log.info("    - " + scriptSession.getDebugName() + " on " + scriptSession.getPage());
                }

                log.info("    - DefaultScriptSessionManager.pageSessionMap has " + dssm.pageSessionMap.size() + " pages");
                for (Entry<String, Set<DefaultScriptSession>> entry : dssm.pageSessionMap.entrySet())
                {
                    Set<DefaultScriptSession> sessions = entry.getValue();
                    log.info("      - " + entry.getKey() + " has " + sessions.size() + " entries");

                    for (DefaultScriptSession scriptSession : sessions)
                    {
                        log.info("        - " + scriptSession.getDebugName() + " on " + scriptSession.getPage());
                    }
                }

                log.info("    - DefaultScriptSessionManager.sessionXRef has " + dssm.sessionXRef.size() + " entries");
                for (Entry<String, Set<String>> entry : dssm.sessionXRef.entrySet())
                {
                    Set<String> sessions = entry.getValue();
                    log.info("      - " + entry.getKey() + " has " + sessions.size() + " entries");

                    for (String value : sessions)
                    {
                        log.info("        - " + value);
                    }
                }
            }
            else
            {
                log.info("    - ScriptSessionManager implementation class: " + sessionManager.getClass().getName());
            }
        }
    }

    /**
     * The log stream
     */
    private static final Log log = LogFactory.getLog(ImplWidenScope.class);
}
