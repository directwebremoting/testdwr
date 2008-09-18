createTestGroup("SpringMvc");

function testSpringMvcEcho() {
	SpringMvcAnnotated.echo("hello world", {
		callback:createDelayed(function(data) {
			assertEqual(data.name, "echoed by DWR Spring Mvc [hello world]");
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