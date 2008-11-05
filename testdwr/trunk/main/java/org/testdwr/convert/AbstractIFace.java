package org.testdwr.convert;

public abstract class AbstractIFace implements IFace
{

    private double fieldAbstract = 1.0;

    public String getFieldReadOnly()
    {
        return "readOnly";
    }

    public double getFieldAbstract()
    {
        return fieldAbstract;
    }

    public void setFieldAbstract(double fieldAbstract)
    {
        this.fieldAbstract = fieldAbstract;
    }

}
