var $ = function(s) {
    var e = document.querySelectorAll(s);
    var t = {
        element: e.length === 1 ? e[0] : Array.prototype.slice.call(e),
        html: function(s) {
            e.forEach(function(e) { e.innerHTML = s; });
            return t;
        },
        on: function(s, l) {
            e.forEach(function(e) { e.addEventListener(s, l); });
            return t;
        },
        css: function(s) {
            e.forEach(function(e) { Object.assign(e.style, s); });
            return t;
        },
        attr: function(s, l) {
            if (l === undefined) {
                return e[0] ? e[0].getAttribute(s) : null;
            } else {
                e.forEach(function(e) { e.setAttribute(s, l); });
                return t;
            }
        },
        show: function() {
            e.forEach(function(e) { e.style.display = ""; });
            return t;
        },
        hide: function() {
            e.forEach(function(e) { e.style.display = "none"; });
            return t;
        },
        toggle: function() {
            e.forEach(function(e) { e.style.display = e.style.display === "none" ? "" : "none"; });
            return t;
        },
        serialize: function() {
            var s = {};
            e.forEach(function(e) {
                if (e.tagName === "FORM") {
                    new FormData(e).forEach(function(e, t) { s[t] = e; });
                }
            });
            return s;
        },
        render: function(s) {
            e.forEach(function(e) {
                var l = e.getAttribute("data-tpl") || e.innerHTML;
                if (!e.getAttribute("data-tpl")) e.setAttribute("data-tpl", l);
                e.innerHTML = Array.isArray(s) ? s.map(function(s) {
                    return l.replace(/\{\{(.*?)\}\}/g, function(e, t) { return s[t.trim()] || ""; });
                }).join("") : l.replace(/\{\{(.*?)\}\}/g, function(e, t) { return s[t.trim()] || ""; });
            });
            return t;
        }
    };
    return t;
};
$.ajax = async function(o) {
    var s = o.url;
    var e = o.method || "GET";
    var t = o.data || null;
    var l = o.headers || {};
    var a = o.success;
    var r = o.error;
    try {
        var n = e.toUpperCase();
        var c = await fetch(s, {
            method: n,
            headers: Object.assign({"Content-Type": "application/json"}, l),
            ...(n !== "GET" && t ? { body: JSON.stringify(t) } : {})
        });
        if (!c.ok) throw Error("HTTP error! status: " + c.status);
        var d = await c.json();
        if (a) a(d);
        return d;
    } catch (s) {
        if (r) r(s);
        throw s;
    }
};
$.state = function(s, e) {
    return new Proxy(s, {
        set: function(s, t, l) {
            s[t] = l;
            e(s);
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
            var n = new RegExp("^" + key.replace(/:[^\s/]+/g, "([^/]+)") + "$"),
                res = s.match(n);
            if (res) {
                var ks = key.match(/:[^\s/]+/g) || [];
                ks.forEach(function(k, i) { p[k.slice(1)] = res[i + 1]; });
                return true;
            }
            return false;
        });
        var a = r[k] || r["404"];
        if (a) a(p);
    };
    window.onpopstate = l;
    l();
};