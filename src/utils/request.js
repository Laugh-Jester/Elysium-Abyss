import axios from 'axios'
import {user} from '@/stores'
import {ElMessage} from 'element-plus'
import router from '@/router'

const baseURL='http://big-event-vue-api-t.itheima.net'

const instance=axios.create({
  //1. 基础地址.超时时间
  baseURL,
  timeout:10000,
})


//请求拦截器
instance.interceptors.request.use(
  (config)=>{
    //2. 携带token
    const useStore=user() 
    if (useStore.token){
      config.headers.Authorization=useStore.token
    }
    return config
  },
  (err)=>Promise.reject(err)
)

//响应拦截器
instance.interceptors.response.use(
  (res)=>{
    //3. 处理业务失败
    //4. 提取核心响应数据
    if(res.data.code===0){
      return res
    }
    //处理失败,给错误提示，抛出错误
    ElMessage.error(res.data.message||'服务异常')
    return Promise.reject(res.data)
  },
  (err)=>{
    //5. 处理401错误
    if(err.response?.status===401){
      router.push('/login')
    }
    ElMessage.error(err.response.data.message||'服务异常')
    return Promise.reject(err)
  }
)

export default instance
export {baseURL}
