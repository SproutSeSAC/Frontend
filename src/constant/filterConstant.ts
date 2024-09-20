// 기술스택
export const STACK_JAVASCRIPT = 'JavaScript';
export const STACK_TYPESCRIPT = 'TypeScript';
export const STACK_REACT = 'React';
export const STACK_VUE = 'Vue';
export const STACK_SVELTE = 'Svelte';
export const STACK_NEXTJS = 'NextJS';
export const STACK_ANGULAR = 'Angular';
export const STACK_JAVA = 'Java';
export const STACK_SPRING = 'Spring';
export const STACK_NODEJS = 'NodeJS';
export const STACK_GO = 'Go';
export const STACK_KOTLIN = 'Kotlin';
export const STACK_EXPRESS = 'Express';
export const STACK_PYTHON = 'Python';
export const STACK_DJANGO = 'Django';
export const STACK_PHP = 'Php';
export const STACK_GRAPHQL = 'GraphQL';
export const STACK_FIREBASE = 'Firebase';
export const STACK_FLUTTER = 'Flutter';
export const STACK_SWIFT = 'Swift';
export const STACK_REACT_NATIVE = 'ReactNative';
export const STACK_UNITY = 'Unity';
export const STACK_DART = 'Dart';
export const STACK_AWS = 'Aws';
export const STACK_KUBERNETES = 'Kubernetes';
export const STACK_DOCKER = 'Docker';
export const STACK_GIT = 'Git';
export const STACK_ZEPLIN = 'Zeplin';
export const STACK_JEST = 'Jest';
export const STACK_C = 'C';
export const STACK_C_PLUS = 'C++';
export const STACK_NOTION = 'Notion';
export const STACK_POWER_POINT = 'PowerPoint';
export const STACK_WORD = 'Word';
export const STACK_EXCEL = 'Excel';
export const STACK_SLACK = 'Slack';
export const STACK_SKETCH = 'Sketch';
export const STACK_ADOBE_XD = 'AdobeXD';
export const STACK_MIRO = 'Miro';
export const STACK_FIGMA = 'Figma';
export const STACK_GOOGLE_ANALYTICS = 'GoogleAnalytics';
export const STACK_TENSORFLOW = 'Tensorflow';
export const STACK_PYTORCH = 'Pytorch';
export const STACK_KERAS = 'Keras';
export const STACK_GOOGLE_BIG_QUERY = 'GoogleBigQuery';
export const STACK_KIBANA = 'Kibana';
export const STACK_TABLEAU = 'Tableau';
export const STACK_MYSQL = 'MySQL';
export const STACK_ELASTIC_SEARCH = 'ElasticSearch';
export const STACK_MONGO_DB = 'MongoDB';
export type Stack =
  | typeof STACK_JAVASCRIPT
  | typeof STACK_TYPESCRIPT
  | typeof STACK_REACT
  | typeof STACK_VUE
  | typeof STACK_SVELTE
  | typeof STACK_NEXTJS
  | typeof STACK_ANGULAR
  | typeof STACK_JAVA
  | typeof STACK_SPRING
  | typeof STACK_NODEJS
  | typeof STACK_GO
  | typeof STACK_KOTLIN
  | typeof STACK_EXPRESS
  | typeof STACK_PYTHON
  | typeof STACK_DJANGO
  | typeof STACK_PHP
  | typeof STACK_GRAPHQL
  | typeof STACK_FIREBASE
  | typeof STACK_FLUTTER
  | typeof STACK_SWIFT
  | typeof STACK_REACT_NATIVE
  | typeof STACK_UNITY
  | typeof STACK_DART
  | typeof STACK_AWS
  | typeof STACK_KUBERNETES
  | typeof STACK_DOCKER
  | typeof STACK_GIT
  | typeof STACK_ZEPLIN
  | typeof STACK_JEST
  | typeof STACK_C
  | typeof STACK_C_PLUS
  | typeof STACK_NOTION
  | typeof STACK_POWER_POINT
  | typeof STACK_WORD
  | typeof STACK_EXCEL
  | typeof STACK_SLACK
  | typeof STACK_SKETCH
  | typeof STACK_ADOBE_XD
  | typeof STACK_MIRO
  | typeof STACK_FIGMA
  | typeof STACK_GOOGLE_ANALYTICS
  | typeof STACK_TENSORFLOW
  | typeof STACK_PYTORCH
  | typeof STACK_KERAS
  | typeof STACK_GOOGLE_BIG_QUERY
  | typeof STACK_KIBANA
  | typeof STACK_TABLEAU
  | typeof STACK_MYSQL
  | typeof STACK_ELASTIC_SEARCH
  | typeof STACK_MONGO_DB;
