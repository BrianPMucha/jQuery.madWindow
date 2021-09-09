# jQuery.madWindow

This lightweight (8.532 KB) plugin provides robust messaging windows for alerts, dialogs, lightboxes and more. It includes an assortment of behaviors to control the open, display and close functionality, and extensible themes to change the appearance.

The content can be passed for simple message windows, or madWindow can be bound to an existing DIV for complex lightboxes, videos, or web-forms.


### Configuration Examples
```javascript
/* Pass content using message options. */
$(window).madWindow("open",
{
	messageTitle: "Aenean nec turpis neque.",
	messageContent: "Aliquam a enim felis. Mauris eleifend ipsum vel felis suscipit et rhoncus turpis tristique."
});

/* Bind to An existing DIV for content. */
$("#myWindow_1").madWindow("open",
{
	theme: "default hanging-close",
	behavior: "autoCenter",
	cookieName: "mad-cookie_1",
	expireDays: 30,
	width: 600,
	closePadding: 15,
	modal: true,
	openDelay: 5
});
```
### Options

Option | Description
------ | -------------
**messageTitle**: null | The title text to display when not bound to an existing div.
**messageContent**: null | The message text to display when not bound to an existing div.
**messageButtonShow**: false | Whether to add a close button when not bound to an existing div.
**messageButtonLabel**: "Ok" | The value of the close button when not bound to an existing div.
**theme**: "default" | Premade packages to customize the look and feel of the window.
**behavior**: "autoCenter" | Used to customize the open, display and close animations.
**cookieName**: "mad-cookie" | The identifier used for the cookie used to record a dismissed window.
**cookieDomain**: null | The domain that can access the cookie used to record a dismissed window.
**expireDays**: 0 | The number of days that the dismissed window cookie persists.
**width**: 400 | The maximum width of the notice.
**closePadding**: 0 | Extra space left of the notice to accomodate a hanging closebox.
**speed**: 500 | Number of miliseconds for the open and close animations.
**modal**: false | Show a dark overlay under the notice and over the page.
**modalClose**: true | Allow clicks on the background to close the notice.
**modalSpeed**: 250 | Number of miliseconds for the modal overlay animation.
**disableScroll**: false | Disable scrolling of the page under the notice.
**disableMethod**: "auto" | The method used to disable scrolling.
**openDelay**: 0 | Number of seconds to delay opening the notice.
**closeTimeout**: 0 | Number of seconds until an open notice closes itself.
**openCallback**: function() {} | A function to execute upon notice open.
**closeCallback**: function() {} | A function to execute upon notice close. 
**hiddenCallback**: function() {} | A function to execute if the window has been hidden by the cookie. 
