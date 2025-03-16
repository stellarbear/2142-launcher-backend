import fs from 'fs';
import path from 'path';
import { md5 } from './md5';

//  rewrite this as generator function

export async function* getFilesAsync(directory: string): AsyncGenerator<string> {
    const items = await fs.promises.readdir(directory);

    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stat = await fs.promises.stat(itemPath);

        if (stat.isDirectory()) {
            // Recursively yield files from subdirectories
            yield* getFilesAsync(itemPath);
        } else if (stat.isFile()) {
            yield itemPath;
        }
    }
}

export async function* getFilesMapAsync(directory: string) {
    for await (const file of getFilesAsync(directory)) {
        yield {
            file: path.relative(directory, file),
            md5: md5(file)
        }
    }
}