// Copy controls on generated reference pages, as Tey docgen's site.js gives
// its standalone output. The "#" beside a declaration is a link to its own
// anchor, and a click also copies that address. A code block's "Copy"
// copies its source; it is hidden markup until this script, which is what
// makes it work, shows it. Either says "Copied" for a moment.
(function () {
  if (!navigator.clipboard) return;
  document.querySelectorAll("button.copy-code").forEach(function (button) { button.hidden = false; });
  document.addEventListener("click", function (event) {
    var control = event.target.closest ? event.target.closest("a.permalink, button.copy-code") : null;
    if (!control || control.classList.contains("copied")) return;
    var block = control.closest(".code-block");
    var text = block ? block.querySelector("code").textContent : control.href;
    navigator.clipboard.writeText(text).then(function () {
      var label = control.textContent;
      control.classList.add("copied");
      control.textContent = "Copied";
      setTimeout(function () {
        control.textContent = label;
        control.classList.remove("copied");
      }, 1400);
    }).catch(function () {});
  });
})();

// "On this page" follows the reader: the entry for the declaration or member
// at the top of the window is marked, and the rail scrolls to keep it in
// sight, so a long page always says where on it you are.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll("aside.toc a[href^='#']"));
  if (!links.length) return;
  var targets = links.map(function (link) {
    return document.getElementById(decodeURIComponent(link.getAttribute("href").slice(1)));
  });
  var current = null;
  var queued = false;

  // The entry whose target is the last one to have passed under the header.
  function reading() {
    var line = 110;
    var best = null;
    var bestTop = -Infinity;
    for (var i = 0; i < targets.length; i++) {
      if (!targets[i]) continue;
      var top = targets[i].getBoundingClientRect().top;
      if (top <= line && top > bestTop) {
        best = links[i];
        bestTop = top;
      }
    }
    return best;
  }

  function update() {
    queued = false;
    var link = reading();
    if (link === current) return;
    if (current) current.classList.remove("current");
    current = link;
    if (!link) return;
    link.classList.add("current");
    var list = link.closest("ul");
    var box = list.getBoundingClientRect();
    var row = link.getBoundingClientRect();
    if (row.top < box.top || row.bottom > box.bottom) {
      list.scrollTop += row.top - box.top - box.height / 2;
    }
  }

  window.addEventListener("scroll", function () {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  update();
})();
