import fs from 'fs';
import Handlebars from 'handlebars';
import mailcomposer from 'mailcomposer';
import config from '../../../config/config';

const apiKey = config.mailgun_key;
const domain = 'mailgun.newtonlabs.com.gt';
const mailgun = require('mailgun-js')({ apiKey, domain });

const source = fs.readFileSync('server/v1/helpers/email-inlined.html', 'utf8');
const template = Handlebars.compile(source);


const sendEmail = (data, htmlData) => {
  const html = template(htmlData);

  const mail = mailcomposer({
    from: 'GobHash <no-reply@gobhash.com>',
    to: data.to,
    subject: data.subject,
    html
  });
  mail.build((mailBuildError, message) => {
    const dataToSend = {
      to: data.to,
      message: message.toString('ascii')
    };
    mailgun.messages().sendMime(dataToSend, (sendError) => {
      if (sendError) {
        console.log(sendError); // eslint-disable-line
      }
    });
  });
};

export default { sendEmail };
