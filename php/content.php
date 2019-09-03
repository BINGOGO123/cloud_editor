<?php
    //本脚本实现获取文件信息功能

    //状态定义
    define("ERROR",1);
    define("SUCCESS",0);

    //服务器信息
    define("URL","localhost",false);
    define("USER","root",false);
    define("PASSWORD","mydb",false);
    define("DATABASE","editor",false);
    define("TABLE","userInformation",false);

    $final=array();
    if($_SERVER["REQUEST_METHOD"]!="POST")
    {
        $final["status"]=ERROR;
        $final["information"]="not POST!";
        echo json_encode($final);
        return;
    }

    //从数据库取得信息
    $sql=new mysqli(URL,USER,PASSWORD,DATABASE);
    if($sql->connect_error)
    {
        $final["status"]=ERROR;
        $final["information"]="database linked failed!";
        echo json_encode($final);
        return;
    }
    $email=$_COOKIE["email"];
    $password=$_COOKIE["password"];

    $query="select count(*) from ".TABLE." where email=\"$email\" and password = \"$password\";";
    $result=$sql->query($query);
    if($result==false)
    {
        $final["status"]=ERROR;
        $final["information"]="select failed!";
        echo json_encode($final);
        $sql->close();
        return;
    }
    if($result->num_rows>0)
    {
        $row=$result->fetch_assoc();
        if(intval($row["count(*)"]) <= 0)
        {
            $final["status"]=ERROR;
            $final["information"]="email and password error";
            echo json_encode($final);
            $sql->close();
            return;
        }
    }
    $sql->close();

    $dir=$_POST["dir"];
    $dir="editor/".$email."/".$dir;
    if(!file_exists($dir))
    {
        $final["status"]=ERROR;
        $final["information"]="file is not existed";
        echo json_encode($final);
        return;
    }
    $file = fopen($dir,"r");
    $size=filesize($dir);
    if($size>0)
        $content = fread($file,filesize($dir));
    else {
        $content="";
    }
    fclose($file);
    $final["status"]=SUCCESS;
    $final["content"]=$content;
    echo json_encode($final);
?>