const _ = require('lodash');
const alexaHelpers = require('./libs/alexa-helpers.js');
const alexaConstants = require('./data/alexa-constants.json');
const speechMap = require('./data/speech-map.json');


exports.handler = {
  canHandle(handlerInput) {
    const requestType = _.get(handlerInput, 'requestEnvelope.request.type');
    const intentName = _.get(handlerInput, 'requestEnvelope.request.intent.name');

    return requestType === alexaConstants.REQUEST_TYPE.INTENT_REQUEST
      && intentName === alexaConstants.INTENT_NAME.LOCATION_INTENT;
  },
  handle(handlerInput) {
    const intentRequest = _.get(handlerInput, 'requestEnvelope.request.intent');
    const dialogState = _.get(handlerInput, 'requestEnvelope.request.dialogState');

    if (dialogState && dialogState !== alexaConstants.DIALOG_STATE.COMPLETED) {
      return handlerInput.responseBuilder
        .addDelegateDirective(intentRequest)
        .getResponse();
    }
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes[alexaConstants.ATTRIBUTE_NAME.PREVIOUS_INTENT] = _.get(handlerInput, 'requestEnvelope.request.intent.name');
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    const location = alexaHelpers.getSlotValue(intentRequest, 'location');
    let outSpeech;
    let displayTemplate;

    if (location.name === 'sevenLives') {
      outSpeech = _.get(speechMap, 'LOCATION_SEVEN_LIVES_RESPONSE');
      displayTemplate = {
        "backgroundImage": {
          "contentDescription": "Seven Lives",
          "sources": [
            {
              "url": "https://image.ibb.co/gPptLT/seven_Lives_2.jpg",
              "size": "LARGE",
              "widthPixels": 393,
              "heightPixels": 393
            },
          ]
        },
        "title": "Seven Lives",
        "textContent": {
          "primaryText": {
            "type": "PlainText",
            "text": "Seven Lives"
          },
          "secondaryText": {
            "type": "PlainText",
            "text": "4.4/5"
          },
          "tertiaryText": {
            "type": "PlainText",
            "text": "69 Kensington Avenue"
          }
        }
      }

    }

    if (location.name === 'closest' || location.name === 'laCarnita') {
      outSpeech = _.get(speechMap, 'LOCATION_LA_CARNITA_RESPONSE');
      displayTemplate = {
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
        "title": "La Carnita",
        "textContent": {
          "primaryText": {
            "type": "PlainText",
            "text": "La Carnita"
          },
          "secondaryText": {
            "type": "PlainText",
            "text": "3.6/5"
          },
          "tertiaryText": {
            "type": "PlainText",
            "text": "780 Queen Street East"
          }
        }
      }
    }

    if (_.isEmpty(outSpeech)) {
      outSpeech = _.get(speechMap, 'LOCATION_UNKNOWN_RESPONSE');
      // append previous location list here
    }

    displayTemplate["type"]= "BodyTemplate2";
    displayTemplate["token"]= "string";
    displayTemplate["backButton"]= "HIDDEN";

    return handlerInput.responseBuilder
      .speak(outSpeech)
      .addRenderTemplateDirective(displayTemplate)
      .getResponse();
  },
};
