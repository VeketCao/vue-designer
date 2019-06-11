/**
 * Created by Veket on 2017/8/18.
 */
(function () {
    var _componentList = [],
        _pageCfg = {},
        _vue_page_app = null;


    var getAttrDefaultConfig = function (name) {
        var temp = _.find(_componentList, function (it) {
            return it.name == name
        });
        return temp.attr;
    };

    /** 保存组件配置到配置文件*/
    var addLayoutItem = function (id) {
        var componentKey = _pageCfg.currentDrag.attr("component");
        var getMaxY= function (h) {
            var y = 0;
            _.each(_vue_page_app.layout||[],function (it) {
                if(y<=it.y) y=it.y+h;
            });
            return y;
        };
        var tempItem = {
            w: 10,
            h: 5,
            x: 0,
            i:AppUtil.getUUID(),
            y: getMaxY(5),
            name: componentKey,
            attr: _.clone(getAttrDefaultConfig(componentKey))
        };
        _vue_page_app.layout.push(tempItem);
    };

    /**监听左侧栏拖拽**/
    var componentDraggableEvents = function () {

        $("#component-def-list .widget-item").draggable({
            connectToSortable: ".layout-wrap",
            helper: "clone",
            opacity: .8,
            appendTo: "body",
            start: function (a, b) {
                _pageCfg.currentDrag = $(this);
                $(".ui-draggable-dragging").css({height: "auto", "float": "none", width: "150px"})
            },
            stop: function (a, c) {

                addLayoutItem();
                _pageCfg.currentDrag = null;
            }
        });
    };

    /**渲染左侧栏**/
    var renderLeftBar = function () {
        var getItem = function (it) {
            return '<div class="widget-item component_js ui-draggable" type="def" title="拖拽至页面中间区域" component="' + it.name + '"> <span>' + it.description + '</span> </div>';
        };

        var listItemHtml = "";
        _.each(_componentList, function (it) {
            listItemHtml += getItem(it)
        });

        $("#component-def-list").empty().html(listItemHtml);

        componentDraggableEvents();//监听左侧栏拖拽
    };

    /**初始化页面及页面配置**/
    var initPage = function () {
        _pageCfg = AppUtil.getInitPageConfig(1, []);

        initLayoutPage(_pageCfg.items);
    };

    /**加载组件**/
    var loadInitComponents = function (cb) {
        /*AppUtil.http('http://mipdev.midea.com:82/components/components.json').done(function (rtn) {

        });*/

        rtn =[
            {
                name: 'MyInput',
                description:'输入框',
                url:''
            }
        ]

        if(!_.isEmpty(rtn)){
            _componentList = rtn;
            renderLeftBar();
            cb();
            //AppUtil.loadVueComponents(_.pluck(rtn, 'url'), cb);
        }
    };

    var initLayoutPage = function (items) {
        Vue.config.debug = true;
        Vue.config.devtools = true;
        var GridLayout = VueGridLayout.GridLayout;
        var GridItem = VueGridLayout.GridItem;
        var components_keys=['GridLayout','GridItem'];
        var components_values=[GridLayout,GridItem];
        _.each(_componentList,function (it) {
            components_keys.push(it.name);
            components_values.push(eval(it.name));
        });
        _vue_page_app = new Vue({
            el: '#widget-control',
            components: _.object(components_keys,components_values),
            data: {
                layout: items||[],
                draggable: true,
                resizable: true
            },
            methods:{
                delHandle:function (item) {//删除
                    this.layout.splice(this.layout.indexOf(item), 1);
                }
            }
        });
    };

    var previewHandle = function () {
        _pageCfg.items = _vue_page_app.layout;
        localStorage.setItem('pagecfg',JSON.stringify(_pageCfg));
        window.open('./preview.html');
    };

    var saveHandle = function () {
        _pageCfg.items = _vue_page_app.layout;
        console.log(JSON.stringify(_pageCfg));
    };

    var bindEvent = function () {
        $("#preview_btn").bind("click", previewHandle);
        $("#save_btn").bind("click", saveHandle);
    };

    $(document).ready(function () {
        $.support.cors = true;
        bindEvent();
        loadInitComponents(initPage);
    });

})();