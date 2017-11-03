# Talkdesk Challenge - Call Billing

This project is a web-based system to provide a service to:
+ Remove credits from a given account.
+ List the charges for the given account.

## Installation

+ A machine running **node.js** is mandatory. Once node.js is installed, go to the root of the project and run the command $ npm install. Then all dependencies will be installed.
+ The project uses mongodb to store all call_finished events, so is necessary to configure host and port for mongodb. For that, go the file ./config/settings and set the appropriate settings.  

## API Reference

+ [log4js](https://github.com/nomiddlename/log4js-node)
+ [mongodb](https://mongodb.github.io/node-mongodb-native/)
+ [hapi](https://hapijs.com/)

## Tests

All requests will be done through POST and GET methods, I suggest to use the [postman](https://www.getpostman.com/)

+ http://localhost:8000/calls/charge/
+ http://localhost:8000/calls/bill/

Note: the parameters were not defined yet.

## Logging
The service uses log4js to write logs in files. A daily routing wii used to organize them. The logs can be find into ./logs/ directory

## Contributor

Giuliano Ferreira Caetano

