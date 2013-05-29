// ==UserScript==
// @name           	ESI Load Tester
// @namespace      	http://media.mtvnservices.com
// @version 		0.1.6
// @description 	Initiate requests from any domain and measure the response times in milliseconds. 
// @author 			john.cabral@mtvn.com
// @include    		http://*
// ==/UserScript==



var head, style;
head = document.getElementsByTagName('head')[0];
head.innerHTML = "";
style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = "body { background-color:#FFF; font-family:Arial; font-size:normal; margin:5px; padding:10px;}";
head.appendChild(style);

var body = document.getElementsByTagName("body")[0];
body.innerHTML = "";

var con = document.createElement('div');
con.setAttribute("id","con");
con.setAttribute("style","padding:10px; border:1px solid #000;");
body.appendChild(con);



// status container. 
var statcon = document.createElement('div');
statcon.setAttribute("id","statcon");
statcon.setAttribute("style","display:none;border:1px solid #FF0000;background-color:#EEE;width:500px;height:15px;margin-top:10px;margin-bottom:10px;");

// status container. 
var statres = document.createElement('div');
statres.setAttribute("id","statres");
statres.setAttribute("style","background-color:#FF0000;width:1px;height:15px;margin:0px;border:0px;");
statcon.appendChild(statres);

con.appendChild(statcon);




var form = document.createElement('form');
con.appendChild(form);

var urlIn = document.createElement('input');
urlIn.setAttribute("type","text");
urlIn.setAttribute("id","url");
urlIn.setAttribute("value","http://"+document.domain+"/robots.txt");
urlIn.setAttribute("style","width:1000px;font-size:20px;font-family:Arial;margin-top:5px;");
form.appendChild(urlIn);

form.appendChild(document.createElement('br'));

var num = document.createElement('input');
num.setAttribute("type","text");
num.setAttribute("id","requests");
num.setAttribute("value","10");
form.appendChild(num);



var cache = document.createElement('input');
cache.setAttribute("type","checkbox");
cache.setAttribute("id","cache");
cache.setAttribute("selected",false);
form.appendChild(cache);

var cacheText = document.createElement('span');
cacheText.innerHTML = " No Cache ";
form.appendChild(cacheText);

var proxy = document.createElement('input');
proxy.setAttribute("id","proxy");
proxy.setAttribute("type","checkbox");
proxy.setAttribute("selected",false);
form.appendChild(proxy);

var proxyText = document.createElement('span');
proxyText.innerHTML = " Use Proxy ";
form.appendChild(proxyText);

var sub = document.createElement('input');
sub.setAttribute("type","button");
sub.addEventListener("click",startTest,false);
sub.setAttribute("style","margin-left:10px;");
sub.setAttribute("value","Run Test");
form.appendChild(sub);

function storeURL(){
	return;
}


var testStarts = 0;
function startTest(){
	storeURL();
	testStarts++;
	document.getElementById("statcon").style.display = "block";
	getURL();
}

var stat = document.createElement('div');
stat.setAttribute("id","stat");
stat.setAttribute("style","font-size:20px;font-family:Arial;margin-top:5px;");
con.appendChild(stat);

var res = document.createElement('div');
res.setAttribute("id","res");
res.setAttribute("style","font-size:14px;font-family:Arial;margin-top:5px;");
con.appendChild(res);

var cells = document.createElement('div');
cells.innerHTML = '<div style="padding: 0px;"><div style="padding: 3px; float: left; background-color:#EEE; white-space: nowrap; border: 1px solid rgb(221, 221, 221); width: 5%; overflow: hidden;">Test #</div><div style="padding: 3px; float: left; background-color:#EEE; white-space: nowrap; border: 1px solid rgb(221, 221, 221); width: 10%; overflow: hidden;">Milliseconds</div><div style="padding: 3px; float: left; background-color:#EEE; white-space: nowrap; border: 1px solid rgb(221, 221, 221); width: 50%; overflow: hidden;">URL</div><div style="padding: 3px; float: left; background-color:#EEE; white-space: nowrap; border: 1px solid rgb(221, 221, 221); width: 5%; overflow: hidden;">Iterations</div><div style="padding: 3px; float: left; background-color:#EEE; white-space: nowrap; border: 1px solid rgb(221, 221, 221); width: 5%; overflow: hidden;">No Cache</div><div style="padding: 3px; float: left; background-color:#EEE; white-space: nowrap; border: 1px solid rgb(221, 221, 221); width: 5%; overflow: hidden;">Proxy</div><div style="clear: both;"/></div>';
body.appendChild(cells);


