
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    let running = false;
    function run_tasks() {
        tasks.forEach(task => {
            if (!task[0](now())) {
                tasks.delete(task);
                task[1]();
            }
        });
        running = tasks.size > 0;
        if (running)
            raf(run_tasks);
    }
    function loop(fn) {
        let task;
        if (!running) {
            running = true;
            raf(run_tasks);
        }
        return {
            promise: new Promise(fulfil => {
                tasks.add(task = [fn, fulfil]);
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/components/Form.svelte generated by Svelte v3.7.1 */

    const file = "src/components/Form.svelte";

    function create_fragment(ctx) {
    	var form, div0, input0, t0, div4, div1, input1, t1, label0, t3, div2, input2, t4, label1, t6, div3, input3, t7, label2, t9, div5, button, dispose;

    	return {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			div4 = element("div");
    			div1 = element("div");
    			input1 = element("input");
    			t1 = space();
    			label0 = element("label");
    			label0.textContent = "Высокий";
    			t3 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "Средний";
    			t6 = space();
    			div3 = element("div");
    			input3 = element("input");
    			t7 = space();
    			label2 = element("label");
    			label2.textContent = "Низний";
    			t9 = space();
    			div5 = element("div");
    			button = element("button");
    			button.textContent = "добавить новую";
    			attr(input0, "class", "form__text svelte-1ufj1nn");
    			attr(input0, "type", "text");
    			attr(input0, "placeholder", "Введите название");
    			add_location(input0, file, 88, 4, 2015);
    			attr(div0, "class", "form__row svelte-1ufj1nn");
    			add_location(div0, file, 87, 2, 1987);
    			ctx.$$binding_groups[0].push(input1);
    			attr(input1, "class", "form__radio svelte-1ufj1nn");
    			attr(input1, "type", "radio");
    			attr(input1, "id", "high");
    			attr(input1, "name", "priority");
    			input1.__value = "high";
    			input1.value = input1.__value;
    			add_location(input1, file, 93, 6, 2176);
    			attr(label0, "class", "form__label svelte-1ufj1nn");
    			attr(label0, "for", "high");
    			add_location(label0, file, 94, 6, 2278);
    			attr(div1, "class", "form__col svelte-1ufj1nn");
    			add_location(div1, file, 92, 4, 2146);
    			ctx.$$binding_groups[0].push(input2);
    			attr(input2, "class", "form__radio svelte-1ufj1nn");
    			attr(input2, "type", "radio");
    			attr(input2, "id", "medium");
    			attr(input2, "name", "priority");
    			input2.__value = "medium";
    			input2.value = input2.__value;
    			add_location(input2, file, 98, 6, 2378);
    			attr(label1, "class", "form__label svelte-1ufj1nn");
    			attr(label1, "for", "medium");
    			add_location(label1, file, 99, 6, 2486);
    			attr(div2, "class", "form__col svelte-1ufj1nn");
    			add_location(div2, file, 97, 4, 2348);
    			ctx.$$binding_groups[0].push(input3);
    			attr(input3, "class", "form__radio svelte-1ufj1nn");
    			attr(input3, "type", "radio");
    			attr(input3, "id", "low");
    			attr(input3, "name", "priority");
    			input3.__value = "low";
    			input3.value = input3.__value;
    			add_location(input3, file, 103, 6, 2588);
    			attr(label2, "class", "form__label svelte-1ufj1nn");
    			attr(label2, "for", "low");
    			add_location(label2, file, 104, 6, 2690);
    			attr(div3, "class", "form__col svelte-1ufj1nn");
    			add_location(div3, file, 102, 4, 2558);
    			attr(div4, "class", "form__row svelte-1ufj1nn");
    			add_location(div4, file, 91, 2, 2118);
    			attr(button, "class", "form__button svelte-1ufj1nn");
    			attr(button, "type", "submit");
    			add_location(button, file, 109, 4, 2793);
    			attr(div5, "class", "form__row svelte-1ufj1nn");
    			add_location(div5, file, 108, 2, 2765);
    			attr(form, "class", "form svelte-1ufj1nn");
    			add_location(form, file, 86, 0, 1965);

    			dispose = [
    				listen(input0, "input", ctx.input0_input_handler),
    				listen(input1, "change", ctx.input1_change_handler),
    				listen(input2, "change", ctx.input2_change_handler),
    				listen(input3, "change", ctx.input3_change_handler),
    				listen(button, "click", prevent_default(ctx.addNewTodo))
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, form, anchor);
    			append(form, div0);
    			append(div0, input0);

    			input0.value = ctx.content;

    			append(form, t0);
    			append(form, div4);
    			append(div4, div1);
    			append(div1, input1);

    			input1.checked = input1.__value === ctx.select;

    			append(div1, t1);
    			append(div1, label0);
    			append(div4, t3);
    			append(div4, div2);
    			append(div2, input2);

    			input2.checked = input2.__value === ctx.select;

    			append(div2, t4);
    			append(div2, label1);
    			append(div4, t6);
    			append(div4, div3);
    			append(div3, input3);

    			input3.checked = input3.__value === ctx.select;

    			append(div3, t7);
    			append(div3, label2);
    			append(form, t9);
    			append(form, div5);
    			append(div5, button);
    		},

    		p: function update(changed, ctx) {
    			if (changed.content && (input0.value !== ctx.content)) input0.value = ctx.content;
    			if (changed.select) input1.checked = input1.__value === ctx.select;
    			if (changed.select) input2.checked = input2.__value === ctx.select;
    			if (changed.select) input3.checked = input3.__value === ctx.select;
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(form);
    			}

    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input1), 1);
    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input2), 1);
    			ctx.$$binding_groups[0].splice(ctx.$$binding_groups[0].indexOf(input3), 1);
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();

      let { content = "", select = 0 } = $$props;

      function addNewTodo() {
        dispatch('todo', {
          content: content,
          select: select
        });

        if(content !== "" && select !== 0) {
          $$invalidate('content', content = "");
          $$invalidate('select', select = 0);
        }
      }

    	const writable_props = ['content', 'select'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_input_handler() {
    		content = this.value;
    		$$invalidate('content', content);
    	}

    	function input1_change_handler() {
    		select = this.__value;
    		$$invalidate('select', select);
    	}

    	function input2_change_handler() {
    		select = this.__value;
    		$$invalidate('select', select);
    	}

    	function input3_change_handler() {
    		select = this.__value;
    		$$invalidate('select', select);
    	}

    	$$self.$set = $$props => {
    		if ('content' in $$props) $$invalidate('content', content = $$props.content);
    		if ('select' in $$props) $$invalidate('select', select = $$props.select);
    	};

    	return {
    		content,
    		select,
    		addNewTodo,
    		input0_input_handler,
    		input1_change_handler,
    		input2_change_handler,
    		input3_change_handler,
    		$$binding_groups
    	};
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["content", "select"]);
    	}

    	get content() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get select() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set select(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Circle.svelte generated by Svelte v3.7.1 */

    const file$1 = "src/components/Circle.svelte";

    function create_fragment$1(ctx) {
    	var li, button, svg, path, dispose;

    	return {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "d", "M40.5 80.5C62.5914 80.5 80.5 62.5914 80.5 40.5C80.5 18.4086 62.5914 0.5 40.5 0.5C18.4086 0.5 0.5 18.4086 0.5 40.5C0.5 62.5914 18.4086 80.5 40.5 80.5Z");
    			attr(path, "stroke", "#010101");
    			attr(path, "stroke-width", "0.25");
    			attr(path, "stroke-miterlimit", "10");
    			add_location(path, file$1, 39, 6, 823);
    			attr(svg, "width", "16");
    			attr(svg, "height", "16");
    			attr(svg, "viewBox", "0 0 81 81");
    			attr(svg, "fill", "none");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "class", "svelte-108iw00");
    			add_location(svg, file$1, 38, 4, 721);
    			attr(button, "class", "" + null_to_empty(ctx.currentPriority) + " svelte-108iw00");
    			add_location(button, file$1, 37, 2, 675);
    			attr(li, "class", "menu-list__item svelte-108iw00");
    			add_location(li, file$1, 36, 0, 644);
    			dispose = listen(button, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, button);
    			append(button, svg);
    			append(svg, path);
    		},

    		p: function update(changed, ctx) {
    			if (changed.currentPriority) {
    				attr(button, "class", "" + null_to_empty(ctx.currentPriority) + " svelte-108iw00");
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			dispose();
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { currentPriority = "" } = $$props;

    	const writable_props = ['currentPriority'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Circle> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ('currentPriority' in $$props) $$invalidate('currentPriority', currentPriority = $$props.currentPriority);
    	};

    	return { currentPriority, click_handler };
    }

    class Circle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["currentPriority"]);
    	}

    	get currentPriority() {
    		throw new Error("<Circle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPriority(value) {
    		throw new Error("<Circle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Menu.svelte generated by Svelte v3.7.1 */

    const file$2 = "src/components/Menu.svelte";

    // (100:2) {:else}
    function create_else_block(ctx) {
    	var t, current;

    	var circle0 = new Circle({
    		props: { currentPriority: "high" },
    		$$inline: true
    	});
    	circle0.$on("click", ctx.handleClick);

    	var circle1 = new Circle({
    		props: { currentPriority: "medium" },
    		$$inline: true
    	});
    	circle1.$on("click", ctx.handleClick);

    	return {
    		c: function create() {
    			circle0.$$.fragment.c();
    			t = space();
    			circle1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(circle0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(circle1, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(circle0.$$.fragment, local);

    			transition_in(circle1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(circle0.$$.fragment, local);
    			transition_out(circle1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(circle0, detaching);

    			if (detaching) {
    				detach(t);
    			}

    			destroy_component(circle1, detaching);
    		}
    	};
    }

    // (97:34) 
    function create_if_block_1(ctx) {
    	var t, current;

    	var circle0 = new Circle({
    		props: { currentPriority: "high" },
    		$$inline: true
    	});
    	circle0.$on("click", ctx.handleClick);

    	var circle1 = new Circle({
    		props: { currentPriority: "low" },
    		$$inline: true
    	});
    	circle1.$on("click", ctx.handleClick);

    	return {
    		c: function create() {
    			circle0.$$.fragment.c();
    			t = space();
    			circle1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(circle0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(circle1, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(circle0.$$.fragment, local);

    			transition_in(circle1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(circle0.$$.fragment, local);
    			transition_out(circle1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(circle0, detaching);

    			if (detaching) {
    				detach(t);
    			}

    			destroy_component(circle1, detaching);
    		}
    	};
    }

    // (94:2) {#if priority === "high"}
    function create_if_block(ctx) {
    	var t, current;

    	var circle0 = new Circle({
    		props: { currentPriority: "medium" },
    		$$inline: true
    	});
    	circle0.$on("click", ctx.handleClick);

    	var circle1 = new Circle({
    		props: { currentPriority: "low" },
    		$$inline: true
    	});
    	circle1.$on("click", ctx.handleClick);

    	return {
    		c: function create() {
    			circle0.$$.fragment.c();
    			t = space();
    			circle1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(circle0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(circle1, target, anchor);
    			current = true;
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(circle0.$$.fragment, local);

    			transition_in(circle1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(circle0.$$.fragment, local);
    			transition_out(circle1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(circle0, detaching);

    			if (detaching) {
    				detach(t);
    			}

    			destroy_component(circle1, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	var ul, li0, button0, svg0, path0, t0, li1, button1, svg1, path1, t1, current_block_type_index, if_block, t2, li2, button2, svg2, path2, current, dispose;

    	var if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_else_block
    	];

    	var if_blocks = [];

    	function select_block_type(ctx) {
    		if (ctx.priority === "high") return 0;
    		if (ctx.priority === "medium") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			li1 = element("li");
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			li2 = element("li");
    			button2 = element("button");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			attr(path0, "d", "M3.3 8.7C3.5 8.9 3.7 9 4 9C4.3 9 4.5 8.9 4.7 8.7L11.7 1.7C12.1 1.3 12.1 0.7 11.7 0.3C11.3 -0.1 10.7 -0.1 10.3 0.3L4 6.6L1.7 4.3C1.3 3.9 0.7 3.9 0.3 4.3C-0.1 4.7 -0.1 5.3 0.3 5.7L3.3 8.7Z");
    			add_location(path0, file$2, 82, 8, 1649);
    			attr(svg0, "width", "16");
    			attr(svg0, "height", "16");
    			attr(svg0, "viewBox", "0 0 12 9");
    			attr(svg0, "fill", "none");
    			attr(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg0, "class", "svelte-1xn3934");
    			add_location(svg0, file$2, 81, 6, 1546);
    			attr(button0, "class", "svelte-1xn3934");
    			add_location(button0, file$2, 80, 4, 1488);
    			attr(li0, "class", "menu-list__item svelte-1xn3934");
    			add_location(li0, file$2, 79, 2, 1455);
    			attr(path1, "d", "M61 0L49.4375 11.5625L66.4375 28.5625L78 17L61 0ZM46.5938 14.4062L0 61V78H17L63.5938 31.4062L46.5938 14.4062Z");
    			add_location(path1, file$2, 89, 8, 2080);
    			attr(svg1, "width", "16");
    			attr(svg1, "height", "16");
    			attr(svg1, "viewBox", "0 0 78 78");
    			attr(svg1, "fill", "none");
    			attr(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg1, "class", "svelte-1xn3934");
    			add_location(svg1, file$2, 88, 6, 1976);
    			attr(button1, "data-action", "edit");
    			attr(button1, "class", "svelte-1xn3934");
    			add_location(button1, file$2, 87, 4, 1919);
    			attr(li1, "class", "menu-list__item svelte-1xn3934");
    			add_location(li1, file$2, 86, 2, 1886);
    			attr(path2, "fill-rule", "evenodd");
    			attr(path2, "clip-rule", "evenodd");
    			attr(path2, "d", "M49.2999 5.70001H66.8999C68.0999 5.70001 69.0999 6.70001 69.0999 7.90001V15.8C69.0999 17 68.0999 18 66.8999 18H3.0999C1.8999 18 0.899902 17 0.899902 15.8V7.90001C0.899902 6.70001 1.8999 5.70001 3.0999 5.70001H20.9999L21.4999 2.30001C21.6999 1.40001 22.3999 0.700012 23.2999 0.700012H46.8999C47.7999 0.700012 48.4999 1.40001 48.6999 2.30001L49.2999 5.70001ZM16.2999 73.2C12.5999 73.2 9.49995 70.5 9.29995 67L5.69995 21H64.3999L60.8 67C60.6 70.5 57.6 73.2 53.8999 73.2H16.2999Z");
    			add_location(path2, file$2, 106, 8, 2908);
    			attr(svg2, "width", "16");
    			attr(svg2, "height", "16");
    			attr(svg2, "viewBox", "0 0 70 74");
    			attr(svg2, "fill", "none");
    			attr(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg2, "class", "svelte-1xn3934");
    			add_location(svg2, file$2, 105, 6, 2804);
    			attr(button2, "class", "svelte-1xn3934");
    			add_location(button2, file$2, 104, 4, 2764);
    			attr(li2, "class", "menu-list__item svelte-1xn3934");
    			add_location(li2, file$2, 103, 2, 2731);
    			attr(ul, "class", "menu-list svelte-1xn3934");
    			add_location(ul, file$2, 78, 0, 1430);

    			dispose = [
    				listen(button0, "click", ctx.doneHandler),
    				listen(button0, "click", ctx.showText),
    				listen(button1, "click", ctx.editHandler),
    				listen(button2, "click", deleteHandler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, ul, anchor);
    			append(ul, li0);
    			append(li0, button0);
    			append(button0, svg0);
    			append(svg0, path0);
    			append(ul, t0);
    			append(ul, li1);
    			append(li1, button1);
    			append(button1, svg1);
    			append(svg1, path1);
    			append(ul, t1);
    			if_blocks[current_block_type_index].m(ul, null);
    			append(ul, t2);
    			append(ul, li2);
    			append(li2, button2);
    			append(button2, svg2);
    			append(svg2, path2);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);
    			if (current_block_type_index !== previous_block_index) {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(ul, t2);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(ul);
    			}

    			if_blocks[current_block_type_index].d();
    			run_all(dispose);
    		}
    	};
    }

    function deleteHandler(event) {
      event.target.closest('.todo-list__item').remove();
    }

    function instance$2($$self, $$props, $$invalidate) {
    	

      const dispatch = createEventDispatcher();

      let { priority = "" } = $$props;

      function doneHandler() {
        dispatch('menu', {
          isOpen: false
        });
      }

      function showText() {
        dispatch('test', {
          isDone: true
        });
      }

      function editHandler() {
        dispatch('edit', {
          isDone: false
        });
      }

      function handleClick(event) {
        const currentClass = event.target.closest("button").className.replace(/\s.*/,'');

        dispatch('change', {
          priority: currentClass
        });
      }

    	const writable_props = ['priority'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('priority' in $$props) $$invalidate('priority', priority = $$props.priority);
    	};

    	return {
    		priority,
    		doneHandler,
    		showText,
    		editHandler,
    		handleClick
    	};
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["priority"]);
    	}

    	get priority() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set priority(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/components/ListElement.svelte generated by Svelte v3.7.1 */

    const file$3 = "src/components/ListElement.svelte";

    // (150:4) {#if isEdit}
    function create_if_block_2(ctx) {
    	var button, svg, path, dispose;

    	return {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "d", "M3.3 8.7C3.5 8.9 3.7 9 4 9C4.3 9 4.5 8.9 4.7 8.7L11.7 1.7C12.1 1.3 12.1 0.7 11.7 0.3C11.3 -0.1 10.7 -0.1 10.3 0.3L4 6.6L1.7 4.3C1.3 3.9 0.7 3.9 0.3 4.3C-0.1 4.7 -0.1 5.3 0.3 5.7L3.3 8.7Z");
    			add_location(path, file$3, 152, 10, 3363);
    			attr(svg, "width", "14");
    			attr(svg, "height", "14");
    			attr(svg, "viewBox", "0 0 12 9");
    			attr(svg, "fill", "none");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "class", "svelte-b0sbwe");
    			add_location(svg, file$3, 151, 8, 3258);
    			attr(button, "class", "edit-btn svelte-b0sbwe");
    			add_location(button, file$3, 150, 6, 3205);
    			dispose = listen(button, "click", ctx.endEdit);
    		},

    		m: function mount(target, anchor) {
    			insert(target, button, anchor);
    			append(button, svg);
    			append(svg, path);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(button);
    			}

    			dispose();
    		}
    	};
    }

    // (158:4) {#if isOpen}
    function create_if_block_1$1(ctx) {
    	var div, div_intro, div_outro, current;

    	var menu = new Menu({
    		props: { priority: ctx.priority },
    		$$inline: true
    	});
    	menu.$on("edit", ctx.editHandler);
    	menu.$on("menu", ctx.showMenuHandler);
    	menu.$on("test", ctx.testHandler);
    	menu.$on("change", ctx.changeHandler);

    	return {
    		c: function create() {
    			div = element("div");
    			menu.$$.fragment.c();
    			attr(div, "class", "menu-wrap svelte-b0sbwe");
    			add_location(div, file$3, 158, 6, 3628);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(menu, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var menu_changes = {};
    			if (changed.priority) menu_changes.priority = ctx.priority;
    			menu.$set(menu_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, fly, { x: 10, duration: 400 });
    				div_intro.start();
    			});

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, fly, { x: 50, duration: 300});

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(menu);

    			if (detaching) {
    				if (div_outro) div_outro.end();
    			}
    		}
    	};
    }

    // (169:6) {:else}
    function create_else_block$1(ctx) {
    	var svg, path;

    	return {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "fill-rule", "evenodd");
    			attr(path, "clip-rule", "evenodd");
    			attr(path, "d", "M7 14.2C3.2 14.2 0 10.9 0 7.1C0 3.3 3.2 0.1 7 0C10.8 0 14 3.3 14 7.1C14 11 10.8 14.2 7 14.2ZM0 33.3C0 37.1 3.2 40.4 7 40.4C10.8 40.4 14 37.2 14 33.3C14 29.5 10.8 26.2 7 26.2C3.2 26.3 0 29.5 0 33.3ZM0 59.5C0 63.3 3.2 66.6 7 66.6C10.8 66.6 14 63.4 14 59.5C14 55.7 10.8 52.4 7 52.4C3.2 52.5 0 55.7 0 59.5Z");
    			add_location(path, file$3, 170, 12, 4859);
    			attr(svg, "width", "14");
    			attr(svg, "height", "14");
    			attr(svg, "viewBox", "0 0 14 67");
    			attr(svg, "fill", "none");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "class", "svelte-b0sbwe");
    			add_location(svg, file$3, 169, 10, 4751);
    		},

    		m: function mount(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(svg);
    			}
    		}
    	};
    }

    // (165:6) {#if isOpen}
    function create_if_block$1(ctx) {
    	var svg, path;

    	return {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "fill-rule", "evenodd");
    			attr(path, "clip-rule", "evenodd");
    			attr(path, "d", "M7.41421 6.00001L11.6568 10.2427C12.0474 10.6332 12.0474 11.2663 11.6568 11.6569C11.2663 12.0474 10.6332 12.0474 10.2426 11.6569L5.99999 7.41422L1.75735 11.6569C1.36683 12.0474 0.733665 12.0474 0.34314 11.6569C-0.0473839 11.2663 -0.0473839 10.6332 0.34314 10.2427L4.58578 6.00001L0.34314 1.75737C-0.0473839 1.36684 -0.0473839 0.73368 0.34314 0.343156C0.733665 -0.0473686 1.36683 -0.0473686 1.75735 0.343156L5.99999 4.5858L10.2426 0.343156C10.6332 -0.0473686 11.2663 -0.0473686 11.6568 0.343156C12.0474 0.73368 12.0474 1.36684 11.6568 1.75737L7.41421 6.00001Z");
    			add_location(path, file$3, 166, 10, 4100);
    			attr(svg, "width", "12");
    			attr(svg, "height", "12");
    			attr(svg, "viewBox", "0 0 12 12");
    			attr(svg, "fill", "none");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "class", "svelte-b0sbwe");
    			add_location(svg, file$3, 165, 8, 3994);
    		},

    		m: function mount(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, path);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(svg);
    			}
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	var li, div, p, t0, t1, t2, t3, button, div_class_value, div_transition, li_class_value, li_transition, current, dispose;

    	var if_block0 = (ctx.isEdit) && create_if_block_2(ctx);

    	var if_block1 = (ctx.isOpen) && create_if_block_1$1(ctx);

    	function select_block_type(ctx) {
    		if (ctx.isOpen) return create_if_block$1;
    		return create_else_block$1;
    	}

    	var current_block_type = select_block_type(ctx);
    	var if_block2 = current_block_type(ctx);

    	return {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			p = element("p");
    			t0 = text(ctx.content);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			button = element("button");
    			if_block2.c();
    			attr(p, "contenteditable", ctx.isEdit);
    			attr(p, "class", "svelte-b0sbwe");
    			add_location(p, file$3, 147, 4, 3139);
    			attr(button, "data-action", "menu");
    			attr(button, "class", "svelte-b0sbwe");
    			toggle_class(button, "active", ctx.isOpen);
    			add_location(button, file$3, 163, 4, 3890);
    			attr(div, "class", div_class_value = "item " + (ctx.isEdit ? 'edit' : '') + " " + ctx.priority + " " + (ctx.isDone ? 'done' : '') + " svelte-b0sbwe");
    			add_location(div, file$3, 146, 2, 3002);
    			attr(li, "data-id", ctx.id);
    			attr(li, "class", li_class_value = "todo-list__item " + ctx.priority + " " + (ctx.isDone ? 'done' : '') + " svelte-b0sbwe");
    			add_location(li, file$3, 145, 0, 2887);
    			dispose = listen(button, "click", ctx.showMenuHandler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			append(li, div);
    			append(div, p);
    			append(p, t0);
    			append(div, t1);
    			if (if_block0) if_block0.m(div, null);
    			append(div, t2);
    			if (if_block1) if_block1.m(div, null);
    			append(div, t3);
    			append(div, button);
    			if_block2.m(button, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.content) {
    				set_data(t0, ctx.content);
    			}

    			if (!current || changed.isEdit) {
    				attr(p, "contenteditable", ctx.isEdit);
    			}

    			if (ctx.isEdit) {
    				if (!if_block0) {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.isOpen) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t3);
    				}
    			} else if (if_block1) {
    				group_outros();
    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});
    				check_outros();
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);
    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(button, null);
    				}
    			}

    			if (changed.isOpen) {
    				toggle_class(button, "active", ctx.isOpen);
    			}

    			if ((!current || changed.isEdit || changed.priority || changed.isDone) && div_class_value !== (div_class_value = "item " + (ctx.isEdit ? 'edit' : '') + " " + ctx.priority + " " + (ctx.isDone ? 'done' : '') + " svelte-b0sbwe")) {
    				attr(div, "class", div_class_value);
    			}

    			if (!current || changed.id) {
    				attr(li, "data-id", ctx.id);
    			}

    			if ((!current || changed.priority || changed.isDone) && li_class_value !== (li_class_value = "todo-list__item " + ctx.priority + " " + (ctx.isDone ? 'done' : '') + " svelte-b0sbwe")) {
    				attr(li, "class", li_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -20, duration: 300, delay: 300 }, true);
    				div_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!li_transition) li_transition = create_bidirectional_transition(li, slide, {duration: 400}, true);
    				li_transition.run(1);
    			});

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block1);

    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -20, duration: 300, delay: 300 }, false);
    			div_transition.run(0);

    			if (!li_transition) li_transition = create_bidirectional_transition(li, slide, {duration: 400}, false);
    			li_transition.run(0);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();

    			if (detaching) {
    				if (div_transition) div_transition.end();
    				if (li_transition) li_transition.end();
    			}

    			dispose();
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	

      let { id = "", content = "", priority = "", isOpen = false, isDone = false } = $$props;
      let isEdit = false;

      function showMenuHandler() {
        $$invalidate('isOpen', isOpen = !isOpen);
      }

      function editHandler() {
        $$invalidate('isOpen', isOpen = !isOpen);
        $$invalidate('isEdit', isEdit = !isEdit);
      }

      function endEdit() {
        $$invalidate('isEdit', isEdit = !isEdit);
      }

      function testHandler(event) {
        $$invalidate('isDone', isDone = event.detail.isDone);
      }

      function changeHandler(event) {
        $$invalidate('priority', priority = event.detail.priority);
        showMenuHandler();
      }

    	const writable_props = ['id', 'content', 'priority', 'isOpen', 'isDone'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<ListElement> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('id' in $$props) $$invalidate('id', id = $$props.id);
    		if ('content' in $$props) $$invalidate('content', content = $$props.content);
    		if ('priority' in $$props) $$invalidate('priority', priority = $$props.priority);
    		if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    		if ('isDone' in $$props) $$invalidate('isDone', isDone = $$props.isDone);
    	};

    	return {
    		id,
    		content,
    		priority,
    		isOpen,
    		isDone,
    		isEdit,
    		showMenuHandler,
    		editHandler,
    		endEdit,
    		testHandler,
    		changeHandler
    	};
    }

    class ListElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["id", "content", "priority", "isOpen", "isDone"]);
    	}

    	get id() {
    		throw new Error("<ListElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ListElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content() {
    		throw new Error("<ListElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<ListElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get priority() {
    		throw new Error("<ListElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set priority(value) {
    		throw new Error("<ListElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<ListElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<ListElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDone() {
    		throw new Error("<ListElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDone(value) {
    		throw new Error("<ListElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Date.svelte generated by Svelte v3.7.1 */

    const file$4 = "src/components/Date.svelte";

    function create_fragment$4(ctx) {
    	var div2, div0, svg, path0, path1, path2, t0, div1, t1_value = formatDate(ctx.d), t1;

    	return {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			attr(path0, "d", "M9.21003 24H40.2091C45.2956 24 49.4187 19.8769 49.4187 14.79V9.21003C49.4187 4.12309 45.2956 0 40.2091 0H9.21003C4.12309 0 0 4.12309 0 9.21003V14.79C0 19.8769 4.12309 24 9.21003 24Z");
    			attr(path0, "fill", "#dc3545");
    			add_location(path0, file$4, 39, 6, 855);
    			attr(path1, "d", "M60.1331 34H9.21032C4.12322 34 0 38.1232 0 43.2092V48.7893C0 53.8783 4.12322 58 9.21032 58H60.1331C65.2198 58 69.343 53.8783 69.343 48.7893V43.2092C69.343 38.1232 65.2198 34 60.1331 34Z");
    			attr(path1, "fill", "#ffc107");
    			add_location(path1, file$4, 40, 6, 1070);
    			attr(path2, "d", "M21.4894 68H9.21003C4.12309 68 0 72.1246 0 77.2096V82.7896C0 87.8785 4.12309 92 9.21003 92H21.4894C26.576 92 30.699 87.8785 30.699 82.7896V77.2096C30.699 72.1246 26.576 68 21.4894 68Z");
    			attr(path2, "fill", "#28a745");
    			add_location(path2, file$4, 41, 6, 1289);
    			attr(svg, "width", "24");
    			attr(svg, "height", "24");
    			attr(svg, "viewBox", "0 0 70 92");
    			attr(svg, "fill", "none");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$4, 38, 4, 753);
    			attr(div0, "class", "icon");
    			add_location(div0, file$4, 37, 2, 730);
    			attr(div1, "class", "date svelte-1n8iwuz");
    			add_location(div1, file$4, 45, 2, 1523);
    			attr(div2, "class", "top-line svelte-1n8iwuz");
    			add_location(div2, file$4, 36, 0, 705);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, svg);
    			append(svg, path0);
    			append(svg, path1);
    			append(svg, path2);
    			append(div2, t0);
    			append(div2, div1);
    			append(div1, t1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    			}
    		}
    	};
    }

    function formatDate(date) {

      let dd = date.getDate();
      if (dd < 10) dd = "0" + dd;

      let mm = date.getMonth() + 1;
      if (mm < 10) mm = "0" + mm;

      let yy = date.getFullYear() % 100;
      if (yy < 10) yy = "0" + yy;

      return dd + "." + mm + "." + yy;
    }

    function instance$4($$self) {
    	

      let d = new Date();

    	return { d };
    }

    class Date_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, []);
    	}
    }

    function getLocalTasks() {
      return JSON.parse(localStorage.getItem("todoList"));
    }

    function setLocalTasks(value) {
      localStorage.setItem("todoList", JSON.stringify(value));
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var NotyfNotification = /** @class */ (function () {
        function NotyfNotification(options) {
            this.options = options;
        }
        return NotyfNotification;
    }());
    var NotyfArrayEvent;
    (function (NotyfArrayEvent) {
        NotyfArrayEvent[NotyfArrayEvent["Add"] = 0] = "Add";
        NotyfArrayEvent[NotyfArrayEvent["Remove"] = 1] = "Remove";
    })(NotyfArrayEvent || (NotyfArrayEvent = {}));
    var NotyfArray = /** @class */ (function () {
        function NotyfArray() {
            this.notifications = [];
        }
        NotyfArray.prototype.push = function (elem) {
            this.notifications.push(elem);
            this.updateFn(elem, NotyfArrayEvent.Add, this.notifications);
        };
        NotyfArray.prototype.splice = function (index, num) {
            var elem = this.notifications.splice(index, num)[0];
            this.updateFn(elem, NotyfArrayEvent.Remove, this.notifications);
        };
        NotyfArray.prototype.indexOf = function (elem) {
            return this.notifications.indexOf(elem);
        };
        NotyfArray.prototype.onupdate = function (fn) {
            this.updateFn = fn;
        };
        return NotyfArray;
    }());

    var DEFAULT_OPTIONS = {
        types: [
            {
                type: 'success',
                className: 'notyf__toast--success',
                backgroundColor: '#3dc763',
                icon: {
                    className: 'notyf__icon--success',
                    tagName: 'i',
                },
            },
            {
                type: 'error',
                className: 'notyf__toast--error',
                backgroundColor: '#ed3d3d',
                icon: {
                    className: 'notyf__icon--error',
                    tagName: 'i',
                },
            },
        ],
        duration: 2000,
        ripple: true,
    };

    var NotyfView = /** @class */ (function () {
        function NotyfView() {
            this.notifications = [];
            // Creates the main notifications container
            var docFrag = document.createDocumentFragment();
            var notyfContainer = this._createHTLMElement({ tagName: 'div', className: 'notyf' });
            docFrag.appendChild(notyfContainer);
            document.body.appendChild(docFrag);
            this.container = notyfContainer;
            // Identifies the main animation end event
            this.animationEndEventName = this._getAnimationEndEventName();
            this._createA11yContainer();
        }
        NotyfView.prototype.update = function (notification, type) {
            if (type === NotyfArrayEvent.Add) {
                this.addNotification(notification);
            }
            else if (type === NotyfArrayEvent.Remove) {
                this.removeNotification(notification);
            }
        };
        NotyfView.prototype.removeNotification = function (notification) {
            var _this = this;
            var renderedNotification = this._popRenderedNotification(notification);
            var node;
            if (!renderedNotification) {
                return;
            }
            node = renderedNotification.node;
            node.classList.add('notyf__toast--disappear');
            var handleEvent;
            node.addEventListener(this.animationEndEventName, handleEvent = function (event) {
                if (event.target === node) {
                    node.removeEventListener(_this.animationEndEventName, handleEvent);
                    _this.container.removeChild(node);
                }
            });
        };
        NotyfView.prototype.addNotification = function (notification) {
            var node = this._renderNotification(notification);
            this.notifications.push({ notification: notification, node: node });
            // For a11y purposes, we still want to announce that there's a notification in the screen
            // even if it comes with no message.
            this._announce(notification.options.message || 'Notification');
        };
        NotyfView.prototype._renderNotification = function (notification) {
            var card = this._buildNotificationCard(notification);
            var className = notification.options.className;
            if (className) {
                card.classList.add(className);
            }
            this.container.appendChild(card);
            return card;
        };
        NotyfView.prototype._popRenderedNotification = function (notification) {
            var idx = -1;
            for (var i = 0; i < this.notifications.length && idx < 0; i++) {
                if (this.notifications[i].notification === notification) {
                    idx = i;
                }
            }
            if (idx !== -1) {
                return this.notifications.splice(idx, 1)[0];
            }
            return;
        };
        NotyfView.prototype._buildNotificationCard = function (notification) {
            var options = notification.options;
            var iconOpts = options.icon;
            // Create elements
            var notificationElem = this._createHTLMElement({ tagName: 'div', className: 'notyf__toast' });
            var ripple = this._createHTLMElement({ tagName: 'div', className: 'notyf__ripple' });
            var wrapper = this._createHTLMElement({ tagName: 'div', className: 'notyf__wrapper' });
            var message = this._createHTLMElement({ tagName: 'div', className: 'notyf__message' });
            message.innerHTML = options.message || '';
            var color = options.backgroundColor;
            // build the icon and append it to the card
            if (iconOpts && typeof iconOpts === 'object') {
                var iconContainer = this._createHTLMElement({ tagName: 'div', className: 'notyf__icon' });
                var icon = this._createHTLMElement({
                    tagName: iconOpts.tagName || 'i',
                    className: iconOpts.className,
                    text: iconOpts.text,
                });
                if (color) {
                    icon.style.color = color;
                }
                iconContainer.appendChild(icon);
                wrapper.appendChild(iconContainer);
            }
            wrapper.appendChild(message);
            notificationElem.appendChild(wrapper);
            // add ripple if applicable, else just paint the full toast
            if (color) {
                if (options.ripple) {
                    ripple.style.backgroundColor = color;
                    notificationElem.appendChild(ripple);
                }
                else {
                    notificationElem.style.backgroundColor = color;
                }
            }
            return notificationElem;
        };
        NotyfView.prototype._createHTLMElement = function (_a) {
            var tagName = _a.tagName, className = _a.className, text = _a.text;
            var elem = document.createElement(tagName);
            if (className) {
                elem.className = className;
            }
            elem.textContent = text || null;
            return elem;
        };
        /**
         * Creates an invisible container which will announce the notyfs to
         * screen readers
         */
        NotyfView.prototype._createA11yContainer = function () {
            var a11yContainer = this._createHTLMElement({ tagName: 'div', className: 'notyf-announcer' });
            a11yContainer.setAttribute('aria-atomic', 'true');
            a11yContainer.setAttribute('aria-live', 'polite');
            // Set the a11y container to be visible hidden. Can't use display: none as
            // screen readers won't read it.
            a11yContainer.style.border = '0';
            a11yContainer.style.clip = 'rect(0 0 0 0)';
            a11yContainer.style.height = '1px';
            a11yContainer.style.margin = '-1px';
            a11yContainer.style.overflow = 'hidden';
            a11yContainer.style.padding = '0';
            a11yContainer.style.position = 'absolute';
            a11yContainer.style.width = '1px';
            a11yContainer.style.outline = '0';
            document.body.appendChild(a11yContainer);
            this.a11yContainer = a11yContainer;
        };
        /**
         * Announces a message to screenreaders.
         */
        NotyfView.prototype._announce = function (message) {
            var _this = this;
            this.a11yContainer.textContent = '';
            // This 100ms timeout is necessary for some browser + screen-reader combinations:
            // - Both JAWS and NVDA over IE11 will not announce anything without a non-zero timeout.
            // - With Chrome and IE11 with NVDA or JAWS, a repeated (identical) message won't be read a
            //   second time without clearing and then using a non-zero delay.
            // (using JAWS 17 at time of this writing).
            // https://github.com/angular/material2/blob/master/src/cdk/a11y/live-announcer/live-announcer.ts
            setTimeout(function () {
                _this.a11yContainer.textContent = message;
            }, 100);
        };
        /**
         * Determine which animationend event is supported
         */
        NotyfView.prototype._getAnimationEndEventName = function () {
            var el = document.createElement('_fake');
            var transitions = {
                MozTransition: 'animationend',
                OTransition: 'oAnimationEnd',
                WebkitTransition: 'webkitAnimationEnd',
                transition: 'animationend',
            };
            var t;
            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
            // No supported animation end event. Using "animationend" as a fallback
            return 'animationend';
        };
        return NotyfView;
    }());

    /**
     * Main controller class. Defines the main Notyf API.
     */
    var Notyf = /** @class */ (function () {
        function Notyf(opts) {
            var _this = this;
            this.notifications = new NotyfArray();
            this.view = new NotyfView();
            var types = this.registerTypes(opts);
            this.options = __assign({}, DEFAULT_OPTIONS, opts);
            this.options.types = types;
            this.notifications.onupdate(function (elem, type) {
                _this.view.update(elem, type);
            });
        }
        Notyf.prototype.error = function (payload) {
            var options = this.normalizeOptions('error', payload);
            this.open(options);
        };
        Notyf.prototype.success = function (payload) {
            var options = this.normalizeOptions('success', payload);
            this.open(options);
        };
        Notyf.prototype.open = function (options) {
            var defaultOpts = this.options.types.find(function (_a) {
                var type = _a.type;
                return type === options.type;
            }) || {};
            var config = __assign({}, defaultOpts, options);
            config.ripple = config.ripple === undefined ? this.options.ripple : config.ripple;
            var notification = new NotyfNotification(config);
            this._pushNotification(notification);
        };
        Notyf.prototype._pushNotification = function (notification) {
            var _this = this;
            this.notifications.push(notification);
            var duration = notification.options.duration || this.options.duration;
            setTimeout(function () {
                var index = _this.notifications.indexOf(notification);
                _this.notifications.splice(index, 1);
            }, duration);
        };
        Notyf.prototype.normalizeOptions = function (type, payload) {
            var options = { type: type };
            if (typeof payload === 'string') {
                options.message = payload;
            }
            else if (typeof payload === 'object') {
                options = __assign({}, options, payload);
            }
            return options;
        };
        Notyf.prototype.registerTypes = function (opts) {
            var incomingTypes = (opts && opts.types || []).slice();
            var finalTypes = DEFAULT_OPTIONS.types.map(function (defaultType) {
                // find if there's a default type within the user input's types, if so, it means the user
                // wants to change some of the default settings
                var userTypeIdx = incomingTypes.findIndex(function (t) { return t.type === defaultType.type; });
                var userType = userTypeIdx !== -1 ? incomingTypes.splice(userTypeIdx, 1)[0] : {};
                return __assign({}, defaultType, userType);
            });
            return finalTypes.concat(incomingTypes);
        };
        return Notyf;
    }());

    /* src/App.svelte generated by Svelte v3.7.1 */

    const file$5 = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.id = list[i].id;
    	child_ctx.content = list[i].content;
    	child_ctx.priority = list[i].priority;
    	return child_ctx;
    }

    // (77:6) {#each todoList as {id, content, priority}}
    function create_each_block(ctx) {
    	var current;

    	var listelement = new ListElement({
    		props: {
    		id: ctx.id,
    		content: ctx.content,
    		priority: ctx.priority
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			listelement.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(listelement, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var listelement_changes = {};
    			if (changed.todoList) listelement_changes.id = ctx.id;
    			if (changed.todoList) listelement_changes.content = ctx.content;
    			if (changed.todoList) listelement_changes.priority = ctx.priority;
    			listelement.$set(listelement_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(listelement.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(listelement.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(listelement, detaching);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	var div1, div0, t0, h2, t2, t3, ul, current;

    	var tododate = new Date_1({ $$inline: true });

    	var form = new Form({
    		props: { content: content },
    		$$inline: true
    	});
    	form.$on("todo", ctx.handleMessage);

    	var each_value = ctx.todoList;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			tododate.$$.fragment.c();
    			t0 = space();
    			h2 = element("h2");
    			h2.textContent = "Мои задачи";
    			t2 = space();
    			form.$$.fragment.c();
    			t3 = space();
    			ul = element("ul");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr(h2, "class", "svelte-1jlllxg");
    			add_location(h2, file$5, 71, 4, 1854);
    			attr(ul, "class", "todo-list svelte-1jlllxg");
    			add_location(ul, file$5, 75, 4, 1940);
    			attr(div0, "class", "todo-box svelte-1jlllxg");
    			add_location(div0, file$5, 69, 2, 1801);
    			attr(div1, "class", "container");
    			add_location(div1, file$5, 68, 0, 1775);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    			mount_component(tododate, div0, null);
    			append(div0, t0);
    			append(div0, h2);
    			append(div0, t2);
    			mount_component(form, div0, null);
    			append(div0, t3);
    			append(div0, ul);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var form_changes = {};
    			if (changed.content) form_changes.content = content;
    			form.$set(form_changes);

    			if (changed.todoList) {
    				each_value = ctx.todoList;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(tododate.$$.fragment, local);

    			transition_in(form.$$.fragment, local);

    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(tododate.$$.fragment, local);
    			transition_out(form.$$.fragment, local);

    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    			}

    			destroy_component(tododate);

    			destroy_component(form);

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    let content = "";

    function instance$5($$self, $$props, $$invalidate) {
    	

      const notyf = new Notyf();

      let INITIAL_TODO = [
        {id: "fw4e1ql20titpsqlccbbx", content: "Прочитать 100 страниц", priority: "high"},
        {id: "lkxvbm81y1iau1ry9i7ik", content: "Выгулять собаку", priority: "medium"},
        {id: "lkxvbm81y1iau1ry9i", content: "Лечь спать в 11", priority: "low"},
      ];

      let todoList = getLocalTasks() || INITIAL_TODO;
      // let doneTasks = 0;
      // let startLength = Object.keys(todoList).length;
      // $: totalLength = doneTasks / startLength * 100;

      function handleMessage(event) {
        if (event.detail.content === "") {
          notyf.error("Введите название задачи");
          return;
        }

        if (event.detail.select === 0) {
          notyf.error("Выберите приоритет");
          return;
        }

        $$invalidate('todoList', todoList = [...todoList, {
          id: Date.now(),
          content: event.detail.content,
          priority: event.detail.select
        }]);
        setLocalTasks(todoList);

        notyf.success("Новая задача добавлена");
      }

    	return { todoList, handleMessage };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, []);
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
