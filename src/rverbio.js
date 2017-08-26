import UAParser from 'ua-parser-js';
import Api from './api';
import EndUser from './enduser';
import Sessions from './sessions';
import Form from './form';
import Button from './button';


export default class Rverbio {
  constructor({ appVersion = 'Not Set', apiKey, disableScreenShots = false }) {
    if (!apiKey) {
      throw new Error('An apikey is required');
    }

    this.appVersion = appVersion;
    this.apiKey = apiKey;
    this.disableScreenShots = disableScreenShots;
    this.api = new Api({ apiKey });
    this.endUser = new EndUser();
    this.sessions = new Sessions();
    this.contextData = {};
    const parser = new UAParser();

    const browserInfo = parser.setUA(navigator.userAgent).getResult();

    this.standardFields = {
      deviceManufacturer: browserInfo.device.vendor,
      deviceModel: browserInfo.device.model,
      deviceName: browserInfo.device.type,
      osVersion: `${browserInfo.os.name} ${browserInfo.os.version}`.trim(),
      locale: navigator.language,
      appVersion: this.appVersion,
      browser: `${browserInfo.browser.name} ${browserInfo.browser.version}`.trim(),
    };
  }

  setUserDescription(description) {
    this.endUser.description = description;
  }

  setUserEmail(email) {
    this.endUser.email = email;
  }

  isEmailSet() {
    return this.endUser.email && true;
  }

  mergeContext(contextData) {
    this.contextData = Object.assign({}, this.contextData, contextData);
  }

  getContext() {
    return Object.assign({}, this.standardFields, this.contextData);
  }

  get shouldTakeScreenshot() {
    return !this.disableScreenShots;
  }

  feedback({ comment, feedbackType = 'feedback', image }) {
    // validation
    if (!comment) {
      throw new Error('a message is required');
    }

    return this.endUser.sync(this.api)
      .then(() => (
        this.api.postFeedback({
          comment,
          endUserId: this.endUser.id,
          contextData: this.contextData,
          sessionStartsUtc: this.sessions.sessions,
          feedbackType,
          standardFields: this.standardFields,
        }).then((info) => {
          // reset sessions after successful feedback
          this.sessions.reset();

          // send the image if we have one
          if (image) {
            return this.api.uploadImage({ url: info.data.uploadUrl, blob: image });
          }

          return new Promise((resolve) => { resolve(); });
        }).catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        })
      ));
  }

  mountForm(appName = '', className) {
    Form.mountForm(appName, className, this);
  }

  openForm() {
    Form.openForm(this);
  }

  mountButton(className) {
    Button.mountButton(className, this);
  }
}
