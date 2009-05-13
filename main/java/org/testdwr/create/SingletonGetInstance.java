package org.testdwr.create;

public class SingletonGetInstance
{
    private static SingletonGetInstance instance;

    private SingletonGetInstance() { }

    public static SingletonGetInstance getInstance()
    {
        if (instance == null)
        {
            synchronized (SingletonGetInstance.class)
            {
                if (instance == null)
                {
                    instance = new SingletonGetInstance();
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
