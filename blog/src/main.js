import "toastify-js/src/toastify.css"
import './main.css';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'
import Toastify from 'toastify-js'
window.onload=()=>{
	var transX=-5,transY=-5;
	document.addEventListener('mousemove',function(e){
		transX-=e.movementX/200;
		transY-=e.movementY/200;
		if(transX>0)transX=0;
		if(transX<-8)transX=-8;
		if(transY>0)transY=0;
		if(transY<-8)transY=-8;
		document.getElementById('cover').style.transform="translate("+transX+"%, "+transY+"%)";
	});
	var now=require('./getlist.js');
	var articles=now.articles;
	var id=0;
	function show(){
		var end=Math.min(articles.length,id+8);
		for(;id<end;id++){
			document.getElementById('posts').innerHTML+=
			'<div class="post"><a href="'+articles[id].file.split('.')[0]+'"><img src="'+articles[id].bg+'" width="680px"></img></a><div class="more"><div style="margin: 100px 0 0 30px;"><span>'+articles[id].date+(articles[id].source?'&nbsp;·&nbsp;'+articles[id].source:'')+'</span><h1>'+articles[id].title+'</h1></div></div></div>'
		}
		if(id==articles.length)
			document.getElementById('showmore').style.display="none";
	}
	show();
	document.getElementById('showmore').onclick=show;
	document.getElementById('contain').style="";
	document.getElementById('cubes').style="display:none";
}
