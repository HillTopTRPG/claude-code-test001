#!/usr/bin/env python3
"""
Claude AI App認証を使用してPRを作成するスクリプト
Claude Codeから直接呼び出し可能
"""

import jwt
import requests
import subprocess
import sys
import time
import json
from pathlib import Path

class GitHubAppAuth:
    def __init__(self, app_id, private_key_path):
        self.app_id = app_id
        self.private_key_path = private_key_path
        
    def get_jwt_token(self):
        """JWT作成"""
        with open(self.private_key_path, 'r') as f:
            private_key = f.read()
            
        payload = {
            'iat': int(time.time()) - 60,
            'exp': int(time.time()) + 600,
            'iss': self.app_id
        }
        
        return jwt.encode(payload, private_key, algorithm='RS256')
    
    def get_installation_id(self, jwt_token):
        """Installation ID取得"""
        headers = {
            'Authorization': f'Bearer {jwt_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        response = requests.get('https://api.github.com/app/installations', headers=headers)
        response.raise_for_status()
        
        installations = response.json()
        if not installations:
            raise Exception("No installations found")
            
        return installations[0]['id']
    
    def get_access_token(self, jwt_token, installation_id):
        """アクセストークン取得"""
        headers = {
            'Authorization': f'Bearer {jwt_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        response = requests.post(
            f'https://api.github.com/app/installations/{installation_id}/access_tokens',
            headers=headers
        )
        response.raise_for_status()
        
        return response.json()['token']

def create_pr(branch, title, body="🤖 Generated with [Claude Code](https://claude.ai/code)"):
    """GitHub App認証でPR作成"""
    
    # 設定（環境変数から取得）
    import os
    APP_ID = os.getenv("CLAUDE_APP_ID")
    PRIVATE_KEY_PATH = os.getenv("CLAUDE_APP_PRIVATE_KEY_PATH")
    
    if not APP_ID:
        print("❌ CLAUDE_APP_ID environment variable is required")
        print("   Set it with: export CLAUDE_APP_ID=your_app_id")
        return None
        
    if not PRIVATE_KEY_PATH:
        print("❌ CLAUDE_APP_PRIVATE_KEY_PATH environment variable is required")
        print("   Set it with: export CLAUDE_APP_PRIVATE_KEY_PATH=/path/to/private-key.pem")
        return None
    
    try:
        # GitHub App認証
        print("🔐 Authenticating with GitHub App...")
        auth = GitHubAppAuth(APP_ID, PRIVATE_KEY_PATH)
        
        jwt_token = auth.get_jwt_token()
        installation_id = auth.get_installation_id(jwt_token)
        access_token = auth.get_access_token(jwt_token, installation_id)
        
        # PR作成
        print(f"🚀 Creating PR: {title}")
        print(f"📝 Branch: {branch}")
        
        # gh CLI実行
        cmd = [
            'gh', 'pr', 'create',
            '--title', title,
            '--body', body,
            '--head', branch,
            '--base', 'main'
        ]
        
        env = {'GITHUB_TOKEN': access_token}
        result = subprocess.run(cmd, capture_output=True, text=True, env=env)
        
        if result.returncode == 0:
            print("✅ PR created successfully using Claude AI App authentication!")
            print(f"🔗 {result.stdout.strip()}")
            return result.stdout.strip()
        else:
            print(f"❌ Error creating PR: {result.stderr}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 create_pr.py <branch> <title> [body]")
        print("Example: python3 create_pr.py feature/new-feature 'feat: 新機能追加' 'この機能は...'")
        sys.exit(1)
    
    branch = sys.argv[1]
    title = sys.argv[2]
    body = sys.argv[3] if len(sys.argv) > 3 else "🤖 Generated with [Claude Code](https://claude.ai/code)"
    
    create_pr(branch, title, body)