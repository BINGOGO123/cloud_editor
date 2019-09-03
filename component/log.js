const SUCCESS=0;
const ERROR=1;

Vue.component("log-in",{
    inheritAttrs:false,
    template:`
    <div>
        <form>
            <label><span>邮箱</span><input v-model="email" type="email" /></label>
            <label><span>密码</span><input v-model="password" type="password" /></label>
            <button @click.prevent="submit">登录</button>
        </form>
    </div>
    `,
    data:function(){
        return {
            email:"",
            password:""
        }
    },
    methods:{
        submit:function(){
            if(this.email=="")
            {
                alert("请输入邮箱");
                return;
            }
            else if(this.password=="")
            {
                alert("请输入密码");
                return;
            }
            let submitObject = new FormData();
            submitObject.append("email",this.email);
            submitObject.append("password",this.password);
            fetch(this.loginUrl,{
                method:"post",
                body:submitObject
            }).then(function(response){
                return response.text();
            }).then((text)=>{
                let json = JSON.parse(text);
                if(json.status==SUCCESS)
                {
                    this.$emit("login-success");
                }
                else if(json.status==ERROR)
                {
                    alert("登录失败"+json.information);
                }
                else
                {
                    alert("收到服务器为止消息"+json.information);
                }
            });
        }
    },
    props:{
        loginUrl:{
            type:String,
            required:true
        }
    }
});

Vue.component("log-register",{
    inheritAttrs:false,
    template:`
    <div>
        <form>
            <label><span>邮箱</span><input type="email" :style="emailStyle" v-model="email" name="email" /></label>
            <label><span>昵称</span><input type="text" v-model="userName" name="user-name" /></label>
            <label><span>密码</span><input type="password" v-model="password" name="password" :style="passwordStyle" /></label>
            <label><span>确认密码</span><input type="password" v-model="rePassword" :style="passwordStyle" /></label>
            <button @click.prevent="submit">注册</button>
        </form>
    </div>
    `,
    data:function(){
        return {
            email:"",
            password:"",
            rePassword:"",
            userName:"",
            emailStyle:{},
            passwordStyle:{}
        };
    },
    watch:{
        email:function(){
            if(this.email != "" && !/[\w]+@[\w]+\.[a-zA-Z]+/.test(this.email))
                this.$set(this.emailStyle,"color","red");
            else
                this.$set(this.emailStyle,"color","black");
        },
        password:function(){
            if(this.password == "" || this.rePassword=="")
                this.$set(this.passwordStyle,"color","black");
            else if(this.password != this.rePassword)
                this.$set(this.passwordStyle,"color","red");
            else
                this.$set(this.passwordStyle,"color","black");
        },
        rePassword:function(){
            if(this.password == "" || this.rePassword=="")
                this.$set(this.passwordStyle,"color","black");
            else if(this.password != this.rePassword)
                this.$set(this.passwordStyle,"color","red");
            else
                this.$set(this.passwordStyle,"color","black");
        }
    },
    methods:{
        submit:function(){
            if(!/[\w]+@[\w]+\.[a-zA-Z]+/.test(this.email))
            {
                alert("邮箱错误");
                return;
            }
            if(this.password == "" || this.rePassword == "" || this.password != this.rePassword)
            {
                alert("密码错误");
                return;
            }
            if(this.userName=="")
            {
                alert("请输入昵称");
                return;
            }
            let submitObject = new FormData();
            submitObject.append("email",this.email);
            submitObject.append("password",this.password);
            submitObject.append("userName",this.userName);
            fetch(this.registerUrl,{
                method:"post",
                body:submitObject
            }).then(function(response){
                return response.text();
            }).then((text)=>{
                let json=JSON.parse(text);
                if(json.status==SUCCESS)
                {
                    alert("注册成功");
                    this.password=this.rePassword=this.userName=this.email="";
                    this.$emit("change-login");
                }
                else if(json.status==ERROR)
                {
                    alert("注册失败"+json.information);
                }
                else
                {
                    alert("收到服务器其他消息："+json.information);
                }
            });
        }
    },
    props:{
        registerUrl:{
            type:String,
            required:true
        }
    }
});

Vue.component("log-div",{
    template:`
    <div>
        <div>
            <button @click="choice='log-in'">登录</button>
            <button @click="choice='log-register'">注册</button>
        </div>
        <keep-alive>
            <component
            :is="choice"
            :loginUrl="loginUrl"
            :registerUrl="registerUrl"
            @change-login="changeLogin"
            @login-success="loginSuccess"
            ></component>
        </keep-alive>
    </div>
    `,
    data:function(){
        return {
            choice:"log-in"
        };
    },
    props:{
        loginUrl:{
            type:String,
            required:true
        },
        registerUrl:{
            type:String,
            required:true
        }
    },
    methods:{
        changeLogin:function(){
            this.choice="log-in";
        },
        loginSuccess:function(){
            window.location="editor.html";
        }
    }
});