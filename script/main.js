var globalContainerCount = 0;
var windowLocalStorage = window.localStorage;
var iconSize = 25;
var swtichTempId = "";
function init()
{
	globalContainerCount = 0;
	swtichTempId = "";
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
	swtichTempId = "";
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
			globalContainerCount = parseInt(id) + 1;
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
	d3.selectAll(".item")
	.style("width",rate+"%");
}

function clickNewAccountBtn()
{
	let account = d3.select("#inputIGAccount").node().value;
	let containerId = "container" + globalContainerCount;
	generateNewAccountView(account,containerId,true);
	d3.select("#inputIGAccount").node().value = "";
	globalContainerCount = parseInt(globalContainerCount) + 1;
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
	.style("float","right")
	.attr("id","switchBtn_"+containerId)
	.attr("src","./img/icon/down-arrow.png")
	.attr("onclick","switchPosition(this.id)")
	.lower();	

	d3.select("#"+containerId).append("img")
	.style("width",iconSize+"px")
	.style("height",iconSize+"px")
	.style("float","right")
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
	d3.selectAll("#"+targetId).remove();
	var containerArr = JSON.parse(windowLocalStorage.getItem('IGPairContainer'));
	var usernameArr = JSON.parse(windowLocalStorage.getItem('IGPairUsername'));
	var indexOfTarget = containerArr.indexOf(targetId);
	usernameArr.splice(indexOfTarget, 1);
	containerArr.splice(indexOfTarget, 1);
	windowLocalStorage.setItem('IGPairUsername',JSON.stringify(usernameArr));
	windowLocalStorage.setItem('IGPairContainer',JSON.stringify(containerArr));
}

function switchPosition(switchId)
{
	var targetId = switchId.split("_")[1];
	if(swtichTempId == "")
	{
		swtichTempId = targetId;
		return;
	}
	var nodeList = d3.select("#displayField").node().childNodes;
	var nodeDomList = [];
	var betweenDomList = [];
	var tailDomList = [];
	var node1Place = null;
	var node1 = null;
	var node2Place = null;
	var node2 = null;
	for(var i in nodeList)
	{
		if(nodeList[i].id!=undefined)
			nodeDomList.push(nodeList[i]);
	}
	for(var i in nodeDomList)
	{
		if(nodeDomList[i].id == targetId || nodeDomList[i].id == swtichTempId)
		{
			if(node1Place == null)
			{
				node1Place = i;
				node1 = nodeDomList[i];
				d3.select("#"+nodeDomList[i].id).remove();
			}
			else
			{
				node2Place = i;
				node2 = nodeDomList[i];
				d3.select("#"+nodeDomList[i].id).remove();
			}
		}
		else if (node1Place != null && node2Place == null)
		{
			betweenDomList.push(nodeDomList[i]);
			d3.select("#"+nodeDomList[i].id).remove();
		}
		else if (node2Place == null)
		{
			tailDomList.push(nodeDomList[i]);
			d3.select("#"+nodeDomList[i].id).remove();
		}
	}
	d3.select("#displayField").node().appendChild(node2);
	for(var i in betweenDomList)
	{
		d3.select("#displayField").node().appendChild(betweenDomList[i]);
	}
	d3.select("#displayField").node().appendChild(node1);
	for(var i in tailDomList)
	{
		d3.select("#displayField").node().appendChild(tailDomList[i]);
	}

	//swap
	var usernameArr = JSON.parse(windowLocalStorage.getItem('IGPairUsername'));
	var temp = usernameArr[node2Place];
	usernameArr[node2Place] = usernameArr[node1Place];
	usernameArr[node1Place] = temp;
	windowLocalStorage.setItem('IGPairUsername',JSON.stringify(usernameArr));
	swtichTempId = "";
}