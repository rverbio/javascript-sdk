# Rverbio Javascript SDK

The Rverbio Javascript SDK enables you to get feedback from your customers with a few lines of code.

**Features**

Rverbio offers some important customization features, with more to come. If you have requests for other features, never hesitate to contact us at <support@rverb.io>.

* Enable/Disable screenshot
* Add custom data to feedback on the back-end
* Supply user identifiers such as an account ID so you can link a user across channels

**Prerequisites**

Before you can use Rverbio in your app, you must create an account at https://rverb.io, and generate an API Key by adding an application.

If you need to retrieve your API Key later, simply log into https://rverb.io and select the application. The API Key is in the upper right corner of the page.

## Installation

**Browser**
`<script src="//unpkg.com/rverbio@latest/dist/rverbio.js"></script>`

**npm**
`npm install rverbio`

## Usage

```javascript
// setup
var instance = new rverbio({
  apiKey: 'YOUR_API_KEY',
  appVersion: 'YOUR_APP_VERSION'
});

// mount the default feedback form
instance.mountForm('YOUR APP NAME');

// mount the default feedback button
instance.mountButton();

// add custom metadata
instance.mergeContext({
  foo: 'bar'
});

// add/replace custom metadata
instance.mergeContext({
  foo: 'baz',
  bar: 'foo'
});

// add user description
instance.setUserDescription('user name or identifier');
// save user email from profile, prevents asking again later
instance.setUserEmail('email@example.com');

```

## Documentation

### new rverbio(options)
```javascript
{
  // the api key you recevied from rverb.io
  apikey,
  // the version of your application
  appVersion: 'Not Set',
  // toggle for screenshot capture
  disableScreenShots: false
}
```

### rverbio.setUserDescription(description: string)

Sets the user description. Typically a user name, user id or other handle.

This will be persisted across sessions.

### rverbio.setUserEmail(email: string)

A valid email address for the user. Users will not be prompted to enter an email in the feedback form if this value is set.

This will be persisted across sessions.

### rverbio.mergeContext(contextData: object)

This method take a shallow list of key value pairs and stores them. This metadata will automatically be attached to the feedback response.

### rverbio.feedback(comment: string[, feedbackType: string, image: Blob])

*Default* feedbackType is `feedback`

This method can be used to post feedback to rverb.io from a custom form.

You can also set a custom feedback type for use in the admin interface or querying our api.


### rverbio.mountForm([appName: string, className: string])

This method mounts the default feedback form to the DOM.

Setting the appName value allows you to customize the form title to say your app name.

You can optionally set a className for style overrides.

### rverbio.openForm()

This method will open the default feedback form and can be used called from an existing or customized feedback link in your application.

### rverbio.mountButton([className: string])

This method will mount the default feedback button to the DOM.

You can optionally set a className for style overrides.

**Pending Features**

* Redact screenshot
