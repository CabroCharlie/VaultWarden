// Balpersa frontend customizations.
// This file intentionally hides menu entries without deleting or editing the
// compiled Bitwarden/Vaultwarden application bundle. Remove this script tag
// from index.html to restore the original menu.
(function () {
  "use strict";

  var hiddenMenuLabels = [
    "Herramientas",
    "Tools",
    "Generador",
    "Generator",
    "Import",
    "Importar",
    "Export",
    "Exportar",
    "Informes",
    "Reports",
    "Password Manager",
    "Admin Console",
  ];

  var sidebarSelector = [
    "bit-sidenav",
    "nav",
    "aside",
    ".tw-bg-bg-nav",
    "[class*='sidenav']",
    "[class*='side-nav']",
  ].join(",");

  var menuTextSelector = [
    "a",
    "button",
    "[role='button']",
    "[role='link']",
    "bit-nav-item",
    "bit-nav-group",
    "bit-sidenav-item",
    "bit-sidenav-group",
    "span",
  ].join(",");

  function normalizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function isHiddenLabel(text) {
    return hiddenMenuLabels.indexOf(text) !== -1;
  }

  function findMenuItem(element, sidebar) {
    var current = element;

    while (current && current !== sidebar && current !== document.body) {
      var text = normalizeText(current.innerText || current.textContent);
      var tagName = current.tagName ? current.tagName.toLowerCase() : "";
      var role = current.getAttribute ? current.getAttribute("role") : "";
      var isMenuContainer =
        tagName === "a" ||
        tagName === "button" ||
        tagName === "li" ||
        tagName.indexOf("bit-") === 0 ||
        role === "button" ||
        role === "link";

      if (isMenuContainer && isHiddenLabel(text)) {
        return current;
      }

      current = current.parentElement;
    }

    return null;
  }

  function hideSidebarEntries() {
    var sidebars = document.querySelectorAll(sidebarSelector);

    sidebars.forEach(function (sidebar) {
      sidebar.querySelectorAll(menuTextSelector).forEach(function (element) {
        var text = normalizeText(element.innerText || element.textContent);

        if (!isHiddenLabel(text)) {
          return;
        }

        var menuItem = findMenuItem(element, sidebar) || element;
        menuItem.classList.add("balpersa-hidden-menu-item");
        menuItem.setAttribute("data-balpersa-hidden-menu", text);
      });
    });
  }

  var style = document.createElement("style");
  style.textContent =
    ".balpersa-hidden-menu-item{display:none!important;visibility:hidden!important;}";
  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", hideSidebarEntries);

  var observer = new MutationObserver(hideSidebarEntries);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
