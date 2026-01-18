(function () {
  const theme = localStorage.getItem("ui-theme") || "system";
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.add(isDark ? "dark" : "light");
})();
