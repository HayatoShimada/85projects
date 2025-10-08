# GitHub セットアップガイド

## 📦 準備完了

✅ Gitリポジトリ初期化完了
✅ 初回コミット完了（62ファイル）
✅ Issue作成スクリプト準備完了

---

## 🚀 GitHubリポジトリ作成とプッシュ

### ステップ1: GitHubでリポジトリを作成

1. https://github.com/new にアクセス
2. 以下の設定でリポジトリを作成：
   - **Repository name**: `85projects`（または任意の名前）
   - **Description**: `衣類小売店向け統合管理システム - Shopify連携`
   - **Visibility**: Private（推奨）
   - ⚠️ **重要**: "Add a README file", ".gitignore", "license" は**全てチェックを外す**
     （既にローカルで作成済みのため）

3. 「Create repository」をクリック

### ステップ2: ローカルリポジトリをプッシュ

リポジトリ作成後、GitHubに表示されるコマンドを実行（以下は例）：

```bash
cd /home/amdet/85projects

# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/85projects.git

# ブランチ名をmainに変更（推奨）
git branch -M main

# プッシュ
git push -u origin main
```

**または SSH を使用する場合：**

```bash
git remote add origin git@github.com:YOUR_USERNAME/85projects.git
git branch -M main
git push -u origin main
```

---

## 📝 GitHub Issuesを自動作成

### ステップ1: Personal Access Token を作成

1. https://github.com/settings/tokens にアクセス
2. 「Generate new token」→「Tokens (classic)」を選択
3. 設定：
   - **Note**: `85projects Issue Creator`
   - **Expiration**: 90 days（または任意）
   - **Scopes**: ✅ `repo` にチェック（フルアクセス）
4. 「Generate token」をクリック
5. ⚠️ トークンをコピーして保存（**二度と表示されません**）

### ステップ2: 環境変数を設定

```bash
# トークンを設定（YOUR_TOKENは先ほどコピーしたトークン）
export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE

# リポジトリを設定（YOUR_USERNAMEはあなたのGitHubユーザー名）
export GITHUB_REPO=YOUR_USERNAME/85projects
```

### ステップ3: Issue作成スクリプトを実行

```bash
cd /home/amdet/85projects
node scripts/create-issues.js
```

**出力例：**
```
🚀 Creating 18 issues in your-username/85projects...

✅ Issue #1 created: [Phase 1] 商品登録フォームUI実装 (F101) (#1)
✅ Issue #2 created: [Phase 1] Shopify Admin API連携 - 商品作成 (F104-F105) (#2)
✅ Issue #3 created: [Phase 1] 画像アップロード機能実装 (F103) (#3)
...
✅ Issue #18 created: [Phase 4] パフォーマンス最適化 (#18)

✅ Successfully created 18 issues!

View issues at: https://github.com/your-username/85projects/issues
```

---

## 📋 作成されるIssue一覧

### Phase 1: 基礎実装（7 issues）
1. ✅ 商品登録フォームUI実装 (F101) - 8h
2. ✅ Shopify Admin API連携 - 商品作成 (F104-F105) - 6h
3. ✅ 画像アップロード機能実装 (F103) - 5h
4. ✅ タグ生成システムへの遷移ボタン (F106) - 2h
5. ✅ タグ生成ページUI実装 (F201) - 6h
6. ✅ QRコード表示UI実装 (F202-F203) - 4h
7. ✅ 印刷プレビューUI実装 (F205) - 5h

### Phase 2: コア機能（5 issues）
8. ✅ オンラインカート生成UI実装 (F301-F303) - 8h
9. ✅ Shopify Storefront API連携 - Checkout作成 (F302) - 6h
10. ✅ WebSocket通知システム実装 (F304) - 8h
11. ✅ POS記録ガイドUI実装 (F305) - 3h
12. ✅ E2Eテスト実行・修正 - 10h

