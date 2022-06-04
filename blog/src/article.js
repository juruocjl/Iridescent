import 'katex/dist/katex.css';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/atom-one-dark.css'
import "toastify-js/src/toastify.css"
import {HomeTwo,LeftC,Github,ScanCode,UnlockOne,LockOne,SettingOne,InvalidFiles,DoubleLeft,DoubleRight} from '@icon-park/svg';
import './main.css';
import Cookies from 'js-cookie';
import {AES} from 'crypto-es/lib/aes.js';
import {Utf8} from 'crypto-es/lib/core.js';
import Swal from 'sweetalert2'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
const Valine = require('valine');
const mn=require.ensure([],()=>{
var md = require('markdown-it')();
const kk=require.ensure([],()=>{
md=md.use(require('markdown-it-katex'));
const hl=require.ensure([],()=>{
const hljs = require('highlight.js/lib/common');
md=md.use(require('markdown-it-highlightjs/core'),{hljs});
var QRCode = require('qrcode');
var Config={theme:"multi-color",size:"1.5em",fill:['#0060cc' ,'#2F88FF' ,'#FFF' ,'#43CCF8'],strokeWidth:"3"};
async function setpswd(){
	const value = await Swal.fire({
		  title: "输入密码",
		  input: "password",
		  inputLabel: "密码",
		  inputValue: Cookies.get('pswd'),
		  showCancelButton: true
	});
	if(value.isConfirmed){
		Cookies.set('pswd',value.value);
		location.reload();
	}
}
document.getElementById('home').innerHTML+=HomeTwo(Config);
document.getElementById('lstpage').innerHTML+=LeftC(Config);
document.getElementById('github').innerHTML+=Github(Config);
document.getElementById('scan').innerHTML+=ScanCode(Config);
document.getElementById('setting').innerHTML+=SettingOne(Config);
document.getElementById('setting').onclick=setpswd;
var protocol=location.protocol;
var hostname=location.hostname;
var pathname=location.pathname;
console.log(pathname);
QRCode.toDataURL(protocol +"//" + hostname + pathname, function (err, url) {
	document.getElementById('qrcodeimg').src=url;
});
var qrcode=document.getElementById('qrcode');
var timer;
function clickqrcode(){
    clearInterval(timer);
    if(qrcode.style.display=="none"){
		qrcode.style.display="block";
		timer= setInterval(function () {
			 var now = parseFloat(qrcode.style.opacity);
			 if(now>=1)clearInterval(timer);
			 else qrcode.style.opacity=now+0.04;
		}, 20);
	}else{
		timer=setInterval(function (){
			 var now = parseFloat(qrcode.style.opacity);
			 if(now<=0){clearInterval(timer);qrcode.style.display="none";}
			 else qrcode.style.opacity=now-0.04;
		}, 20);
	}
}
document.getElementById('scan').onclick=clickqrcode;
document.addEventListener('scroll', function(e) {
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var scrollHeight = document.documentElement.scrollHeight;
	var clientHeight = document.documentElement.clientHeight;
	document.getElementById('progressbar').style.width = +(scrollTop/(scrollHeight-clientHeight)).toFixed(2)*100 + '%';
	document.getElementById('navbar-title').style.opacity=Math.max(0,Math.min(1,(scrollTop-400)/100));
})
var now=require('./getlist.js');
console.log(now);
var articles=now.articles;
var has=0;
var name=pathname.substr(1,pathname.length-1)+'.json';
for(var i=0;i<articles.length;i++)if(articles[i].file==name){
	//console.log(articles[i].file);
	has=1;
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', 'articles/'+articles[i].file, false);
	httpRequest.send();
	if (httpRequest.readyState == 4 && httpRequest.status == 200){
		var json = JSON.parse(httpRequest.responseText);
		console.log(json);
		if(json.pic)document.getElementById("coverimg").src=json.pic;
		document.title=document.getElementById('navbar-title').innerHTML=json.title;
		var dd=' <span style="font-size: 15px;color: #777;font-weight: 100;">'+json.date;
		if(json.source!=null)dd+=' '+json.source;
		dd+='</span>';
		var links='<ul>';
		for(var j=0;j<json.link.length;j++)
			links+='<li>'+json.link[j][0]+'&nbsp;<a href="'+json.link[j][1]+'">'+json.link[j][1]+'</a></li>';
		links+='</ul>';
		if(!json.pswd){
			document.getElementById('content').innerHTML=
			'<h1 id="title">'+json.title+dd+'</h1>'+links+md.render(json.content);
		}else{
			try{
				console.log(Cookies);
				var key=Cookies.get('pswd');
				console.log(key);
				var data=AES.decrypt(json.content, key).toString(Utf8);
				console.log(AES.decrypt(json.content, key),data);
				if(!data)throw "解密失败";
				document.getElementById('content').innerHTML=
				'<h1 id="title">'+UnlockOne(Config)+" "+json.title+dd+'</h1>'+links+md.render(data);
			}catch{
				console.log('解密失败');
				document.getElementById('content').innerHTML=
				'<h1 id="title">'+LockOne(Config)+" "+json.title+dd+'</h1>'+'解密失败，设置 <a id="setting2">'+SettingOne(Config)+"</a> 密码";
			}
		}
		var tags='<div style="width:100%;text-align:center">';
		for(var j=0;j<json.tag.length;j++)
			tags+='<span class="tag" style="background-color: rgb(231, 76, 60);">'+json.tag[j]+'</span>';
		if(json.source)tags+='<span class="tag" style="background-color: rgb(82, 196, 26);">'+json.source+'</span>';
		tags+='</div>';
		document.getElementById('content').innerHTML+=tags;
		var page="<div style='width: 100%;margin-top: 20px;'>";
		if(i!=0)page+='<a style="float:left" href="'+articles[i-1].file.split('.')[0]+'">'+DoubleLeft(Config)+'</a>';
		else page+='<a style="float:left" >'+DoubleLeft({theme: 'outline',size:"1.5em",strokeWidth:"3"})+'</a>';
		if(i!=articles.length-1)page+='<a style="float:right" href="'+articles[i+1].file.split('.')[0]+'">'+DoubleRight(Config)+'</a>';
		else page+='<a style="float:right" >'+DoubleRight({theme: 'outline',size:"1.5em",strokeWidth:"3"})+'</a>';
		page+="</div>";
		document.getElementById('content').innerHTML+=page;
		if(document.getElementById('setting2'))document.getElementById('setting2').onclick=setpswd;
	}
	new Valine({
		el: '#comment' ,
		appId: 'JCLsJagDfpU7TtAa7LNcYs29-gzGzoHsz',
		appKey: 't2HSnE6lrgoqMGAgvzknCKyi'
	});
}
if(!has){
	document.title="文件404啦";
	document.getElementById('content').innerHTML="<h1>"+InvalidFiles(Config)+"404 File Not Found!</h1>";
}
document.getElementById('contain').style="";
document.getElementById('cubes').style="display:none";
},"hl");
},"kk");
},"mn");
