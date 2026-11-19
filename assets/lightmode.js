const toggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem("galera-tech-theme", theme);

    if (toggle) {
        toggle.textContent =
            theme === "dark" ? "☀️ Modo claro" : "🌙 Modo escuro";
    }
}

const savedTheme = localStorage.getItem("galera-tech-theme");

const initialTheme = savedTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

applyTheme(initialTheme);

if (toggle) {
    toggle.addEventListener("click", () => {
        const current =
            document.documentElement.dataset.theme;

        applyTheme(current === "dark" ? "light" : "dark");
    });
}
