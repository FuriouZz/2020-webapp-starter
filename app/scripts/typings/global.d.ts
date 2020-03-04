import BrowserDetect from 'BrowserDetect';

declare global {

  const tracking: any;

  const MessengerExtensions: any;
  const UC: any;
  const tc_events_100: any;
  const $: any;
  const jQuery: any;
  const wa_data: any;

  interface Window {
    BrowserDetect: BrowserDetect
    WEBVIEW_HOST?: string,
    GoogleMapInit,
    GooglePlacesInit,
    google: any
  }

}
