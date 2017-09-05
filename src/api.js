import axios from 'axios'; // eslint-disable-line

export default class Api {
  constructor({ apiKey }) {
    this.scopedApi = axios.create({
      // eslint-disable-next-line
      baseURL: window.rverbio_api_url || 'https://rverb.io',
      headers: {
        ApiKey: apiKey,
      },
    });

    this.imageApi = axios.create({
      headers: {
        'x-ms-blob-type': 'BlockBlob',
      },
    });
  }

  postFeedback({ endUserId, comment, feedbackType,
    standardFields, contextData, sessionStartsUtc }) {
    return this.scopedApi.post('/api/feedback', {
      appVersion: standardFields.appVersion,
      locale: standardFields.locale,
      deviceName: standardFields.deviceName,
      deviceManufacturer: standardFields.deviceManufacturer,
      deviceModel: standardFields.deviceModel,
      osVersion: standardFields.osVersion,
      browser: standardFields.browser,
      timestamputc: new Date().toISOString(),
      comment,
      endUserId,
      feedbackType,
      sessionStartsUtc,
      contextData: Object.getOwnPropertyNames(contextData)
        .map(key => ({ key, value: contextData[key] })),
    });
  }

  postUser({ id, description, email, firstSeen }) {
    return this.scopedApi.post('/api/enduser', {
      EndUserId: id,
      UserIdentifier: description,
      EmailAddress: email,
      firstSeenUtc: firstSeen,
    });
  }

  uploadImage({ url, blob }) {
    return this.imageApi.put(url, blob);
  }
}
