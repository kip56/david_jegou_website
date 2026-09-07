document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".hamburger-lines");
  var menu = document.getElementById("myLinks");
  var desktop = window.matchMedia("(min-width: 834px)");
  var navigationFocus = null;

  document.addEventListener("focusin", function (event) {
    if (menu.contains(event.target) || event.target === button) {
      navigationFocus = event.target;
    } else if (event.target !== document.body) {
      navigationFocus = null;
    }
  });

  function setOpen(open) {
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }

  button.addEventListener("click", function () {
    setOpen(menu.hidden);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !menu.hidden &&
        (menu.contains(document.activeElement) || document.activeElement === button)) {
      event.preventDefault();
      setOpen(false);
      button.focus();
    }
  });

  menu.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    setOpen(false);

    // Move focus out of the closed menu while retaining native anchor navigation.
    var destination = new URL(link.href);
    if (destination.origin === location.origin && destination.pathname === location.pathname) {
      var target = document.getElementById(destination.hash.slice(1));
      if (target) {
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
          target.addEventListener("blur", function () {
            target.removeAttribute("tabindex");
          }, { once: true });
        }
        target.focus({ preventScroll: true });
      }
    }
  });

  desktop.addEventListener("change", function (event) {
    if (!event.matches) {
      return;
    }
    var focused = document.activeElement;
    // CSS can hide the focused mobile control before this event is delivered.
    if (focused === document.body && navigationFocus) {
      focused = navigationFocus;
    }
    var moveFocus = menu.contains(focused) || focused === button;
    setOpen(false);
    if (moveFocus) {
      var links = Array.from(document.querySelectorAll(".topnav nav a"));
      var destination = links.find(function (link) {
        return link.href === focused.href;
      }) || links[0];
      destination.focus({ preventScroll: true });
    }
  });
});
