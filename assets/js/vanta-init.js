/* assets/js/vanta-init.js */
(() => {
    const getCssVar = (prop, fallback) => {
        const val = getComputedStyle(document.documentElement).getPropertyValue(prop);
        return val ? val.trim() : fallback;
    };

    const hexStringToNumber = (hexStr, fallbackNumber) => {
        // If the value is already a number (our numeric fallback), just return it
        if (typeof hexStr === "number") return hexStr;

        // Strip a leading "#" if present
        const cleaned = hexStr.replace(/^#/, "");

        // Validate that we have 3 or 6 hex digits; otherwise use fallback
        const isValid = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleaned);
        if (!isValid) return fallbackNumber;

        // Parse as base‑16 and return the numeric value
        return parseInt(cleaned, 16);
    };

    const initVanta = () => {
        const rawBg   = getCssVar("--vanta-bg",   0xefefef);
        const rawLine = getCssVar("--vanta-color", 0x367e5e);

        const bgColor   = hexStringToNumber(rawBg,   0xefefef);
        const lineColor = hexStringToNumber(rawLine, 0x367e5e);

        // Destroy any previous instance (important when toggling theme)
        if (window.vantaInstance && typeof window.vantaInstance.destroy === "function") {
            window.vantaInstance.destroy();
        }

        // Initialize Vanta.NET with the *numeric* colors
        window.vantaInstance = VANTA.NET({
            el: "#vanta-net-bg",
            backgroundColor: bgColor,
            color: lineColor,
            points: 12,
            maxDistance: 25,
            spacing: 15,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 0.5,
            showDots: false,
        });
    };

    // Run once on page load
    document.addEventListener("DOMContentLoaded", initVanta);

    // Re‑initialize when the theme toggle changes the <html> attribute
    const observer = new MutationObserver(mutations => {
        for (const mut of mutations) {
            if (mut.type === "attributes" && mut.attributeName === "data-theme") {
                initVanta(); // colours will be read again from the CSS vars
            }
        }
    });
    observer.observe(document.documentElement, { attributes: true });
})();
