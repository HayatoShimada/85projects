# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

衣類小売店（古着・新品混在）向け一気通貫在庫管理・販売システム。2名体制（エンジニア1名、販売スタッフ1名）での運用を前提とした、商品登録からPOS販売まで完結できるカスタムツール群。

### Core Tech Stack
- **ECサイト**: Shopify Online
- **Blog & Homepage**: Next.js on Vercel + Notion (Headless CMS)
  - Reference: https://github.com/HayatoShimada/85store
- **POS**: Shopify POS Lite
- **Hardware**: ラベルプリンタ、通常プリンタ

## System Architecture

### 3つの主要コンポーネント

#### 1. 商品登録/編集ツール (F101-F106)
Shopify API経由で商品データを登録・更新する簡易WebアプリケーションUI。

**重要な仕様**:
- 古着（一点物）と新品（複数在庫）を自動判別
- 一点物には重複しないユニークSKUを自動生成 (F102)
- 登録時、自動的に販売チャネル「Point of Saleで利用可能」を設定 (F104)
- 登録完了後、タグ生成システムへ自動遷移 (F106)

#### 2. 自動タグ生成・印刷システム (F201-F205)
QRコード/バーコード付き商品タグをラベルプリンタで出力。

**重要な仕様**:
- QRコードに2つの機能を統合 (F202):
  1. Shopify POSスキャン用の商品識別情報
  2. 顧客がスマホでスキャンしてオンライン詳細ページを閲覧できるURL
- 紐付きタグで衣類を傷つけない取り付けを想定

#### 3. 高速オンラインカート生成ツール (F301-F305)
**特殊要件**: 代表者の与信制約により外部決済端末が使えないため、カード決済時はShopify Paymentsへオンライン誘導する代替フロー。

**処理フロー**:
1. POS上のカート情報を取得 (F301)
2. Shopify Checkout URLを生成 (F302)
3. QRコードでレジ端末に表示 (F303)
4. 顧客が自分のスマホで決済完了
5. スタッフに通知表示 (F304)
6. POSでカスタム決済タイプ「オンラインカード決済(店頭注文)」を手動記録 (F305)

## Business Flow

### Stage 1: 入荷・商品準備
入荷 → 検品・採寸 → 撮影 → **F101で商品登録** → **F201でタグ印刷** → 陳列

### Stage 2: 店舗販売・決済
- 顧客がQRスキャンで詳細閲覧
- スタッフがPOSでスキャン
- **現金/ギフト**: POS標準決済
- **カード**: F301-F305の特殊フロー（オンライン注文代替）

### Stage 3: 在庫管理・分析
- POS/ECで売れると自動在庫減
- Shopify POS Liteで売上・在庫分析

## Development Guidelines

### Shopify API Integration
- 商品登録時は必ず `Point of Sale` チャネルを有効化すること
- SKU生成ロジックは衝突を避けるため、タイムスタンプやUUID組み込みを検討
- QRコード生成時は、POSスキャン用とユーザー閲覧用のURL両方を含める

### User Experience
- 販売スタッフ（非エンジニア）が操作するため、UIは極力シンプルに
- 商品登録→タグ印刷の導線を途切れさせない設計
- カード決済代替フローでは、QRコード表示から決済完了通知までリアルタイム性が重要

### Hardware Integration
- ラベルプリンタとの連携は印刷プレビュー機能 (F205) を必須実装
- タグサイズは紐付き取り付けを想定したテンプレート設計

## Critical Constraints

1. **外部決済端末が使えない**: カード決済は必ずShopify Paymentsへのオンライン誘導
2. **一点物と複数在庫の混在**: SKU生成・在庫管理ロジックで明確に分岐
3. **2名体制**: 自動化と操作性のバランスが成否を分ける
