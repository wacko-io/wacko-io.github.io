/*jslint browser */
/*global URL, history, localStorage, FormData, fetch, console */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var modal = document.getElementById("feedbackModal");
    var openBtn = document.getElementById("openFeedback");
    var closeBtn = document.getElementById("closeFeedback");
    var form = document.getElementById("feedbackForm");
    var messageBox = document.getElementById("formMessage");

    var FORM_ENDPOINT = "https://formcarry.com/s/jXzJA-2fRq4";
    var STORAGE_KEY = "feedbackFormData";
    var MODAL_PARAM = "feedback";

    var fields = form.querySelectorAll("input[name], textarea[name]");

    function showModal(skipHistory) {
        var urlOpen;

        if (modal.classList.contains("open")) {
            return;
        }

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");

        if (!skipHistory) {
            urlOpen = new URL(window.location);
            urlOpen.searchParams.set(MODAL_PARAM, "1");
            history.pushState({feedbackOpen: true}, "", urlOpen);
        }
    }

    function hideModal(skipHistory) {
        var urlClose;

        if (!modal.classList.contains("open")) {
            return;
        }

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");

        if (!skipHistory) {
            urlClose = new URL(window.location);
            urlClose.searchParams.delete(MODAL_PARAM);
            history.pushState({}, "", urlClose);
        }
    }

    function setMessage(text, type) {
        messageBox.textContent = text || "";
        messageBox.classList.remove(
            "form-message--success",
            "form-message--error"
        );

        if (type === "success") {
            messageBox.classList.add("form-message--success");
        } else if (type === "error") {
            messageBox.classList.add("form-message--error");
        }
    }

    function saveFormToStorage() {
        var data = {};

        fields.forEach(function (field) {
            if (field.type === "checkbox") {
                data[field.name] = field.checked;
            } else {
                data[field.name] = field.value;
            }
        });

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error(e);
        }
    }

    function restoreFormFromStorage() {
        var raw;
        var data;

        try {
            raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                return;
            }

            data = JSON.parse(raw);

            if (!data || typeof data !== "object") {
                return;
            }

            fields.forEach(function (field) {
                if (!Object.prototype.hasOwnProperty.call(data, field.name)) {
                    return;
                }

                if (field.type === "checkbox") {
                    field.checked = Boolean(data[field.name]);
                } else {
                    field.value = (
                        data[field.name] !== undefined
                            ? data[field.name]
                            : ""
                    );
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    function clearFormStorage() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error(e);
        }
    }

    openBtn.addEventListener("click", function () {
        setMessage("", null);
        showModal();
    });

    closeBtn.addEventListener("click", function () {
        hideModal();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            hideModal();
        }
    });

    window.addEventListener("popstate", function () {
        var url = new URL(window.location);
        var isOpen = url.searchParams.get(MODAL_PARAM) === "1";

        if (isOpen) {
            showModal(true);
        } else {
            hideModal(true);
        }
    });

    (function initFromUrl() {
        var initialUrl = new URL(window.location);
        if (initialUrl.searchParams.get(MODAL_PARAM) === "1") {
            showModal(true);
        }
    }());

    fields.forEach(function (field) {
        field.addEventListener("input", saveFormToStorage);

        if (field.type === "checkbox") {
            field.addEventListener("change", saveFormToStorage);
        }
    });

    restoreFormFromStorage();

    form.addEventListener("submit", function (e) {
        var formData;

        e.preventDefault();
        setMessage("Отправка...", null);

        formData = new FormData(form);

        fetch(FORM_ENDPOINT, {
            body: formData,
            headers: {
                Accept: "application/json"
            },
            method: "POST"
        }).then(function (response) {
            return response.json().catch(function () {
                return {};
            }).then(function (result) {
                var errText;

                if (response.ok) {
                    setMessage(
                        "Спасибо! Форма успешно отправлена.",
                        "success"
                    );
                    form.reset();
                    clearFormStorage();
                } else {
                    errText = (
                        (result && result.message)
                            ? result.message
                            : "Произошла ошибка при отправке. Попробуйте ещё раз."
                    );
                    setMessage(errText, "error");
                }
            });
        }).catch(function () {
            setMessage(
                "Не удалось отправить форму. " +
                "Проверьте соединение с интернетом.",
                "error"
            );
        });
    });
});