// Panel switching.
//
// Every panel - each challenge year, each calendar year, and the all-time
// cinemas list - is already in the HTML. The page works with this file absent,
// showing the current challenge year and hiding the rest via the `hidden`
// attribute the generator writes. All this does is move which one is visible,
// and which run of year tabs - August to August, or January to December - is
// offered.
(function (document) {
  "use strict";

  var MODE_KEY = "cinema-year-mode",
    tabs = document.querySelectorAll(".year-tab"),
    panels = document.querySelectorAll(".panel"),
    modal = document.querySelectorAll("[data-mode]"),
    switches = document.querySelectorAll("[data-set-mode]"),
    selected;

  if (tabs.length < 2) return;

  function tabFor(name) {
    return document.querySelector(
      '.year-tab[data-panel="' + CSS.escape(name) + '"]',
    );
  }

  function select(name) {
    selected = name;
    Array.prototype.forEach.call(panels, function (panel) {
      panel.hidden = panel.dataset.panel !== name;
    });
    Array.prototype.forEach.call(tabs, function (tab) {
      var isSelected = tab.dataset.panel === name;
      tab.classList.toggle("is-selected", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
    });
  }

  // Show one run's tabs (and its line of the intro). A year from the other
  // run can't stay selected once its tab has gone, so that moves to the
  // current year of this run; the cinemas view belongs to neither and stays.
  function setMode(mode, updateHash) {
    Array.prototype.forEach.call(modal, function (element) {
      element.hidden = element.dataset.mode !== mode;
    });
    Array.prototype.forEach.call(switches, function (button) {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.setMode === mode),
      );
    });

    var tab = selected && tabFor(selected);
    if (tab && tab.dataset.mode && tab.dataset.mode !== mode) {
      var replacement =
        document.querySelector(
          '.year-tab[data-mode="' + mode + '"][data-current]',
        ) || document.querySelector('.year-tab[data-mode="' + mode + '"]');
      if (replacement) {
        select(replacement.dataset.panel);
        if (updateHash)
          history.replaceState(undefined, "", "#" + replacement.dataset.panel);
      }
    }
  }

  // Remembering the choice is a convenience, so storage that is blocked or
  // missing just means starting on challenge years.
  function storedMode() {
    try {
      return localStorage.getItem(MODE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeMode(mode) {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch (error) {
      // Not remembered; the switch still works for this visit.
    }
  }

  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener("click", function () {
      select(tab.dataset.panel);
      history.replaceState(undefined, "", "#" + tab.dataset.panel);
    });
  });

  Array.prototype.forEach.call(switches, function (button) {
    button.addEventListener("click", function () {
      setMode(button.dataset.setMode, true);
      storeMode(button.dataset.setMode);
    });
    button.parentNode.hidden = false;
  });

  var initial = document.querySelector(".year-tab.is-selected");
  selected = initial && initial.dataset.panel;

  // Deep links: /cinema/#year-1, /cinema/#cal-2025 and /cinema/#cinemas open
  // on that panel rather than the current year, and a year's link brings its
  // run of tabs with it. Checked against the panels actually on the page, so
  // an unknown hash is simply ignored.
  var requested = location.hash.slice(1),
    requestedTab =
      requested &&
      document.querySelector(
        '.panel[data-panel="' + CSS.escape(requested) + '"]',
      ) &&
      tabFor(requested),
    mode =
      (requestedTab && requestedTab.dataset.mode) ||
      (storedMode() === "calendar" ? "calendar" : "challenge");

  if (requestedTab) select(requested);
  setMode(mode, false);
})(document);
