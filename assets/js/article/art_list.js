$(function() {

    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data)
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    };
    $('#form_search').on('submit', function(e) {
            e.preventDefault();
            var cate_id = $('[name=cate_id]').val();
            var state = $('[name=status]').val();
            q.cate_id = cate_id;
            q.state = state;
            initTable()
        })
        // 监听重置按钮的点击事件
    $('button[type="reset"]').on('click', function(e) {
        // 重置查询参数对象 q
        q = {
            pagenum: 1, // 页码值
            pagesize: 2, // 每页显示几条数据
            cate_id: '', // 分类 id
            state: '' // 发布状态
        }

        // 重新发起请求，获取列表数据
        initTable()
    })


    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 3],
            jump: function(obj, first) {
                // //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // console.log(first);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });
    }
    // // 编辑文章按钮的点击事件处理函数
    // $('tbody').on('click', '.btn-edit', function() {
    //     // 获取要编辑的文章的 id
    //     const id = $(this).attr('data-id')
    //         // 跳转到文章编辑页面
    //     location.href = '/article/art_edit.html?id=' + id
    // })

    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {

                    if (res.status !== 0) {
                        return layer.msg("删除失败！")
                    } else {
                        layer.msg('删除成功！')
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable();
                    }
                }
            })
            layer.close(index);
        });

    })


})