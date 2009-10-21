
createTestGroup("Marshall");

window.testMarshallComplexNull = function() {
  Test.testComplex(createOptions(function (data) {
    verifyNull(data);
  }));
};

window.testMarshallComplex = function() {
  Test.testComplex([], createOptions(function (data) {
    verifyEqual(data, []);
  }));
  Test.testComplex([[]], createOptions(function (data) {
    verifyEqual(data, [[]]);
  }));
  Test.testComplex([[], []], createOptions(function (data) {
    verifyEqual(data, [[], []]);
  }));
  Test.testComplex([[{}]], createOptions(function (data) {
    verifyEqual(data, [[{}]]);
  }));
  Test.testComplex([[{}], [{}]], createOptions(function (data) {
    verifyEqual(data, [[{}], [{}]]);
  }));
  Test.testComplex([[{"a":nested}]], createOptions(function (data) {
    verifyEqual(data, [[{"a":nested}]]);
  }));
};

window.testMarshallComplexDeep = function() {
  Test.testComplex([[{}, {}], [{}, {}]], createOptions(function (data) {
    verifyEqual(data, [[{}, {}], [{}, {}]]);
  }));
  Test.testComplex([[{}, {"a":nested}], [{"b":nested}, {"a":nested, "c":nested}]], createOptions(function (data) {
    verifyEqual(data, [[{}, {"a":nested}], [{"b":nested}, {"a":nested, "c":nested}]]);
  }));
};

window.testMarshallOverloaded = function() {
	  Test.dangerOverload("param1", 1, createOptions(function (data) {
	    verifyEqual(data, "param1,1");
	  }));
	  Test.dangerOverload("param1", createOptions(function (data) {
	    verifyEqual(data, "param1");
	  }));
	  Test.dangerOverload(createOptions(function (data) {
		verifyEqual(data, "hello");
	  }));
	};


window.testMarshallStringVarArgsEmpty = function() {
  Test.stringVarArgs(createOptions(function (data) {
    verifyEqual(data, [ ]);
  }));
};

window.testMarshallStringVarArgsSingle = function() {
  Test.stringVarArgs("1", createOptions(function (data) {
    verifyEqual(data, [ "1" ]);
  }));
};

window.testMarshallStringVarArgsMultiple = function() {
  Test.stringVarArgs("1", "2", createOptions(function (data) {
    verifyEqual(data, [ "1", "2" ]);
  }));
  Test.stringVarArgs("1", "2", "3", createOptions(function (data) {
    verifyEqual(data, [ "1", "2", "3" ]);
  }));
};

window.testMarshallBeanVarArgs = function() {
  dwr.engine.beginBatch();
  Test.testBeanVarArgs(createOptions(function (data) {
    verifyEqual(data, [ ]);
  }));
  Test.testBeanVarArgs(nested, createOptions(function (data) {
    verifyEqual(data, [ nested ]);
  }));
  Test.testBeanVarArgs(nested, nested, createOptions(function (data) {
    verifyEqual(data, [ nested, nested ]);
  }));
  Test.testBeanVarArgs(nested, nested, nested, createOptions(function (data) {
    verifyEqual(data, [ nested, nested, nested ]);
  }));
  dwr.engine.endBatch({
   errorHandler:createDelayedError()
  });
};

window.testMarshallByteParam = function() {
  runComparisonTests([
    { code:"byteParam", data:-128 },
    { code:"byteParam", data:-1 },
    { code:"byteParam", data:0 },
    { code:"byteParam", data:1 },
    { code:"byteParam", data:127 }
  ]);
};

window.testMarshallBooleanParam = function() {
  runComparisonTests([
    { code:"booleanParam", data:true },
    { code:"booleanParam", data:false }
  ]);
};

window.testMarshallShortParam = function() {
  runComparisonTests([
    { code:"shortParam", data:-32768 },
    { code:"shortParam", data:-1 },
    { code:"shortParam", data:0 },
    { code:"shortParam", data:1 },
    { code:"shortParam", data:32767 }
  ]);
};

window.testMarshallIntParam = function() {
  runComparisonTests([
    { code:"intParam", data:-2147483648 },
    { code:"intParam", data:-1 },
    { code:"intParam", data:0 },
    { code:"intParam", data:1 },
    { code:"intParam", data:2147483647 }
  ]);
};

