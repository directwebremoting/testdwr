package org.testdwr.create;

public class SingletonCustomMethodName
{
    private static SingletonCustomMethodName instance;

    private SingletonCustomMethodName() { }

    public static SingletonCustomMethodName getCustomInstance()
    {
        if (instance == null)
        {
            synchronized (SingletonCustomMethodName.class)
            {
                if (instance == null)
                {
                    instance = new SingletonCustomMethodName();
                }
            }
        }
        return instance;
    }
    
    public String allowed() {
        return "SUCCESS";
    }
    
    public String disallowed() {
        return "NOT ALLOWED";
    }
}
