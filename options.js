
$(function () {

    $.notify.defaults({ className: "success" });

    var role = localStorage.role;
    $("#" + role).attr("checked", true);

    var frequency = localStorage.frequency;
    $("#frequency").val(frequency);

    $("#confirmBtn").bind("click", function() {
        localStorage.role = $("input[name='role']:checked").val();
        localStorage.frequency = $("#frequency").val();
        $.notify("设置成功", {
            position: 'top center'
        });
    });
});
