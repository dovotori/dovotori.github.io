import path from "node:path";
import { __dirname, readFile, removeFile, saveHtml } from "./utils";

const SAVE_FILE = path.resolve(__dirname, "../../public/json");

const generateContent = async (selection) => {
  const geoDataFile = await readFile(
    path.resolve(__dirname, "./countries.geo.medres.json"),
    "utf8",
  );
  const geojson = JSON.parse(geoDataFile);
  const filteredFeatures = geojson.features.filter(
    (feature) => selection.indexOf(feature.properties.iso_a3) !== -1,
  );
  return JSON.stringify({ ...geojson, features: filteredFeatures });
};

const main = async () => {
  const myArgs = process.argv.slice(2);
  const content = await generateContent(myArgs);
  const fullPath = `${SAVE_FILE}/${myArgs.join("_")}.json`;
  console.log("clean");
  await removeFile(fullPath);
  saveHtml(fullPath, content);
  console.log("done");
};

main();
