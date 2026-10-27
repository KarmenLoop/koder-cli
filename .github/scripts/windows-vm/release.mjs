import path from 'node:path';
import {pathToFileURL} from 'node:url';
if (!process.env.KODER_ACCEPTANCE_PACKAGE) throw Error('KODER_ACCEPTANCE_PACKAGE is required');
export const loadRelease = relative => import(pathToFileURL(path.join(process.env.KODER_ACCEPTANCE_PACKAGE, relative)).href);
