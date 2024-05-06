import { ready } from 'lib/dom'
import initializeModules from 'lib/init-modules'

/* eslint-disable */
__webpack_public_path__ = document.location.hostname == 'localhost' ? 'https://localhost:3000/dev/' : SHOPIFY_CDN
/* eslint-enable */

ready(initializeModules)
