function loadScript(filePath) {
	var fileref = document.createElement('script');
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", filePath);
	document.getElementsByTagName("head")[0].appendChild(fileref);
}

loadScript ("https://www.googletagmanager.com/gtag/js?id=UA-123456789-1");

$(window).madWindow("open",
{
	messageTitle: "Window Suppressed",
	messageContent: "The GDPR window has been suppressed by the cookie, and will instead call loadScripts.js. Try reloading the page!",
	theme: "info no-close",
	behavior: "bottomRight",
	closeTimeout: 3
});