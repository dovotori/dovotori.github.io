import type { MyContent } from "src/types";
import { Locales } from "../../constants/locales";
import getLocalCategories from "./getLocalCategories";
import getLocalPosts from "./getLocalPosts";
import getLocalSkills from "./getLocalSkills";
import getLocalTags from "./getLocalTags";

const initialState: MyContent = {
  categories: getLocalCategories(Locales.JP),
  entries: getLocalPosts(Locales.JP),
  tags: getLocalTags(Locales.JP),
  hello: {
    title: "Dorian Ratovo",
    text: "フロントエンド開発者",
    contact: "お問い合わせ",
    about: "私について",
    bulle: "詳しくへ",
    description: [
      "グラフィック設計を勉強しました。其の後ウェブ開発に趣味がありましたので自分で、養成しました。",
      "Javascriptは一番好きなツールに成りました。 経験をするためにJavascriptを使います。 例えばAPIcanvasで2D / 3D画像を作りました。",
      "沢山の可能性がありましたから此の知識を職場で、適用して、今勉強を続けます。",
    ],
  },
  cv: {
    formation: {
      text: "学歴",
      items: [
        {
          date: 2022,
          text: "リンゲージ日本語学校",
        },
        {
          date: 2013,
          text: "サンティティエンヌの芸術とデザインの大学院でのプラスチック表現の国立ディプロマ",
        },
        {
          date: 2013,
          text: "セイント・エティエンヌのデザインの国際隔年展示で、バラソンプロジェクト",
        },
        {
          date: 2012,
          text: "マルチメディア部門 / バーチャルリアリティBurg Giebichensteinの美術学校にHalle、ドイツ",
        },
        {
          date: 2011,
          text: " セイント・エティエンヌの芸術とデザインの優れた学校の造形芸術の国立ディプロマデザインセクション",
        },
        {
          date: 2009,
          text: "グラフィックデザインの卒業証書 / LISAAパリの応用芸術の高等研究所でのマルチメディア",
        },
        {
          date: 2006,
          text: "一般科学バカロレア",
        },
      ],
    },
    jobs: {
      text: "職歴",
      items: [
        {
          startDate: 2022,
          endDate: 2025,
          text: "Scene株式会社でフロントエンドの開発者",
          location: "東京、日本",
          tasks: [
            "組立説明書アプリケーションのために複数の3D機能を開発",
            "データの正確性を確保するために、ピクセル比較を使用したエンドツーエンドテストを実装",
          ],
        },
        {
          startDate: 2016,
          endDate: 2022,
          text: "Winamaxというスポーツ賭け事会社でフロントエンドの開発者",
          location: "パリ、フランス",
          tasks: [
            "ベッティングWebアプリケーションの開発",
            "ファンタジースポーツWebアプリケーションの開発",
            "新しいグリッドアプリケーションの開発",
          ],
        },
        {
          startDate: 2014,
          endDate: 2016,
          location: "パリ、フランス",
          text: "ウェブ代理店会社Pix 21の起業共同マネージャー、グラフィックデザインとウェブ開発の責任者",
          tasks: [
            "ウェブサイトの開発と展開",
            "創生 / ページ組み / コミュニケーション文書とテンプレートの印刷管理",
            "グラフィックチャートの創生",
            "プロジェクト管理とモニタリング",
          ],
        },
        {
          startDate: 2013,
          endDate: 2014,
          location: "パリ、フランス",
          text: "Reporters sans frontières協会のグラフィックデザイナー",
          tasks: [
            "オンライン で インタラクティブマップ の 作成",
            "創生 / レポートとコミュニケーション文書 の ページ組み",
          ],
        },
        {
          startDate: 2012,
          endDate: 2012,
          location: "グルノーブル、フランス",
          text: "グルノーブルに研究所のCEA Ideas Lab学期をしました",
          tasks: ["革新的な技術の研究とプロトタイピング", "エンジニアとチームワークをしました."],
        },
        {
          startDate: 2009,
          endDate: 2009,
          location: "パリ、フランス",
          text: "コンサルティングおよびグラフィックデザインエージェンシーのatelier des Gibouléesの会社でビジネスインターンシップをしました",
          tasks: [
            "創生 / ページ組み / コミュニケーション文書とテンプレートの印刷管理",
            "仕様開発への参加",
          ],
        },
      ],
    },
    skills: getLocalSkills(Locales.JP),
    hobbies: {
      text: "趣味",
      items: [
        {
          text: "ビデオゲームの作り方",
        },
        {
          text: "日本文化",
        },
      ],
    },
  },
  back: "戻る",
  darkMode: "暗い",
  lightMode: "明るい",
  next: "次へ",
  previous: "前",
};

export default initialState;