### Phase 3: ハードウェア連携（3 issues）
13. ✅ ラベルプリンタ連携実装 (F204) - 12h
14. ✅ POSカート情報取得実装 (F301) - 10h
15. ✅ Shopify POS仕様調整 (QRフォーマット) - 4h

### Phase 4: 本番準備（3 issues）
16. ✅ エラーハンドリング・バリデーション強化 - 8h
17. ✅ 本番Shopify環境接続テスト - 6h
18. ✅ パフォーマンス最適化 - 8h

**合計**: 119時間（約15日 / 3-4週間推奨）

---

## 🏷️ Issueラベル

各Issueには以下のラベルが自動で付与されます：

- **Phase**: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`
- **プロジェクト**: `product-registration-tool`, `tag-generation-system`, `online-cart-tool`
- **タイプ**: `UI`, `API`, `WebSocket`, `hardware`, `testing`, `quality`, `deployment`, `performance`
- **優先度**: `priority: high`, `priority: medium`, `priority: low`

---

## 🔧 トラブルシューティング

### "404 Not Found" エラー

```
Error: Failed to create issue: 404
```

**原因**: リポジトリが存在しない、またはリポジトリ名が間違っている

**解決策**:
```bash
# リポジトリが存在するか確認
# https://github.com/YOUR_USERNAME/85projects

# GITHUB_REPOを正しく設定
export GITHUB_REPO=YOUR_USERNAME/85projects
```

### "401 Unauthorized" エラー

```
Error: Failed to create issue: 401
```

**原因**: トークンが無効、または権限が不足

**解決策**:
```bash
# トークンが正しいか確認
echo $GITHUB_TOKEN

# トークンに `repo` スコープがあるか確認
# https://github.com/settings/tokens
```

### Rate Limit エラー

```
Error: API rate limit exceeded
```

**原因**: GitHubのRate Limitに達した

**解決策**:
- スクリプトは1秒間隔でIssueを作成します
- 数分待ってから再実行してください
- 途中で止まった場合、すでに作成されたIssueは削除する必要はありません

---

## 📊 Issue作成後の作業

### 1. プロジェクトボード作成（推奨）

Issues作成後、GitHubプロジェクトボードで管理すると便利です：

1. リポジトリの「Projects」タブ
2. 「New project」→「Board」を選択
3. カラム作成：
   - 📋 Todo
   - 🚧 In Progress
   - ✅ Done

4. Issueをドラッグ&ドロップで整理

### 2. マイルストーン設定（オプション）

各Phaseごとにマイルストーンを作成：

1. リポジトリの「Issues」→「Milestones」
2. 「New milestone」をクリック
3. マイルストーン作成：
   - **Phase 1: 基礎実装** - Due date: 2週間後
   - **Phase 2: コア機能** - Due date: 4週間後
   - **Phase 3: ハードウェア連携** - Due date: 5週間後
   - **Phase 4: 本番準備** - Due date: 6週間後

4. 各IssueにマイルストーンをアサインN

### 3. 開発開始

```bash
# 開発環境起動
make build
make up
make seed

# Issueを選んで開発開始
# 例: Issue #1 (商品登録フォームUI)
git checkout -b feature/issue-1-product-form
cd product-registration-tool
npm install
npm run dev
```

---

## ✅ セットアップ完了チェックリスト

- [ ] GitHubリポジトリ作成完了
- [ ] コードをGitHubにプッシュ完了
- [ ] Personal Access Token作成完了
- [ ] 環境変数設定完了 (GITHUB_TOKEN, GITHUB_REPO)
- [ ] Issue作成スクリプト実行完了
- [ ] 18個のIssueが作成されたことを確認
- [ ] （オプション）プロジェクトボード作成
- [ ] （オプション）マイルストーン設定

完了したら、開発を開始できます！

リポジトリURL: `https://github.com/YOUR_USERNAME/85projects`
Issues URL: `https://github.com/YOUR_USERNAME/85projects/issues`
