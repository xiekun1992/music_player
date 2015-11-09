// 打开添加歌曲文件夹弹出层
var addFolder=document.querySelector('#addFolder');
var folders=document.querySelector("#folderList");
var playFolders=[];
addFolder.addEventListener('click',function(){
	var addFolderPrompt=document.querySelector('#addFolderPrompt');
	addFolderPrompt.style.opacity=1;
    addFolderPrompt.style['z-index']=1;
    // 获取本地已有的歌曲目录
    playFolders=music.getPlayFolders();
    // 显示每个目录下已有的音乐列表
    addToFolderList(playFolders);
});
// 关闭添加歌曲文件加弹出层
var closeAddFolderPrompt=document.querySelector("#closeAddFolderPrompt");
closeAddFolderPrompt.addEventListener('click',function(){
    var addFolderPrompt=document.querySelector('#addFolderPrompt');
    addFolderPrompt.style.opacity=0;
    addFolderPrompt.style['z-index']=-1;
});
var folderForm=document.querySelector("#folderForm");
// 添加歌曲目录
folderForm.addEventListener("submit",function(e){
    e.preventDefault();
    var folderToAdd=folderForm.children[0].value;
    if(folderToAdd){
        // 把目录添加到本地保存并获取最新的playFolders的值
        playFolders=music.addToPlayFolders(folderToAdd);
        // 添加本地最新的目录到界面显示
        addToFolderList(playFolders);
    }
});
function registImportSongsNshowSongList(){
    // 导入歌曲后显示列表
    var importSongs=document.querySelectorAll('#folderList li div a input[type=\'file\']');
    for(var i=0;i<importSongs.length;i++){
        importSongs[i].addEventListener('change',function(e){
            // music.setPlayList(songs.files);
            closeAllFolderList();
            // 导入的歌曲
            var allSong=e.target.files;
            if(allSong.length<=0){
                return ;
            }
            var folderName=e.target.parentNode.parentNode.childNodes[0].innerHTML;
            // 传入文件夹名和歌曲列表，将歌曲加入歌曲列表，并返回最新的歌曲列表内容
            playFolders=music.addToPlayList(folderName,allSong);
            var songHtml=generateSongList(allSong,folderName);
            // 将生成的歌曲列表追加到该目录下
            var list=e.target.parentNode.parentNode.parentNode.childNodes[1];
            list.innerHTML=songHtml;
            bindMusicNamePlay();
            list.style.height='200px';
            // 控制右边border的显隐
            if(allSong.length>6){
                list.classList.remove('border_g');
            }
        });
    }
}
// 对导入和本地已有的歌曲设置每个歌曲在播放列表中的位置
function generateSongList(songList,folderName){
    var songsStr="";
    // 在歌曲列表中
    // var playingSong=music.currentSongInfo();
    if(folderName){//导入的歌曲
        for(var i=0;i<playFolders.length;i++){
            if(playFolders[i].folder===folderName){
                var temp=playFolders[i].songs;
                for(var j=0;j<temp.length;j++){
                    songsStr+="<li><div class=\"l w400 ptr\" musicindex=\""+j+"\">"+temp[j].name+"</div>"+
                              "<div class=\"l w50 tr\">"+calculateSizeMB(temp[j].size)+"</div>"+
                              "<div class=\"icon-music dn\" playing></div></li>";
                }        
            }
        }
        
    }else{//刚打开弹出框回显的
        for(var j=0;j<songList.length;j++){
            songsStr+="<li><div class=\"l w400 ptr\" musicindex=\""+j+"\">"+songList[j].name+"</div>"+
                      "<div class=\"l w50 tr\">"+calculateSizeMB(songList[j].size)+"</div>"+
                      "<div class=\"icon-music dn\" playing></div></li>";
        }
    }
    return songsStr;
}
function closeAllFolderList(){
    var lists=document.querySelectorAll("#folderList li ul");
    for(var j=0;j<lists.length;j++){
        lists[j].style.height='0px';
    }
}
function calculateSizeMB(number){
    return (number/1024/1024).toFixed(2)+'MB';
}
// 将本地已存在的音乐目录显示在界面上，并生成其下面的音乐列表
function addToFolderList(existedFolders){
    var folderStr="";
    for(var i=0;i<existedFolders.length;i++){
        // 获取每个目录下的音乐列表
        var songList=existedFolders[i].songs;
        var songsStr=generateSongList(songList);
        // 生成目录和音乐列表
        folderStr+="<li><div><a>"+existedFolders[i].folder+"</a>"+
                "<a class=\"btn_addPic import-songs icon-folder-open\" title=\"导入歌曲\"><input class=\"filePrew\" type=\"file\" multiple /></a>"+
                "<a class=\"icon-chevron-down r m-3-10 ptr rotate\" togglefolder></a>"+"</div>"+
                "<ul class=\"song-list "+((songList.length>6)?'':'border_g')+"\" songlist>"+songsStr+"</ul></li>";
    }
    folders.innerHTML=folderStr;
    registImportSongsNshowSongList();
    bindMusicNamePlay();
    // 设置文件夹操作按钮功能
    var toggleButtons=document.querySelectorAll("#folderList li div a[togglefolder]");
    for(var i=0;i<toggleButtons.length;i++){
        toggleButtons[i].addEventListener("click",function(e){
            // console.log(e)
            var thisSongList=e.target.parentNode.parentNode.childNodes[1];
            if(thisSongList.style.height!='200px'){
                // 关闭其他音乐列表
                var allSongList=e.target.parentNode.parentNode.parentNode.childNodes;
                for(var j=0;j<allSongList.length;j++){
                    allSongList[j].childNodes[1].style.height='0px';
                }
                // 展开选中的音乐列表
                thisSongList.style.height='200px';
                e.target.classList.add('rotate180');
            }else{
                e.target.classList.remove('rotate180');
                thisSongList.style.height='0px';
            }
        });
    }
    
}
function bindMusicNamePlay(){
    // 设置点击歌曲名播放
    var songItems=document.querySelectorAll("#folderList li ul[songlist] li");
    for(var i=0;i<songItems.length;i++){
        songItems[i].childNodes[0].addEventListener("click",function(e){
            var folderName=e.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerHTML;
            var index=e.target.getAttribute("musicindex");
            var songList=[];
            for(var j=0;j<playFolders.length;j++){
                if(folderName==playFolders[j].folder){
                    songList=playFolders[j].songs;
                }
            }
            music.playSpecificSong(folderName,songList,parseInt(index));
            var volumeRinger=tickSound();
            volumeRinger.play();
            var classList=play.children[0].classList;
            if(classList[0]==='icon-play'){
                // music.start();
                classList.remove("icon-play");
                classList.add('icon-pause'); 
                play.children[0].style.left='11px';
                calculateCurrentProgress();
            }
            // }else{
            //     // music.pause();
            //     classList.remove("icon-pause");
            //     classList.add('icon-play');
            //     play.children[0].style.left='14px';
            //     clearInterval(currentProgressTimer);
            // }
        });
    }
}




