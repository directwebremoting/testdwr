package org.testdwr.convert;

public class MyFancyException extends Exception
{
    private int errorCode = -1;

    public MyFancyException()
    {
    }

    public MyFancyException(String message)
    {
        super(message);
    }

    public MyFancyException(Throwable cause)
    {
        super(cause);
    }

    public MyFancyException(String message, Throwable cause)
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
