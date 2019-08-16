/**
 * axios初始化配置
 * --------------------------------------
 * 大部分接口以这个为基础
 */

import axios from 'axios';
import router from '../router';

const instance = axios.create({
    baseURL: `${window.location.protocol}//${window.location.host}/api/`,
    withCredentials: true,
    params: {},
    timeout: 25000, // 请求超时时间
});

instance.interceptors.request.use(
    (request) => {
        const axiosRequest = {
            ...request,
            params: {
                ...request.params,
            },
            headers: {
                Pragma: 'no-cache',
                'Cache-Control': 'no-cache',
                ...request.headers,
            },
            responseType: request.responseType,
        };
        return axiosRequest;
    },
    (error) => Promise.reject(error),
);

// 请求成功状态码      0
// 未授权（未登录）  97
// 无权限访问             40001
// 非法请求                 40002
// 无效的请求参数       40003
// 请求接口不存在       40004
// 无效请求方法           40005
// 不是超级管理员访问           40006
// 系统异常                  100
// 系统繁忙                  101
instance.interceptors.response.use(
    (response) => {
        const code = Number(response.data.code);
        if (code !== 0 && code) {
            console.error(response.data.message);
            if (code === 40001) {
                router.push('/401');
            }
            if (code === 97) {
                router.push('/Login');
            }
        }
        return response;
    },
    (error) => {
        let message = error.message;
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            message = '请求超时';
        }
        if (error.toString() !== 'Cancel') {
            console.error(message);
        }
        return Promise.reject(error);
    },
);
export default instance;
