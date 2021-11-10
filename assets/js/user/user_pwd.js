$(function() {
    // console.log(11);
    // 表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            samePwd: function(value) {
                // $('[name=oldPwd]').val()使用属性选则器选择这个表单的值
                if (value === $('#old').val()) {
                    return '新旧密码不能相同！'
                }
            },

            rePwd: function(value) {
                if (value !== $('#new').val()) {
                    return '两次密码不一致！'
                }
            }
        })
        // console.log(11);
        // 监听修改密码提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                    // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })

})