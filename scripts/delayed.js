// add delayed functionality here
import { getMetadata, loadScript } from './aem.js';

/**
 * Finds and embeds custom JS and css
 */
function embedCustomLibraries() {
  const externalLibs = getMetadata('js-files');
  const libsArray = externalLibs?.split(',').map((url) => url.trim());

  libsArray.forEach((url) => {
    loadScript(`${url}`);
  });
}

if (!window.location.hostname.includes('localhost')) {
  embedCustomLibraries();
}
