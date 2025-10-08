# Scripts

## create-issues.js

GitHub Issuesを自動作成するスクリプト。

### セットアップ

1. **GitHub Personal Access Tokenを作成**
   - https://github.com/settings/tokens にアクセス
   - "Generate new token" > "Tokens (classic)"
   - Scopes: `repo` を選択
   - トークンをコピー

2. **環境変数設定**
```bash
export GITHUB_TOKEN=ghp_your_token_here
export GITHUB_REPO=owner/repo  # 例: your-username/85projects
```

3. **実行**
```bash
node scripts/create-issues.js
```

### 実行内容

18個のIssueを作成します：
- **Phase 1** (7 issues): 基礎実装
- **Phase 2** (5 issues): コア機能
- **Phase 3** (3 issues): ハードウェア連携
- **Phase 4** (3 issues): 本番準備

各Issueには以下が含まれます：
- タスクチェックリスト
- 見積時間
- ファイル情報
- 依存関係
- 完了条件
- ラベル（Phase, プロジェクト名, 優先度）

### トラブルシューティング

**"404 Not Found"エラー**
- リポジトリが存在するか確認
- GITHUB_REPOの形式が正しいか確認（owner/repo）

**"401 Unauthorized"エラー**
- トークンが正しいか確認
- トークンに`repo`スコープがあるか確認

**Rate limit エラー**
- スクリプトは1秒間隔でIssueを作成します
- エラーが出た場合は数分待ってから再実行
