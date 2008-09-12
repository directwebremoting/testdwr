
createTestGroup("Guice");

/**
 *
 */
function testGuiceGetPath() {
  GuiceTest.getPath(createDelayed(function(data) {
    verifyEqual("/guice", data);
  }));
}

function testGuiceByteParam() {
  runGuiceComparisonTests([
    { code:"byteParam", data:-128 },
    { code:"byteParam", data:-1 },
    { code:"byteParam", data:0 },
    { code:"byteParam", data:1 },
    { code:"byteParam", data:127 }
  ]);
}

function testGuiceBooleanParam() {
  runGuiceComparisonTests([
    { code:"booleanParam", data:true },
    { code:"booleanParam", data:false }
  ]);
}

function testGuiceShortParam() {
  runGuiceComparisonTests([
    { code:"shortParam", data:-32768 },
    { code:"shortParam", data:-1 },
    { code:"shortParam", data:0 },
    { code:"shortParam", data:1 },
    { code:"shortParam", data:32767 }
  ]);
}

function testGuiceIntParam() {
  runGuiceComparisonTests([
    { code:"intParam", data:-2147483648 },
    { code:"intParam", data:-1 },
    { code:"intParam", data:0 },
    { code:"intParam", data:1 },
    { code:"intParam", data:2147483647 }
  ]);
}

function testGuiceLongParam() {
  runGuiceComparisonTests([
    // Mozilla rounds 9223372036854775808 to 9223372036854776000 which overflows so we round down
    { code:"longParam", data:-9223372036854775000 },
    { code:"longParam", data:-1 },
    { code:"longParam", data:0 },
    { code:"longParam", data:1 },
    { code:"longParam", data:9223372036854775000 }
  ]);
}

function testGuiceFloatParam() {
  runGuiceComparisonTests([
    { code:"floatParam", data:-100000000000000000000 },
    { code:"floatParam", data:-1 },
    { code:"floatParam", data:0 },
    { code:"floatParam", data:1 },
    { code:"floatParam", data:100000000000000000000 }
  ]);
}

function testGuiceDoubleParam() {
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
}

function testGuiceCharParam() {
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
}

function testGuiceStringParam() {
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
}

/**
 *
 */
function runGuiceComparisonTests(compares) {
  for (var i = 0; i < compares.length; i++) {
    var compare = compares[i];

    GuiceTest[compare.code](compare.data, {
      callback:createDelayed(function(data) {
        assertEqual(data, compare.data);
      }),
      exceptionHandler:createDelayedError()
    });
  }
}