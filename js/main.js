window.daltonTab = {
	subjects: []
};



window.daltonTab.addEventToList = function(ev, list) {
	var tag = window.utils.getPrefix(ev.name);
	var name = ev.name.split(" ");
	name.splice(0, 1);
	name = name.join(" ");
	var done = (ev.done == 1 ? true : false);

	if (name.trim() == "") {
		return;
	}

	var $item = $('<li></li>');
		if (done) {
			$item.addClass("daltonTab-done");
		}
		var $name = $('<h4></h4>');
			$name.text(name);
		$item.append($name);

		var $lineTwo = $('<h4></h4>');
			var $tag = $('<span></span>');
				$tag.addClass("first-word");
				if (tag.toLowerCase() == "read") {
					tag = tag + "ing";
				}
				$tag.addClass(window.utils.getPrefixClass(tag));

				$tag.text(tag);
			$lineTwo.append($tag);

			var $subject = $('<span></span>');
				$subject.text(" in " + window.daltonTab.subjects[ev.subject].name);
			$lineTwo.append($subject);

			var $due = $('<span></span>');
				var keyword = "due";
				if (tag.toLowerCase() == "test" || tag.toLowerCase() == "exam" || tag.toLowerCase() == "midterm" || tag.toLowerCase() == "quiz" || tag.toLowerCase() == "ica" || tag.toLowerCase() == "lab") {
					keyword = "on";
				}
				var dueText = window.utils.formatDate_pretty(moment(ev.due).add(1, "day").toDate());
				if (moment(ev.due).add(1, "day").week() == moment().week()) {
					dueText = window.utils.getDayOfWeek(moment(ev.due).add(1, "day").day());
				}
				$due.text(" " + keyword + " " + dueText);
			$lineTwo.append($due);
		$item.append($lineTwo);
	$("#hw" + list).append($item);
};
window.daltonTab.findNextDay = function(offset) {
	var retVal = moment(); //moment().add("days", offset);
	if (retVal.day() == 6) {
		// don't start on Saturday
		retVal.add(1, "day");
	}
	for (var i = 0; i < offset; i++) {
		retVal.add(1, "day"); //add a day
		// is it a Saturday?
		if (retVal.day() == 6) {
			retVal.add(2, "day"); // skip the weekend
		}
	}
	return retVal.toDate();
};
window.daltonTab.loadDate = function(date, list) {
	console.log(date);
	for (var subjectIndex in window.daltonTab.subjects) {
		window.planhub.get("planner/events/get/" + window.utils.formatDate_api(date) + "/" + subjectIndex, function(data) {
			var ev = data.events;
			//window.daltonTab.loadStep();
			if (ev.length == 0) {
				return;
			}
			for (var evIndex in ev) {
				var evObj = {
					name: ev[evIndex].text,
					due: new Date(data.date),
					subject: ev[evIndex].sectionIndex,
					done: ev[evIndex].done
				};
				window.daltonTab.addEventToList(evObj, list);
			};
		});
	}
};

$(document).ready(function() {
	var timeUpdFunc = function() {
		$(".current-time").text(moment().format("h:mm A"));
		$(".current-date").text(moment().format("MMMM Do, YYYY"));
	};
	timeUpdFunc();
	setInterval(timeUpdFunc, 1000);

	$.get("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US", function(response) {
		var url = "https://www.bing.com" + response.images[0].url;
		$("#par").parallax({ imageSrc: url, bleed: 20, positionY: "0px" });
		$("#par").addClass("imageLoaded");
		$("#section1").addClass("imageLoaded");
		//$("body").css("background-image", "url(" + url + ")");
	});

	$("#settingsBtn").click(function() {
		$("#settingsModal").modal();
	});

	$("#newTabDefault").click(function() {
		window.location.href = "chrome-search://local-ntp/local-ntp.html"
	});
	$("#hwButton").smoothScroll();

	$("#schedulesAccountBtn").click(function() {
		var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
		var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

		width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		var w = 600;
		var h = 400;

		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 2) - (h / 2)) + dualScreenTop;
		window.location.href = chrome.runtime.getURL("schedulesSignIn.html");
	});

	chrome.storage.sync.get(["schedulesLogin"], function(response) {
		if (response.schedulesLogin != undefined) {
			$("#schedulesSignIn").removeClass("hidden");
			$("#schedulesSignedIn").addClass("hidden");
			$("#schedulesAccountName").text(response.schedulesLogin.username);
		}
	});

	$("#schedulesLogOut").click(function() {
		chrome.storage.remove("schedulesLogin", function() {
			window.location.reload();
		});
	});

	window.coursesLib.checkLoggedIn(function(response) {
		if (!response.isLoggedIn) {
			$("#classes-warning").html('<i class="fa fa-exclamation-circle"></i> Please log in <a href="http://courses.dalton.org">here</a>.');
		} else {
			window.coursesLib.getCourseList(function(response) {
				for (var couyncrseIndex in response.classes) {
					var course = response.classes[courseIndex];
					console.log(course);
					var $element = $("<li></li>");
						$element.html('<a href="' + course.url + '" style="color:white">' + course.name + '</a>');
					$("#courses").append($element);
				}
			});
		}

		var easter_egg = new Konami();
		easter_egg.code = function() {
			swal("Unexpected T_PAAMAYIM_NEKUDOTAYIM!", "MWAHHHAHAHAHAHAHAHAH\nConfused? Search on...\n This product uses Sapi, Papi, Capy, Wapi", "warning")
		}
		easter_egg.load();
	});

	window.planhub.get("features/get/", function(data) {
		console.log(data);
		if (data.status == "error") {
			$("#hw-warning").html('<i class="fa fa-exclamation-circle"></i> Sign into PlanHub to view your homework.');
			return;
		}
		if (data.features.indexOf("hwView") == -1) {
			$("#hw-warning").html('<i class="fa fa-exclamation-circle"></i> Enable <a href="https://planhub.me/app#hwView">Homework View</a> to see your homework here.');
			return;
		}

		window.planhub.get("planner/sections/get/", function(data) {
			for (var i = 0; i < data.sections.length; i++) {
				var itm = data.sections[i];
				window.daltonTab.subjects[itm.sectionIndex] = itm;
			};
			window.daltonTab.loadDate(window.daltonTab.findNextDay(1), "Tomorrow", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(2), "Soon", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(3), "Soon", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(4), "Soon", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(5), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(6), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(7), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(8), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(9), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(10), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(11), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(12), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(13), "Longterm", function() {

			});
			window.daltonTab.loadDate(window.daltonTab.findNextDay(14), "Longterm", function() {

			});
		});
	});
	setTimeout(function() {
		$(window).trigger('resize');
	}, 100)
});

$(document).on("load", function() {

});
