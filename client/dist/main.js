/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/electron/electron.ts":
/*!**********************************!*\
  !*** ./src/electron/electron.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || (function () {\n    var ownKeys = function(o) {\n        ownKeys = Object.getOwnPropertyNames || function (o) {\n            var ar = [];\n            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;\n            return ar;\n        };\n        return ownKeys(o);\n    };\n    return function (mod) {\n        if (mod && mod.__esModule) return mod;\n        var result = {};\n        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== \"default\") __createBinding(result, mod, k[i]);\n        __setModuleDefault(result, mod);\n        return result;\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst electron_1 = __webpack_require__(/*! electron */ \"electron\");\nconst path = __importStar(__webpack_require__(/*! path */ \"path\"));\nconst appInitializer_1 = __webpack_require__(/*! ./functional/appInitializer */ \"./src/electron/functional/appInitializer.ts\");\nlet win;\nfunction createWindow() {\n    win = new electron_1.BrowserWindow({\n        titleBarStyle: \"hidden\",\n        width: 1280,\n        height: 800,\n        webPreferences: {\n            preload: path.join(__dirname, \"preload.js\"),\n        },\n    });\n    win.setMenu(null);\n    win.loadFile(path.join(__dirname, \"renderer/renderer.html\"));\n    if (process.env.DEBUG) {\n        win.webContents.openDevTools({ mode: \"detach\" });\n    }\n}\nelectron_1.app.whenReady().then(async () => {\n    (0, appInitializer_1.initializeApp)();\n    createWindow();\n});\n\n\n//# sourceURL=webpack://tictactalk/./src/electron/electron.ts?");

/***/ }),

/***/ "./src/electron/functional/appInitializer.ts":
/*!***************************************************!*\
  !*** ./src/electron/functional/appInitializer.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.initializeApp = initializeApp;\nconst windowManager_1 = __webpack_require__(/*! ../manager/windowManager */ \"./src/electron/manager/windowManager.ts\");\nasync function initializeApp() {\n    await initializeManager();\n    await initializeHandler();\n}\nasync function initializeManager() {\n    await ConfigureManager.getInstance();\n    await windowManager_1.WindowManager.getInstance();\n}\nasync function initializeHandler() { }\n\n\n//# sourceURL=webpack://tictactalk/./src/electron/functional/appInitializer.ts?");

/***/ }),

/***/ "./src/electron/manager/windowManager.ts":
/*!***********************************************!*\
  !*** ./src/electron/manager/windowManager.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.WindowManager = void 0;\nconst electron_1 = __webpack_require__(/*! electron */ \"electron\");\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\nclass WindowManager {\n    constructor() {\n        this.m_window = null;\n    }\n    WindowManager() { }\n    static async getInstance() {\n        if (WindowManager.__instance == null) {\n            WindowManager.__instance = new WindowManager();\n            WindowManager.__instance.initialize();\n        }\n        return WindowManager.__instance;\n    }\n    async initialize() { }\n    async createWindow() {\n        if (this.m_window == null) {\n            this.m_window = new electron_1.BrowserWindow({\n                titleBarStyle: \"hidden\",\n                width: 1280,\n                height: 800,\n                transparent: true, // 핵심!\n                frame: false,\n                webPreferences: {\n                    preload: path_1.default.join(__dirname, \"preload.js\"),\n                },\n            });\n            this.m_window.setMenu(null);\n            this.m_window.loadFile(path_1.default.join(__dirname, \"renderer/renderer.html\"));\n        }\n        if (process.env.DEBUG) {\n            this.m_window.webContents.openDevTools({ mode: \"detach\" });\n        }\n        return this.m_window;\n    }\n    async getWindow() {\n        if (this.m_window == null) {\n            return await this.createWindow();\n        }\n        return this.m_window;\n    }\n}\nexports.WindowManager = WindowManager;\nWindowManager.__instance = null;\n\n\n//# sourceURL=webpack://tictactalk/./src/electron/manager/windowManager.ts?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/electron/electron.ts");
/******/ 	
/******/ })()
;