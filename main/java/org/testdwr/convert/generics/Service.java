package org.testdwr.convert.generics;

public interface Service<T extends Command>
{

    Object execute(T command);

}
