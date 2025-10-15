/*jslint browser, long */
/*global MODELS, Image */
/*property
    NumberFormat, accel, accelValue, add, addEventListener, activeElement, alt, appendChild,
    at, bubbles, calculateBtn, catch, children, classList, click, closest, contains,
    createElement, currency, dataset, disabled, dispatchEvent, display, firstElementChild,
    forEach, focus, format, getElementById, getServiceTotal, heroImage, image, imageSkeleton,
    indexOf, innerHTML, isFinite, isInteger, key, length, maximumFractionDigits, modelSelect,
    modelSubtitle, modelTitle, name, offsetWidth, onerror, onload, once, options, power,
    powerValue, preventDefault, price, priceHint, querySelector, querySelectorAll,
    readyState, remove, removeAttribute, removeEventListener, resolve, result, role,
    selected, setAttribute, setTimeout, src, startsWith, style, tabIndex, target, test,
    textContent, then, totalValue, trim, value, values, vmax, vmaxValue, quantityError,
    quantityInput
*/

(function () {
    "use strict";

    const formatCurrency = new Intl.NumberFormat("ru-RU", {
        currency: "RUB",
        maximumFractionDigits: 0,
        style: "currency"
    });

    const elements = {
        accelValue: document.getElementById("accelValue"),
        calculateBtn: document.getElementById("calculateBtn"),
        heroImage: document.getElementById("heroImage"),
        imageSkeleton: document.getElementById("imageSkeleton"),
        modelSelect: document.getElementById("modelSelect"),
        modelSubtitle: document.getElementById("modelSubtitle"),
        modelTitle: document.getElementById("modelTitle"),
        powerValue: document.getElementById("powerValue"),
        priceHint: document.getElementById("priceHint"),
        quantityError: document.getElementById("quantityError"),
        quantityInput: document.getElementById("quantityInput"),
        result: document.getElementById("result"),
        totalValue: document.getElementById("totalValue"),
        vmaxValue: document.getElementById("vmaxValue")
    };

    const imageCache = {};

    function preloadImage(url) {
        if (imageCache[url]) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            const img = new Image();
            img.onload = function () {
                imageCache[url] = true;
                resolve();
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    function resetResult() {
        elements.totalValue.textContent = "—";
        elements.result.classList.remove("has-value");
    }

    function updateModel(modelId) {
        const model = MODELS[modelId];
        if (!model) {
            return;
        }

        elements.modelTitle.textContent = model.name;
        elements.modelSubtitle.textContent = (
            "Цена: " + formatCurrency.format(model.price)
        );
        elements.accelValue.textContent = model.accel;
        elements.powerValue.textContent = model.power;
        elements.vmaxValue.textContent = model.vmax;

        elements.heroImage.classList.add("loading");
        elements.imageSkeleton.style.display = "block";

        preloadImage(model.image).then(function () {
            elements.heroImage.src = model.image;
            elements.heroImage.alt = model.name;
            elements.heroImage.classList.remove("car-drive");

            if (elements.heroImage.offsetWidth) {
                elements.heroImage.classList.add("car-drive");
            }

            function onAnimEnd() {
                elements.heroImage.classList.remove("car-drive");
                elements.heroImage.removeEventListener("animationend", onAnimEnd);
                elements.heroImage.classList.remove("loading");
                elements.imageSkeleton.style.display = "none";
            }
            elements.heroImage.addEventListener("animationend", onAnimEnd);
        }).catch(function () {
            elements.imageSkeleton.style.display = "none";
            elements.heroImage.classList.remove("loading");
        });

        resetResult();
    }

    function validateQuantity(value) {
        const trimmed = value.trim();
        if (trimmed === "") {
            return "Введите количество автомобилей";
        }
        if (/^\d+$/.test(trimmed) && trimmed.length > 1 && trimmed.startsWith("0")) {
            return "Количество не должно начинаться с нуля";
        }

        const num = Number(trimmed);
        if (!Number.isFinite(num)) {
            return "Количество должно быть числом";
        }
        if (!Number.isInteger(num)) {
            return "Количество должно быть целым числом";
        }
        if (num <= 0) {
            return "Количество должно быть больше нуля";
        }
        if (num > 1_000_000) {
            return "Слишком большое количество";
        }
        return null;
    }

    function showError(message) {
        elements.quantityError.textContent = message;
        elements.quantityError.classList.add("show");
        elements.quantityInput.classList.add("error");
    }

    function hideError() {
        elements.quantityError.classList.remove("show");
        elements.quantityInput.classList.remove("error");
        window.setTimeout(function () {
            if (!elements.quantityError.classList.contains("show")) {
                elements.quantityError.textContent = "";
            }
        }, 150);
    }

    function calculate() {
        const modelId = elements.modelSelect.value;
        const model = MODELS[modelId];
        const quantity = elements.quantityInput.value;
        const error = validateQuantity(quantity);

        if (error) {
            showError(error);
            resetResult();
            elements.quantityInput.focus();
            return;
        }

        hideError();
        elements.totalValue.classList.add("calculating");
        elements.calculateBtn.disabled = true;

        window.setTimeout(function () {
            const qty = Number(quantity);
            let total = model.price * qty;

            const svcTotalRaw = (
                typeof window.getServiceTotal === "function"
                    ? window.getServiceTotal()
                    : 0
            );

            if (svcTotalRaw && Number.isFinite(svcTotalRaw) && svcTotalRaw > 0) {
                total += svcTotalRaw * qty;
            }

            elements.totalValue.textContent = formatCurrency.format(total);
            elements.totalValue.classList.remove("calculating");
            elements.result.classList.add("has-value");
            elements.calculateBtn.disabled = false;
        }, 400);
    }

    function initEvents() {
        function maybeAutoRecalc() {
            const err = validateQuantity(elements.quantityInput.value || "");
            elements.calculateBtn.disabled = Boolean(err);
            if (!err) {
                calculate();
            } else {
                resetResult();
            }
        }

        elements.modelSelect.addEventListener("change", function (e) {
            updateModel(e.target.value);
            maybeAutoRecalc();
        });

        elements.quantityInput.addEventListener("input", function () {
            if (elements.quantityError.classList.contains("show")) {
                hideError();
            }
            maybeAutoRecalc();
        });

        elements.quantityInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                calculate();
            }
        });

        elements.calculateBtn.addEventListener("click", calculate);

        window.addEventListener("svc-change", maybeAutoRecalc);

        maybeAutoRecalc();
    }

    function preloadAllImages() {
        Object.values(MODELS).forEach(function (m) {
            preloadImage(m.image);
        });
    }

    function init() {
        updateModel("911");
        initEvents();
        preloadAllImages();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {once: true});
    } else {
        init();
    }
}());

(function () {
    "use strict";

    function initModelDropdown() {
        const select = document.getElementById("modelSelect");
        const wrap = document.getElementById("cs-model-select");
        if (!select || !wrap) {
            return;
        }

        const btn = wrap.querySelector("#cs-model-btn");
        const label = wrap.querySelector("#cs-model-label");
        const list = wrap.querySelector("#cs-model-list");

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

            list.querySelectorAll("[aria-selected]").forEach(function (n) {
                n.removeAttribute("aria-selected");
            });

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
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
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
            let i = items.indexOf(document.activeElement);

            if (e.key === "Escape") {
                e.preventDefault();
                close();
                btn.focus();
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = items[i + 1] || items[0];
                next.focus();
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                const prev = items[i - 1] || items[items.length - 1];
                prev.focus();
            }

            if (e.key === "Enter") {
                e.preventDefault();
                document.activeElement.click();
            }
        });

        rebuild();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initModelDropdown, {once: true});
    } else {
        initModelDropdown();
    }
}());