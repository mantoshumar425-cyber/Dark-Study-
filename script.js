/* =========================================================
   DARK STUDY
   Complete frontend application
   ========================================================= */


/* ---------------------------------------------------------
   DATA
   --------------------------------------------------------- */

const DATA = {

  batches: [
    {
      id: "class-6",
      title: "Class 6",
      class: "6",
      icon: "📘",
      description: "Study resources for Class 6 students.",
      tags: ["Class 6", "School"]
    },
    {
      id: "class-7",
      title: "Class 7",
      class: "7",
      icon: "📗",
      description: "Study resources for Class 7 students.",
      tags: ["Class 7", "School"]
    },
    {
      id: "class-8",
      title: "Class 8",
      class: "8",
      icon: "📙",
      description: "Study resources for Class 8 students.",
      tags: ["Class 8", "School"]
    },
    {
      id: "class-9",
      title: "Class 9",
      class: "9",
      icon: "📕",
      description: "Study resources for Class 9 students.",
      tags: ["Class 9", "School"]
    },
    {
      id: "class-10",
      title: "Class 10",
      class: "10",
      icon: "🎓",
      description: "Complete Class 10 study section.",
      tags: ["Class 10", "Board"]
    },
    {
      id: "class-11",
      title: "Class 11",
      class: "11",
      icon: "📚",
      description: "Study resources for Class 11 students.",
      tags: ["Class 11"]
    },
    {
      id: "class-12",
      title: "Class 12",
      class: "12",
      icon: "🏆",
      description: "Study resources for Class 12 students.",
      tags: ["Class 12", "Board"]
    },
    {
      id: "other",
      title: "Other Batches",
      class: "other",
      icon: "🚀",
      description: "Other learning programs and resources.",
      tags: ["Other"]
    }
  ],

  /*
     Add only PUBLIC resources here.

     Example video:
     {
       id: "video-1",
       title: "Light Reflection",
       subject: "Physics",
       batch: "class-10",
       url: "https://www.youtube.com/watch?v=VIDEO_ID",
       description: "Class 10 Physics lecture"
     }

     Example PDF:
     {
       id: "pdf-1",
       title: "Physics Notes",
       subject: "Physics",
       batch: "class-10",
       url: "https://example.com/file.pdf",
       description: "Chapter notes"
     }

     Example test:
     {
       id: "test-1",
       title: "Science Test",
       batch: "class-10",
       questions: [
         {
           q: "What is the SI unit of force?",
           options: ["Watt", "Newton", "Joule", "Pascal"],
           answer: 1
         }
       ]
     }
  */

  videos: [],
  pdfs: [],
  tests: []
};


/* ---------------------------------------------------------
   STATE
   --------------------------------------------------------- */

const STORAGE_KEY = "darkStudyState";

let state = loadState();

function defaultState() {
  return {
    bookmarks: [],
    completed: [],
    testScores: {},
    notes: "",
    theme: "dark"
  };
}

function loadState() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultState();
    }

    return {
      ...defaultState(),
      ...JSON.parse(saved)
    };

  } catch (error) {

    console.error("State load error:", error);
    return defaultState();

  }
}

function saveState() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

  updateProgress();

}


/* ---------------------------------------------------------
   DOM
   --------------------------------------------------------- */

const $ = selector => document.querySelector(selector);

const $$ = selector =>
  Array.from(document.querySelectorAll(selector));


/* ---------------------------------------------------------
   THEME
   --------------------------------------------------------- */

function applyTheme() {

  document.body.classList.toggle(
    "light",
    state.theme === "light"
  );

  $("#themeBtn").textContent =
    state.theme === "light" ? "☀️" : "🌙";
}

$("#themeBtn").addEventListener("click", () => {

  state.theme =
    state.theme === "dark"
      ? "light"
      : "dark";

  saveState();
  applyTheme();

});


/* ---------------------------------------------------------
   MOBILE MENU
   --------------------------------------------------------- */

$("#menuBtn").addEventListener("click", () => {

  $("#mainNav").classList.toggle("open");

});

