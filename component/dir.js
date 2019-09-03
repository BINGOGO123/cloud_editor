var SUCCESS=0;
var ERROR=1;

Vue.component("inline-dir",{
    props:{
        item:{
            type:Object,
            required:true
        },
        grade:{
            type:Number,
            required:true
        }
    },
    template:`
    <div class="inline-dir">
        <div :class="computedClass" :style="paddingStyle" @click.self="getFocus" :title="item.name">
            <div class="inline-dir-name-display" @click="getFocus" ><i :class="{fa:true,'fa-caret-right':item.fold,'fa-caret-down':!item.fold}"></i>&nbsp;{{item.name}}</div>
            <div class="operate-display" @click.self="getFocus">
                <button class="rename" title="重命名" @click="rename"><i class="fa fa-gear"></i></button>
                <button class="delete" title="删除" @click="deleteDir"><i class="fa fa-trash"></i></button>
            </div>
        </div>
        <div class="inline-dir-content" v-show="!item.fold">
            <component
            v-for="(children,index) in item.children"
            :is="children.type"
            :key="index"
            :item="children"
            :grade="grade+1"
            ></component>
        </div>
    </div>
    `,
    name:"inline-dir",
    computed:{
        paddingStyle:function(){
            return {
                paddingLeft:(this.grade+1)*10+"px"
            }
        },
        computedClass:function(){
            let final={
                grade:true,
                "inline-dir-name":true,
                focus:this.item.focus
            };
            final["grade-"+this.grade]=true;
            return final;
        }
    },
    inject:["changeFocus","changeFold","deleteFile","reNameFile","getModel"],
    methods:{
        getFocus:function(){
            if(!this.item.focus)
                this.changeFocus(this.item);
            this.changeFold(this.item);
        },
        deleteDir:function(){
            this.getModel({
                type:"button",
                buttonList:["确认","取消"],
                value:"",
                info:"将会删除该目录即其内部所有文件且无法恢复，是否确认？",
                fun:(index)=>
                {
                    if(index != 0)
                        return;
                    this.deleteFile(this.item);                
                }
            });
            // if(!confirm("将会删除该目录即其内部所有文件且无法恢复，是否确认？"))
            //     return;
            // this.deleteFile(this.item);
        },
        rename:function(){
            this.getModel({
                type:"input",
                buttonList:[],
                value:"",
                info:"请输入新名称：",
                fun:(newName,val)=>
                {
                    if(!val || newName == "")
                        return;
                    this.reNameFile(this.item,newName);                  
                }
            });
            // let newName=prompt("请输入新名称");
            // if(newName == "" || newName==undefined)
            //     return;
            // this.reNameFile(this.item,newName);
        }
    }
});

Vue.component("file-dir",{
    inheritAttrs:false,
    props:{
        item:{
            type:Object,
            required:true
        },
        grade:{
            type:Number,
            required:true
        }
    },
    template:`
    <div :class="computedClass" :style="paddingStyle" @click.self="getFocus" :title="item.name">
        <div class="file-dir-name" @click="getFocus"><i class="fa fa-file-text"></i>&nbsp;{{item.name}}</div>
        <div class="operate-display" @click.self="getFocus">
            <button class="rename" title="重命名" @click="rename"><i class="fa fa-gear"></i></button>
            <button class="delete" title="删除" @click="deleteDir"><i class="fa fa-trash"></i></button>
        </div>
    </div>
    `,
    computed:{
        paddingStyle:function(){
            return {
                paddingLeft:(this.grade+1)*10+"px"
            }
        },
        computedClass:function(){
            let final={
                "file-dir":true,
                grade:true,
                focus:this.item.focus
            }
            final["grade-"+this.grade]=true;
            return final;
        }
    },
    inject:["changeFocus","deleteFile","reNameFile","addFile","getPath","getModel"],
    methods:{
        getFocus:function(){
            if(!this.item.focus)
            {
                this.changeFocus(this.item);
                let dir = this.getPath(this.item);
                if(dir=="")
                    return;
                this.addFile(this.item.name,dir,this.item);
            }
        },
        deleteDir:function(){
            this.deleteFile(this.item);
        },
        rename:function(){
            this.getModel({
                type:"input",
                buttonList:[],
                value:"",
                info:"请输入新名称：",
                fun:(newName,val)=>
                {
                    if(!val || newName == "")
                        return;
                    this.reNameFile(this.item,newName);                  
                }
            });
            // let newName=prompt("请输入新名称");
            // if(newName == "" || newName==undefined)
            //     return;
            // this.reNameFile(this.item,newName);
        }
    }
});

