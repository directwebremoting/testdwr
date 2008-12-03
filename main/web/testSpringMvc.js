createTestGroup("SpringMvc");

function testSpringMvcEcho() {
	SpringMvcAnnotated.echo("hello world", "  en_US  ", "USD", {
		callback:createDelayed(function(data) {
			assertEqual(data.name, "echoed by DWR Spring Mvc [hello world]");
			assertEqual(data.locale, "en_US");
			assertEqual(data.currency, "EUR");
		})
	})
}

function testSpringMvcCustomEcho() {
	DemoName.echo("hello world", {
		callback:createDelayed(function(data) {
			assertEqual(data.name, "echoed by DemoName [hello world]");
		})
	})
}

function testSpringMvcLazy() {
	Lazy.name("Peter", {
		callback: createDelayed(function(data) {
			assertEqual(data.name, "Peter")
		})
	})
}

function testSpringMvcProxyReference() {
	Calculator.add(3, 5, {
		callback: createDelayed(function(data) {
			assertEqual(data, 8)
		})
	})
}

function testSpringMvcRandom() {
	Generator.random({
		callback: createDelayed(function(data) {
			assertTrue(data == -1.9)
		})
	})
}

function testSpringMvcGiver() {
	Giver.giveMe({
		callback: createDelayed(function(data) {
			assertTrue(data == "some data")
		})
	})
}

function testSpringMvcAnnotatedConverter() {
	AnnotatedConverter.name("Peter", {
		callback: createDelayed(function(data) {
			assertEqual(data.name, "Peter")
			assertTrue(data instanceof S_MVC_AB)
			assertTrue(data.valid)
		})
	})
}

function testSpringMvcBeanConverter() {	
	SpringBeanConverter.simple({
		callback: createDelayed(function(data) {
			assertEqual(data, "Hi Peter")
		})
	})
}

function testSpringMvcGenericProxy() {
	bean = new S_MVC_AB
	GenericProxy.convert(1, [bean], {
		callback: createDelayed(function(data) {
			alert(data)
			assertEqual(data.length, 1)
		})
	})
}