$$(".nav a").forEach(link => {

  link.addEventListener("click", () => {
    $("#mainNav").classList.remove("open");
  });

});


/* ---------------------------------------------------------
   TOAST
   --------------------------------------------------------- */

let toastTimer;

function toast(message) {

  const el = $("#toast");

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, 2500);
}


/* ---------------------------------------------------------
   MODAL
   --------------------------------------------------------- */

function openModal(html) {

  $("#modalContent").innerHTML = html;
  $("#modal").classList.add("open");

}

function closeModal() {

  $("#modal").classList.remove("open");
  $("#modalContent").innerHTML = "";

}

$("#modalClose").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", closeModal);

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeModal();
  }

});


/* ---------------------------------------------------------
   HELPERS
   --------------------------------------------------------- */

function escapeHTML(value = "") {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}

function isBookmarked(id) {

  return state.bookmarks.includes(id);

}

function toggleBookmark(id) {

  if (isBookmarked(id)) {

    state.bookmarks =
      state.bookmarks.filter(x => x !== id);

    toast("Removed from bookmarks");

  } else {

    state.bookmarks.push(id);

    toast("Added to bookmarks ⭐");

  }

  saveState();
  renderAll();

}

function markCompleted(id) {

  if (!state.completed.includes(id)) {

    state.completed.push(id);

    saveState();

    toast("Marked as completed ✓");

    renderAll();
  }

}


/* ---------------------------------------------------------
   BATCHES
   --------------------------------------------------------- */

let currentBatchFilter = "all";

function renderBatches() {

  const grid = $("#batchGrid");

  const filtered =
    currentBatchFilter === "all"
      ? DATA.batches
      : DATA.batches.filter(
          batch => batch.class === currentBatchFilter
        );

  $("#batchCount").textContent = filtered.length;

  if (!filtered.length) {

    grid.innerHTML = `
      <div class="empty">
        No batches found.
      </div>
    `;

    return;
  }

  grid.innerHTML = filtered.map(batch => {

    const resourceCount =
      DATA.videos.filter(x => x.batch === batch.id).length +
      DATA.pdfs.filter(x => x.batch === batch.id).length +
      DATA.tests.filter(x => x.batch === batch.id).length;

    return `
      <article class="card">

        <div class="card-icon">
          ${batch.icon}
        </div>

        <h3>${escapeHTML(batch.title)}</h3>

        <p>
          ${escapeHTML(batch.description)}
        </p>

        <div class="card-meta">

          ${batch.tags.map(tag =>
            `<span class="tag">${escapeHTML(tag)}</span>`
          ).join("")}

          <span class="tag">
            ${resourceCount} resources
          </span>

        </div>

        <div class="card-actions">

          <button
            class="main-action"
            onclick="openBatch('${batch.id}')">
            Open
          </button>

          <button
            onclick="viewBatchResources('${batch.id}')">
            Resources
          </button>

        </div>

      </article>
    `;

  }).join("");

}


$$(".filter").forEach(button => {

  button.addEventListener("click", () => {

    $$(".filter").forEach(
      b => b.classList.remove("active")
    );

    button.classList.add("active");

    currentBatchFilter =
      button.dataset.filter;

    renderBatches();

  });

});


function openBatch(batchId) {

  const batch =
    DATA.batches.find(x => x.id === batchId);

  if (!batch) return;

  const videos =
    DATA.videos.filter(x => x.batch === batchId);

  const pdfs =
    DATA.pdfs.filter(x => x.batch === batchId);

  const tests =
    DATA.tests.filter(x => x.batch === batchId);

  openModal(`

    <div class="card-icon">
      ${batch.icon}
    </div>

    <h2>${escapeHTML(batch.title)}</h2>

    <p>${escapeHTML(batch.description)}</p>

    <div class="card-meta">
      ${batch.tags.map(tag =>
        `<span class="tag">${escapeHTML(tag)}</span>`
      ).join("")}
    </div>

    <hr style="border:0;border-top:1px solid var(--border);margin:20px 0">

    <h3>Available Resources</h3>

    <div class="card-actions">

      <button
        class="main-action"
        onclick="showBatchVideos('${batchId}')">
        🎥 ${videos.length} Lectures
      </button>

      <button
        onclick="showBatchPDFs('${batchId}')">
        📄 ${pdfs.length} PDFs
      </button>

      <button
        onclick="showBatchTests('${batchId}')">
        📝 ${tests.length} Tests
      </button>

    </div>

  `);

}


