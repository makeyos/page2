/**
 * Accessible address autocomplete UI for the PostCoder Web API from Allies Computing
 * Heavily based on Awesomplete by Lea Verou http://leaverou.github.io/awesomplete
 * @author Allies Computing https://www.alliescomputing.com
 * MIT license
 */
(function () {

    var _ = function (input, o) {
        var me = this;

        // Keep track of number of instances for unique IDs
        AlliesComplete.numInstances = (AlliesComplete.numInstances || 0) + 1;

        // Setup

        this.isOpened = false;

        this.input = $(input);
        this.input.setAttribute("autocomplete", "off");
        this.input.setAttribute("autocorrect", "off");
        this.input.setAttribute("autocapitalize", "off");
        this.input.setAttribute("spellcheck", "false");
        this.input.setAttribute("aria-owns", "allies_complete_list_" + AlliesComplete.numInstances);
        this.input.setAttribute("role", "combobox");

        o = o || {};

        // Default options
        configure(this, {
            apiKey: "PCW45-12345-12345-1234X",  // This is the test key (Locked to addresses in the NR14 7PZ postcode)
            endpoint: "address",                // Endpoint to get final address data from when user selects an address from list
            addresslines: 2,                    // Number of address lines to split elements over
            excludeFields: "organisation",      // Comma seperated list of fields to exclude from address lines output
            maxItems: 10                        // How many items to show in list below search box
        }, o);

        this.index = -1;

        this.minChars = 3;

        // Create necessary elements

        this.container = $.create("div", {
            className: "allies-complete",
            around: input
        });

        this.ul = $.create("ul", {
            hidden: "hidden",
            role: "listbox",
            id: "allies_complete_list_" + AlliesComplete.numInstances,
            inside: this.container
        });

        this.status = $.create("span", {
            className: "visually-hidden",
            role: "status",
            id: "allies_complete_status_" + AlliesComplete.numInstances,
            "aria-live": "assertive",
            "aria-relevant": "all",
            "aria-atomic": true,
            inside: this.container,
            textContent: this.minChars != 0 ? ("Type " + this.minChars + " or more characters for results.") : "Begin typing for results."
        });

        this.error = $.create("div", {
            className: "allies-complete-error",
            role: "alert",
            id: "allies_complete_error_" + AlliesComplete.numInstances,
            "aria-relevant": "additions text",
            textContent: "",
            hidden: "hidden",
            inside: this.container
        });

        // Bind events

        this._events = {
            input: {
                "input": this.evaluate.bind(this),
                "blur": this.close.bind(this, {
                    reason: "blur"
                }),
                "keydown": function (evt) {
                    var c = evt.keyCode;

                    // If the dropdown `ul` is in view, then act on keydown for the following keys:
                    // Enter / Esc / Up / Down
                    if (me.opened) {
                        if (c === 13 && me.selected) { // Enter
                            evt.preventDefault();
                            me.select();
                        } else if (c === 27) { // Esc
                            me.close({
                                reason: "esc"
                            });
                        } else if (c === 38 || c === 40) { // Down/Up arrow
                            evt.preventDefault();
                            me[c === 38 ? "previous" : "next"]();
                        }
                    }
                },
                "keyup": function (evt) {

                    var c = evt.keyCode;

                    var autocomplete_url = "https://ws.postcoder.com/pcw/" + me.apiKey + "/autocomplete/v2/uk/";

                    // Arrows, Esc, Enter
                    if (c !== 37 && c !== 38 && c !== 39 && c !== 40 && c !== 27 && c !== 13) {

                        if (me.input.value.trim().length >= me.minChars) {

                            var request = new XMLHttpRequest();
                            request.open('GET', autocomplete_url + encodeURIComponent(me.input.value.trim()) + "?format=json", true);

                            request.onload = function () {
                                if (request.status >= 200 && request.status < 400) {

                                    var data = JSON.parse(request.responseText);

                                    if (data.predictions.length > 0) {

                                        clear_error(me);

                                        var ajax_list = [];

                                        for (i = 0; i < data.predictions.length; i++) {
                                            var item = {
                                                label: data.predictions[i].prediction,
                                                value: data.predictions[i].refs
                                            };
                                            ajax_list.push(item);
                                        }

                                        me.list = ajax_list;
                                        me.evaluate();

                                    } else {

                                        show_error(me, "No address results found");
                                        me.close({
                                            reason: "nomatches"
                                        });

                                    }

                                } else {

                                    show_error(me, "Error from API");

                                }
                            };

                            request.onerror = function() {

                                show_error(me, "Connection error");

                            };

                            request.send();
                        }
                    }
                }
            },
            form: {
                "submit": this.close.bind(this, {
                    reason: "submit"
                })
            },
            ul: {
                "mousedown": function(evt) {
                    var li = evt.target;

                    if (li !== this) {

                        while (li && !/li/i.test(li.nodeName)) {
                            li = li.parentNode;
                        }

                        if (li && evt.button === 0) { // Only select on left click
                            evt.preventDefault();
                            me.select(li, evt.target);
                        }
                    }
                }
            }
        };

        $.bind(this.input, this._events.input);
        $.bind(this.input.form, this._events.form);
        $.bind(this.ul, this._events.ul);

        if (this.input.hasAttribute("list")) {
            this.list = "#" + this.input.getAttribute("list");
            this.input.removeAttribute("list");
        } else {
            this.list = this.input.getAttribute("data-list") || o.list || [];
        }

        _.all.push(this);
    };

    _.prototype = {
        set list(list) {
            if (Array.isArray(list)) {
                this._list = list;
            } else if (typeof list === "string" && list.indexOf(",") > -1) {
                this._list = list.split(/\s*,\s*/);
            } else { // Element or CSS selector
                list = $(list);

                if (list && list.children) {
                    var items = [];
                    slice.apply(list.children).forEach(function(el) {
                        if (!el.disabled) {
                            var text = el.textContent.trim();
                            var value = el.value || text;
                            var label = el.label || text;
                            if (value !== "") {
                                items.push({
                                    label: label,
                                    value: value
                                });
                            }
                        }
                    });
                    this._list = items;
                }
            }

            if (document.activeElement === this.input) {
                this.evaluate();
            }
        },

        get selected() {
            return this.index > -1;
        },

        get opened() {
            return this.isOpened;
        },

        close: function(o) {
            if (!this.opened) {
                return;
            }

            this.ul.setAttribute("hidden", "");
            this.isOpened = false;
            this.index = -1;

            $.fire(this.input, "allies-complete-close", o || {});
        },

        open: function() {
            this.ul.removeAttribute("hidden");
            this.isOpened = true;

            $.fire(this.input, "allies-complete-open");
        },

        destroy: function() {
            //remove events from the input and its form
            $.unbind(this.input, this._events.input);
            $.unbind(this.input.form, this._events.form);

            //move the input out of the allies-complete container and remove the container and its children
            var parentNode = this.container.parentNode;

            parentNode.insertBefore(this.input, this.container);
            parentNode.removeChild(this.container);

            //remove autocomplete and aria-autocomplete attributes
            this.input.removeAttribute("autocomplete");
            this.input.removeAttribute("aria-autocomplete");

            //remove this awesomeplete instance from the global array of instances
            var indexOfAlliesComplete = _.all.indexOf(this);

            if (indexOfAlliesComplete !== -1) {
                _.all.splice(indexOfAlliesComplete, 1);
            }
        },

        next: function() {
            var count = this.ul.children.length;
            this.goto(this.index < count - 1 ? this.index + 1 : (count ? 0 : -1));
        },

        previous: function() {
            var count = this.ul.children.length;
            var pos = this.index - 1;

            this.goto(this.selected && pos !== -1 ? pos : count - 1);
        },

        // Should not be used, highlights specific item without any checks!
        goto: function(i) {
            var lis = this.ul.children;

            if (this.selected) {
                lis[this.index].setAttribute("aria-selected", "false");
            }

            this.index = i;

            if (i > -1 && lis.length > 0) {
                lis[i].setAttribute("aria-selected", "true");

                this.status.textContent = lis[i].textContent + ", list item " + (i + 1) + " of " + lis.length;

                this.input.setAttribute("aria-activedescendant", this.ul.id + "_item_" + this.index);

                // scroll to highlighted element in case parent's height is fixed
                this.ul.scrollTop = lis[i].offsetTop - this.ul.clientHeight + lis[i].clientHeight;

                $.fire(this.input, "allies-complete-highlight", {
                    text: this.suggestions[this.index]
                });
            }
        },

        select: function(selected, origin) {
            if (selected) {
                this.index = $.siblingIndex(selected);
            } else {
                selected = this.ul.children[this.index];
            }

            if (selected) {
                var suggestion = this.suggestions[this.index];

                var allowed = $.fire(this.input, "allies-complete-select", {
                    text: suggestion,
                    origin: origin || selected
                });

                if (allowed) {
                    this.close({
                        reason: "select"
                    });

                    place_url = "https://ws.postcoder.com/pcw/" + this.apiKey + "/" + this.endpoint + "/uk/" + encodeURIComponent(this.input.value);

                    data = "?udprn=" + encodeURIComponent(suggestion.value) + "&lines=" + this.addresslines + "&exclude=" + this.excludeFields + "&format=json";

                    var request = new XMLHttpRequest();
                    request.open('GET', place_url + data, true);

                    var that = this;

                    request.onload = function() {
                        if (request.status >= 200 && request.status < 400) {

                            clear_error(that);

                            data = JSON.parse(request.responseText);

                            $.fire(that.input, "allies-complete-selectcomplete", {
                                text: suggestion,
                                address: data[0]
                            });

                            that.status.textContent = "Address selected and address fields have been populated";

                        } else {

                            show_error(that, "Error from API");

                        }
                    };

                    request.onerror = function() {

                        show_error(that, "Connection error");

                    };

                    request.send();
                }
            }
        },

        evaluate: function() {
            var me = this;
            var value = this.input.value;

            if (value.length >= this.minChars && this._list.length > 0) {
                this.index = -1;
                // Populate list with options that match
                this.ul.innerHTML = "";

                this.suggestions = this._list
                    .map(function(item) {
                        return new Suggestion(item);
                    });

                this.suggestions = this.suggestions.slice(0, this.maxItems);

                this.suggestions.forEach(function(text, index) {

                    var input_array = value.trim().split(" ");

                    // Escape any characters that might break regex
                    input_array.map($.regExpEscape);

                    // Put the array back together with pipe seperators fo regex
                    var input_string = input_array.join('|');

                    // Create the html with mark tags, then go back and get rid of wasteful mark tags before and after spaces
                    var html = value.trim() === '' ? text : text.replace(RegExp(input_string, "gi"), "<mark>$&</mark>").replace(RegExp($.regExpEscape("</mark> <mark>"), "gi"), " ");

                    child = $.create("li", {
                        innerHTML: html,
                        "aria-selected": "false",
                        "id": "allies_complete_list_" + AlliesComplete.numInstances + "_item_" + index
                    });

                    me.ul.appendChild(child);
                });

                if (this.ul.children.length === 0) {

                    this.status.textContent = "No results found";

                    this.close({
                        reason: "nomatches"
                    });

                } else {
                    this.open();

                    this.status.textContent = this.ul.children.length + " results found";
                }
            } else {
                this.close({
                    reason: "nomatches"
                });

                this.status.textContent = "No results found";
            }
        }
    };

    // Static methods/properties

    _.all = [];

    // Private functions

    function Suggestion(data) {
        var o = Array.isArray(data) ?
            {
                label: data[0],
                value: data[1]
            } :
            typeof data === "object" && "label" in data && "value" in data ? data : {
                label: data,
                value: data
            };

        this.label = o.label || o.value;
        this.value = o.value;
    }
    Object.defineProperty(Suggestion.prototype = Object.create(String.prototype), "length", {
        get: function() {
            return this.label.length;
        }
    });
    Suggestion.prototype.toString = Suggestion.prototype.valueOf = function() {
        return "" + this.label;
    };

    function configure(instance, properties, o) {
        for (var i in properties) {
            var initial = properties[i],
                attrValue = instance.input.getAttribute("data-" + i.toLowerCase());

            if (typeof initial === "number") {
                instance[i] = parseInt(attrValue);
            } else if (initial === false) { // Boolean options must be false by default anyway
                instance[i] = attrValue !== null;
            } else if (initial instanceof Function) {
                instance[i] = null;
            } else {
                instance[i] = attrValue;
            }

            if (!instance[i] && instance[i] !== 0) {
                instance[i] = (i in o) ? o[i] : initial;
            }
        }
    }

    function show_error (instance, message) {

        instance.error.removeAttribute("hidden");
        instance.error.textContent = message;

    }

    function clear_error (instance) {

        instance.error.setAttribute("hidden", "");
        instance.error.textContent = "";

    }

    // Helpers

    var slice = Array.prototype.slice;

    function $(expr, con) {
        return typeof expr === "string" ? (con || document).querySelector(expr) : expr || null;
    }

    function $$(expr, con) {
        return slice.call((con || document).querySelectorAll(expr));
    }

    $.create = function(tag, o) {
        var element = document.createElement(tag);

        for (var i in o) {
            var val = o[i];

            if (i === "inside") {
                $(val).appendChild(element);
            } else if (i === "around") {
                var ref = $(val);
                ref.parentNode.insertBefore(element, ref);
                element.appendChild(ref);
            } else if (i in element) {
                element[i] = val;
            } else {
                element.setAttribute(i, val);
            }
        }

        return element;
    };

    $.bind = function(element, o) {
        if (element) {
            for (var event in o) {
                var callback = o[event];

                event.split(/\s+/).forEach(function(event) {
                    element.addEventListener(event, callback);
                });
            }
        }
    };

    $.unbind = function(element, o) {
        if (element) {
            for (var event in o) {
                var callback = o[event];

                event.split(/\s+/).forEach(function(event) {
                    element.removeEventListener(event, callback);
                });
            }
        }
    };

    $.fire = function(target, type, properties) {
        var evt = document.createEvent("HTMLEvents");

        evt.initEvent(type, true, true);

        for (var j in properties) {
            evt[j] = properties[j];
        }

        return target.dispatchEvent(evt);
    };

    $.regExpEscape = function(s) {
        return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
    };

    $.siblingIndex = function(el) {
        /* eslint-disable no-cond-assign */
        for (var i = 0; el = el.previousElementSibling; i++);
        return i;
    };

    // Initialization

    function init() {
        $$("input.allies-complete").forEach(function(input) {
            new _(input);
        });
    }

    // Are we in a browser? Check for Document constructor
    if (typeof Document !== "undefined") {
        // DOM already loaded?
        if (document.readyState !== "loading") {
            init();
        } else {
            // Wait for it
            document.addEventListener("DOMContentLoaded", init);
        }
    }

    _.$ = $;
    _.$$ = $$;

    // Make sure to export AlliesComplete on self when in a browser
    if (typeof self !== "undefined") {
        self.AlliesComplete = _;
    }

    // Expose AlliesComplete as a CJS module
    if (typeof module === "object" && module.exports) {
        module.exports = _;
    }

    return _;

}());