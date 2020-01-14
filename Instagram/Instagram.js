// ==UserScript==
// @name			Instagram
// @version			0.1
// @author          MohamedSihly
// @description		Opens original size profile pictures in new tab.
// @include			/.*instagram\.com\/(?!developer).*/
// @run-at			document-idle
// ==/UserScript==

/* NOTICE: Best used with the 'Instagram' stylesheet for Stylus by MohamedSihly. */

async function getJSON(url) {
	let response = await fetch(url),
		json = await response.json();
	return json;
}

async function openProfile(event) {
	if (event.ctrlKey || event.altKey) {
		var usr_ID = "",
			newWindow = window.open("", "_blank");

		if (this.alt || this.title) {
			var usrname;

			if (this.alt) {
				usrname = this.alt.substring(0, this.alt.indexOf("'"));
			} else if (this.classList.has("fDxYl")) {
				usrname = this.innerHTML;
			} else {
				usrname = this.title;
			}

			console.log(usrname);

			var api_response = await getJSON("https://www.instagram.com/" + usrname + "/?__a=1"),
				full_ID = await api_response.logging_page_id;
			usr_ID = full_ID.substring(full_ID.indexOf("_") + 1);
		} else {
			usr_ID = this.dataset.storyId;
		}

		console.log(usr_ID);

		var url,
			api_link = await "https://i.instagram.com/api/v1/users/" + usr_ID + "/info/",
			user_data = await getJSON(api_link);

		if (event.ctrlKey) {
			url = user_data.user.hd_profile_pic_url_info.url;
		} else if (event.altKey) {
			url = "https://www.instagram.com/" + user_data.user.username + "/";
		}

		newWindow.location.href = url;
	}
}

window.onload = function() {
	var stories = document.getElementsByClassName("ext_story_item_wrap"),
		profile_pic = document.getElementsByClassName("_6q-tv")[0],
		usrname = document.getElementsByClassName("fDxYl")[0];

	setTimeout(function() {
		for (var i = 0; i < stories.length; i++) {
			stories[i].addEventListener("click", openProfile);
		}
		if (profile_pic) {profile_pic.addEventListener("click", openProfile);}
		if (usrname) {usrname.addEventListener("click", openProfile);}
	}, 1000);
}