#!/bin/bash

# Claude AI App認証を使用してPRを作成するスクリプト
set -e

# 使用方法表示
usage() {
    echo "Usage: $0 <branch> <title> [body]"
    echo "Example: $0 feature/new-feature 'feat: 新機能追加' 'この機能は...'"
    echo ""
    echo "This script creates a PR using Claude AI App authentication"
    echo "The PR will be created by claude-ai-assistant-for-hilltop[bot]"
    exit 1
}

# 引数チェック
if [ $# -lt 2 ]; then
    usage
fi

BRANCH=$1
TITLE=$2
BODY=${3:-"🤖 Generated with [Claude Code](https://claude.ai/code)"}

# 依存関係チェック
command -v jq >/dev/null 2>&1 || { echo "❌ jq is required but not installed."; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "❌ curl is required but not installed."; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "❌ GitHub CLI (gh) is required but not installed."; exit 1; }

echo "🔐 Starting Claude AI App authentication..."

# GitHub App設定（環境変数から取得）
APP_ID="${CLAUDE_APP_ID:-}"
PRIVATE_KEY_FILE="${CLAUDE_APP_PRIVATE_KEY_PATH:-}"

# 環境変数チェック
if [ -z "$APP_ID" ]; then
    echo "❌ CLAUDE_APP_ID environment variable is required"
    echo "   Set it with: export CLAUDE_APP_ID=your_app_id"
    exit 1
fi

if [ -z "$PRIVATE_KEY_FILE" ]; then
    echo "❌ CLAUDE_APP_PRIVATE_KEY_PATH environment variable is required"
    echo "   Set it with: export CLAUDE_APP_PRIVATE_KEY_PATH=/path/to/private-key.pem"
    exit 1
fi

# Private Keyファイル存在確認
if [ ! -f "$PRIVATE_KEY_FILE" ]; then
    echo "❌ Private key file not found: $PRIVATE_KEY_FILE"
    exit 1
fi

# JWT作成（シンプルなBase64エンコード方式）
echo "🔑 Creating JWT token..."

# JWTヘッダー
JWT_HEADER='{"alg":"RS256","typ":"JWT"}'
JWT_HEADER_B64=$(echo -n "$JWT_HEADER" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')

# JWTペイロード
NOW=$(date +%s)
IAT=$((NOW - 60))
EXP=$((NOW + 600))
JWT_PAYLOAD='{"iat":'$IAT',"exp":'$EXP',"iss":"'$APP_ID'"}'
JWT_PAYLOAD_B64=$(echo -n "$JWT_PAYLOAD" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')

# 署名作成
JWT_UNSIGNED="$JWT_HEADER_B64.$JWT_PAYLOAD_B64"
JWT_SIGNATURE=$(echo -n "$JWT_UNSIGNED" | openssl dgst -sha256 -sign "$PRIVATE_KEY_FILE" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')
JWT_TOKEN="$JWT_UNSIGNED.$JWT_SIGNATURE"

echo "✅ JWT token created"

# Installation ID取得
echo "🔍 Getting installation ID..."
INSTALLATION_ID=$(curl -s \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app/installations" | \
    jq -r '.[0].id')

if [ "$INSTALLATION_ID" == "null" ] || [ -z "$INSTALLATION_ID" ]; then
    echo "❌ Failed to get installation ID"
    exit 1
fi

echo "✅ Installation ID: $INSTALLATION_ID"

# アクセストークン取得
echo "🔑 Getting access token..."
ACCESS_TOKEN=$(curl -s -X POST \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app/installations/$INSTALLATION_ID/access_tokens" | \
    jq -r '.token')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Failed to get access token"
    exit 1
fi

echo "✅ Access token obtained"

# PRの作成
echo ""
echo "🚀 Creating PR:"
echo "   Title: $TITLE"
echo "   Branch: $BRANCH → main"
echo "   Body: $BODY"
echo ""

PR_URL=$(GITHUB_TOKEN="$ACCESS_TOKEN" gh pr create \
    --title "$TITLE" \
    --body "$BODY" \
    --head "$BRANCH" \
    --base main)

if [ $? -eq 0 ]; then
    echo "✅ PR created successfully using Claude AI App authentication!"
    echo "🔗 $PR_URL"
    echo ""
    echo "👤 Created by: claude-ai-assistant-for-hilltop[bot]"
    echo "✋ You can now approve and merge this PR"
else
    echo "❌ Failed to create PR"
    exit 1
fi