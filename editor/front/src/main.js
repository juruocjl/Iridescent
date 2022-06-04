import 'katex/dist/katex.css';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/atom-one-dark.css'
import './main.css';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import {AES} from 'crypto-es/lib/aes.js';
import {Utf8} from 'crypto-es/lib/core.js';
import {UnlockOne,LockOne,Write,SettingOne,PreviewOpen} from '@icon-park/svg';
import moment from 'moment';
var Config={theme:"multi-color",size:"1.5em",fill:['#0060cc' ,'#2F88FF' ,'#FFF' ,'#43CCF8'],strokeWidth:"3"};
var now=-1;
const mn=require.ensure([],()=>{
var md = require('markdown-it')();
const kk=require.ensure([],()=>{
md=md.use(require('markdown-it-katex'));
const hl=require.ensure([],()=>{
const hljs = require('highlight.js/lib/common');
md=md.use(require('markdown-it-highlightjs/core'),{hljs});
window.onload=async function(){
	var now=0;
	var key=await window.electronAPI.getPswd()+"                ";
	key=key.substr(0,16);
	var menu=document.getElementById('menu');
	var articles=Array();
	const files = await window.electronAPI.listFile();
	for(var i=0;i<files.length;i++)if(files[i]!='list.json')
		articles.push(await window.electronAPI.loadFile(files[i]));
	for(var i=0;i<articles.length;i++)if(articles[i].pswd)
		articles[i].content=AES.decrypt(articles[i].content, key).toString(Utf8);
	function focusnow(){document.getElementById('article'+now).style.background="#aaa";}
	function disfocusnow(){document.getElementById('article'+now).style.background="";}
	function showmenu(filename){
		articles.sort((a,b)=>{return a.priority!=b.priority?(a.priority<b.priority?1:-1):(new Date(b.date)).getTime()-(new Date(a.date)).getTime();})
		menu.innerHTML="";
		for(var i=0;i<articles.length;i++)
			menu.innerHTML+='<span id="article'+i+'">'+articles[i].title+"</span><br>";
		for(var i=0;i<articles.length;i++){
			const a=i;
			document.getElementById('article'+a).onclick = ()=>{disfocusnow();now=a;towrite();focusnow();}
		}
		if(!filename){
			now=0;towrite();focusnow();
		}else{
			disfocusnow();
			for(var i=0;i<articles.length;i++)if(filename==articles[i].file)now=i;
			tosetting();focusnow();
		}
	}
	async function savefile(){
		var tmp=JSON.parse(JSON.stringify(articles[now]));
		if(tmp.pswd)tmp.content=AES.encrypt(articles[now].content, key).toString();
		await window.electronAPI.saveFile(articles[now].file,tmp);
	}
	document.getElementById("contain").onchange=async ()=>{
		articles[now].content=document.getElementById("contain").value;
		savefile();focusnow();
	};
	function towrite(){
		console.log(now,articles[now]);
		document.getElementById("writing").style.display="inline-block";
		document.getElementById("contain").value=articles[now].content;
		document.getElementById("preview").style.display="none";
		document.getElementById("setting").style.display="none";
	}
	function topreview(){
		document.getElementById("writing").style.display="none";
		document.getElementById("preview").style.display="inline-block";
		document.getElementById("setting").style.display="none";
		document.getElementById("previewcontain").innerHTML=md.render(articles[now].content);
	}
	function tosetting(){
		document.getElementById("writing").style.display="none";
		document.getElementById("preview").style.display="none";
		document.getElementById("setting").style.display="inline-block";
		document.getElementById('title').value=articles[now].title;
		document.getElementById('file').value=articles[now].file.substr(0,articles[now].file.length-5);
		document.getElementById('bg').value=articles[now].pic;
		document.getElementById('tags').innerHTML=articles[now].tag;
		document.getElementById('priority').value=articles[now].priority;
		document.getElementById('source').value=articles[now].source;
		document.getElementById('lglink').value="";
		document.getElementById('cflink').value="";
		document.getElementById('atlink').value="";
		document.getElementById('uojlink').value="";
		document.getElementById('lojlink').value="";
		document.getElementById('link1').value="";
		document.getElementById('link2').value="";
		for(var i=0;i<articles[now].link.length;i++){
			var lk=articles[now].link[i];
			if(lk[0]=="LG")document.getElementById('lglink').value=lk[1];
			else if(lk[0]=="ATC")document.getElementById('atlink').value=lk[1];
			else if(lk[0]=="CF")document.getElementById('cflink').value=lk[1];
			else if(lk[0]=="UOJ")document.getElementById('uojlink').value=lk[1];
			else if(lk[0]=="LOJ")document.getElementById('lojlink').value=lk[1];
			else document.getElementById('link1').value=lk[0],document.getElementById('link2').value=lk[1];
		}
		document.getElementById('pswd').checked=articles[now].pswd;
		document.getElementById('date').value=articles[now].date;
	}
	showmenu(null);
	document.getElementById('toe').innerHTML=Write(Config);
	document.getElementById('toe').onclick=towrite;
	document.getElementById('top').innerHTML=PreviewOpen(Config);
	document.getElementById('top').onclick=topreview;
	document.getElementById('tos').innerHTML=SettingOne(Config);
	document.getElementById('tos').onclick=tosetting;
	document.getElementById('title').onchange=async ()=>{
		articles[now].title=document.getElementById('title').value;
		document.getElementById('article'+now).innerHTML=document.getElementById('title').value;
		await savefile();
	};
	document.getElementById('file').onchange=async ()=>{
		await window.electronAPI.delFile(articles[now].file);
		articles[now].file=document.getElementById('file').value+'.json';
		await savefile();
	}
	document.getElementById('bg').onchange=async ()=>{
		articles[now].pic=document.getElementById('bg').value;
		await savefile();
	};
	document.getElementById('addtag').onclick=async()=>{
		var tag=document.getElementById('tag').value;
		if(articles[now].tag.indexOf(tag)==-1)articles[now].tag.push(tag);
		document.getElementById('tags').innerHTML=articles[now].tag;
		await savefile();
	}
	document.getElementById('deltag').onclick=async()=>{
		var tag=document.getElementById('tag').value;
		if(articles[now].tag.indexOf(tag)!=-1)
			articles[now].tag.splice(articles[now].tag.indexOf(tag),1);
		document.getElementById('tags').innerHTML=articles[now].tag;
		await savefile();
	}
	document.getElementById('priority').onchange=async ()=>{
		articles[now].priority=parseInt(document.getElementById('priority').value);
		showmenu(articles[now].file);
		await savefile();
	};
	document.getElementById('source').onchange=async ()=>{
		articles[now].source=document.getElementById('source').value;
		if(articles[now].source=="")articles[now].source=null,document.getElementById('source').value=articles[now].source;
		await savefile();
	};
	async function updlinks(){
		var lglink=document.getElementById('lglink').value;
		var atlink=document.getElementById('atlink').value;
		var cflink=document.getElementById('cflink').value;
		var uojlink=document.getElementById('uojlink').value;
		var lojlink=document.getElementById('lojlink').value;
		var link1=document.getElementById('link1').value;
		var link2=document.getElementById('link2').value;
		var links=Array();
		if(lglink)links.push(["LG",lglink]);
		if(atlink)links.push(["ATC",atlink]);
		if(cflink)links.push(["CF",cflink]);
		if(uojlink)links.push(["UOJ",uojlink]);
		if(lojlink)links.push(["LOJ",lojlink]);
		if(link1!=''&&link2!='')links.push([link1,link2]);
		articles[now].link=links;
		await savefile();
	}
	document.getElementById('lglink').onchange=updlinks;
	document.getElementById('atlink').onchange=updlinks;
	document.getElementById('cflink').onchange=updlinks;
	document.getElementById('uojlink').onchange=updlinks;
	document.getElementById('lojlink').onchange=updlinks;
	document.getElementById('link1').onchange=updlinks;
	document.getElementById('link2').onchange=updlinks;
	document.getElementById('pswd').onclick=async ()=>{
		articles[now].pswd=document.getElementById('pswd').checked;
		await savefile();
	}
	document.getElementById('date').onchange=async ()=>{
		articles[now].date=document.getElementById('date').value;
		showmenu(articles[now].file);
		await savefile();
	};
	document.getElementById('delete').onclick=async ()=>{
		await window.electronAPI.delFile(articles[now].file);
		articles.splice(now,1);
		showmenu(null);
	}
	window.electronAPI.NewFile(async (_event,pic) => {
		console.log(pic);
		const value = await Swal.fire({
		  title: "输入文件名",
		  input: "text",
		  inputLabel: "文件名（不含后缀）",
		  inputValue: "",
		  showCancelButton: true,
		  inputValidator: (value) => {
			  console.log(value);
			if (!value) 
			  return "不能为空";
			for(var i=0;i<articles.length;i++)
				if(articles[i].file==value+".json")
					return "不能重复";
		  }
		});
		console.log(value);
		if(value.isConfirmed){
			var file=value.value+".json";
			articles.push({
				"title":"newblog",
				"file":file,
				"pic":pic,
				"tag":[],
				"priority":0,
				"source":null,
				"link":[],
				"pswd":false,
				"date":moment().format("YYYY-MM-DD HH:mm:ss"),
				"content":""
			});
			showmenu(file);
			await savefile();
		}
	});
	function exportFull(){
		var arr=Array();
		for(var i=0;i<articles.length;i++)
			arr.push({'title':articles[i].title,'file':articles[i].file,'source':articles[i].source,'tag':articles[i].tag,'date':articles[i].date,'bg':articles[i].pic});
		return {'date':(new Date()).getTime(),'data':arr};
	}
	window.electronAPI.ExportFile(async (_event) => {
		await window.electronAPI.saveFile('list.json',exportFull());
	});
}
},"hl");
},"kk");
},"mn");
