var globalContainerCount = 0;
var windowLocalStorage = window.localStorage;
var iconSize = 25;
var swtichTempId = "";
var settings ={
	isDisplayProfile : null,
	isDisplayBiography : null,
	itemPerScope : null,
	ItemPerRow : null
};
function init()
{
	globalContainerCount = 0;
	swtichTempId = "";
	setUpEnterKeyBinding("inputIGAccount","newAccountBtn");
	setUpEnterKeyBinding("inputScalingSize","scalingBtn");
	loadPageWithInfo();
}
init();

function loadPageWithInfo()
{
	let urlParams = window.location.search;
	let stringOfSettings = "";
	let stringOfAccounts = "";
	let stringOfContainer = "";
	let saveIntoStorage;
	if(urlParams.indexOf('isSharedLink')!=-1)
	{
		urlParams = urlParams.split('isSharedLink')[1];
		var sharedLinkInfo = loadPageWithSharedLink(urlParams);
		stringOfAccounts = sharedLinkInfo.accounts;
		stringOfContainer = sharedLinkInfo.containers;
		saveIntoStorage = true;
	}
	else
	{
		stringOfAccounts = windowLocalStorage.getItem('IGPairUsername');
		stringOfContainer = windowLocalStorage.getItem('IGPairContainer');
		saveIntoStorage = false;
	}
	loadSettingsWithLocalStorage();
	loadAccountsWithSavedString(stringOfAccounts,stringOfContainer,saveIntoStorage);
}

function formSharedLink()
{
	let usernameString = windowLocalStorage.getItem('IGPairUsername').replace('"',"").replace("[","").replace("]","").replace('"',"");
	let containerString = windowLocalStorage.getItem('IGPairContainer').replace('"',"").replace("[","").replace("]","").replace('"',"");
	let settingsString = settings.isDisplayProfile + ',' + settings.isDisplayBiography + ',' + settings.itemPerScope + ',' + settings.ItemPerRow;

	d3.select("#formLinkButton").node().disabled = true;
	d3.select("#outputLinkField").node().value = "Loading...";
	let link = window.location.href + "/?isSharedLinkIGFeedSettings" + settingsString + "IGPairUsername="+usernameString + "IGPairContainer=" + containerString;
	shortenLinkWithShrtco(link);
}

function copyLink()
{
  let copyText = document.getElementById("outputLinkField");
  if(copyText.value == "Loading...") return;
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
}

function loadPageWithSharedLink(linkData)
{
	let settingData = linkData.split('IGFeedSettings=')[1].split('IGPairUsername')[0];
	let usernameData = linkData.split('IGPairUsername=')[1].split('IGPairContainer')[0];
	let containerData = linkData.split('IGPairContainer=')[1];
	settings ={
		isDisplayProfile : settingData.split(',')[0],
		isDisplayBiography : settingData.split(',')[1],
		itemPerScope : settingData.split(',')[2],
		ItemPerRow : settingData.split(',')[3]
	}
	syncDisplaySettingWithVariable();
	return {
		accounts : JSON.stringify(usernameData.split(',')),
		containers : JSON.stringify(containerData.split(','))
	}
}

function loadSettingsWithLocalStorage(settingsJSON)
{
	var storeSettings = JSON.parse(windowLocalStorage.getItem('IGFeedSettings'));
	if(storeSettings!=null)
	{
		settings = storeSettings;
		syncDisplaySettingWithVariable();
	}
	else
		updateSettings();
}

function syncDisplaySettingWithVariable()
{
	d3.select("#inputDisplayProfile").node().checked = settings.isDisplayProfile;
	d3.select("#inputDisplayBiography").node().checked = settings.isDisplayBiography;
	d3.select("#inputItemCount").node().value = settings.itemPerScope;
	d3.select("#inputItemPerRow").node().value = settings.ItemPerRow;
}

function updateSettings()
{
	settings.isDisplayProfile =  d3.select("#inputDisplayProfile").node().checked;
	settings.isDisplayBiography =  d3.select("#inputDisplayBiography").node().checked;
	settings.itemPerScope =  d3.select("#inputItemCount").node().value;
	settings.ItemPerRow =  d3.select("#inputItemPerRow").node().value;
	windowLocalStorage.setItem('IGFeedSettings',JSON.stringify(settings));
}

function clickResetAccountBtn()
{
	if (confirm("你確定要重製你的帳號釘選與設定嗎?")) {
		resetAccountAndSetting();		
	}
}

function resetAccountAndSetting()
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
                'display_profile': settings.isDisplayProfile,
                'display_biography': settings.isDisplayBiography,
                'display_gallery': true,
                'display_captions': true,
                'max_tries': 8,
                'callback': null,
                'styling': true,
                'items': settings.itemPerScope,
                'items_per_row': settings.ItemPerRow,
                'margin': 1,
                'lazy_load': true,
                'on_error': console.error
            });
	d3.select("#"+containerId).style("background",getRandomLightColor());
	modifyItemScaling();
}

function loadAccountsWithSavedString(usernameStr,containerStr,saveIntoStorage)
{
	if(usernameStr == null || containerStr == null)
		return;
	var usernameArr = JSON.parse(usernameStr);
	var containerArr = JSON.parse(containerStr);
	for(var id in containerArr)
	{
		generateNewAccountView(usernameArr[id],containerArr[id],saveIntoStorage);
		if(id == containerArr.length-1)
		{
			globalContainerCount = parseInt(id) + 2;
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
	d3.selectAll(".item")
	.style("width",size+"%");
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

	d3.select("#"+containerId).append("div")
	.attr("class","pin");
}

function getRandomLightColor()
{
	return 'rgb(' + (Math.floor((256-229)*Math.random()) + 230) + ',' + 
            (Math.floor((256-229)*Math.random()) + 230) + ',' + 
            (Math.floor((256-229)*Math.random()) + 130) + ')'; 
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
	if(swtichTempId == targetId)
	{
		swtichTempId = ""
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