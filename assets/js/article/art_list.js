$(function() {
    var form = layui.form
    var layer = layui.layer
        // 获取laypage方法对象
    var laypage = layui.laypage;
    // 定义模板引擎里边时间的格式化函数美化时间数据 使用模板引擎的方法 template.defaults.imports.dataFormat=function(){} 这个模板引擎的方法可以格式化模板里的时间数据对象  date 是接收过来的时间数据参数形参
    template.defaults.imports.dataFormat = function(date) {
            var dt = new Date(date) //首先实例化时间数据参数对象
                // 然后开始格式化
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '年' + m + '月' + d + '日' + hh + '时' + mm + '分' + ss + '秒'
                // return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义给个位数补零的函数 参数n就是需要判断数字是否补零
    function padZero(n) {
        return n > 9 ? n : '0' + n //n<10? '0' + n : n
    }
    // console.log(date);
    // 文章列表的渲染首先要从服务器获取列表数据才能渲染，而每次展示的具体列表向服务器请求时会携带一个对象参数来获取需要渲染出来的具体列表   所以获取需要的数据时首先定义一个对象参数  这个对象参数用于发起请求时要获取的具体数据值
    // 定义参数对象  用于向服务器发起请求时提交至服务器
    var q = {
        pagenum: 1, //指的是页码值，默认请求第一页的数据  必须携带
        pagesize: 2, //每页展示几条数据列表，默认显示两条  必须携带
        cate_id: '', //文章分类的id 可以忽略不是每次都需要携带
        state: '', //文章的发布状态  可以忽略不是每次都需要携带
    }


    // 获取服务器列表数据 并渲染在列表中  
    // 定义获取数据函数
    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);

                // 从服务器返回的数据中total数据为获取的数据列表的总条数
                if (res.status !== 0) {
                    return layer.msg('获取列表失败')
                }
                // layer.msg('获取列表成功')
                // 使用模板引擎快速渲染这些数据到表格  并使用变量接收
                var htmlStr = template('tpl-table', res)
                    // 将模板渲染给页面
                $('tbody').html(htmlStr)
                    // 数据获取完成后调用设置分页函数根据数据列表总条数渲染出分页  将总条数当作参数传递给函数
                renderPage(res.total)
            }
        })
    }
    // 获取所有列表分类名数据然后通过模板引擎渲染给所有分类
    // 定义获取分类列表函数
    // initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // layer.msg('获取分类数据成功！')
                // 调用模板引擎函数循环渲染数据到模板中 然后将模板数据赋值给页面元素
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('#cate_id').html(htmlStr)
                    // 因为异步问题所以这个文章分类下拉列表在程序第一次运行时并不会被layui的js文件发现渲染在页面中第一次运行时因为渲染结构为空所以会渲染出来一个空的列表，这时可以使用form.render()方法在程序第一次运行完毕后再次调用layui的js文件执行第二次运行发现新出现的页面结构渲染在页面中
                    // 使用form.render()方法 再次渲染页面ui结构
                form.render()
            }
        })
    }
    // 完成筛选条件渲染出筛选结果呈现在页面中 即将筛选表单中的筛选条件值发起请求发送到服务器然后根据筛选条件获取数据渲染在页面中
    // 首先给筛选添加表单提交监听事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // console.log(3333);
                // 获取筛选表单重点筛选条件值赋值数据对象中对应的属性向服务器发起筛选请求
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                // console.log(state);
                // 将筛选值赋值给赋值给数据对象q中对应的属性
            q.cate_id = cate_id
            q.state = state
                // console.log(q.cata_id);
                // 根据筛选条件重新获取列表数据值然后再次渲染在页面中
                // 调用获取数值函数
            initTable()
        })
        // 定义创建分页的函数


    function renderPage(total) {
        // 使用layui的laypage.render方法快速创建分页页面效果  使用这个方法要在页面上首先创建一个容器容纳laypage.render方法创建的分页 通常用div盒子容器  创建的这个盒子只能使用ID选择器  laypage.render方法具体的里边的属性设置可以查阅文档   laypage的方法使用首先也要在layui中获取他的方法对象才可以使用
        laypage.render({
            elem: 'pageBox', //这里elem属性的值为容器的id选择器名不加#   // 分页容器的 Id
            count: total, //count属性时数据总条数  需要从服务器获取  // 总数据条数
            curr: q.pagenum, //设置默认被选中的分页
            limit: q.pagesize, //设置一页显示几条数据 然后根据总数据条数生成多少分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //美化分页页面  里边的值需要按顺序设置
            limits: [2, 3, 5, 10], //设置每页条数的选择
            // 当根据数据条数完成分页渲染后点击渲染的分页中的每页展示条数需要使用jump属性的回调函数
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调   且容易形成死循环一致调用回调 所以通常在jump回调函数中使用其第二个参数first做为判断条件判断其回调触发是点击页面值触发还是render()方法触发然后执行其他的执行代码  方法触发的话first的值为true
            jump: function(obj, first) { //obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）  obj.curr 当前选的页码值  obj.limit 当前选则的一页展示几条数据
                if (!first) { //判断不是render()方法触发回调然后才执行渲染函数
                    // 将点击的页码值赋值给定义的数据对象q根据选中页面重新发起请求展示数据渲染页面
                    q.pagenum = obj.curr
                        // 将点击的一页展示几条数据的值赋值给定义的数据对象q根据选中页面重新发起请求展示数据渲染页面
                    q.pagesize = obj.limit
                        // 调用获取数据函数重新获取数据渲染页面  调用的同时要判断jump回调是点击页码值触发还是render()方法触发避免死循环

                    initTable()

                }
            }
        })
    }
    // 通过代理事件给删除按钮绑定点击删除事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取文章列表页面的文章删除按钮个数
        var len = $('.btn-delete').length
            // console.log(lth);
            // 获取当前点击列表的ID
            // var id = $(this).attr('data-id')
        var id = $(this).attr('data-id')
        console.log(id);
        // 弹出询问框然后发起删除服务器请求
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起删除请求并且再次调用获取数据函数重新渲染列表
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {

                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当文章删除成功后需要判断当前页面是否还有文章列表
                        // 如果没有文章了则当前的页码值需要减一之后再重新获取数据渲染列表，同时页码值最小只能是1
                        // 判断页码值是否减一可以根据页面中删除按钮的个数来判断是否减一
                    if (len === 1) {
                        // 根据判断删除按钮的个数来决定页码值是否减一,如果lth的值等于1，则不再减一直接返回数值1 页面值最小必须等于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 重新调用获取数据列表函数重新渲染列表
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})