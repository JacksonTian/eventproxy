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
	@NODE_ENV=test npm install --registry=http://r.cnpmjs.org

test: install-test
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov: install-test
	@$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov | ./node_modules/.bin/cov

cov: test-cov

test-all: test test-component test-cov

test-component: build
	@./node_modules/.bin/mocha-phantomjs test/test_component.html

test-component-browser:
	@open test/test_component.html

totoro: install-test build
	@./node_modules/.bin/totoro --runner=test/test_component.html

autod: install-test
	@./node_modules/.bin/autod -w -e components,build
	@$(MAKE) install-test

contributors: install-test
	@./node_modules/.bin/contributors -f plain -o AUTHORS

.PHONY: clean test
