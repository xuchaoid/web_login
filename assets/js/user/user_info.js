$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo()
        // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            // // headers 就是请求头配置对象   已经在BASEAPI中统一配置
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            //   },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                // 使用form.val('lay-filter的值',需要赋值的数据对象)方法快速给表单赋值  使用该方法则需要赋值的表单中必须添加lay-filter=""属性否则无法使用
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置表单数据
    $('#btnRest').on("click", function(e) {
            // 阻止函数的默认提交或者重置等默认行为
            e.preventDefault();
            // 再次调用初始化用户信息数据
            initUserInfo()
                // console.log('1');0
        })
        // 提交修改的用户信息并更新
        // 监听表单的提交事件
        // data: $(this).serialize(), 获取表单的信息发送到服务器
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                    // 子页面嵌套在父页面中子页面调用父页面的方法使用  window.parent.父页面中的方法名
                    // 调用父页面中的获取用户信息方法将修改后提交到服务器的新用户信息渲染页面
                window.parent.getUserInfo()
            }
        })
    })
})