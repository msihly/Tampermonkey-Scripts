// ==UserScript==
// @name            VSCO
// @version         1.0
// @author          MohamedSihly
// @description     Replaces links to post pages with source image links.
// @include         /.*vsco\.co\/.*/
// @grant           none
// @run-at			document-start
// ==/UserScript==

/* NOTICE: Best used with the 'VSCO' stylesheet for Stylus by MohamedSihly. */

function swapLink(targetElement) {
	var source = targetElement.getElementsByTagName("source");
	if (source.length == 0) {source = targetElement.getElementsByTagName("img");}
	source = source[0].src;

	var link;
	if (targetElement.classList.contains("grid-item")) {
		link = targetElement.getElementsByTagName("a")[0];
	} else if (targetElement.tagName === "A") {
		link = targetElement;
	}

	if (source.match(/(.webm|.gif|.mp4)/g)) {
		link.href = source;
	} else {
		link.href = source.substring(0, source.indexOf("?w="));
	}
}

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var addedNodes = mutation.addedNodes
		try {
			if (addedNodes.length > 0 && new Set([HTMLElement.prototype, HTMLAnchorElement.prototype, HTMLDivElement.prototype]).has(Object.getPrototypeOf(addedNodes[0]))) {
				var class1 = addedNodes[0].getElementsByClassName("grid-item"),
					class2 = addedNodes[0].getElementsByClassName("MediaImage");
				if (class1.length > 0 || class2.length > 0) {
					console.log(mutation);
					swapLink(addedNodes[0]);
				}
			}
		} catch (error) {
			console.error([error.message, mutation]);
		}
	});
});

var targetNode = document,
	config = { childList: true, subtree: true };

observer.observe(targetNode, config);