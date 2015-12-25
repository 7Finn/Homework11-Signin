$(function() {
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
            if (validator.isFieldValid(this.name, $(this).val())) {
                // $.post('/api/validate-unique', {field: this.name, value: $(this).val() }, function(data, status){
                //     if (status == 'success') {
                //         if (data.isUnique){
                //             setWarning($(self).parent(), "");
                //         } else {
                //             setWarning($(self).parent(), "该信息已使用×")
                //             validator.form[self.name].status = false;
                //         }
                //     }
                // });
                clearWarning($this.parent(), validator.form[this.name].errorMessage);
            } else {
                setWarning($this.parent(), validator.form[this.name].errorMessage);
            }
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

function clearAll () {
	$('.input-div').removeClass("blue-div red-div used-div");
	$('.span').removeClass('used-span up-position warning-span').addClass('init-position');
	$('.input').val("");
	$('.warning').text("");
}

function checkEmpty() {
    if (validator.form.username.errorMessage == '') setWarning($('#name-div'), validator.ERROR_MESSAGE[14]);
    if (validator.form.sid.errorMessage == '') setWarning($('#id-div'), validator.ERROR_MESSAGE[24]);
    if (validator.form.phone.errorMessage == '') setWarning($('#phone-div'), validator.ERROR_MESSAGE[34]);
    if (validator.form.email.errorMessage == '') setWarning($('#email-div'), validator.ERROR_MESSAGE[44]);
    if (validator.form.password.errorMessage == '') setWarning($('#password-div'), validator.ERROR_MESSAGE[54]);
}


function post () {
    $('input').not('#reset').blur();
    checkEmpty();
    if (!validator.isFormValid() && this.type == 'submit') return false;
}
