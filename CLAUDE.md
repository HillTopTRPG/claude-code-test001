# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

TRPGをWeb上で遊ぶための情報共有Webアプリケーションです。
AWS Amplify、React、Ant Design、TypeScriptを使用して構築します。

### 主要機能
- **キャラクターシート可視化**: 外部キャラクターシート管理サイトのデータを取得・表示
- **セッション管理**: TRPG セッションの情報共有
- **リアルタイム通信**: プレイヤー間のリアルタイムコミュニケーション

### 技術スタック
- **フロントエンド**: React 18 + TypeScript
- **UIライブラリ**: Ant Design
- **バックエンド**: AWS Amplify (GraphQL API, Authentication, Storage)
- **デプロイメント**: AWS Amplify Hosting
- **状態管理**: Redux Toolkit + React Redux

## セットアップ手順

1. Amplify CLIのインストールと設定
2. Reactプロジェクトの作成
3. Ant Designと必要な依存関係のインストール
4. Amplifyプロジェクトの初期化

## 開発ガイドライン

### コード整理
- コードベース全体で一貫した命名規則に従う
- モジュール構成で関心の分離を明確に保つ
- 目的を反映したわかりやすいファイル名とディレクトリ名を使用

### 変更を加える前に
- 実装前に必ず既存のコードベース構造を探索する
- 一貫性を保つため既存のパターンと規則を確認する
- 新しいコードを作成する前に類似の機能が既に存在するかチェック

## 主要コマンド

### 開発・ビルド
```bash
npm start                    # 開発サーバー起動
npm run build               # プロダクションビルド
npm test                    # テスト実行
npm run lint                # ESLint実行
npm run type-check          # TypeScript型チェック
```

### Amplify操作
```bash
amplify status              # Amplifyリソース状況確認
amplify push                # バックエンドリソースのデプロイ
amplify pull                # バックエンド設定のプル
amplify publish             # フルスタックデプロイ（ビルド+デプロイ）
amplify mock                # ローカルでのAPI/関数のモック実行
```

## アーキテクチャ

### ディレクトリ構造
```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── common/         # 共通コンポーネント
│   └── systems/        # システム別専用コンポーネント
│       └── nechronica/ # ネクロニカ専用コンポーネント
├── pages/              # ページコンポーネント
│   ├── auth/          # 認証関連ページ
│   ├── systems/       # システム選択・専用ページ
│   └── landing/       # ランディングページ
├── hooks/              # カスタムReactフック
├── services/           # API呼び出しとビジネスロジック
│   ├── external/      # 外部API（キャラシ管理サイト等）
│   └── amplify/       # Amplify関連サービス
├── store/              # Redux Toolkit設定（store, slices）
├── types/              # TypeScript型定義
│   └── systems/       # システム別型定義
├── utils/              # ユーティリティ関数
│   └── parsers/       # データパーサー（JSONP等）
└── assets/             # 静的ファイル（画像、スタイルなど）

amplify/                # Amplify設定ファイル
├── backend/            # バックエンド設定
└── team-provider-info.json
```

### 主要な設計パターン
- **コンポーネント設計**: Ant Designコンポーネントをベースとしたカスタムコンポーネント
- **状態管理**: Redux Toolkit + React Reduxを使用
  - スライスベースの状態管理
  - RTK Queryを使用したデータフェッチング（必要に応じて）
- **API通信**: AWS Amplify GraphQL APIを使用
- **認証**: AWS Cognito（Amplify Auth）
- **型安全性**: 厳密なTypeScript設定でランタイムエラーを防止

### Amplify統合ポイント
- **API**: GraphQL APIを通じたデータ操作
- **Auth**: ユーザー認証・認可
- **Storage**: ファイルアップロード・管理
- **Analytics**: ユーザー行動分析（オプション）

## TRPG機能詳細

### キャラクターシート可視化機能
外部キャラクターシート管理サイト（https://charasheet.vampire-blood.net/）との連携を行います。

#### 基本仕様
- URLを入力すると、JSONPでキャラクターデータを取得
- 取得したJSONデータを解析してUI上で可視化
- レスポンシブデザインで様々なデバイスに対応

#### 対応TRPGシステム
**第1段階**: 永い後日談のネクロニカ
- ドール情報（名前、年齢、身長体重等）
- 能力値（筋力、器用、感覚、知識、運動、情報）
- 部位・パーツ情報
- スキル・マニューバ
- 記憶の欠片・宝物

**将来的な拡張予定**: 他のTRPGシステムへの対応

### 外部API連携
- **JSONP対応**: CORS制約回避のためJSONP形式でデータ取得
- **エラーハンドリング**: 接続エラー、データ形式エラーの適切な処理
- **キャッシュ機能**: 同一URLの重複リクエストを防止

## アプリケーション構成

### ページ構成とユーザーフロー
1. **ランディングページ**: アプリケーションの紹介・概要
2. **認証ページ**: ログイン・サインアップ機能
3. **TRPGシステム選択**: 対応しているTRPGシステムの一覧表示
4. **システム別ツール**: 各TRPGシステムに特化したUI・機能

### 設計思想
- **システム特化型アーキテクチャ**: 各TRPGシステムごとに専用のUI/UXを提供
- **モジュラー設計**: システム別機能を独立したモジュールとして実装
- **拡張性重視**: 新しいTRPGシステム対応を容易に追加可能な構造

### ルーティング設計
```
/                           # ランディングページ
/auth/login                # ログインページ
/auth/signup               # サインアップページ
/systems                   # TRPGシステム選択ページ
/systems/nechronica        # 永い後日談のネクロニカ専用ツール
/systems/nechronica/sheet  # キャラクターシート表示
/systems/[future-systems]  # 将来追加予定のシステム
```