Vue.component("root-dir",{
    template:`
    <div class="root-dir">
        <component
        v-for="(item,index) in list"
        :is="item.type"
        :key="index"
        :item="item"
        :grade="grade+1"
        ></component>
    </div>
    `,
    props:{
        list:{
            type:Array,
            required:true
        },
        grade:{
            type:Number,
            default:0
        }
    },
    provide:function(){
        return {
            changeFocus:this.changeFocus,
            changeFold:this.changeFold
        }
    },
    inject:["removeFocus"],
    methods:{
        changeFocus:function(item){
            this.removeFocus(this.list);
            this.$set(item,"focus",true);
        },
        changeFold:function(item){
            this.$set(item,"fold",!item.fold);
        }
    }
});

Vue.component("operate-dir",{
    template:`
    <div class="operate-dir">
        <button title="创建文件" @click="createF"><i class="fa fa-lg fa-file-o"></i></button>
        <button title="创建文件夹" @click="createDir"><i class="fa fa-lg fa-folder-o"></i></button>
        <button title="打开所有文件夹" @click="$emit('un-fold-all');"><i class="fa fa-lg fa-chevron-down"></i></button>
        <button title="折叠所有文件夹" @click="$emit('fold-all');"><i class="fa fa-lg fa-chevron-up"></i></button>
    </div>
    `,
    inject:["createFile","getModel"],
    methods:{
        createF:function(){
            this.getModel({
                type:"input",
                buttonList:[],
                value:"",
                info:"请输入要创建的文件名称：",
                fun:(newName,val)=>
                {
                    if(!val || newName == "")
                        return;
                    this.createFile(newName,false);                  
                }
            });
            // let newName=prompt("请输入创建的文件名称");
            // if(newName=="" || newName==undefined)
            //     return;
            // this.createFile(newName,false);
        },
        createDir:function(){
            this.getModel({
                type:"input",
                buttonList:[],
                value:"",
                info:"请输入要创建的文件夹名称：",
                fun:(newName,val)=>
                {
                    if(!val || newName == "")
                        return;
                    this.createFile(newName,true);                  
                }
            });
            // let newName=prompt("请输入创建的目录名称");
            // if(newName=="" || newName==undefined)
            //     return;
            // this.createFile(newName,true);
        }
    }
});

