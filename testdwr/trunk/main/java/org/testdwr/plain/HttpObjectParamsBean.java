package org.testdwr.plain;

import java.util.Date;
import java.util.Map;

public class HttpObjectParamsBean {

	private int intValue;
	private String stringValue;
	private short[] shortArrayValue;
	private Date dateValue;
	Map<String, String> requestHeaderValue;
	/**
	 * @return the intValue
	 */
	public int getIntValue() {
		return intValue;
	}
	/**
	 * @param intValue the intValue to set
	 */
	public void setIntValue(int intValue) {
		this.intValue = intValue;
	}
	/**
	 * @return the stringValue
	 */
	public String getStringValue() {
		return stringValue;
	}
	/**
	 * @param stringValue the stringValue to set
	 */
	public void setStringValue(String stringValue) {
		this.stringValue = stringValue;
	}
	/**
	 * @return the shortArrayValue
	 */
	public short[] getShortArrayValue() {
		return shortArrayValue;
	}
	/**
	 * @param shortArrayValue the shortArrayValue to set
	 */
	public void setShortArrayValue(short[] shortArrayValue) {
		this.shortArrayValue = shortArrayValue;
	}
	/**
	 * @return the dateValue
	 */
	public Date getDateValue() {
		return dateValue;
	}
	/**
	 * @param dateValue the dateValue to set
	 */
	public void setDateValue(Date dateValue) {
		this.dateValue = dateValue;
	}
	/**
	 * @return the requestHeaderValue
	 */
	public Map<String, String> getRequestHeaderValue() {
		return requestHeaderValue;
	}
	/**
	 * @param requestHeaderValue the requestHeaderValue to set
	 */
	public void setRequestHeaderValue(Map<String, String> requestHeaderValue) {
		this.requestHeaderValue = requestHeaderValue;
	}
	
}
