package org.testdwr.convert.generics;

import java.io.Serializable;

public class GenericSuperClass<T extends Serializable> {

    public GenericSuperClass() {}

    public T add(T obj) {
        return obj;
    }
}
