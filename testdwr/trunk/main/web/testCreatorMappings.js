createTestGroup("CreatorMapping");

window.testCreatorMappingWithOnePackage = function() {
  pkg1.onePackageCreator.doNothing(waitDwrCallbackOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithTwoPackages = function() {
  pkg1.pkg2.twoPackagesCreator.doNothing(waitDwrCallbackOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithWildcardAndPrefixSuffix = function() {
  prefixTestSuffix.doNothing(waitDwrCallbackOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithPackageAndWildcard = function() {
  otherpackage.Test.doNothing(waitDwrCallbackOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithPackageWildcard = function() {
  org.testdwr.plain.Test.doNothing(waitDwrCallbackOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithStrangeName = function() {
  window["!@$/()=+,:-_"].doNothing(waitDwrCallbackOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithStrangeNameAndPackage = function() {
  pkg["!@$/()=+,:-_"]["!@$/()=+,:-_"].doNothing(waitDwrCallbackOptions(function (data) {
    verifyNull(data);
  }));
};

