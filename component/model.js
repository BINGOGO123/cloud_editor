Vue.component("model-div",{
    template:`
    <div class="model-div">
        <div class="model-display">
            <div class="model-display-info">
                <slot>请操作</slot>
            </div>
            <input class="model-display-input" v-if="type=='input'" type="text" ref="inputSon" :value="value" @input="$emit('input',$event.target.value);"/>
            <div :class="{'button-bar':true,'button-right':align=='right'}" v-if="type=='button'">
                <button v-for="(button,index) in buttonList" :key="index" @click="$emit('choose',index)">{{button}}</button>
            </div>
            <div class="button-bar" v-else>
                <button @click="$emit('ensure',true)">确认</button>
                <button @click="$emit('ensure',false)">取消</button>
            </div>
        </div>
    </div>
    `,
    props:{
        type:{
            type:String,
            default:"input"
        },
        value:{
            type:String
        },
        buttonList:{
            type:Array
        },
        align:{
            type:String,
            required:true
        },
        start:{
            type:Boolean,
            required:true
        }
    },
    mounted:function(){
        this.$refs.inputSon.focus();
    }
});