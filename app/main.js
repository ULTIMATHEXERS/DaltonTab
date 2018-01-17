import { h, render, Component } from "preact";

import analytics from "analytics.js";

import EndOfYearModal from "other/EndOfYearModal.jsx";
import MHSConnect from "other/MHSConnect.jsx";

import SettingCheckbox from "settings/SettingCheckbox.jsx";

import App from "App.jsx";

// window.onload = function() {
// 	render(h(App, {}), document.querySelector("body"));
// };

window.preact = {
	Component: Component,
	h: h,
	render: render
};

export default {
	analytics: analytics,
	other: {
		EndOfYearModal: EndOfYearModal,
		MHSConnect: MHSConnect
	},
	settings: {
		SettingCheckbox: SettingCheckbox
	},

	h: h,
	render: render
};