# 実装方針

## 1. 技術スタック

### 1.1 フロントエンド
#### Next.js
- 選定理由
  - SSGとSSRの柔軟な対応
  - 優れたパフォーマンス
  - 豊富なエコシステム
  - Vercel/Netlifyとの相性
  - TypeScript対応

#### UIフレームワーク
- Tailwind CSS
  - ユーティリティファースト
  - カスタマイズ性
  - パフォーマンス
  - 保守性

#### 状態管理
- Zustand
  - シンプルな実装
  - 軽量
  - TypeScript対応
  - デバッグ容易性

### 1.2 バックエンド
#### API
- Next.js API Routes
  - フロントエンドと統合
  - サーバーレス対応
  - TypeScript対応
  - エッジ関数対応

#### データベース
- Supabase
  - PostgreSQL互換
  - リアルタイム機能
  - Row Level Security
  - TypeScript対応

### 1.3 CMS
#### microCMS
- 選定理由
  - 日本語対応
  - REST API提供
  - 画像最適化
  - WebhookによるSSG更新

## 2. アプリケーション構成

### 2.1 ディレクトリ構造
```
src/
├── components/
│   ├── common/      # 共通コンポーネント
│   ├── editor/      # エディタ関連
│   ├── layout/      # レイアウトコンポーネント
│   └── templates/   # 業種別テンプレート
├── hooks/           # カスタムフック
├── lib/            # ユーティリティ
├── pages/          # ルーティング
├── styles/         # スタイル定義
└── types/          # 型定義
```

### 2.2 コンポーネント設計
#### アトミックデザイン採用
- atoms: 最小単位のUI要素
- molecules: 複数のatomsの組み合わせ
- organisms: 特定の機能を持つ領域
- templates: ページのレイアウト
- pages: 実際のページ

### 2.3 状態管理設計
```typescript
interface EditorState {
  template: Template;
  sections: Section[];
  styles: StyleConfig;
  content: PageContent;
  history: HistoryState;
}

interface Template {
  id: string;
  name: string;
  industry: Industry;
  sections: Section[];
}

interface Section {
  id: string;
  type: SectionType;
  content: any;
  style: StyleConfig;
}

interface StyleConfig {
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
}
```

## 3. 主要機能の実装方針

### 3.1 サイトエディタ
#### WYSIWYGエディタ
- Slate.js採用
  - カスタマイズ性
  - モダンな実装
  - TypeScript対応
  - リアルタイムプレビュー

#### ドラッグ&ドロップ
- react-beautiful-dnd
  - 直感的なUI
  - アクセシビリティ対応
  - パフォーマンス最適化

#### スタイルエディタ
- カラーピッカー
- フォントセレクター
- スペーシング調整
- レイアウト設定

### 3.2 テンプレートシステム
```typescript
interface TemplateSystem {
  baseTemplates: Record<Industry, Template>;
  sections: Record<SectionType, SectionTemplate>;
  styles: Record<Industry, StyleConfig>;
}

interface SectionTemplate {
  id: string;
  name: string;
  preview: string;
  defaultContent: any;
  schema: JSONSchema;
}
```

### 3.3 画像管理
- Cloudinary採用
  - 自動最適化
  - レスポンシブ対応
  - CDN配信
  - 豊富な編集機能

### 3.4 フォーム管理
```typescript
interface FormSystem {
  templates: FormTemplate[];
  validations: ValidationRule[];
  submissions: FormSubmission[];
  notifications: NotificationConfig[];
}
```

## 4. データモデル

### 4.1 ユーザーモデル
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_status TEXT,
  subscription_plan TEXT
);
```

### 4.2 サイトモデル
```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  domain TEXT UNIQUE,
  template_id TEXT,
  content JSONB,
  styles JSONB,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.3 フォームモデル
```sql
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id),
  name TEXT,
  fields JSONB,
  submissions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 5. API設計

### 5.1 エンドポイント構造
```typescript
// サイト管理
POST   /api/sites              // サイト作成
GET    /api/sites/:id         // サイト取得
PUT    /api/sites/:id         // サイト更新
DELETE /api/sites/:id         // サイト削除

// テンプレート
GET    /api/templates         // テンプレート一覧
GET    /api/templates/:id     // テンプレート取得

// フォーム
POST   /api/forms             // フォーム作成
POST   /api/forms/:id/submit  // フォーム送信
```

### 5.2 認証・認可
- Firebase Authentication
  - JWTトークン検証
  - RBAC実装
  - セッション管理

## 6. デプロイメント

### 6.1 ビルドプロセス
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
```

### 6.2 環境変数
```env
# 認証
NEXT_PUBLIC_FIREBASE_CONFIG={}
FIREBASE_ADMIN_CONFIG={}

# データベース
DATABASE_URL=
SUPABASE_KEY=

# CMS
MICROCMS_API_KEY=
MICROCMS_SERVICE_DOMAIN=

# 画像処理
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 7. パフォーマンス最適化

### 7.1 画像最適化
- next/image使用
- Cloudinary最適化
- WebP対応
- 遅延読み込み

### 7.2 コード最適化
- コード分割
- 遅延読み込み
- キャッシュ戦略
- バンドルサイズ最適化

### 7.3 SEO対策
- メタタグ最適化
- OGP対応
- サイトマップ生成
- 構造化データ 