document.addEventListener("DOMContentLoaded", function () {
  var openButtons = document.querySelectorAll("[data-modal-target]");
  var closeButtons = document.querySelectorAll("[data-modal-close]");
  var activeModal = null;
  var opener = null;
  var backgroundElements = [];

  function openModal(modal, button) {
    if (!modal) {
      return;
    }
    if (activeModal) {
      closeModal();
    }

    opener = button;
    activeModal = modal;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("[data-modal-close]").focus();

    // Prevent keyboard and assistive-technology access to the background.
    backgroundElements = Array.from(modal.parentElement.children)
      .filter(function (element) { return element !== modal; })
      .map(function (element) {
        var state = { element: element, inert: element.inert };
        element.inert = true;
        return state;
      });
  }

  function closeModal() {
    if (!activeModal) {
      return;
    }

    activeModal.hidden = true;
    activeModal = null;
    document.body.classList.remove("modal-open");
    backgroundElements.forEach(function (state) {
      state.element.inert = state.inert;
    });
    backgroundElements = [];

    if (opener && opener.isConnected) {
      opener.focus({ preventScroll: true });
    }
    opener = null;
  }

  openButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openModal(document.getElementById(button.dataset.modalTarget), button);
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeModal);
  });

  document.querySelectorAll(".modal-backdrop").forEach(function (backdrop) {
    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) {
        closeModal();
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (!activeModal) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab") {
      return;
    }

    var focusable = Array.from(activeModal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (element) {
      return element.tabIndex >= 0 && element.getClientRects().length > 0 && !element.closest("[inert]");
    });
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (!first) {
      event.preventDefault();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
