import { parseArgs } from "util";
import fs from "fs";

export function getArgs() {
  try {
    const { values, positionals } = parseArgs({
      options: {
        help: {
          type: "boolean",
          short: "h",
        },
      },
      strict: true,
      allowPositionals: true,
    });

    if (values.help) {
      help();
      process.exit();
    }
    if (positionals.length === 0) {
      console.log("Was expecting a file or a directory");
      process.exit();
    }
    const missingFiles = positionals.filter((p) => !fs.existsSync(p));
    if (missingFiles.length) {
      console.log("could not find:", ...missingFiles);
      process.exit();
    }
    return {
      files: positionals,
    };
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Unknown option")) {
      console.log(err.message);
      console.log();
    }
    help();
    process.exit();
  }
}
function help() {
  console.log(
    `
alpha-dir converts a directory into alpha characters

usage: alpha-dir [files]
    --help
        Shows this
    `.trim(),
  );
}