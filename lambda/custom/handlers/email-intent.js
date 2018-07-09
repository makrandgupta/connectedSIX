const _ = require('lodash');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-east-1' });

const alexaConstants = require('./data/alexa-constants.json');
const speechMap = require('./data/speech-map.json');

exports.handler = {
  canHandle(handlerInput) {
    const requestType = _.get(handlerInput, 'requestEnvelope.request.type');
    const intentName = _.get(handlerInput, 'requestEnvelope.request.intent.name');

    return requestType === alexaConstants.REQUEST_TYPE.INTENT_REQUEST
      && intentName === alexaConstants.INTENT_NAME.EMAIL_INTENT;
  },

  async handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes[alexaConstants.ATTRIBUTE_NAME.PREVIOUS_INTENT] = alexaConstants.INTENT_NAME.NO_INTENT;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    // Create sendEmail params 
    var params = {
      Destination: { /* required */
        ToAddresses: [
          'makrand1996@gmail.com',
          /* more items */
        ]
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
            Charset: "UTF-8",
            Data: "<a href='https://www.blogto.com/restaurants/seven-lives-toronto/'>Seven Lives</a>"
          },
          Text: {
            Charset: "UTF-8",
            Data: "https://www.blogto.com/restaurants/seven-lives-toronto/"
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Seven Lives blogTO Link'
        }
      },
      Source: 'makrand1996@gmail.com', /* required */
      ReplyToAddresses: [
        'makrand1996@gmail.com',
        /* more items */
      ],
    };

    // Create the promise and SES service object
    await new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    return handlerInput.responseBuilder
      .speak(speechMap.EMAIL_SENT_RESPONSE)
      .withShouldEndSession(true)
      .getResponse();
  },
};
