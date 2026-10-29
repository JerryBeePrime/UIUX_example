// main.js
// 負責讀取表單、更新個人化預覽，以及原本的 GitHub Pages 教學流程。

const $ = id => document.getElementById(id);

// 個人化表單互動
const profileForm = $("profileForm");

function updatePersonalPreview(event) {
  if (event) event.preventDefault();

  if (!profileForm) return;

  const salutation = $("salutation").value;
  const name = $("userName").value.trim() || "無名英雄";
  const moodKey = $("mood").value;
  const colorKey = $("favoriteColor").value;
  const personalityKey = profileForm.querySelector('input[name="personality"]:checked').value;

  const analysis = analyzeProfile(moodKey, personalityKey);
  const color = profileThemes[colorKey] || profileThemes.yellow;

  $("greeting").textContent = `${salutation} ${name}，你好！`;
  $("personalAvatar").textContent = analysis.avatar;
  $("personalSpeech").textContent = analysis.personalityLine;
  $("analysisResult").textContent =
    `分析結果：${analysis.moodName} × ${analysis.personalityName}。${analysis.moodText} ${analysis.personalityResult}`;
  $("themeNote").textContent = `已套用${color.name}主題。這個結果由你的表單回答即時計算。`;

  $("personalPreview").style.backgroundColor = color.color;
  $("personalHero").style.backgroundColor = color.color;
  document.title = `${salutation} ${name}｜COMIC DEV LAB`;
}

// ===== 主題與 Cookie =====
let siteName = ""; // 套用主題後才有值，例如「MR. 小明」
const COOKIE_NAME = "comicDevProfile";
const COOKIE_DAYS = 365;

function saveCookie(data) {
  const value = encodeURIComponent(JSON.stringify(data));
  document.cookie =
    `${COOKIE_NAME}=${value}; max-age=${COOKIE_DAYS * 86400}; path=/; SameSite=Lax`;
}

function readCookie() {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch (e) {
    return null;
  }
}

