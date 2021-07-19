$(function() {
    getUserInfo();

    $('#btnLogout').on('click', function() {
        // console.log(1);
        layui.layer.confirm('确定退出登录？', {
                icon: 3,
                titile: '提示'
            },
            function(index) {
                localStorage.removeItem('token');
                location.href = '/login.html';
                layer.close(index)
            }
        )
    })

})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            } else {
                renderAvatar(res.data)
            }
        }
    })
};


function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
};
// 激活文章列表的左侧菜单
function activeArtList() {
    $('.layui-this').removeClass('layui-this')
    $('#art_list').addClass('layui-this')
}