function viewBatchResources(batchId) {

  openBatch(batchId);

}


/* ---------------------------------------------------------
   VIDEOS
   --------------------------------------------------------- */

function renderVideos() {

  const grid = $("#lectureGrid");

  $("#lectureCount").textContent =
    DATA.videos.length;

  if (!DATA.videos.length) {

    grid.innerHTML = `
      <div class="empty">
        🎥 No lectures have been added yet.
      </div>
    `;

    return;
  }

  grid.innerHTML =
    DATA.videos.map(resourceCard).join("");

}


function resourceCard(item) {

  const saved =
    isBookmarked(item.id);

  const completed =
    state.completed.includes(item.id);

  return `

    <article class="card">

      <button
        class="bookmark ${saved ? "saved" : ""}"
        onclick="toggleBookmark('${item.id}')">
        ${saved ? "★" : "☆"}
      </button>

      <div class="card-icon">
        ${item.type === "pdf" ? "📄" :
          item.type === "test" ? "📝" : "🎥"}
      </div>

      <h3>
        ${escapeHTML(item.title)}
      </h3>

      <p>
        ${escapeHTML(item.description || "")}
      </p>

      <div class="card-meta">

        ${item.subject ?
          `<span class="tag">${escapeHTML(item.subject)}</span>`
          : ""}

        ${item.batch ?
          `<span class="tag">${escapeHTML(item.batch)}</span>`
          : ""}

        ${completed ?
          `<span class="tag">✓ Completed</span>`
          : ""}

      </div>

      <div class="card-actions">

        <button
          class="main-action"
          onclick="openResource('${item.id}','${item.type || "video"}')">
          Open
        </button>

        <button
          onclick="markCompleted('${item.id}')">
          ✓
        </button>

      </div>

    </article>
  `;
}


function openResource(id, type) {

  let item;

  if (type === "pdf") {

    item =
      DATA.pdfs.find(x => x.id === id);

  } else if (type === "test") {

    item =
      DATA.tests.find(x => x.id === id);

  } else {

    item =
      DATA.videos.find(x => x.id === id);

  }

  if (!item) {

    toast("Resource not found");

    return;
  }

  if (type === "pdf") {

    openPDF(item);

  } else if (type === "test") {

    openTest(item);

  } else {

    openVideo(item);

  }

}


/* ---------------------------------------------------------
   VIDEO PLAYER
   --------------------------------------------------------- */

function youtubeEmbed(url) {

  try {

    const parsed =
      new URL(url);

    if (parsed.hostname.includes("youtube.com")) {

      const id =
        parsed.searchParams.get("v");

      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

    }

    if (parsed.hostname === "youtu.be") {

      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;

    }

  } catch {}

  return url;
}


function openVideo(video) {

  const src =
    youtubeEmbed(video.url);

  const isYoutube =
    src.includes("youtube.com/embed");

  openModal(`

    <h2>${escapeHTML(video.title)}</h2>

    <p style="color:var(--muted);margin:8px 0 18px">
      ${escapeHTML(video.description || "")}
    </p>

    ${
      isYoutube
      ?
      `<iframe
        class="media-frame"
        src="${escapeHTML(src)}"
        title="${escapeHTML(video.title)}"
        allowfullscreen>
      </iframe>`
      :
      `<video
        class="media-frame"
        src="${escapeHTML(video.url)}"
        controls
        playsinline>
      </video>`
    }

    <div class="card-actions">

      <button
        class="main-action"
        onclick="markCompleted('${video.id}');closeModal()">
        ✓ Mark Completed
      </button>

      <button
        onclick="toggleBookmark('${video.id}');closeModal()">
        ${isBookmarked(video.id)
          ? "★ Remove Bookmark"
          : "☆ Bookmark"}
      </button>

    </div>

  `);

}


