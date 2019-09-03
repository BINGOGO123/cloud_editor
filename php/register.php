<?php
    //本脚本实现注册功能

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

    require("data-deal.php");

    //从数据库取得信息
    $sql=new mysqli(URL,USER,PASSWORD,DATABASE);
    if($sql->connect_error)
    {
        $final["status"]=ERROR;
        $final["information"]="database linked failed!";
        echo json_encode($final);
        return;
    }
    $email=dataDeal($_POST["email"]);
    $password=dataDeal($_POST["password"]);
    $userName=dataDeal($_POST["userName"]);

    $query="select count(*) from ".TABLE." where email="."\"".$email."\"".";";
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
        if(intval($row["count(*)"]) > 0)
        {
            $final["status"]=ERROR;
            $final["information"]="email repeat";
            echo json_encode($final);
            $sql->close();
            return;
        }
        else
        {
            $final["status"]=SUCCESS;
        }
    }
    else
    {
        $final["status"]=SUCCESS;
    }

    $query="insert into ".TABLE." (email,password,userName) value(\"$email\",\"$password\",\"$userName\");";
    if(!$sql->query($query))
    {
        $final["status"]=ERROR;
        $final["information"]="insert failed：".strval($sql->error);
    }
    $sql->close();

    $dir="editor/$email";
    if(!is_dir($dir))
        mkdir($dir,0777,true);
    require("create-base-file.php");
    createBaseFile($dir);
    echo json_encode($final);
?>