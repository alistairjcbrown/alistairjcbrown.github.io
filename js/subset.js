// http://jsfiddle.net/alistairjcbrown/ma4mh/
(function(document) {
    "use strict";

    var CharactersInUse = function() {
        // Private functions
        var _getType, _getStyleContentProperties, _getCssContentValues,
            _getBodyText;

        /*
         * _getType
         *
         * Helper function to return the type of a variable
         */
        _getType = function(value) {
            return Object.prototype.toString.call(value).slice(8, -1);
        },

        /*
         * _getStyleContentProperties
         *
         * Return an array of CSS content values
         */
        _getStyleContentProperties = function(css_rules) {
            var styles = [],
                nested_css_rules, i, j;

            // Bail if we haven't been given a rule list
            if (_getType(css_rules) !== "CSSRuleList") {
                return styles;
            }

            for (i = 0; i < css_rules.length; i++) {
                if (_getType(css_rules[i].style) === "CSSStyleDeclaration") {
                    for (j = 0; j < css_rules[i].style.length; j++) {
                        if (css_rules[i].style[j] === "content") {
                            styles.push(css_rules[i].style[css_rules[i].style[j]]);
                        }
                    }
                }

                // Check if there are nested rules
                nested_css_rules = css_rules[i].rules || css_rules[i].cssRules;
                if (_getType(nested_css_rules) === "CSSRuleList") {
                    styles = styles.concat(_getStyleContentProperties(nested_css_rules));
                }
            }

            return styles;
        },

        /*
         * _getCssContentValues
         *
         * Returns a string built of all CSS content values
         */
        _getCssContentValues = function() {
            var style_sheets = document.styleSheets,
                css_content_values = "",
                css_rules, style_content_properties, content_value, i, j;

            for (i = 0; i < style_sheets.length; i++) {
                css_rules = style_sheets[i].rules || style_sheets[i].cssRules;

                // Bail on style_sheets with no rules (eg. web-font style sheet)
                if (_getType(css_rules) === "Null") {
                    continue;
                }

                style_content_properties = _getStyleContentProperties(css_rules);
                for (j = 0; j < style_content_properties.length; j++) {
                    // Clean up the content value if it has escaped single quotes
                    content_value = style_content_properties[j].slice(1, -1).replace(/\\'/g, "'");
                    css_content_values += content_value;
                }
            }

            return css_content_values;
        },

        /*
         * _getBodyText
         *
         * Returns a string built of the body content
         */
        _getBodyText = function() {
            var body = document.getElementsByTagName("body")[0],
                body_content = body.cloneNode(true),
                script_tags = body_content.getElementsByTagName("script");

            // Remove all script tags
            while (script_tags[0]) {
                body_content.removeChild(script_tags[0]);
            }

            // Return the text of the body
            return body_content.textContent.trim();
        },

        /*
         * getList
         *
         * Returns a string built of unique characters used by the current page
         */
        this.getList = function() {
            var subset = [],
                body_text, css_content, page_content, i;

            // Get the contents of the page
            body_text = _getBodyText(),
            css_content = _getCssContentValues(),
            page_content = body_text + "" + css_content;

            for (i = 0; i < page_content.length; i++) {
                // Ignore whitespace
                if (page_content[i].trim().length === 0) {
                    continue;
                }

                // Save only new characters
                if (subset.indexOf(page_content[i]) === -1) {
                    subset.push(page_content[i]);
                }
            }

            // Sort the array to prevent data leaking
            // and convert to string
            subset = subset.sort().join("");

            return subset;
        };

    };

    // ----

    // Add open sans font from Google with subsetting
    (function() {
        var head = document.getElementsByTagName("head")[0],
            open_sans_css = "//fonts.googleapis.com/css?family=Open+Sans:400normal,300normal,700normal,600normal",
            subset = encodeURIComponent(new CharactersInUse().getList());

        head.innerHTML += "<link href=\"" + open_sans_css + "&text=" + subset + "\" rel=\"stylesheet\" type=\"text/CSS\">";
    })();

})(document);