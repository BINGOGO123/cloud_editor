<?php
    function createBaseFile($dir)
    {
        $file1=$dir."/这是啥东西/啥都没有的东西/没有东西";
        mkdir($file1,0777,true);
        $file2=$file1."/俄罗斯套娃啊";
        $f=fopen($file2,"w");
        fwrite($f,"湖南人脚臭");
        fclose($f);

        $file2=$dir."/说明";
        $f=fopen($file2,"w");
        fwrite($f,"这是一个基于vue实现的云文件夹应用\nvue还挺好用\n\n悬浮可查看各个按钮功能和文件名称等信息");
        fclose($f);
    }
?>