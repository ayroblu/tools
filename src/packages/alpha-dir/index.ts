import { getArgs } from "./args";
import fs from "fs";

(() => {
  const { files } = getArgs();
  const allFilepaths = getFilepaths(files);
  const allText = allFilepaths
    .map((path) => fs.readFileSync(path, "utf8"))
    .map((text) => text.replace(/[^a-zA-Z]+/g, " ").replace(/ +/g, " "));
  console.log(allText.join("\n"));
})();

function getFilepaths(paths: string[]): string[] {
  return paths.flatMap((path) =>
    fs.lstatSync(path).isDirectory() ? getFilepaths([path]) : path,
  );
}