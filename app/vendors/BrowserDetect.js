var BrowserDetectSingleton, Device, __matchMedia,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.Device = (function() {
  function Device() {
    this._handleOrientation = __bind(this._handleOrientation, this);
    this._handleResize = __bind(this._handleResize, this);
    this.onDOMloaded = __bind(this.onDOMloaded, this);
    this.previousDevice = window.device;
    window.device = {};
    this._doc_element = null;
    this._user_agent = window.navigator.userAgent.toLowerCase();
  }

  Device.prototype.osx = function() {
    return this._find('mac os x');
  };

  Device.prototype.ios = function() {
    return this.iphone() || this.ipod() || this.ipad();
  };

  Device.prototype.iphone = function() {
    return this._find('iphone');
  };

  Device.prototype.ipod = function() {
    return this._find('ipod');
  };

  Device.prototype.ipad = function() {
    return this._find('ipad');
  };

  Device.prototype.android = function() {
    return this._find('android');
  };

  Device.prototype.chrome = function() {
    return this._find('chrome') && !this.edge();
  };

  Device.prototype.firefox = function() {
    return this._find('firefox');
  };

  Device.prototype.ie = function() {
    return (new RegExp("trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(this._user_agent) !== null) || ((new RegExp("msie")).exec(this._user_agent) !== null);
  };

  Device.prototype.ie12 = function() {
    return this._find('msie 12.0');
  };

  Device.prototype.ie11 = function() {
    return this._find('msie 11.0');
  };

  Device.prototype.ie10 = function() {
    return this._find('msie 10.0');
  };

  Device.prototype.ie9 = function() {
    return this._find('msie 9.0');
  };

  Device.prototype.ie8 = function() {
    return this._find('msie 8.0');
  };

  Device.prototype.ie7 = function() {
    return this._find('msie 7.0');
  };

  Device.prototype.ie6 = function() {
    return this._find('msie 6.0');
  };

  Device.prototype.safari = function() {
    return this._find('safari');
  };

  Device.prototype.androidPhone = function() {
    return this.android() && this._find('mobile');
  };

  Device.prototype.androidTablet = function() {
    window.innerWidth > 768;
    return this.android() && !this._find('mobile');
  };

  Device.prototype.blackberry = function() {
    return this._find('blackberry') || this._find('bb10') || this._find('rim');
  };

  Device.prototype.blackberryPhone = function() {
    return this.blackberry() && !this._find('tablet');
  };

  Device.prototype.blackberryTablet = function() {
    return this.blackberry() && this._find('tablet');
  };

  Device.prototype.windows = function() {
    return this._find('windows');
  };

  Device.prototype.windowsPhone = function() {
    return this.windows() && this._find('phone');
  };

  Device.prototype.windowsTablet = function() {
    return this.windows() && (this._find('touch') && !this.windowsPhone());
  };

  Device.prototype.fxos = function() {
    return (this._find('(mobile;') || this._find('(tablet;')) && this._find('; rv:');
  };

  Device.prototype.fxosPhone = function() {
    return this.fxos() && this._find('mobile');
  };

  Device.prototype.fxosTablet = function() {
    return this.fxos() && this._find('tablet');
  };

  Device.prototype.meego = function() {
    return this._find('meego');
  };

  Device.prototype.edge = function() {
    return this._find('edge');
  };

  Device.prototype.cordova = function() {
    return window.cordova && location.protocol === 'file:';
  };

  Device.prototype.nodeWebkit = function() {
    return typeof window.process === 'object';
  };

  Device.prototype.mobile = function() {
    return this.androidPhone() || this.iphone() || this.ipod() || this.windowsPhone() || this.blackberryPhone() || this.fxosPhone() || this.meego();
  };

  Device.prototype.tablet = function() {
    return this.ipad() || this.androidTablet() || this.blackberryTablet() || this.windowsTablet() || this.fxosTablet();
  };

  Device.prototype.desktop = function() {
    return !this.tablet() && !this.mobile();
  };

  Device.prototype.nexus5 = function() {
    return this._find('nexus 5');
  };

  Device.prototype.portrait = function() {
    return (window.innerHeight / window.innerWidth) > 1;
  };

  Device.prototype.landscape = function() {
    return (window.innerHeight / window.innerWidth) < 1;
  };

  Device.prototype.noConflict = function() {
    window.device = this.previousDevice;
    return this;
  };

  Device.prototype.browserVersion = function() {
    var M, MEdge, tem, ua;
    ua = navigator.userAgent;
    tem = void 0;

    /** edge specific test before chrome **/
    MEdge = ua.match(/(edge(?=\/))\/?\s*(\d+)/i) || [];
    if( MEdge.length ) {
      return {
        name: MEdge[ 1 ],
        version: MEdge[ 2 ]
      }
    }

    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return {
        name: 'IE ',
        version: tem[1] || ''
      };
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR\/(\d+)/);
      if (tem !== null) {
        return {
          name: 'Opera',
          version: tem[1]
        };
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
      M.splice(1, 1, tem[1]);
    }
    return {
      name: M[0],
      version: M[1]
    };
  };

  Device.prototype._find = function(needle) {
    return this._user_agent.indexOf(needle) !== -1;
  };

  Device.prototype._hasClass = function(class_name) {
    var regex;
    regex = new RegExp(class_name, 'i');
    return this._doc_element.className.match(regex);
  };

  Device.prototype._addClass = function(class_name) {
    if (!this._hasClass(class_name)) {
      return this._doc_element.className += " " + class_name;
    }
  };

  Device.prototype._removeClass = function(class_name) {
    if (this._hasClass(class_name)) {
      return this._doc_element.className = this._doc_element.className.replace(class_name, "");
    }
  };

  Device.prototype.onDOMloaded = function() {

    this._doc_element = window.document.body;
    if (this.ios()) {
      if (this.ipad()) {
        this._addClass("ios ipad tablet");
      } else if (this.iphone()) {
        this._addClass("ios iphone mobile");
      } else if (this.ipod()) {
        this._addClass("ios ipod mobile");
      }
    } else if (this.android()) {
      if (this.desktop()) {
        this._addClass("android desktop error-android-resolution");
      } else if (this.androidTablet()) {
        this._addClass("android tablet");
      } else {
        this._addClass("android mobile");
      }
    } else if (this.blackberry()) {
      if (this.blackberryTablet()) {
        this._addClass("blackberry tablet");
      } else {
        this._addClass("blackberry mobile");
      }
    } else if (this.windows()) {
      if (this.windowsTablet()) {
        this._addClass("windows tablet");
      } else if (this.windowsPhone()) {
        this._addClass("windows mobile");
      } else if (this.windows()) {
        this._addClass("windows desktop");
      }
    } else if (this.fxos()) {
      if (this.fxosTablet()) {
        this._addClass("fxos tablet");
      } else {
        this._addClass("fxos mobile");
      }
    } else if (this.meego()) {
      this._addClass("meego mobile");
    } else if (this.nodeWebkit()) {
      this._addClass("node-webkit");
    } else if (this.osx()) {
      this._addClass("osx desktop");
    } else {
      this._addClass("desktop");
    }
    if (this.desktop()) {
      this._addClass("desktop");
    }
    if (this.cordova()) {
      this._addClass("cordova");
    }
    if (this.chrome()) {
      this._addClass("chrome");
    }
    if (this.edge()) {
      this._addClass("msedge");
    }
    if (this.firefox()) {
      this._addClass("firefox");
    }
    if (this.ie()) {
      this._addClass("ie");
      if (this.ie6()) {
        this._addClass("ie6");
      } else if (this.ie7()) {
        this._addClass("ie7");
      } else if (this.ie8()) {
        this._addClass("ie8");
      } else if (this.ie9()) {
        this._addClass("ie9");
      } else if (this.ie10()) {
        this._addClass("ie10");
      } else {
        this._addClass("ie11");
      }
    }
    this._supports_orientation = "onorientationchange" in window;
    this._orientation_event = this._supports_orientation ? "orientationchange" : "orientationchange";
    if (window.addEventListener) {
      window.addEventListener("resize", this._handleResize, false);
    } else {
      document.attachEvent('resize', this._handleResize); //IE 6/7/8
    }
    return this._handleResize();
  };

  Device.prototype.orientationCallback = null;

  Device.prototype._handleResize = function() {
    var type;
    type = "portrait";
    if (this.landscape()) {
      this._removeClass("portrait");
      this._addClass("landscape");
      type = "landscape";
    } else {
      this._removeClass("landscape");
      this._addClass("portrait");
    }
    if (typeof this.orientationCallback === "function") {
      this.orientationCallback(type);
    }
  };

  Device.prototype._handleOrientation = function(e) {
    var type;
    type = "portrait";
    if (this.landscape()) {
      this._removeClass("portrait");
      this._addClass("landscape");
      type = "landscape";
    } else {
      this._removeClass("landscape");
      this._addClass("portrait");
    }
    if (typeof this.orientationCallback === "function") {
      this.orientationCallback(type);
    }
  };

  return Device;

})();


/*
 * - BrowserDetect
 */

BrowserDetectSingleton = (function() {
  var BrowserDetect, instance;

  function BrowserDetectSingleton() {}

  instance = null;

  BrowserDetectSingleton.get = function() {
    return instance != null ? instance : instance = new BrowserDetect();
  };

  BrowserDetect = (function() {
    function BrowserDetect() {
      this.onChangeOrientation = __bind(this.onChangeOrientation, this);
      this.device = new window.Device();
      this.browserVersion = this.device.browserVersion();
      this.isOSX = this.device.osx();
      this.isIpad = this.device.ios() && this.device.ipad();
      this.isIphone = this.device.ios() && (this.device.iphone() || this.device.ipod);
      this.isIos = this.device.ios();
      this.isAndroidTablet = this.device.android() && this.device.androidTablet();
      if (this.device.android() && !this.device.androidTablet()) {
        this.isAndroidPhone = true;
      }
      this.isAndroid = this.device.android();
      this.isTablet = this.device.tablet();
      this.isMobile = this.device.mobile();
      this.isDesktop = this.device.desktop();
      this.isNexus5 = this.device.nexus5();
      this.isWindow = this.device.windows();
      this.isWindowsPhone = this.device.windowsPhone();
      this.isWindowsTablet = this.device.windowsTablet();
      this.isChrome = this.device.chrome();
      this.isFirefox = this.device.firefox();
      this.isMSEdge = this.device.edge();
      this.isIE = this.device.ie();
      this.isIE6 = this.device.ie6();
      this.isIE7 = this.device.ie7();
      this.isIE8 = this.device.ie8();
      this.isIE9 = this.device.ie9();
      this.isIE10 = this.device.ie10();
      this.isIE11 = this.device.ie11();
      this.isIE12 = this.device.ie12();
      this.isIEDesktop = this.device.ie() && !this.device.windowsPhone() && !this.device.windowsTablet();
      this.isltIE10 = this.device.ie9() || this.device.ie8() || this.device.ie7() || this.device.ie6();
      this.islteIE10 = this.device.ie10() || this.device.ie9() || this.device.ie8() || this.device.ie7() || this.device.ie6();
      this.isltIE9 = this.device.ie8() || this.device.ie7() || this.device.ie6();
      this.islteIE9 = this.device.ie9() || this.device.ie8() || this.device.ie7() || this.device.ie6();
      this.isSafari = !this.device.chrome() && this.device.safari();
      this.isLandscape = this.device.landscape();
      this.isPortrait = this.device.portrait();
      this.isGalaxyTab10inches = this.device.android() && __matchMedia('(min-device-width: 1280px) and (max-device-width: 1281px) and (orientation: landscape), (min-device-width: 800px) and (max-device-width: 801px) and (orientation: portrait)');
      this.isGalaxyTab7inches = this.device.android() && __matchMedia('(min-device-width: 1024px) and (max-device-width: 1025px) and (orientation: landscape), (min-device-width: 600px) and (max-device-width: 601px) and (orientation: portrait)');
      this.isGalaxyTab = this.isGalaxyTab7inches || this.isGalaxyTab10inches;
      if (this.isAndroid && this.isGalaxyTab) {
        this.forceGalaxyTab();
      }
    }

    BrowserDetect.prototype.forceGalaxyTab = function() {
      this.device.desktop = function() {
        return true;
      };
      this.device.tablet = function() {
        return false;
      };
      this.device.mobile = function() {
        return false;
      };
      this.isDesktop = this.device.desktop();
      this.isTablet = this.device.tablet();
      return this.isMobile = this.device.mobile();
    };

    BrowserDetect.prototype.bindEvents = function() {
      return this.device.onDOMloaded();
    };

    BrowserDetect.prototype.onChangeOrientation = function(callback) {
      if (callback == null) {
        callback = null;
      }
      if (callback != null) {
        return this.device.orientationCallback = callback;
      }
    };

    return BrowserDetect;

  })();

  return BrowserDetectSingleton;

})();


/*
 * - matchMedia
 */

__matchMedia = function(context) {
  var desktop, mobile, tablet;
  if (window.matchMedia != null) {
    desktop = "(min-device-width: 1024px)";
    tablet = "(min-device-width: 768px) and (max-device-width: 1023px)";
    mobile = "(min-device-width: 320px) and (max-device-width: 767px)";
    switch (context) {
      case 'mobile':
        return window.matchMedia(mobile).matches;
      case 'tablet':
        return window.matchMedia(tablet).matches;
      case 'desktop':
        return window.matchMedia(desktop).matches;
      default:
        return window.matchMedia(context).matches;
    }
  }
};

window.BrowserDetect = BrowserDetectSingleton.get();
window.BrowserDetect.bindEvents();
export default window.BrowserDetect