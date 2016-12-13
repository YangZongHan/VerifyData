window.onload = function () {
    var vdEmpty = VD$('isEmpty', 'Empty', '怎麼會是空的呢?');


    console.log(vdEmpty.verifyData().showResult());

    console.log(vdEmpty.showMessage());

    console.log(vdEmpty.showUserInput());
}