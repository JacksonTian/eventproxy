TESTS = test/test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =

build: index.js components
	@component build --dev

components: component.json
	@component install --dev

clean:
	@rm -rf components build

install-test:
	@NODE_ENV=test npm install 

test: install-test
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov:
	@rm -rf coverage.html
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov > coverage.html
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=travis-cov
	@ls -lh coverage.html

test-all: test test-cov

test-component: build
	@open test/test_component.html

.PHONY: build components clean install-test test test-cov test-all
