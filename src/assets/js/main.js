import { ready } from 'lib/dom'
import { pipe } from 'lib/utils'
import initializeModules from 'lib/init-modules'
import { initVue as initializeVue, initVuex, initVueSingleFile } from 'lib/vue'

/* eslint-disable */
__webpack_public_path__ = document.location.hostname == 'localhost' ? 'https://localhost:3000/dev/' : SHOPIFY_CDN
/* eslint-enable */

ready(pipe(initVuex, initializeVue, initVueSingleFile, initializeModules))
