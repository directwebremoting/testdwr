
createTestGroup("DwrUtil");

/**
 * Test inspired by:
 * http://www.sixteensmallstones.org/ie-javascript-bugs-overriding-internet-explorers-documentgetelementbyid-to-be-w3c-compliant-exposes-an-additional-bug-in-getattributes
 */
window.testDwrUtilByIdAvoidNames = function() {
  useHtml(
    '<form name="byIdAvoidNamesForm">' +
    '  <input name="byIdAvoidNames">' +
    '  <input name="byIdAvoidNames2">' +
    '</form>' +
    '<span id="byIdAvoidNames"></span>'
  );
  
  var elem = dwr.util.byId('byIdAvoidNames');
  assertNotNull(elem);
  assertEqual("span", elem.tagName.toLowerCase());
  var elem2 = dwr.util.byId('byIdAvoidNames2');
  assertNull(elem2);
}

/**
 * Test inspired by:
 * http://www.sixteensmallstones.org/ie-javascript-bugs-overriding-internet-explorers-documentgetelementbyid-to-be-w3c-compliant-exposes-an-additional-bug-in-getattributes
 */
window.testDwrUtilByIdDontGetTrickedByFormIdElement = function() {
  useHtml(
    '<form id="byIdDontGetTrickedByFormIdElement">' +
    '  <input name="id" value="blabla">' +
    '</form>'
  );
  
  var elem = dwr.util.byId('byIdDontGetTrickedByFormIdElement');
  assertNotNull(elem);
  assertEqual("form", elem.tagName.toLowerCase());
}

/**
 * This is a really tricky test that is used to see if we workaround a bug in 
 * IE7 correctly. The IE7 bug concerns attributes (including ID) on cloned 
 * elements.
 */
window.testDwrUtilByIdShouldntTriggerIe7AttributesCloneBug = function() {
  useHtml(
    '<form name="byIdShouldntTriggerIe7AttributesCloneBug"></form>' +
    '<form name="byIdShouldntTriggerIe7AttributesCloneBug_2"></form>' +
    '<div id="byIdShouldntTriggerIe7AttributesCloneBug">blabla</div>'
  );
  
  var elem = dwr.util.byId('byIdShouldntTriggerIe7AttributesCloneBug');
  assertNotNull(elem);
  assertEqual(elem.tagName.toLowerCase(), "div");
  var clone = dwr.util.cloneNode(elem, {idSuffix:"_2"});
  var findclone = dwr.util.byId("byIdShouldntTriggerIe7AttributesCloneBug_2");
  assertNotNull(findclone);
  assertEqual(findclone.getAttribute("id"), "byIdShouldntTriggerIe7AttributesCloneBug_2")
  assertEqual(findclone.getAttributeNode("id").value, "byIdShouldntTriggerIe7AttributesCloneBug_2")
}

/**
 *
 */
window.testDwrUtilXss = function() {
  assertTrue(dwr.util.containsXssRiskyCharacters("dd<"));
  assertFalse(dwr.util.containsXssRiskyCharacters("dd"));
};

var arrayFive = [ 'One', 'Two', 'Three', 'Four', 'Five' ];
var arrayObject = [
  { name:'One', value:'1' },
  { name:'Two', value:'2' },
  { name:'Three', value:'3' },
  { name:'Four', value:'4' },
  { name:'Five', value:'5' }
];
var map = { one:1, two:2, three:3, four:4, five:5 };

/**
 * 
 */
