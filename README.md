# Twitch explorer

This small vanilla JS mobile-friendly application gets the query entered by the user in the search box and uses Twitch API to find corresponding streams.

It is possible to use "Next" and "Prev" buttons to navigate through the response list.

Applications use HTML5 History API to support navigation through browser history using browser's "Back" and "Forward" buttons.

Application is available at https://boguslavsky.github.io/twitch-explorer/.

## Install and build locally

This application uses [webpack](https://www.npmjs.com/package/webpack) module bundler to provide the same level of compatibility across modern browsers.

This means you need to have [Node](https://nodejs.org) and [npm](https://www.npmjs.com/get-npm) installed on your machine.

Next, you need to install npm dependencies:

```sh
npm install
```

Then register the new application at [Twitch Console](https://dev.twitch.tv/console/apps) to get access to Twitch API. Insert generated `Client ID` into `CLIENT_ID` constant at [src/app.js](src/app.js).

Finally, build an application:

```sh
npx webpack
```

Now it is ready to use. Use [index.html](index.html) as entry point.
