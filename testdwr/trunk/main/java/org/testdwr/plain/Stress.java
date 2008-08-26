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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.ScriptSessions;

/**
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class Stress
{
    /**
     * 
     */
    public void setPublishing(boolean publishing)
    {
        this.publishing = publishing;

        if (publishing)
        {
            Thread worker = new Thread(new Runnable()
            {
                /* (non-Javadoc)
                 * @see java.lang.Runnable#run()
                 */
                public void run()
                {
                    try
                    {
                        log.debug("Stress: Starting server-side thread");
                        int pings = 0;

                        while (Stress.this.publishing)
                        {
                            ScriptSessions.addFunctionCall("serverPing", pings);

                            pings++;
                            Thread.sleep(delay);
                        }
                    }
                    catch (InterruptedException ex)
                    {
                        ex.printStackTrace();
                    }
                    finally
                    {
                        log.debug("Stress: Stopping server-side thread");
                    }
                }        
            });

            worker.start();
        }
    }

    /**
     * Accessor for the delay between server publishes
     * @param delay The new delay between server publishes
     */
    public void setHitDelay(int delay)
    {
        this.delay = delay;
    }

    /**
     * Are we in a server publish cycle
     */
    protected boolean publishing = false;

    /**
     * How long between server publishes
     */
    private int delay = 1000;

    /**
     * The log stream
     */
    private static final Log log = LogFactory.getLog(Stress.class);
}
