// Balpersa frontend customization hook.
// Vaultwarden already loads this file after the compiled app bundle. Keep the
// actual changes in balpersa-custom.js so they are easy to review and revert.
(function () {
  "use strict";

  var script = document.createElement("script");
  script.src = "balpersa-custom.js";
  script.defer = true;
  document.head.appendChild(script);
})();
