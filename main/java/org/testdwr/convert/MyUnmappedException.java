package org.testdwr.convert;

public class MyUnmappedException extends Exception
{
    private int errorCode = -1;

    public MyUnmappedException()
    {
    }

    public MyUnmappedException(String message)
    {
        super(message);
    }

    public MyUnmappedException(Throwable cause)
    {
        super(cause);
    }

    public MyUnmappedException(String message, Throwable cause)
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
