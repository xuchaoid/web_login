$(function() {
    // 点击去注册切换到注册页面
    $("#link_reg").on('click', function() {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").click(function() {
            $(".login-box").show();
            $(".reg-box").hide();
        })
        // 首先获取layui中的form对象然后使用form的verify方法设置自定义验证规则
    var form = layui.form
        // 获取layui中的layer对象然后使用layer其中的方法
    var layer = layui.layer
        // form.verify自定义校验规则
    form.verify({
            // 密码校验规则
            pass: [
                /^[\S]{6,12}$/,
                '密码必须是6到12位,且不能出现空格'
            ],
            // 确认密码校验规则
            repass: function(value) {
                // 校验规则为确认密码框的值和密码框的值相对比然后返回提示消息
                // value为形参确认密码框的值
                var pass = $('.reg-box [name=password]').val();
                // console.log(pwd);
                // console.log(value);
                if (pass !== value) {
                    return '两次密码不一致，请重新输入'
                }
            }
        })
        // 监听注册事件 form表单向服务器发起请求提交事件  submit提交事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault() //阻止表单的默认提交行为
            var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            };
            $.post('/api/reguser', data,
                function(res) {
                    if (res.status !== 0) {
                        // layer.msg使用layui的layer方法设置提示弹出层做出提示  使用layui的layer方法首先要获取其中的layer对象才可以使用layer方法
                        return layer.msg(res.message);
                    }
                    layer.msg('注册成功');
                    // 注册完成后自动触发点击事件点击去登陆跳转到登录页面  给去登录绑定自动触发点击事件
                    $("#link_login").click();
                })
        })
        // 监听登录事件和注册事件类似
    $('#form_login').submit(function(e) {
        e.preventDefault(); //阻止默认行为
        $.ajax({
            url: '/api/login',
            type: 'POST',
            // data: {
            //     username: $('#form_reg [name=username]').val(),
            //     password: $('#form_reg [name=password]').val()
            // },
            // $(this).serialize()快速获取表单的数据值
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) { return layer.msg('登录失败') }
                layer.msg('登录成功')
                    // 如果登录成功会从服务器返回一些数据其中的token数据里边包含一个令牌密钥为后面使用权限接口获取数据必须的
                console.log(res.token);
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                //  登录成功后跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})