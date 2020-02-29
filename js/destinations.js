/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"destinations": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/js/import/pages/destinations.js","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/data/countries.json":
/*!*********************************!*\
  !*** ./src/data/countries.json ***!
  \*********************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, default */
/***/ (function(module) {

module.exports = JSON.parse("[{\"name\":\"Afghanistan\",\"code\":\"AF\"},{\"name\":\"Åland Islands\",\"code\":\"AX\"},{\"name\":\"Albania\",\"code\":\"AL\"},{\"name\":\"Algeria\",\"code\":\"DZ\"},{\"name\":\"American Samoa\",\"code\":\"AS\"},{\"name\":\"AndorrA\",\"code\":\"AD\"},{\"name\":\"Angola\",\"code\":\"AO\"},{\"name\":\"Anguilla\",\"code\":\"AI\"},{\"name\":\"Antarctica\",\"code\":\"AQ\"},{\"name\":\"Antigua and Barbuda\",\"code\":\"AG\"},{\"name\":\"Argentina\",\"code\":\"AR\"},{\"name\":\"Armenia\",\"code\":\"AM\"},{\"name\":\"Aruba\",\"code\":\"AW\"},{\"name\":\"Australia\",\"code\":\"AU\"},{\"name\":\"Austria\",\"code\":\"AT\"},{\"name\":\"Azerbaijan\",\"code\":\"AZ\"},{\"name\":\"Bahamas\",\"code\":\"BS\"},{\"name\":\"Bahrain\",\"code\":\"BH\"},{\"name\":\"Bangladesh\",\"code\":\"BD\"},{\"name\":\"Barbados\",\"code\":\"BB\"},{\"name\":\"Belarus\",\"code\":\"BY\"},{\"name\":\"Belgium\",\"code\":\"BE\"},{\"name\":\"Belize\",\"code\":\"BZ\"},{\"name\":\"Benin\",\"code\":\"BJ\"},{\"name\":\"Bermuda\",\"code\":\"BM\"},{\"name\":\"Bhutan\",\"code\":\"BT\"},{\"name\":\"Bolivia\",\"code\":\"BO\"},{\"name\":\"Bosnia and Herzegovina\",\"code\":\"BA\"},{\"name\":\"Botswana\",\"code\":\"BW\"},{\"name\":\"Bouvet Island\",\"code\":\"BV\"},{\"name\":\"Brazil\",\"code\":\"BR\"},{\"name\":\"British Indian Ocean Territory\",\"code\":\"IO\"},{\"name\":\"Brunei Darussalam\",\"code\":\"BN\"},{\"name\":\"Bulgaria\",\"code\":\"BG\"},{\"name\":\"Burkina Faso\",\"code\":\"BF\"},{\"name\":\"Burundi\",\"code\":\"BI\"},{\"name\":\"Cambodia\",\"code\":\"KH\"},{\"name\":\"Cameroon\",\"code\":\"CM\"},{\"name\":\"Canada\",\"code\":\"CA\"},{\"name\":\"Cape Verde\",\"code\":\"CV\"},{\"name\":\"Cayman Islands\",\"code\":\"KY\"},{\"name\":\"Central African Republic\",\"code\":\"CF\"},{\"name\":\"Chad\",\"code\":\"TD\"},{\"name\":\"Chile\",\"code\":\"CL\"},{\"name\":\"China\",\"code\":\"CN\"},{\"name\":\"Christmas Island\",\"code\":\"CX\"},{\"name\":\"Cocos (Keeling) Islands\",\"code\":\"CC\"},{\"name\":\"Colombia\",\"code\":\"CO\"},{\"name\":\"Comoros\",\"code\":\"KM\"},{\"name\":\"Congo\",\"code\":\"CG\"},{\"name\":\"Congo, The Democratic Republic of the\",\"code\":\"CD\"},{\"name\":\"Cook Islands\",\"code\":\"CK\"},{\"name\":\"Costa Rica\",\"code\":\"CR\"},{\"name\":\"Cote D\\\"Ivoire\",\"code\":\"CI\"},{\"name\":\"Croatia\",\"code\":\"HR\"},{\"name\":\"Cuba\",\"code\":\"CU\"},{\"name\":\"Cyprus\",\"code\":\"CY\"},{\"name\":\"Czech Republic\",\"code\":\"CZ\"},{\"name\":\"Denmark\",\"code\":\"DK\"},{\"name\":\"Djibouti\",\"code\":\"DJ\"},{\"name\":\"Dominica\",\"code\":\"DM\"},{\"name\":\"Dominican Republic\",\"code\":\"DO\"},{\"name\":\"Ecuador\",\"code\":\"EC\"},{\"name\":\"Egypt\",\"code\":\"EG\"},{\"name\":\"El Salvador\",\"code\":\"SV\"},{\"name\":\"Equatorial Guinea\",\"code\":\"GQ\"},{\"name\":\"Eritrea\",\"code\":\"ER\"},{\"name\":\"Estonia\",\"code\":\"EE\"},{\"name\":\"Ethiopia\",\"code\":\"ET\"},{\"name\":\"Falkland Islands (Malvinas)\",\"code\":\"FK\"},{\"name\":\"Faroe Islands\",\"code\":\"FO\"},{\"name\":\"Fiji\",\"code\":\"FJ\"},{\"name\":\"Finland\",\"code\":\"FI\"},{\"name\":\"France\",\"code\":\"FR\"},{\"name\":\"French Guiana\",\"code\":\"GF\"},{\"name\":\"French Polynesia\",\"code\":\"PF\"},{\"name\":\"French Southern Territories\",\"code\":\"TF\"},{\"name\":\"Gabon\",\"code\":\"GA\"},{\"name\":\"Gambia\",\"code\":\"GM\"},{\"name\":\"Georgia\",\"code\":\"GE\"},{\"name\":\"Germany\",\"code\":\"DE\"},{\"name\":\"Ghana\",\"code\":\"GH\"},{\"name\":\"Gibraltar\",\"code\":\"GI\"},{\"name\":\"Greece\",\"code\":\"GR\"},{\"name\":\"Greenland\",\"code\":\"GL\"},{\"name\":\"Grenada\",\"code\":\"GD\"},{\"name\":\"Guadeloupe\",\"code\":\"GP\"},{\"name\":\"Guam\",\"code\":\"GU\"},{\"name\":\"Guatemala\",\"code\":\"GT\"},{\"name\":\"Guernsey\",\"code\":\"GG\"},{\"name\":\"Guinea\",\"code\":\"GN\"},{\"name\":\"Guinea-Bissau\",\"code\":\"GW\"},{\"name\":\"Guyana\",\"code\":\"GY\"},{\"name\":\"Haiti\",\"code\":\"HT\"},{\"name\":\"Heard Island and Mcdonald Islands\",\"code\":\"HM\"},{\"name\":\"Holy See (Vatican City State)\",\"code\":\"VA\"},{\"name\":\"Honduras\",\"code\":\"HN\"},{\"name\":\"Hong Kong\",\"code\":\"HK\"},{\"name\":\"Hungary\",\"code\":\"HU\"},{\"name\":\"Iceland\",\"code\":\"IS\"},{\"name\":\"India\",\"code\":\"IN\"},{\"name\":\"Indonesia\",\"code\":\"ID\"},{\"name\":\"Iran, Islamic Republic Of\",\"code\":\"IR\"},{\"name\":\"Iraq\",\"code\":\"IQ\"},{\"name\":\"Ireland\",\"code\":\"IE\"},{\"name\":\"Isle of Man\",\"code\":\"IM\"},{\"name\":\"Israel\",\"code\":\"IL\"},{\"name\":\"Italy\",\"code\":\"IT\"},{\"name\":\"Jamaica\",\"code\":\"JM\"},{\"name\":\"Japan\",\"code\":\"JP\"},{\"name\":\"Jersey\",\"code\":\"JE\"},{\"name\":\"Jordan\",\"code\":\"JO\"},{\"name\":\"Kazakhstan\",\"code\":\"KZ\"},{\"name\":\"Kenya\",\"code\":\"KE\"},{\"name\":\"Kiribati\",\"code\":\"KI\"},{\"name\":\"Korea, Democratic People\",\"code\":\"KP\"},{\"name\":\"Korea, Republic of\",\"code\":\"KR\"},{\"name\":\"Kuwait\",\"code\":\"KW\"},{\"name\":\"Kyrgyzstan\",\"code\":\"KG\"},{\"name\":\"Lao People\",\"code\":\"LA\"},{\"name\":\"Latvia\",\"code\":\"LV\"},{\"name\":\"Lebanon\",\"code\":\"LB\"},{\"name\":\"Lesotho\",\"code\":\"LS\"},{\"name\":\"Liberia\",\"code\":\"LR\"},{\"name\":\"Libyan Arab Jamahiriya\",\"code\":\"LY\"},{\"name\":\"Liechtenstein\",\"code\":\"LI\"},{\"name\":\"Lithuania\",\"code\":\"LT\"},{\"name\":\"Luxembourg\",\"code\":\"LU\"},{\"name\":\"Macao\",\"code\":\"MO\"},{\"name\":\"Macedonia, The Former Yugoslav Republic of\",\"code\":\"MK\"},{\"name\":\"Madagascar\",\"code\":\"MG\"},{\"name\":\"Malawi\",\"code\":\"MW\"},{\"name\":\"Malaysia\",\"code\":\"MY\"},{\"name\":\"Maldives\",\"code\":\"MV\"},{\"name\":\"Mali\",\"code\":\"ML\"},{\"name\":\"Malta\",\"code\":\"MT\"},{\"name\":\"Marshall Islands\",\"code\":\"MH\"},{\"name\":\"Martinique\",\"code\":\"MQ\"},{\"name\":\"Mauritania\",\"code\":\"MR\"},{\"name\":\"Mauritius\",\"code\":\"MU\"},{\"name\":\"Mayotte\",\"code\":\"YT\"},{\"name\":\"Mexico\",\"code\":\"MX\"},{\"name\":\"Micronesia, Federated States of\",\"code\":\"FM\"},{\"name\":\"Moldova, Republic of\",\"code\":\"MD\"},{\"name\":\"Monaco\",\"code\":\"MC\"},{\"name\":\"Mongolia\",\"code\":\"MN\"},{\"name\":\"Montserrat\",\"code\":\"MS\"},{\"name\":\"Morocco\",\"code\":\"MA\"},{\"name\":\"Mozambique\",\"code\":\"MZ\"},{\"name\":\"Myanmar\",\"code\":\"MM\"},{\"name\":\"Namibia\",\"code\":\"NA\"},{\"name\":\"Nauru\",\"code\":\"NR\"},{\"name\":\"Nepal\",\"code\":\"NP\"},{\"name\":\"Netherlands\",\"code\":\"NL\"},{\"name\":\"Netherlands Antilles\",\"code\":\"AN\"},{\"name\":\"New Caledonia\",\"code\":\"NC\"},{\"name\":\"New Zealand\",\"code\":\"NZ\"},{\"name\":\"Nicaragua\",\"code\":\"NI\"},{\"name\":\"Niger\",\"code\":\"NE\"},{\"name\":\"Nigeria\",\"code\":\"NG\"},{\"name\":\"Niue\",\"code\":\"NU\"},{\"name\":\"Norfolk Island\",\"code\":\"NF\"},{\"name\":\"Northern Mariana Islands\",\"code\":\"MP\"},{\"name\":\"Norway\",\"code\":\"NO\"},{\"name\":\"Oman\",\"code\":\"OM\"},{\"name\":\"Pakistan\",\"code\":\"PK\"},{\"name\":\"Palau\",\"code\":\"PW\"},{\"name\":\"Palestinian Territory, Occupied\",\"code\":\"PS\"},{\"name\":\"Panama\",\"code\":\"PA\"},{\"name\":\"Papua New Guinea\",\"code\":\"PG\"},{\"name\":\"Paraguay\",\"code\":\"PY\"},{\"name\":\"Peru\",\"code\":\"PE\"},{\"name\":\"Philippines\",\"code\":\"PH\"},{\"name\":\"Pitcairn\",\"code\":\"PN\"},{\"name\":\"Poland\",\"code\":\"PL\"},{\"name\":\"Portugal\",\"code\":\"PT\"},{\"name\":\"Puerto Rico\",\"code\":\"PR\"},{\"name\":\"Qatar\",\"code\":\"QA\"},{\"name\":\"Reunion\",\"code\":\"RE\"},{\"name\":\"Romania\",\"code\":\"RO\"},{\"name\":\"Russian Federation\",\"code\":\"RU\"},{\"name\":\"RWANDA\",\"code\":\"RW\"},{\"name\":\"Saint Helena\",\"code\":\"SH\"},{\"name\":\"Saint Kitts and Nevis\",\"code\":\"KN\"},{\"name\":\"Saint Lucia\",\"code\":\"LC\"},{\"name\":\"Saint Pierre and Miquelon\",\"code\":\"PM\"},{\"name\":\"Saint Vincent and the Grenadines\",\"code\":\"VC\"},{\"name\":\"Samoa\",\"code\":\"WS\"},{\"name\":\"San Marino\",\"code\":\"SM\"},{\"name\":\"Sao Tome and Principe\",\"code\":\"ST\"},{\"name\":\"Saudi Arabia\",\"code\":\"SA\"},{\"name\":\"Senegal\",\"code\":\"SN\"},{\"name\":\"Serbia and Montenegro\",\"code\":\"CS\"},{\"name\":\"Seychelles\",\"code\":\"SC\"},{\"name\":\"Sierra Leone\",\"code\":\"SL\"},{\"name\":\"Singapore\",\"code\":\"SG\"},{\"name\":\"Slovakia\",\"code\":\"SK\"},{\"name\":\"Slovenia\",\"code\":\"SI\"},{\"name\":\"Solomon Islands\",\"code\":\"SB\"},{\"name\":\"Somalia\",\"code\":\"SO\"},{\"name\":\"South Africa\",\"code\":\"ZA\"},{\"name\":\"South Georgia and the South Sandwich Islands\",\"code\":\"GS\"},{\"name\":\"Spain\",\"code\":\"ES\"},{\"name\":\"Sri Lanka\",\"code\":\"LK\"},{\"name\":\"Sudan\",\"code\":\"SD\"},{\"name\":\"Suriname\",\"code\":\"SR\"},{\"name\":\"Svalbard and Jan Mayen\",\"code\":\"SJ\"},{\"name\":\"Swaziland\",\"code\":\"SZ\"},{\"name\":\"Sweden\",\"code\":\"SE\"},{\"name\":\"Switzerland\",\"code\":\"CH\"},{\"name\":\"Syrian Arab Republic\",\"code\":\"SY\"},{\"name\":\"Taiwan, Province of China\",\"code\":\"TW\"},{\"name\":\"Tajikistan\",\"code\":\"TJ\"},{\"name\":\"Tanzania, United Republic of\",\"code\":\"TZ\"},{\"name\":\"Thailand\",\"code\":\"TH\"},{\"name\":\"Timor-Leste\",\"code\":\"TL\"},{\"name\":\"Togo\",\"code\":\"TG\"},{\"name\":\"Tokelau\",\"code\":\"TK\"},{\"name\":\"Tonga\",\"code\":\"TO\"},{\"name\":\"Trinidad and Tobago\",\"code\":\"TT\"},{\"name\":\"Tunisia\",\"code\":\"TN\"},{\"name\":\"Turkey\",\"code\":\"TR\"},{\"name\":\"Turkmenistan\",\"code\":\"TM\"},{\"name\":\"Turks and Caicos Islands\",\"code\":\"TC\"},{\"name\":\"Tuvalu\",\"code\":\"TV\"},{\"name\":\"Uganda\",\"code\":\"UG\"},{\"name\":\"Ukraine\",\"code\":\"UA\"},{\"name\":\"United Arab Emirates\",\"code\":\"AE\"},{\"name\":\"United Kingdom\",\"code\":\"GB\"},{\"name\":\"United States\",\"code\":\"US\"},{\"name\":\"United States Minor Outlying Islands\",\"code\":\"UM\"},{\"name\":\"Uruguay\",\"code\":\"UY\"},{\"name\":\"Uzbekistan\",\"code\":\"UZ\"},{\"name\":\"Vanuatu\",\"code\":\"VU\"},{\"name\":\"Venezuela\",\"code\":\"VE\"},{\"name\":\"Viet Nam\",\"code\":\"VN\"},{\"name\":\"Virgin Islands, British\",\"code\":\"VG\"},{\"name\":\"Virgin Islands, U.S.\",\"code\":\"VI\"},{\"name\":\"Wallis and Futuna\",\"code\":\"WF\"},{\"name\":\"Western Sahara\",\"code\":\"EH\"},{\"name\":\"Yemen\",\"code\":\"YE\"},{\"name\":\"Zambia\",\"code\":\"ZM\"},{\"name\":\"Zimbabwe\",\"code\":\"ZW\"}]");

/***/ }),

