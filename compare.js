// compare.js
// 「Bootstrap 比一比」：用兩個 iframe 顯示同一份 HTML，
// 一個不載入 Bootstrap、一個載入 Bootstrap 5.3.8。
// 為什麼用 iframe？Bootstrap 的 CSS 是全域的，直接放進本站會把
// 漫畫風格的按鈕、標題、主題色全部蓋掉；iframe 可以讓兩邊互不影響。
// 依賴 main.js 的 $ 與 siteName（需在 main.js 之後載入）。

(function () {
  const BOOTSTRAP_CSS =
    '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" ' +
    'rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" ' +
    'crossorigin="anonymous">';

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, ch => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));
  }

  // 兩邊共用的內容：class 都已經寫好，差別只在有沒有載入 Bootstrap CSS
  function demoBody(who) {
    return `
      <nav class="navbar navbar-expand bg-dark" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">MyApp</a>
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link active" href="#">首頁</a></li>
            <li class="nav-item"><a class="nav-link" href="#">關於</a></li>
          </ul>
        </div>
      </nav>

      <div class="container my-3">
        <h1 class="display-6">Hello, ${who}!</h1>
        <p class="lead">同一份 HTML，只差一行 CSS。</p>

        <div class="mb-3">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-success">Success</button>
          <button class="btn btn-outline-danger">Danger</button>
        </div>

        <div class="alert alert-warning">這是一個 alert 提示框。</div>

        <div class="row mb-3 text-center">
          <div class="col-4"><div class="p-2 bg-primary text-white">col-4</div></div>
          <div class="col-4"><div class="p-2 bg-success text-white">col-4</div></div>
          <div class="col-4"><div class="p-2 bg-danger text-white">col-4</div></div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">卡片標題</h5>
            <p class="card-text">邊框、圓角、間距，Bootstrap 都幫你處理好。</p>
          </div>
        </div>

        <form class="mb-3">
          <label class="form-label" for="e">Email</label>
          <input id="e" type="email" class="form-control mb-2" placeholder="name@example.com">
          <select class="form-select mb-2"><option>選項 1</option><option>選項 2</option></select>
          <button type="button" class="btn btn-dark">送出</button>
        </form>

        <table class="table table-striped table-bordered">
          <thead><tr><th>#</th><th>名稱</th><th>數值</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Alpha</td><td>10</td></tr>
            <tr><td>2</td><td>Beta</td><td>20</td></tr>
            <tr><td>3</td><td>Gamma</td><td>30</td></tr>
          </tbody>
        </table>
      </div>`;
  }

  function buildDoc(withBootstrap) {
    // 已套用主題時，把名字帶進示範內容
    const who = escapeHtml(typeof siteName === "string" && siteName ? siteName : "world");
    return '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      (withBootstrap ? BOOTSTRAP_CSS : "") +
      "</head><body>" + demoBody(who) + "</body></html>";
  }

  function renderFrames() {
    $("frameWithout").srcdoc = buildDoc(false);
    $("frameWith").srcdoc = buildDoc(true);
  }

  function openCompare() {
    $("intro").hidden = true;
    $("compare").hidden = false;
    renderFrames();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeCompare() {
    $("compare").hidden = true;
    $("intro").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $("openCompare").addEventListener("click", openCompare);
  $("closeCompare").addEventListener("click", closeCompare);

  // 並排 / 上下排列
  $("cmpLayout").addEventListener("click", () => {
    const stacked = $("cmpGrid").classList.toggle("stack");
    $("cmpLayout").textContent = stacked ? "↔ 切換為左右並排" : "↕ 切換為上下排列";
  });
})();
