package org.testdwr.convert.generics;

import java.lang.reflect.Method;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ConcreteService implements Service<ConcreteCommand, ConcreteCommand>
{

    private static Log logger =  LogFactory.getLog(ConcreteService.class);

    public Object execute(int i, Double d, ConcreteCommand command, ConcreteCommand other)
    {
        for (Method m : getClass().getMethods())
            if (m.toString().contains("execute"))
                logger.debug("Found generic method: " +  m);
        return 1;
    }

}