var empty = document.createElement('div');
empty.setAttribute("id","empty");
body.appendChild(empty);

var tests = 0;
var lastRes = empty;

function createResult(html){
	tests++;	
	var d = document.createElement("div");
	d.setAttribute("id","res"+tests);
	d.innerHTML = html;
	d.setAttribute("style","padding:0px;");
	document.body.insertBefore(d,lastRes);
	lastRes = d;
}

function createURL(){
	var u = document.getElementById("url").value;
	var b = "http://media.mtvnservices.com/temp/proxy.esi?page=";
	var q = (u.indexOf("?") > 0) ? "&" : "?";
	var p = document.getElementById("proxy");
	var c = document.getElementById("cache");

	if (c.checked) u = u + q + "ran=" + Math.floor(Math.random() * 100000); 
	if (p.checked) u = b + escape(u);

	return u;
}

function getTimer(){
	var d = new Date();
	return d.getTime();
}

var requests = 0;
var start;
var last;
var percent = 0;

function getURL()
{
	if (requests == 0) start = getTimer();
	requests++;
	GM_xmlhttpRequest
	(
		{
			method:"GET",
			url: createURL(),
			onload: function(response) {
			
				percent =  Math.floor((requests / document.getElementById("requests").value) * 100);
				document.getElementById('statres').style.width = (percent*5) + "px";
				
				if (requests == 1) {
					document.getElementById("stat").innerHTML = "";
					document.getElementById("res").innerHTML = "";
					
				}
				
				end = getTimer();
				if (requests < Math.floor(document.getElementById("requests").value)){
					if (requests == 1) document.getElementById("stat").innerHTML = "";
					document.getElementById("stat").innerHTML = percent + "% (" + (getTimer() - last) + ")";
					last = getTimer();					
					getURL();
				}
				else{
					document.getElementById("statcon").style.display = "none";
					end = getTimer();
					document.getElementById("stat").innerHTML = percent + "% Complete: Test " + testStarts  + "<br />Average: " + (end-start)/document.getElementById("requests").value +" Milliseconds";
					var html = ""; 
					html += "<div style='padding:3px;float:left;white-space:nowrap;border:1px solid #DDD;width:5%;overflow:hidden;'>" + testStarts + "</div>"
					html += "<div style='padding:3px;float:left;white-space:nowrap;border:1px solid #DDD;width:10%;overflow:hidden;'>" + (end-start)/document.getElementById("requests").value + "</div>";
					html += "<div style='padding:3px;float:left;white-space:nowrap;border:1px solid #DDD;width:50%;overflow:hidden;'>" + createURL() + "</div>";
					html += "<div style='padding:3px;float:left;white-space:nowrap;border:1px solid #DDD;width:5%;overflow:hidden;'>" + requests + "</div>";
					html += "<div style='padding:3px;float:left;white-space:nowrap;border:1px solid #DDD;width:5%;overflow:hidden;'>" + document.getElementById("cache").checked + "</div>";
					html += "<div style='padding:3px;float:left;white-space:nowrap;border:1px solid #DDD;width:5%;overflow:hidden;'>" + document.getElementById("proxy").checked + "</div>";

					html += "<div style='clear:both'></div>";
					//html += "<br />" + document.getElementById("url").value + "," + document.getElementById("cache").checked + "," + requests + "," +  Math.floor((end-start)/document.getElementById("requests").value) +"<br /><br />";
					createResult(html);
					requests = 0;
				}
			}
		}
	);
}