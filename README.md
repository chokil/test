# React Components

Reactコンポーネントライブラリ

## コンポーネント

### Button
カスタマイズ可能なボタンコンポーネント

**Props:**
- `label`: ボタンのテキスト
- `onClick`: クリック時のハンドラー
- `variant`: ボタンのバリアント (`primary` | `secondary` | `danger`)
- `size`: ボタンのサイズ (`small` | `medium` | `large`)
- `disabled`: 無効化フラグ

**使用例:**
```tsx
import { Button } from './components';

<Button
  label="クリック"
  variant="primary"
  size="medium"
  onClick={() => console.log('clicked')}
/>
```

### Card
情報をまとめて表示するカードコンポーネント

**Props:**
- `title`: カードのタイトル
- `description`: カードの説明文
- `imageUrl`: カード内に表示する画像URL
- `footer`: カードのフッターコンテンツ
- `onClick`: カード全体のクリックハンドラー
- `elevation`: カードの影の強さ (`low` | `medium` | `high`)

**使用例:**
```tsx
import { Card } from './components';

<Card
  title="タイトル"
  description="これはカードの説明文です"
  imageUrl="https://example.com/image.jpg"
  elevation="medium"
  onClick={() => console.log('card clicked')}
/>
```

## インストール

```bash
npm install
```

## 使用方法

```tsx
import { Button, Card } from './src/components';
```