export const stackList: Array<{ key: Stack; value: string; type?: string }> = [
  { key: STACK_JAVASCRIPT, value: 'JavaScript', type: 'frontend' },
  { key: STACK_REACT, value: 'TypeScript', type: 'frontend' },
  { key: STACK_TYPESCRIPT, value: 'React', type: 'frontend' },
  { key: STACK_VUE, value: 'Vue', type: 'frontend' },
  { key: STACK_SVELTE, value: 'Svelte', type: 'frontend' },
  { key: STACK_NEXTJS, value: 'NextJS', type: 'frontend' },
  { key: STACK_ANGULAR, value: 'Angular', type: 'frontend' },
  { key: STACK_JAVA, value: 'Java', type: 'backend' },
  { key: STACK_SPRING, value: 'Spring', type: 'backend' },
  { key: STACK_NODEJS, value: 'NodeJS', type: 'backend' },
  { key: STACK_GO, value: 'Go', type: 'backend' },
  { key: STACK_KOTLIN, value: 'Kotlin', type: 'backend' },
  { key: STACK_EXPRESS, value: 'Express', type: 'backend' },
  { key: STACK_PYTHON, value: 'Python', type: 'backend' },
  { key: STACK_DJANGO, value: 'Django', type: 'backend' },
  { key: STACK_PHP, value: 'Php', type: 'backend' },
  { key: STACK_GRAPHQL, value: 'GraphQL', type: 'backend' },
  { key: STACK_FIREBASE, value: 'Firebase', type: 'backend' },
  { key: STACK_FLUTTER, value: 'Flutter', type: 'mobile' },
  { key: STACK_SWIFT, value: 'Swift', type: 'mobile' },
  { key: STACK_REACT_NATIVE, value: 'ReactNative', type: 'mobile' },
  { key: STACK_UNITY, value: 'Unity', type: 'mobile' },
  { key: STACK_DART, value: 'Dart', type: 'mobile' },
  { key: STACK_AWS, value: 'Aws', type: 'computer' },
  { key: STACK_KUBERNETES, value: 'Kubernetes', type: 'computer' },
  { key: STACK_DOCKER, value: 'Docker', type: '' },
  { key: STACK_GIT, value: 'Git', type: 'computer' },
  { key: STACK_ZEPLIN, value: 'Zeplin', type: 'computer' },
  { key: STACK_JEST, value: 'Jest', type: 'computer' },
  { key: STACK_C, value: 'C', type: 'computer' },
  { key: STACK_C_PLUS, value: 'C++', type: 'computer' },
  { key: STACK_NOTION, value: 'Notion', type: 'pm' },
  { key: STACK_POWER_POINT, value: 'PowerPoint', type: 'pm' },
  { key: STACK_WORD, value: 'Word', type: 'pm' },
  { key: STACK_EXCEL, value: 'Excel', type: 'pm' },
  { key: STACK_SLACK, value: 'Slack', type: 'pm' },
  { key: STACK_SKETCH, value: 'Sketch', type: 'pm' },
  { key: STACK_ADOBE_XD, value: 'AdobeXD', type: 'pm' },
  { key: STACK_MIRO, value: 'Miro', type: 'pm' },
  { key: STACK_FIGMA, value: 'Figma', type: 'pm' },
  { key: STACK_GOOGLE_ANALYTICS, value: 'GoogleAnalytics', type: 'data' },
  { key: STACK_TENSORFLOW, value: 'Tensorflow', type: 'data' },
  { key: STACK_PYTORCH, value: 'Pytorch', type: 'data' },
  { key: STACK_KERAS, value: 'Keras', type: 'data' },
  { key: STACK_GOOGLE_BIG_QUERY, value: 'GoogleBigQuery', type: 'data' },
  { key: STACK_KIBANA, value: 'Kibana', type: 'data' },
  { key: STACK_TABLEAU, value: 'Tableau', type: 'data' },
  { key: STACK_MYSQL, value: 'MySQL', type: 'data' },
  { key: STACK_ELASTIC_SEARCH, value: 'ElasticSearch', type: 'data' },
  { key: STACK_MONGO_DB, value: 'MongoDB', type: 'data' },
];

// 포지션
// TODO : api spec 나오면 타입지정 필요.
export const POSITION_FRONTEND = 'FRONTEND';
export const POSITION_BACKEND = 'BACKEND';
export const POSITION_데이터분석가 = '데이터분석가';
export const POSITION_데이터엔지니어 = '데이터엔지니어';
export const POSITION_AI엔지니어 = 'AI엔지니어';
export const POSITION_안드로이드개발자 = '안드로이드개발자';
export const POSITION_IOS개발자 = 'iOS개발자';
export const POSITION_유니티개발자 = '유니티개발자';
export const POSITION_UIUX디자이너 = 'UI/UX디자이너';
export const POSITION_일러스트레이터 = '일러스트레이터';
export const POSITION_PMPO = 'PM/PO';
export const POSITION_서비스기획자 = '서비스기획자';
export const POSITION_게임기획자 = '게임기획자';
export const POSITION_콘텐츠마케터 = '콘텐츠마케터';
export const POSITION_브랜드마케터 = '브랜드마케터';
export const POSITION_디지털마케터 = '디지털마케터';
export type Position =
  | typeof POSITION_FRONTEND
  | typeof POSITION_BACKEND
  | typeof POSITION_데이터분석가
  | typeof POSITION_데이터엔지니어
  | typeof POSITION_AI엔지니어
  | typeof POSITION_안드로이드개발자
  | typeof POSITION_IOS개발자
  | typeof POSITION_유니티개발자
  | typeof POSITION_UIUX디자이너
  | typeof POSITION_일러스트레이터
  | typeof POSITION_PMPO
  | typeof POSITION_서비스기획자
  | typeof POSITION_게임기획자
  | typeof POSITION_콘텐츠마케터
  | typeof POSITION_브랜드마케터
  | typeof POSITION_디지털마케터;
