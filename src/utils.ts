import mkdirp from 'mkdirp';
import * as fs from 'fs';

export function makeImgFolder(dirname: string) {
  mkdirp.sync(dirname + '/img');
}

export function extractImgPaths(file: string) {
  const results: string[] = [];
  const regex = /\!\[.*\]\((.*)\)/g; // ![imgName](imgPath) 꼴에서 imgPath만 추출

  while (true) {
    const matched = regex.exec(file);
    if (matched) {
      results.push(matched[1]);
    } else break;
  }

  return results;
}

export async function moveFile(oldPath: string, newPath: string): Promise<NodeJS.ErrnoException | 'done'> {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) {
        reject(err);
      } else {
        resolve('done');
      }
    });
  });
}
