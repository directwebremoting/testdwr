package org.testdwr.springmvc.generics;

import java.util.List;

import org.testdwr.springmvc.model.SpringMvcAnnotatedBean;

public interface GenericProxy
{

    List<SpringMvcAnnotatedBean> convert(int aux, List<SpringMvcAnnotatedBean> beans);

}
