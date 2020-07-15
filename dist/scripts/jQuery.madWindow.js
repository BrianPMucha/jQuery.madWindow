/**********************************************************************\
*
*	jQuery.madWindow
*	----------------------
*	version: 1.0.0
*	date: 2020/07/15
*	license: GPL-3.0-or-later
*	copyright (C) 2020 Brian Patrick Mucha
*
*	This lightweight (8.47k) plugin provides robust messaging windows for
*	alerts, dialogs, lightboxes and more. It includes an assortment of
*	behaviors to control the open, display and close functionality,
*	and extensable themes to change the appearance.
*
*	The content can be passed for simple message windows, or madWindow can
*	be bound to an existing DIV for complex lightboxes, videos, or web-forms.
*
\**********************************************************************/

/**********************************************************************\
*
*	messageTitle: null
*	The title text to display when not bound to an existing div.
*
*	messageContent: null
*	The message text to display when not bound to an existing div.
*
*	messageButtonShow: false
*	Whether to add a close button when not bound to an existing div.
*
*	messageButtonLabel: "Ok"
*	The value of the close button when not bound to an existing div.
*
*	theme: "default"
*	Premade packages to customize the look and feel of the window.
*
*	behavior: "autoCenter"
*	Used to customize the open, display and close animations.
*
*	cookieName: "mad-cookie"
*	The identifier used for the cookie used to record a dismissed window.
*
*	expireDays: 0
*	The number of days that the dismissed window cookie persists.
*
*	width: 400
*	The maximum width of the notice.
*
*	closePadding: 0
*	Extra space left of the notice to accomodate a hanging closebox.
*
*	speed: 500
*	Number of miliseconds for the open and close animations.
*
*	modal: false
*	Show a dark overlay under the notice and over the page.
*
*	modalClose: true
*	Allow clicks on the background to close the notice.
*
*	modalSpeed: 250
*	Number of miliseconds for the modal overlay animation.
*
*	disableScroll: false
*	Disable scrolling of the page under the notice.
*
*	disableMethod: "auto"
*	The method used to disable scrolling.
*
*	openDelay: 0
*	Number of seconds to delay opening the notice.
*
*	closeTimeout: 0
*	Number of seconds until an open notice closes itself.
*
*	openCallback: function() {}
*	A function to execute upon notice open.
*
*	closeCallback: function() {}
*	A function to execute upon notice close.
*
\**********************************************************************/

