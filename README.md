#### Required Dependencies:
Node.js >= 10.0.0

#### Run Setup Script
This simply installs dependencies and creates a `dist/` directory with an `assets/` directory in it.
```
npm run setup
```

#### Get API Key and Password
Create a private app on the Shopify store you're working on to access your API key and password. See the [Shopify Theme README](https://github.com/Shopify/shopify_theme) above for more info.

#### Edit Config File
Open `config.yml` and replace the `api_key` `password` `store` and `theme_id` values with the data from the private app you created in #4. [Example here.](http://themekit.cat/docs/#config-example)

Make sure you have `ignore_files` option configured on all your environment sections in `config.yml` so that `settings_data.json` is never overwritten.

### Developing
After the steps above, you're ready to go. With this setup, you'll need to run command in terminal tabs.
```bash
npm start
```

This project uses Webpack to compile assets. When using ```npm start```, these assets (compiled JS and CSS) are not actually written to dist, they are compiled into memory and served to listening browser via the configuration in ```dev-server.js```. When developing, visit the website at ```https://localhost:3000```, ignoring any HTTPS warnings. If you need to preview a specific theme, add the ```preview_theme_id``` like so ```https://localhost:3000/?preview_theme_id=<theme_id>```

### Compiling
```bash
npm run build
```
This command will prepare Javascript and CSS assets for production (minification, etc) and write them to the disk. Run this command to actually create the assets and have them accessable without having to proxy the site through ```https://localhost:3000```.

### Deploying
```bash
npm run staging
```

This comment compile the assets and upload to the theme specified in the `staging` section of your `config.yml` file.

The following commands can also be used for `development` and `production` environments:

```bash
npm run development
npm run production # THIS WILL OVERWRITE EVERYTHING ON LIVE SO BE CAREFUL
```
