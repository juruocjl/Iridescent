const Toastify=require('toastify-js');
const Cookies=require('js-cookie');
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(), 
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString()
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
var httpRequest = new XMLHttpRequest();
httpRequest.open('GET', 'lstupd?time'+(new Date()).getTime(), false);
httpRequest.send();
var time=JSON.parse(httpRequest.responseText);
var now={};
document.getElementById('lstupdate').innerHTML=dateFormat("YYYY-mm-dd HH:MM", (new Date(time.date)));
try{
	now=JSON.parse(localStorage.getItem('list'));
	if(now.date!=time.date)throw 233;
}catch(e){
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', '/articles/list.json?time'+(new Date()).getTime(), false);
	httpRequest.send();
	Toastify({
		  text: "正在获取最新目录："+dateFormat("YYYY-mm-dd HH:MM", (new Date(time.date))),
		  duration: 3000,
		  newWindow: true,
		  close: true,
		  gravity: "top",
		  position: "right",
		  stopOnFocus: true,
		  style: {
			background: "linear-gradient(to right, #00b09b, #96c93d)",
		  },
	}).showToast();
	now=JSON.parse(httpRequest.responseText);
	localStorage.setItem('list',httpRequest.responseText);
	Cookies.set('seletedtags','{}');
}
var tags=new Array();
for(var i=0;i<now.data.length;i++)
	for(var j=0;j<now.data[i].tag.length;j++)
		tags.push(now.data[i].tag[j]);
tags=Array.from(new Set(tags));
module.exports = {'articles':now.data,'tags':tags};
