// Search and the version switcher, ported from Tey docgen's site.js.
//
// Search reads several indexes: the site's own (Marqraft's "search" index of
// the authored pages) and each generated package's docgen search.json. A
// reference page searches its own package at its own version; every other
// package is searched at its current version — the newest generatedAt in
// versions.json, the same rule llms.txt uses. A package's pages live under
// /<package>/<version>/, as the reference mounts serve them.
(function () {
  var trigger = document.getElementById("search");
  var badge = document.getElementById("version-badge");
  var versionsUrl = (trigger || badge) && (trigger || badge).getAttribute("data-versions");
  var versionsPending = null;

  function loadVersions() {
    if (!versionsPending) {
      versionsPending = versionsUrl
        ? fetch(versionsUrl, { cache: "no-store" }).then(function (res) { return res.ok ? res.json() : { versions: [] }; })
          .then(function (data) { return data.versions || []; }).catch(function () { return []; })
        : Promise.resolve([]);
    }
    return versionsPending;
  }

  // ── Version switcher ────────────────────────────────────────────────
  if (badge) {
    var pkg = badge.getAttribute("data-package");
    var current = badge.getAttribute("data-version");
    loadVersions().then(function (all) {
      var versions = all.filter(function (v) { return v.package === pkg; });
      if (versions.length < 2) return;
      var select = document.createElement("select");
      select.className = "version-select";
      select.setAttribute("aria-label", "Documentation version");
      versions.forEach(function (v) {
        var opt = document.createElement("option");
        opt.value = v.id;
        opt.textContent = v.label + " " + v.id;
        if (v.id === current) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener("change", function () {
        var from = "/" + pkg + "/" + current + "/";
        var base = "/" + pkg + "/" + select.value + "/";
        var here = window.location.pathname;
        var target = here.indexOf(from) === 0 ? base + here.slice(from.length) : base;
        // The same page may not exist in the target version (a renamed
        // module, or a source that no longer parses): fall back to the
        // version's index rather than landing on a 404.
        fetch(target, { method: "HEAD", cache: "no-store" })
          .then(function (res) { window.location.href = res.ok ? target : base; })
          .catch(function () { window.location.href = base; });
      });
      badge.replaceWith(select);
    });
  }

  // ── Search (modal) ─────────────────────────────────────────────────
  if (!trigger) return;
  var siteIndex = trigger.getAttribute("data-index") || "";
  var pagePackage = trigger.getAttribute("data-package") || "";
  var pageVersion = trigger.getAttribute("data-version") || "";
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

  function fetchEntries(url) {
    return fetch(url, { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : { entries: [] }; })
      .then(function (data) { return data.entries || []; })
      .catch(function () { return []; });
  }

  // The package versions to search: the page's own, else each package's newest.
  function packageSources(all) {
    var chosen = {};
    all.forEach(function (v) {
      if (pagePackage && v.package === pagePackage) {
        if (v.id === pageVersion) chosen[v.package] = v;
        return;
      }
      var best = chosen[v.package];
      if (!best || (v.generatedAt || "") > (best.generatedAt || "")) chosen[v.package] = v;
    });
    return Object.keys(chosen).map(function (key) { return chosen[key]; });
  }

  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (!pending) {
      var site = siteIndex ? fetchEntries(siteIndex).then(function (entries) {
        return entries.map(function (e) { return Object.assign({}, e, { href: e.url }); });
      }) : Promise.resolve([]);
      var packages = loadVersions().then(function (all) {
        return Promise.all(packageSources(all).map(function (v) {
          var base = "/" + v.package + "/" + v.id + "/";
          return fetchEntries(base + "search.json").then(function (entries) {
            return entries.map(function (e) {
              var page = e.urlPath ? base + e.urlPath + "/" : base;
              return Object.assign({}, e, { href: page + (e.anchor ? "#" + e.anchor : ""), page: page, source: v.label });
            });
          });
        }));
      });
      pending = Promise.all([site, packages]).then(function (parts) {
        index = parts[0].concat.apply(parts[0], parts[1]);
        return index;
      });
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
    a.href = e.href;
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
    if (e.source && where) {
      var dot = where.lastIndexOf(".");
      where = dot === -1 ? (where === e.name ? "" : where) : where.slice(0, dot);
    }
    var label = [e.source || "", where].filter(function (part) { return part; }).join(" · ");
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
      var local = entries.filter(function (e) { return (e.page || e.href.split("#")[0]) === here && e.kind !== "page"; }).slice(0, 4);
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
