<?php
    function getData($dir)
    {
        $data=[];
        $count=0;
        $handler = opendir($dir);
        while (($filename = readdir($handler)) !== false)
        {
            if ($filename != "." && $filename != "..")
            {
                $data[$count]=array();
                $data[$count]["name"]=$filename;
                $data[$count]["focus"]=false;
                if(is_dir($dir."/".$filename))
                {
                    $data[$count]["type"]="inline-dir";
                    $data[$count]["fold"]=true;
                    $data[$count]["children"]=getData($dir."/".$filename);
                }
                else
                    $data[$count]["type"]="file-dir";
                $count++;
            }
        }
        closedir($handler);
        return $data;
    }
    function deleteFile($dir)
    {
        if(!is_dir($dir))
        {
            unlink($dir);
            return;
        }
        $handler = opendir($dir);
        while (($filename = readdir($handler)) !== false)
        {
            if ($filename != "." && $filename != "..")
            {
                $filename=$dir."/".$filename;
                deleteFile($filename);
            }
        }
        closedir($handler);
        rmdir($dir);
    }
?>