<h1 align="center">Korea Version of Share Button <https://github.com/carrot/share-button></h1>

<p align="center">
  <img src="http://i.imgur.com/UODN0Ri.png" width="300" />
</p>
<p align="center">
  <a title="Build Status" href="https://travis-ci.org/carrot/share-button">
    <img src="http://img.shields.io/travis/carrot/share-button.svg?style=flat-square"/>
  </a>
</p>

# An Introduction
Korea Version of Share Button - A Simple, light, flexible, and good-looking share button. [See it in action!](http://sharebutton.co/)

## Korea SNS supported?
1. KakaoStory (PC)
2. KakaoTalk (Mobile)
3. NaverLine (Mobile)
4. NaverBand (Mobile)
5. NaverBlog (PC)

# Getting Started
1. [Download the latest script & stylesheet](https://github.com/duytd/korean-share-button/releases) and include it on your page.
2. Make a `share-button` element on your page
3. In your javascript, call `new ShareButton()`
4. Pass options to the share call if you want (details below)
5. Profit!

```html
<share-button></share-button>
```

```js
new ShareButton({
  networks: {
    facebook: {
      app_id: "abc123"
    }
  }
});
```

# Customization
## Configuration Options
The share button is extremely flexible. As such we provide the ability to pass a wide array of options for additional configuration. All configuration options are available here: [Configuration Options](https://github.com/carrot/share-button/blob/master/docs/configuration-options.md)

## Styles
Additionally, you're able to customize the look and feel of the button and animations though CSS. All CSS styles and how to modify them are available here: [CSS Styles](https://github.com/carrot/share-button/blob/master/docs/styles.md)

## Hooks
You are able to set `before` and `after` hooks when a user clicks a network. This allows you to dynamically change attributes for that button. For more information: [click here](https://github.com/carrot/share-button/blob/master/docs/network-hooks.md)

# Public API
The share button also returns a simple API that can be used to control it should you need to. Example shown below:

```js
var share = new ShareButton(); // Grabs all share-button elements on page

share.toggle(); // toggles the share button popup
share.open();   // open the share button popup
share.close();  // closes the share button popup
share.config;   // exposes the configurations listed above
```

# Contributing and License
- Contributing Guidelines can be found [here](https://github.com/carrot/share-button/blob/master/CONTRIBUTING.md)
- Licensed under MIT - [details here](https://github.com/carrot/share-button/blob/master/LICENSE)
