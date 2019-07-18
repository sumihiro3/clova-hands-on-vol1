# ハンズオン準備

## ハンズオン資料

### 今回の資料

http://bit.ly/ldgk-clova-hands-on-vol1

## ハンズオン準備

### ディレクトリ作成＆ソースコード クローン

クローン先のディレクトリは任意です

### Mac/Linux

```bash
$ mkdir ~/ldgk-clova-hands-on && cd ~/ldgk-clova-hands-on
git clone https://github.com/sumihiro3/clova-hands-on-vol1.git
$ cd clova-hands-on-vol1
```

### Windows

```bat
> mkdir c:¥tmp¥ldgk-clova-hands-on
> cd ldgk-clova-hands-on
> git clone https://github.com/sumihiro3/clova-hands-on-vol1.git
> cd clova-hands-on-vol1
```

## プログラムに必要なモジュールをインストール

```bash
$ npm install
```

# ご当地グルメファインダーの開発

## ngrok インストール＆起動

```bash
$ npm install -g ngrok

$ ngrok http 3000
```

## 新規チャネル作成

### LIFFアプリを追加する

#### 新規チャネル名

```text
ご当地グルメファインダー
```

### スキルの基本情報

* Extension ID
    * com.フルネーム.LocalGourmetFinder
* スキル名
    * ご当地グルメファインダー
* スキル名（音声読み上げ）
    * ご当地グルメファインダー
* 呼び出し名（メイン）
    * ご当地グルメファインダー
* 呼び出し名（サブ）
    * ゴトウチグルメファインダー
    * ごとうちぐるめふぁいんだー
    * 御当地グルメファインダー

### Extension サーバーのURL

```text
https://{ngrok のサブドメイン}.ngrok.io/clova
```

## 対話モデルの作成

### インテント1

* インテント名
    * FindGourmetByPrefectureIntent
* スロット名
    * Prefecture
* スロットタイプ
    * CLOVA.JP_ADDRESS_KEN
* サンプル発話
    * 北海道のご当地グルメは
    * 大阪のご当地グルメを教えて

### カスタム スロットタイプ

* スロットタイプ名
    * LOCAL_GOURMET_TYPE

### インテント2

* インテント名
    * FindGourmetByNameIntent
* スロット名
    * Gourmet
* スロットタイプ
    * LOCAL_GOURMET_TYPE
* サンプル発話
    * ザンギのことを教えて
    * 串カツはどんな料理



## 環境変数を設定

「.env.sample」ファイルを「.env」にリネームしてから記述する

```text
# チャネルのExtension ID
EXTENSION_ID="com.XXXXXXXXXX.LocalGourmetFinder"
```

## プログラムの起動

```bash
$ node index.js
```

# 関連リンク

## ハンズオン関係

* [サンプルプログラム](https://github.com/sumihiro3/clova-hands-on-vol1)
* [資料置き場](http://bit.ly/ldgk-clova-hands-on-vol1)

## LINE 関係

### LINE 開発者向けサイト (LINE Developers)

* [LINE Developers Top page](https://developers.line.biz/ja/)
* [Clova Developer Center](https://clova-developers.line.biz/)
* [Clova Extension Kit (CEK) Document](https://clova-developers.line.biz/guide/)
* [Sound Library](https://clova-developers.line.biz/guide/Resources/Sound_Library.md)

### LINE 公式アカウント

* [LINE 公式アカウントマネージャー](https://manager.line.biz/)


## LINE Developer Group Kansai

* [Facebook page](https://www.facebook.com/groups/LINEDeveloperGroupKansai/)
* [Connpass page](https://ldgk.connpass.com/)
