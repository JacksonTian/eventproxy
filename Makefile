TESTS = test/test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =
ISTANBUL = ./node_modules/.bin/istanbul
MOCHA = ./node_modules/.bin/_mocha

clean:
	@rm -rf build coverage node_modules

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

test-all: test-cov

autod: install-test
	@./node_modules/.bin/autod -w -e components,build
	@$(MAKE) install-test

contributors: install-test
	@./node_modules/.bin/contributors -f plain -o AUTHORS

.PHONY: clean test
