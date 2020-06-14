import { CAT_DESIGN, CAT_CODE, CAT_BLOG } from "../../constants/categories";
import { Locales } from "../../constants/locales";
import getLocalPosts from "./getLocalPosts";
import chart from "./chart";

const initialState = {
  categories: {
    [CAT_DESIGN]: "設計",
    [CAT_CODE]: "コード",
    [CAT_BLOG]: "ブログ",
  },
  entries: getLocalPosts(Locales.JP),
  hello: {
    title: "Dorian Ratovo",
    text: "グラフィックデザイナーでした 其れ から,ウェブプログラマーを成る事にした",
    contact: "お問い合わせ",
    about: "はじめまして!",
    description: [
      "グラフィック設計 を 勉強しました。其の後 ウェブ開発 に 趣味 が ありました ので 自分 で 養成 しました。",
      "javascript は 一番 好きなツール に 成りました。 経験 を する ために Javascript を 使います。 例えば api canvas で 2D / 3D 画像 を 作りました。",
      "沢山 の 可能性 が　ありました から 此の 知識 を 職場 で 適用して, 今 勉強を続けます。"
    ],
  },
  cv: {
    formation: {
      text: "学習",
      items: [
        {
          date: 2013,
          text:
            "サンティティエンヌの芸術とデザインの大学院でのプラスチック表現の国立ディプロマ",
        },
        {
          date: 2013,
          text:
            "サンテティエンヌのデザインの国際隔年で、バラソンプロジェクトで展示 バラソンプロジェクト",
        },
        {
          date: 2012,
          text:
            "マルチメディア部門 / バーチャルリアリティ Burg Giebichenstein の 美術学校 に Halle, ドイツ",
        },
        {
          date: 2011,
          text:
            "サンテティエンヌ の 芸術とデザイン の 優れた学校 の 造形芸術 の 国立ディプロマ デザインセクション",
        },
        {
          date: 2009,
          text:
            "グラフィックデザイン の 卒業証書/ LISAA Paris の 応用芸術の高等研究所でのマルチメディア",
        },
        {
          date: 2006,
          text: "一般科学バカロレア",
        },
      ],
    },
    jobs: {
      text: "実務経験",
      items: [
        {
          startDate: 0,
          endDate: 0,
          text: "Winamax の フロントエンド の 開発者",
          tasks: [""],
        },
        {
          startDate: 2014,
          endDate: 2016,
          text:
            "Pix 21 の ウェブデザイン の 会社 の 共同マネージャー, グラフィックデザイン と ウェブ開発 の 責任者",
          tasks: [
            "ウェブサイト の 開発 と 展開",
            "創生 / ページ組み / コミュニケーション文書 と テンプレート の 印刷管理 ",
            "グラフィックチャート の 創生",
            "プロジェクト管理 と モニタリング"
          ],
        },
        {
          startDate: 2013,
          endDate: 2014,
          text: "Reporters sans frontières協会 の グラフィックデザイナー",
          tasks: [
            "オンライン で インタラクティブマップ の 作成",
            "創生 / レポート と コミュニケーション文書 の ページ組み"
          ],
        },
        {
          startDate: 2012,
          endDate: 2012,
          text:
            "グルノーブル に 研究所 の Ideas Lab au CEA 学期をしました",
          tasks: [
            "革新的な技術 の 研究 と プロトタイピング",
            "エンジニアとチームワークをしました."
          ],
        },
        {
          startDate: 2009,
          endDate: 2009,
          text:
            "コンサルティングおよびグラフィックデザインエージェンシー の atelier des Giboulées の 会社 で ビジネスインターンシップ を しました",
          tasks: [
            "創生  / ページ組み / コミュニケーション文書とテンプレートの印刷管理",
            "仕様開発への参加"
          ],
        },
      ],
    },
    skills: {
      text: "手並み",
      items: [
        {
          text: "dev",
          items: [
            { text: "Javascript / Nodejs", level: "" },
            { text: "React / Redux", level: "" },
            { text: "HTML5 / CSS3", level: "" },
            { text: "d3.js", level: "" },
            { text: "WebGL", level: "" },
            { text: "Php", level: "" },
          ],
        },
        {
          text: "イメージ & 編集",
          items: [
            { text: "Photoshop", level: "" },
            { text: "Illustrator", level: "" },
            { text: "InDesign", level: "" },
            { text: "Blender", level: "" },
            { text: "Inkscape", level: "" },
            { text: "Gimp", level: "" },
          ],
        },
        {
          text: "語",
          items: [
            { text: "フランス語", level: "読んで話しました" },
            { text: "英語", level: "読んで話しました" },
            { text: "日本語", level: "勉強しています" },
          ],
        },
      ],
    },
    hobbies: {
      text: "趣味",
      items: [
        {
          text: "ビデオゲームの作成",
        },
        {
          text: "日本の文化",
        },
      ],
    },
    chart
  },
  back: "バック",
  darkMode: "暗い",
  lightMode: "明るい",
  next: "次",
  previous: "前"
};

export default initialState;
