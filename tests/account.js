var chai = require('chai'),
    should = chai.should(),
    request = require('request'),
    moment = require('moment'),
    Moniker = require('moniker'),
    Helper = require('../lib/util/helper').Helper,
    server = require('../lib/server').Server,
    DAL_Account = require('../lib/dal/mongo/account').DAL_Account;

before(function () {
    server.start();
});

before(function () {
    server.stop();
});


describe('Create the user account', function() {
    var ph = "+351" + Helper.getRandom(9);
    var an = Moniker.choose();

    it("POST /account/create must create an user account and return {success: true} to passed in", function (done) {
        var account = {account_name: an, phone_number: ph};
        var options = {
            url: "http://localhost:8008/account/create",
            body: JSON.stringify(account)
        };
        request.post(options, function (error, response, body) {
            should.not.exist(error);
            var res = JSON.parse(body);
            should.exist(res);

            res.should.be.an('object');
            res.should.have.property('success');
            res.success.should.equal(true);
            done();
        });
    });

});

describe('Add credits to an account', function() {
    it("POST /account/credit must add credits to an account and return {success: true, balance: value} to passed in", function (done) {
        DAL_Account.getOne(function (err, account) {
            var data = {account_name: account.account_name, value: Helper.getRandom(2)};
            var options = {
                url: "http://localhost:8008/account/credit ",
                body: JSON.stringify(data)
            };
            request.post(options, function (error, response, body) {
                should.not.exist(error);
                var res = JSON.parse(body);
                should.exist(res);

                res.should.be.an('object');
                res.should.have.property('success');
                res.success.should.equal(true);

                done();
            });
        });
    });
});

describe('Charge a call', function() {
    it("POST /call/charge must add remove credits from an account and return {success: true, balance: value} to passed in", function (done) {
        DAL_Account.getOne(function (err, account) {
            var call = {
                type: "in",
                account_name: account.account_name,
                duration: "91",
                talkdesk_phone_number: "+14845348611",
                customer_phone_number: "+351961918192",
                forwarded_phone_number: "+351961234567"
            };

            var options = {
                url: "http://localhost:8008/calls/charge",
                body: JSON.stringify(call)
            };
            request.post(options, function (error, response, body) {
                should.not.exist(error);
                var res = JSON.parse(body);
                should.exist(res);

                res.should.be.an('object');
                res.should.have.property('success');
                res.success.should.equal(true);

                done();
            });
        });
    });
});

describe('List a call', function() {
    it("GET /call/list must return an array with a call list from an account to passed in", function (done) {
        DAL_Account.getOne(function (err, account) {
            var from = moment().add(-1, 'days');
            var to = moment();
            var filter = {account_name: account.account_name, from: from.toISOString(), to: to.toISOString()};
            var options = {
                url: "http://localhost:8008/calls/list?filter=" + JSON.stringify(filter)
            };

            request.get(options, function (error, response, body) {
                should.not.exist(error);
                var res = JSON.parse(body);
                should.exist(res);
                res.should.be.an('object');
                res.success.should.equal(true);
                should.exist(res.data);
                res.data.should.an('array');
                done();
            });
        });
    });
});



