import fs from 'fs';
import crypto from 'crypto';

export const md5 = (filePath: string) => {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    
    return hashSum.digest('hex');
}