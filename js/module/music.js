// 音乐模块
var music=(function(){
	// 创建音频
    var song=new Audio();
    var songIndex=0;
    // 保存暂停时的播放时间,用于继续播放
    var currentPlayTime=0;
    // 循环滴答检测歌曲状态
    var timer;
	// 默认列表循环
	var loopMode='listLoop';
	// 此时播放的歌曲列表
	var playList=[];
	// 播放的歌曲所在的目录	
	var playFolder='';
	var playFolders=[];
	// 获取已有的音乐列表和目录
	var existFolder=localStorage.getItem("playFolder");// [{folder:'C:\music',songs:[{name:'1.ogg',size:222},{name:'2.pm3',size:11111}]}]
	// var lastPlayedSongIndex=0;
	var volume=1;
	if(existFolder){
		playFolders=JSON.parse(existFolder);
		// 获取上次退出时播放的歌曲信息
		var info=localStorage.getItem("currentSongInfo");// {folder:'C:\music',song:{name:'1.ogg',size:12}}
		if(info){
			info=JSON.parse(info);
			playFolder=info.folder;
			volume=info.volume||volume;
			// 找到上次退出时播放的歌曲所在音乐列表中的位置
			for(var i=0;i<playFolders.length;i++){
				if(playFolders[i].folder===info.folder){
					// 使用上次退出时的播放列表
					playList=playFolders[i].songs;
					for(var j=0;j<playList.length;j++){
						if(playList[j].id===info.song.id){
							// 设置在播放列表中的索引,用于播放该歌曲
							songIndex=j;
							break;
						}
					}
					break;
				}
			}
		}else{
			// 默认使用第一个播放音乐目录的播放列表
			playList=playFolders[0].songs;
		}
	}


    // 返回当前播放目录的播放列表
    var getPlayList=function(){
    	for(var i=0;i<playFolders.length;i++){
    		if(playFolders[i].folder===playFolder){
    			return playFolders[i].songs;
    		}
    	}
    	return [];
    };
    var addToPlayList=function(folder,songList){
    	// playList=list;
    	for(var i=0;i<playFolders.length;i++){
    		// 将音乐追加到已有的目录中
    		if(playFolders[i].folder===folder){
    			var lastIndex=playFolders[i].songs.length;
    			for(var j=0;j<songList.length;j++){
	    			playFolders[i].songs.push({id:lastIndex++,size:songList[j].size,name:songList[j].name});
    			}
    			localStorage.setItem("playFolder",JSON.stringify(playFolders));
    			break;
    		}
    	}
    	return playFolders;
    };
    var setPlayList=function(list){
    	playList=list;
    };
    // 设置已存在的播放文件夹目录
    var setPlayFolder=function(folder){
    	playFolder=folder;
    };
    var getPlayFolder=function(){
    	return playFolder;
    };
	var getMode=function(){
		return loopMode;
	};
	var setMode=function(mode){
		loopMode=mode;
    };
    function checkMode(){
    	switch(loopMode){
    		case 'singleLoop':song.play();break;
    		case 'listLoop':change(1);break;
    		case 'randomLoop':break;
    	}
    }
    function play(index){
    	if(typeof playList[index] === "undefined"){
    		return ;
    	}
    	songIndex=index;
        song.src="file:///"+playFolder+"\\"+playList[songIndex].name;
        song.volume=volume;
        song.play();
        var songInfo={folder:playFolder,song:playList[songIndex],volume:song.volume};
        localStorage.setItem("currentSongInfo",JSON.stringify(songInfo));
        clearInterval(timer);
        timer=setInterval(function(){
        	// 歌曲结束
        	if(song.ended===true){
        		// 重置保存暂停时的播放时间
        		currentPlayTime=0;
        		checkMode();
        	}
        },1000);
    }
    function change(delta){
        var index=songIndex+delta;
        if(index<0){
            index+=playList.length;// 第一首的前一首回到最后一首
        }else if(index>=playList.length){
            index=index%playList.length;// 最后一首下一首为第一首
        }
        play(index);
    }
    var previous=function(){
    	change(-1);
    };
    var next=function(){
    	change(1);
    };
    var start=function(){
    	if(song.paused && currentPlayTime>0){
    		song.currentTime=currentPlayTime;
    		song.play();
		}else{
			// 从上次退出时播放的歌曲处播放
			// if(typeof(songIndex)==="number"){
				// change(songIndex);
				// lastPlayedSongIndex=0;
			// }else{
				change(0);
			// }
		}
    };
    var playSpecificSong=function(folder,list,index){
    	setPlayFolder(folder);
    	setPlayList(list);
    	// songIndex=index;
    	play(index);
    };
    var pause=function(){
    	!song.paused && song.pause();
    	currentPlayTime=song.currentTime;
    };
    var getCurrentTime=function(){
    	return song.currentTime;
    };
    var ended=function(){
    	return song.ended;
    };
    var duration=function(){
    	return song.duration;
    };
    var getVolume=function(){
    	return volume;
    };
    var setVolume=function(vol){
    	// song.volume初始值始终为1
    	volume+=vol*0.1;
    	volume=parseFloat(volume.toFixed(1));
    	volume>1 && (volume=1);
    	volume<0 && (volume=0);
    	song.volume=volume;
    	var songInfo={folder:playFolder,song:playList[songIndex],volume:volume};
    	localStorage.setItem("currentSongInfo",JSON.stringify(songInfo));
    };
    var currentSongInfo=function(){
    	return playList[songIndex];
    };
    var getPlayFolders=function(){
    	return playFolders;
    };
    // 添加新/旧的歌曲目录到播放目录中
    var addToPlayFolders=function(folder){
    	var folderExistFlag=false;
    	for(var i=0;i<playFolders.length;i++){
    		if(playFolders[i].folder===folder){
    			folderExistFlag=true;
    			break;
    		}
    	}
		// 如果该目录为新的播放目录
    	if(!folderExistFlag){
	    	playFolders.push({"folder":folder,"songs":[]});
	    	localStorage.setItem("playFolder",JSON.stringify(playFolders));
    	}
    	return playFolders;
    };
    return {
    	setMode:setMode,
    	getMode:getMode,
    	setPlayList:setPlayList,
    	getPlayList:getPlayList,
    	setPlayFolder:setPlayFolder,
    	getPlayFolder:getPlayFolder,
    	previous:previous,
    	next:next,
    	start:start,
    	pause:pause,
    	getCurrentTime:getCurrentTime,
    	ended:ended,
    	duration:duration,
    	currentSongInfo:currentSongInfo,
    	setVolume:setVolume,
    	getVolume:getVolume,
    	getPlayFolders:getPlayFolders,
    	addToPlayFolders:addToPlayFolders,
    	playSpecificSong:playSpecificSong,
    	addToPlayList:addToPlayList
    };
})();