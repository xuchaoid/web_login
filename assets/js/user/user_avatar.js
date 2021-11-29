$(function() {
    var layer = layui.layer
        // 实现用户头像区域的头像裁剪功能
        // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 裁剪区域配置选项设置
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域   使用cropper方法
    $image.cropper(options)

    // 给上传按钮绑定点击事件然后给文件选择框添加模拟手动点击事件
    $('#btn').on('click', function() {
            $('#file').click()
        })
        // 实现头像替换文件选择则需要给上传文件表单添加使用change事件选择事件实现选择文件上传
    $('#file').on('change', function(e) {
            //console.log(e); //获得选取的文件对象  事件对象e可以输出选择的文件
            // e.target.files  即选择的文件的个数和文件数量可以通过数组的方式选中选择的第几个文件
            var filelist = e.target.files
            if (filelist.length === 0) {
                layer.msg('请选择文件')
            }
            // ## 2. 更换裁剪的头像图片

            // 1. 拿到用户选择的文件

            //    ```js
            var file = e.target.files[0]
                //    ```

            // 2. 根据选择的文件，创建一个对应的 URL 地址：

            //    ```js
            //    var newImgURL = URL.createObjectURL(file)
            var imageURL = URL.createObjectURL(file)
                //    ```

            // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：

            //    ```js
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', imageURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
                //    ```
        })
        // 将选择更换后的图片更新至服务器
    $('#bt').on('click', function() {
        // 获取更换后裁剪好的头像图片   固定模式
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 发起服务器请求
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                // 同时更新页面上的头像重新从服务器获取用户信息重新渲染页面   使用子页面调用父页面的方法调用父页面的渲染函数
                window.parent.getUserInfo()
            }
        })
    })
})