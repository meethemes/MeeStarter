# MeeStarter
MeeStarter is a simple starter template for faster creating HTML layouts.

## Installation
Clone this repository with `git clone https://github.com/meethemes/MeeStarter`. Go to project directory with terminal and run next commands there:
* **npm install**
* **bower install**

## Configuring
In **gulpfile.js** find ``options`` variable. There you can configure some gulp tasks.

## Running
### gulp dev
Run this command to start development. It will build all your sources, run watcher and server.

### gulp build
This task will compile all your sources with minification and optimization.

### gulp pack
* `gulp pack:all` will pack into zip all source and built files except *node_modules* and *bower_components*.
* `gulp pack:built` will pack into zip only *built* directory.

Both tasks first of all will run **gulp build**.

## Help
If you found issues or have some suggestions, you can create issue on [this page](https://github.com/meethemes/MeeStarter/issues).
