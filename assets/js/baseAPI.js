// JQ中有一个方法$.ajaxPrefilter可以给每次请求服务器端口拼接根路径在自己的js文件中每次向服务器发起的请求可以通过该方法给端口拼接上端口的根路径从而发起真正的请求
$.ajaxPrefilter(function(options) { //option即发起服务器请求获取到的请求信息然后在这个信息中给url拼接上根路径就可以发起真正的请求了
    // 在发起真正的 Ajax 请求之前，统一给所有请求接口拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // console.log(options.url); 
        // 统一为有权限的接口添加请求头   只为需要权限访问的接口添加
    if (options.url.indexOf('/my') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token' || '') }
    }

    // 全局统一给所有请求添加complete回调函数
    // 不论访问是否成功都会执行ajax的complete回调函数
    options.complete = function(res) {

        // 通过服务器返回数据中的responseJSON.status和responseJSON.message的值进行判断访问是否为正确访问方式
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 如果访问方式不正确则清空从服务器获得存储在本地数据值以及强制返回至登录页面
            localStorageNaNpxoveItem('token');
            location.href = '/login.html'
        }

    }
})