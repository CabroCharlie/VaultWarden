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

  var hiddenVaultFilterLabels = [
    "Nueva organización",
    "New organization",
    "Tarjeta",
    "Card",
    "Identidad",
    "Identity",
    "Nota",
    "Note",
    "Clave SSH",
    "SSH key",
  ];

  var hiddenNewItemMenuLabels = [
    "Tarjeta",
    "Card",
    "Identidad",
    "Identity",
    "Nota",
    "Note",
    "Clave SSH",
    "SSH key",
  ];

  var hiddenLoginDeviceLabels = [
    "Iniciar sesión con el dispositivo",
    "Log in with device",
    "Login with device",
  ];

  var hiddenAccountMenuLabels = [
    "Consigue ayuda",
    "Get help",
    "Consigue las apps",
    "Get the apps",
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

  var textSelector = [
    "a",
    "button",
    "[role='button']",
    "[role='link']",
    "[role='menuitem']",
    "bit-menu-item",
    "span",
    "div",
  ].join(",");

  var menuOverlaySelector = [
    ".cdk-overlay-container",
    ".cdk-overlay-pane",
    "[role='menu']",
    "bit-menu",
  ].join(",");

  function normalizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function isHiddenLabel(text) {
    return hiddenMenuLabels.indexOf(text) !== -1;
  }

  function includesLabel(labels, text) {
    return labels.indexOf(text) !== -1;
  }

  function hasText(element, text) {
    return normalizeText(element.innerText || element.textContent).indexOf(text) !== -1;
  }

  function closestActionableElement(element, boundary) {
    var current = element;

    while (current && current !== boundary && current !== document.body) {
      var tagName = current.tagName ? current.tagName.toLowerCase() : "";
      var role = current.getAttribute ? current.getAttribute("role") : "";

      if (
        tagName === "a" ||
        tagName === "button" ||
        tagName === "li" ||
        tagName.indexOf("bit-") === 0 ||
        role === "button" ||
        role === "link" ||
        role === "menuitem"
      ) {
        return current;
      }

      current = current.parentElement;
    }

    return element;
  }

  function closestFilterPanel(element) {
    var current = element;

    while (current && current !== document.body) {
      if (hasText(current, "FILTROS") || hasText(current, "FILTERS")) {
        return current;
      }

      current = current.parentElement;
    }

    return null;
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

  function hideVaultFilterEntries() {
    document.querySelectorAll(textSelector).forEach(function (element) {
      var text = normalizeText(element.innerText || element.textContent);

      if (!includesLabel(hiddenVaultFilterLabels, text)) {
        return;
      }

      var filterPanel = closestFilterPanel(element);

      if (!filterPanel) {
        return;
      }

      var item = closestActionableElement(element, filterPanel);
      item.classList.add("balpersa-hidden-menu-item");
      item.setAttribute("data-balpersa-hidden-filter", text);
    });
  }

  function hideNewItemMenuEntries() {
    document.querySelectorAll(menuOverlaySelector).forEach(function (overlay) {
      overlay.querySelectorAll(textSelector).forEach(function (element) {
        var text = normalizeText(element.innerText || element.textContent);

        if (!includesLabel(hiddenNewItemMenuLabels, text)) {
          return;
        }

        var item = closestActionableElement(element, overlay);
        item.classList.add("balpersa-hidden-menu-item");
        item.setAttribute("data-balpersa-hidden-new-menu", text);
      });
    });
  }

  function closestLoginPanel(element) {
    var current = element;

    while (current && current !== document.body) {
      if (
        hasText(current, "Contraseña maestra") ||
        hasText(current, "Master password")
      ) {
        return current;
      }

      current = current.parentElement;
    }

    return null;
  }

  function hideLoginDeviceOption() {
    document.querySelectorAll(textSelector).forEach(function (element) {
      var text = normalizeText(element.innerText || element.textContent);

      if (!includesLabel(hiddenLoginDeviceLabels, text)) {
        return;
      }

      var loginPanel = closestLoginPanel(element);

      if (!loginPanel) {
        return;
      }

      var item = closestActionableElement(element, loginPanel);
      item.classList.add("balpersa-hidden-menu-item");
      item.setAttribute("data-balpersa-hidden-login", text);

      loginPanel.querySelectorAll(textSelector).forEach(function (separator) {
        var separatorText = normalizeText(
          separator.innerText || separator.textContent
        ).toLowerCase();

        if (separatorText === "o" || separatorText === "or") {
          separator.classList.add("balpersa-hidden-menu-item");
          separator.setAttribute("data-balpersa-hidden-login", "separator");
        }
      });
    });
  }

  function hideAccountMenuEntries() {
    document.querySelectorAll(menuOverlaySelector).forEach(function (overlay) {
      overlay.querySelectorAll(textSelector).forEach(function (element) {
        var text = normalizeText(element.innerText || element.textContent);

        if (!includesLabel(hiddenAccountMenuLabels, text)) {
          return;
        }

        if (!hasText(overlay, "Conectado como") && !hasText(overlay, "Logged in as")) {
          return;
        }

        var item = closestActionableElement(element, overlay);
        item.classList.add("balpersa-hidden-menu-item");
        item.setAttribute("data-balpersa-hidden-account-menu", text);
      });
    });
  }

  function applyBalpersaCustomizations() {
    hideSidebarEntries();
    hideVaultFilterEntries();
    hideNewItemMenuEntries();
    hideLoginDeviceOption();
    hideAccountMenuEntries();
  }

  var style = document.createElement("style");
  style.textContent =
    ".balpersa-hidden-menu-item{display:none!important;visibility:hidden!important;}";
  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", applyBalpersaCustomizations);

  var observer = new MutationObserver(applyBalpersaCustomizations);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
