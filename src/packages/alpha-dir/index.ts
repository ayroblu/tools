import { getArgs } from "./args";
import fs from "fs";
import path from "path";

(() => {
  const { files } = getArgs();
  const allFilepaths = getFilepaths(files);
  const allText = allFilepaths
    .map((path) => fs.readFileSync(path, "utf8"))
    .map((text) => text.replace(/[^a-zA-Z]+/g, " ").replace(/ +/g, " "));
  console.log(allText.join("\n"));
})();

function getFilepaths(filepaths: string[]): string[] {
  return filepaths.flatMap((filepath) =>
    tryFn(
      () => fs.lstatSync(filepath).isDirectory(),
      () => console.log("filepath", filepath),
    )
      ? getFilepaths(
          fs.readdirSync(filepath).map((p) => path.join(filepath, p)),
        )
      : filepath,
  );
}

function tryFn<T>(f: () => T, c: () => void): T {
  try {
    return f();
  } catch (err) {
    c();
    throw err;
  }
}