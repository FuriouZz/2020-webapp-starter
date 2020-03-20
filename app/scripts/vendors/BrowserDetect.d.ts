declare module "BrowserDetect" {
  type OrientationCallback = (type: "portrait" | "landscape") => void

  class Device {
    osx(): boolean
    ios(): boolean
    iphone(): boolean
    ipod(): boolean
    ipad(): boolean
    android(): boolean
    chrome(): boolean
    firefox(): boolean
    ie(): boolean
    ie12(): boolean
    ie11(): boolean
    ie10(): boolean
    ie9(): boolean
    ie8(): boolean
    ie7(): boolean
    ie6(): boolean
    safari(): boolean
    androidPhone(): boolean
    androidTablet(): boolean
    blackberry(): boolean
    blackberryPhone(): boolean
    blackberryTablet(): boolean
    windows(): boolean
    windowsPhone(): boolean
    windowsTablet(): boolean
    fxos(): boolean
    fxosPhone(): boolean
    fxosTablet(): boolean
    meego(): boolean
    edge(): boolean
    cordova(): boolean
    nodeWebkit(): boolean
    mobile(): boolean
    tablet(): boolean
    desktop(): boolean
    nexus5(): boolean
    portrait(): boolean
    landscape(): boolean

    noConflict() : Device
    browserVersion() : { name: string, version: string }
    orientationCallback?: OrientationCallback
  }

  export default class BrowserDetect {
    static isOSX: boolean
    static isIpad: boolean
    static isIphone: boolean
    static isIos: boolean
    static isAndroidTablet: boolean
    static isAndroidPhone: boolean
    static isAndroid: boolean
    static isTablet: boolean
    static isMobile: boolean
    static isDesktop: boolean
    static isNexus5: boolean
    static isWindow: boolean
    static isWindowsPhone: boolean
    static isWindowsTablet: boolean
    static isChrome: boolean
    static isFirefox: boolean
    static isMSEdge: boolean
    static isIE: boolean
    static isIE6: boolean
    static isIE7: boolean
    static isIE8: boolean
    static isIE9: boolean
    static isIE10: boolean
    static isIE11: boolean
    static isIE12: boolean
    static isIEDesktop: boolean
    static isltIE10: boolean
    static islteIE10: boolean
    static isltIE9: boolean
    static islteIE9: boolean
    static isSafari: boolean
    static isLandscape: boolean
    static isPortrait: boolean
    static isGalaxyTab10inches: boolean
    static isGalaxyTab7inches: boolean
    static isGalaxyTab: boolean
    static forceGalaxyTab(): boolean
    static bindEvents(): void
    static onChangeOrientation( cb: OrientationCallback ) : OrientationCallback | void
  }
}