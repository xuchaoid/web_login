// 使用JQ的js的入口函数
$(function() {
        // 调用函数获取用户基本信息  渲染页面
        getUserInfo()
            // 获取layui的layer的对象
        var layer = layui.layer
            // 添加点击退出事件实现退出功能
        $('#btnLogout').on('click', function() {
            // 使用layui的layer的confirm提示询问框方法做出退出提示询问  首先要获取layer对象然后使用其方法
            layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
                // 确定退出登录后首先清空本地存储的获取的服务器信息
                localStorage.removeItem('token')
                    // 2. 重新跳转到登录页面
                location.href = '/login.html'
            })
        })
    })
    // 向服务器发起请求获取用户基本信息  并渲染页面
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // 带有/my开头的接口都是有访问权限的接口需要在请求中添加headers这个请求头对象，里边的属性以及值为Authorization：登录时从服务器返回的数据中的token密钥值
        // headers: {
        //     Authorization: localStorage.getItem('token' || '')
        // },
        success: function(res) {
            // 这里的res就是从服务器获取的用户信
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 如果获取成功的话则开始使用数据渲染用户头像，调用渲染头像的函数
            renderAvatar(res.data)
        },
        // 不论访问是否成功都会执行ajax的complete回调函数
        // complete: function(res) {
        //     // 通过服务器返回数据中的responseJSON.status和responseJSON.message的值进行判断访问是否为正确访问方式
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 如果访问方式不正确则清空从服务器获得存储在本地数据值以及强制返回至登录页面
        //         localStorage.removeItem('token');
        //         location.href = '/login.html'
        //     }
        // }
    })
}
// 渲染用户头像函数
function renderAvatar(user) {
    // 获取渲染用户名称   user.nicknmame  用户的昵称    user.username  用户的登录名称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 按照是否设置头像渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').atter('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
            // 获取用书名的第一个字符    toUpperCase()这个方法时英文字符变为大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}