/* ---------------------------------------------------------
   PDF
   --------------------------------------------------------- */

function renderPDFs() {

  const grid = $("#pdfGrid");

  $("#pdfCount").textContent =
    DATA.pdfs.length;

  if (!DATA.pdfs.length) {

    grid.innerHTML = `
      <div class="empty">
        📄 No PDFs have been added yet.
      </div>
    `;

    return;
  }

  grid.innerHTML =
    DATA.pdfs.map(resourceCard).join("");

}


function openPDF(pdf) {

  openModal(`

    <h2>${escapeHTML(pdf.title)}</h2>

    <p style="color:var(--muted);margin:8px 0 18px">
      ${escapeHTML(pdf.description || "")}
    </p>

    <iframe
      class="pdf-frame"
      src="${escapeHTML(pdf.url)}">
    </iframe>

    <div class="card-actions">

      <a
        class="main-action"
        href="${escapeHTML(pdf.url)}"
        target="_blank"
        rel="noopener">
        Open Full PDF
      </a>

      <button
        onclick="toggleBookmark('${pdf.id}');closeModal()">
        ${isBookmarked(pdf.id)
          ? "★ Remove Bookmark"
          : "☆ Bookmark"}
      </button>

      <button
        onclick="markCompleted('${pdf.id}');closeModal()">
        ✓ Completed
      </button>

    </div>

  `);

}


/* ---------------------------------------------------------
   TESTS
   --------------------------------------------------------- */

function renderTests() {

  const grid = $("#testGrid");

  $("#testCount").textContent =
    DATA.tests.length;

  if (!DATA.tests.length) {

    grid.innerHTML = `
      <div class="empty">
        📝 No tests have been added yet.
      </div>
    `;

    return;
  }

  grid.innerHTML =
    DATA.tests.map(resourceCard).join("");

}


function openTest(test) {

  if (!Array.isArray(test.questions) ||
      !test.questions.length) {

    toast("This test has no questions.");

    return;
  }

  const previous =
    state.testScores[test.id];

  openModal(`

    <h2>${escapeHTML(test.title)}</h2>

    <p style="color:var(--muted)">
      ${test.questions.length} questions
    </p>

    ${previous !== undefined
      ? `<div class="tag" style="display:inline-block;margin-top:10px">
          Previous score: ${previous}/${test.questions.length}
        </div>`
      : ""
    }

    <form id="testForm">

      ${test.questions.map((q,index) => `

        <div class="question">

          <h4>
            ${index + 1}. ${escapeHTML(q.q)}
          </h4>

          ${q.options.map((option,optionIndex) => `

            <label class="option">

              <input
                type="radio"
                name="question-${index}"
                value="${optionIndex}">

              ${escapeHTML(option)}

            </label>

          `).join("")}

        </div>

      `).join("")}

      <button
        type="submit"
        class="btn primary"
        style="margin-top:20px">
        Submit Test
      </button>

    </form>

    <div id="testResult"></div>

  `);


  $("#testForm").addEventListener(
    "submit",
    event => {

      event.preventDefault();

      let score = 0;

      test.questions.forEach((question,index) => {

        const selected =
          document.querySelector(
            `input[name="question-${index}"]:checked`
          );

        if (
          selected &&
          Number(selected.value) ===
          Number(question.answer)
        ) {
          score++;
        }

      });

      state.testScores[test.id] = score;

      saveState();

      $("#testResult").innerHTML = `

        <div style="
          margin-top:20px;
          padding:20px;
          background:var(--card2);
          border-radius:15px;
          text-align:center">

          <h3>
            Score: ${score}/${test.questions.length}
          </h3>

          <p style="color:var(--muted)">
            ${Math.round(
              score / test.questions.length * 100
            )}% correct
          </p>

        </div>
      `;

      toast("Test submitted!");

    }
  );

}


/* ---------------------------------------------------------
   BATCH RESOURCE VIEW
   --------------------------------------------------------- */

function showBatchVideos(batchId) {

  const items =
    DATA.videos.filter(x => x.batch === batchId);

  showResourceList("🎥 Lectures", items);

}


