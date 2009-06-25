package org.testdwr.plain;

public class TestSingleton
{
    private static TestSingleton instance;

    private TestSingleton()
    {
    }

    public static TestSingleton getInstance()
    {
        if (instance == null)
        {
            synchronized (TestSingleton.class)
            {
                if (instance == null)
                {
                    instance = new TestSingleton();
                }
            }
        }
        return instance;
    }

    public String method1()
    {
        return "SUCCESS";
    }
}
