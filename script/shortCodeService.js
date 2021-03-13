// Integrate with https://app.shrtco.de/docs
function shortenLinkWithShrtco(link)
{
	var xmlHttp = new XMLHttpRequest();
	console.log(link);
    xmlHttp.open( "GET", "https://api.shrtco.de/v2/shorten?url="+link, false ); // false for synchronous request
    xmlHttp.send( null );
    var resp = JSON.parse(xmlHttp.responseText);
    d3.select("#formLinkButton").node().disabled = false;
	d3.select("#outputLinkField").node().value = resp.result.full_short_link;
}