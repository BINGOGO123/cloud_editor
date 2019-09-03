let cookie=document.cookie;
if(cookie.indexOf("email")==-1 || cookie.indexOf("password")==-1)
    window.location.replace("index.html");

const infoUrl="php/initial.php";
var SUCCESS=0;
var ERROR=1;

let data={
    deleteUrl:"php/delete.php",
    reNameUrl:"php/rename.php",
    createUrl:"php/create.php",
    contentUrl:"php/content.php",
    saveUrl:"php/save.php",
    list:[],
    fileList:[],
    focus:0,
    modelDiv:{
        show:false,
        info:"",
        type:"button",
        buttonList:[],
        value:"",
        fun:function(){},
        align:""
    },
    focusItem:null
}

fetch(infoUrl,{
    method:"post"
}).then(function(response){
    return response.text();
}).then((text)=>{
    // document.body.innerHTML=text;
    let json = JSON.parse(text);
    if(json.status==SUCCESS)
        data.list=json.data;
    else if(json.status==ERROR)
    {
        alert("获取文件目录失败"+json.information);
    }
    else
    {
        alert("收到未知消息"+json.information);
    }
    let fileSystem = new Vue({
        el:"#path",
        data:data,
        methods:{
            addFile:function(name,dir,item){
                //如果打开的文件已经在打开文件列表中的话
                for(let i = 0;i<this.fileList.length;i++)
                {
                    if(this.fileList[i].item===item)
                    {
                        this.focus=i;
                        return;
                    }
                }
                //否则先获取文件内容
                let content;
                let submitObject=new FormData();
                submitObject.append("dir",dir);
                fetch(this.contentUrl,{
                    method:"post",
                    body:submitObject
                }).then(function(response){
                    return response.text()
                }).then((text)=>{
                    // document.body.innerHTML=text;
                    let json = JSON.parse(text);
                    if(json.status==SUCCESS)
                    {
                        content=json.content;
                        this.fileList.push({
                            name:name,
                            content:content,
                            dir:dir,
                            saved:true,
                            item:item
                        });
                        this.focus=this.fileList.length-1;
                    }
                    else
                    {
                        this.alertSomething("获取文件内容失败:"+json.information);
                        return;
                    }
                });
            },
            changeNavFocus:function(index){
                this.removeFocus(this.list);
                this.focus=index;
                this.fileList[index].item.focus=true;
            },
            saveContent:function(index){
                if(this.fileList[index].saved)
                    return;
                let submitObject = new FormData();
                submitObject.append("dir",this.fileList[index].dir);
                submitObject.append("content",this.fileList[index].content);
                fetch(this.saveUrl,{
                    method:"post",
                    body:submitObject
                }).then(function(response){
                    return response.text();
                }).then((text)=>{
                    let json = JSON.parse(text);
                    if(json.status==SUCCESS)
                    {
                        this.fileList[index].saved=true;
                    }
                    else
                    {
                        this.alertSomething("保存[ ",this.fileList[index].name," ]失败:"+json.information);
                    }
                });
            },
            saveAll:function(){
                for(let i = 0;i<this.fileList.length;i++)
                    this.saveContent(i);
            },
            refresh:function(){
                for(let i = 0;i<this.fileList.length;i++)
                    this.refreshContent(i);
            },
            refreshContent:function(index){
                let dir=this.fileList[index].dir;
                let submitObject=new FormData();
                submitObject.append("dir",dir);
                fetch(this.contentUrl,{
                    method:"post",
                    body:submitObject
                }).then(function(response){
                    return response.text()
                }).then((text)=>{
                    // document.body.innerHTML=text;
                    let json = JSON.parse(text);
                    if(json.status==SUCCESS)
                    {
                        this.fileList[index].content=json.content;
                        this.fileList[index].saved=true;
                    }
                    else
                    {
                        this.alertSomething("刷新文件[ ",this.FileList[index].name,"失败:"+json.information);
                        return;
                    }
                });
            },
            getModel:function(object)
            {
                this.modelDiv.type=object.type;
                this.modelDiv.value=object.value;
                this.modelDiv.buttonList=object.buttonList;
                this.modelDiv.info=object.info;
                this.modelDiv.show=true;
                this.modelDiv.fun=object.fun;
                this.modelDiv.align="normal";
            },
            closeNavItem:function(item){
                for(let i = 0;i<this.fileList.length;i++)
                {
                    if(this.fileList[i].item===item)
                    {
                        if(i==this.focus)
                        {
                            this.removeFocus(this.list);
                            this.fileList.splice(i,1);
                            this.focus=0;
                            if(this.fileList.length)
                            {
                                this.fileList[this.focus].item.focus=true;
                            }
                        }
                        else if(i < this.focus)
                        {
                            this.fileList.splice(i,1);
                            this.focus--;
                        }
                        else
                        {
                            this.fileList.splice(i,1);
                        }
                        return;
                    }
                }
            },
            ensure:function(val)
            {
                this.modelDiv.show=false;
                this.modelDiv.fun(this.modelDiv.value,val);
            },
            choose:function(index)
            {
                this.modelDiv.show=false;
                this.modelDiv.fun(index);
            },
            closeFile:function(index,save)
            {
                if(save && !this.fileList[index].saved)
                {
                    let submitObject = new FormData();
                    submitObject.append("dir",this.fileList[index].dir);
                    submitObject.append("content",this.fileList[index].content);
                    fetch(this.saveUrl,{
                        method:"post",
                        body:submitObject
                    }).then(function(response){
                        return response.text();
                    }).then((text)=>{
                        let json = JSON.parse(text);
                        if(json.status==SUCCESS)
                        {
                            if(index==this.focus)
                            {
                                this.removeFocus(this.list);
                                this.fileList.splice(index,1);
                                this.focus=0;
                                if(this.fileList.length)
                                {
                                    this.fileList[this.focus].item.focus=true;
                                }
                            }
                            else if(index < this.focus)
                            {
                                this.fileList.splice(index,1);
                                this.focus--;
                            }
                            else
                                this.fileList.splice(index,1);
                        }
                        else
                        {
                            this.alertSomething("保存[ ",this.fileList[index].name," ]失败:"+json.information);
                        }
                    });
                }
                else
                {
                    if(index==this.focus)
                    {
                        this.removeFocus(this.list);
                        this.fileList.splice(index,1);
                        this.focus=0;
                        if(this.fileList.length)
                        {
                            this.fileList[this.focus].item.focus=true;
                        }
                    }
                    else if(index < this.focus)
                    {
                        this.fileList.splice(index,1);
                        this.focus--;
                    }
                    else
                        this.fileList.splice(index,1);
                }
            },
            removeFocus:function(array){
                for(let i = 0;i<array.length;i++)
                {
                    this.$set(array[i],"focus",false);
                    if(array[i].children!=undefined)
                        this.removeFocus(array[i].children);
                }
            },
            changeNavName:function(item,dir)
            {
                for(let i=0;i<this.fileList.length;i++)
                    if(this.fileList[i].item===item)
                    {
                        this.fileList[i].name=this.fileList[i].item.name;
                        this.fileList[i].dir=dir;
                    }
            },
            alertSomething:function(info)
            {
                this.modelDiv.type="button";
                this.modelDiv.value=""
                this.modelDiv.buttonList=["确认"]
                this.modelDiv.info=info
                this.modelDiv.show=true;
                this.modelDiv.fun=function(){};
                this.modelDiv.align="right";
            }
        },
        provide:function(){
            return {
                addFile:this.addFile,
                changeNavFocus:this.changeNavFocus,
                saveContent:this.saveContent,
                saveAll:this.saveAll,
                refresh:this.refresh,
                closeModel:this.closeModel,
                getModel:this.getModel,
                closeFile:this.closeFile,
                removeFocus:this.removeFocus,
                changeNavName:this.changeNavName,
                closeNavItem:this.closeNavItem,
                alertSomething:this.alertSomething
            }
        }
    });
});

// let data={
//     list:[
//         {
//             name:"banana1",
//             type:"inline-dir",
//             children:[
//                 {
//                     name:"banana1",
//                     type:"inline-dir",
//                     children:[
//                         {
//                             name:"banana1",
//                             type:"inline-dir",
//                             children:[
            
//                             ],
//                             focus:false
//                         }
//                     ],
//                     focus:false,
//                     fold:true
//                 },
//                 {
//                     name:"banana2",
//                     type:"inline-dir",
//                     children:[],
//                     focus:false,
//                     fold:true
//                 },
//                 {
//                     name:"banana3",
//                     type:"file-dir",
//                     focus:false
//                 }
//             ],
//             focus:false,
//             fold:true
//         },
//         {
//             name:"banana2",
//             type:"inline-dir",
//             children:[

//             ],
//             focus:false,
//             fold:true
//         },
//         {
//             name:"banana3",
//             type:"inline-dir",
//             children:[

//             ],
//             focus:false,
//             fold:true
//         },
//         {
//             name:"banana4",
//             type:"file-dir",
//             focus:false
//         },
//         {
//             name:"banana5",
//             type:"file-dir",
//             focus:false
//         },
//     ]
// };
