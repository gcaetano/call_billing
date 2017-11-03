## Setup 
>Pre-requirements
+ node.js v4.4.3
+ mongodb v3.4

first, go to the project **root** directory and type:

 ```bash
 npm install
 ```

> MongoDB

The service uses mongodb to store accounts and calls.
To setup mongodb, go to the project **root** directory and type:
```bash
node setup-mongo.js
```

Then all dependencies will be installed.

>To run the service, just type:
```bash
node app.js
```
The service is ready to receive requests as soon as the feedback below is shown.

```bash
HTTP started: http://localhost:8008
```

>Notes: 
+ To change the port, go to the setting file (./config/setting) and find server.port key and set to an appropriate value.
+ Use postman to simulate the messages exchange.

## Create an account [POST]

`
http://localhost:8008/account/create 
`
```json
{ "account_name": "yellow_bird" ,"phone_number": "+351961918192" }
```

>Result :
```json
{ "success": true, "_id": "58cab029414fb0117cc07630" }
```

## Add credits [POST]
`
http://localhost:8008/account/credit 
`
```json
{ "account_name": "yellow_bird", "value": 4 }
```

>Result : 
```json
{ "success": true, "balance": 96 } 
```

>or
```json
{"success": false,  "balance": null}
```

## Charge a call [POST]
`
http://localhost:8008/calls/charge
`
```json
{"type": "in",   "account_name": "yellow_bird", "duration": "91","talkdesk_phone_number": "+14845348611","customer_phone_number": "+351961918192","forwarded_phone_number": "+351961234567"}
```

>Result:
```json
{"success": true}
```

## Get a call list [POST]
`
http://localhost:8008/calls/list
`
```json
{"account_name": "yellow_bird","from": "2017-03-16T00:12:46.712Z","to": "2017-03-16T23:39:59.215Z"}
```

>Result
```json
{"success": false, "data": [{},{}]}
```

## Automated Tests
`Mocha.js` is used to perform the automated tests and for assertion the `Should.js`.

To run it, go to the project **root** directory and type:
`
mocha tests
`

## Logging
The service uses log4js to write logs in files. A daily routing is used to organize them. The log files can be find into ./logs/ directory