function showBatchPDFs(batchId) {

  const items =
    DATA.pdfs.filter(x => x.batch === batchId);

  showResourceList("📄 PDFs", items);

}


function showBatchTests(batchId) {

  const items =
    DATA.tests.filter(x => x.batch === batchId);

  showResourceList("📝 Tests", items);

}


function showResourceList(title, items) {

  openModal(`

    <h2>${title}</h2>

    <div style="margin-top:20px">

      ${
        items.length
        ?
        items.map(item => `

          <div class="card" style="margin-bottom:12px">

            <h3>${escapeHTML(item.title)}</h3>

            <p>
              ${escapeHTML(item.description || "")}
            </p>

            <div class="card-actions">

              <button
                class="main-action"
                onclick="closeModal();openResource('${item.id}','${item.type || "video"}')">
                Open
              </button>

            </div>

          </div>

        `).join("")
        :
        `<div class="empty">No resources available.</div>`
      }

    </div>
  `);

}


/* ---------------------------------------------------------
   GLOBAL SEARCH
   --------------------------------------------------------- */

const searchInput =
  $("#globalSearch");

const searchResults =
  $("#searchResults");


searchInput.addEventListener(
  "input",
  performSearch
);


$("#clearSearch").addEventListener(
  "click",
  () => {

    searchInput.value = "";
    searchResults.classList.remove("show");
    searchResults.innerHTML = "";

  }
);


function performSearch() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  if (!query) {

    searchResults.classList.remove("show");
    return;

  }

  const results = [];

  DATA.batches.forEach(item => {

    const text =
      `${item.title} ${item.description} ${item.tags.join(" ")}`
        .toLowerCase();

    if (text.includes(query)) {

      results.push({
        type: "batch",
        item
      });

    }

  });


  DATA.videos.forEach(item => {

    const text =
      `${item.title} ${item.description || ""} ${item.subject || ""}`
        .toLowerCase();

    if (text.includes(query)) {

      results.push({
        type: "video",
        item
      });

    }

  });


  DATA.pdfs.forEach(item => {

    const text =
      `${item.title} ${item.description || ""} ${item.subject || ""}`
        .toLowerCase();

    if (text.includes(query)) {

      results.push({
        type: "pdf",
        item
      });

    }

  });


  DATA.tests.forEach(item => {

    const text =
      `${item.title} ${item.description || ""}`
        .toLowerCase();

    if (text.includes(query)) {

      results.push({
        type: "test",
        item
      });

    }

  });


  if (!results.length) {

    searchResults.innerHTML = `
      <div class="search-result">
        No results found.
      </div>
    `;

  } else {

    searchResults.innerHTML =
      results.slice(0,12).map(result => {

        const item = result.item;

        return `

          <button
            class="search-result"
            onclick="searchOpen('${result.type}','${item.id}')">

            <strong>
              ${result.type === "batch"
                ? "📚"
                : result.type === "video"
                ? "🎥"
                : result.type === "pdf"
                ? "📄"
                : "📝"
              }
              ${escapeHTML(item.title)}
            </strong>

            <div style="
              color:var(--muted);
              font-size:12px">
              ${result.type}
            </div>

          </button>
        `;

      }).join("");

  }

  searchResults.classList.add("show");

}


function searchOpen(type,id) {

  searchResults.classList.remove("show");

  if (type === "batch") {

    openBatch(id);

  } else {

    openResource(id,type);

  }

}


/* ---------------------------------------------------------
   PROGRESS
   --------------------------------------------------------- */

function updateProgress() {

  const total =
    DATA.videos.length +
    DATA.pdfs.length +
    DATA.tests.length;

  const completed =
    state.completed.filter(id =>
      DATA.videos.some(x => x.id === id) ||
      DATA.pdfs.some(x => x.id === id) ||
      DATA.tests.some(x => x.id === id)
    ).length;

  const percentage =
    total
      ? Math.min(
          100,
          Math.round(completed / total * 100)
        )
      : 0;

  $("#completedCount").textContent =
    completed;

  $("#bookmarkCount").textContent =
    state.bookmarks.length;

  $("#testScoreCount").textContent =
    Object.keys(state.testScores).length;

  $("#progressBar").style.width =
    percentage + "%";

  $("#progressText").textContent =
    `${percentage}% complete`;

}


