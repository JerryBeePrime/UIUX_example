// algorithm.js
// 根據使用者的精神狀態、喜歡的顏色與個性，整理個人化分析所需資料。

const profileThemes = {
  yellow: { color: "#ffe45c", name: "黃色" },
  pink:   { color: "#ff8da1", name: "粉紅色" },
  blue:   { color: "#8ce4ff", name: "藍色" },
  black:  { color: "#b8b8c8", name: "黑色" }
};

const personalityData = {
  funny: { avatar: "🤡", name: "搞笑型", line: "你的靈魂正在申請延長休息時間。", result: "你擅長用幽默化解尷尬，是團隊裡的氣氛救援隊。" },
  cool:  { avatar: "😎", name: "冷酷型", line: "少說一句話，多解決三個 Bug。", result: "你走冷靜分析路線，適合先觀察、再精準出手。" },
  cute:  { avatar: "🐰", name: "可愛型", line: "今天也要把世界變得軟綿綿！", result: "你的親和力是隱藏技能，適合用耐心逐步完成任務。" },
  chaos: { avatar: "👾", name: "混亂型", line: "計畫？沒有。但靈感正在爆炸！", result: "你充滿突發奇想，記得把靈感整理成可執行的步驟。" }
};

const moodData = {
  energetic: { name: "精神百倍", text: "能量槽已滿！今天適合挑戰新功能。" },
  normal: { name: "普普通通", text: "穩定輸出中，按自己的節奏完成任務就好。" },
  sleepy: { name: "靈魂已下班", text: "先喝水、伸展一下，再挑一個最小任務完成吧。" }
};

// 將使用者的選項轉換成分析結果，方便 main.js 顯示。
function analyzeProfile(moodKey, personalityKey) {
  const mood = moodData[moodKey] || moodData.normal;
  const personality = personalityData[personalityKey] || personalityData.funny;
  return {
    moodName: mood.name,
    moodText: mood.text,
    personalityName: personality.name,
    personalityLine: personality.line,
    personalityResult: personality.result,
    avatar: personality.avatar
  };
}
