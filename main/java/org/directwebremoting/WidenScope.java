package org.directwebremoting;

import java.util.Collection;

public class WidenScope
{
    public static Collection<ScriptSession> browserGetTargetSessions()
    {
        return Browser.getTargetSessions();
    }
}