/* ---------------------------------------------------------
   BOOKMARKS
   --------------------------------------------------------- */

$("#bookmarkBtn").addEventListener(
  "click",
  showBookmarks
);


function showBookmarks() {

  const items = [

    ...DATA.videos,
    ...DATA.pdfs,
    ...DATA.tests

  ].filter(item =>
    state.bookmarks.includes(item.id)
  );

  openModal(`

    <h2>⭐ My Bookmarks</h2>

    <div style="margin-top:20px">

      ${
        items.length
        ?
        items.map(item => {

          const type =
            DATA.videos.includes(item)
              ? "video"
              : DATA.pdfs.includes(item)
              ? "pdf"
              : "test";

          return `

            <div class="card" style="margin-bottom:12px">

              <h3>${escapeHTML(item.title)}</h3>

              <p>
                ${escapeHTML(item.description || "")}
              </p>

              <div class="card-actions">

                <button
                  class="main-action"
                  onclick="closeModal();openResource('${item.id}','${type}')">
                  Open
                </button>

                <button
                  onclick="toggleBookmark('${item.id}');showBookmarks()">
                  ★ Remove
                </button>

              </div>

            </div>

          `;

        }).join("")
        :
        `<div class="empty">
          No bookmarks yet.
        </div>`
      }

    </div>
  `);

}


/* ---------------------------------------------------------
   NOTES
   --------------------------------------------------------- */

$("#notesBtn").addEventListener(
  "click",
  openNotes
);


function openNotes() {

  openModal(`

    <h2>📝 My Notes</h2>

    <p style="color:var(--muted);margin:8px 0 15px">
      These notes are saved in your browser.
    </p>

    <textarea
      id="notesArea"
      class="notes-area"
      placeholder="Write your personal study notes here..."
    >${escapeHTML(state.notes)}</textarea>

    <div class="card-actions">

      <button
        class="main-action"
        id="saveNotes">
        Save Notes
      </button>

      <button
        id="clearNotes">
        Clear
      </button>

    </div>

  `);


  $("#saveNotes").addEventListener(
    "click",
    () => {

      state.notes =
        $("#notesArea").value;

      saveState();

      toast("Notes saved ✓");

    }
  );


  $("#clearNotes").addEventListener(
    "click",
    () => {

      $("#notesArea").value = "";

      state.notes = "";

      saveState();

    }
  );

}


/* ---------------------------------------------------------
   CALCULATOR
   --------------------------------------------------------- */

$("#calculatorBtn").addEventListener(
  "click",
  openCalculator
);


function openCalculator() {

  openModal(`

    <h2>🧮 Calculator</h2>

    <div class="calc">

      <input
        id="calcDisplay"
        class="calc-display"
        readonly
        value="">

      <div class="calc-grid">

        ${[
          "C","⌫","%","/",
          "7","8","9","*",
          "4","5","6","-",
          "1","2","3","+",
          "0",".","="
        ].map(key =>
          `<button onclick="calcPress('${key}')">${key}</button>`
        ).join("")}

      </div>

    </div>

  `);

}


window.calcPress = function(key) {

  const display =
    $("#calcDisplay");

  if (!display) return;

  if (key === "C") {

    display.value = "";

  } else if (key === "⌫") {

    display.value =
      display.value.slice(0,-1);

  } else if (key === "=") {

    try {

      /*
        Only basic arithmetic is supported.
        Do not execute arbitrary text.
      */

      if (!/^[0-9+\-*/%.()\s]+$/.test(display.value)) {
        throw new Error();
      }

      display.value =
        Function(
          `"use strict"; return (${display.value})`
        )();

    } catch {

      display.value = "Error";

    }

  } else {

    if (display.value === "Error") {
      display.value = "";
    }

    display.value += key;

  }

};