// 播放歌曲
var play=document.querySelector('#play');
var previous=document.querySelector('#previous');
var next=document.querySelector('#next');
var currentSongName=document.querySelector('#currentSongName');
var volume=document.querySelector("#volume");
setSongName();
// 控制音量
var volumeHoverTimer;
var volumeDegree=360;// 默认音量为1
volume.addEventListener("mouseover",function(){
    volumeHoverTimer=setTimeout(function(){
        // 获取上次的设置的音量
        var vol=music.getVolume();
        volumeDegree=vol*360;
        volume.style.transform='rotate('+volumeDegree+'deg)';
        volume.style.opacity=1;
    },1000);
});
volume.addEventListener("mouseout",function(){
    volume.style.opacity=0;
    clearTimeout(volumeHoverTimer);
});
volume.addEventListener("mousewheel",function(e){
    if(volume.style.opacity!=1)
        return;
    // 起始音量默认为1
    var volumeRinger=tickSound();
  
    if(e.wheelDelta===-120 && volumeDegree>0){// 向下滚动,减音量,逆时针
        volumeDegree-=36;
        music.setVolume(-1);
        volumeRinger.play();
    }else if(e.wheelDelta===120 && volumeDegree<360){// 向上滚动,加音量,顺时针
        volumeDegree+=36;
        music.setVolume(1);
        volumeRinger.play();
    }
    volume.style.transform='rotate('+volumeDegree+'deg)';
});
play.addEventListener("click",function(){
    var volumeRinger=tickSound();
    volumeRinger.play();
    if(music.getPlayFolders().length<=0)return;
    var classList=play.children[0].classList;
    if(classList[0]==='icon-play'){
        music.start();
        classList.remove("icon-play");
        classList.add('icon-pause'); 
        play.children[0].style.left='11px';
        calculateCurrentProgress();
    }else{
        music.pause();
        classList.remove("icon-pause");
        classList.add('icon-play');
        play.children[0].style.left='14px';
        clearInterval(currentProgressTimer);
    }
});
previous.addEventListener("click",function(){
    var volumeRinger=tickSound();
    volumeRinger.play();
    if(music.getPlayFolders().length<=0)return;
    music.previous();
    var classList=play.children[0].classList;
    if(classList[0]==='icon-play'){
        music.start();
        classList.remove("icon-play");
        classList.add('icon-pause'); 
        play.children[0].style.left='11px';
        calculateCurrentProgress();
    }
});
next.addEventListener("click",function(){
    var volumeRinger=tickSound();
    volumeRinger.play();
    if(music.getPlayFolders().length<=0)return;
    music.next();
    var classList=play.children[0].classList;
    if(classList[0]==='icon-play'){
        music.start();
        classList.remove("icon-play");
        classList.add('icon-pause'); 
        play.children[0].style.left='11px';
        calculateCurrentProgress();
    }
});

var currentProgressTimer;
function calculateCurrentProgress(){
    var currentProgress=document.querySelector('#currentProgress');
    var elementWidth=currentProgress.parentElement.offsetWidth;
    var songName;
    setSongName(songName);
    var done=0,total=0;
    currentProgressTimer=setInterval(function(){
        total=music.duration();
        done=music.getCurrentTime();
        if(music.ended()){
            done=0;
            currentSongName.style.opacity=0;
        }else{
            currentProgress.style.left=done/total*elementWidth+'px';
            if(songName!==music.currentSongInfo().name){
                setSongName(songName);
            }
        }
    },500);
}
function setSongName(songName){
    songName=music.currentSongInfo()?music.currentSongInfo().name:'';
    currentSongName.innerHTML=songName;
    currentSongName.style.opacity=1;
}
function tickSound(){
    return new Audio('./sounds/Ringer.wav');
}
