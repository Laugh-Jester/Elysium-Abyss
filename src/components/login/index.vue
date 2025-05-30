<script setup>
import {user} from '@/stores/modules/user.js'
import {ref} from 'vue'
import ErrorMessage from './view/ErrorMessage.vue'
const Users=user()
function startAnimation(){
  Users.error.user.username='';
  Users.error.user.password='';
  const box=document.getElementById('login-box');
  const box1=document.getElementById('register-box');
  const box2=document.getElementById('to-reg');
  const box3=document.getElementById('to-login');
  box.classList.add('move-down');
  box.classList.remove('move-up');
  box1.classList.add('move-right-visible');
  box1.classList.remove('move-left-hidden');
  box2.classList.add('hidden');
  box2.classList.remove('visible');
  box3.classList.add('move-left-visible');
  box3.classList.remove('move-right-hidden');
}
function endAnimation(){
  Users.error.newuser.username=''
  Users.error.newuser.password=''
  Users.error.newuser.repassword=''
  const box=document.getElementById('login-box');
  const box1=document.getElementById('register-box');
  const box2=document.getElementById('to-reg');
  const box3=document.getElementById('to-login');
  box.classList.add('move-up');
  box.classList.remove('move-down');
  box1.classList.add('move-left-hidden');
  box1.classList.remove('move-right-visible');
  box2.classList.add('visible');
  box2.classList.remove('hidden');
  box3.classList.add('move-right-hidden');
  box3.classList.remove('move-left-visible');
}

const errorRef=ref()
const usernameError=ref(false)
const passwordError=ref(false)
const repasswordError=ref(false)
</script>

<template>
  <ErrorMessage ref="errorRef"></ErrorMessage>
<div class="box">
  <div class="center-box">
<div id="login-box">
  <h2>登录</h2>
  <input type="text" placeholder="请输入您的用户名" class="input" v-model="Users.user.username" @blur="usernameError=!Users.validateField(1,'username')">
  <div v-if="usernameError" class='error-output'>{{ Users.error.user.username }}</div>
  <input type="password" placeholder="请输入您的密码" class="input" v-model="Users.user.password" @blur="passwordError=!Users.validateField(1,'password')">
  <div v-if="passwordError" class="error-output">{{ Users.error.user.password }}</div>
  <p>忘记密码？</p>
  <button class="btn" @click="async () => {
  const message = await Users.validateForm(1);
  errorRef.addMessage(message[0], message[1]);}">登录</button>
</div>
<div id="register-box">
  <h2>注册</h2>
  <input type="text" placeholder="请输入您的用户名" class="input" v-model="Users.newuser.username" @blur="usernameError=!Users.validateField(0,'username')">
  <div v-if="usernameError" class='error-output'>{{ Users.error.newuser.username }}</div>
  <input type="password" placeholder="请输入您的密码" class="input" v-model="Users.newuser.password" @blur="passwordError=!Users.validateField(0,'password')">
  <div v-if="passwordError" class="error-output">{{ Users.error.newuser.password }}</div>
  <input type="password" placeholder="请再次输入您的密码" class="input" v-model="Users.newuser.repassword" @blur="repasswordError=!Users.validateField(0,'repassword')">
  <div v-if="true" class="error-output">{{ Users.error.newuser.repassword }}</div>
  <button class="btn" @click="async () => {
  const message = await Users.validateForm(0);
  errorRef.addMessage(message[0], message[1]);}">注册</button>
</div>
<div id="to-reg">
  <h2>还没有账号？</h2>
  <p>立即注册吧 😘</p>
  <button @click="startAnimation">注册</button>
</div>
<div id="to-login">
  <h2>已有账号？</h2>
  <p>请登录 🥰</p>
  <button @click="endAnimation">登录</button>
</div>
</div>
</div>
</template>

<style scoped>
/* 零级：大盒子 */
.box{
  display:flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width:100%;
  height:100vh;
  background-image:url('https://w.wallhaven.cc/full/9d/wallhaven-9dkoxw.jpg');
  background-size:cover;
  background-position: center;
  background-repeat: no-repeat;
}
/* 一级：中间盒子 */
.center-box{
display:flex;
flex-direction: row;
background-color:rgba(255,255,255,0.3);
overflow:hidden;
position:absolute;
border-radius:20px;
}
/* 二级：登录盒子 */
#login-box{
  width:25vw;
  height:55vh;
  background-color:rgba(245,245,245,0.9);
  padding:20px;
  border-radius: 5px;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color:#2e2e2e;
}
#login-box button{
  background-color:rgba(49,49,49,1);
  color:#f2f2f2;
}
/* 二级：注册盒子 */
#register-box{
  position:absolute;
  width:25vw;
  height:55vh;
  background-color:rgba(245,245,245,0.9);
  padding:20px;
  border-radius: 5px;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color:#2e2e2e;
  opacity:0;
  z-index:-1;
}
/* 二级：切换注册 */
#to-reg{
  background-color:rgba(46,46,46,0.9);
  width:25vw;
  height:55vh;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color:#f2f2f2;
}
#to-reg h2{
  margin-bottom:25px;
}
#to-reg button{
  background-color:#2e2e2e;
  color:#f2f2f2;
  border:1px solid #f2f2f2;
}
/* 二级：切换登录 */
#to-login{
  position:absolute;
  background-color:rgba(46,46,46,0.9);
  left:50%;
  width:25vw;
  height:55vh;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color:#f2f2f2;
  opacity:0;
  z-index:-1;
}
#to-login h2{
  margin-bottom:25px;
}
#to-login button{
  background-color:#2e2e2e;
  color:#f2f2f2;
  border:1px solid #f2f2f2;
}
/* 共用标签 */
.input{
  height:10%;
  width:80%;
  font-size:90%;
  border:1px solid darkgoldenrod;
  border-radius: 20px;
  padding:5%;
  margin-top:20px;
  transition:all 0.3 ease;
  background-color:rgba(255,255,255,0);
}
.input:focus{
border:1px solid darkred;
outline:none;
background-color:#f1f1f1;
box-shadow:0 0 15px rgba(175, 76, 97, 0.425);
}
button{
  width:35%;
  height:10%;
  margin:13px;
  border-radius: 20px;
  border:none;
  cursor:pointer;
  transition: transform 0.3s ease;
  font-size:15px;
}

button:hover {
  animation: lager 0.3s alternate 2;
}
h2{
  font-size:32px;
}
p{
  font-size:13px;
  font-weight:bold;
  margin:10px;
}
.error-output {
  color: red;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
  opacity: 0;
  animation:visible 0.6s forwards;
}
</style>
