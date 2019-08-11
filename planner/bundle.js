var app = function() {
  "use strict";

  function t() {
  }

  function e(t) {
    return t()
  }

  function n() {
    return Object.create(null)
  }

  function o(t) {
    t.forEach(e)
  }

  function r(t) {
    return "function" == typeof t
  }

  function a(t, e) {
    return t != t ? e == e : t !== e || t && "object" == typeof t || "function" == typeof t
  }

  function i(t) {
    return null == t ? "" : t
  }

  function s(t, e) {
    t.appendChild(e)
  }

  function c(t, e, n) {
    t.insertBefore(e, n || null)
  }

  function l(t) {
    t.parentNode.removeChild(t)
  }

  function u(t) {
    return document.createElement(t)
  }

  function d(t) {
    return document.createTextNode(t)
  }

  function f() {
    return d(" ")
  }

  function p(t, e, n, o) {
    return t.addEventListener(e, n, o), () => t.removeEventListener(e, n, o)
  }

  function h(t, e, n) {
    null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
  }

  let v;

  function g(t) {
    v = t
  }

  const $ = [], _ = [], m = [], y = [], x = Promise.resolve();
  let b = !1;

  function w(t) {
    m.push(t)
  }

  function z() {
    const t = new Set;
    do {
      for (; $.length;) {
        const t = $.shift();
        g(t), k(t.$$)
      }
      for (; _.length;) _.pop()();
      for (let e = 0; e < m.length; e += 1) {
        const n = m[e];
        t.has(n) || (n(), t.add(n))
      }
      m.length = 0
    } while ($.length);
    for (; y.length;) y.pop()();
    b = !1
  }

  function k(t) {
    t.fragment && (t.update(t.dirty), o(t.before_update), t.fragment.p(t.dirty, t.ctx), t.dirty = null, t.after_update.forEach(w))
  }

  const H = new Set;
  let M;

  function C(t, e) {
    t && t.i && (H.delete(t), t.i(e))
  }

  function L(t, e, n, o) {
    if (t && t.o) {
      if (H.has(t)) return;
      H.add(t), M.c.push(() => {
        H.delete(t), o && (n && t.d(1), o())
      }), t.o(e)
    }
  }

  function A(t, n, a) {
    const {fragment: i, on_mount: s, on_destroy: c, after_update: l} = t.$$;
    i.m(n, a), w(() => {
      const n = s.map(e).filter(r);
      c ? c.push(...n) : o(n), t.$$.on_mount = []
    }), l.forEach(w)
  }

  function E(t, e) {
    t.$$.fragment && (o(t.$$.on_destroy), t.$$.fragment.d(e), t.$$.on_destroy = t.$$.fragment = null, t.$$.ctx = {})
  }

  function O(t, e) {
    t.$$.dirty || ($.push(t), b || (b = !0, x.then(z)), t.$$.dirty = n()), t.$$.dirty[e] = !0
  }

  function V(e, r, a, i, s, c) {
    const l = v;
    g(e);
    const u = r.props || {}, d = e.$$ = {
      fragment: null,
      ctx: null,
      props: c,
      update: t,
      not_equal: s,
      bound: n(),
      on_mount: [],
      on_destroy: [],
      before_update: [],
      after_update: [],
      context: new Map(l ? l.$$.context : []),
      callbacks: n(),
      dirty: null
    };
    let f = !1;
    var p;
    d.ctx = a ? a(e, u, (t, n) => {
      d.ctx && s(d.ctx[t], d.ctx[t] = n) && (d.bound[t] && d.bound[t](n), f && O(e, t))
    }) : u, d.update(), f = !0, o(d.before_update), d.fragment = i(d.ctx), r.target && (r.hydrate ? d.fragment.l((p = r.target, Array.from(p.childNodes))) : d.fragment.c(), r.intro && C(e.$$.fragment), A(e, r.target, r.anchor), z()), g(l)
  }

  class B {
    $destroy() {
      E(this, 1), this.$destroy = t
    }

    $on(t, e) {
      const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
      return n.push(e), () => {
        const t = n.indexOf(e);
        -1 !== t && n.splice(t, 1)
      }
    }

    $set() {
    }
  }

  function T(e) {
    var n, o, r, a, p, v, g, $;
    return {
      c() {
        n = u("li"), o = u("div"), r = u("p"), a = d(e.content), p = f(), (v = u("button")).innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16 svelte-12s1zta" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>', g = f(), ($ = u("button")).innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14 svelte-12s1zta" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>', h(r, "class", "svelte-12s1zta"), h(v, "data-action", "edit"), h(v, "class", "svelte-12s1zta"), h($, "data-action", "delete"), h($, "class", "svelte-12s1zta"), h(o, "class", i(e.priority) + " svelte-12s1zta"), h(n, "class", "svelte-12s1zta")
      }, m(t, e) {
        c(t, n, e), s(n, o), s(o, r), s(r, a), s(o, p), s(o, v), s(o, g), s(o, $)
      }, p(t, e) {
        var n, r;
        t.content && (n = a, r = "" + (r = e.content), n.data !== r && (n.data = r)), t.priority && h(o, "class", i(e.priority) + " svelte-12s1zta")
      }, i: t, o: t, d(t) {
        t && l(n)
      }
    }
  }

  function j(t, e, n) {
    let {content: o = "", priority: r = ""} = e;
    return t.$set = (t => {
      "content" in t && n("content", o = t.content), "priority" in t && n("priority", r = t.priority)
    }), {content: o, priority: r}
  }

  class q extends B {
    constructor(t) {
      super(), V(this, t, j, T, a, ["content", "priority"])
    }
  }

  function N(e) {
    var n;
    return {
      c() {
        (n = u("div")).innerHTML = '<div class="progress-bar svelte-o0tehb"></div>', h(n, "class", "progress svelte-o0tehb")
      }, m(t, e) {
        c(t, n, e)
      }, p: t, i: t, o: t, d(t) {
        t && l(n)
      }
    }
  }

  class D extends B {
    constructor(t) {
      super(), V(this, t, null, N, a, [])
    }
  }

  function S(e) {
    var n, r, a, i, d, v, g, $, _, m, y, x, b, w, z, k;
    return {
      c() {
        n = u("div"), r = u("div"), a = u("input"), i = f(), (d = u("label")).textContent = "Низний", v = f(), g = u("div"), $ = u("input"), _ = f(), (m = u("label")).textContent = "Средний", y = f(), x = u("div"), b = u("input"), w = f(), (z = u("label")).textContent = "Высокий", e.$$binding_groups[0].push(a), h(a, "type", "radio"), h(a, "id", "low"), h(a, "name", "priority"), a.__value = "low", a.value = a.__value, h(a, "class", "svelte-e2s1ea"), h(d, "for", "low"), h(d, "class", "svelte-e2s1ea"), h(r, "class", "radio-box__item svelte-e2s1ea"), e.$$binding_groups[0].push($), h($, "type", "radio"), h($, "id", "medium"), h($, "name", "priority"), $.__value = "medium", $.value = $.__value, h($, "class", "svelte-e2s1ea"), h(m, "for", "medium"), h(m, "class", "svelte-e2s1ea"), h(g, "class", "radio-box__item svelte-e2s1ea"), e.$$binding_groups[0].push(b), h(b, "type", "radio"), h(b, "id", "high"), h(b, "name", "priority"), b.__value = "high", b.value = b.__value, h(b, "class", "svelte-e2s1ea"), h(z, "for", "high"), h(z, "class", "svelte-e2s1ea"), h(x, "class", "radio-box__item svelte-e2s1ea"), h(n, "class", "radio-box svelte-e2s1ea"), k = [p(a, "change", e.input0_change_handler), p($, "change", e.input1_change_handler), p(b, "change", e.input2_change_handler)]
      }, m(t, o) {
        c(t, n, o), s(n, r), s(r, a), a.checked = a.__value === e.select, s(r, i), s(r, d), s(n, v), s(n, g), s(g, $), $.checked = $.__value === e.select, s(g, _), s(g, m), s(n, y), s(n, x), s(x, b), b.checked = b.__value === e.select, s(x, w), s(x, z)
      }, p(t, e) {
        t.select && (a.checked = a.__value === e.select), t.select && ($.checked = $.__value === e.select), t.select && (b.checked = b.__value === e.select)
      }, i: t, o: t, d(t) {
        t && l(n), e.$$binding_groups[0].splice(e.$$binding_groups[0].indexOf(a), 1), e.$$binding_groups[0].splice(e.$$binding_groups[0].indexOf($), 1), e.$$binding_groups[0].splice(e.$$binding_groups[0].indexOf(b), 1), o(k)
      }
    }
  }

  function P(t, e, n) {
    let {select: o = ""} = e;
    return t.$set = (t => {
      "select" in t && n("select", o = t.select)
    }), {
      select: o, input0_change_handler: function() {
        o = this.__value, n("select", o)
      }, input1_change_handler: function() {
        o = this.__value, n("select", o)
      }, input2_change_handler: function() {
        o = this.__value, n("select", o)
      }, $$binding_groups: [[]]
    }
  }

  class F extends B {
    constructor(t) {
      super(), V(this, t, P, S, a, ["select"])
    }
  }

  function G(t, e, n) {
    const o = Object.create(t);
    return o.content = e[n].content, o.priority = e[n].priority, o
  }

  function I(t) {
    var e, n = new q({props: {content: t.content, priority: t.priority}});
    return {
      c() {
        n.$$.fragment.c()
      }, m(t, o) {
        A(n, t, o), e = !0
      }, p(t, e) {
        var o = {};
        t.todo && (o.content = e.content), t.todo && (o.priority = e.priority), n.$set(o)
      }, i(t) {
        e || (C(n.$$.fragment, t), e = !0)
      }, o(t) {
        L(n.$$.fragment, t), e = !1
      }, d(t) {
        E(n, t)
      }
    }
  }

  function J(t) {
    for (var e, n, r, a, i, d, v, g, $, _, m, y, x, b, w = new F({}), z = t.todo, k = [], H = 0; H < z.length; H += 1) k[H] = I(G(t, z, H));
    const O = t => L(k[t], 1, 1, () => {
      k[t] = null
    });
    var V = new D({});
    return {
      c() {
        e = u("div"), n = u("div"), (r = u("h2")).textContent = "Мои задачи", a = f(), i = u("form"), d = u("input"), v = f(), w.$$.fragment.c(), g = f(), ($ = u("button")).textContent = "добавить новую", _ = f(), m = u("ul");
        for (var o = 0; o < k.length; o += 1) k[o].c();
        var s;
        y = f(), V.$$.fragment.c(), h(r, "class", "svelte-zxxy67"), h(d, "type", "text"), h(d, "placeholder", "Введите название"), h(d, "class", "svelte-zxxy67"), h($, "type", "submit"), h($, "class", "svelte-zxxy67"), h(i, "class", "todo-form svelte-zxxy67"), h(m, "class", "todo-list svelte-zxxy67"), h(n, "class", "todo-box svelte-zxxy67"), h(e, "class", "container svelte-zxxy67"), b = [p(d, "input", t.input_input_handler), p($, "click", (s = t.submitHandler, function(t) {
          return t.preventDefault(), s.call(this, t)
        }))]
      }, m(o, l) {
        c(o, e, l), s(e, n), s(n, r), s(n, a), s(n, i), s(i, d), d.value = t.content, s(i, v), A(w, i, null), s(i, g), s(i, $), s(n, _), s(n, m);
        for (var u = 0; u < k.length; u += 1) k[u].m(m, null);
        s(n, y), A(V, n, null), x = !0
      }, p(t, e) {
        if (t.content && d.value !== e.content && (d.value = e.content), t.todo) {
          z = e.todo;
          for (var n = 0; n < z.length; n += 1) {
            const o = G(e, z, n);
            k[n] ? (k[n].p(t, o), C(k[n], 1)) : (k[n] = I(o), k[n].c(), C(k[n], 1), k[n].m(m, null))
          }
          for (M = {r: 0, c: [], p: M}, n = z.length; n < k.length; n += 1) O(n);
          M.r || o(M.c), M = M.p
        }
      }, i(t) {
        if (!x) {
          C(w.$$.fragment, t);
          for (var e = 0; e < z.length; e += 1) C(k[e]);
          C(V.$$.fragment, t), x = !0
        }
      }, o(t) {
        L(w.$$.fragment, t), k = k.filter(Boolean);
        for (let t = 0; t < k.length; t += 1) L(k[t]);
        L(V.$$.fragment, t), x = !1
      }, d(t) {
        t && l(e), E(w), function(t, e) {
          for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e)
        }(k, t), E(V), o(b)
      }
    }
  }

  function K(t, e, n) {
    let o = [{id: "fw4e1ql20titpsqlccbbx", content: "Задача 1", priority: "low"}, {
      id: "lkxvbm81y1iau1ry9i7ik",
      content: "Задача 2",
      priority: "medium"
    }], r = "", a = "";
    return {
      todo: o, content: r, submitHandler: function() {
        n("todo", o = [...o, {id: Date.now(), content: r, priority: a}]), n("content", r = ""), a = ""
      }, input_input_handler: function() {
        r = this.value, n("content", r)
      }
    }
  }

  return new class extends B {
    constructor(t) {
      super(), V(this, t, K, J, a, [])
    }
  }({target: document.body})
}();
//# sourceMappingURL=bundle.js.map
