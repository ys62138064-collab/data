# 繪畫歷程教學儀表板 | 原型 Demo

依 8 張設計稿（4 張教師視角＋4 張學生視角）還原的純靜態單頁應用（HTML + CSS + 原生 JS），無需任何建置工具，可直接部署到 GitHub Pages。

> 匿名模擬資料・非評分系統。資料僅用於教學對話，不作為能力標籤。

## 功能與互動

| 設計稿 | 還原內容 | 互動 |
|--------|---------|------|
| 教師視角 × 4 | 頂部視角切換、當前任務列、班級時段熱力圖、序列覆蓋規則（IF—THEN）、個人行為軌跡、階段紀錄與原始事件、教師註記 | 點學生切換全部資料；點熱力圖任一格切換學生＋課堂；點折線圖資料點切換課堂；點階段縮圖高亮；註記可儲存、可匯出 JSON |
| 學生視角 × 4 | 我的作業歷程（平均修改率 / 平均停頓比例 / 求助次數）、我的過程軌跡、我的自述、教師回應、我的階段紀錄、我想補充說明 | 視角切換；學生切換；補充說明可送出／刪除，並存於本機瀏覽器 |

其他：

- 熱力圖顏色依數值由薄荷綠漸層至深墨綠，選取列以青綠框標示，作用中格另加深色外框。
- 折線圖以原生 SVG 依資料即時繪製，含格線、座標刻度、懸停提示（Tooltip）。
- 「設計稿參考」燈箱可查看全部 8 張原始截圖；頂部 Demo 提示列可關閉，關閉後仍能由頁尾開啟燈箱。
- 教師註記、學生補充說明使用 `localStorage` 保存；「匯出 JSON」會下載含全部學生資料、註記與補充說明的 JSON 檔。
- 平均修改率與平均停頓比例由圖表資料即時計算，與畫面數值一致。
- 支援鍵盤操作（學生按鈕、熱力圖格子、Enter/Esc）、響應式版面（桌機 / 平板 / 手機）、`prefers-reduced-motion` 無痛降級。

## 本機預覽

```bash
cd drawing-process-dashboard
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

或直接雙擊 `index.html`（本機儲存功能在部分瀏覽器的 file:// 模式可能受限，建議用上面的本機伺服器）。

## 部署到 GitHub Pages

1. 在 GitHub 建立新倉庫，例如 `drawing-process-dashboard`。
2. 上傳本資料夾內全部檔案，**保持目錄結構**：

```
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/  teacher-a~d.jpg、student-a~d.jpg、favicon.svg
```

3. 進入 **Settings → Pages**，Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)`，Save。
4. 稍候 1–2 分鐘，造訪 `https://<使用者名稱>.github.io/drawing-process-dashboard/`。

指令版：

```bash
cd drawing-process-dashboard
git init
git add .
git commit -m "init: 繪畫歷程教學儀表板原型"
git branch -M main
git remote add origin https://github.com/<使用者名稱>/drawing-process-dashboard.git
git push -u origin main
```

## 技術說明

- 零框架、零相依套件；字型透過 Google Fonts 載入 Noto Sans TC，離線時回退系統中文字型。
- 所有圖片皆為相對路徑且檔名為 ASCII，避免 GitHub Pages 的中文路徑編碼問題。
- 設計稿原始圖僅作為「設計稿參考」燈箱素材，介面本身以 HTML/CSS/SVG 重繪，故在任何尺寸下皆清晰。
