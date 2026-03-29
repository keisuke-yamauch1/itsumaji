---
name: commit
description: 変更内容を論理的な単位に分けて git コミットする
---

# commit スキル

このプロジェクトでコミットを行う手順。

## 手順

1. `git status` と `git diff` で変更内容を確認する
2. 変更を論理的な単位に分けてコミットを検討する
   - 設定ファイルの変更 (wrangler.jsonc, CLAUDE.md など)
   - DBスキーマ (migrations/)
   - アプリケーションコード (src/)
   - 自動生成ファイル (worker-configuration.d.ts)
3. 各コミットのメッセージは以下の形式にする:
   ```
   <種別>: <内容の要約>
   ```
   種別の例: `feat`, `fix`, `chore`, `docs`, `refactor`
4. `.wrangler/` は `.gitignore` に含まれているか確認する (ローカルDBは含めない)
5. コミット後は必ず `git push` を実行する

## コミットの例
- `chore: add CLAUDE.md and project config`
- `feat: add D1 schema for episodes`
- `chore: add CloudflareBindings type to Hono app`
