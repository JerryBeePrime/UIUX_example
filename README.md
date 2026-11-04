# COMIC DEV LAB｜GitHub Pages 漫畫教室

## 檔案說明
- `index.html`：網頁結構、個人化表單、教學區與測驗區。
- `style.css`：漫畫風格與版面樣式。
- `themes.css`：配色主題（依「最喜歡的顏色」，`<html data-theme>`）。
- `skins.css`：整站風格（依「個性」，`<html data-style>`：字體、邊框、圓角、陰影、背景、動畫）。
- `algorithm.js`：依照精神狀態與個性產生分析資料。
- `main.js`：讀取表單、更新預覽，以及控制教學流程。
- `compare.css`：「Bootstrap 比一比」頁面樣式（沿用主題變數，會跟著配色／個性／心情變化）。
- `compare.js`：用兩個 iframe 顯示同一份 HTML（不載入／載入 Bootstrap 5.3.8），需在 `main.js` 之後載入。
- `README.md`：專案說明與部署方式。

## 本機預覽
將所有檔案放在同一個資料夾，直接用瀏覽器開啟 `index.html` 即可。

## GitHub Pages 部署
1. 將這些檔案全部上傳到 GitHub Repository 根目錄。
2. 開啟 Repository 的 **Settings → Pages**。
3. 在 **Build and deployment** 選擇 **Deploy from a branch**。
4. Branch 選擇 `main`，資料夾選 `/(root)`，按下 **Save**。
5. 等待部署完成後，使用 GitHub Pages 顯示的網址瀏覽。

## 教學重點
表單使用 `input`、`select` 與 `radio`；JavaScript 讀取使用者選項，更新個人化問候、分析評語、漫畫角色與主題顏色。分析結果是規則式示範，不是 AI 診斷。