function clearCookie() {
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; SameSite=Lax`;
}

// 標題列文字：每種個性有自己的語氣
const DEFAULT_TAGLINE = "一場 GitHub Pages 冒險！";
const taglines = {
  funny: "一場 GitHub Pages 爆笑冒險！",
  cool:  "> deploy --target github-pages",
  cute:  "一起開開心心學 GitHub Pages ♡",
  chaos: "GITHUB PAGES!!! 爆炸教室!!!"
};

// 把使用者的稱謂與名字帶入整個網站（標題列、首頁問候、教學對話、結尾、頁尾）。
// 不傳參數就代表清除，文字回到預設。
const DEFAULT_FINISH = "恭喜！你已經掌握 GitHub Pages 的基本發布流程！";
const DEFAULT_FOOTER = "MADE WITH ♥ AND HTML · CSS · JAVASCRIPT";

function applyNameToSite(salutation, name) {
  siteName = salutation !== undefined
    ? `${salutation} ${name || "無名英雄"}`
    : "";

  const badge = $("headerName");
  badge.textContent = siteName ? `👤 ${siteName}` : "";
  badge.hidden = !siteName;

  const greeting = $("siteGreeting");
  greeting.textContent = siteName ? `歡迎回來，${siteName}！你的專屬冒險開始囉 🎉` : "";
  greeting.hidden = !siteName;

  $("finishText").textContent = siteName ? `恭喜 ${siteName}！${DEFAULT_FINISH.slice(3)}` : DEFAULT_FINISH;
  $("footerText").textContent = siteName ? `${DEFAULT_FOOTER} · FOR ${siteName}` : DEFAULT_FOOTER;
  document.title = siteName ? `${siteName}｜COMIC DEV LAB` : "COMIC DEV LAB｜GitHub Pages 漫畫教室";

  // 教學頁正在顯示時，也立刻更新對話框
  if (typeof showLesson === "function" && !$("lesson").hidden) showLesson();
}

// 心情會替標題列加上小符號
const moodSuffix = { energetic: " ⚡", normal: "", sleepy: " 💤" };

// 套用到整個網站：
//   配色 → <html data-theme>（themes.css）
//   個性 → <html data-style>（skins.css）
//   心情 → <html data-mood>（skins.css）　個性 × 心情 = 12 種主題
// 不傳參數就代表回到預設樣式。
function applySiteTheme(colorKey, personalityKey, moodKey) {
  const root = document.documentElement;

  if (profileThemes[colorKey]) root.setAttribute("data-theme", colorKey);
  else root.removeAttribute("data-theme");

  if (personalityData[personalityKey]) root.setAttribute("data-style", personalityKey);
  else root.removeAttribute("data-style");

  if (moodData[moodKey]) root.setAttribute("data-mood", moodKey);
  else root.removeAttribute("data-mood");

  const tagline = $("tagline");
  if (tagline) {
    tagline.textContent =
      (taglines[personalityKey] || DEFAULT_TAGLINE) + (moodSuffix[moodKey] || "");
  }
}

function setStatus(text) {
  const el = $("saveStatus");
  if (el) el.textContent = text;
}

// 把 Cookie 裡的資料填回表單
function restoreFromCookie() {
  const saved = readCookie();
  if (!saved) return false;
  if (saved.salutation) $("salutation").value = saved.salutation;
  if (saved.name) $("userName").value = saved.name;
  if (saved.mood) $("mood").value = saved.mood;
  if (saved.color) $("favoriteColor").value = saved.color;
  if (saved.personality) {
    const radio = profileForm.querySelector(`input[name="personality"][value="${saved.personality}"]`);
    if (radio) radio.checked = true;
  }
  applySiteTheme(saved.color, saved.personality, saved.mood);
  applyNameToSite(saved.salutation || "", saved.name);
  return true;
}

if (profileForm) {
  const restored = restoreFromCookie();

  profileForm.addEventListener("submit", updatePersonalPreview);
  profileForm.querySelectorAll("input, select").forEach(field => {
    field.addEventListener("change", updatePersonalPreview);
  });
  $("userName").addEventListener("input", updatePersonalPreview);

  // 按鈕：套用整站主題並存入 Cookie
  $("applyTheme").addEventListener("click", () => {
    const data = {
      salutation: $("salutation").value,
      name: $("userName").value.trim(),
      mood: $("mood").value,
      color: $("favoriteColor").value,
      personality: profileForm.querySelector('input[name="personality"]:checked').value
    };
    applySiteTheme(data.color, data.personality, data.mood);
    applyNameToSite(data.salutation, data.name);
    saveCookie(data);
    updatePersonalPreview();
    setStatus(`✅ 已套用「${personalityData[data.personality].name} × ${moodData[data.mood].name}」主題（${profileThemes[data.color].name}配色），並記住你的設定（保存 ${COOKIE_DAYS} 天）。`);
  });

  // 按鈕：清除記憶並回到預設主題
  $("clearTheme").addEventListener("click", () => {
    clearCookie();
    applySiteTheme();
    applyNameToSite();
    setStatus("🧹 已清除記憶，網站回到預設樣式。");
  });

  updatePersonalPreview();
  if (restored) setStatus("👋 歡迎回來！已載入你上次保存的主題。");
}

// 原本的 GitHub Pages 教學內容
const lessons = [
  {
    title: "建立你的 Repository",
    avatar: "🗂️",
    speech: "先準備一個地方，放置你的網站檔案！",
    content: `
      <p>Repository（儲存庫）就是存放專案檔案的地方。</p>
      <ol>
        <li>前往 <a href="https://github.com/" target="_blank" rel="noopener">GitHub</a> 並登入。</li>
        <li>點選右上角的 <b>＋ → New repository</b>。</li>
        <li>輸入名稱，例如 <b>my-comic-site</b>。</li>
        <li>選擇 Public，然後建立儲存庫。</li>
      </ol>
      <p>💡 Public Repository 最適合這個公開網站教學範例。</p>`
  },
  {
    title: "製作 index.html",
    avatar: "💻",
    speech: "這就是網站的主角！HTML 負責網頁的內容與結構。",
    content: `
      <p>建立一個名為 <b>index.html</b> 的檔案，先放入以下內容：</p>
      <div class="code">&lt;!DOCTYPE html&gt;<br>
      &lt;html lang="zh-Hant"&gt;<br>
      &lt;meta charset="UTF-8"&gt;<br>
      &lt;title&gt;我的第一個網站&lt;/title&gt;<br>
      &lt;h1&gt;Hello GitHub Pages!&lt;/h1&gt;<br>
      &lt;/html&gt;</div>
      <p>你也可以把完整的漫畫教室程式碼放進這個檔案。</p>`
  },
  {
    title: "上傳網站檔案",
    avatar: "📤",
    speech: "把檔案放進 Repository，網站就有材料可以發布囉！",
    content: `
      <ol>
        <li>打開剛剛建立的 Repository。</li>
        <li>選擇 <b>Add file → Create new file</b>。</li>
        <li>檔名輸入 <b>index.html</b>。</li>
        <li>貼上 HTML 程式碼，再點選 <b>Commit changes</b>。</li>
      </ol>
      <p>也可以使用 Upload files 上傳現有檔案。</p>
      <p>⚠️ 檔名大小寫要一致，建議使用小寫的 index.html。</p>`
  },
  {
    title: "啟用 GitHub Pages",
    avatar: "🚀",
    speech: "最後一步！把你的 Repository 變成公開網站。",
    content: `
      <ol>
        <li>進入 Repository 的 <b>Settings</b>。</li>
        <li>在側邊選單找到 <b>Pages</b>。</li>
        <li>在 Build and deployment 選擇 <b>Deploy from a branch</b>。</li>
        <li>Branch 選擇 <b>main</b>，資料夾選 <b>/(root)</b>。</li>
        <li>按下 <b>Save</b>，等待網站部署完成。</li>
      </ol>
      <div class="code">https://你的帳號.github.io/my-comic-site/</div>
      <p>🎉 一般專案網站的網址會包含 Repository 名稱。部署可能需要幾分鐘。</p>
      <p>官方文件：<a href="https://docs.github.com/pages" target="_blank" rel="noopener">GitHub Pages Docs ↗</a></p>`
  }
];

let current = 0;

function showLesson() {
  const item = lessons[current];
  $("stepTag").textContent = `MISSION 0${current + 1}`;
  $("stepCount").textContent = `STEP ${current + 1} / ${lessons.length}`;
  $("lessonTitle").textContent = item.title;
  $("avatar").textContent = item.avatar;
  $("speech").textContent = siteName ? `${siteName}，${item.speech}` : item.speech;
  $("lessonContent").innerHTML = item.content;
  $("progress").style.width = `${((current + 1) / lessons.length) * 100}%`;
  $("progressText").textContent = `教學進度：${current + 1} / ${lessons.length}`;
  $("prev").disabled = current === 0;
  $("next").textContent = current === lessons.length - 1
    ? "挑戰最終測驗！ 💥"
    : "下一步 ➜";
}

$("start").addEventListener("click", () => {
  $("intro").hidden = true;
  $("lesson").hidden = false;
  current = 0;
  showLesson();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("prev").addEventListener("click", () => {
  if (current > 0) {
    current--;
    showLesson();
  }
});

$("next").addEventListener("click", () => {
  if (current < lessons.length - 1) {
    current++;
    showLesson();
  } else {
    $("lesson").hidden = true;
    $("quiz").hidden = false;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll(".choice").forEach(button => {
  button.addEventListener("click", () => {
    const correct = button.dataset.answer === "b";
    $("feedback").textContent = correct
      ? "✅ 答對了！index.html 通常是網站的預設首頁。"
      : "💥 再想想！網站首頁通常使用 index.html。";
    document.querySelectorAll(".choice").forEach(choice => {
      choice.classList.remove("correct", "wrong");
      choice.disabled = true;
    });
    button.classList.add(correct ? "correct" : "wrong");
    if (correct) {
      $("finish").hidden = false;
    } else {
      const retry = document.createElement("button");
      retry.textContent = "再試一次";
      retry.id = "retry";
      retry.addEventListener("click", resetQuiz);
      $("feedback").append(" ", retry);
    }
  });
});

function resetQuiz() {
  document.querySelectorAll(".choice").forEach(button => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });
  $("feedback").textContent = "";
  $("finish").hidden = true;
}

$("restart").addEventListener("click", () => {
  resetQuiz();
  $("quiz").hidden = true;
  $("intro").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});