window.testMarshallLongParam = function() {
  runComparisonTests([
    // Mozilla rounds 9223372036854775808 to 9223372036854776000 which overflows so we round down
    { code:"longParam", data:-9223372036854775000 },
    { code:"longParam", data:-1 },
    { code:"longParam", data:0 },
    { code:"longParam", data:1 },
    { code:"longParam", data:9223372036854775000 }
  ]);
};

window.testMarshallFloatParam = function() {
  runComparisonTests([
    { code:"floatParam", data:-100000000000000000000 },
    { code:"floatParam", data:-1 },
    { code:"floatParam", data:0 },
    { code:"floatParam", data:1 },
    { code:"floatParam", data:100000000000000000000 }
  ]);
};

window.testMarshallDoubleParam = function() {
  runComparisonTests([
    { code:"doubleParam", data:-100000000000000000000 },
    { code:"doubleParam", data:-1 },
    { code:"doubleParam", data:0 },
    { code:"doubleParam", data:1 },
    { code:"doubleParam", data:100000000000000000000 },
    { code:"doubleParam", data:Number.MAX_VALUE },
    { code:"doubleParam", data:Number.MIN_VALUE },
    { code:"doubleParam", data:Number.NaN },
    { code:"doubleParam", data:Number.NEGATIVE_INFINITY },
    { code:"doubleParam", data:Number.POSITIVE_INFINITY }
  ]);
};

window.testMarshallBigDecimalParam = function() {
  runComparisonTests([
    { code:"bigDecimalParam", data:-100000000000000000000 },
    { code:"bigDecimalParam", data:-1 },
    { code:"bigDecimalParam", data:0 },
    { code:"bigDecimalParam", data:1 },
    { code:"bigDecimalParam", data:100000000000000000000 }
  ]);
};

window.testMarshallBigIntegerParam = function() {
  runComparisonTests([
    { code:"bigIntegerParam", data:-100000000000000000000 },
    { code:"bigIntegerParam", data:-1 },
    { code:"bigIntegerParam", data:0 },
    { code:"bigIntegerParam", data:1 },
    { code:"bigIntegerParam", data:100000000000000000000 }
  ]);
};

window.testMarshallCharParam = function() {
  runComparisonTests([
    // Opera 8 has issues with this one. It appears to not like \0
    //{ code:"charParam", data:"\0" },
    { code:"charParam", data:"\t" },
    { code:"charParam", data:"\n" },
    { code:"charParam", data:"\v" },
    { code:"charParam", data:"\f" },
    { code:"charParam", data:"\r" },
    { code:"charParam", data:"\x07" },
    { code:"charParam", data:" " },
    { code:"charParam", data:"!" },
    { code:"charParam", data:'"' },
    { code:"charParam", data:"#" },
    { code:"charParam", data:"$" },
    { code:"charParam", data:"%" },
    { code:"charParam", data:"&" },
    { code:"charParam", data:"'" },
    { code:"charParam", data:"(" },
    { code:"charParam", data:")" },
    { code:"charParam", data:"*" },
    { code:"charParam", data:"+" },
    { code:"charParam", data:"," },
    { code:"charParam", data:"-" },
    { code:"charParam", data:"." },
    { code:"charParam", data:"/" },
    { code:"charParam", data:"0" },
    { code:"charParam", data:"9" },
    { code:"charParam", data:":" },
    { code:"charParam", data:"," },
    { code:"charParam", data:"<" },
    { code:"charParam", data:"=" },
    { code:"charParam", data:">" },
    { code:"charParam", data:"?" },
    { code:"charParam", data:"@" },
    { code:"charParam", data:"A" },
    { code:"charParam", data:"Z" },
    { code:"charParam", data:"[" },
    { code:"charParam", data:"\\" },
    { code:"charParam", data:"]" },
    { code:"charParam", data:"^" },
    { code:"charParam", data:"_" },
    { code:"charParam", data:"`" },
    { code:"charParam", data:"a" },
    { code:"charParam", data:"z" },
    { code:"charParam", data:"{" },
    { code:"charParam", data:"|" },
    { code:"charParam", data:"}" },
    { code:"charParam", data:"~" },

    // Unicode: we could be here for some time, so I just picked some commmon ones
    { code:"charParam", data:"\u0080" },
    { code:"charParam", data:"\u0091" },
    { code:"charParam", data:"\u0092" },
    { code:"charParam", data:"\u0093" },
    { code:"charParam", data:"\u0094" },
    { code:"charParam", data:"\u0095" },
    { code:"charParam", data:"\u0098" },
    { code:"charParam", data:"\u0099" },
    { code:"charParam", data:"\u00A0" },
    { code:"charParam", data:"\u00A3" },
    { code:"charParam", data:"\u00A5" },
    { code:"charParam", data:"\u00A6" },
    { code:"charParam", data:"\u00A9" },
    { code:"charParam", data:"\u00AC" },
    { code:"charParam", data:"\u00C7" },
    { code:"charParam", data:"\u00C6" },
    { code:"charParam", data:"\u00DF" },
    { code:"charParam", data:"\u00FF" }
  ]);
};

