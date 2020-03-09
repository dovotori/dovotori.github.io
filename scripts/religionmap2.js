const path = require('path');
const utils = require('./utils');

const HTML_FILE = path.resolve(__dirname, '../public/html/religionmap.html');

const generateHtml = async () => {
  const map = await utils.readFile(path.resolve(__dirname, '../public/svg/religionmap.svg'));
  return `<style>
  #worldmap {
    display: block;
    margin: 0 auto;
    transition: transform 2s ease-out;
  }

  #worldmap path {
    stroke-width: 0.4;
    stroke: #000;
    transition: fill 10s ease-out;
  }

  .noPenalty {
    fill: #dfdfdf;
  }

  .diffamation {
    fill: #568cac;
  }

  .blaspheme {
    fill: #5656bf;
  }

  .apostasie {
    fill: #8080a0;
  }

  .blasphemeDiffamation {
    fill: #804ab4;
  }

  .apostasieDiffamation {
    fill: #ac568c;
  }

  .blasphemeApostasie {
    fill: #bf5656;
  }

  .allPenalties {
    fill: #533a67;
  }

  .peindeDeMort {
    fill: transparent;
  }

  .deadPicto {
    stroke: #000;
    stroke-width: 2;
    fill: #fff;
  }

  #infos {
    position: absolute;
    left: 50%;
    bottom: 50%;
    width: 50%;
    background: rgba(255,255,255,0.8);
    padding: 1em;
    text-align: left;
    transition: transform 500ms ease-out;
    transform: none;
    transform-origin: center center;
    overflow: hidden;
  }

  #infos[data-hide] {
    transform: scale(0);
  }

  #infos h3 {
    letter-spacing: 0.02em;
    font-size: 1em;
    color: #000;
  }

  #infos svg {
    width: 50%;
    height: auto;
    float: left;
  }

  #infos svg circle {
    fill: transparent;
    stroke-width: 3;
    transition: stroke-dashoffset 1s ease-out, stroke-dasharray 1s ease-out;
  }

  #legend {
    width: 50%;
    float: left;
  }

  #legend .legendBloc {
    display: inline-block;
    width: 10px;
    height: 10px;
  }

  #legend .legendText {
    font-size: 0.8em;
    margin-left: 0.5em;
    font-family: sans-serif;
    color: #000;
  }

  .infosSource {
    font-size: 0.7em;
    font-family: sans-serif;
    fill: #fff;
    cursor: pointer;
  }

  circle.chrstcatpct { stroke: #7199F0; }
  .chrstcatpct .legendBloc { background-color: #7199F0; } circle.chrstprotpct { stroke: #AAD1E3; }
  .chrstprotpct .legendBloc { background-color: #AAD1E3; } circle.chrstorthpct { stroke: #A7A7D8; }
  .chrstorthpct .legendBloc { background-color: #A7A7D8; } circle.chrstangpct { stroke: #AB89F1; }
  .chrstangpct .legendBloc { background-color: #AB89F1; } circle.chrstothrpct { stroke: #5D65C2; }
  .chrstothrpct .legendBloc { background-color: #5D65C2; } circle.islmsunpct { stroke: #82C7A1; }
  .islmsunpct .legendBloc { background-color: #82C7A1; } circle.islmshipct { stroke: #9DE47A; }
  .islmshipct .legendBloc { background-color: #9DE47A; } circle.judgenpct { stroke: #F08686; }
  .judgenpct .legendBloc { background-color: #F08686; } circle.anmgenpct { stroke: #EECC5C; }
  .anmgenpct .legendBloc { background-color: #EECC5C; } circle.budgenpct { stroke: #DFB561; }
  .budgenpct .legendBloc { background-color: #DFB561; } circle.taogenpct { stroke: #D69773; }
  .taogenpct .legendBloc { background-color: #D69773; } circle.hindgenpct { stroke: #EC7F4E; }
  .hindgenpct .legendBloc { background-color: #EC7F4E; } circle.confgenpct { stroke: #C37FA6; }
  .confgenpct .legendBloc { background-color: #C37FA6; } circle.syncgenpct { stroke: #C35D5C; }
  .syncgenpct .legendBloc { background-color: #C35D5C; } circle.nonreligpct { stroke: #999; }
  .nonreligpct .legendBloc { background-color: #999; }

</style>
<div style="position: relative;text-align: center;">
  ${map}
  <div id="infos">
    <h3></h3>
    <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" class="chrstcatpct"></circle><circle cx="10" cy="10" r="7" class="chrstprotpct"></circle><circle cx="10" cy="10" r="7" class="chrstorthpct"></circle><circle cx="10" cy="10" r="7" class="chrstangpct"></circle><circle cx="10" cy="10" r="7" class="chrstothrpct"></circle><circle cx="10" cy="10" r="7" class="islmsunpct"></circle><circle cx="10" cy="10" r="7" class="islmshipct"></circle><circle cx="10" cy="10" r="7" class="judgenpct"></circle><circle cx="10" cy="10" r="7" class="anmgenpct"></circle><circle cx="10" cy="10" r="7" class="budgenpct"></circle><circle cx="10" cy="10" r="7" class="taogenpct"></circle><circle cx="10" cy="10" r="7" class="hindgenpct"></circle><circle cx="10" cy="10" r="7" class="confgenpct"></circle><circle cx="10" cy="10" r="7" class="syncgenpct"></circle><circle cx="10" cy="10" r="7" class="nonreligpct"></circle></svg>
    <div id="legend"><p class="chrstcatpct"><span class="legendBloc"></span><span class="legendText">Catholique</span>
      </p><p class="chrstprotpct"><span class="legendBloc"></span><span class="legendText">Protestant</span>
      </p><p class="chrstorthpct"><span class="legendBloc"></span><span class="legendText">Orthodoxe</span>
      </p><p class="chrstangpct"><span class="legendBloc"></span><span class="legendText">Anglican</span>
      </p><p class="chrstothrpct"><span class="legendBloc"></span><span class="legendText">Autres Chrétiens</span>
      </p><p class="islmsunpct"><span class="legendBloc"></span><span class="legendText">Sunnite</span>
      </p><p class="islmshipct"><span class="legendBloc"></span><span class="legendText">Shiite</span>
      </p><p class="judgenpct"><span class="legendBloc"></span><span class="legendText">Juif</span>
      </p><p class="anmgenpct"><span class="legendBloc"></span><span class="legendText">Animiste</span>
      </p><p class="budgenpct"><span class="legendBloc"></span><span class="legendText">Bouddhiste</span>
      </p><p class="taogenpct"><span class="legendBloc"></span><span class="legendText">Taoiste</span>
      </p><p class="hindgenpct"><span class="legendBloc"></span><span class="legendText">Hindou</span>
      </p><p class="confgenpct"><span class="legendBloc"></span><span class="legendText">Confusianiste</span>
      </p><p class="syncgenpct"><span class="legendBloc"></span><span class="legendText">Syncrétisme</span>
      </p><p class="nonreligpct"><span class="legendBloc"></span><span class="legendText">Non religieux</span>
      </p></div>
    <p></p>
  </div>
</div>`;
};

const main = async () => {
  console.log('clean');
  await utils.removeFile(HTML_FILE);

  console.log('process');
  const html = await generateHtml();
  utils.saveHtml(HTML_FILE, html);

  console.log('done');
};

main();
