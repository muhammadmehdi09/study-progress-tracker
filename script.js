const syllabus = [
  {
    name: "Number",
    items: [
      ["1.1", "Types of number"],
      ["1.2", "Sets"],
      ["1.3", "Powers and roots"],
      ["1.4", "Fractions, decimals and percentages"],
      ["1.5", "Ordering"],
      ["1.6", "The four operations"],
      ["1.7", "Indices I"],
      ["1.8", "Standard form"],
      ["1.9", "Estimation"],
      ["1.10", "Limits of accuracy"],
      ["1.11", "Ratio and proportion"],
      ["1.12", "Rates"],
      ["1.13", "Percentages"],
      ["1.14", "Using a calculator"],
      ["1.15", "Time"],
      ["1.16", "Money"],
      ["1.17", "Exponential growth and decay"],
      ["1.18", "Surds"],
    ],
  },
  {
    name: "Algebra and graphs",
    items: [
      ["2.1", "Introduction to algebra"],
      ["2.2", "Algebraic manipulation"],
      ["2.3", "Algebraic fractions"],
      ["2.4", "Indices II"],
      ["2.5", "Equations"],
      ["2.6", "Inequalities"],
      ["2.7", "Sequences"],
      ["2.8", "Proportion"],
      ["2.9", "Graphs in practical situations"],
      ["2.10", "Graphs of functions"],
      ["2.11", "Sketching curves"],
      ["2.12", "Functions"],
    ],
  },
  {
    name: "Coordinate geometry",
    items: [
      ["3.1", "Coordinates"],
      ["3.2", "Drawing linear graphs"],
      ["3.3", "Gradient of linear graphs"],
      ["3.4", "Length and midpoint"],
      ["3.5", "Equations of linear graphs"],
      ["3.6", "Parallel lines"],
      ["3.7", "Perpendicular lines"],
    ],
  },
  {
    name: "Geometry",
    items: [
      ["4.1", "Geometrical terms"],
      ["4.2", "Geometrical constructions"],
      ["4.3", "Scale drawings"],
      ["4.4", "Similarity"],
      ["4.5", "Symmetry"],
      ["4.6", "Angles"],
      ["4.7", "Circle theorems I"],
      ["4.8", "Circle theorems II"],
    ],
  },
  {
    name: "Mensuration",
    items: [
      ["5.1", "Units of measure"],
      ["5.2", "Area and perimeter"],
      ["5.3", "Circles, arcs and sectors"],
      ["5.4", "Surface area and volume"],
      ["5.5", "Compound shapes and parts of shapes"],
    ],
  },
  {
    name: "Trigonometry",
    items: [
      ["6.1", "Pythagoras' theorem"],
      ["6.2", "Right-angled triangles"],
      ["6.3", "Non-right-angled triangles"],
      ["6.4", "Pythagoras' theorem and trigonometry in 3D"],
    ],
  },
  {
    name: "Transformations and vectors",
    items: [
      ["7.1", "Transformations"],
      ["7.2", "Vectors in two dimensions"],
      ["7.3", "Magnitude of a vector"],
      ["7.4", "Vector geometry"],
    ],
  },
  {
    name: "Probability",
    items: [
      ["8.1", "Introduction to probability"],
      ["8.2", "Relative and expected frequencies"],
      ["8.3", "Probability of combined events"],
    ],
  },
  {
    name: "Statistics",
    items: [
      ["9.1", "Classifying statistical data"],
      ["9.2", "Interpreting statistical data"],
      ["9.3", "Averages and measures of spread"],
      ["9.4", "Statistical charts and diagrams"],
      ["9.5", "Scatter diagrams"],
    ],
  },
];
const STORAGE_KEY = "math4024-checklist-v1";
let completed = new Set();
try {
  completed = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
} catch (e) {}
const sections = document.getElementById("sections");
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  } catch (e) {}
  updateProgress();
}
function updateProgress() {
  const all = syllabus.flatMap((s) => s.items.map((i) => i[0]));
  const count = all.filter((id) => completed.has(id)).length;
  const pct = all.length ? Math.round((count / all.length) * 100) : 0;
  document.getElementById("progressText").textContent =
    `${count} of ${all.length} topics`;
  document.getElementById("progressBar").value = pct;
  document.getElementById("percent").textContent = `${pct}%`;
  syllabus.forEach((s, i) => {
    const n = s.items.filter((t) => completed.has(t[0])).length;
    const el = document.querySelector(`[data-count="${i}"]`);
    if (el) el.textContent = `${n}/${s.items.length}`;
  });
}
function render() {
  sections.innerHTML = "";
  syllabus.forEach((section, index) => {
    const details = document.createElement("details");
    details.className = "section";
    details.open = index === 0;
    const summary = document.createElement("summary");
    summary.innerHTML = `<span class="num">${String(index + 1).padStart(2, "0")}</span><span class="section-name"></span><span class="section-count" data-count="${index}"></span><span class="chevron">⌄</span>`;
    summary.querySelector(".section-name").textContent = section.name;
    details.appendChild(summary);
    const list = document.createElement("div");
    list.className = "items";
    section.items.forEach(([id, name]) => {
      const label = document.createElement("label");
      label.className = "topic";
      label.dataset.search = (
        id +
        " " +
        name +
        " " +
        section.name
      ).toLowerCase();
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = completed.has(id);
      input.setAttribute("aria-label", name);
      input.addEventListener("change", () => {
        input.checked ? completed.add(id) : completed.delete(id);
        save();
      });
      const code = document.createElement("span");
      code.className = "topic-code";
      code.textContent = id;
      const text = document.createElement("span");
      text.className = "topic-text";
      text.textContent = name;
      label.append(input, code, text);
      list.appendChild(label);
    });
    details.appendChild(list);
    sections.appendChild(details);
  });
  updateProgress();
}
document.getElementById("search").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll(".topic").forEach((row) => {
    const show = row.dataset.search.includes(q);
    row.style.display = show ? "flex" : "none";
    if (show) visible++;
  });
  document.querySelectorAll(".section").forEach((sec) => {
    const matching = [...sec.querySelectorAll(".topic")].some(
      (row) => row.style.display !== "none",
    );
    sec.style.display = matching ? "block" : "none";
    if (q && matching) sec.open = true;
  });
  document.getElementById("empty").style.display = visible ? "none" : "block";
});
document
  .getElementById("expandAll")
  .addEventListener("click", () =>
    document.querySelectorAll(".section").forEach((s) => (s.open = true)),
  );
document
  .getElementById("collapseAll")
  .addEventListener("click", () =>
    document.querySelectorAll(".section").forEach((s) => (s.open = false)),
  );
document.getElementById("reset").addEventListener("click", () => {
  if (confirm("Clear all checked topics and reset your progress?")) {
    completed.clear();
    save();
    document
      .querySelectorAll(".topic input")
      .forEach((i) => (i.checked = false));
  }
});
render();