window.testDwrUtilAddOptionsBasic = function() {
  useHtml('<select id="addOptionsBasic"> </select>');

  dwr.util.addOptions('addOptionsBasic', arrayFive);

  assertEqual("One", dwr.util.getValue('addOptionsBasic'));
  assertEqual("One", dwr.util.getText('addOptionsBasic'));
  assertTrue(dwr.util.byId('addOptionsBasic').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilRemoveAllOptions = function() {
  useHtml('<select id="removeAllOptions">' +
    '<option value="v1">One</option>' +
    '<option value="v2">Two</option>' +
    '<option value="v3">Three</option>' +
    '<option value="v4">Four</option>' +
    '<option value="v5">Five</option>' +
    '</select>');

  dwr.util.removeAllOptions('removeAllOptions');
  var value = dwr.util.getValue('removeAllOptions');
  // TODO: shouldn't this be better defined?
  assertTrue(value == null || value.length == 0);
  assertFalse(dwr.util.byId('removeAllOptions').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilAddOptionsObject1 = function() {
  useHtml('<select id="addOptionsObject1"> </select>');

  dwr.util.addOptions('addOptionsObject1', arrayObject, "name");

  assertEqual("One", dwr.util.getValue('addOptionsObject1'));
  assertEqual("One", dwr.util.getText('addOptionsObject1'));
  assertTrue(dwr.util.byId('addOptionsObject1').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilAddOptionsObject2 = function() {
  useHtml('<select id="addOptionsObject2"> </select>');

  dwr.util.addOptions('addOptionsObject2', arrayObject, "name", "value");

  assertEqual("One", dwr.util.getValue('addOptionsObject2'));
  assertEqual("1", dwr.util.getText('addOptionsObject2'));
  assertTrue(dwr.util.byId('addOptionsObject2').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilAddOptionsObject3 = function() {
  useHtml('<select id="addOptionsObject3"> </select>');

  dwr.util.addOptions('addOptionsObject3', arrayObject, "value");

  assertEqual("1", dwr.util.getValue('addOptionsObject3'));
  assertEqual("1", dwr.util.getText('addOptionsObject3'));
  assertTrue(dwr.util.byId('addOptionsObject3').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilAddOptionsObject4 = function() {
  useHtml('<select id="addOptionsObject4"> </select>');

  dwr.util.addOptions('addOptionsObject4', arrayObject, "value", "name");

  assertEqual("1", dwr.util.getValue('addOptionsObject4'));
  assertEqual("One", dwr.util.getText('addOptionsObject4'));
  assertTrue(dwr.util.byId('addOptionsObject4').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilAddOptionsMap1 = function() {
  useHtml('<select id="addOptionsMap1"> </select>');

  dwr.util.addOptions('addOptionsMap1', map);

  assertEqual("one", dwr.util.getValue('addOptionsMap1'));
  assertEqual("1", dwr.util.getText('addOptionsMap1'));
  assertTrue(dwr.util.byId('addOptionsMap1').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilAddOptionsMap2 = function() {
  useHtml('<select id="addOptionsMap2"> </select>');

  dwr.util.addOptions('addOptionsMap2', map, true);

  assertEqual("1", dwr.util.getValue('addOptionsMap2'));
  assertEqual("one", dwr.util.getText('addOptionsMap2'));
  assertTrue(dwr.util.byId('addOptionsMap2').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilAddOptionsInOtherWindow = function() {
  var pwin = window.open("about:blank");
  if (!pwin) throw new Error("Popup window needed for test was blocked.")
  function test() {
    try {
      var pdoc = pwin.document;
      pdoc.body.innerHTML = '<select id="sel"></select>';
      var sel = pdoc.getElementById("sel");

      dwr.util.addOptions(sel, arrayFive);

      assertEqual("One", dwr.util.getValue(sel));
      assertEqual("One", dwr.util.getText(sel));
      assertTrue(sel.innerHTML.match(/option/i));
    }
    finally {
      pwin.close();
    }
  }
  setTimeout(waitAsync(test), 1000);
};

/**
 * 
 */
window.testDwrUtilRemoveItems = function() {
  useHtml('<ul id="removeItems">' +
    '<li>One</li> <li>Two</li> <li>Three</li> <li>Four</li> <li>Five</li>' +
    '</ul>');

  dwr.util.removeAllOptions('removeItems');

  var value = dwr.util.getValue('removeItems');
  // TODO: shouldn't this be better defined?
  assertTrue(value == null || value.length == 0);
  assertFalse(dwr.util.byId('removeItems').innerHTML.match(/option/i));
};

/**
 * 
 */
window.testDwrUtilAddItemsBasic = function() {
  useHtml('<ul id="addItemsBasic"> </ul>');

  dwr.util.addOptions('addItemsBasic', arrayFive);

  var innerHtml = dwr.util.byId('addItemsBasic').innerHTML;
  assertTrue(innerHtml.match(/li/i));
  assertTrue(innerHtml.match(/One/));
  assertFalse(innerHtml.match(/1/));
};

/**
 * 
 */
window.testDwrUtilAddItemsObject1 = function() {
  useHtml('<ul id="addItemsObject1"> </ul>');

  dwr.util.addOptions('addItemsObject1', arrayObject, "name");

  var innerHtml = dwr.util.byId('addItemsObject1').innerHTML;
  assertTrue(innerHtml.match(/li/i));
  assertTrue(innerHtml.match(/One/));
  assertFalse(innerHtml.match(/1/));
};

/**
 * 
 */
window.testDwrUtilAddItemsObject2 = function() {
  useHtml('<ul id="addItemsObject2"> </ul>');

  dwr.util.addOptions('addItemsObject2', arrayObject, "name", "value");

  var innerHtml = dwr.util.byId('addItemsObject2').innerHTML;
  assertTrue(innerHtml.match(/li/i));
  assertTrue(innerHtml.match(/One/));
  assertFalse(innerHtml.match(/1/));
};

/**
 * 
 */
window.testDwrUtilAddItemsObject3 = function() {
  useHtml('<ul id="addItemsObject3"> </ul>');

  dwr.util.addOptions('addItemsObject3', arrayObject, "value");

  var innerHtml = dwr.util.byId('addItemsObject3').innerHTML;
  assertTrue(innerHtml.match(/li/i));
  assertFalse(innerHtml.match(/One/));
  assertTrue(innerHtml.match(/1/));
};

/**
 * 
 */
window.testDwrUtilAddItemsObject4 = function() {
  useHtml('<ul id="addItemsObject4"> </ul>');

  dwr.util.addOptions('addItemsObject4', arrayObject, "value", "name");

  var innerHtml = dwr.util.byId('addItemsObject4').innerHTML;
  assertTrue(innerHtml.match(/li/i));
  assertFalse(innerHtml.match(/One/));
  assertTrue(innerHtml.match(/1/));
};

/**
 * 
 */
window.testDwrUtilCloneNode1 = function() {
  useHtml('<div id="cloneNode1">' +
    '<ul id="cloneNode1Inner1">' +
    '<li>One</li><li>Two</li><li>Three</li><li>Four</li>' +
    '</ul>' +
    '<select id="cloneNode1Inner2">' +
    '<option value="v1">One</option><option value="v2">Two</option>' +
    '<option value="v3">Three</option><option value="v4">Four</option>' +
    '</select>' +
    '</div>');

  dwr.util.cloneNode('cloneNode1', { idPrefix:'pre', idSuffix:'suf' });
  dwr.util.byId("precloneNode1suf").style.backgroundColor = "#AFA";
  dwr.util.setValue("precloneNode1Inner2suf", "v2");
  var clonetext = dwr.util.getValue("precloneNode1Inner1suf", { textContent:true });

  // TODO: we need to assert more
  assertNotNull(dwr.util.byId('precloneNode1suf'));
  assertNotNull(dwr.util.byId('precloneNode1Inner2suf'));
  assertNotNull(dwr.util.byId('precloneNode1Inner1suf'));
};

/**
 * 
 */
window.testDwrUtilCloneNodeSetValues = function() {
  useHtml(
    '<table>' +
    '  <tr id="cloneNodeSetValues_row_" style="display:none;">' +
    '    <td id="cloneNodeSetValues_name_"></td>' +
    '    <td id="cloneNodeSetValues_age_"></td>' +
    '  </tr>' +
    '</table>'
  );

  var persons = [
    {name:"baby", age:1},
    {name:"java dev", age:35},
    {name:"senior", age:65}
  ];

  for(var i=0; i<persons.length; i++) {
    dwr.util.cloneNode("cloneNodeSetValues_row_", {idSuffix:i});
    assertNotNull(dwr.util.byId("cloneNodeSetValues_row_" + i));
    dwr.util.byId("cloneNodeSetValues_row_" + i).style.display = "";
    assertNotNull(dwr.util.byId("cloneNodeSetValues_name_" + i));
    assertNotNull(dwr.util.byId("cloneNodeSetValues_age_" + i));
    var p = persons[i];
    dwr.util.setValue("cloneNodeSetValues_name_"+i, p.name);
    assertEqual(dwr.util.getValue("cloneNodeSetValues_name_"+i), p.name);
    dwr.util.setValue("cloneNodeSetValues_age_"+i, p.age);
    assertEqual(dwr.util.getValue("cloneNodeSetValues_age_"+i), p.age);
  }
};

/**
 * 
 */
window.testDwrUtilAddRowsBasic = function() {
  useHtml('<table border="1" id="addRowsBasic"></table>');

  dwr.util.addRows('addRowsBasic', arrayFive, [
    function(data) { return data; },
    function(data) { return data.toUpperCase(); },
    function(data) {
      var input = document.createElement("input");
      input.setAttribute("type", "button");
      input.setAttribute("value", "DOM Test");
      return input;
    },
    function(data) { return "<input type='button' value='innerHTML Test'>"; }
  ], { escapeHtml:true });

  var innerHtml = dwr.util.byId('addRowsBasic').innerHTML;
  assertTrue(innerHtml.match(/One/));
  assertTrue(innerHtml.match(/ONE/));
  assertTrue(innerHtml.match(/td/i));
  assertTrue(innerHtml.match(/innerHTML Test/));
  assertTrue(innerHtml.match(/DOM Test/));
};

/**
 * 
 */
window.testDwrUtilIsArrayLike = function() {
  function testargs() {
    return dwr.util._isArrayLike(arguments);
  }
  assertTrue(dwr.util._isArrayLike([1, 2]));
  assertTrue(dwr.util._isArrayLike(document.getElementsByTagName("*")));
  assertTrue(testargs("a", "b"));
  assertFalse(dwr.util._isArrayLike({"0":"a", "1":"b", length:2}));
};

/**
 * 
 */
window.testDwrUtilToDescriptiveStringWithArrayLikeObjects = function() {
  function printargs() {
    return dwr.util.toDescriptiveString(arguments);
  }
  function hasSeveralArrayElementsInString(str) {
    return str.charAt(0) == "[" 
      && str.indexOf(",") >= 0;
  }
  assertTrue(hasSeveralArrayElementsInString(dwr.util.toDescriptiveString([1, 2])));
  assertTrue(hasSeveralArrayElementsInString(dwr.util.toDescriptiveString(document.getElementsByTagName("*"))));
  assertTrue(hasSeveralArrayElementsInString(printargs("a", "b")));
  assertFalse(hasSeveralArrayElementsInString(dwr.util.toDescriptiveString({"0":"a", "1":"b", length:2})));
};

