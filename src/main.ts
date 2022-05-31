import path from 'path';
import { readFileSync } from 'fs';
import { extractImgPaths, makeImgFolder, moveFile } from './utils';

if (process.argv.length !== 3) {
  console.error('[Usage] $ ts-node src/main.ts <파일명.md>');
  process.exit(0);
}

const filePath = path.resolve(process.argv[2]);

makeImgFolder(path.dirname(filePath));
const file = readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
const imgPaths = extractImgPaths(file);

Promise.all(
  imgPaths.map(oldPath => {
    const newPath = path.dirname(filePath) + '/img/' + path.basename(oldPath);
    return moveFile(oldPath, newPath);
  })
)
  .then(res => {
    console.log('done!');
  })
  .catch(err => {
    console.error(err);
  });
