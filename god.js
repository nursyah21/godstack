var $ = function(s) {
    var e = document.querySelectorAll(s);
    var t = {
        element: e.length === 1 ? e[0] : Array.prototype.slice.call(e),
        
        html: function(s) {
            e.forEach(function(el) { el.innerHTML = s; });
            return t;
        },
        
        on: function(s, l) {
            e.forEach(function(el) { el.addEventListener(s, l); });
            return t;
        },
        
        css: function(s) {
            e.forEach(function(el) { Object.assign(el.style, s); });
            return t;
        },
        
        attr: function(s, l) {
            if (l === undefined) {
                return e[0] ? e[0].getAttribute(s) : null;
            }
            e.forEach(function(el) { el.setAttribute(s, l); });
            return t;
        },
        
        show: function() {
            e.forEach(function(el) { el.style.display = ""; });
            return t;
        },
        
        hide: function() {
            e.forEach(function(el) { el.style.display = "none"; });
            return t;
        },
        
        toggle: function() {
            e.forEach(function(el) {
                el.style.display = el.style.display === "none" ? "" : "none";
            });
            return t;
        },
        
        serialize: function() {
            var res = {};
            e.forEach(function(el) {
                if (el.tagName === "FORM") {
                    new FormData(el).forEach(function(val, key) {
                        res[key] = val;
                    });
                }
            });
            return res;
        },
        
        render: function(data) {
            e.forEach(function(el) {
                var l = el.getAttribute("data-tpl") || el.innerHTML;
                if (!el.getAttribute("data-tpl")) el.setAttribute("data-tpl", l);
                
                var templateEngine = function(obj) {
                    return l.replace(/\{\{(.*?)\}\}/g, function(match, key) {
                        return obj[key.trim()] || "";
                    });
                };

                el.innerHTML = Array.isArray(data) 
                    ? data.map(templateEngine).join("") 
                    : templateEngine(data);
            });
            return t;
        }
    };
    return t;
};

$.ajax = async function(options) {
    var s = options.url,
        e = options.method || "GET",
        t = options.data || null,
        l = options.headers || {},
        a = options.success,
        r = options.error;

    try {
        var n = e.toUpperCase();
        var fetchOptions = {
            method: n,
            headers: Object.assign({ "Content-Type": "application/json" }, l)
        };
        if (n !== "GET" && t) {
            fetchOptions.body = JSON.stringify(t);
        }
        
        var c = await fetch(s, fetchOptions);
        if (!c.ok) throw Error("HTTP error! status: " + c.status);
        
        var d = await c.json();
        if (a) a(d);
        return d;
    } catch (err) {
        if (r) r(err);
        throw err;
    }
};

$.state = function(s, e) {
    return new Proxy(s, {
        set: function(target, prop, value) {
            target[prop] = value;
            e(target);
            return true;
        }
    });
};

$.go = function(s) {
    window.history.pushState({}, "", s);
    window.dispatchEvent(new Event("popstate"));
};

$.route = function(r) {
    var l = function() {
        var s = window.location.pathname || "/";
        var p = {};
        var k = Object.keys(r).find(function(key) {
            var n = new RegExp("^" + key.replace(/:[^\s/]+/g, "([^/]+)") + "$");
            var res = s.match(n);
            if (res) {
                var ks = key.match(/:[^\s/]+/g) || [];
                ks.forEach(function(param, i) {
                    p[param.slice(1)] = res[i + 1];
                });
                return true;
            }
            return false;
        });
        var handler = r[k] || r["404"];
        if (handler) handler(p);
    };
    window.onpopstate = l;
    l();
};