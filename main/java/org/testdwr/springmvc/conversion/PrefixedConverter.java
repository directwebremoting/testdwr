/*
 * Copyright 2008 DWR
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
package org.testdwr.springmvc.conversion;

import org.directwebremoting.ConversionException;
import org.directwebremoting.extend.Converter;
import org.directwebremoting.extend.ConverterManager;
import org.directwebremoting.extend.InboundVariable;
import org.directwebremoting.extend.NonNestedOutboundVariable;
import org.directwebremoting.extend.OutboundContext;
import org.directwebremoting.extend.OutboundVariable;

/**
 * Tests Spring bean converters.
 *
 * @author Jose Noheda [jose.noheda@gmail.com]
 */
public class PrefixedConverter implements Converter
{

    private String prefix;

    public void setPrefix(String prefix)
    {
        this.prefix = prefix;
    }

    public Object convertInbound(Class<?> paramType, InboundVariable data) throws ConversionException
    {
        return null;
    }

    public OutboundVariable convertOutbound(Object data, OutboundContext outctx) throws ConversionException
    {
        return new NonNestedOutboundVariable("'" + prefix + ((SimpleBean) data).getData() + "'");
    }

    public void setConverterManager(ConverterManager converterManager)
    {
        return;
    }

}
