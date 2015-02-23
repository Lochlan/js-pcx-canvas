# functions

# $(call filter-partials,file-list)
# Removes underscore-prefixed files from file-list
define filter-partials
	$(foreach file,\
		$1,\
		$(eval FILE=$(notdir $(file)))\
			$(if $(FILE:_%=),$(file)))
endef

# settings
SRC_HBS_PATH = src/handlebars
SRC_HBS = $(shell find $(SRC_HBS_PATH) -type f -name '*.hbs')
BUILD_HBS_PATH = src/js/templates
BUILD_HBS = $(subst $(SRC_HBS_PATH),$(BUILD_HBS_PATH),$(SRC_HBS:.hbs=.js))

SRC_JS_PATH = src/js
SRC_JS = $(addprefix $(SRC_JS_PATH)/,\
	vendor/require.js\
	main.js\
	)
BUILD_JS_PATH = static/js
BUILD_JS = $(subst $(SRC_JS_PATH),$(BUILD_JS_PATH),$(SRC_JS))

SRC_SCSS_PATH = src/scss
SRC_SCSS = $(shell find $(SRC_SCSS_PATH) -type f -name '*.scss')
BUILD_CSS_PATH = static/css
BUILD_CSS = $(call filter-partials,\
	$(subst $(SRC_SCSS_PATH),$(BUILD_CSS_PATH),$(SRC_SCSS:.scss=.css)))

SRC_SCSS_VENDOR_PATH = $(SRC_SCSS_PATH)/vendor
SRC_SCSS_VENDOR = $(SRC_SCSS_VENDOR_PATH)/_normalize.scss
SRC_JS_VENDOR_PATH = $(SRC_JS_PATH)/vendor
SRC_JS_VENDOR = $(addprefix $(SRC_JS_VENDOR_PATH)/,\
	backbone.js\
	handlebars.runtime.amd.js\
	jquery.js\
	require.js\
	underscore.js\
	)

# targets

all: deps lint test build

build: build-handlebars $(BUILD_CSS) $(BUILD_JS)
build-handlebars: $(BUILD_HBS)

clean:
	rm -rfv $(BUILD_HBS_PATH)/*
	rm -rfv $(BUILD_CSS_PATH)/*
	rm -rfv $(BUILD_JS_PATH)/*

deps: deps-node deps-ruby
deps-node: node_modules $(SRC_SCSS_VENDOR) $(SRC_JS_VENDOR)
deps-ruby: makedeps/gemfile.d

distclean: clean
	rm -rfv node_modules
	rm -rfv $(SRC_SCSS_VENDOR_PATH)/*
	rm -rfv $(SRC_JS_VENDOR_PATH)/*

lint: lint-js lint-travis
lint-js: deps-node makedeps/jshint.d
lint-travis: deps-ruby makedeps/travis-lint.d

test: deps-node build-handlebars
	./node_modules/karma/bin/karma start

# file rules

$(BUILD_CSS_PATH)/%.css: $(SRC_SCSS_PATH)/%.scss $(SRC_SCSS)
	mkdir -p "$(@D)"
	sass --style compressed -I $(SRC_SCSS_PATH) -r sass-import_once $< $@

$(BUILD_HBS_PATH)/%.js: $(SRC_HBS_PATH)/%.hbs
	mkdir -p "$(@D)"
	./node_modules/.bin/handlebars $? --output $@ --amd

$(BUILD_JS_PATH)/%.js: node_modules $(shell find $(SRC_JS_PATH) -type f -name '*.js')
	mkdir -p "$(@D)"
	./node_modules/.bin/r.js -o build-config.js name=$(basename $(@:$(BUILD_JS_PATH)/%=%)) out=$@

$(BUILD_JS_PATH)/require.js: node_modules
	mkdir -p "$(@D)"
	cp ./node_modules/requirejs/require.js $@

$(SRC_JS_VENDOR_PATH)/backbone.js: node_modules/backbone/backbone.js
$(SRC_JS_VENDOR_PATH)/handlebars.runtime.amd.js: node_modules/handlebars/dist/handlebars.runtime.amd.js
$(SRC_JS_VENDOR_PATH)/jquery.js: node_modules/jquery/dist/jquery.js
$(SRC_JS_VENDOR_PATH)/require.js: node_modules/requirejs/require.js
$(SRC_JS_VENDOR_PATH)/underscore.js: node_modules/underscore/underscore.js
$(SRC_SCSS_VENDOR_PATH)/_normalize.scss: node_modules/normalize.css/normalize.css
$(SRC_JS_VENDOR) $(SRC_SCSS_VENDOR):
	mkdir -p "$(@D)"
	cp $? $@

node_modules: package.json
	npm install
	touch $@

makedeps/gemfile.d: Gemfile
	mkdir -p "$(@D)"
	bundle install
	touch $@

makedeps/jshint.d: .jshintignore .jshintrc $(shell find $(SRC_JS_PATH) -type f -name '*.js')
	./node_modules/.bin/jshint $(SRC_JS_PATH)
	touch $@

makedeps/travis-lint.d: .travis.yml
	travis-lint
	touch $@
