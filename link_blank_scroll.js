
// Adds Open new window to infinite scrolling sites. 
// outputs console log with the total number of links and timestamp. 

$( window ).scroll(function() {

	var links = document.getElementsByTagName("a");
	for (var i=0; i<links.length; i++){
		links[i].setAttribute("target", "_blank");
	}
	var c = new Date(); 
	var d= links.length " links updated : " 
		+ c.getDate() + "/"
		+ (c.getMonth()+1)  + "/" 
		+ c.getFullYear() + " @ "  
		+ c.getHours() + ":"  
		+ c.getMinutes() + ":" 
		+ c.getSeconds();
	console.log(d)

});
