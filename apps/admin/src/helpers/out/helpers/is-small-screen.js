"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_browser_1 = require("./is-browser");
function isSmallScreen() {
    return (0, is_browser_1.default)() && window.innerWidth < 768;
}
exports.default = isSmallScreen;
//# sourceMappingURL=is-small-screen.js.map