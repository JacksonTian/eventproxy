TESTS = test/test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =
COMPONENT = ./node_modules/.bin/component
ISTANBUL = ./node_modules/.bin/istanbul
MOCHA = ./node_modules/.bin/_mocha

build: index.js components
	@$(COMPONENT) build --dev

components: component.json
	@$(COMPONENT) install --dev

clean:
	@rm -rf components build

install-test:
	@NODE_ENV=test npm install --registry=http://r.cnpmjs.org

test: install-test
	@NODE_ENV=test $(MOCHA) \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov: install-test
	@$(ISTANBUL) cover --report html $(MOCHA) -- -R $(REPORTER) $(TESTS)

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
