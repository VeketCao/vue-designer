/**
 * Created by Veket on 2017/8/17.
 */
(function () {

    var s = window.AppUtil = {};

    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    /**
     * UUID生成器
     * @param len
     * @param radix
     * @returns {string}
     */
    s.getUUID = function (len, radix) {
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };

    /**异步加载vue组件**/
    s.loadVueComponents = function (urls,cb) {
        var head = document.getElementsByTagName('head');
        if(head&&head.length){
            head = head[0];
        }else{
            head = document.body;
        }

        var exec = _.after(urls.length, function () {
            if (cb && typeof(cb) == "function")cb();
        });

        var loadScripts = _.after(urls.length, function () {
             _.each(urls,function (url) {
                 var script = document.createElement('script');
                 script.type = "text/javascript";
                 script.src = url;
                 head.appendChild(script);
                 script.onload = script.onreadystatechange = function(){
                     if ((!this.readyState) || this.readyState == "complete" ||
                         this.readyState == "loaded" ){
                         exec();
                     }
                 };
             })
        });

        _.each(urls,function (url) {
            var styleLink = document.createElement('link');
            styleLink.rel = "stylesheet";
            styleLink.href = url.substring(0,url.lastIndexOf('.'))+'.css';
            document.head.appendChild(styleLink);
            styleLink.onload = styleLink.onreadystatechange = function(){
                if ((!this.readyState) || this.readyState == "complete" ||
                    this.readyState == "loaded" ){
                    loadScripts();
                }
            };
        })

    };

    /**http**/
    s.http = function(url,param,options){
        param=param||{};
        var dtd=$.Deferred();
        var opts=_.defaults(options||{},{
            dataType:"json",type:"GET",cache:false,timeout:120000
        });
        opts=_.extend(opts,{data:param,url:url});
        $.ajax(opts).done(function(rtn){
            dtd.resolve(rtn)}).fail(function(rtn){
                console.log("url",url);
                console.error("error",rtn);
                dtd.reject(rtn);
            }).always(function(){});
        return dtd.promise()
    };
    
    s.getInitPageConfig = function (pageId, items) {
        return {
            pageId: pageId,
            items: items,
            addItem:function (item) {
                var temp = _.find(this.items, function (it) {
                    return it.instId == item.instId
                });
                if(_.isEmpty(temp)){
                    this.items.push(item);
                }
            }
        }
    }


})();