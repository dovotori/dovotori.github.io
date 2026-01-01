import path from "node:path";
import { __dirname, readFile, removeFile, saveHtml } from "./utils.js";

const SAVE_FILE = path.resolve(__dirname, "../../public/json");

const generateContent = async (selection) => {
  const geoDataFile = await readFile(
    path.resolve(__dirname, "../common/world-50m.v1.json"),
    "utf8",
  );
  const geojson = JSON.parse(geoDataFile);
  const filteredGeometries = geojson.objects.countries.geometries.filter(
    (geometry) => selection.indexOf(geometry.id) !== -1,
  );
  return JSON.stringify({
    ...geojson,
    objects: {
      // ...geojson.objects, // no need to lands
      countries: {
        ...geojson.objects.countries,
        geometries: filteredGeometries,
      },
    },
  });
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
