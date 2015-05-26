createTestGroup("SpringMvc");

SpringMvcAnnotated._path = common.getContextPath() + "/springmvc";
DemoName._path = common.getContextPath() + "/springmvc";
Lazy._path = common.getContextPath() + "/springmvc";
Calculator._path = common.getContextPath() + "/springmvc";
Generator._path = common.getContextPath() + "/springmvc";
Giver._path = common.getContextPath() + "/springmvc";
AnnotatedConverter._path = common.getContextPath() + "/springmvc";
SpringBeanConverter._path = common.getContextPath() + "/springmvc";
OtherSpringBeanConverter._path = common.getContextPath() + "/springmvc";
GenericProxy._path = common.getContextPath() + "/springmvc";

window.testSpringMvcEcho = function() {
	SpringMvcAnnotated.echo("hello world", "  en_US  ", "USD", waitDwrCallbackOptions(
		function(data) {
			assertEqual(data.name, "echoed by DWR Spring Mvc [hello world]");
			assertEqual(data.locale, "en_US");
			assertEqual(data.currency, "EUR");
		}
	));
}

window.testSpringMvcCustomEcho = function() {
	DemoName.echo("hello world", waitDwrCallbackOptions(
		function(data) {
			assertEqual(data.name, "echoed by DemoName [hello world]");
		}
	));
}

window.testSpringMvcLazy = function() {
	Lazy.name("Peter", waitDwrCallbackOptions(
		function(data) {
			assertEqual(data.name, "Peter")
		}
	));
}

window.testSpringMvcProxyReference = function() {
	Calculator.add(3, 5, waitDwrCallbackOptions(
		function(data) {
			assertEqual(data, 8)
		}
	));
}

window.testSpringMvcRandom = function() {
	Generator.random(waitDwrCallbackOptions(
		function(data) {
			assertTrue(data == -1.9)
		}
	));
}

window.testSpringMvcGiver = function() {
	Giver.giveMe(waitDwrCallbackOptions(
		function(data) {
			assertTrue(data == "some data")
		}
	));
}

window.testSpringMvcAnnotatedConverter = function() {
	AnnotatedConverter.name("Peter", waitDwrCallbackOptions(
		function(data) {
			assertEqual(data.name, "Peter")
			assertTrue(data instanceof S_MVC_AB)
			assertTrue(data.valid)
			assertEqual(data.other, "Aloha")
		}
	));
}

window.testSpringMvcBeanConverter = function() {	
	SpringBeanConverter.simple(waitDwrCallbackOptions(
		function(data) {
			assertEqual(data, "Hi Peter")
		}
	));
}

window.testSpringMvcParameterizedConverter = function() {	
	OtherSpringBeanConverter.check(waitDwrCallbackOptions(
		function(data) {
			assertEqual(data, "The number is 5")
		}
	));
}

window.testSpringMvcGenericProxy = function() {
	bean = new S_MVC_AB
	bean.name = "Mary"
	GenericProxy.convert(1, [bean], waitDwrCallbackOptions(
		function(data) {
			assertEqual(data[0].name, "Mary")
		}
	));
}