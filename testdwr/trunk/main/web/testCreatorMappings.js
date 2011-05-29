createTestGroup("CreatorMapping");

window.testCreatorMappingWithOnePackage = function() {
  pkg1.onePackageCreator.doNothing(createOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithTwoPackages = function() {
  pkg1.pkg2.twoPackagesCreator.doNothing(createOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithWildcardAndPrefixSuffix = function() {
  prefixTestSuffix.doNothing(createOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithPackageAndWildcard = function() {
  otherpackage.Test.doNothing(createOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithPackageWildcard = function() {
  org.testdwr.plain.Test.doNothing(createOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithStrangeName = function() {
  window["!@$/()=+,:-_"].doNothing(createOptions(function (data) {
    verifyNull(data);
  }));
};

window.testCreatorMappingWithStrangeNameAndPackage = function() {
  pkg["!@$/()=+,:-_"]["!@$/()=+,:-_"].doNothing(createOptions(function (data) {
    verifyNull(data);
  }));
};

