const _ = require('lodash');
const alexaConstants = require('./data/alexa-constants.json');
const speechMap = require('./data/speech-map.json');

exports.handler = {
  canHandle(handlerInput) {
    return _.get(handlerInput, 'requestEnvelope.request.type')
      === alexaConstants.REQUEST_TYPE.LAUNCH_REQUEST;
  },
  handle(handlerInput) {

    const outSpeech = speechMap.LAUNCH_RETURNING_USER_SPEECH;
    const displayTemplate = {
      "type": "BodyTemplate1",
      "token": "string",
      "backButton": "HIDDEN",
      "backgroundImage": {
        "contentDescription": "La Carnita",
        "sources": [
          {
            "url": "https://image.ibb.co/cG39uo/la_Carnita_2.jpg",
            "size": "LARGE",
            "widthPixels": 393,
            "heightPixels": 393
          },
        ]
      },
      "title": "connectedSIX",
      "textContent": {
        "primaryText": {
          "type": "PlainText",
          "text": ""
        },
        "secondaryText": {
          "type": "PlainText",
          "text": ""
        },
        "tertiaryText": {
          "type": "PlainText",
          "text": ""
        }
      }
    };

    return handlerInput.responseBuilder
      .speak(outSpeech)
      .addRenderTemplateDirective(displayTemplate)
      .getResponse();
  },
};
