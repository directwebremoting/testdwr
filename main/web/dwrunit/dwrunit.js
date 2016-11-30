
//-----------------------------------------------------------------------------
// DWRUnit core functionality
//-----------------------------------------------------------------------------

dwrunit = (function() {

	function DelegateMethodsToMember(constructor, delegatetomember, methodnames) {
		for(var i=0; i<methodnames.length; i++) {
			(function() {
				var methodname = methodnames[i];
				constructor.prototype[methodname] = function() {
					var delegateto = this[delegatetomember];
					if (delegateto == null) {
						throw new Error("Cannot delegate to null member '" + delegatetomember + "' in '" + this.constructor.name + "'");
					}
					if (delegateto[methodname] == null)  {
						throw new Error("Cannot delegate to null method '" + methodname + "' in '" + delegateto.constructor.name + "'");
					}
					return delegateto[methodname].apply(delegateto, arguments);
				}
			})();
		}
	}	

	//-------------------------------------------------------------------------

	// -----------------------------------------------------------------
	// This is the way one would want to do here, but Firefox breaks the 
	// rules for synchronous XHR event order and may trigger one test
	// function inside another.
	// var _activeTestRun = null;
	// var _activeTestRunRecursions = 0;
	// -----------------------------------------------------------------

	var _activeTestRun = null;
	var _activeTestRunStack = [];

	//-------------------------------------------------------------------------

	/**
	 * TestRunner._tests{} -> TestCase*
	 * TestCase._func(TestCaseRun)
	 * TestCaseRun -> TestCase
	 * 
	 * 
	 * TestCase <- TestRun   <- TestRunFacade    <- test_function
	 * .name       .testcase    .testrun
	 * .func       .statuscb <- TestStatusFacade <- status_callback
	 * .data       .status      .testrun
	 *             .errors
	 */
	var TestRunner = function DwrUnitTestRunner() {
		this._tests = {};
	};
	
	TestRunner.prototype._tests = null;

	//
	// API to handle tests
	//
	
	/**
	 * 
	 */
	TestRunner.prototype.addTest = function(name, func, data) {
		if (this._tests[name] != null) {
			throw new Error("A test with name '" + name + "' already exists.");
		}
		this._tests[name] = new TestCase(name, func, data);
	};

	/**
	 * 
	 */	
	TestRunner.prototype.getTestNames = function() {
		var names = [];
		for(var name in this._tests) {
			names.push(name);
		}
		return names;
	};
	
	/**
	 * testnames: [string, string, ...]
	 * options: {
	 *   startCallback: function(testStatus)
	 *   statusCallback: function(testStatus)
	 *   completionCallback: function()
	 *   concurrency: Number
	 *   timeout: Number
	 * }
	 */
	TestRunner.prototype.runTests = function(testnames, options) {
		var names;
		if (typeof testnames == "string") {
			names = [ testnames ];
		} else {
			names = testnames;
		}
		var concurrency = options.concurrency || 3;
		var pause = options.pause || 0;
		var timeout = options.timeout || 10000;

		var total = names.length;
		var started = 0;
		var completed = 0;
		var loop = true;
		var done = false;
		var runner = this;

		// Start initially as many we are allowed to according to concurrency
		for(var i=0; i<Math.min(total, concurrency); i++) {
			runNextTest();
		}

		function runNextTest() {
			if (started == total) return;
			started++;
			var name = names[started-1];
			var test = runner._tests[name];
			// Start new test
			test.run(options.startCallback, testComplete, timeout);
		}
		
		function testComplete(ts) {
			// Test is done, update its status
			if (options.statusCallback) options.statusCallback(ts);
			completed++;
			// Decide what to do
			if (completed == total) {
				// Test run is complete so update its status
				if (options.completionCallback) options.completionCallback();
			} else {
				// Invoke the next test if there is one
				setTimeout(runNextTest, pause);
			}
		}
	};
	
	TestRunner.prototype.getRunningTest = function() {
		return _activeTestRun.getRunFacade();
	};

	//
	// API used by test cases
	//

	/**
	 * Overloaded versions:
	 *   waitAsync(function)
	 *   waitAsync(completor, function)
	 */
	TestRunner.prototype.waitAsync = function(arg1, arg2) {
		this._assertActiveTestRun();
		return _activeTestRun.waitAsync(arg1, arg2);
	};

	/**
	 * 
	 */
	TestRunner.prototype.assert = function(status, message) {
		this._assertActiveTestRun();
		return _activeTestRun.assert(status, message);
	};

	/**
	 * 
	 */
	TestRunner.prototype.verify = function(status, message) {
		this._assertActiveTestRun();
		return _activeTestRun.verify(status, message);
	};

	/**
	 * 
	 */
	TestRunner.prototype.fail = function(message) {
		this._assertActiveTestRun();
		return _activeTestRun.fail(message);
	};

	/**
	 * 
	 */
	TestRunner.prototype._assertActiveTestRun = function() {
		if (_activeTestRun == null) {
			throw new BadTestCaseError("Not possible to access tests outside test functions (did you forget to wrap an asynchronous test function with waitAsync or similar?).");
		}
	};

	//-------------------------------------------------------------------------

	/**
	 * 
	 */
	var TestCase = function DwrUnitTestCase(name, func, data) {
		this._name = name;
		this._func = func;
		this._data = data;
	};

	TestCase.prototype._name = "";

	TestCase.prototype._func = null;

	TestCase.prototype._data = undefined;

	TestCase.prototype.getName = function() {
		return this._name;
	};
	
	TestCase.prototype.getFunction = function() {
		return this._func;
	};
	
	TestCase.prototype.getData = function() {
		return this._data;
	};
	
	/**
	 * 
	 */
	TestCase.prototype.run = function(startcb, statuscb, timeout) {
		new TestRun(this, startcb, statuscb, timeout);
	};

	//-------------------------------------------------------------------------

	/**
	 * 
	 */
	var TestRun = function DwrUnitTestRun(testcase, startcb, statuscb, timeout) {
		// Initialize
		this._testcase = testcase;
		this._statuscb = statuscb;
		this._runfacade = new TestRunFacade(this);
		this._statusfacade = new TestStatusFacade(this);
		this._completors = [];
		// Setup timeout to catch hung tests
		if (timeout) {
			var testrun = this;
			this._timeoutid = setTimeout(
				function() {
					testrun._recordError(new BadTestCaseError("Test not completed within configured timeout of " + timeout + " milliseconds."));
					testrun._incompletecount = 0;
					testrun._handleCompletion();
				},
				timeout
			);
		}
		// Run
		testrun._incompletecount++;
		startcb.call(null, this._statusfacade);
		this._executeTestFunction(null, this._testcase.getFunction(), [this._runfacade]);
		testrun._incompletecount--;
		this._handleCompletion();
	};

	TestRun.prototype._testcase = null;
	
	TestRun.prototype._statuscb = null;

	TestRun.prototype._runfacade = null;

	TestRun.prototype._statusfacade = null;

	TestRun.prototype._completors = null;

	TestRun.prototype._timeoutid = null;

	TestRun.prototype._incompletecount = 0;

	TestRun.prototype._complete = false;

	TestRun.prototype._status = null;

	TestRun.prototype._errors = null;

	//
	// API to handle tests
	//

	TestRun.prototype.getRunFacade = function() { 
		return this._runfacade; 
	};

	TestRun.prototype.isComplete = function() { 
		return this._complete; 
	};

	TestRun.prototype.isPassed = function() { 
		return this._status === true; 
	};

	TestRun.prototype.isFailed = function() { 
		return this._status === false; 
	};

	TestRun.prototype.getErrors = function() { 
		return this._errors; 
	};

	TestRun.prototype.getMessages = function() {
		var messages = [];
		for(var i=0; i<this._errors.length; i++) messages.push(this._errors[i].message); 
		return messages; 
	};

	//
	// API used by test cases
	//
	
	/**
	 * Overloaded versions:
	 *   waitAsync()
	 *   waitAsync(function)
	 *   waitAsync(completor)
	 *   waitAsync(completor, function)
	 *   waitAsync(function, completor)
	 */
	TestRun.prototype.waitAsync = function(varargs) {
		// Get completor and function from overloaded args
		var completor;
		var func;
		function checkArg(p) {
			if (p && typeof p == "object") {
				completor = p;
			} else if (typeof p == "function") {
				func = p;
			}
		}
		checkArg(arguments[0]);
		checkArg(arguments[1]);
		if (!completor) completor = new SingleAsyncCompletor;

		// Check if this is a new completor not already registered
		var newcompletor = true;
		for(var i=0; i<this._completors.length; i++) {
			if (this._completors[i] == completor) newcompletor = false;
		}
	
		// Handle new completor
		if (newcompletor) {
			if (completor.isComplete()) throw new BadTestCaseError("New completors are not allowed to start out with completed status.");
			this._completors.push(completor);
			this._incompletecount++;
		}
		
		// Return new function that will activate test and handle completor
		var savedtestrun = this;		
		return function() {
			var scope = this; // Used by scoped DWR callbacks
			var completebefore = completor.isComplete();
			try {
				completor.beginAsync();
				savedtestrun._executeTestFunction(scope, func, arguments);
				completor.endAsync();
			} catch(cause) {
				var ex = new BadTestCaseError("Test '" + savedtestrun.getName() + "' threw exception (" + cause.name + ": " + cause.message + ").");
				ex.cause = cause;
				if (!savedtestrun.isComplete()) {
					savedtestrun._recordError(cause);
					savedtestrun._recordError(ex);
				} else {
					throw ex;
				}
			} finally {
				if (!completebefore && completor.isComplete()) {
					savedtestrun._incompletecount--;
					savedtestrun._handleCompletion();
				}
			}
		}
	};

	TestRun.prototype.assert = function(status, message) {
		if (!status) throw new AssertionError(message);
	};

	TestRun.prototype.verify = function(status, message) {
		if (!status) this._recordError(new AssertionError(message));
	};

	TestRun.prototype.fail = function(message) {
		this._recordError(new AssertionError(message));
	}

	//
	// Delegated methods
	//
	
	DelegateMethodsToMember(TestRun, "_testcase", ["getName", "getData"]);
	
	//
	// Internal methods
	//
	
	TestRun.prototype._executeTestFunction = function(scope, func, args) {
		// -----------------------------------------------------------------
		// This is the way one would want to do here, but Firefox breaks the 
		// rules for synchronous XHR event order and may trigger one test
		// function inside another.
		// if (_activeTestRunRecursions == 0) {
		// 	_activeTestRun = this;
		// } else if (_activeTestRun != this) {
		// 	this._recordError(new BadTestCaseError("Test function invoked in wrong context (did you forget to wrap an asynchronous test function with waitAsync or similar?)."));
		// 	return;
		// }
		// _activeTestRunRecursions++;
		// -----------------------------------------------------------------

		_activeTestRunStack.push(this);
		_activeTestRun = this;
		
		try {
			if (func) func.apply(scope, args);
		} catch(error) {
			this._recordError(error);
		}

		_activeTestRunStack.pop();
		var level = _activeTestRunStack.length;
		_activeTestRun = (level > 0 ? _activeTestRunStack[level-1] : null);

		// -----------------------------------------------------------------
		// This is the way one would want to do here, but Firefox breaks the 
		// rules for synchronous XHR event order and may trigger one test
		// function inside another.
		// _activeTestRunRecursions--;
		// if (_activeTestRunRecursions == 0) {
		// 	_activeTestRun = null;
		// }
		// -----------------------------------------------------------------
	}
	
	TestRun.prototype._recordError = function(error) {
		if (this.isPassed()) throw new BadTestCaseError("Inconsistent status for test '" + this.getName() + "' (new error: " + error.name + ": " + error.message + ").");
		if (!this._errors) this._errors = [];
		this._errors.push(error);
		this._status = false;
	}

	TestRun.prototype._handleCompletion = function() {
		if (this._incompletecount == 0) {
			if (this.isComplete()) {
				throw new BadTestCaseError("Multiple completions for test '" + this.getName() + "'");
			}

			// Status defaults to true if no failure recorded
			if (!this.isFailed()) this._status = true;

			if (this._timeoutid) clearTimeout(this._timeoutid);

			this._complete = true;
			this._statuscb.call(null, this._statusfacade);
		}
	}
	
	//-------------------------------------------------------------------------

	/**
	 * 
	 */
	var TestRunFacade = function DwrUnitTestRunFacade(testrun) {
		this._testrun = testrun;
	};

	TestRunFacade.prototype._testrun = null;

	DelegateMethodsToMember(TestRunFacade, "_testrun", ["getName", "getData"]);
	
	//-------------------------------------------------------------------------

	/**
	 * 
	 */
	var TestStatusFacade = function DwrUnitTestStatusFacade(testrun) {
		this._testrun = testrun;
	};

	TestStatusFacade.prototype._testrun = null;

	DelegateMethodsToMember(TestStatusFacade, "_testrun", ["getName", "getData", "isPassed", "isFailed", "getErrors", "getMessages"]);

	//-------------------------------------------------------------------------

	var ExplicitAsyncCompletor = function DwrUnitExplicitAsyncCompletor() {} 

	ExplicitAsyncCompletor.prototype._complete = false;
	
	ExplicitAsyncCompletor.prototype.beginAsync = function() {};
	
	ExplicitAsyncCompletor.prototype.endAsync = function() {};
	
	ExplicitAsyncCompletor.prototype.isComplete = function() {
		return this._complete;
	};
	
	ExplicitAsyncCompletor.prototype.complete = function() {
		if (this._complete) throw new BadTestCaseError("Attempt to complete " + this.constructor.name + " multiple times.");
		this._complete = true;
	};
	
	//-------------------------------------------------------------------------

	var SingleAsyncCompletor = function DwrUnitSingleAsyncCompletor() {} 

	SingleAsyncCompletor.prototype._complete = false;
	
	SingleAsyncCompletor.prototype.beginAsync = function() {};
	
	SingleAsyncCompletor.prototype.endAsync = function() {
		if (this._complete) throw new BadTestCaseError("Attempt to complete " + this.constructor.name + " multiple times.");
		this._complete = true;
	};
	
	SingleAsyncCompletor.prototype.isComplete = function() {
		return this._complete;
	};
	
	//-------------------------------------------------------------------------

	var AssertionError = function DwrUnitAssertionError(cause) {
		var err = new Error(cause instanceof Error ? cause.message : cause);
		if (cause instanceof Error) {
			err.cause = cause;
		}
		err.name = "AssertionError";
		err.toString = function(){return this.name + ": " + this.message;};
		return err;
	};
	
	//-------------------------------------------------------------------------

	var BadTestCaseError = function DwrUnitBadTestCaseError(cause) {
		var err = new Error(cause instanceof Error ? cause.message : cause);
		if (cause instanceof Error) {
			err.cause = cause;
		}
		err.name = "BadTestCaseError";
		err.toString = function(){return this.name + ": " + this.message;};
		return err;
	};
	
	//-------------------------------------------------------------------------

	/*
	 * 
	 */
	var retval = new TestRunner();
	retval.TestRunner = TestRunner;
	retval.ExplicitAsyncCompletor = ExplicitAsyncCompletor;
	retval.SingleAsyncCompletor = SingleAsyncCompletor;
	return retval;

})();
