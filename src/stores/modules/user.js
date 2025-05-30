import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';



export const user = defineStore('user', () => {
  // 登录
  const user = ref({
    username: '',
    password: '',
    repassword: '',
  });

  const router=useRouter();
  // 新注册
  const newuser = ref({
    username: '',
    password: '',
    repassword: '',
  });

  // 报错信息
  const error = ref({
  user:{
    username: '',
    password: '',
  },
  newuser:{
    username: '',
    password: '',
    repassword:'',
  }
});

  // 弹窗消息
  const errorRef = ref('');

  // 正则
  const rules = reactive({
    username: [
      { required: true, message: '⚠️请输入正确的用户名', trigger: 'blur' },
      { min: 8, message: '⚠️长度应该大于8', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9]+$/, message: '⚠️只能输入字母和数字', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '⚠️请输入正确的密码', trigger: 'blur' },
      { min: 8, message: '⚠️长度应该大于8', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9]+$/, message: '⚠️只能输入字母和数字', trigger: 'blur' },
    ],
    repassword:[
      {repeat:true,message:'⚠️和第一次密码不一样',trigger:'blur'},
    ]
  });

  // 报错函数
  //1. 单独判断
  const validateField = (mod,field) => {
    let data='';
    let name='';
    if(mod==1){
     data=user.value
     name='user';
    }
    else{data=newuser.value;name='newuser'}
    error.value[name][field] = '';
    const fieldRules = rules[field];
    if (!fieldRules) {
      return false;
    }
    for (const rule of fieldRules) {
      if (!data[field]) {
        error.value[name][field] = rule.message;
        return false;
      }
      if (data[field].length < rule.min) {
        error.value[name][field] = rule.message;
        return false;
      }
      if (rule.pattern && !rule.pattern.test(data[field])) {
        error.value[name][field] = rule.message;
        return false;
      }
      if(newuser.value['repassword']!=newuser.value['password']){
          error.value[name]['repassword']=rules.repassword[0].message
          return false;
      }
    }
    return true;
  };
  //全局判断
  const validateForm = (mod) => {
    // Promise初始化
    return new Promise(async(resolve) => {
      let valid = true;
      for (const field of ['username','password']) {
        const isFieldValid = validateField(mod,field);
        if (!isFieldValid) {
          valid = false;
        }
      }
      if (!valid) {
        errorRef.value = ['用户名或密码错误','可恶 😡'];
        resolve(errorRef.value);
      }
      else {
        if(mod==1){
        try {
          const response = await axios.get('http://localhost:3000/users', {
            params: {
              username: user.value['username'],
              password: user.value['password'],
            },
          });
          if (response.data.length > 0) {
            errorRef.value = ['登录成功！！！','奈斯呀 😊'];
            router.push('/');
            //地址移动
          } else {
            errorRef.value = ['用户名或密码错误', '可恶 😡'];
          }
          console.log('当前 errorRef 内容:', errorRef.value);
          resolve(errorRef.value);
        } catch  {
          errorRef.value = ['请求错误', '网络问题 😢'];
          resolve(errorRef.value);
        }
      }
      else{
        try {
          const response = await axios.get('http://localhost:3000/users', {
            params: {
              username: newuser.value['username'],
            },
          });
          if (response.data.length > 0) {
            errorRef.value = ['该用户名已被注册','可恶 😡'];

          } else {
            await axios.post('http://localhost:3000/users',{
              username:newuser.value['username'],
              password:newuser.value['password'],
              id:Date.now() + Math.random(),
            })
            errorRef.value = [newuser.value['username'],'用户注册成功！！！', '奈斯呀 😊'];
          }
          resolve(errorRef.value);
        } catch (error) {
          console.error('请求出错:', error);
          errorRef.value = ['请求错误', '网络问题 😢'];
          resolve(errorRef.value);
        }
      }
      }
    });
  };

  return { user, newuser, validateField, error, validateForm};
});

