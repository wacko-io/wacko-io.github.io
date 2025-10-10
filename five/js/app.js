/*jslint browser, long */
/*global window, document, Image, Intl, Math, Number, Object, MODELS */
/*property
    _,
    NumberFormat,
    accel,
    accelValue,
    add,
    addEventListener,
    alt,
    calculateBtn,
    catch,
    classList,
    contains,
    currency,
    disabled,
    display,
    focus,
    forEach,
    format,
    getElementById,
    heroImage,
    image,
    imageSkeleton,
    isFinite,
    isInteger,
    key,
    length,
    maximumFractionDigits,
    modelSelect,
    modelSubtitle,
    modelTitle,
    name,
    offsetWidth,
    onerror,
    onload,
    once,
    power,
    powerValue,
    preventDefault,
    price,
    priceHint,
    quantityError,
    quantityInput,
    readyState,
    remove,
    removeEventListener,
    resolve,
    result,
    setTimeout,
    src,
    startsWith,
    style,
    target,
    test,
    textContent,
    then,
    totalValue,
    trim,
    value,
    values,
    vmax,
    vmaxValue
*/

// главный модуль — калькулятор Porsche
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

    function updateModel(modelId) {
        const model = MODELS[modelId];
        if (!model) {
            return;
        }

        elements.modelTitle.textContent = model.name;


        const priceText = "Цена: " + formatCurrency.format(model.price);
        elements.modelSubtitle.textContent = priceText;

        elements.accelValue.textContent = model.accel;
        elements.powerValue.textContent = model.power;
        elements.vmaxValue.textContent = model.vmax;

        elements.heroImage.classList.add("loading");
        elements.imageSkeleton.style.display = "block";

        preloadImage(model.image).then(function () {
            elements.heroImage.src = model.image;
            elements.heroImage.alt = model.name;

            elements.heroImage.classList.remove("car-drive");

            // форсируем reflow без «голого» выражения
            imageCache._ = elements.heroImage.offsetWidth;

            elements.heroImage.classList.add("car-drive");

            function onAnimEnd() {
                elements.heroImage.classList.remove("car-drive");
                elements.heroImage.removeEventListener(
                    "animationend",
                    onAnimEnd
                );
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

        if (
            /^\d+$/.test(trimmed)
            && trimmed.length > 1
            && trimmed.startsWith("0")
        ) {
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
        if (num > 1000000) {
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

    function resetResult() {
        elements.totalValue.textContent = "—";
        elements.result.classList.remove("has-value");
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
            const total = model.price * qty;

            elements.totalValue.textContent = formatCurrency.format(total);
            elements.totalValue.classList.remove("calculating");
            elements.result.classList.add("has-value");
            elements.calculateBtn.disabled = false;
        }, 400);
    }

    function initEvents() {
        elements.modelSelect.addEventListener("change", function (e) {
            updateModel(e.target.value);
        });

        elements.quantityInput.addEventListener("input", function () {
            if (elements.quantityError.classList.contains("show")) {
                hideError();
            }
        });

        elements.quantityInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                calculate();
            }
        });

        elements.calculateBtn.addEventListener("click", calculate);
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