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
    "Reglas de dominios",
    "Domain rules",
    "Acceso de emergencia",
    "Emergency access",
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

  var hiddenAccountSettingsDangerLabels = [
    "Caja fuerte purgada",
    "Purge vault",
    "Eliminar cuenta",
    "Delete account",
  ];

  var hiddenSecurityTabLabels = [
    "Autenticación en dos pasos",
    "Two-step login",
    "Claves",
    "Keys",
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

  function isAccountSettingsPage() {
    return window.location.hash.indexOf("#/settings/account") === 0;
  }

  function closestByTagPrefix(element, prefix, boundary) {
    var current = element;

    while (current && current !== boundary && current !== document.body) {
      var tagName = current.tagName ? current.tagName.toLowerCase() : "";

      if (tagName.indexOf(prefix) === 0) {
        return current;
      }

      current = current.parentElement;
    }

    return null;
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

  function hideAccountSettingsFields() {
    if (!isAccountSettingsPage()) {
      return;
    }

    document.querySelectorAll(textSelector).forEach(function (element) {
      var text = normalizeText(element.innerText || element.textContent);

      if (text === "Nombre" || text === "Name") {
        var nameField =
          closestByTagPrefix(element, "bit-form-field") ||
          closestActionableElement(element, document.body);

        nameField.classList.add("balpersa-hidden-menu-item");
        nameField.setAttribute("data-balpersa-hidden-account-settings", text);
      }

      if (text === "Personalizar" || text === "Customize") {
        var customizeButton = closestActionableElement(element, document.body);
        customizeButton.classList.add("balpersa-hidden-menu-item");
        customizeButton.setAttribute(
          "data-balpersa-hidden-account-settings",
          text
        );

        var possibleAvatar =
          customizeButton.previousElementSibling ||
          (customizeButton.parentElement
            ? customizeButton.parentElement.previousElementSibling
            : null);

        if (
          possibleAvatar &&
          normalizeText(possibleAvatar.innerText || possibleAvatar.textContent)
            .length <= 4
        ) {
          possibleAvatar.classList.add("balpersa-hidden-menu-item");
          possibleAvatar.setAttribute(
            "data-balpersa-hidden-account-settings",
            "avatar"
          );
        }
      }

      if (text === "Guardar" || text === "Save") {
        var saveButton = closestActionableElement(element, document.body);
        saveButton.classList.add("balpersa-hidden-menu-item");
        saveButton.setAttribute("data-balpersa-hidden-account-settings", text);
      }

      if (!includesLabel(hiddenAccountSettingsDangerLabels, text)) {
        return;
      }

      if (!hasText(document.body, "Zona peligrosa") && !hasText(document.body, "Danger zone")) {
        return;
      }

      var dangerButton = closestActionableElement(element, document.body);
      dangerButton.classList.add("balpersa-hidden-menu-item");
      dangerButton.setAttribute("data-balpersa-hidden-account-settings", text);
    });
  }

  function hideSecurityTabs() {
    if (window.location.hash.indexOf("#/settings/security") !== 0) {
      return;
    }

    document.querySelectorAll(textSelector).forEach(function (element) {
      var text = normalizeText(element.innerText || element.textContent);

      if (!includesLabel(hiddenSecurityTabLabels, text)) {
        return;
      }

      var item = closestActionableElement(element, document.body);
      item.classList.add("balpersa-hidden-menu-item");
      item.setAttribute("data-balpersa-hidden-security-tab", text);
    });
  }

  function hideGettingStartedPanel() {
    if (window.location.hash.indexOf("#/vault") !== 0) {
      return;
    }

    var candidates = Array.prototype.slice.call(
      document.querySelectorAll("section, bit-callout, div")
    );

    var panel = candidates
      .filter(function (element) {
        return (
          hasText(element, "Empezar") &&
          hasText(element, "Descartar") &&
          (hasText(element, "Importar datos") || hasText(element, "Import data")) &&
          (hasText(element, "Instalar extensi") ||
            hasText(element, "browser extension") ||
            hasText(element, "Use the extension"))
        );
      })
      .sort(function (first, second) {
        return (
          normalizeText(first.innerText || first.textContent).length -
          normalizeText(second.innerText || second.textContent).length
        );
      })[0];

    if (!panel) {
      return;
    }

    panel.classList.add("balpersa-hidden-menu-item");
    panel.setAttribute("data-balpersa-hidden-onboarding", "getting-started");
  }

  function replaceBrandLogos() {
    document.querySelectorAll("bit-nav-logo a").forEach(function (link) {
      if (link.getAttribute("data-balpersa-logo") === "pr-vault") {
        return;
      }

      link.innerHTML =
        '<img class="balpersa-brand-logo" src="images/pr-vault-logo-white.svg" alt="PR Vault">';
      link.setAttribute("data-balpersa-logo", "pr-vault");
      link.setAttribute("aria-label", "PR Vault");
      link.setAttribute("title", "PR Vault");
    });
  }

  function applyBalpersaCustomizations() {
    hideSidebarEntries();
    hideVaultFilterEntries();
    hideNewItemMenuEntries();
    hideLoginDeviceOption();
    hideAccountMenuEntries();
    hideAccountSettingsFields();
    hideSecurityTabs();
    hideGettingStartedPanel();
    replaceBrandLogos();
  }

  var style = document.createElement("style");
  style.textContent =
    ".balpersa-hidden-menu-item{display:none!important;visibility:hidden!important;}" +
    ".balpersa-brand-logo{display:block!important;width:200px!important;height:50px!important;max-width:100%!important;object-fit:contain!important;object-position:left center!important;}" +
    "bit-nav-logo a .balpersa-brand-logo{position:absolute!important;inset:.6875rem auto auto .6875rem!important;}" +
    ".theme_light img.new-logo-themed{content:url(images/pr-vault-logo-dark.svg)!important;}" +
    ".theme_dark img.new-logo-themed{content:url(images/pr-vault-logo-white.svg)!important;}";
  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", applyBalpersaCustomizations);

  var observer = new MutationObserver(applyBalpersaCustomizations);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
