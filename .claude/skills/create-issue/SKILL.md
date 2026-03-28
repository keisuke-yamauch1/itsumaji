---
name: create-issue
description: GitHub issue を1件作成する
---

# create-issue スキル

このプロジェクトで GitHub issue を作成する手順。

## リポジトリ
`keisuke-yamauch1/itsumaji`

## 手順

1. ユーザーの指示からタイトル・概要・タスク・関連 Phase を推測して issue の内容を**まず提案する**
2. ユーザーに確認を取り、修正があれば反映する
3. 明らかに情報が不足している場合のみヒアリングする（基本は提案ファースト）
4. 確認が取れたら以下のコマンドで1件作成する:

```bash
gh issue create \
  --repo keisuke-yamauch1/itsumaji \
  --title "<タイトル>" \
  --body "$(cat <<'EOF'
## 概要
<何をするか>

## タスク
- [ ] <具体的な作業1>
- [ ] <具体的な作業2>

## 関連
<Phase 名など>
EOF
)"
```

## ルール
- **1タスク1issue** で作成する (複数タスクをまとめない)
- issue を作成したら URL を表示してユーザーに確認してもらう
- ラベルは現時点では不要
