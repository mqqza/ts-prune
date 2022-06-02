import { State } from "./state";
import { ResultSymbol } from "./analyzer";

const USED_IN_MODULE = ' (used in module)';

const formatOutput = (file: string, result: ResultSymbol) => {
  const {name, line, usedInModule} = result;
  return `${file}:${line} - ${name}` + (usedInModule ? USED_IN_MODULE : '');
}

export const present = (state: State): string[] => {
  const unused2D = state
    .definitelyUnused()
    .map(result => {
      const file = result.file.replace(process.cwd(), "").replace(new RegExp("^/"), "")
      const filePath = isWin
        ? file.replaceAll(path.win32.sep, path.posix.sep)
        : file

      return ({
        file: filePath,
        symbols: result.symbols
      })
    })
    .map(
      ({file, symbols}) => symbols.map(sym => formatOutput(file, sym))
    );

  return [].concat.apply([], unused2D);
};
