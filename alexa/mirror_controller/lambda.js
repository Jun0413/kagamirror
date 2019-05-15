/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const http = require('http');

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = '';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const launchMessage = "Hello, you can give commands to control display of modules on corners of the mirror";
const turnoffMessage = "OK, shutting down the module";
const turnonMessage = "Copy that, opening the module";
let options = {
    host: 'kagamirror.serveo.net',
    port: '80',
    path: '',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const api_turnoff = '/turnoffModule';
const api_turnon = '/turnonModule';

function sendRequest(path, slotCode) {
    options.path = path;
    let req = http.request(options, function(res) {
        res.on('error', e => {
            console.log('[Error] fail to post to external API: ', options.host);
        });
    });
    req.write(`{"slotCode": ${slotCode}}`, null, 2);
    req.end();
}

const handlers = {
    'LaunchRequest': function () {
        this.response.speak(launchMessage);
        this.emit(':responseReady');
    },
    'turnoffModulesIntent': function() {
        this.response.speak(turnoffMessage);
        sendRequest(api_turnoff, this.event.request.intent.slots.MODULE_NAME.
        resolutions.resolutionsPerAuthority[0].values[0].value.id);
        this.emit(':responseReady');
    },
    'turnonModulesIntent': function() {
        this.response.speak(turnonMessage);
        sendRequest(api_turnon, this.event.request.intent.slots.MODULE_NAME.
        resolutions.resolutionsPerAuthority[0].values[0].value.id);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};