/* assets/js/vanta-init.js */
(() => {
    const getCssVar = (prop, fallback) => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(prop);
        return v ? v.trim() : fallback;
    };

    const hexStringToNumber = (hexStr, fallbackNum) => {
        if (typeof hexStr === "number") return hexStr;
        const cleaned = hexStr.replace(/^#/, "");
        if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleaned)) return fallbackNum;
        return parseInt(cleaned, 16);
    };

    const isMobile = () => window.innerWidth <= 768;

    //Build the Vanta options object
    const buildOptions = () => {
        // Colors (always numeric)
        const bgColor   = hexStringToNumber(getCssVar("--vanta-bg",   0xefefef), 0xefefef);
        const lineColor = hexStringToNumber(getCssVar("--vanta-color", 0x367e5e), 0x367e5e);

        // Base options that are the same for both layouts
        const base = {
            el: "#vanta-net-bg",
            backgroundColor: bgColor,
            color: lineColor,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            forceAnimate: true,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            showDots: false,
        };

        // Mobile‑specific overrides
        if (isMobile()) {
            return Object.assign(base, {
                points: 15,
                spacing: 20,
                maxDistance: 20,
                scaleMobile: 0.7,
            });
        }

        // Desktop (or larger tablet) overrides
        return Object.assign(base, {
            points: 15,
            spacing: 15,
            maxDistance: 25,
            scaleMobile: 1,
        });
    };

    //Initialize / re‑initialize Vanta
    const initVanta = () => {
        // Destroy any previous instance (important when toggling theme or resizing)
        if (window.vantaInstance && typeof window.vantaInstance.destroy === "function") {
            window.vantaInstance.destroy();
        }

        // Build the options object based on current viewport & colours
        const opts = buildOptions();

        // Create the new Vanta instance
        window.vantaInstance = VANTA.NET(opts);
    };

    //Run on first load
    document.addEventListener("DOMContentLoaded", initVanta);

    //Re‑initialize when the theme toggles (data‑theme attribute)
    const themeObserver = new MutationObserver(muts => {
        for (const m of muts) {
            if (m.type === "attributes" && m.attributeName === "data-theme") {
                initVanta();   // colors may have changed
            }
        }
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initVanta();   // recompute mobile/desktop options
        }, 250); // 250 ms debounce
    });
})();
