// Minimal jQuery-like functionality for demo purposes
window.$ = window.jQuery = function(selector) {
    if (typeof selector === 'function') {
        // Document ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', selector);
        } else {
            selector();
        }
        return;
    }
    
    var elements = [];
    if (typeof selector === 'string') {
        elements = Array.from(document.querySelectorAll(selector));
    } else if (selector && selector.nodeType) {
        elements = [selector];
    }
    
    var jqObj = {
        length: elements.length,
        
        ready: function(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
            return this;
        },
        
        on: function(event, handler) {
            elements.forEach(el => el.addEventListener(event, handler));
            return this;
        },
        
        click: function(handler) {
            if (handler) {
                return this.on('click', handler);
            } else {
                elements.forEach(el => el.click());
                return this;
            }
        },
        
        addClass: function(className) {
            elements.forEach(el => el.classList.add(className));
            return this;
        },
        
        removeClass: function(className) {
            elements.forEach(el => el.classList.remove(className));
            return this;
        },
        
        css: function(props) {
            elements.forEach(el => {
                for (let key in props) {
                    el.style[key] = props[key];
                }
            });
            return this;
        },
        
        val: function(value) {
            if (value !== undefined) {
                elements.forEach(el => el.value = value);
                return this;
            } else {
                return elements[0] ? elements[0].value : '';
            }
        },
        
        append: function(html) {
            elements.forEach(el => el.insertAdjacentHTML('beforeend', html));
            return this;
        },
        
        scrollTop: function(value) {
            if (value !== undefined) {
                elements.forEach(el => el.scrollTop = value);
                return this;
            }
            return elements[0] ? elements[0].scrollTop : 0;
        },
        
        data: function(attr) {
            return elements[0] ? elements[0].dataset[attr] : null;
        },
        
        keypress: function(handler) {
            return this.on('keypress', handler);
        },
        
        trim: function() {
            return this.val().trim();
        }
    };
    
    // Make elements accessible by index
    elements.forEach((el, i) => {
        jqObj[i] = el;
    });
    
    return jqObj;
};

// Add ready to the main $ function
$.ready = function(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};

// Mock AJAX functionality
$.ajax = function(options) {
    console.log('AJAX call:', options);
    // Simulate successful response for demo
    setTimeout(() => {
        if (options.success) {
            options.success({ response: "Demo response - chatbot is working!" });
        }
    }, 1000);
};