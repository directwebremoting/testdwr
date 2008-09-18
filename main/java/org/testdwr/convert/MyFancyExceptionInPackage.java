package org.testdwr.convert;

public class MyFancyExceptionInPackage extends Exception
{
    private int errorCode = -1;

    public MyFancyExceptionInPackage()
    {
    }

    public MyFancyExceptionInPackage(String message)
    {
        super(message);
    }

    public MyFancyExceptionInPackage(Throwable cause)
    {
        super(cause);
    }

    public MyFancyExceptionInPackage(String message, Throwable cause)
    {
        super(message, cause);
    }

    public int getErrorCode()
    {
        return errorCode;
    }

    public void setErrorCode(int errorCode)
    {
        this.errorCode = errorCode;
    }
}
