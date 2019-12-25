/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 11:03:59
 * @LastEditTime: 2019-08-12 11:03:59
 * @LastEditors: your name
 */
var Core = require("./../dist/main.js").Core;
new Core({
  docPath: "10.182.52.40",
  realHostName: "10.182.52.40",
  docPort: "",
  mockPort: 3000,
  jsPath: "example/",
  headers: {
    // "host": "kudou-staff-m-fy.jd.com"
  },
  descInclude: ["getAuthCodeUsingGET", "bindCarUsingPOST"],
  override: true
});
