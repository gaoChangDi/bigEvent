$(function() {
    // 点击“去注册账号”
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    // 点击“去登录”
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    //点击眼睛显示隐藏
    function show_hide(i) {
        var pwd = document.querySelectorAll('.layui-form-item .pwd');
        var eye = document.querySelectorAll('#eye');
        var flag = 0;
        eye[i].onclick = function() {
            if (flag == 0) {
                pwd[i].type = 'text';
                eye[i].src = './assets/images/open.png'
                flag = 1;
            } else {
                pwd[i].type = 'password';
                eye[i].src = './assets/images/close.png'
                flag = 0;
            }
        };
    };
    show_hide(0);
    show_hide(1);
    show_hide(2);
    //自定义校验规则
    layui.form.verify({
        username: [/^[a-zA-Z0-9]{1,10}$/, '用户名为字母或数字的组合，且长度小于10'],
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value, item) { //value：表单的值、item：表单的DOM对象
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });
    // 监听"注册"表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('http://www.liulongbin.top:3007/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            } else {
                layer.msg(res.message);
                $('#link_login').click()
            }
        })
    });
    // 监听"登录"表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'http://www.liulongbin.top:3007/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } else {
                    layer.msg('登录成功');
                    localStorage.setItem('token', res.token);
                    location.href = '/index.html'
                }
            }
        })
    });



})