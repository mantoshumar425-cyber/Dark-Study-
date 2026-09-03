/* =========================================================
   DARK STUDY — SCRIPT.JS
   Compatible with index.html + style.css
   ========================================================= */

"use strict";

/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       Login / Add Batches
       ----------------------------------------------------- */

    const loginButton = document.querySelector(".login-btn");

    if (loginButton) {
        loginButton.addEventListener("click", (event) => {

            const href = loginButton.getAttribute("href");

            /*
             * If a real login URL is added later,
             * normal navigation will continue.
             */
            if (!href || href === "#") {
                event.preventDefault();

                showMessage(
                    "Login / Add Batches",
                    "Login and batch features will be available here."
                );
            }
        });
    }


    /* -----------------------------------------------------
       Donate Batch
       ----------------------------------------------------- */

    const donateButton = document.querySelector(".donate");

    if (donateButton) {
        donateButton.addEventListener("click", (event) => {

            const href = donateButton.getAttribute("href");

            if (!href || href === "#") {
                event.preventDefault();

                showMessage(
                    "Donate Batch",
                    "Thank you for supporting Dark Study ❤️"
                );
            }
        });
    }


    /* -----------------------------------------------------
       Smooth scrolling
       ----------------------------------------------------- */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

    });


    /* -----------------------------------------------------
       External links
       ----------------------------------------------------- */

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {

        link.setAttribute("rel", "noopener noreferrer");

    });


    /* -----------------------------------------------------
       Logo fallback
       ----------------------------------------------------- */

    const logo = document.querySelector(".logo-box img");
    const placeholder = document.querySelector(".logo-placeholder");

    if (logo) {

        logo.addEventListener("error", () => {

            logo.style.display = "none";

            if (placeholder) {
                placeholder.style.display = "block";
            }

        });

    }


    /* -----------------------------------------------------
       Button loading protection
       ----------------------------------------------------- */

    document.querySelectorAll(".btn, .login-btn").forEach((button) => {

        button.addEventListener("click", () => {

            /*
             * Prevent accidental double taps on Android.
             * Only applies to real navigation links.
             */
            if (
                button.getAttribute("target") === "_blank" ||
                button.getAttribute("href") === "#"
            ) {
                return;
            }

            button.classList.add("clicked");

            setTimeout(() => {
                button.classList.remove("clicked");
            }, 500);

        });

    });


    /* -----------------------------------------------------
       Current year
       ----------------------------------------------------- */

    const copyright = document.querySelector(".copyright");

    if (copyright) {

        const year = new Date(2024).getFullYear(2028);

        copyright.innerHTML =
            `Copyright © ${2026} Dark Study. All Rights Reserved.`;

    }


    /* -----------------------------------------------------
       Console branding
       ----------------------------------------------------- */

    console.log(
        "%cStudy Stark",
        "font-size:22px;font-weight:bold;"
    );

    console.log(
        "Dark Study website loaded successfully."
    );

});


/* =========================================================
   MESSAGE MODAL
   ========================================================= */

function showMessage(title, message) {

    /*
     * Remove existing modal if present
     */
    const oldModal = document.querySelector(".study-message-modal");

    if (oldModal) {
        oldModal.remove();
    }


    /* -----------------------------------------------------
       Overlay
       ----------------------------------------------------- */

    const overlay = document.createElement("div");

    overlay.className = "study-message-modal";

    overlay.innerHTML = `
        <div class="study-message-box">

            <button
                class="study-message-close"
                aria-label="Close">
                ×
            </button>

            <div class="study-message-icon">
                🎓
            </div>

            <h3>${escapeHTML(title)}</h3>

            <p>${escapeHTML(message)}</p>

            <button class="study-message-ok">
                OK
            </button>

        </div>
    `;


    /* -----------------------------------------------------
       Modal CSS
       ----------------------------------------------------- */

    const style = document.createElement("style");

    style.textContent = `
        .study-message-modal {
            position: fixed;
            inset: 0;
            z-index: 99999;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(5px);
        }

        .study-message-box {
            position: relative;

            width: min(420px, 100%);

            padding: 30px 24px;

            text-align: center;

            background: #ffffff;
            border-radius: 18px;

            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.18);

            animation: studyModalIn 0.2s ease;
        }

        .study-message-icon {
            width: 58px;
            height: 58px;

            margin: 0 auto 15px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #f2f4f7;
            border-radius: 16px;

            font-size: 27px;
        }

        .study-message-box h3 {
            margin: 0 0 8px;

            color: #111827;

            font-size: 21px;
            font-weight: 800;
        }

        .study-message-box p {
            margin: 0 0 22px;

            color: #667085;

            font-size: 14px;
            line-height: 1.6;
        }

        .study-message-close {
            position: absolute;

            top: 10px;
            right: 12px;

            width: 34px;
            height: 34px;

            border: 0;
            border-radius: 50%;

            background: transparent;

            color: #667085;

            font-size: 25px;

            cursor: pointer;
        }

        .study-message-close:hover {
            background: #f2f4f7;
        }

        .study-message-ok {
            width: 100%;

            min-height: 44px;

            border: 0;
            border-radius: 9px;

            background: #111827;
            color: #ffffff;

            font-size: 14px;
            font-weight: 700;

            cursor: pointer;
        }

        .study-message-ok:hover {
            opacity: 0.9;
        }

        @keyframes studyModalIn {
            from {
                opacity: 0;
                transform: scale(0.96);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @media (max-width: 600px) {

            .study-message-box {
                padding: 27px 20px;
            }

        }
    `;


    document.head.appendChild(style);
    document.body.appendChild(overlay);


    /* -----------------------------------------------------
       Close functions
       ----------------------------------------------------- */

    const closeButton =
        overlay.querySelector(".study-message-close");

    const okButton =
        overlay.querySelector(".study-message-ok");


    const closeModal = () => {

        overlay.remove();

    };


    closeButton.addEventListener("click", closeModal);
    okButton.addEventListener("click", closeModal);


    overlay.addEventListener("click", (event) => {

        if (event.target === overlay) {
            closeModal();
        }

    });


    /* -----------------------------------------------------
       Escape key
       ----------------------------------------------------- */

    const escapeHandler = (event) => {

        if (event.key === "Escape") {

            closeModal();

            document.removeEventListener(
                "keydown",
                escapeHandler
            );

        }

    };

    document.addEventListener(
        "keydown",
        escapeHandler
    );

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   END
   ========================================================= */
