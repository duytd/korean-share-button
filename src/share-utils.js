import StringUtils from './string-utils';

/**
 * ShareUtils
 * @class
 * @classdesc A nice set of utilities.
 */
class ShareUtils {
  _getStyle(ele, css) {
    var strValue = "";

    if (document.defaultView && document.defaultView.getComputedStyle) {
      strValue = document.defaultView.getComputedStyle(ele, "")
        .getPropertyValue(css);
    } else if (ele.currentStyle) {
      css = css.replace(/\-(\w)/g, function (strMatch, p1) {
        return p1.toUpperCase();
      });
      strValue = ele.currentStyle[css];
    }

    return strValue;
}

  /**
   * @method _hide
   * @description Change element's display to 'none'
   * @private
   *
   * @param {DOMNode} el
   */
  _hide(el) {
    el.style.display = "none";
  }

  /**
   * @method _show
   * @description Change element's display to 'block'
   * @private
   *
   * @param {DOMNode} el
   */
  _show(el) {
    el.style.display = "initial";
  }

  /**
   * @method _hasClass
   * @description Wrapper to see if an element contains a class.
   * @private
   *
   * @param {DOMNode} el
   * @param {String}  className
   * @returns {Boolean}
   */
  _hasClass(el, className) {
    return el.classList.contains(className);
  }

  /**
   * @method addClass
   * @description Wrapper to add class to element.
   * @private
   *
   * @param {DOMNode} el
   * @param {String}  className
   */
  _addClass(el, className) {
    el.classList.add(className);
  }

  /**
   * @method removeClass
   * @description Wrapper to remove class from element.
   * @private
   *
   * @param {DOMNode} el
   * @param {String}  className
   */
  _removeClass(el, className) {
    el.classList.remove(className);
  }

  /**
   * @method _isEncoded
   * @description Wrapper to check if the string is encoded.
   * @private
   *
   * @param {String}  str
   * @param {Boolean}
   */
  _isEncoded(str) {
    str = StringUtils.toRFC3986(str);
    return decodeURIComponent(str) !== str;
  }

  /**
   * @method _encode
   * @description Wrapper to _encode a string if the string isn't already encoded.
   * @private
   *
   * @param {DOMNode} el
   * @param {String}  className
   */
  _encode(str) {
    if (typeof str === 'undefined' || str === null || this._isEncoded(str))
      return encodeURIComponent(str);
    else
      return StringUtils.toRFC3986(str);
  }

  /**
   * @method _getUrl
   * @description Returns the correct share URL based off of the incoming
   * URL and parameters given
   * @private
   *
   * @param {String} url
   * @param {boolean} encode
   * @param {Object} params
   */
  _getUrl(url, encode=false, params={}) {
    let qs = (() => {
      let results = [];
      for (let k of Object.keys(params)) {
        let v = params[k];
        results.push(`${k}=${this._encode(v)}`);
      }
      return results.join('&');
    })();

    if (qs) qs = `?${qs}`;

    return url + qs;
  }

  /**
   * @method _updateHref
   * @description Makes the elements a tag have a href of the popup link and
   * as pops up the share window for the element
   * @private
   *
   * @param {DOMNode} element
   * @param {String} url
   * @param {Object} params
   */
  _updateHref(element, url, params) {
    let encode = url.indexOf('mailto:') >= 0;
    let a = element.getElementsByTagName('a')[0];
    a.setAttribute('href', this._getUrl(url, !encode, params));
    if(!encode && (!this.config.networks.facebook.loadSdk || element.getAttribute('class') !== 'facebook')) {
      let popup = {
        width: 500,
        height: 350
      };

      popup.top = (screen.height / 2) - (popup.height / 2);
      popup.left = (screen.width / 2)  - (popup.width / 2);

      window.open(
        a.href,
        'targetWindow', `
          toolbar=no,
          location=no,
          status=no,
          menubar=no,
          scrollbars=yes,
          resizable=yes,
          left=${popup.left},
          top=${popup.top},
          width=${popup.width},
          height=${popup.height}
        `
      );
    }
  }

  /**
   * @method popup
   * @description Create a window for specified network
   *
   * @param {String}  url
   * @param {Object}  params
   */
  popup(url, params={}) {
    let popup = {
      width: 500,
      height: 350
    };

    popup.top = (screen.height / 2) - (popup.height / 2);
    popup.left = (screen.width / 2)  - (popup.width / 2);

    let qs = (() => {
      let results = [];
      for (let k of Object.keys(params)) {
        let v = params[k];
        results.push(`${k}=${this._encode(v)}`);
      }
      return results.join('&');
    })();

    if (qs) qs = `?${qs}`;

    // This does work even though it contains \n once converted.
    window.open(
      url+qs,
      'targetWindow', `
        toolbar=no,
        location=no,
        status=no,
        menubar=no,
        scrollbars=yes,
        resizable=yes,
        left=${popup.left},
        top=${popup.top},
        width=${popup.width},
        height=${popup.height}
      `
    );
  }

  /**
   * @method _merge
   * @description Combines two (or more) objects, giving the last one precedence
   * @author svlasov-gists
   * [Original Gist]{@link https://gist.github.com/svlasov-gists/2383751}
   *
   * @param {Object}  target
   * @param {Object}  source
   * @return {Object} target
   */
  _merge(target, source) {
    if (typeof target !== 'object') target = {};

    for (let property in source) {
      if (source.hasOwnProperty(property)) {
        let sourceProperty = source[property];

        if (typeof sourceProperty === 'object') {
          target[property] = this._merge(target[property], sourceProperty);
          continue;
        }

        target[property] = sourceProperty;
      }
    }

    for (let a = 2, l = arguments.length; a < l; a++)
      _merge(target, arguments[a]);

    return target;
  }

  /**
   * @method _objectToArray
   * @description Takes an Object and converts it into an array of Objects. This is used when converting a list of DOMNodes into an array.
   *
   * @param {Object} obj
   * @returns {Array} arr
   */
  _objToArray(obj) {
    let arr = [];

    for (let k in obj)
      if (typeof obj[k] === 'object') arr.push(obj[k]);

    return arr;
  }

  /**
   * @method _isMobile
   * @description Returns true if current device is mobile (or PhantomJS for
   * testing purposes), and false otherwise
   * @author kriskbx
   * [Original Gist] {@link https://github.com/kriskbx/whatsapp-sharing/blob/master/src/button.js}
   * @private
   */
  _isMobile() {
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
      return true;
    return false;
  }
}

export default ShareUtils;
