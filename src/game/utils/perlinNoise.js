const fixedSeed = [
  151,
  160,
  137,
  91,
  90,
  15,
  131,
  13,
  201,
  95,
  96,
  53,
  194,
  233,
  7,
  225,
  140,
  36,
  103,
  30,
  69,
  142,
  8,
  99,
  37,
  240,
  21,
  10,
  23,
  190,
  6,
  148,
  247,
  120,
  234,
  75,
  0,
  26,
  197,
  62,
  94,
  252,
  219,
  203,
  117,
  35,
  11,
  32,
  57,
  177,
  33,
  88,
  237,
  149,
  56,
  87,
  174,
  20,
  125,
  136,
  171,
  168,
  68,
  175,
  74,
  165,
  71,
  134,
  139,
  48,
  27,
  166,
  77,
  146,
  158,
  231,
  83,
  111,
  229,
  122,
  60,
  211,
  133,
  230,
  220,
  105,
  92,
  41,
  55,
  46,
  245,
  40,
  244,
  102,
  143,
  54,
  65,
  25,
  63,
  161,
  1,
  216,
  80,
  73,
  209,
  76,
  132,
  187,
  208,
  89,
  18,
  169,
  200,
  196,
  135,
  130,
  116,
  188,
  159,
  86,
  164,
  100,
  109,
  198,
  173,
  186,
  3,
  64,
  52,
  217,
  226,
  250,
  124,
  123,
  5,
  202,
  38,
  147,
  118,
  126,
  255,
  82,
  85,
  212,
  207,
  206,
  59,
  227,
  47,
  16,
  58,
  17,
  182,
  189,
  28,
  42,
  223,
  183,
  170,
  213,
  119,
  248,
  152,
  2,
  44,
  154,
  163,
  70,
  221,
  153,
  101,
  155,
  167,
  43,
  172,
  9,
  129,
  22,
  39,
  253,
  19,
  98,
  108,
  110,
  79,
  113,
  224,
  232,
  178,
  185,
  112,
  104,
  218,
  246,
  97,
  228,
  251,
  34,
  242,
  193,
  238,
  210,
  144,
  12,
  191,
  179,
  162,
  241,
  81,
  51,
  145,
  235,
  249,
  14,
  239,
  107,
  49,
  192,
  214,
  31,
  181,
  199,
  106,
  157,
  184,
  84,
  204,
  176,
  115,
  121,
  50,
  45,
  127,
  4,
  150,
  254,
  138,
  236,
  205,
  93,
  222,
  114,
  67,
  29,
  24,
  72,
  243,
  141,
  128,
  195,
  78,
  66,
  215,
  61,
  156,
  180,
];

class PerlinNoise {
  constructor(size = 16, isFixed = true) {
    this.size = size;
    this.seed = isFixed
      ? PerlinNoise.getFixedSeedNoise(this.size)
      : PerlinNoise.getGenerateNoise(this.size);
  }

  get(x, y) {
    let valeur = 0.0;
    let taille = this.size;

    while (taille >= 1) {
      valeur += this.smoothNoise(x / taille, y / taille, this.seed) * taille;
      taille /= 2.0;
    }

    return (0.5 * valeur) / this.size;
  }

  smoothNoise(x, y, noise) {
    // on recupere la partie decimal
    const fractX = x - Math.floor(x);
    const fractY = y - Math.floor(y);

    // coor superieur
    const x1 = (Math.floor(x) + this.size) % this.size;
    const y1 = (Math.floor(y) + this.size) % this.size;

    // coor inferieure
    const x2 = (x1 + this.size - 1) % this.size;
    const y2 = (y1 + this.size - 1) % this.size;

    // smooth avec interpolation bilineaire
    let valeur = 0.0;
    valeur += fractX * fractY * noise[x1][y1];
    valeur += fractX * (1 - fractY) * noise[x1][y2];
    valeur += (1 - fractX) * fractY * noise[x2][y1];
    valeur += (1 - fractX) * (1 - fractY) * noise[x2][y2];
    return valeur;
  }

  static getGenerateNoise(size) {
    const noise = new Array(size);
    for (let x = 0; x < size; x += 1) {
      noise[x] = new Array(size);
      for (let y = 0; y < size; y += 1) {
        noise[x][y] = Math.random();
      }
    }
    return noise;
  }

  static getFixedSeedNoise(size) {
    const noise = new Array(size);
    let cpt = 0;
    for (let x = 0; x < size; x += 1) {
      noise[x] = new Array(size);
      for (let y = 0; y < size; y += 1) {
        noise[x][y] = fixedSeed[cpt] / 256;
        cpt += 1;
      }
    }
    return noise;
  }
}

export default PerlinNoise;
