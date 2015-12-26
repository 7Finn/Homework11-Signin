$(function() {
    reflash();
    selectHeight();
	var $input = $('input').not('#reset');
    $input.focus(function() {
        $(this).parent().find('.span').removeClass('init-position').addClass('up-position');
        $(this).parent().addClass('blue-div');
    })
    $input.blur(function() {
        var self = this;
        var $this = $(this);
        $this.parent().find('.span').removeClass('up-position').addClass('init-position');
        if ($(this).val()) {
            $this.parent().removeClass('blue-div').addClass('used-div');
            $this.parent().find('.span').removeClass('up-position').addClass('used-span');
        } else { //如果为空则不作处理
            $this.parent().removeClass('blue-div red-div');
            $this.parent().find('.span').removeClass('used-span').addClass('init-position');
            clearWarning($this.parent(), "");
        }
    });
    $('#reset').click(clearAll);
    $('#post').click(post);
});


function setWarning(obj, errorMessage) {
    obj.addClass('red-div');
    obj.find('.span').addClass('warning-span');
    obj.find('.warning').text(errorMessage);
}

function clearWarning(obj, errorMessage) {
    obj.removeClass('red-div');
    obj.find('.span').removeClass('warning-span');
    errorMessage = "";
    obj.find('.warning').text(errorMessage);
}

function clearAll() {
	$('.input-div').removeClass("blue-div red-div used-div");
	$('.span').removeClass('used-span up-position warning-span').addClass('init-position');
	$('.input').val("");
	$('.warning').text("");
}

function reflash() {
    var inputs = $('input').not('#reset');
    for (var i = 0; i < inputs.length; ++i) {
        if ($(inputs[i]).val() && $(inputs[i]).parent().find('.warning').text() != '') {
            $(inputs[i]).parent().addClass('red-div');
            $(inputs[i]).parent().find('.span').addClass('warning-span up-position');
        } else if ($(inputs[i]).val()) {
            $(inputs[i]).parent().removeClass('blue-div').addClass('used-div');
            $(inputs[i]).parent().find('.span').removeClass('up-position').addClass('used-span');
            
        }
    }
}

function checkEmpty() {
    if ($('#username').val == '' || $('#password').val() == '') {
        setWarning($('#password-div'), "用户信息不可为空×");
        return false;
    }
    return true;
}


function post () {
    $('input').not('#reset').blur();
    if (!checkEmpty() && this.type == 'submit') return false;
}

function selectHeight() {
    var title = $(document).attr("title");
    if (title == '注册') $('.container').css('height', 600);
    if (title == '登录') $('.container').css('height', 300);
}

var ERROR_MESSAGE = {
    // 成功
    0: '',
    // 用户名
    14: '用户名不可为空×',
    54: '密码不可为空×',
}