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
package org.testdwr.event;

import org.directwebremoting.event.ScriptSessionEvent;
import org.directwebremoting.event.ScriptSessionListener;

/**
 * Testing creating ScriptSessionListener
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class TestScriptSessionListener implements ScriptSessionListener
{
    /* (non-Javadoc)
     * @see org.directwebremoting.event.ScriptSessionListener#sessionCreated(org.directwebremoting.event.ScriptSessionEvent)
     */
    public void sessionCreated(ScriptSessionEvent ev)
    {
        created++;
    }

    /* (non-Javadoc)
     * @see org.directwebremoting.event.ScriptSessionListener#sessionDestroyed(org.directwebremoting.event.ScriptSessionEvent)
     */
    public void sessionDestroyed(ScriptSessionEvent ev)
    {
        destroyed++;
    }

    public static int created = 0;
    public static int destroyed = 0;
}
