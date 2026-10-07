/*!
 * fairy-sparkles.js — faint golden sparkles that flutter around an element
 * (e.g. a heading) like fairies, then fade away. Dependency-free, no CSS file.
 *
 * Plays once per element, the first time it scrolls into view.
 *
 * ── Usage ──────────────────────────────────────────────────────────────
 * <script src="fairy-sparkles.js"></script>
 *
 * 1) Declarative: add the attribute, nothing else.
 *      <h2 data-fairy-sparkles>The Nocturnal Visitor</h2>
 *      <h2 data-fairy-sparkles data-fairy-count="20" data-fairy-color="#9fd8ff">…</h2>
 *
 * 2) Scripted:
 *      FairySparkles.attach('h2.title', { count: 16, color: '#ffd76a' });
 *      FairySparkles.play(element);          // fire immediately, ignoring the trigger
 *
 * ES module / bundler:
 *      import FairySparkles from './fairy-sparkles.js'
 *
 * ── Options (all optional) ─────────────────────────────────────────────
 *   count     12                  number of sparkles
 *   color     '#c9a24a'           main sparkle colour (any CSS colour)
 *   glow      '#fff6d6'           bright centre colour
 *   minSize   3, maxSize 6        sparkle diameter in px
 *   minDur    3, maxDur 5         seconds each sparkle lives
 *   maxDelay  1.5                 sparkles start staggered over this many seconds
 *   drift     40                  max px a sparkle wanders from its start point
 *   spread    { x: [-6, 104], y: [-30, 120] }   start area, % of the element box
 *   opacity   0.9                 peak brightness (0–1)
 *   once      true                only the first time it comes into view
 *   trigger   0.5                 fraction of the viewport (from the top) that counts,
 *                                 0.5 = top half. Use 1 for "anywhere on screen".
 *
 * Respects prefers-reduced-motion (does nothing). MIT licence.
 */
