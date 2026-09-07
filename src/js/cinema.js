// Panel switching.
//
// Every panel - each challenge year, and the all-time cinemas list - is
// already in the HTML. The page works with this file absent, showing the
// current year and hiding the rest via the `hidden` attribute the generator
// writes. All this does is move which one is visible.
(function (document) {
  "use strict";

  var tabs = document.querySelectorAll(".year-tab"),
    panels = document.querySelectorAll(".panel");

  if (tabs.length < 2) return;

  function select(name) {
    Array.prototype.forEach.call(panels, function (panel) {
      panel.hidden = panel.dataset.panel !== name;
    });
    Array.prototype.forEach.call(tabs, function (tab) {
      var selected = tab.dataset.panel === name;
      tab.classList.toggle("is-selected", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
  }

  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener("click", function () {
      select(tab.dataset.panel);
      history.replaceState(undefined, "", "#" + tab.dataset.panel);
    });
  });

  // Deep links: /cinema/#year-1 and /cinema/#cinemas open on that panel
  // rather than the current year. Checked against the panels actually on the
  // page, so an unknown hash is simply ignored.
  var requested = location.hash.slice(1);
  if (
    requested &&
    document.querySelector('.panel[data-panel="' + CSS.escape(requested) + '"]')
  ) {
    select(requested);
  }
})(document);
