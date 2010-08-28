createTestGroup("SpringMvc");

window.testSpringMvcEcho = function() {
	SpringMvcAnnotated.echo("hello world", "  en_US  ", "USD", {
		callback:createDelayed(function(data) {
			assertEqual(data.name, "echoed by DWR Spring Mvc [hello world]");
			assertEqual(data.locale, "en_US");
			assertEqual(data.currency, "EUR");
		})
	})
}

window.testSpringMvcCustomEcho = function() {
	DemoName.echo("hello world", {
		callback:createDelayed(function(data) {
			assertEqual(data.name, "echoed by DemoName [hello world]");
		})
	})
}

window.testSpringMvcLazy = function() {
	Lazy.name("Peter", {
		callback: createDelayed(function(data) {
			assertEqual(data.name, "Peter")
		})
	})
}

window.testSpringMvcProxyReference = function() {
	Calculator.add(3, 5, {
		callback: createDelayed(function(data) {
			assertEqual(data, 8)
		})
	})
}

window.testSpringMvcRandom = function() {
	Generator.random({
		callback: createDelayed(function(data) {
			assertTrue(data == -1.9)
		})
	})
}

window.testSpringMvcGiver = function() {
	Giver.giveMe({
		callback: createDelayed(function(data) {
			assertTrue(data == "some data")
		})
	})
}

window.testSpringMvcAnnotatedConverter = function() {
	AnnotatedConverter.name("Peter", {
		callback: createDelayed(function(data) {
			assertEqual(data.name, "Peter")
			assertTrue(data instanceof S_MVC_AB)
			assertTrue(data.valid)
			assertEqual(data.other, "Aloha")
		})
	})
}

window.testSpringMvcBeanConverter = function() {	
	SpringBeanConverter.simple({
		callback: createDelayed(function(data) {
			assertEqual(data, "Hi Peter")
		})
	})
}

window.testSpringMvcParameterizedConverter = function() {	
	OtherSpringBeanConverter.check({
		callback: createDelayed(function(data) {
			assertEqual(data, "The number is 5")
		})
	})
}

window.testSpringMvcGenericProxy = function() {
	bean = new S_MVC_AB
	bean.name = "Mary"
	GenericProxy.convert(1, [bean], {
		callback: createDelayed(function(data) {
			assertEqual(data[0].name, "Mary")
		})
	})
}