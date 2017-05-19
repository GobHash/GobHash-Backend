import config from '../../../config/config';

const apiKey = config.mailgun_key;
const domain = 'mailgun.newtonlabs.com.gt';
const mailgun = require('mailgun-js')({ apiKey, domain });

const preData = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

const sendEmail = (data = preData) => {
  mailgun.messages().send(data, (error, body) => {
    console.log(body); //eslint-disable-line
  });
};

export default { sendEmail };
