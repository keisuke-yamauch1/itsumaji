# CLAUDE.md — itsumaji プロジェクト

## プロジェクト概要
ポッドキャスト「いつもの雑談、まじめな技術」の公式サイト。
スタック: Hono (TypeScript) + Rust (Wasm) + Cloudflare D1 + Cloudflare Workers

---

## よく使うコマンド

### ローカル開発
```bash
npm run dev          # wrangler dev (ローカルサーバー起動)
npm run deploy       # wrangler deploy --minify (本番デプロイ)
npm run cf-typegen   # wrangler types (Bindings の型生成)
```

### D1 操作
```bash
# DBの作成 (初回のみ)
npx wrangler d1 create itsumaji-db

# マイグレーションの実行 (ローカル)
npx wrangler d1 execute itsumaji-db --local --file=./migrations/0001_init.sql

# マイグレーションの実行 (本番)
npx wrangler d1 execute itsumaji-db --file=./migrations/0001_init.sql

# SQLクエリの直接実行 (デバッグ用)
npx wrangler d1 execute itsumaji-db --local --command="SELECT * FROM episodes LIMIT 5;"

# テーブル一覧確認
npx wrangler d1 execute itsumaji-db --local --command=".tables"
```

### Rust (Wasm) ビルド
```bash
# wasm-pack のインストール (初回のみ)
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Wasm ビルド (Cloudflare Workers 向け)
cd rust-wasm && wasm-pack build --target bundler

# ビルド成果物は rust-wasm/pkg/ に生成される
```

---

## ディレクトリ構成
```
itsumaji/
├── src/
│   └── index.ts          # Hono エントリポイント
├── rust-wasm/            # Rust クレート
│   ├── src/lib.rs
│   ├── Cargo.toml
│   └── Cargo.lock
├── migrations/           # D1 マイグレーション SQL
│   └── 0001_init.sql
├── wrangler.jsonc
├── package.json
└── CLAUDE.md
```

---

## コードスタイルガイドライン

### TypeScript
- Hono の `c.env` 経由で Bindings にアクセスする (`Env` 型を明示)
- D1 へのアクセスは `c.env.DB.prepare(...).bind(...).all()` パターンを使う
- `any` 型は禁止。Wasm から返る値も型アサーションではなく型ガードを使う

### Rust
- `wasm_bindgen` を使って JS/TS との境界を定義する
- エラーは `Result<T, JsValue>` で返す (panicを避ける)
- パースロジックはピュアな Rust 関数に閉じ込め、テスト可能にする

### SQL
- マイグレーションファイルは連番 (`0001_`, `0002_`) で管理する
- スキーマ変更は既存ファイルを編集せず、新しいマイグレーションファイルを追加する

---

## Cloudflare Workers の制約 (重要)
- **CPU時間**: 1リクエストあたり 10ms (有料プランで50ms)
- **メモリ**: 128MB
- **Wasm モジュールサイズ**: 最大 1MB (圧縮後)
- Node.js API は使えない。`nodejs_compat` フラグで一部利用可能
- Wasm のインスタンス化はコールドスタート時のみ (グローバルで保持)
