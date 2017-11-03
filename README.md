# Talkdesk Challenge - Call Billing

This project is a web-based system to provide service to:
+ Remove credits from a given account.
+ List the charges for the given account.

## Installation

+ A machine running **node.js** is mandatory. Once node.js is installed, go to the root of the project and run the command $ npm install. Then all dependencies will be installed.
+ The project uses mongodb to store all call_finished events, so is necessary to configure host and port for mongodb. For that, go the file ./config/settings and set the appropriate settings.  

## API Reference

+ [log4js](https://github.com/nomiddlename/log4js-node)
+ [mongodb](https://mongodb.github.io/node-mongodb-native/)
+ [hapi](https://hapijs.com/)
+ [moment](https://momentjs.com/)
+ [underscore](http://underscorejs.org/)

## Tests

All requests will be done through POST methods, I suggest to use the [postman](https://www.getpostman.com/)

To preform the tests, follow [these](./howto.md) steps. 

## Contributor

Giuliano Ferreira Caetano
