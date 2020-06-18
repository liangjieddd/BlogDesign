﻿var musicFiles = [{
    name: "春暖花开 ",
    author: "那英",
    url: "music/那英 - 春暖花开.mp3"
},
{
    name: "春暖花开",
    author: "董靓杰",
    url: "music/春暖花开-自己录.mp3"
},
{
    name: "风起时",
    author: "胡歌",
    url: "music/胡歌 - 风起时.mp3"
},
{
    name: "赤血长殷",
    author: "慕寒、五色石南叶",
    url: "music/五色石南叶、慕寒、Smile小千、Ken_Zong - 赤血长殷.mp3"
},
{
    name: "长相忆",
    author: "慕寒、五色石南叶",
    url: "music/慕寒、五色石南叶、苏郁青、Smile小千 - 长相忆.mp3"
},
];
$(function() {
    var $media = $("#musicbox");
    var musicIndex = -1;      //当前正在播放的歌曲的索引
    var playingFile = null;   //当前正在播放的歌曲
    var playMode = 1; //播放模式
    init = function() {
        for (var a in musicFiles) {
            $("#musiclist").append("<li>" + musicFiles[a].name + " - " + musicFiles[a].author + "</li>");
        }
        nextMusic();
    } ();
    $("#next").bind("click", nextMusic);
    // $("audio").bind("error", nextMusic);
    function nextMusic() {
        if (playMode == 1) {
            musicIndex += 1;
        }
        if (musicIndex == musicFiles.length) {
            musicIndex = 0;
        }
        playMusic(musicIndex);
    }
    // 播放
    function playMusic(index) {
        playingFile = musicFiles[index];
        $media.attr("src", playingFile.url);
        $media[0].play();
        $("#musiclist>li").removeClass("isplay").eq(index).addClass("isplay");
        auto();
    }
    // 控制播放时间和播放进度
    function auto() {
        var allTime = $media[0].duration;
        var currentTime = $media[0].currentTime;
        var percent = Math.floor(currentTime * 100 / allTime);
        if (isNaN(allTime)) {
            $("#progress div").css({
                background: "url(images/load.png repeat-x)",
                width: "100px"
            });
        } else {
            $("#progress div").css("background", "#374D62");
            $("#progress div").css("width", percent + "px");
            $("#time").html(timeformat(currentTime) + " / " + timeformat(allTime));
        }
        setTimeout(auto, 1000);
        if ($media[0].ended == true) {
            nextMusic();
        }
    };
    // 设置时间格式
    function timeformat(time) {
        var t = Math.round(time);
        var h = Math.floor(t / 3600);
        var m = Math.floor(t / 60);
        var s = t - h * 3600 - m * 60;
        if (h == 0) {
            str = m > 9 ? m: ("0" + m) + ":" + (s > 9 ? s: ("0" + s));
        } else {
            str = h > 9 ? h: ("0" + h) + ":" + (m > 9 ? m: ("0" + m)) + ":" + (s > 9 ? s: ("0" + s));
        }
        return str;
    }

    // 双击音乐列表播放
    $("#musiclist>li").dblclick(function() {
        musicIndex = $("#musiclist>li").index(this);
        $("#play").addClass("playing");
        playMusic(musicIndex);
        if (playMode == 0) {
            $("#musiclist>li").removeClass("disable").not(".isplay").addClass("disable");
        }
    });

    //播放按钮切换
    $("#play").click(function() {
        if ($("#play").is(".playing")) {
            $("#play").removeClass("playing");
            $media[0].pause();
        } else {
            $("#play").addClass("playing");
            $media[0].play();
        }
    });

    //调整进度
    $("#progress").click(function(e) {
        var offset = $("#progress div").offset();
        var width = e.pageX - offset.left;
        var allTime = $media[0].duration;
        $media[0].currentTime = allTime * width / 100;
        $("#progress div").css("width", width + "px");
    });

    //音量调整
    var isdown = false;
    $("#volume div").mousedown(function(e) {
        var offset = $("#volume").offset();
        var left = e.pageX - offset.left - 8;
        left = left > 34 ? 34 : left;
        left = left < 0 ? 0 : left;
        $("#volume div").css("left", left + "px");
        isdown = true;
    });
    $(document).mousemove(function(e) {
        if (isdown) {
            var offset = $("#volume").offset();
            var left = e.pageX - offset.left - 8;
            left = left > 34 ? 34 : left;
            left = left < 0 ? 0 : left;
            $("#volume div").css("left", left + "px");
            $media[0].volume = Math.round(left / 34 * 10) / 10;
        }
    });
    $(document).mouseup(function() {
        isdown = false;
        //alert(isdown);
    });

    $("#volume").click(function(e) {
        var offset = $("#volume").offset();
        var left = e.pageX - offset.left - 8;
        left = left > 34 ? 34 : left;
        left = left < 0 ? 0 : left;
        $("#volume div").css("left", left + "px");
        $media[0].volume = Math.round(left / 34 * 10) / 10;
    });

    //模式切换
    $("#mode").click(function() {
        if (playMode == 1) {
            $("#mode").html("单首");
            $("#musiclist>li").not(".isplay").addClass("disable");
            playMode = 0;
        } else {
            $("#mode").html("全部");
            $("#musiclist>li").removeClass("disable");
            playMode = 1;
        }
    });
});