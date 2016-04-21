
function show() {

    try {
        var role = localStorage.role;
        if (role === 'none') {
            notification(
                config.notificationTitle,
                config.notificationOption,
                config.optionsHtml
            );
        } else {
            checkNewMessage(role);
        }
    } catch (err) {
        console.log(err);
    }
}

function checkNewMessage(role) {

    chrome.cookies.get({url: config.workUrl, name: "JSESSIONID"}, function (cookie) {
        if (cookie && cookie.value) {
            $.post(config.checkNewMessageUrl, {
                role: role
            }, function (json) {
                // done 根据结果提醒用户有新消息
                if (json.success) {
                    notifyBrowserAction(json.count);
                }
            }, 'json');
        }
    });
}

function notifyBrowserAction(count) {

    chrome.browserAction.setBadgeText({
        text: count + ""
    });
}

function notification(title, body, url) {

    if (window.Notification) {
        var notification = new Notification(title, {
            icon: config.notificationIcon,
            body: body
        });

        notification.onclick = function () {
            window.open(url);
            notification.close();
        };
    }
}

function now(type) {

    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    var nowTime = "time type undefined";
    if (!type) {
        nowTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    } else if (type === "day") {
        nowTime = year + "-" + month + "-" + day;
    }
    return nowTime;
}

function roleUrl() {
    return config.workUrl + "?role=" + localStorage.role;
}

if (!localStorage.isInitialized) {

    // 3分钟检查一次新消息
    localStorage.frequency = 3;
    localStorage.isInitialized = true;
    localStorage.role = 'none';
}

chrome.browserAction.onClicked.addListener(function() {
    // done 打开经过计算的url，function产生的url
    window.open(roleUrl());
    // 打开后清零未处理数量
    chrome.browserAction.setBadgeText({
        text: ""
    });
});

show();

var interval = 0;
setInterval(function () {
    interval++;
    if (localStorage.frequency <= interval) {
        show();
        interval = 0;
    }
}, 60 * 1000);
