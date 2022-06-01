import path from 'path';
import { readFileSync } from 'fs';
import { extractImgPaths, makeImgFolder, moveFile } from './utils';
import { unlink, writeFile } from 'fs/promises';

async function main() {
  if (process.argv.length !== 3) {
    console.error('[Usage] $ ts-node src/main.ts <파일명.md>');
    process.exit(0);
  }

  const filePath = path.resolve(process.argv[2]);

  makeImgFolder(path.dirname(filePath));
  let file = readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  const imgPaths = extractImgPaths(file);

  const oldPathToNewPath = new Map();
  await Promise.all(
    imgPaths.map(oldPath => {
      const newPath = path.dirname(filePath) + '/img/' + path.basename(oldPath);
      oldPathToNewPath.set(oldPath, newPath);
      return moveFile(oldPath, newPath);
    })
  );
  console.log('all images moved');

  oldPathToNewPath.forEach((value, key) => {
    const oldPath = key;
    const newPath = value;

    file = file.replace(oldPath, newPath);
  });

  await unlink(filePath);
  await writeFile(filePath, file);

  console.log('all file paths modified');
}

main();
