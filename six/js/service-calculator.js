/* js/service-calculator.js */
/*jslint browser, long */
/*global window */
/*property
    EventTarget, MutationObserver, NumberFormat, Promise, activeElement, add,
    addEventListener, appendChild, at, bubbles, checkboxWrap, checked, childList,
    children, classList, click, closest, contains, createElement, currency,
    dataset, dispatchEvent, find, firstElementChild, focus, forEach, format, from,
    getServiceTotal, getElementById, hidden, indexOf, initServiceCalculator,
    innerHTML, key, label, length, maximumFractionDigits, modelId, modelSelect,
    multiplier, name, observe, option, optionSelect, options, optionsByType,
    preventDefault, prop, propCheckbox, propLabel, propertyByType, querySelector,
    querySelectorAll, readyState, remove, removeAttribute, resolve, role,
    selectWrap, selected, setAttribute, style, subtree, svcTotal, t1, t2, t3,
    tabIndex, target, textContent, then, toggle, type, typeRadios, types, value
*/

(function () {
    "use strict";

    const SVC_PRICE = {
        currency: "RUB",
        optionsByType: {
            t2: [
                {
                    add: 0,
                    label: "Стандартная",
                    value: "base"
                },
                {
                    add: 450_000,
                    label: "T",
                    value: "t"
                },
                {
                    add: 2_100_000,
                    label: "GTS 4.0",
                    value: "gts40"
                },
                {
                    add: 2_900_000,
                    label: "Spyder RS",
                    value: "spyderrs"
                }
            ]
        },
        propertyByType: {
            t3: {
                add: 690_000,
                label: "Карбоно-керамические тормоза",
                name: "pccb"
            }
        },
        types: {
            t1: {
                add: 0,
                label: "Базовая",
                multiplier: 1
            },
            t2: {
                add: 0,
                label: "Комплектация",
                multiplier: 1
            },
            t3: {
                add: 0,
                label: "Доп. опция",
                multiplier: 1
            }
        }
    };

    const $ = {
        checkboxWrap: document.getElementById("svc-checkbox-wrap"),
        modelSelect: document.getElementById("modelSelect"),
        optionSelect: document.getElementById("svc-option"),
        propCheckbox: document.getElementById("svc-prop"),
        propLabel: document.getElementById("svc-prop-label"),
        selectWrap: document.getElementById("svc-select-wrap"),
        svcTotal: document.getElementById("svc-total"),
        typeRadios: Array.from(
            document.querySelectorAll("input[name='svc-type']")
        )
    };

    let state = {
        modelId: (
            $.modelSelect
                ? $.modelSelect.value
                : "911"
        ),
        option: "base",
        prop: false,
        type: "t1"
    };

    function fmt(v) {
        return new Intl.NumberFormat("ru-RU", {
            currency: "RUB",
            maximumFractionDigits: 0,
            style: "currency"
        }).format(v);
    }

    function renderVisibility(type) {
        $.selectWrap.hidden = type !== "t2";
        $.checkboxWrap.hidden = type !== "t3";
        if (type === "t3") {
            $.propLabel.textContent = (
                SVC_PRICE.propertyByType.t3.label
            );
        }
    }

    function renderOptions() {
        const options = SVC_PRICE.optionsByType.t2 || [];
        $.optionSelect.innerHTML = "";
        options.forEach(function (o) {
            const opt = document.createElement("option");
            opt.value = o.value;
            opt.textContent = (
                o.label + (
                    o.add
                        ? " (+" + fmt(o.add) + ")"
                        : ""
                )
            );
            $.optionSelect.appendChild(opt);
        });
    }

    function computeTotal(st) {
        let add = 0;
        if (st.type === "t2") {
            const options = SVC_PRICE.optionsByType.t2 || [];
            const o = options.find(function (x) {
                return x.value === st.option;
            });
            add = (
                o
                    ? o.add
                    : 0
            );
        }
        if (st.type === "t3" && st.prop) {
            add += SVC_PRICE.propertyByType.t3.add;
        }
        return add;
    }

    window.getServiceTotal = function () {
        return computeTotal(state);
    };

    function renderTotal() {
        const total = computeTotal(state);
        $.svcTotal.textContent = fmt(total);
        $.svcTotal.classList.toggle("is-zero", total === 0);
        window.dispatchEvent(new Event("svc-change"));
    }

    function bindEvents() {
        $.typeRadios.forEach(function (r) {
            r.addEventListener("change", function (e) {
                state.type = e.target.value;
                renderVisibility(state.type);
                renderTotal();
            });
        });
        $.optionSelect.addEventListener("change", function (e) {
            state.option = e.target.value;
            renderTotal();
        });
        $.propCheckbox.addEventListener("change", function (e) {
            state.prop = e.target.checked;
            renderTotal();
        });
        if ($.modelSelect) {
            $.modelSelect.addEventListener("change", function () {
                renderTotal();
            });
        }
    }

    function initCustomDropdown() {
        const select = document.getElementById("svc-option");
        const wrap = document.getElementById("cs-svc-option");
        if (!select || !wrap) {
            return;
        }

        const btn = wrap.querySelector("#cs-btn");
        const label = wrap.querySelector("#cs-label");
        const list = wrap.querySelector("#cs-list");

        function rebuild() {
            list.innerHTML = "";
            const options = [...select.options];
            if (options.length === 0) {
                label.textContent = "—";
                return;
            }
            options.forEach(function (opt) {
                const li = document.createElement("li");
                li.role = "option";
                li.tabIndex = -1;
                li.dataset.value = opt.value;
                li.textContent = opt.textContent;
                if (opt.selected) {
                    li.setAttribute("aria-selected", "true");
                    label.textContent = opt.textContent;
                }
                list.appendChild(li);
            });
        }

        function open() {
            list.classList.add("show");
            btn.setAttribute("aria-expanded", "true");
        }

        function close() {
            list.classList.remove("show");
            btn.setAttribute("aria-expanded", "false");
        }

        function isOpen() {
            return list.classList.contains("show");
        }

        list.addEventListener("click", function (e) {
            const li = e.target.closest("li");
            if (!li) {
                return;
            }
            select.value = li.dataset.value;
            list.querySelectorAll("[aria-selected]").forEach(
                function (n) {
                    n.removeAttribute("aria-selected");
                }
            );
            li.setAttribute("aria-selected", "true");
            label.textContent = li.textContent;
            select.dispatchEvent(new Event("change", {bubbles: true}));
            close();
        });

        btn.addEventListener("mousedown", function (e) {
            e.preventDefault();
            if (isOpen()) {
                close();
            } else {
                open();
            }
        });

        document.addEventListener("mousedown", function (e) {
            if (!wrap.contains(e.target)) {
                setTimeout(function () {
                    close();
                }, 0);
            }
        });

        btn.addEventListener("keydown", function (e) {
            if (
                e.key === "ArrowDown"
                || e.key === "Enter"
                || e.key === " "
            ) {
                e.preventDefault();
                open();
                const sel = (
                    list.querySelector("[aria-selected=\"true\"]")
                    || list.firstElementChild
                );
                if (sel) {
                    sel.focus();
                }
            }
        });

        list.addEventListener("keydown", function (e) {
            const items = [...list.children];
            const i = items.indexOf(document.activeElement);
            let next;
            let prev;

            if (e.key === "Escape") {
                e.preventDefault();
                close();
                btn.focus();
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                next = items[i + 1] || items[0];
                next.focus();
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                prev = items[i - 1] || items.at(-1);
                prev.focus();
            }
            if (e.key === "Enter") {
                e.preventDefault();
                document.activeElement.click();
            }
        });

        const mo = new MutationObserver(function () {
            Promise.resolve().then(rebuild);
        });
        mo.observe(select, {childList: true, subtree: true});
        Promise.resolve().then(rebuild);
    }

    window.initServiceCalculator = function () {
        renderOptions();
        renderVisibility(state.type);
        bindEvents();
        renderTotal();
        setTimeout(initCustomDropdown, 50);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            window.initServiceCalculator();
        });
    } else {
        window.initServiceCalculator();
    }
}());