(function (root, factory) {
  var api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  else root.FairySparkles = api
  if (typeof document !== 'undefined') {
    var auto = function () { api.attach('[data-fairy-sparkles]') }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto)
    else auto()
  }
})(typeof self !== 'undefined' ? self : this, function () {
  var DEFAULTS = {
    count: 12, color: '#c9a24a', glow: '#fff6d6',
    minSize: 3, maxSize: 6, minDur: 3, maxDur: 5, maxDelay: 1.5,
    drift: 40, spread: { x: [-6, 104], y: [-30, 120] },
    opacity: 0.9, once: true, trigger: 0.5,
  }

  var STYLE_ID = 'fairy-sparkles-style'
  var CSS =
    '.fairy-host{position:relative;isolation:isolate}' +
    '.fairy-layer{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:visible}' +
    '.fairy-sparkle{position:absolute;border-radius:50%;opacity:0;pointer-events:none;' +
    'width:var(--fs-size);height:var(--fs-size);' +
    'background:radial-gradient(circle,var(--fs-glow) 0%,var(--fs-color) 45%,transparent 75%);' +
    'box-shadow:0 0 6px 2px var(--fs-halo);' +
    'animation:fairy-flutter var(--fs-dur) ease-in-out var(--fs-delay) both}' +
    '@keyframes fairy-flutter{' +
    '0%{opacity:0;transform:translate(0,0) scale(.4)}' +
    '15%{opacity:var(--fs-peak)}' +
    '30%{transform:translate(var(--fs-x1),var(--fs-y1)) scale(1)}' +
    '50%{opacity:calc(var(--fs-peak)*.4)}' +
    '65%{opacity:var(--fs-peak);transform:translate(var(--fs-x2),var(--fs-y2)) scale(.8)}' +
    '100%{opacity:0;transform:translate(var(--fs-x3),var(--fs-y3)) scale(.3)}}' +
    '@media (prefers-reduced-motion:reduce){.fairy-layer{display:none}}'

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return
    var s = document.createElement('style')
    s.id = STYLE_ID
    s.textContent = CSS
    document.head.appendChild(s)
  }

  function rand(min, max) { return min + Math.random() * (max - min) }
  function px(n) { return n.toFixed(1) + 'px' }
  function merge(base, extra) {
    var out = {}, k
    for (k in base) out[k] = base[k]
    for (k in extra) if (extra[k] !== undefined) out[k] = extra[k]
    return out
  }

  // Options can also come from data-fairy-* attributes on the element
  function readAttrs(el) {
    var d = el.dataset, o = {}
    if (d.fairyCount) o.count = +d.fairyCount
    if (d.fairyColor) o.color = d.fairyColor
    if (d.fairyGlow) o.glow = d.fairyGlow
    if (d.fairyDrift) o.drift = +d.fairyDrift
    if (d.fairyOpacity) o.opacity = +d.fairyOpacity
    if (d.fairyTrigger) o.trigger = +d.fairyTrigger
    if (d.fairyOnce) o.once = d.fairyOnce !== 'false'
    return o
  }

  function play(el, options) {
    if (typeof window === 'undefined') return
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    injectStyle()
    var o = merge(merge(DEFAULTS, readAttrs(el)), options || {})

    el.classList.add('fairy-host')
    var layer = document.createElement('span')
    layer.className = 'fairy-layer'
    layer.setAttribute('aria-hidden', 'true')

    var longest = 0
    for (var i = 0; i < o.count; i++) {
      var dur = rand(o.minDur, o.maxDur), delay = rand(0, o.maxDelay)
      longest = Math.max(longest, dur + delay)
      var sp = document.createElement('span')
      sp.className = 'fairy-sparkle'
      var st = sp.style
      st.left = rand(o.spread.x[0], o.spread.x[1]) + '%'
      st.top = rand(o.spread.y[0], o.spread.y[1]) + '%'
      st.setProperty('--fs-size', px(rand(o.minSize, o.maxSize)))
      st.setProperty('--fs-dur', dur.toFixed(2) + 's')
      st.setProperty('--fs-delay', delay.toFixed(2) + 's')
      st.setProperty('--fs-color', o.color)
      st.setProperty('--fs-glow', o.glow)
      st.setProperty('--fs-halo', 'color-mix(in srgb, ' + o.glow + ' 45%, transparent)')
      st.setProperty('--fs-peak', o.opacity)
      var d = o.drift
      st.setProperty('--fs-x1', px(rand(-d * .55, d * .55))); st.setProperty('--fs-y1', px(rand(-d * .45, d * .45)))
      st.setProperty('--fs-x2', px(rand(-d * .75, d * .75))); st.setProperty('--fs-y2', px(rand(-d * .6, d * .6)))
      st.setProperty('--fs-x3', px(rand(-d, d)));             st.setProperty('--fs-y3', px(rand(-d * .75, d * .75)))
      layer.appendChild(sp)
    }

    el.appendChild(layer)
    setTimeout(function () { layer.remove() }, (longest + 0.5) * 1000)
  }

  function attach(target, options) {
    if (typeof window === 'undefined') return []
    var els = typeof target === 'string' ? document.querySelectorAll(target)
      : target instanceof Element ? [target] : target
    var observers = []
    Array.prototype.forEach.call(els, function (el) {
      if (el.__fairyAttached) return
      el.__fairyAttached = true
      var o = merge(merge(DEFAULTS, readAttrs(el)), options || {})
      if (!('IntersectionObserver' in window)) { play(el, o); return }
      var bottomMargin = -Math.round((1 - o.trigger) * 100) + '%'
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return
        if (o.once) io.disconnect()
        play(el, o)
      }, { rootMargin: '0px 0px ' + bottomMargin + ' 0px' })
      io.observe(el)
      observers.push(io)
    })
    return observers
  }

  return { attach: attach, play: play, defaults: DEFAULTS }
})