/***/ "./src/js/import/pages/destinations.js":
/*!*********************************************!*\
  !*** ./src/js/import/pages/destinations.js ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var _data_countries__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../data/countries */ "./src/data/countries.json");
var _data_countries__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../../data/countries */ "./src/data/countries.json", 1);
// Search

var input = document.querySelector("#search-field");
var list = document.querySelector("#search-list");
input.addEventListener("keyup", complete);
list.addEventListener("click", selectWord);

function complete() {
  var val = input.value.trim().toLocaleLowerCase();
  list.style.display = "block";

  if (val.length > 1) {
    var country = _data_countries__WEBPACK_IMPORTED_MODULE_0__.filter(function (county) {
      return county.name.toLocaleLowerCase().indexOf(val) === 0;
    });

    if (country.length >= 1) {
      list.innerHTML = renderHtml(country);
    } else {
      list.innerHTML = "<li class=\"form-select__item\"><span>No results...</span></li>";
    }
  } else {
    list.innerHTML = "<li class=\"form-select__item\"><span>The list is too short...</span></li>";
  }
}

function selectWord(e) {
  e.preventDefault();
  var target = e.target;

  if (target.parentNode.nodeName === "LI") {
    input.value = target.innerHTML;
    list.style.display = "none";
  }
}

function renderHtml(arr) {
  var html = "";

  for (var i = 0; i < arr.length; i++) {
    html += "<li class=\"form-select__item\"><a href=\"#\">".concat(arr[i].name, "</a></li>");
  }

  return html;
}

$(document).on('click', function (e) {
  if (!$(e.target).closest(".search").length) {
    $("#search-list").css("display", "none");
  }

  e.stopPropagation();
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ })

/******/ });
//# sourceMappingURL=destinations.js.map