window.testMarshallStringParam = function() {
  runComparisonTests([
    { code:"stringParam", data:" " },
    { code:"stringParam", data:"!" },
    { code:"stringParam", data:'"' },
    { code:"stringParam", data:"#" },
    { code:"stringParam", data:"$" },
    { code:"stringParam", data:"%" },
    { code:"stringParam", data:"&" },
    { code:"stringParam", data:"'" },
    { code:"stringParam", data:"(" },
    { code:"stringParam", data:")" },
    { code:"stringParam", data:"*" },
    { code:"stringParam", data:"+" },
    { code:"stringParam", data:"," },
    { code:"stringParam", data:"-" },
    { code:"stringParam", data:"." },
    { code:"stringParam", data:"/" },
    { code:"stringParam", data:"0" },
    { code:"stringParam", data:"9" },
    { code:"stringParam", data:":" },
    { code:"stringParam", data:"," },
    { code:"stringParam", data:"<" },
    { code:"stringParam", data:"=" },
    { code:"stringParam", data:">" },
    { code:"stringParam", data:"?" },
    { code:"stringParam", data:"@" },
    { code:"stringParam", data:"A" },
    { code:"stringParam", data:"Z" },
    { code:"stringParam", data:"[" },
    { code:"stringParam", data:"\\" },
    { code:"stringParam", data:"]" },
    { code:"stringParam", data:"^" },
    { code:"stringParam", data:"_" },
    { code:"stringParam", data:"`" },
    { code:"stringParam", data:"a" },
    { code:"stringParam", data:"z" },
    { code:"stringParam", data:"{" },
    { code:"stringParam", data:"|" },
    { code:"stringParam", data:"}" },
    { code:"stringParam", data:"~" },

    { code:"stringParam", data:"" },
    { code:"stringParam", data:null },
    { code:"stringParam", data:"null" },

    { code:"stringParam", data:" !\"#$%&\'()*+,-/" },
    { code:"stringParam", data:"0123456789" },
    { code:"stringParam", data:":,<=>?@" },
    { code:"stringParam", data:"ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
    { code:"stringParam", data:"[\\]^_`" },
    { code:"stringParam", data:"abcdefghijklmnopqrstuvwxyz" },
    { code:"stringParam", data:"{|}~" },

    { code:"stringParam", data:"call.callback = null" },

    // This line should contain a string of mostly non-western characters and no question marks
    { code:"stringParam", data:"??BBC?1994??????~~??????????????????~~?á?????????????~~?????????????????BBC?1994??????~~??????????????????~~?á?????????????~~???????????????" },
    { code:"stringParam", data:"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\" }
  ]);
};

window.testMarshallBooleanArrayParam = function() {
  runComparisonTests([
    { code:"booleanArrayParam", data:[ ] },
    { code:"booleanArrayParam", data:[ true, false, true, false ] }
  ]);
};

window.testMarshallCharArrayParam = function() {
  runComparisonTests([
    { code:"charArrayParam", data:[ ] },
    { code:"charArrayParam", data:[ 'a', ',', '[', ']' ] }
  ]);
};

window.testMarshallShortArrayParam = function() {
  runComparisonTests([
    { code:"shortArrayParam", data:[ ] },
    { code:"shortArrayParam", data:[ -32768, -1, 0, 1, 32767 ] }
  ]);
};

window.testMarshallIntArrayParam = function() {
  runComparisonTests([
    { code:"intArrayParam", data:[ ] },
    { code:"intArrayParam", data:[ -2147483648 ] },
    { code:"intArrayParam", data:[ -1 ] },
    { code:"intArrayParam", data:[ 0 ] },
    { code:"intArrayParam", data:[ 1 ] },
    { code:"intArrayParam", data:[ 2147483647 ] },
    { code:"intArrayParam", data:[ -2147483648, -1, 0, 1, 2147483647 ] }
  ]);
};

window.testMarshallLongArrayParam = function() {
  runComparisonTests([
    { code:"longArrayParam", data:[ ] },
    { code:"longArrayParam", data:[ -9223372036854775000, -1, 0, 1, 9223372036854775000 ] }
  ]);
};

window.testMarshallFloatArrayParam = function() {
  runComparisonTests([
    { code:"floatArrayParam", data:[ ] },
    { code:"floatArrayParam", data:[ -100000000000000000000, -1, 0, 1, 100000000000000000000 ] }
  ]);
};

window.testMarshallXDArrayParam = function() {
  var double1D = [ -100000000000000000000, -1, 0, 1, 100000000000000000000 ];
  var double2D = [ double1D, double1D ];
  var double3D = [ double2D, double2D ];
  var double4D = [ double3D, double3D ];
  var double5D = [ double4D, double4D ];
  var string1D = [ "string1", "string2", "string3", "string4", "string5" ];
  var string2D = [ string1D, string1D ];
  var string3D = [ string2D, string2D ];
  var string4D = [ string3D, string3D ];
  var string5D = [ string4D, string4D ];

  runComparisonTests([
    { code:"doubleArrayParam", data:double1D },
    { code:"double2DArrayParam", data:double2D },
    { code:"double3DArrayParam", data:double3D },
    { code:"double4DArrayParam", data:double4D },
    { code:"double5DArrayParam", data:double5D },
    { code:"stringArrayParam", data:string1D },
    { code:"string2DArrayParam", data:string2D },
    { code:"string3DArrayParam", data:string3D },
    { code:"string4DArrayParam", data:string4D },
    { code:"string5DArrayParam", data:string5D }
  ]);
};

// Used in a few tests
var nested = { integer:0, string:'0123456789' };
nested.testBean = nested;
var nestedObj = { integer:0, string:'0123456789' };
nestedObj.testObj = nestedObj;

var obja = new ObjA();
var objb = new ObjB();
objb.objA = obja;
obja.objB = objb;


window.testMarshallLoopedParam = function() {
  runComparisonTests([
    { code:"testLooped", data:obja }
  ]);
};

window.testMarshallTestBeanParam = function() {
  runComparisonTests([
    { code:"testBeanParam", data:{ integer:-2147483648, string:'!"$%^&*()', testBean:null } },
    { code:"testBeanParam", data:{ integer:-1, string:'Null', testBean:null } },
    { code:"testBeanParam", data:{ integer:0, string:'null', testBean:null } },
    { code:"testBeanParam", data:{ integer:1, string:'0987654321', testBean:nested } }
  ]);
};

window.testMarshallTestBeanSetParam = function() {
  runComparisonTests([
    { code:"testBeanSetParam", data:[ ] },
    { code:"testBeanSetParam", data:[{ integer:1, string:'0987654321', testBean:nested }] },
    { code:"testBeanSetParam", data:[ nested ] }
  ]);
};

window.testMarshallTestBeanListParam = function() {
  runComparisonTests([
    { code:"testBeanListParam", data:[ ] },
    { code:"testBeanListParam", data:[ nested ] },
    { code:"testBeanListParam", data:[ nested, nested ] },
    { code:"testBeanListParam", data:[ nested, nested, nested ] }
  ]);
};

/*
 * Failing test added by Mike to demonstrate bug
 * "I think it requires that type info is inspected on the data members directly,
 * and not on the parameters to getters or setters, as getters and setters are
 * not used for objects."
 */
window.testMarshallTestBeanWithListParam = function() {
  runComparisonTests([
    { code:"testBeanWithListParam", data:{ integer:1, string:'0987654321', testBean:nested, list:[] } },
    { code:"testBeanWithListParam", data:{ integer:1, string:'0987654321', testBean:nested, list:[nested] } },
    { code:"testBeanWithListParam", data:{ integer:1, string:'0987654321', testBean:nested, list:[nested, nested] } },
    { code:"testBeanWithListParam", data:{ integer:1, string:'0987654321', testBean:nested, list:[nested, nested, nested] } }
  ]);
};

window.testMarshallTestObjectListParam = function() {
  runComparisonTests([
    { code:"testObjectListParam", data:[ ] },
    { code:"testObjectListParam", data:[ nestedObj ] },
    { code:"testObjectListParam", data:[ nestedObj, nestedObj ] },
    { code:"testObjectListParam", data:[ nestedObj, nestedObj, nestedObj ] }
  ]);
};

/*
/ This function was added by Mike W. and was a forward looking test - meaning 
/ it has never worked and was added in hopes that core functionality would 
/ eventually change and make this pass.  For now I am commented it out to 
/ avoid confusion. 
/  
window.testMarshallTestObjectWithListParam = function() {
  runComparisonTests([
    { code:"testObjectWithListParam", data:{ integer:1, string:'0987654321', testObj:nestedObj, list:[] } },
    { code:"testObjectWithListParam", data:{ integer:1, string:'0987654321', testObj:nestedObj, list:[nestedObj] } },
    { code:"testObjectWithListParam", data:{ integer:1, string:'0987654321', testObj:nestedObj, list:[nestedObj, nestedObj] } },
    { code:"testObjectWithListParam", data:{ integer:1, string:'0987654321', testObj:nestedObj, list:[nestedObj, nestedObj, nestedObj] } }
  ]);
};*/

var finalBean = { integer:0, string:'0123456789', testBean:nested };

window.testMarshallFinalBeanParam = function() {
  runComparisonTests([
    { code:"finalBeanParam", data:null },
    { code:"finalBeanParam", data:finalBean }
  ]);
};

window.testMarshallFinalBeanArrayParam = function() {
  runComparisonTests([
    { code:"finalBeanArrayParam", data:null },
    { code:"finalBeanArrayParam", data:[ ] },
    { code:"finalBeanArrayParam", data:[ finalBean ] },
    { code:"finalBeanArrayParam", data:[ finalBean, finalBean ] },
    { code:"finalBeanArrayParam", data:[ finalBean, finalBean, finalBean ] }
  ]);
};

window.testMarshallUntypedTestBeanListParam = function() {
  runComparisonTests([
    { code:"untypedTestBeanListParam", data:[ ] },
    { code:"untypedTestBeanListParam", data:[ nested ] },
    { code:"untypedTestBeanListParam", data:[ nested, nested ] },
    { code:"untypedTestBeanListParam", data:[ nested, nested, nested ] }
  ]);
};

window.testMarshallTestBeanMapParam = function() {
  runComparisonTests([
    { code:"charTestBeanMapParam", data:{ } },
    { code:"charTestBeanMapParam", data:{ d:{ integer:1, string:'0987654321', testBean:nested } } }
  ]);
};

window.testMarshallStringCollectionParam = function() {
  runComparisonTests([
    { code:"stringCollectionParam", data:[ ] },
    { code:"stringCollectionParam", data:[ 'abcdef' ] },
    { code:"stringCollectionParam", data:[ ",'{}[]" ] },
    { code:"stringCollectionParam", data:[ 'abcdef', 'hgijklm', 'nopqrst' ] },
    { code:"stringCollectionParam", data:[ ",'{}[]", 'null', ",'{}[]" ] }
  ]);
};

window.testMarshallStringLinkedListParam = function() {
  runComparisonTests([
    { code:"stringLinkedListParam", data:[ ] },
    { code:"stringLinkedListParam", data:[ 'abcdef' ] },
    { code:"stringLinkedListParam", data:[ ",'{}[]" ] },
    { code:"stringLinkedListParam", data:[ 'abcdef', 'hgijklm', 'nopqrst' ] },
    { code:"stringLinkedListParam", data:[ ",'{}[]", 'null', ",'{}[]" ] }
  ]);
};

window.testMarshallStringArrayListParam = function() {
  runComparisonTests([
    { code:"stringArrayListParam", data:[ ] },
    { code:"stringArrayListParam", data:[ ",'{}[]" ] },
    { code:"stringArrayListParam", data:[ 'abcdef' ] },
    { code:"stringArrayListParam", data:[ 'abcdef', 'hgijklm', 'nopqrst' ] },
    { code:"stringArrayListParam", data:[ ",'{}[]", 'null', ",'{}[]" ] }
  ]);
};

window.testMarshallStringListParam = function() {
  runComparisonTests([
    { code:"stringListParam", data:[ ] },
    { code:"stringListParam", data:[ ",'{}[]" ] },
    { code:"stringListParam", data:[ 'abcdef' ] },
    { code:"stringListParam", data:[ 'abcdef', 'hgijklm', 'nopqrst' ] },
    { code:"stringListParam", data:[ ",'{}[]", 'null', ",'{}[]" ] }
  ]);
};

window.testMarshallStringSetParam = function() {
  runComparisonTests([
    { code:"stringSetParam", data:[ ] },
    { code:"stringSetParam", data:[ 'abcdef' ] },
    { code:"stringSetParam", data:[ ",'{}[]" ] }
    // Unordered so we cheat by not using multiple elements
  ]);
};

window.testMarshallStringHashSetParam = function() {
  runComparisonTests([
    { code:"stringHashSetParam", data:[ ] },
    { code:"stringHashSetParam", data:[ 'abcdef' ] },
    { code:"stringHashSetParam", data:[ ",'{}[]" ] }
    // Unordered so we cheat by not using multiple elements
  ]);
};

window.testMarshallStringTreeSetParam = function() {
  runComparisonTests([
    { code:"stringTreeSetParam", data:[ ] },
    { code:"stringTreeSetParam", data:[ 'abcdef' ] },
    { code:"stringTreeSetParam", data:[ ",'{}[]" ] },
    { code:"stringTreeSetParam", data:[ 'abcdef', 'hgijklm', 'nopqrst' ] }
  ]);
};

var map1 = { a:'a', b:'b', c:'c' };
var map2 = { };
map2['a.a'] = "a.a";
map2['b!'] = "b!";
map2['c$'] = "c$";
map2["d'"] = "d'";
map2['e"'] = 'e"';
map2['f '] = 'f ';
map2[' g'] = ' g';
map2['h&'] = 'h&';
map2['i<'] = 'i<';
map2['j>'] = 'j>';
map2['k:'] = 'k:';
map2['m]'] = 'm]';
map2['o{'] = 'o{';
map2['p}'] = 'p}';
map2['q,~#'] = 'q,~#';
map2['r?/,'] = 'r?/,';
var map3 = { a:["a"], b:["a","b"], c:["c"] };

window.testMarshallStringStringMapParam = function() {
  runComparisonTests([
    { code:"stringStringMapParam", data:map1 },
    { code:"stringStringMapParam", data:map2 }
  ]);
};

window.testMarshallStringArrayMapParam = function() {
  Test.stringArrayMapParam(map3, createOptions(function (data) {
    verifyEqual(data, map3);
  }));
};

window.testMarshallStringBeanArrayMapParam = function() {
  var map = {a: [{ integer:1, string:'0987654321', testBean:nested}, {integer:2, string:'012345678', testBean:nested}]};
  Test.stringBeanArrayMapParam(map, createOptions(function (data) {
    verifyEqual(data, map);
  }));
};

window.testMarshallStringBooleanMapParam = function() {
	runComparisonTests([
	    { code:"stringBooleanMapParam", data: { Key : true } }	    
    ]);
};

window.testMarshallStringStringHashMapParam = function() {
  runComparisonTests([
    { code:"stringStringHashMapParam", data:map1 },
    { code:"stringStringHashMapParam", data:map2 }
  ]);
};

window.testMarshallStringStringTreeMapParam = function() {
  runComparisonTests([
    { code:"stringStringTreeMapParam", data:map1 },
    { code:"stringStringTreeMapParam", data:map2 }
  ]);
};

/**
 *
 */
function runComparisonTests(compares) {
  for (var i = 0; i < compares.length; i++) (function(i) {
    var compare = compares[i];
    Test[compare.code](compare.data, createOptions(function(data) {
      verifyEqual(data, compare.data);
    }));
  })(i)
}

window.testMarshallDomElementParam = function() {
  var testHtml = '<p id="test">This is a <em>test node</em> to check on <strong>DOM</strong> <span class="small">manipulation</span>.</p>';
  dwr.util.setValue(currentTest.scratch, testHtml, { escapeHtml:false });
  var testNode = dwr.util.byId("test");
  var nodeCompare = function(data) {
    var output;
    if (window.XMLSerializer) output = new XMLSerializer().serializeToString(data);
    else if (data.toXml) output = data.toXml;
    else output = data.innerHTML;
    // We do lower case because xml->html might not preserve tag case or spaces
    output = output.toLowerCase().replace(/ /g, "");
    compare = testHtml.toLowerCase().replace(/ /g, "");
    verifyEqual(output, compare);
  };

  Test.dom4jElementParam(testNode, createOptions(nodeCompare));
  Test.xomElementParam(testNode, createOptions(nodeCompare));
  Test.jdomElementParam(testNode, createOptions(nodeCompare));
  Test.domElementParam(testNode, createOptions(nodeCompare));
};

/**
 *
 */
window.testMarshallDownloadMappedWithInheritance = function() {
  Test.downloadMapped(createOptions(function(arr) {
    var b = arr[0];
    verifyTrue(b instanceof AbstractBase, "b instanceof AbstractBase");
    verifyTrue(b instanceof ConcreteBBase, "b instanceof ConcreteBBase");
    verifyEqual(b.fieldB, true);
    verifyUndefined(b.fieldC);

    var c = arr[1];
    verifyTrue(c instanceof AbstractBase, "c instanceof AbstractBase");
    verifyTrue(c instanceof ConcreteCBase, "c instanceof ConcreteCBase");
    verifyUndefined(c.fieldB);
    verifyEqual(c.fieldC, 3.14);
  }));
};

/**
 *
 */
window.testMarshallUploadMapped = function() {
  Test.uploadMapped(new ConcreteBBase(), createOptions(function(reply) {
    verifyEqual(reply, "org.testdwr.convert.ConcreteBBase");
  }));
  Test.uploadMapped(new ConcreteCBase(), createOptions(function(reply) {
    verifyEqual(reply, "org.testdwr.convert.ConcreteCBase");
  }));
  Test.uploadMapped(null, createOptions(function(reply) {
    verifyEqual(reply, "null");
  }));
};

/**
 *
 */
window.testMarshallUploadMappedToUnmappedParamClass = function() {
  Test.uploadMappedToUnmappedParamClass(new ConcreteBBase(), createOptions(function(reply) {
    verifyEqual(reply, "org.testdwr.convert.ConcreteBBase");
  }));
  Test.uploadMappedToUnmappedParamClass(new ConcreteCBase(), createOptions(function(reply) {
    verifyEqual(reply, "org.testdwr.convert.ConcreteCBase");
  }));
  // Test.uploadMappedToUnmappedParamClass(null, createOptions(function(reply) {
  //   verifyEqual(reply, "null");
  // }));
};

/**
 * Receive a mapped exception from server
 */
window.testMarshallThrowMapped = function() {
  Test.throwMapped({
    callback:createDelayedError(),
    exceptionHandler:createDelayed(function(message, ex) {
      verifyTrue(ex instanceof MyFancyException);
      verifyEqual(message, "fancy");
      verifyEqual(message, ex.message);
      verifyEqual(ex.javaClassName, "org.testdwr.convert.MyFancyException");
    })
  });
};

/**
 *
 */
window.testMarshallThrowUnmapped = function() {
  Test.throwUnmapped({
    callback:createDelayedError(),
    exceptionHandler:createDelayed(function(message, ex) {
      verifyFalse(ex instanceof MyFancyException);
      verifyNotEqual(message, "Error");
      verifyEqual(message, ex.message);
      verifyEqual(ex.javaClassName, "java.lang.Throwable");
    })
  });
};

/**
 *
 */
window.testMarshallUploadInterface = function() {
  var c = new ConcreteIFace();
  c.i = 42;
  Test.uploadInterface(c, createOptions(function(reply) {
    verifyEqual(reply, "org.testdwr.convert.ConcreteIFace");
  }));

  Test.uploadInterface(null, createOptions(function(reply) {
    verifyEqual(reply, "null");
  }));
};

/**
 *
 */
window.testMarshallPackage1 = function() {
  var obj = new pkg1.OnePackage();
  obj.i = 42;
  obj.extraProperty = "THIS TEXT SHOULDN'T BE MARSHALLED TO SERVER";

  Test.package1(obj, createOptions(function(retval) {
    verifyEqual(retval.i, 43);
  }));
};

/**
 *
 */
window.testMarshallPackage2 = function() {
  var obj = new pkg1.pkg2.TwoPackages();
  obj.i = 42;

  Test.package2(obj, createOptions(function(retval) {
    verifyEqual(retval.i, 43);
  }));
};

/**
 *
 */
window.testMarshallPackagedEx = function() {
  Test.packagedException({
    callback:createDelayedError(),
    exceptionHandler: createDelayed(function(message, ex) {
      verifyFalse(ex instanceof MyFancyException);
      verifyNotEqual(message, "fancy");
      verifyEqual(message, ex.message);
      verifyEqual(ex.javaClassName, "org.testdwr.convert.MyFancyExceptionInPackage");
      //verifyEqual(ex.javaClassName, "pkg1.MyFancyExceptionInPackage");
    })
  });
};

// --- Converter wildcard checks

/**
 * 
 */
window.testMarshallConverterWildcards = function() {
  Test.flatWildcardObjects(
    {
      noname:       {i:1},
      samename:     WildcardObject.createFromMap({i:2}),
      extendedname: PrefixWildcardObjectSuffix.createFromMap({i:3}),
      samepackage:  org.testdwr.convert.wildcards.flat.samepackage.WildcardObject.createFromMap({i:4}),
      otherpackage: otherpackage.WildcardObject.createFromMap({i:5})
    },
    createOptions(function(reply) {
      verifyEqual(reply.noname.i, 1);
      verifyEqual(reply.samename.i, 2);
      verifyTrue(reply.samename instanceof WildcardObject);
      verifyEqual(reply.extendedname.i, 3);
      verifyTrue(reply.extendedname instanceof PrefixWildcardObjectSuffix);
      verifyEqual(reply.samepackage.i, 4);
      verifyTrue(reply.samepackage instanceof org.testdwr.convert.wildcards.flat.samepackage.WildcardObject);
      verifyEqual(reply.otherpackage.i, 5);
      verifyTrue(reply.otherpackage instanceof otherpackage.WildcardObject);
    })
  );
};

/**
 * 
 */
window.testMarshallConverterWildcardsRecursive = function() {
  Test.recursiveWildcardObjects(
    {
      noname:       {i:1},
      samename:     WildcardSubObject.createFromMap({i:2}),
      extendedname: PrefixWildcardSubObjectSuffix.createFromMap({i:3}),
      samepackage:  org.testdwr.convert.wildcards.recursive.samepackage.subpkg.WildcardSubObject.createFromMap({i:4}),
      otherpackage: otherpackage.WildcardSubObject.createFromMap({i:5})
    },
    createOptions(function(reply) {
      verifyEqual(reply.noname.i, 1);
      verifyEqual(reply.samename.i, 2);
      verifyTrue(reply.samename instanceof WildcardSubObject);
      verifyEqual(reply.extendedname.i, 3);
      verifyTrue(reply.extendedname instanceof PrefixWildcardSubObjectSuffix);
      verifyEqual(reply.samepackage.i, 4);
      verifyTrue(reply.samepackage instanceof org.testdwr.convert.wildcards.recursive.samepackage.subpkg.WildcardSubObject);
      verifyEqual(reply.otherpackage.i, 5);
      verifyTrue(reply.otherpackage instanceof otherpackage.WildcardSubObject);
    })
  );
};

// --- End converter wildcard checks

/**
 *
 */
window.testMarshallLightClassMapping = function() {
  // As this is a test for the light class-mapping scheme we don't want the
  // generated mapped JavaScript class for our objects. We remove any trace
  // of the class in case it has been included:
  if (typeof this.ObjectWithLightClassMapping == "function") {
    delete this.ObjectWithLightClassMapping;
    delete dwr.engine._mappedClasses["ObjectWithLightClassMapping"];
  }

  // We should add type as object property for light class-mapping
  var obj = {$dwrClassName:"ObjectWithLightClassMapping"};

  Test.uploadLightlyMapped(obj, createOptions(function(reply) {
    verifyEqual(reply, "org.testdwr.convert.ObjectWithLightClassMapping");
  }));

  Test.downloadLightlyMapped(createOptions(function(reply) {
    verifyEqual(reply.$dwrClassName, "ObjectWithLightClassMapping");
  }));
};


/**
 *
 */
window.testMarshallAreIdentical = function() {
  var arr = [];
  Test.areIdentical(arr, arr, createOptions(function(reply) {
    verifyTrue(reply, "isIdentical:true");
  }));

  Test.areIdentical([], [], createOptions(function(reply) {
    verifyFalse(reply, "isIdentical:false");
  }));
};

/**
 * 
 */
window.testMarshallReadOnlyProperties = function () {
    Test.readOnlyProperty(createOptions(function(data) {
        assertEqual(data.i, 10)
        assertEqual(data.fieldAbstract, 5.0)
        assertEqual(data.fieldReadOnly, "readOnly")
    }));
};

window.testMarshallGenericsImplementation = function() {
    ConcreteGenericService.execute(0, 0, {}, {}, createOptions(function(data) {
        assertEqual(data, 1);
    }));
};