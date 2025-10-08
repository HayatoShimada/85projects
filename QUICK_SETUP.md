# クイックセットアップガイド

GitHubリポジトリ作成とIssue作成を最速で行う手順。

---

## 🚀 Option 1: GitHub CLI使用（推奨・最速）

### Step 1: GitHub CLIインストール

```bash
# WSL/Linuxの場合
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y

# macOSの場合
brew install gh
```

### Step 2: GitHub認証

```bash
gh auth login
```

対話形式で以下を選択：
- `GitHub.com`
- `HTTPS`
- `Y` (認証情報をgit操作に使用)
- `Login with a web browser`

表示されるコードをコピーして、ブラウザで認証。

### Step 3: リポジトリ作成

```bash
cd /home/amdet/85projects

# リポジトリ作成（プライベート）
gh repo create 85projects --private --source=. --remote=origin --push

# または パブリック
# gh repo create 85projects --public --source=. --remote=origin --push
```

### Step 4: Issue一括作成

```bash
# 環境変数設定
export GITHUB_TOKEN=$(gh auth token)
export GITHUB_REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

# Issue作成実行
node scripts/create-issues.js
```

**完了！** 18個のIssueが作成されます。

---

## 📝 Option 2: Web UI使用（手動）

GitHub CLIをインストールできない場合は、`GITHUB_SETUP.md` を参照してください。

### 簡易手順

1. **リポジトリ作成**
   - https://github.com/new
   - Repository name: `85projects`
   - Private推奨
   - README, .gitignore, licenseは**チェックを外す**

2. **コードプッシュ**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/85projects.git
   git branch -M main
   git push -u origin main
   ```

3. **Personal Access Token作成**
   - https://github.com/settings/tokens
   - Scopes: `repo`

4. **Issue作成**
   ```bash
   export GITHUB_TOKEN=ghp_YOUR_TOKEN
   export GITHUB_REPO=YOUR_USERNAME/85projects
   node scripts/create-issues.js
   ```

---

## ✅ セットアップ確認

以下のコマンドで確認：

```bash
# リポジトリURL表示
gh repo view --web

# Issue一覧表示
gh issue list

# または
git remote -v
```

---

## 🎯 次のステップ

セットアップ完了後：

```bash
# 開発環境起動
make build
make up
make seed

# ブラウザで確認
# http://localhost:3000 (商品登録)
# http://localhost:3001 (タグ生成)
# http://localhost:3002 (オンラインカート)

# 最初のIssueに着手
git checkout -b feature/issue-1-product-form
cd product-registration-tool
npm install
npm run dev
```

詳細は `TODO.md` または各プロジェクトの `TODO.md` を参照。
