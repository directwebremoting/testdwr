package org.testdwr.security;

public class CreatorMethodAccess
{
    boolean packageProtectedAccess() {
        return true;
    }
    
    private boolean privateAccess() {
        return true;
    }
    
    protected boolean protectedAccess() {
        return true;
    }
    
    public boolean publicAccess() {
        return true;
    }
}
