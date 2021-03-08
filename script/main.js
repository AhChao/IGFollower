var globalContainerCount = 0;
function init()
{
	globalContainerCount = 0;
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
	modifyItemScaling();
}

function modifyItemScaling()
{
	let size = d3.select("#inputScalingSize").node().value;
	let rate = 100/size;
	d3.select(".item").attr("flex","0 1 calc(" + rate + "% - 8px);");
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