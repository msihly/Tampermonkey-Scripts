// ==UserScript==
// @name			Youtube-DL
// @version			0.1
// @author          MohamedSihly
// @description		Generate links for Youtube-DLG.
// @include			/.*youtube\.com\/(watch|playlist).*/
// ==/UserScript==

/* NOTICE: The 'Youtube-DL' stylesheet for Stylus by MohamedSihly is required to use this script. */

var outputList = [],
    templateCheckbox = document.createElement("label"),
	outputBox = document.createElement("p");

outputBox.classList.add("output-box", "hidden");
templateCheckbox.classList.add("checkbox-label");
templateCheckbox.innerHTML = "<input type='checkbox'><span class='checkbox'></span>";

function changeOutput(checkbox, link) {
	if (checkbox.checked) {outputList.push(link);}
	else {outputList.splice(outputList.indexOf(link), 1);}
	outputBox.innerHTML = outputList.join("<br>");
	outputBox.classList.toggle("hidden", outputList.length < 1);
}

function copy(targetValue) {
    var range = document.createRange(),
        tempNode = document.createElement("div");
    tempNode.innerHTML = targetValue;
    document.body.appendChild(tempNode);

	range.selectNodeContents(tempNode);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
    document.execCommand("copy");

    console.log("Copied to clipboard: " + range.toString());
    tempNode.remove();
}

function createCheckboxes(playlist, sidebar) {
	sidebar.appendChild(outputBox);
	outputBox.addEventListener("click", function() {copy(outputBox.innerHTML);});

	playlist.forEach(function(element, index) {
		let container = element.appendChild(templateCheckbox.cloneNode(true)),
			checkbox = container.getElementsByTagName("input")[0],
			link = element.getElementsByTagName("a")[0].href;
		link = link.substring(0, link.indexOf("&"));
		checkbox.addEventListener("change", changeOutput.bind(event, checkbox, link));
	});
}

function createCopyButton(parent, refChild) {
    var button = document.createElement("div"),
        link = window.location.href;

    link = link.indexOf("&") > 0 ? link.substring(0, link.indexOf("&")) : link;

    button.classList.add("button");
    button.id = "copy-url-button";
    button.innerHTML = "COPY URL";
    button.dataset.link = link;
    button.addEventListener("click", function() {copy(button.dataset.link);});

    parent.insertBefore(button, refChild);
}

window.onload = function() {
	if (window.location.href.indexOf("/playlist?") !== -1) {
		var playlist = document.querySelectorAll("#content"),
			sidebar = document.getElementsByClassName("ytd-playlist-sidebar-renderer")[0];
		document.body.addEventListener("yt-navigate-finish", createCheckboxes(playlist, sidebar));
	} else if (window.location.href.indexOf("/watch?") !== -1) {
        window.addEventListener("yt-navigate-finish", function() {
            setTimeout(function() {
                var previousNode = document.getElementById("copy-url-button");
                if (previousNode) {previousNode.remove();}
                var parent = document.querySelector("#meta-contents #top-row"),
				    refChild = document.querySelector("#meta-contents #subscribe-button");
                createCopyButton(parent, refChild);
            }, 200);
		});
	}
}