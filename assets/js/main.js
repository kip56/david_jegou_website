document.addEventListener("DOMContentLoaded", function () {
  var openButtons = document.querySelectorAll("[data-modal-target]");
  var closeButtons = document.querySelectorAll("[data-modal-close]");
  var activeModal = null;

  function openModal(modal) {
    if (!modal) {
      return;
    }

    activeModal = modal;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var closeButton = modal.querySelector("[data-modal-close]");

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal() {
    if (!activeModal) {
      return;
    }

    activeModal.hidden = true;
    activeModal = null;
    document.body.classList.remove("modal-open");
  }

  openButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openModal(document.getElementById(button.dataset.modalTarget));
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
    if (event.key === "Escape") {
      closeModal();
    }
  });
});
