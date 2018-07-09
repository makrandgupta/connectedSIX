const _ = require('lodash');
const alexaHelpers = require('./libs/alexa-helpers.js');
const alexaConstants = require('./data/alexa-constants.json');
const speechMap = require('./data/speech-map.json');

exports.handler = {
  canHandle(handlerInput) {
    const requestType = _.get(handlerInput, 'requestEnvelope.request.type');
    const intentName = _.get(handlerInput, 'requestEnvelope.request.intent.name');

    return requestType === alexaConstants.REQUEST_TYPE.INTENT_REQUEST
      && intentName === alexaConstants.INTENT_NAME.BEST_OF_INTENT;
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

    const food = alexaHelpers.getSlotValue(intentRequest, 'food');
    let outSpeech;

    if (food.name === 'tacos') {
      outSpeech = _.get(speechMap, 'BEST_OF_TACO_RESPONSE');
    }

    if (_.isEmpty(outSpeech)) {
      outSpeech = _.get(speechMap, 'BEST_OF_UNKNOWN_RESPONSE');
    }

    const itemList = [
      {
        "token": "sevenLives",
        "textContent": {
          "primaryText": {
            "type": "PlainText",
            "text": "Seven Lives"
          },
          "secondaryText": {
            "type": "PlainText",
            "text": ""
          },
          "tertiaryText": {
            "type": "PlainText",
            "text": ""
          }
        },
        "image": {
          "contentDescription": "Best Tacos",
          "sources": [
            {
              "url": "https://image.ibb.co/bTodLT/seven_Lives.jpg",
              "size": "LARGE",
              "widthPixels": 393,
              "heightPixels": 393
            },
          ]
        },
      },
      {
        "token": "laCarnita",
        "textContent": {
          "primaryText": {
            "type": "PlainText",
            "text": "La Carnita"
          },
          "secondaryText": {
            "text": "",
            "type": "PlainText"
          },
          "tertiaryText": {
            "text": "",
            "type": "PlainText"
          }
        },
        "image": {
          "contentDescription": "Best Tacos",
          "sources": [
            {
              "url": "https://image.ibb.co/dgMb78/la_Carnita.jpg",
              "size": "LARGE",
              "widthPixels": 393,
              "heightPixels": 393
            },
          ]
        },
      },
      {
        "token": "grandElectric",
        "textContent": {
          "primaryText": {
            "type": "PlainText",
            "text": "Grand Electric"
          },
          "secondaryText": {
            "text": "",
            "type": "PlainText"
          },
          "tertiaryText": {
            "text": "",
            "type": "PlainText"
          }
        },
        "image": {
          "contentDescription": "Best Tacos",
          "sources": [
            {
              "url": "https://image.ibb.co/iDpcfT/grand_Electric.jpg",
              "size": "LARGE",
              "widthPixels": 393,
              "heightPixels": 393
            },
          ]
        },
      },
    ]

    const listTemplate = {
      "type": "ListTemplate2",
      "token": "list_template_one",
      backButton: 'VISIBLE',
      "listItems": itemList
    };

    return handlerInput.responseBuilder
      .speak(outSpeech)
      .reprompt(speechMap.BEST_OF_TACO_REPROMPT)
      .addRenderTemplateDirective(listTemplate)
      .getResponse();
  },
};
