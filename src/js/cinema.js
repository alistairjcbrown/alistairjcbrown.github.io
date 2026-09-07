// Year switching.
//
// Every year is already in the HTML - the page works with this file absent,
// showing the current year and hiding the rest via the `hidden` attribute the
// generator writes. All this does is move which one is visible.
(function (document) {
  "use strict";

  var tabs = document.querySelectorAll(".year-tab"),
    years = document.querySelectorAll(".year");

  if (tabs.length < 2) return;

  function select(index) {
    Array.prototype.forEach.call(years, function (year) {
      year.hidden = year.dataset.year !== index;
    });
    Array.prototype.forEach.call(tabs, function (tab) {
      var selected = tab.dataset.year === index;
      tab.classList.toggle("is-selected", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
  }

  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener("click", function () {
      select(tab.dataset.year);
      history.replaceState(undefined, "", "#year-" + tab.dataset.year);
    });
  });

  // Deep links: /cinema#year-1 opens on that year rather than the current one.
  var requested = location.hash.match(/^#year-(\d+)$/);
  if (requested && document.getElementById("year-" + requested[1])) {
    select(requested[1]);
  }
})(document);
