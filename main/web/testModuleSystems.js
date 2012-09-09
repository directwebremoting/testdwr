
createTestGroup("ModuleSystems");

// Tests when AMD loader mapped on application root (default) implying that
// modules are addressed with <servletpath>/amd/ base.
window.testModuleSystemsAmdStandardMapping = function() {
  _moduleSystemsAmd("dwr/amd", "dwr/amd/interface", "dwr/amd/dto");
};

// Tests when AMD loader mapped inside the DWR URL space to provide a custom
// module namespace.
window.testModuleSystemsAmdCustomMapping = function() {
	_moduleSystemsAmd("dwralt", "interface", "dto");
};

function _moduleSystemsAmd(dwrmap, ifcmap, dtomap) {
  // Note: we need to create the call options object outside the module system's
  // asynchronous wrapper function as the dwrunit framework depends on these
  // objects being created before exiting the main function

  // No package names
  var callback1;
  var dwrCallOptions1 = waitDwrCallbackOptions(function (data) {
    callback1(data);
  });
  require([
    ifcmap + "/Test", 
    dtomap + "/AbstractBase",
    dtomap + "/ConcreteBBase",
    dtomap + "/ConcreteCBase"], 
    waitAsync(function(test, AbstractBase, ConcreteBBase, ConcreteCBase) {
      callback1 = function(arr) {
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
      };
      test.downloadMapped(dwrCallOptions1);
    })
  );

  // One package
  var callback2;
  var dwrCallOptions2 = waitDwrCallbackOptions(function (data) {
    callback2(data);
  });
  require([
    ifcmap + "/pkg1/onePackageCreator", 
    dtomap + "/pkg1/OnePackageObject"], 
    waitAsync(function(test, OnePackageObject) {
      var obj = new OnePackageObject();
      obj.i = 42;
      obj.extraProperty = "THIS TEXT SHOULDN'T BE MARSHALLED TO SERVER";
      callback2 = function(retval) {
        verifyEqual(retval.i, 43);
      };
      test.package1(obj, dwrCallOptions2);
    })
  );

  // Two packages
  var callback3;
  var dwrCallOptions3 = waitDwrCallbackOptions(function (data) {
    callback3(data);
  });
  require([
    ifcmap + "/pkg1/pkg2/twoPackagesCreator", 
    dtomap + "/pkg1/pkg2/TwoPackagesObject"], 
    waitAsync(function(test, TwoPackagesObject) {
      var obj = new TwoPackagesObject();
      obj.i = 42;
      callback3 = function(retval) {
        verifyEqual(retval.i, 43);
      };
      test.package2(obj, dwrCallOptions3);
    })
  );
}

// Tests when Dojo loader mapped on application root (default) implying that
// modules are addressed with <servletpath>.dojo base.
window.testModuleSystemsDojoStandardMapping = function() {
  _moduleSystemsDojo("dwr.dojo", "dwr.dojo.interface", "dwr.dojo.dto");
};

// Tests when Dojo loader mapped inside the DWR URL space to provide a custom
// module namespace.
window.testModuleSystemsDojoCustomMapping = function() {
	_moduleSystemsDojo("dwralt", "interface", "dto");
};

function _moduleSystemsDojo(dwrmap, ifcmap, dtomap) {
  // No package names
  dojo.require(ifcmap + ".Test");
  dojo.require(dtomap + ".AbstractBase");
  dojo.require(dtomap + ".ConcreteBBase");
  dojo.require(dtomap + ".ConcreteCBase");
  dojo.getObject(ifcmap).Test.downloadMapped(waitDwrCallbackOptions(function(arr) {
    var b = arr[0];
    verifyTrue(b instanceof dojo.getObject(dtomap).AbstractBase, "b instanceof AbstractBase");
    verifyTrue(b instanceof dojo.getObject(dtomap).ConcreteBBase, "b instanceof ConcreteBBase");
    verifyEqual(b.fieldB, true);
    verifyUndefined(b.fieldC);
      
    var c = arr[1];
    verifyTrue(c instanceof dojo.getObject(dtomap).AbstractBase, "c instanceof AbstractBase");
    verifyTrue(c instanceof dojo.getObject(dtomap).ConcreteCBase, "c instanceof ConcreteCBase");
    verifyUndefined(c.fieldB);
    verifyEqual(c.fieldC, 3.14);
  }));

  // One package
  dojo.require(ifcmap + ".pkg1.onePackageCreator");
  dojo.require(dtomap + ".pkg1.OnePackageObject");
  var obj = new (dojo.getObject(dtomap).pkg1.OnePackageObject)();
  obj.i = 42;
  obj.extraProperty = "THIS TEXT SHOULDN'T BE MARSHALLED TO SERVER";
  dojo.getObject(ifcmap).pkg1.onePackageCreator.package1(obj, waitDwrCallbackOptions(function(retval) {
    verifyEqual(retval.i, 43);
  }));

  // Two packages
  dojo.require(ifcmap + ".pkg1.pkg2.twoPackagesCreator");
  dojo.require(dtomap + ".pkg1.pkg2.TwoPackagesObject");
  var obj = new (dojo.getObject(dtomap).pkg1.pkg2.TwoPackagesObject)();
  obj.i = 42;
  dojo.getObject(ifcmap).pkg1.pkg2.twoPackagesCreator.package2(obj, waitDwrCallbackOptions(function(retval) {
    verifyEqual(retval.i, 43);
  }));
};