/* ---------------------------------------------------------
   STUDY TIMER
   --------------------------------------------------------- */

let timerInterval = null;
let timerSeconds = 25 * 60;

$("#timerBtn").addEventListener(
  "click",
  openTimer
);


function formatTime(seconds) {

  const mins =
    Math.floor(seconds / 60)
      .toString()
      .padStart(2,"0");

  const secs =
    (seconds % 60)
      .toString()
      .padStart(2,"0");

  return `${mins}:${secs}`;

}


function openTimer() {

  openModal(`

    <div class="timer">

      <h2>⏱️ Study Timer</h2>

      <div
        id="timerDisplay"
        class="timer-display">
        ${formatTime(timerSeconds)}
      </div>

      <div class="card-actions">

        <button
          class="main-action"
          id="startTimer">
          Start
        </button>

        <button
          id="pauseTimer">
          Pause
        </button>

        <button
          id="resetTimer">
          Reset
        </button>

      </div>

    </div>

  `);


  $("#startTimer").onclick =
    startTimer;

  $("#pauseTimer").onclick =
    pauseTimer;

  $("#resetTimer").onclick =
    resetTimer;

}


function startTimer() {

  if (timerInterval) return;

  timerInterval =
    setInterval(() => {

      if (timerSeconds <= 0) {

        pauseTimer();

        toast("Study session complete! 🎉");

        return;

      }

      timerSeconds--;

      const display =
        $("#timerDisplay");

      if (display) {
        display.textContent =
          formatTime(timerSeconds);
      }

    },1000);

}


function pauseTimer() {

  clearInterval(timerInterval);

  timerInterval = null;

}


function resetTimer() {

  pauseTimer();

  timerSeconds = 25 * 60;

  const display =
    $("#timerDisplay");

  if (display) {
    display.textContent =
      formatTime(timerSeconds);
  }

}


/* ---------------------------------------------------------
   BACKUP
   --------------------------------------------------------- */

$("#exportBtn").addEventListener(
  "click",
  exportBackup
);


function exportBackup() {

  const backup = {

    app: "Dark Study",
    version: 1,
    exportedAt: new Date().toISOString(),

    state

  };

  const blob =
    new Blob(
      [JSON.stringify(backup,null,2)],
      {type:"application/json"}
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `dark-study-backup-${new Date()
      .toISOString()
      .slice(0,10)}.json`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);

  toast("Backup exported ✓");

}


$("#importBtn").addEventListener(
  "click",
  () => $("#importFile").click()
);


$("#importFile").addEventListener(
  "change",
  async event => {

    const file =
      event.target.files[0];

    if (!file) return;

    try {

      const text =
        await file.text();

      const backup =
        JSON.parse(text);

      if (
        !backup ||
        backup.app !== "Dark Study" ||
        !backup.state
      ) {

        throw new Error("Invalid backup");

      }

      state = {
        ...defaultState(),
        ...backup.state
      };

      saveState();

      applyTheme();
      renderAll();

      toast("Backup restored ✓");

    } catch (error) {

      console.error(error);

      toast("Invalid backup file");

    }

    event.target.value = "";

  }
);


/* ---------------------------------------------------------
   QUICK ACCESS
   --------------------------------------------------------- */

$$("[data-scroll]").forEach(button => {

  button.addEventListener("click", () => {

    const id =
      button.dataset.scroll;

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth"
      });

  });

});


/* ---------------------------------------------------------
   APP BUTTON
   --------------------------------------------------------- */

$("#appBtn").addEventListener(
  "click",
  () => {

    toast(
      "Add your official APK URL in script.js"
    );

  }
);


/* ---------------------------------------------------------
   RENDER ALL
   --------------------------------------------------------- */

function renderAll() {

  renderBatches();
  renderVideos();
  renderPDFs();
  renderTests();
  updateProgress();

}


/* ---------------------------------------------------------
   YEAR
   --------------------------------------------------------- */

$("#year").textContent =
  new Date().getFullYear();


/* ---------------------------------------------------------
   INITIALIZE
   --------------------------------------------------------- */

applyTheme();
renderAll();
