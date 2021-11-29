$(function() {
    var layer = layui.layer
    var form = layui.form

    // 定义文章加载文章分类的函数方法 根据服务器获取回来的文章分类数据渲染在下拉表单中
    // 定义加载文章分类的方法
    initCate()
        // 调用初始化富文本编辑器函数方法
    initEditor()

    function initCate() {
        // 发起请求获取文章分类数据
        $.ajax({
            medthod: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别列表数据失败')
                }
                // 调用模板引擎含数  渲染下拉列表
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 在模板引擎中渲染下拉表单在完成渲染之后一定要再次调用form.render()方法重新再次渲染
                form.render()
            }
        })
    }
    // 一实现基本裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 创建选择文件上传change事件当点击选择文件是模拟点击文件上传隐藏域
    // 首先给选择文件添加点击事件当点击时同时模拟点击事件唤起文件上传隐藏域
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        // 为文件选择隐藏文本域添加文件选择上传的change事件选择文件上传
    $('#coverFile').on('change', function(e) {
            // 二更换裁剪的图片   更换裁剪的图片需要在选择文件上传事件中进行
            // 1. 拿到用户选择的文件    获取到选择上传的文件的数组  
            var files = e.target.files[0]
                // 判断是否选择了文件
            if (files.length === 0) {
                return layer.msg('请选择文件')
            }
            // 2. 根据选择的文件，创建一个对应的 URL 地址：   
            var newImgURL = URL.createObjectURL(files)
                // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 文章发布
        // 首先判断文章发布状态是什么, 然后将表单中的数据通过请求发送给服务器, 在发送是携带的数据按要求是一个FormData对象所以要根据form表单创建这个对象然后完成上传需要的参数对象
        // 首先创建发布状态变量根据点击发布和草稿来存储这个变量的值为什么
    var art_state = '已发布'
        // 给存为草稿绑定点击事件,让点击时让发布状态值变为草稿
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        // 给表单绑定监听事件,监听表单的提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            // 因为发布文章上传服务器的数据要求为FormData对象 所以使用new实例化对象基于表单快速创建一个文章数据对象存储发布文章的数据上传服务器   new FormData(表单对象名[0]))  创建的这个数据对象包含了表单中填写的数据值
        var fd = new FormData($(this)[0])
            // 因发送服务器的数据对象中需要包含发布状态所以将发布状态值追加进入数据对象
        fd.append('state', art_state)

        // 因发送服务器的数据对象中需要包含图片封面属性所以首先要获取裁剪后的封面文件数据然后将文件数据添加到对象中
        // 获取裁剪后的图片数据文件
        // 将封面裁剪过后的图片，输出为一个文件对象

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作  后续操作只能在画布输出的文件对象方法.toBlob()的回调函数中进行
                // 将封面输出的图片文件对象追加到发送服务器的数据对象中
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    //     // 遍历追加数据后的formdata实例化对象
                    // fd.forEach(function(v, k) {
                    //         console.log(k, v);


                //     })
                // 监听点击了发布事件然后调用发布文章的服务器请求函数方法
                publishArticle(fd)
            })


    })

    // 定义一个发布文章的请求方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})