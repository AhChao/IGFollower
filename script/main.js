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
                'display_biography': true,
                'display_gallery': true,
                'display_captions': true,
                'max_tries': 8,
                'callback': null,
                'styling': true,
                'items': 8,
                'items_per_row': 4,
                'margin': 1,
                'lazy_load': true,
                'on_error': console.error
            });
}

function newAccount()
{
	let account = d3.select("#inputIGAccount").node().value;
	let containerId = "container" + globalContainerCount;
	d3.select("#displayField").append("div")
	.attr("id",containerId)
	.attr("class","item");
	LoadInstagramFeed(account,containerId);
}