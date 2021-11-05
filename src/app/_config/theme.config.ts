
export const config: any = {

  defaultLocale: "us",

  API_URL: "assets",

  menu_speed: 200,

  smartSkin: "smart-style-3",


  skins: [
    {
      name: "smart-style-0",
      logo: "assets/img/logo.png",
      skinBtnClass: "btn btn-block btn-xs txt-color-white margin-right-5",
      style: {
        backgroundColor: '#4E463F'
      },
      label: "Smart Default"
    },

    {
      name: "smart-style-1",
      logo: "assets/img/logo-white.png",
      skinBtnClass: "btn btn-block btn-xs txt-color-white",
      style: {
        background: '#3A4558'
      },
      label: "Dark Elegance"
    },

    {
      name: "smart-style-2",
      logo: "assets/img/logo-blue.png",
      skinBtnClass: "btn btn-xs btn-block txt-color-darken margin-top-5",
      style: {
        background: '#fff'
      },
      label: "Ultra Light"
    },

    {
      name: "smart-style-3",
      logo: "assets/img/logo-pale.png",
      skinBtnClass: "btn btn-xs btn-block txt-color-white margin-top-5",
      style: {
        background: '#f78c40'
      },
      label: "Google Skin"
    },


  ],

  /**
   * DEBUGGING MODE
   * debugState = true; will spit all debuging message inside browser console.
   * The colors are best displayed in chrome browser.
   */

  debugState: false,
  debugStyle: 'font-weight: bold; color: #00f;',
  debugStyle_green: 'font-weight: bold; font-style:italic; color: #46C246;',
  debugStyle_red: 'font-weight: bold; color: #ed1c24;',
  debugStyle_warning: 'background-color:yellow',
  debugStyle_success: 'background-color:green; font-weight:bold; color:#fff;',
  debugStyle_error: 'background-color:#ed1c24; font-weight:bold; color:#fff;',
}