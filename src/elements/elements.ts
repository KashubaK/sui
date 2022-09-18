import {createElementGenerator, createFragmentRenderer} from "./element";

export const elements = {
  a: createElementGenerator('a'),
  abbr: createElementGenerator('abbr'),
  address: createElementGenerator('address'),
  area: createElementGenerator('area'),
  article: createElementGenerator('article'),
  aside: createElementGenerator('aside'),
  audio: createElementGenerator('audio'),
  b: createElementGenerator('b'),
  base: createElementGenerator('base'),
  bdi: createElementGenerator('bdi'),
  bdo: createElementGenerator('bdo'),
  blockquote: createElementGenerator('blockquote'),
  body: createElementGenerator('body'),
  br: createElementGenerator('br'),
  button: createElementGenerator('button'),
  canvas: createElementGenerator('canvas'),
  caption: createElementGenerator('caption'),
  cite: createElementGenerator('cite'),
  code: createElementGenerator('code'),
  col: createElementGenerator('col'),
  colgroup: createElementGenerator('colgroup'),
  data: createElementGenerator('data'),
  datalist: createElementGenerator('datalist'),
  dd: createElementGenerator('dd'),
  del: createElementGenerator('del'),
  details: createElementGenerator('details'),
  dfn: createElementGenerator('dfn'),
  dialog: createElementGenerator('dialog'),
  div: createElementGenerator('div'),
  dl: createElementGenerator('dl'),
  dt: createElementGenerator('dt'),
  em: createElementGenerator('em'),
  embed: createElementGenerator('embed'),
  fieldset: createElementGenerator('fieldset'),
  figcaption: createElementGenerator('figcaption'),
  figure: createElementGenerator('figure'),
  footer: createElementGenerator('footer'),
  form: createElementGenerator('form'),
  h1: createElementGenerator('h1'),
  h2: createElementGenerator('h2'),
  h3: createElementGenerator('h3'),
  h4: createElementGenerator('h4'),
  h5: createElementGenerator('h5'),
  h6: createElementGenerator('h6'),
  head: createElementGenerator('head'),
  header: createElementGenerator('header'),
  hgroup: createElementGenerator('hgroup'),
  hr: createElementGenerator('hr'),
  html: createElementGenerator('html'),
  i: createElementGenerator('i'),
  iframe: createElementGenerator('iframe'),
  img: createElementGenerator('img'),
  input: createElementGenerator('input'),
  ins: createElementGenerator('ins'),
  kbd: createElementGenerator('kbd'),
  label: createElementGenerator('label'),
  legend: createElementGenerator('legend'),
  li: createElementGenerator('li'),
  link: createElementGenerator('link'),
  main: createElementGenerator('main'),
  map: createElementGenerator('map'),
  mark: createElementGenerator('mark'),
  menu: createElementGenerator('menu'),
  meta: createElementGenerator('meta'),
  meter: createElementGenerator('meter'),
  nav: createElementGenerator('nav'),
  noscript: createElementGenerator('noscript'),
  object: createElementGenerator('object'),
  ol: createElementGenerator('ol'),
  optgroup: createElementGenerator('optgroup'),
  option: createElementGenerator('option'),
  output: createElementGenerator('output'),
  p: createElementGenerator('p'),
  picture: createElementGenerator('picture'),
  pre: createElementGenerator('pre'),
  progress: createElementGenerator('progress'),
  q: createElementGenerator('q'),
  rp: createElementGenerator('rp'),
  rt: createElementGenerator('rt'),
  ruby: createElementGenerator('ruby'),
  s: createElementGenerator('s'),
  samp: createElementGenerator('samp'),
  script: createElementGenerator('script'),
  section: createElementGenerator('section'),
  select: createElementGenerator('select'),
  slot: createElementGenerator('slot'),
  small: createElementGenerator('small'),
  source: createElementGenerator('source'),
  span: createElementGenerator('span'),
  strong: createElementGenerator('strong'),
  style: createElementGenerator('style'),
  sub: createElementGenerator('sub'),
  summary: createElementGenerator('summary'),
  sup: createElementGenerator('sup'),
  table: createElementGenerator('table'),
  tbody: createElementGenerator('tbody'),
  td: createElementGenerator('td'),
  template: createElementGenerator('template'),
  textarea: createElementGenerator('textarea'),
  tfoot: createElementGenerator('tfoot'),
  th: createElementGenerator('th'),
  thead: createElementGenerator('thead'),
  time: createElementGenerator('time'),
  title: createElementGenerator('title'),
  tr: createElementGenerator('tr'),
  track: createElementGenerator('track'),
  u: createElementGenerator('u'),
  ul: createElementGenerator('ul'),
  var: createElementGenerator('var'),
  video: createElementGenerator('video'),
  wbr: createElementGenerator('wbr'),
  fragment: createFragmentRenderer(),
} as const;
