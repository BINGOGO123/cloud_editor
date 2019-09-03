Vue.component("text-nav",{
    template:`
    <div class="text-bar">
        <template>
            <i class="fa fa-floppy-o text-nav-operate" title="保存当前文件" @click="saveContent(focus);"></i>
            <i class="fa fa-file text-nav-operate" title="保存所有文件" @click="saveAll();"></i>
            <i class="fa fa-refresh text-nav-operate" title="刷新" @click="gotoRefresh"></i>
            <div class="text-nav">
                <div :class="{'text-nav-item':true,focus:index==focus,saved:!file.saved}"  @click.self="changeNavFocus(index);" v-for="(file,index) in fileList" :key="index" :title="file.name">
                    <div class="text-nav-item-name" @click.stop="changeNavFocus(index);">{{file.name}}</div>
                    <i :class='{fa:true,"fa-times":!faClass[index].status,"fa-times-circle":faClass[index].status}' @mouseenter="addFaClass(index);" @mouseleave="removeFaClass(index);" @click="closeF(index);"></i>
                </div>
            </div>
        </template>
    </div>
    `,
    props:{
        fileList:{
            type:Array,
            required:true
        },
        focus:{
            type:Number,
            required:true
        }
    },
    data:function(){
        return {
            faClass:[]
        }
    },
    created:function(){
        for(let i = 0;i<this.fileList.length;i++)
            this.faClass.push({
                item:this.fileList[i].item,
                status:false
            });
    },
    watch:{
        fileList:function(){
            if(this.fileList.length == this.faClass.length)
                return;
            else if(this.fileList.length > this.faClass.length)
                this.faClass.push({
                    item:this.fileList[this.fileList.length-1].item,
                    status:false
                });
            else
            {
                for(let i = 0;i<this.fileList.length;i++)
                    if(this.fileList[i].item === this.faClass[i].item)
                        continue;
                    else
                    {
                        this.faClass.splice(i,1);
                        console.log(i);
                        return;
                    }
                this.faClass.splice(this.faClass.length-1,1);
            }
        }
    },
    methods:{
        addFaClass:function(index){
            // this.$set(this.faClass,index,true);
            this.faClass[index].status=true;
        },
        removeFaClass:function(index){
            // this.$set(this.faClass,index,false);
            this.faClass[index].status=false;
        },
        gotoRefresh:function(){
            this.getModel({
                type:"button",
                buttonList:["确认","取消"],
                value:"",
                info:"是否刷新文件内容?已更改内容将不会自动保存，请谨慎操作",
                fun:(index)=>
                {
                    if(index != 0)
                        return;
                    this.refresh();             
                }
            });
            // if(!confirm("是否刷新文件内容，已更改内容将不会自动保存，请谨慎操作"))
            //     return;
            // this.refresh();
        },
        closeF:function(index)
        {
            if(this.fileList[index].saved)
                this.closeFile(index,false);
            else
                this.getModel({
                    type:"button",
                    buttonList:[
                        "保存",
                        "不保存",
                        "取消"
                    ],
                    value:"",
                    info:"当前文件已经被修改，是否保存？",
                    fun:(order)=>
                    {
                        if(order==0)
                            this.closeFile(index,true);
                        else if(order==1)
                            this.closeFile(index,false);                    
                    }
                });
        }
    },
    inject:["changeNavFocus","saveContent","saveAll","refresh","getModel","closeFile","getModel"]
});

Vue.component("editor-area",{
    template:`
    <textarea class="editor-area" :value="value" @input="update"></textarea>
    `,
    props:{
        value:{
            type:String,
            required:true
        },
        index:{
            type:Number,
            required:true
        }
    },
    inject:["updateContent"],
    methods:{
        update:function(e){
            this.updateContent(this.index,e.target.value);
        }
    }
});

Vue.component("editor-system",{
    template:`
    <div class="editor-system">
        <template v-if="fileList.length">
            <text-nav :fileList="fileList" :focus="focus"></text-nav>
            <editor-area v-for="(content,index) in fileList" :value="content.content" :key="index" v-show="index==focus" :index="index"></editor-area>
        </template>
        <div v-else class="empty-alert">
            点击目录中的文件来打开一个文件
        </div>
    </div>
    `,
    props:{
        fileList:{
            type:Array,
            required:true
        },
        focus:{
            type:Number,
            default:0
        }
    },
    methods:{
        updateContent:function(index,value){
            this.fileList[index].content=value;
            this.fileList[index].saved=false;
        }
    },
    provide:function(){
        return {
            updateContent:this.updateContent
        };
    }
});