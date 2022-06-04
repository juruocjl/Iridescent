/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk"] = self["webpackChunk"] || []).push([["hl"],{

/***/ "./src/getlist.js":
/*!************************!*\
  !*** ./src/getlist.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Toastify=__webpack_require__(/*! toastify-js */ \"./node_modules/toastify-js/src/toastify.js\");\nconst Cookies=__webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/dist/js.cookie.js\");\nfunction dateFormat(fmt, date) {\n    let ret;\n    const opt = {\n        \"Y+\": date.getFullYear().toString(),\n        \"m+\": (date.getMonth() + 1).toString(),\n        \"d+\": date.getDate().toString(),\n        \"H+\": date.getHours().toString(), \n        \"M+\": date.getMinutes().toString(),\n        \"S+\": date.getSeconds().toString()\n    };\n    for (let k in opt) {\n        ret = new RegExp(\"(\" + k + \")\").exec(fmt);\n        if (ret) {\n            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, \"0\")))\n        };\n    };\n    return fmt;\n}\nvar httpRequest = new XMLHttpRequest();\nhttpRequest.open('GET', 'lstupd?time'+(new Date()).getTime(), false);\nhttpRequest.send();\nvar time=JSON.parse(httpRequest.responseText);\nvar now={};\ndocument.getElementById('lstupdate').innerHTML=dateFormat(\"YYYY-mm-dd HH:MM\", (new Date(time.date)));\ntry{\n\tnow=JSON.parse(localStorage.getItem('list'));\n\tif(now.date!=time.date)throw 233;\n}catch(e){\n\tvar httpRequest = new XMLHttpRequest();\n\thttpRequest.open('GET', '/articles/list.json?time'+(new Date()).getTime(), false);\n\thttpRequest.send();\n\tToastify({\n\t\t  text: \"正在获取最新目录：\"+dateFormat(\"YYYY-mm-dd HH:MM\", (new Date(time.date))),\n\t\t  duration: 3000,\n\t\t  newWindow: true,\n\t\t  close: true,\n\t\t  gravity: \"top\",\n\t\t  position: \"right\",\n\t\t  stopOnFocus: true,\n\t\t  style: {\n\t\t\tbackground: \"linear-gradient(to right, #00b09b, #96c93d)\",\n\t\t  },\n\t}).showToast();\n\tnow=JSON.parse(httpRequest.responseText);\n\tlocalStorage.setItem('list',httpRequest.responseText);\n\tCookies.set('seletedtags','{}');\n}\nvar tags=new Array();\nfor(var i=0;i<now.data.length;i++)\n\tfor(var j=0;j<now.data[i].tag.length;j++)\n\t\ttags.push(now.data[i].tag[j]);\ntags=Array.from(new Set(tags));\nmodule.exports = {'articles':now.data,'tags':tags};\n\n\n//# sourceURL=webpack:///./src/getlist.js?");

/***/ })

}]);