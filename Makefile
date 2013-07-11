TESTS = test/test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =
COMPONENT = ./node_modules/.bin/component

build: index.js components
	@$(COMPONENT) build --dev

components: component.json
	@$(COMPONENT) install --dev

clean:
	@rm -rf components build

install-test:
	@NODE_ENV=test npm install 

test: install-test
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@rm -rf coverage.html
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov > coverage.html
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=travis-cov
	@ls -lh coverage.html

test-all: test test-component test-cov

test-component: build
	@./node_modules/.bin/mocha-phantomjs test/test_component.html

test-component-browser:
	@open test/test_component.html

.PHONY: clean test
