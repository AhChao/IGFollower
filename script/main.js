var globalContainerCount = 0;
var windowLocalStorage = window.localStorage;
var iconSize = 30;
function init()
{
	globalContainerCount = 0;
	setUpEnterKeyBinding("inputIGAccount","newAccountBtn");
	setUpEnterKeyBinding("inputScalingSize","scalingBtn");
	loadAccountsWithLocalStorage();
}
init();

function clickResetAccountBtn()
{
	d3.select("#displayField").node().innerHTML = "";
	windowLocalStorage.removeItem("IGPairUsername");
	windowLocalStorage.removeItem("IGPairContainer");
	globalContainerCount = 0;
}

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
	d3.select("#"+containerId).style("background",getRandomLightColor());
	modifyItemScaling();
}

function loadAccountsWithLocalStorage()
{
	var usernameStr = windowLocalStorage.getItem('IGPairUsername');
	var containerStr = windowLocalStorage.getItem('IGPairContainer');
	if(usernameStr == null || containerStr == null)
		return;
	var usernameArr = JSON.parse(usernameStr);
	var containerArr = JSON.parse(containerStr);
	for(var id in containerArr)
	{
		generateNewAccountView(usernameArr[id],containerArr[id],false);
		if(id == containerArr.length-1)
		{
			globalContainerCount = id + 1;
		}
	}
}

function concatArrayWithString(originString,insertString)
{
	if(originString == null)
		return "[\""+insertString+"\"]";
	return originString.split("]")[0]+",\""+insertString+"\"]";
}

function modifyItemScaling()
{
	let size = d3.select("#inputScalingSize").node().value;
	let rate = Math.floor(100/size);
	d3.select(".item")
	.style("width",rate+"%");
}

function clickNewAccountBtn()
{
	let account = d3.select("#inputIGAccount").node().value;
	let containerId = "container" + globalContainerCount;
	generateNewAccountView(account,containerId,true);
	d3.select("#inputIGAccount").node().value = "";
	globalContainerCount += 1;
}

function generateNewAccountView(account,containerId,needToRecordInStorage)
{
	d3.select("#displayField").append("div")
	.attr("id",containerId)
	.attr("class","item");

	LoadInstagramFeed(account,containerId);
	if(needToRecordInStorage)
	{
		windowLocalStorage.setItem('IGPairUsername', concatArrayWithString(windowLocalStorage.getItem('IGPairUsername'),account));
		windowLocalStorage.setItem('IGPairContainer', concatArrayWithString(windowLocalStorage.getItem('IGPairContainer'),containerId));
	}

	d3.select("#"+containerId).append("img")
	.style("width",iconSize+"px")
	.style("height",iconSize+"px")
	.style("position","relative")
	.style("top","0px")
	.style("right","0px")
	.attr("id","switchBtn_"+containerId)
	.attr("src","./img/icon/down-arrow.png")
	.lower();	

	d3.select("#"+containerId).append("img")
	.style("width",iconSize+"px")
	.style("height",iconSize+"px")
	.style("position","relative")
	.style("top","0px")
	.style("right","0px")
	.attr("id","closedBtn_"+containerId)
	.attr("src","./img/icon/cancel.png")
	.attr("onclick","removeMonitoringAccount(this.id)")
	.lower();
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

function removeMonitoringAccount(closedBtnId)
{
	var targetId = closedBtnId.split("_")[1];
	d3.removeItem("#"+targetId);
}