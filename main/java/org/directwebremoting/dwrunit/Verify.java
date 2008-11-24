/*
 * Copyright 2005 Joe Walker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.directwebremoting.dwrunit;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Verify is like {@link org.junit.Assert} except that it doesn't throw and
 * isn't static, and records failures locally.
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class Verify
{
    /**
     * Get the list of errors that we have accumulated as a String report.
     */
    public List<String> getReport()
    {
        List<String> reply = new ArrayList<String>();
        reply.addAll(errors);
        return reply;
    }

    /**
     * Asserts that a condition is true. If it isn't it throws an
     * {@link AssertionError} with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param condition condition to be checked
     */
    public void isTrue(String message, boolean condition)
    {
        if (!condition)
        {
            fail(message);
        }
    }

    /**
     * Asserts that a condition is false. If it isn't it throws an
     * {@link AssertionError} with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param condition condition to be checked
     */
    public void isFalse(String message, boolean condition)
    {
        isTrue(message, !condition);
    }

    /**
     * Fails a test with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @see AssertionError
     */
    public void fail(String message)
    {
        errors.add(message);
        log.error(message);
    }

    /**
     * Asserts that two objects are equal. If they are not, an {@link AssertionError}
     * is thrown with the given message. If <code>expected</code> and <code>actual</code>
     * are <code>null</code>, they are considered equal.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expected expected value
     * @param actual actual value
     */
    public void equals(String message, Object expected, Object actual)
    {
        if (expected == null && actual == null)
        {
            return;
        }
        if (expected != null && isEquals(expected, actual))
        {
            return;
        }
        else if (expected instanceof String && actual instanceof String)
        {
            fail((message == null ? "" : message) + " Expected:" + expected + " Actual:" + actual);
        }
        else
        {
            failNotEquals(message, expected, actual);
        }
    }

    private boolean isEquals(Object expected, Object actual)
    {
        return expected.equals(actual);
    }

    /**
     * Asserts that two object arrays are equal. If they are not, an
     * {@link AssertionError} is thrown with the given message. If <code>expecteds</code> and
     *  <code>actuals</code> are <code>null</code>, they are considered equal.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expecteds Object array or array of arrays (multi-dimensional array) with expected values.
     * @param actuals Object array or array of arrays (multi-dimensional array) with actual values
     */
    public void arrayEquals(String message, Object[] expecteds, Object[] actuals)
    {
        internalArrayEquals(message, expecteds, actuals);
    }

    /**
     * Asserts that two byte arrays are equal. If they are not, an
     * {@link AssertionError} is thrown with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expecteds byte array with expected values.
     * @param actuals byte array with actual values
     */
    public void arrayEquals(String message, byte[] expecteds, byte[] actuals)
    {
        internalArrayEquals(message, expecteds, actuals);
    }

    /**
     * Asserts that two char arrays are equal. If they are not, an
     * {@link AssertionError} is thrown with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expecteds char array with expected values.
     * @param actuals char array with actual values
     */
    public void arrayEquals(String message, char[] expecteds, char[] actuals)
    {
        internalArrayEquals(message, expecteds, actuals);
    }

    /**
     * Asserts that two short arrays are equal. If they are not, an
     * {@link AssertionError} is thrown with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expecteds short array with expected values.
     * @param actuals short array with actual values
     */
    public void arrayEquals(String message, short[] expecteds, short[] actuals)
    {
        internalArrayEquals(message, expecteds, actuals);
    }

    /**
     * Asserts that two int arrays are equal. If they are not, an
     * {@link AssertionError} is thrown with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expecteds int array with expected values.
     * @param actuals int array with actual values
     */
    public void arrayEquals(String message, int[] expecteds, int[] actuals)
    {
        internalArrayEquals(message, expecteds, actuals);
    }

    /**
     * Asserts that two long arrays are equal. If they are not, an
     * {@link AssertionError} is thrown with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expecteds long array with expected values.
     * @param actuals long array with actual values
     */
    public void arrayEquals(String message, long[] expecteds, long[] actuals)
    {
        internalArrayEquals(message, expecteds, actuals);
    }

    /**
     * Asserts that two object arrays are equal. If they are not, an
     * {@link AssertionError} is thrown with the given message. If <code>expecteds</code> and
     *  <code>actuals</code> are <code>null</code>, they are considered equal.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expecteds Object array or array of arrays (multi-dimensional array) with expected values.
     * @param actuals Object array or array of arrays (multi-dimensional array) with actual values
     */
    private void internalArrayEquals(String message, Object expecteds, Object actuals)
    {
        if (expecteds == actuals)
        {
            return;
        }

        String header = message == null ? "" : message + ": ";
        if (expecteds == null)
        {
            fail(header + "expected array was null");
            return;
        }

        if (actuals == null)
        {
            fail(header + "actual array was null");
            return;
        }

        int actualsLength = Array.getLength(actuals);
        int expectedsLength = Array.getLength(expecteds);
        if (actualsLength != expectedsLength)
        {
            fail(header + "array lengths differed, expected.length=" + expectedsLength + " actual.length=" + actualsLength);
            return;
        }

        for (int i = 0; i < expectedsLength; i++)
        {
            Object expected = Array.get(expecteds, i);
            Object actual = Array.get(actuals, i);

            if (isArray(expected) && isArray(actual))
            {
                internalArrayEquals(message, expected, actual);
            }
            else
            {
                equals(message, expected, actual);
            }
        }
    }

    private boolean isArray(Object expected)
    {
        return expected != null && expected.getClass().isArray();
    }

    /**
     * Asserts that two doubles or floats are equal to within a positive delta. If they
     * are not, an {@link AssertionError} is thrown with the given message. If the
     * expected value is infinity then the delta value is ignored. NaNs are
     * considered equal:
     * <code>assertEquals(Double.NaN, Double.NaN, *)</code> passes
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expected expected value
     * @param actual the value to check against <code>expected</code>
     * @param delta the maximum delta between <code>expected</code> and <code>actual</code> for which
     * both numbers are still considered equal.
     */
    public void equals(String message, double expected, double actual, double delta)
    {
        if (Double.compare(expected, actual) == 0)
        {
            return;
        }
        if (!(Math.abs(expected - actual) <= delta))
        {
            failNotEquals(message, new Double(expected), new Double(actual));
        }
    }

    public void equals(String message, long expected, long actual)
    {
        equals(message, (Long) expected, (Long) actual);
    }

    /**
     * Asserts that an object isn't null. If it is an {@link AssertionError} is
     * thrown with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param object Object to check or <code>null</code>
     */
    public void isNotNull(String message, Object object)
    {
        isTrue(message, object != null);
    }

    /**
     * Asserts that an object is null. If it is not, an {@link AssertionError} is
     * thrown with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param object Object to check or <code>null</code>
     */
    public void isNull(String message, Object object)
    {
        isTrue(message, object == null);
    }

    /**
     * Asserts that two objects refer to the same object. If they are not, an
     * {@link AssertionError} is thrown with the given message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param expected the expected object
     * @param actual the object to compare to <code>expected</code>
     */
    public void same(String message, Object expected, Object actual)
    {
        if (expected == actual)
        {
            return;
        }
        failNotSame(message, expected, actual);
    }

    /**
     * Asserts that two objects do not refer to the same object. If they do
     * refer to the same object, an {@link AssertionError} is thrown with the given
     * message.
     * @param message the identifying message or <code>null</code> for the {@link AssertionError}
     * @param unexpected the object you don't expect
     * @param actual the object to compare to <code>unexpected</code>
     */
    public void notSame(String message, Object unexpected, Object actual)
    {
        if (unexpected == actual)
        {
            failSame(message);
        }
    }

    private void failSame(String message)
    {
        String formatted = "";
        if (message != null)
        {
            formatted = message + " ";
        }
        fail(formatted + "expected not same");
    }

    private void failNotSame(String message, Object expected, Object actual)
    {
        String formatted = "";
        if (message != null)
        {
            formatted = message + " ";
        }
        fail(formatted + "expected same:<" + expected + "> was not:<" + actual + ">");
    }

    private void failNotEquals(String message, Object expected, Object actual)
    {
        fail(format(message, expected, actual));
    }

    String format(String message, Object expected, Object actual)
    {
        String formatted = "";
        if (message != null && !message.equals(""))
        {
            formatted = message + " ";
        }
        String expectedString = String.valueOf(expected);
        String actualString = String.valueOf(actual);
        if (expectedString.equals(actualString))
        {
            return formatted + "expected: " + expected.getClass().getName() + "<" + expectedString + "> but was: " + actual.getClass().getName() + "<" + actualString + ">";
        }
        else
        {
            return formatted + "expected:<" + expectedString + "> but was:<" + actualString + ">";
        }
    }

    /**
     * Where we record failures
     */
    private List<String> errors = new ArrayList<String>();

    /**
     * The log stream
     */
    private static final Log log = LogFactory.getLog(Verify.class);
}
