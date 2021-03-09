var globalContainerCount = 0;
function init()
{
	globalContainerCount = 0;
	setUpEnterKeyBinding("inputIGAccount","newAccountBtn");
	setUpEnterKeyBinding("inputScalingSize","scalingBtn");
}
init();

function LoadInstagramFeed(username,containerId)
{
	$.instagramFeed({
                'username': username,
                'container': "#"+containerId,
                'display_profile': true,
                'display_biography': false,
                'display_gallery': true,
                'display_captions': true,
                'max_tries': 8,
                'callback': null,
                'styling': true,
                'items': 1,
                'items_per_row': 1,
                'margin': 1,
                'lazy_load': true,
                'on_error': console.error
            });
	d3.select("#"+containerId).attr("background",getRandomLightColor());
	modifyItemScaling();
	setCookie(username_containerId, "Test", 3 );
	console.log("CookieTest",getCookie(username_containerId));
}

function modifyItemScaling()
{
	let size = d3.select("#inputScalingSize").node().value;
	let rate = Math.floor(100/size);
	d3.select(".item")
	.attr("width",rate+"%");
}

function newAccount()
{
	let account = d3.select("#inputIGAccount").node().value;
	let containerId = "container" + globalContainerCount;
	d3.select("#displayField").append("div")
	.attr("id",containerId)
	.attr("class","item");
	LoadInstagramFeed(account,containerId);

	d3.select("#inputIGAccount").node().value = "";
	globalContainerCount += 1;
}

function getRandomLightColor()
{
	return 'rgb(' + (Math.floor((256-229)*Math.random()) + 230) + ',' + 
            (Math.floor((256-229)*Math.random()) + 230) + ',' + 
            (Math.floor((256-229)*Math.random()) + 230) + ')'; 
}

function setUpEnterKeyBinding(inputId,btnId)
{
	var input = document.getElementById(inputId);
	input.addEventListener("keyup", function(event) {
	  if (event.keyCode === 13) {
	    event.preventDefault();
	    document.getElementById(btnId).click();
	  }
	});
}

//#region : Cookie basic function -- refer w3c
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//#endregion : Cookie basic function