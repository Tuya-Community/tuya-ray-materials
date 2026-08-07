/*! markmap-autoloader v0.14.3 | MIT License */
(this.markmap = this.markmap || {}),
  (function (t) {
    /*! markmap-common v0.14.2 | MIT License */ function e() {
      return (
        (e =
          Object.assign ||
          function (t) {
            for (var e = 1; e < arguments.length; e++) {
              var a = arguments[e];
              for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (t[n] = a[n]);
            }
            return t;
          }),
        e.apply(this, arguments)
      );
    }
    function a(t, e, a) {
      const n = document.createElement(t);
      return (
        e &&
          Object.entries(e).forEach(([t, e]) => {
            n[t] = e;
          }),
        a &&
          Object.entries(a).forEach(([t, e]) => {
            n.setAttribute(t, e);
          }),
        n
      );
    }
    Math.random().toString(36).slice(2, 8);
    const n = (function (t) {
      const e = {};
      return function (...a) {
        const n = `${a[0]}`;
        let r = e[n];
        return r || ((r = { value: t(...a) }), (e[n] = r)), r.value;
      };
    })(t => {
      document.head.append(a('link', { rel: 'preload', as: 'script', href: t }));
    });
    async function r(t, n) {
      if (
        !t.loaded &&
        (t.type === 'script' &&
          (t.loaded = new Promise((n, r) => {
            var o;
            document.head.append(a('script', e({}, t.data, { onload: n, onerror: r }))),
              ((o = t.data) != null && o.src) || n(void 0);
          }).then(() => {
            t.loaded = !0;
          })),
        t.type === 'iife')
      ) {
        const { fn: e, getParams: a } = t.data;
        e(...((a == null ? void 0 : a(n)) || [])), (t.loaded = !0);
      }
      await t.loaded;
    }
    function o(t) {
      t.loaded ||
        ((t.loaded = !0),
        t.type === 'style'
          ? document.head.append(a('style', { textContent: t.data }))
          : t.type === 'stylesheet' &&
            document.head.append(a('link', e({ rel: 'stylesheet' }, t.data))));
    }
    var s;
    var d;
    var c;
    var l;
    const i = {};
    const u = (async function (t, a) {
      const o = t.filter(t => {
        var e;
        return t.type === 'script' && ((e = t.data) == null ? void 0 : e.src);
      });
      o.length > 1 && o.forEach(t => n(t.data.src)),
        (a = e({ getMarkmap: () => window.markmap }, a));
      for (const e of t) await r(e, a);
    })(
      ((s = window.markmap) == null || (d = s.autoLoader) == null ? void 0 : d.baseJs) || [
        { type: 'script', data: { src: 'd3.js' } },
        {
          type: 'script',
          data: {
            src: 'markmap-lib.js',
          },
        },
        {
          type: 'script',
          data: {
            src: 'markmap-view.js',
          },
        },
      ]
    ).then(() => {
      var t;
      const { markmap: e } = window;
      !(function (t) {
        for (const e of t) o(e);
      })([{ type: 'style', data: e.globalCSS }]),
        (t = e.autoLoader) == null || t.onReady == null || t.onReady();
    });
    function m(t) {
      const { Transformer: e, Markmap: a, autoLoader: n } = window.markmap;
      const r = t.textContent.split('\n');
      let o = 1 / 0;
      r.forEach(t => {
        const e = t.match(/^\s*/)[0].length;
        e < t.length && (o = Math.min(o, e));
      });
      const s = r.map(t => t.slice(o)).join('\n');
      const d = new e(n == null ? void 0 : n.transformPlugins);
      t.innerHTML = '<svg></svg>';
      const c = t.firstChild;
      const l = a.create(c, { embedGlobalCSS: !1 });
      const u = () => {
        const t = (function (t, e) {
          const { root: a, features: n } = t.transform(e);
          const r = Object.keys(n).filter(t => !i[t]);
          r.forEach(t => {
            i[t] = !0;
          });
          const { styles: o, scripts: s } = t.getAssets(r);
          const { markmap: d } = window;
          return o && d.loadCSS(o), s && d.loadJS(s), a;
        })(d, s);
        l.setData(t), l.fit();
      };
      d.hooks.retransform.tap(u), u();
    }
    async function p(t) {
      await u, t.querySelectorAll('.markmap').forEach(m);
    }
    function f() {
      return p(document);
    }
    ((c = window.markmap) != null && (l = c.autoLoader) != null && l.manual) ||
      (document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', () => {
            f();
          })
        : f()),
      (t.ready = u),
      (t.render = m),
      (t.renderAll = f),
      (t.renderAllUnder = p);
  })((this.markmap.autoLoader = this.markmap.autoLoader || {}));