export const positionList: Array<{ key: Position; value: string }> = [
  { key: POSITION_FRONTEND, value: '프론트엔드' },
  { key: POSITION_BACKEND, value: '백엔드' },
  { key: POSITION_데이터분석가, value: '데이터분석가' },
  { key: POSITION_데이터엔지니어, value: '데이터엔지니어' },
  { key: POSITION_AI엔지니어, value: 'AI엔지니어' },
  { key: POSITION_안드로이드개발자, value: '안드로이드개발자' },
  { key: POSITION_IOS개발자, value: 'iOS개발자' },
  { key: POSITION_유니티개발자, value: '유니티개발자' },
  { key: POSITION_UIUX디자이너, value: 'UI/UX디자이너' },
  { key: POSITION_일러스트레이터, value: '일러스트레이터' },
  { key: POSITION_PMPO, value: 'PM/PO' },
  { key: POSITION_서비스기획자, value: '서비스기획자' },
  { key: POSITION_게임기획자, value: '게임기획자' },
  { key: POSITION_콘텐츠마케터, value: '콘텐츠마케터' },
  { key: POSITION_브랜드마케터, value: '브랜드마케터' },
  { key: POSITION_디지털마케터, value: '디지털마케터' },
];

// 진행방식
// TODO : api spec 나오면 타입지정 필요.
export const PROGRESS_ONLINE = 'online';
export const PROGRESS_OFFLINE = 'offline';
export type Progress = typeof PROGRESS_ONLINE | typeof PROGRESS_OFFLINE;
export const progressList: Array<{ key: Progress; value: string }> = [
  { key: PROGRESS_ONLINE, value: '온라인' },
  { key: PROGRESS_OFFLINE, value: '오프라인' },
];

// display값 사용여부 고민필요
// export const stackDisplay: { [key in Stack]: string } = {
//   JavaScript: 'JavaScript',
//   TypeScript: 'TypeScript',
//   React: 'React',
//   Vue: 'Vue',
//   Svelte: 'Svelte',
//   NextJS: 'NextJS',
//   Angular: 'Angular',
//   Java: 'Java',
//   Spring: 'Spring',
//   NodeJS: 'NodeJS',
//   Go: 'Go',
//   Kotlin: 'Kotlin',
//   Express: 'Express',
//   Python: 'Python',
//   Django: 'Django',
//   Php: 'Php',
//   GraphQL: 'GraphQL',
//   Firebase: 'Firebase',
//   Flutter: 'Flutter',
//   Swift: 'Swift',
//   ReactNative: 'ReactNative',
//   Unity: 'Unity',
//   Dart: 'Dart',
//   Aws: 'Aws',
//   Kubernetes: 'Kubernetes',
//   Docker: 'Docker',
//   Git: 'Git',
//   Zeplin: 'Zeplin',
//   Jest: 'Jest',
//   C: 'C',
//   'C++': 'C++',
//   Notion: 'Notion',
//   PowerPoint: 'PowerPoint',
//   Word: 'Word',
//   Excel: 'Excel',
//   Slack: 'Slack',
//   Sketch: 'Sketch',
//   AdobeXD: 'AdobeXD',
//   Miro: 'Miro',
//   Figma: 'Figma',
//   GoogleAnalytics: 'GoogleAnalytics',
//   Tensorflow: 'Tensorflow',
//   Pytorch: 'Pytorch',
//   Keras: 'Keras',
//   GoogleBigQuery: 'GoogleBigQuery',
//   Kibana: 'Kibana',
//   Tableau: 'Tableau',
//   MySQL: 'MySQL',
//   ElasticSearch: 'ElasticSearch',
//   MongoDB: 'MongoDB',
// };
// export const positionDisplay: { [key in Position]: string } = {
//   FRONTEND: '프론트엔드',
//   BACKEND: '백엔드',
//   데이터분석가: '데이터분석가',
//   데이터엔지니어: '데이터엔지니어',
//   AI엔지니어: 'AI엔지니어',
//   안드로이드개발자: '안드로이드개발자',
//   iOS개발자: 'iOS개발자',
//   유니티개발자: '유니티개발자',
//   'UI/UX디자이너': 'UI/UX디자이너',
//   일러스트레이터: '일러스트레이터',
//   'PM/PO': 'PM/PO',
//   서비스기획자: '서비스기획자',
//   게임기획자: '게임기획자',
//   콘텐츠마케터: '콘텐츠마케터',
//   브랜드마케터: '브랜드마케터',
//   디지털마케터: '디지털마케터',
// };
// export const progressDisplay: { [key in Progress]: string } = {
//   online: '온라인',
//   offline: '오프라인',
// };
