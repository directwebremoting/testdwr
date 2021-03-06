
createTestGroup("Guice");

GuiceTest._path = common.getContextPath() + "/guice";

window.testGuiceByteParam = function() {
  runGuiceComparisonTests([
    { code:"byteParam", data:-128 },
    { code:"byteParam", data:-1 },
    { code:"byteParam", data:0 },
    { code:"byteParam", data:1 },
    { code:"byteParam", data:127 }
  ]);
};

window.testGuiceBooleanParam = function() {
  runGuiceComparisonTests([
    { code:"booleanParam", data:true },
    { code:"booleanParam", data:false }
  ]);
};

window.testGuiceShortParam = function() {
  runGuiceComparisonTests([
    { code:"shortParam", data:-32768 },
    { code:"shortParam", data:-1 },
    { code:"shortParam", data:0 },
    { code:"shortParam", data:1 },
    { code:"shortParam", data:32767 }
  ]);
};

window.testGuiceIntParam = function() {
  runGuiceComparisonTests([
    { code:"intParam", data:-2147483648 },
    { code:"intParam", data:-1 },
    { code:"intParam", data:0 },
    { code:"intParam", data:1 },
    { code:"intParam", data:2147483647 }
  ]);
};

window.testGuiceLongParam = function() {
  runGuiceComparisonTests([
    // Mozilla rounds 9223372036854775808 to 9223372036854776000 which overflows so we round down
    { code:"longParam", data:-9223372036854775000 },
    { code:"longParam", data:-1 },
    { code:"longParam", data:0 },
    { code:"longParam", data:1 },
    { code:"longParam", data:9223372036854775000 }
  ]);
};

window.testGuiceFloatParam = function() {
  runGuiceComparisonTests([
    { code:"floatParam", data:-100000000000000000000 },
    { code:"floatParam", data:-1 },
    { code:"floatParam", data:0 },
    { code:"floatParam", data:1 },
    { code:"floatParam", data:100000000000000000000 }
  ]);
};

window.testGuiceDoubleParam = function() {
  runGuiceComparisonTests([
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

window.testGuiceCharParam = function() {
  runGuiceComparisonTests([
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
    { code:"charParam", data:"\u0080" },
    { code:"charParam", data:"\u00FF" }
  ]);
};

window.testGuiceStringParam = function() {
  runGuiceComparisonTests([
    { code:"stringParam", data:" " },
    { code:"stringParam", data:"$" },
    { code:"stringParam", data:"%" },
    { code:"stringParam", data:"&" },
    { code:"stringParam", data:"\\" },
    { code:"stringParam", data:"" },
    { code:"stringParam", data:null },
    { code:"stringParam", data:"null" },
    { code:"stringParam", data:" !\"#$%&\'()*+,-/" },
    { code:"stringParam", data:"[\\]^_`" },
    { code:"stringParam", data:"{|}~" },
    { code:"stringParam", data:"call.callback = null" }
  ]);
};

/**
 *
 */
function runGuiceComparisonTests(compares) {
  for (var i = 0; i < compares.length; i++) (function(i) {
    var compare = compares[i];

    GuiceTest[compare.code](compare.data, waitDwrCallbackOptions(function(data) {
      assertEqual(data, compare.data);
    }));
  })(i)
}

window.testGuiceCheckContext = function() {
  GuiceTest.checkContext(common.getContextPath(), waitDwrVerifyCallbackOptions());
};
