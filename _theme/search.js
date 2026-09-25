// Search, ported from Tey docgen's site.js. It reads one file: the site's
// search index (Marqraft's "search" setting), which holds the authored pages
// and, merged by Marqraft, each generated reference's newest version. Every
// entry carries its `url`; generated ones also carry `collection` and
// `version`.
(function () {
  var trigger = document.getElementById("search");
  if (!trigger) return;
  var siteIndex = trigger.getAttribute("data-index") || "";
  var index = null;
  var pending = null;

  // The modal is built here so the static page stays bare; it never
  // appears without the script that drives it.
  var overlay = document.createElement("div");
  overlay.className = "search-modal";
  overlay.hidden = true;
  var panel = document.createElement("div");
  panel.className = "search-modal-panel";
  var input = document.createElement("input");
  input.type = "search";
  input.placeholder = "Search the documentation";
  input.setAttribute("autocomplete", "off");
  input.setAttribute("aria-label", "Search the documentation");
  var results = document.createElement("div");
  results.className = "search-modal-results";
  panel.appendChild(input);
  panel.appendChild(results);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (!pending) {
      pending = (siteIndex ? fetch(siteIndex, { cache: "no-store" }) : Promise.reject())
        .then(function (res) { return res.ok ? res.json() : { entries: [] }; })
        .then(function (data) { index = data.entries || []; return index; })
        .catch(function () { index = []; return index; });
    }
    return pending;
  }

  // Rank, don't just filter: a name hit outranks a summary hit, an
  // exact type outranks a mention in a signature, and an arrow in the
  // query is a function's business, not a module's. Returns -1 when a
  // token matches nowhere (all tokens must hit).
  function rank(entry, tokens) {
    var name = (entry.name || "").toLowerCase();
    var qname = (entry.qualifiedName || "").toLowerCase();
    var types = (entry.types || []).join(" ").toLowerCase();
    var sigs = (entry.signatures || []).join(" ").toLowerCase();
    var summary = (entry.summary || "").toLowerCase();
    var text = (entry.text || "").toLowerCase();
    var total = 0;
    var ok = tokens.every(function (t) {
      var local = 0;
      if (name === t) local = 100;
      else if (name.indexOf(t) === 0) local = 50;
      else if (name.indexOf(t) !== -1) local = 20;
      if (qname === t) local = Math.max(local, 90);
      else if (qname.indexOf(t) !== -1) local = Math.max(local, 30);
      if (types === t) local = Math.max(local, 60);
      else if (types.indexOf(t) !== -1) local = Math.max(local, 25);
      if (sigs.indexOf(t) !== -1) local = Math.max(local, 10);
      if (summary.indexOf(t) !== -1) local = Math.max(local, 5);
      if (text.indexOf(t) !== -1) local = Math.max(local, 3);
      if (local === 0) return false;
      total += local;
      return true;
    });
    if (!ok) return -1;
    if (tokens.indexOf("->") !== -1) {
      total += entry.kind === "function" ? 80 : -300;
    }
    return total;
  }

  // A result row: kind, name, where it is defined, signature or summary.
  function hitEl(e) {
    var a = document.createElement("a");
    a.className = "search-hit";
    a.href = e.url;
    var head = document.createElement("span");
    head.className = "search-head";
    var kind = document.createElement("span");
    kind.className = "search-kind search-kind-" + e.kind;
    kind.textContent = e.kind;
    var name = document.createElement("span");
    name.className = "search-name";
    name.textContent = e.name;
    head.appendChild(kind);
    head.appendChild(name);
    // The DEFINING module or entity for reference entries — "Enumerable"
    // for Enumerable.map — and the page or collection for the site's own.
    var where = e.qualifiedName || "";
    if (e.collection && where) {
      var dot = where.lastIndexOf(".");
      where = dot === -1 ? (where === e.name ? "" : where) : where.slice(0, dot);
    }
    var source = e.collection ? e.collection + (e.version ? " " + e.version : "") : "";
    var label = [source, where].filter(function (part) { return part; }).join(" · ");
    if (label) {
      var qual = document.createElement("span");
      qual.className = "search-qual";
      qual.textContent = label;
      head.appendChild(qual);
    }
    var sig = document.createElement("span");
    sig.className = "search-sig";
    sig.textContent = (e.signatures && e.signatures[0]) || e.summary || "";
    a.appendChild(head);
    a.appendChild(sig);
    return a;
  }

  // The empty state: what a search can answer, a few example terms, and
  // what is on the page you are reading.
  function showIdle() {
    results.innerHTML = "";
    var hint = document.createElement("div");
    hint.className = "search-hint";
    var title = document.createElement("p");
    title.className = "search-hint-title";
    title.textContent = "Search the guide and the reference, by name or type.";
    hint.appendChild(title);
    var body = document.createElement("p");
    body.className = "search-hint-body";
    body.textContent = "A name finds what it is called; a type finds everything that uses it.";
    hint.appendChild(body);
    var chips = document.createElement("div");
    chips.className = "search-chips";
    ["map", "Integer", "String?", "String -> String -> String", "FS.File"].forEach(function (ex) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "search-chip";
      chip.textContent = ex;
      chip.addEventListener("click", function () { input.value = ex; run(); input.focus(); });
      chips.appendChild(chip);
    });
    hint.appendChild(chips);
    results.appendChild(hint);

    var here = window.location.pathname;
    loadIndex().then(function (entries) {
      if (input.value.trim()) return;
      var local = entries.filter(function (e) { return (e.url || "").split("#")[0] === here && e.kind !== "page"; }).slice(0, 4);
      if (local.length === 0) return;
      var section = document.createElement("div");
      section.className = "search-local";
      var heading = document.createElement("p");
      heading.className = "search-hint-title";
      heading.textContent = "On this page";
      section.appendChild(heading);
      local.forEach(function (e) { section.appendChild(hitEl(e)); });
      results.appendChild(section);
    });
  }

  function render(found) {
    results.innerHTML = "";
    if (found.length === 0) {
      var empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "No matches";
      results.appendChild(empty);
      return;
    }
    found.forEach(function (e) { results.appendChild(hitEl(e)); });
    highlight(0);
  }

  function hits() { return results.querySelectorAll(".search-hit"); }

  function highlight(sel) {
    var list = hits();
    if (list.length === 0) return;
    for (var i = 0; i < list.length; i++) {
      list[i].classList.toggle("selected", i === sel);
    }
    list[sel].scrollIntoView({ block: "nearest" });
  }

  function run() {
    var q = input.value.trim().toLowerCase();
    if (q.length === 0) { showIdle(); return; }
    var tokens = q.split(" ").filter(function (t) { return t.length > 0; });
    loadIndex().then(function (entries) {
      if (input.value.trim().toLowerCase() !== q) return;
      var scored = entries
        .map(function (e) { return { e: e, s: rank(e, tokens) }; })
        .filter(function (x) { return x.s >= 0; })
        .sort(function (a, b) { return b.s - a.s; });
      render(scored.slice(0, 50).map(function (x) { return x.e; }));
    });
  }

  function open() {
    overlay.hidden = false;
    input.value = "";
    showIdle();
    input.focus();
  }
  function close() { overlay.hidden = true; trigger.focus(); }

  trigger.addEventListener("click", open);

  input.addEventListener("input", run);
  input.addEventListener("keydown", function (ev) {
    var list = hits();
    var sel = -1;
    for (var i = 0; i < list.length; i++) if (list[i].classList.contains("selected")) sel = i;
    if (ev.key === "Escape") { close(); return; }
    if (ev.key === "ArrowDown" && list.length) { ev.preventDefault(); highlight((sel + 1) % list.length); }
    else if (ev.key === "ArrowUp" && list.length) { ev.preventDefault(); highlight((sel - 1 + list.length) % list.length); }
    else if (ev.key === "Enter" && sel >= 0) { window.location.href = list[sel].href; }
  });

  overlay.addEventListener("click", function (ev) {
    if (ev.target === overlay) close();
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "/" && overlay.hidden && !isTyping(ev)) { ev.preventDefault(); open(); }
    if ((ev.metaKey || ev.ctrlKey) && ev.key === "k") { ev.preventDefault(); open(); }
  });

  function isTyping(ev) {
    var t = ev.target;
    return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
  }
})();