Vue.component("file-system",{
    template:`
    <div class="file-system" @click.self="removeFocus(list)">
        <operate-dir @fold-all="foldAll" @un-fold-all="unFoldAll"></operate-dir>
        <root-dir :list="list" :grade="grade"></root-dir>
    </div>
    `,
    props:{
        list:{
            type:Array,
            required:true
        },
        deleteUrl:{
            type:String,
            required:true
        },
        reNameUrl:{
            type:String,
            required:true
        },
        createUrl:{
            type:String,
            required:true
        },
        focusItem:{
            required:true
        }
    },
    data:function(){
        return {
            grade:0
        };
    },
    computed:{
        focusUrl:function(){
            let value=this.getFocusUrl(this.list);
            if(value===false || value===true)
                value=this.list;
            return value;
        }
    },
    provide:function(){
        return {
            removeFocus:this.removeFocus,
            getPath:this.getPath,
            deleteFile:this.deleteFile,
            reNameFile:this.reNameFile,
            createFile:this.createFile
        };
    },
    created:function(){
        this.sortList(this.list);
    },
    inject:["removeFocus","changeNavName","closeNavItem","alertSomething","addFile"],
    methods:{
        foldAll:function(){
            this.setFold(this.list,true);
        },
        unFoldAll:function(){
            this.setFold(this.list,false);
        },
        setFold:function(array,value){
            for(let i = 0;i<array.length;i++)
            {
                this.$set(array[i],"fold",value);
                if(array[i].children!=undefined)
                    this.setFold(array[i].children,value);
            }
        },
        getPath:function(item){
            return this.getDir(this.list,item);
        },
        getDir:function(array,item){
            for(let i = 0;i<array.length;i++)
                if(array[i] === item)
                    return item.name;
                else if(array[i].children!=undefined)
                {
                    let dir=this.getDir(array[i].children,item);
                    if(dir != "")
                        return array[i].name+"/"+dir;
                }
            return "";
        },
        deleteFile:function(item){
            let dir = this.getPath(item);
            if(dir=="")
                return;
            let submitObject = new FormData();
            submitObject.append("dir",dir);
            fetch(this.deleteUrl,{
                method:"post",
                body:submitObject
            }).then(function(response){
                return response.text();
            }).then((text)=>{
                // document.body.innerHTML=text;
                let json=JSON.parse(text);
                if(json.status==SUCCESS)
                {
                    this.removeItem(this.list,item);
                    this.closeNavItem(item);
                }
                else
                {
                    this.alertSomething("删除失败:"+json.information);
                }
            });
        },
        reNameFile:function(item,newName){
            let dir = this.getPath(item);
            if(dir=="")
                return;
            let submitObject = new FormData();
            submitObject.append("dir",dir);
            submitObject.append("name",newName);
            fetch(this.reNameUrl,{
                method:"post",
                body:submitObject
            }).then(function(response){
                return response.text();
            }).then((text)=>{
                let json=JSON.parse(text);
                if(json.status==SUCCESS)
                {
                    item.name=newName;
                    this.changeNavName(item,this.getPath(item));
                }
                else
                {
                    this.alertSomething("重命名失败:"+json.information);
                }
                this.sortList(this.list);
            });
        },
        removeItem:function(array,item)
        {
            for(let i = 0;i<array.length;i++)
            {
                if(array[i] === item)
                {
                    array.splice(i,1);
                    return;
                }
                else if(array[i].children!=undefined)
                    this.removeItem(array[i].children,item);
            }
        },
        createFile:function(name,isDir)
        {
            let item=this.focusUrl;
            dir=this.getPath(item);
            if(dir == "")
                dir=name;
            else
                dir=dir+"/"+name;
            let submitObject = new FormData();
            submitObject.append("dir",dir);
            submitObject.append("isDir",isDir);
            fetch(this.createUrl,{
                method:"post",
                body:submitObject
            }).then(function(response){
                return response.text();
            }).then((text)=>{
                let json=JSON.parse(text);
                if(json.status==ERROR)
                {
                    this.alertSomething("创建文件夹失败:"+json.information);
                }
                else
                {
                    this.removeFocus(this.list);
                    let newFile;
                    if(isDir)
                    {
                        newFile={
                            name:name,
                            type:"inline-dir",
                            children:[],
                            fold:true,
                            focus:true
                        }
                    }
                    else
                    {
                        newFile={
                            name:name,
                            type:"file-dir",
                            focus:true
                        }
                    }
                    if(item!==this.list)
                    {
                        item.children.push(newFile);
                        item.fold=false;
                    }
                    else
                        item.push(newFile);
                    this.sortList(this.list);
                    if(!isDir)
                    {
                        this.addFile(name,this.getPath(newFile),newFile)
                    }
                }
            });
        },
        getFocusUrl:function(array)
        {
            for(let i = 0;i<array.length;i++)
            {
                if(array[i].focus)
                {
                    if(array[i].children==undefined)
                        return true;
                    else
                        return array[i];
                }
                else if(array[i].children!=undefined)
                {
                    let dir=this.getFocusUrl(array[i].children);
                    if(dir===true)
                        return array[i];
                    else if(dir!==false)
                        return dir;
                }
            }
            return false;
        },
        sortList:function(array){
            array.sort(this.compare);
            for(let i = 0;i<array.length;i++)
                if(array[i].children!=undefined)
                    this.sortList(array[i].children);
        },
        compare:function(a,b)
        {
            if(a.children==undefined && b.children != undefined)
                return 1;
            else if(a.children!=undefined && b.children==undefined)
                return -1;
            else if(a.name>b.name)
                return 1;
            else if(a.name<b.name)
                return -1;
            else
                return 0;
        }
    }
});