(function ($) {

	var settings = {};

	var timeoutCallback = [];
	var timeoutTimer = [];

	var defaults = {
		messageTitle: null,
		messageContent: null,
		messageButtonShow: false,
		messageButtonLabel: "Ok",
		theme: "default",
		behavior: "autoCenter",
		cookieName: "mad-cookie",
		expireDays: 0,
		width: 400,
		closePadding: 0,
		speed: 500,
		modal: false,
		modalClose: false,
		modalSpeed: 250,
		disableScroll: false,
		disableMethod: "auto",
		openDelay: 0,
		closeTimeout: 0,
		openCallback: function() {},
		closeCallback: function() {}
	};

	var methods = {

		open: function (options) {

			settings = $.extend({}, defaults, options);

			return this.each(function ()
			{

				// Create windowObj for notices.
				var windowObj;
				if ( this === this.window && settings.messageContent )
				{
					var useButton = "";
					if(settings.messageButtonShow)
					{
						useButton = "<input value=\"" + settings.messageButtonLabel + "\" title=\"" + settings.useButton + "\" type=\"button\" class=\"mad-window-closeButton\" />";
					}
					var windowHTML =
					"<div class=\"container\">" +
						"<div class=\"mad-window-title\">" + settings.messageTitle + "</div>" +
						"<div class=\"mad-window-closebox\"></div>" +
						"<div class=\"mad-window-content\">" + settings.messageContent + "</div>" +
						useButton +
					"</div>";

					var tempObj = $("<div/>",
					{
						"id": "mad-window-" + Date.now(),
						"class": "mad-window " + settings.theme,
						"height": "auto",
						"css": { "display": "none" }
					})
					.html(windowHTML)
					.prependTo($("body"));

					windowObj = tempObj[0];

				} else {
					windowObj = this;
				}

				// Move to the top level of the DOM for absolute positioning.
				if ( $(windowObj).is("div") && !$(windowObj).parent().is("body") )
				{
					$(windowObj).appendTo(document.body);
				}

				// Save settings
				$(windowObj).data("settings", settings);

				// Open the window.
				var shouldHide = utilities.readCookie(settings.cookieName);
				if (shouldHide !="Hide")
				{
					var noticeTimer = $.isNumeric(settings.openDelay) ? settings.openDelay : 0;
					setTimeout(function(){ handlers.doOpen(windowObj, settings) }, noticeTimer * 1000);
				}

			});
		},

		close: function () {
			return this.each(function ()
			{

				// Retrieve settings
				settings = $(this).data("settings");

				handlers.doClose(this, settings);

			});
		}

	};

	var handlers = {

		doOpen: function (windowObj, settings) {

			// Build the notice.
			if (windowObj)
			{
				$(windowObj).addClass(settings.theme);
				$(windowObj).find(".mad-window-closebox").one('click', function() { $("#" + windowObj.id ).madWindow("close") } );
				$(windowObj).find(".mad-window-closeButton").one('click', function() { $("#" + windowObj.id ).madWindow("close") } );
				$(windowObj).find(".mad-window-cancelButton").one('click', function() { $("#" + windowObj.id ).madWindow("close") } );
			}

			// Disable page scrolling.
			if (settings.disableScroll)
			{
				if(settings.disableMethod=="fixed") {
					$("html").css({ "position": "fixed", "overflow-y": "scroll", "width": "100%"});
				} else if(settings.disableMethod=="overflow") {
					$("html").css({ "overflow": "hidden" });
				} else if(settings.openDelay==0) {
					$("html").css({ "position": "fixed", "overflow-y": "scroll", "width": "100%"});
				} else {
					$("html").css({ "overflow": "hidden" });
				}
			}

			// Create the overlay.
			if (settings.modal)
			{
					behaviors.overlay("open", windowObj);
					$(window).on("resize.overlay", function() { behaviors.overlay("resize", windowObj); });
			}

			// Set timeoutTimer.
			if (settings.closeTimeout)
			{
				timeoutCallback.push(windowObj.id);
				timeoutTimer.push(windowObj.id);
				timeoutCallback[windowObj.id] = function() { timeoutTimer[windowObj.id] = setTimeout(function(){ handlers.doClose(windowObj, settings); }, settings.closeTimeout * 1000); };
			}

			// Execute the open behavior.
			switch (settings.behavior)
			{
				case "autoCenter":
					behaviors.autoCenter("open", windowObj, timeoutCallback[windowObj.id]);
					$(window).on("resize.autoCenter", function() { behaviors.autoCenter("resize", windowObj); });
					break;
				case "bottomCenter":
					behaviors.bottomCenter("open", windowObj, timeoutCallback[windowObj.id]);
					$(window).on("resize.bottomCenter", function() { behaviors.bottomCenter("resize", windowObj); });
					break;
				case "topRight":
					behaviors.topRight("open", windowObj, timeoutCallback[windowObj.id]);
					$(window).on("resize.topRight", function() { behaviors.topRight("resize", windowObj); });
					break;
				case "bottomRight":
					behaviors.bottomRight("open", windowObj, timeoutCallback[windowObj.id]);
					$(window).on("resize.bottomRight", function() { behaviors.bottomRight("resize", windowObj); });
					break;
				case "topLeft":
					behaviors.topLeft("open", windowObj, timeoutCallback[windowObj.id]);
					$(window).on("resize.topLeft", function() { behaviors.topLeft("resize", windowObj); });
					break;
				case "bottomLeft":
					behaviors.bottomLeft("open", windowObj, timeoutCallback[windowObj.id]);
					$(window).on("resize.bottomLeft", function() { behaviors.bottomLeft("resize", windowObj); });
					break;
				default:
					throw 'Unexpected style configuration.';
			}

			// Execute Callback.
			if (typeof settings.openCallback == "function") {
				settings.openCallback.call(windowObj);
			}

		},

		doClose: function(windowObj, settings) {

			// Execute the close behavior.
			switch (settings.behavior)
			{
				case "autoCenter":
					behaviors.autoCenter("close", windowObj);
					$(window).off("resize.autoCenter");
					break;
				case "bottomCenter":
					behaviors.bottomCenter("close", windowObj);
					$(window).off("resize.bottomCenter");
					break;
				case "topRight":
					behaviors.topRight("close", windowObj);
					$(window).off("resize.topRight");
					break;
				case "bottomRight":
					behaviors.bottomRight("close", windowObj);
					$(window).off("resize.bottomRight");
					break;
				case "topLeft":
					behaviors.topLeft("close", windowObj);
					$(window).off("resize.topLeft");
					break;
				case "bottomLeft":
					behaviors.bottomLeft("close", windowObj);
					$(window).off("resize.bottomLeft");
					break;
				default:
					throw 'Unexpected style configuration.';
			}

			// Destroy the overlay.
			if (settings.modal)
			{
				behaviors.overlay("close", windowObj);
				$(window).off("resize.overlay");
			}

			// Restore scrolling.
			if (settings.disableScroll)
			{
				if(settings.disableMethod=="fixed") {
					$("html").css({ "position": "relative"});
				} else if(settings.disableMethod=="overflow") {
					$("html").css({ "overflow": "" });
				} else if(settings.openDelay==0) {
					$("html").css({ "position": "relative"});
				} else {
					$("html").css({ "overflow": "" });
				}
			}

			// Store Dismissed Cookie
			if (settings.expireDays)
			{
				utilities.createCookie(settings.cookieName,"Hide", settings.expireDays);
			}

			// Execute Callback.
			if (typeof settings.closeCallback == "function") {
				settings.closeCallback.call(windowObj);
			}

		}

	};

	var behaviors = {

		overlay: function (operation, windowObj) {

			switch (operation)
			{

				case "open":
				{
					$("<div/>",
					{
						"id": "mad-window-overlay-" + windowObj.id,
						"class": settings.modalClose ? "mad-window-overlay clickable " + settings.theme : "mad-window-overlay " + settings.theme,
						"height": $(document).height(),
						"width": $(document).width(),
						"css": { "display": "none" },
						click: function() { if(settings.modalClose) { $(windowObj).madWindow("close"); } }
					})
					.prependTo($("body"))
					.fadeIn(settings.modalSpeed);
				}
				break;

				case "close":
				{
					$("#mad-window-overlay-" + windowObj.id)
						.fadeOut(settings.modalSpeed)
						.delay(settings.modalSpeed)
						.queue( function () { $("#mad-window-overlay-" + windowObj.id).remove() } );
				}
				break;

				case "resize":
				{
					$("#mad-window-overlay-" + windowObj.id)
						.css("width", $(document).width() + "px")
						.css("height", $(document).height() + "px");
				}
				break;

			}
		},

		autoCenter: function (operation, windowObj, callback) {

			$(windowObj).css("width", utilities.setWidth(settings));
			var noticeTop = ( ($(window).height() - $(windowObj).outerHeight()) / 2) + $(window).scrollTop();
			var noticeLeft = ( ($(window).width() - $(windowObj).outerWidth()) / 2) + $(window).scrollLeft()

			switch (operation)
			{

				case "open":
				{
					$(windowObj)
						.stop()
						.css("display", "none")
						.css("position", "absolute")
						.css("top", noticeTop)
						.css("left", noticeLeft - (settings.closePadding/2) )
						.fadeIn(settings.speed, callback);
				}
				break;

				case "close":
				{
					clearTimeout(timeoutTimer[windowObj.id]);
					$(windowObj)
						.stop()
						.fadeOut(settings.speed);
				}
				break;

				case "resize":
				{
					$(windowObj)
						.css("top", noticeTop)
						.css("left", noticeLeft - (settings.closePadding/2) );
				}
				break;

			}
		},

		bottomCenter: function (operation, windowObj, callback) {

			$(windowObj).css("width", utilities.setWidth(settings));
			var noticeBottom = ( $(windowObj).outerHeight() + 30 ) * -1;
			var noticeLeft = ( ($(window).width() - $(windowObj).outerWidth()) / 2) + $(window).scrollLeft();

			switch (operation)
			{

				case "open":
				{
					$(windowObj)
						.stop()
						.css("display", "none")
						.css("position", "fixed")
						.css("bottom", noticeBottom)
						.css("left", noticeLeft - (settings.closePadding/2) )
						.fadeIn()
						.animate({"bottom": 20}, settings.speed, callback);
				}
				break;

				case "close":
				{
					clearTimeout(timeoutTimer[windowObj.id]);
					$(windowObj)
						.stop()
						.css("bottom", 20)
						.animate({"bottom": noticeBottom}, settings.speed)
						.delay(settings.speed)
						.fadeOut(settings.speed);
				}
				break;

				case "resize":
				{
					$(windowObj)
						.css("bottom", 20)
						.css("left", noticeLeft - (settings.closePadding/2) );
				}
				break;

			}
		},

		topRight: function (operation, windowObj, callback) {

			$(windowObj).css("width", utilities.setWidth(settings));
			var noticeBottom = ( $(windowObj).outerHeight() + 30 ) * -1;
			var noticeRight = ( ($(windowObj).outerWidth()) + 30) * -1;

			switch (operation)
			{
				case "open":
				{
					$(windowObj)
						.stop()
						.css("display", "none")
						.css("position", "fixed")
						.css("top", 20)
						.css("right", noticeRight)
						.fadeIn()
						.animate({"right": 20}, settings.speed, callback);
				}
				break;

				case "close":
				{
					clearTimeout(timeoutTimer[windowObj.id]);
					$(windowObj)
						.stop()
						.css("right", 20)
						.animate({"right": noticeRight}, settings.speed)
						.delay(settings.speed)
						.fadeOut(settings.speed);
				}
				break;

				case "resize":
				{
					$(windowObj)
						.css("top", 20)
						.css("right", 20);
				}
				break;

			}
		},

		bottomRight: function (operation, windowObj, callback) {

			$(windowObj).css("width", utilities.setWidth(settings));
			var noticeBottom = ( $(windowObj).outerHeight() + 30 ) * -1;
			var noticeRight = ( ($(windowObj).outerWidth()) + 30) * -1;

			switch (operation)
			{
				case "open":
				{
					$(windowObj)
						.stop()
						.css("display", "none")
						.css("position", "fixed")
						.css("bottom", 20)
						.css("right", noticeRight)
						.fadeIn()
						.animate({"right": 20}, settings.speed, callback);
				}
				break;

				case "close":
				{
					clearTimeout(timeoutTimer[windowObj.id]);
					$(windowObj)
						.stop()
						.css("right", 20)
						.animate({"right": noticeRight}, settings.speed)
						.delay(settings.speed)
						.fadeOut(settings.speed);
				}
				break;

				case "resize":
				{
					$(windowObj)
						.css("bottom", 20)
						.css("right", 20);
				}
				break;

			}
		},

		topLeft: function (operation, windowObj, callback) {

			$(windowObj).css("width", utilities.setWidth(settings));
			var noticeBottom = ( $(windowObj).outerHeight() + 30 ) * -1;
			var noticeLeft = ( ($(windowObj).outerWidth()) + 30) * -1;

			switch (operation)
			{
				case "open":
				{
					$(windowObj)
						.stop()
						.css("display", "none")
						.css("position", "fixed")
						.css("top", 20)
						.css("left", noticeLeft)
						.fadeIn()
						.animate({"left": 20}, settings.speed, callback);
				}
				break;

				case "close":
				{
					clearTimeout(timeoutTimer[windowObj.id]);
					$(windowObj)
						.stop()
						.css("left", 20)
						.animate({"left": noticeLeft}, settings.speed)
						.delay(settings.speed)
						.fadeOut(settings.speed);
				}
				break;

				case "resize":
				{
					$(windowObj)
						.css("top", 20)
						.css("left", 20);
				}
				break;

			}
		},

		bottomLeft: function (operation, windowObj, callback) {

			$(windowObj).css("width", utilities.setWidth(settings));
			var noticeBottom = ( $(windowObj).outerHeight() + 30 ) * -1;
			var noticeLeft = ( ($(windowObj).outerWidth()) + 30) * -1;

			switch (operation)
			{
				case "open":
				{
					$(windowObj)
						.stop()
						.css("display", "none")
						.css("position", "fixed")
						.css("bottom", 20)
						.css("left", noticeLeft)
						.fadeIn()
						.animate({"left": 20}, settings.speed, callback);
				}
				break;

				case "close":
				{
					clearTimeout(timeoutTimer[windowObj.id]);
					$(windowObj)
						.stop()
						.css("left", 20)
						.animate({"left": noticeLeft}, settings.speed)
						.delay(settings.speed)
						.fadeOut(settings.speed);
				}
				break;

				case "resize":
				{
					$(windowObj)
						.css("bottom", 20)
						.css("left", 20);
				}
				break;

			}
		}

	};

	var utilities = {

		setWidth: function( settings )
		{
			var noticeWidth = ( settings.width=="auto" ? 935 : settings.width );
			var windowWidth = $(window).width();
			if (windowWidth < (noticeWidth + settings.closePadding + 60) )
			{
				return windowWidth - settings.closePadding - 60;
			} else {
				return noticeWidth - settings.closePadding;
			}
		},

		createCookie: function(name, value, days)
		{
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			} else {
				var expires = "";
			}
			document.cookie = name+"="+value+expires+"; path=/";
		},

		readCookie: function(name)
		{
			var nameEQ = name + "=";
			var ca = document.cookie.split(";");
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==" ") c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		}

	};

	$.fn.madWindow = function (method, options) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " + method + " does not exist on jQuery.madWindow");
		}

	};

})(jQuery);