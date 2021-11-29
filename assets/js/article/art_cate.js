$(function() {
    var layer = layui.layer
    var form = layui.form
        // 发起请求获取文章分类列表数据的函数并渲染到列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // 获取服务器返回的数据
                // console.log(res);
                // 使用模板引擎快速渲染这些数据到表格  并使用变量接收
                var htmlStr = template('tpl-table', res)
                    //    渲染表格数据到列表
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加类别按钮绑定点击事件
    // 定义一个空的打开弹出层索引变量接收弹出层索引数据
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            // 点击后出现弹出层页面使用layer.open方法   每次打开一个弹出层都会自动生成一个对应的索引  这个索引用于使用layer.close()方法关闭这个对应的弹出层使用
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                // 使用模板定义弹出层表单，然后将定义的模板赋值给父元素节点
                content: $('#dialog-add').html()
            })
        })
        // 因为添加类别的弹出层里的表单并非直接写在页面上而是并通过模板的方式定义出来的所以监听以及给这个弹出层里边的元素添加各种事件都需要通过代理的方式进行添加
        // 代理事件的语法为   代理元素对象（通常是父元素对象）.on('事件类型'，'需要绑定事件的元素对象',function(){})

    //通过代理事件 form-add为这个表单首先添加表单提交的监听事件阻止默认提交  添加表单事件  
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
                // 发起请求将新增分类列表提交至服务器
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败！')
                    }
                    // 添加成功则重新获取服务器数据渲染添加列表  调用获取列表数据函数
                    initArtCateList()
                    layer.msg('新增分类成功！')
                        // 同时关闭添加分类弹出层  调用layer的close方法
                    layer.close(indexAdd)
                }
            })
        })
        //通过代理事件 为编辑修改按钮添加绑定点击事件  将事件绑定给父元素然后代理给需要绑定的元素
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 点击后创建修改列表的弹出层
        indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            })
            // 发起请求获取对应点击的分类的数据信息填充在修改列表弹出层中  首先获取服务器返回分类数据的id数据值
            // 通过自定义属性获取对象的分类列表的ID值
        var id = $(this).attr('data-id')
            // console.log(id);
            // 发起请求获取对象ID的分类列表的数据信息
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                //   使用layui的from.val()方法快速给表单填充数据   即将获取的分类列表的数据渲染在修改弹出层表单中  首先给表单添加lay-filter属性
                form.val('form-edit', res.data)
            }


        })
    })


    // 通过代理事件 为修改弹出层绑定监听提交事件 并且将修改后的数据提交至服务器并且重新获取服务器数据渲染列表数据
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                // 获取修改分类表单修改后的数据
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！')
                    }
                    layer.msg('更新分类数据成功！')
                        // 关闭修改分类弹出层
                    layer.close(indexEdit)
                        // 重新获取服务器数据渲染列表
                    initArtCateList()
                }
            })
        })
        //通过代理事件 为删除按钮添加绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //  获取点击删除的当前的分类的id值
        var id = $(this).attr('data-id')
            // 使用layer的询问提示框方法弹出提示询问框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起请求删除服务器中需要删除的分类并且重新获取数据渲染更新列表
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                        //   重新获取服务器数据并渲染列表
                    initArtCateList()
                }
            })

        })
    })
})