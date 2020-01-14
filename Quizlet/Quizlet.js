// ==UserScript==
// @name        Quizlet
// @version     0.1
// @author          MohamedSihly
// @include     /.*quizlet\.com\/.*/
// @grant		none
// ==/UserScript==

window.onload = function() {
	var cards = document.getElementsByClassName("has-definitionText");
	for (let i = 0; i < cards.length; i++) {
		cards[i].classList.add("is-showing");
	}
}