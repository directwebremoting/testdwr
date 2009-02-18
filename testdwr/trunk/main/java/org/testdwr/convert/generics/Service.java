package org.testdwr.convert.generics;

public interface Service<E extends Command, T extends Command>
{

    Object execute(int i, Double d, E command, T other);

}
