﻿require([
         'bforms-initUI',
         'main-script'
], function () {
    var HomeIndex = function (options) {
        this.options = $.extend(true, {}, options);
    };
    
    HomeIndex.prototype.init = function () {

    };

    $(document).ready(function () {
        var ctrl = new HomeIndex(requireConfig.pageOptions);
        ctrl.init();
    });
});