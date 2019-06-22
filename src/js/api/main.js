
/**定义接口**/
export default {
    /**
     * 获取左侧栏基础组件配置
     */
    getBasicComponents(){

        return [
            {
                type:'HelloWorld',
                name:'测试组件',
                opts:{
                    title:''
                }
            },
            {
                type:'TextInput',
                name:'单文本行',
                opts:{
                    title:'单文本行',
                    width:'100%',
                    defaultValue:'',
                    required:false,
                    placeholder:''
                }
            }
        ]
    },
    /**
     * 布局组件列表
     * @returns {*[]}
     */
    getLayoutList(){
        return[
            {
                type:'ColumnLayout',
                name:'两列布局',
                cols:[
                    {items:[],opts:{}},
                    {items:[],opts:{}}
                ]
            },
            {
                type:'ColumnLayout',
                name:'三列布局',
                cols:[
                    {items:[],opts:{}},
                    {items:[],opts:{}},
                    {items:[],opts:{}}
                ]
            },
            {
                type:'ColumnLayout',
                name:'四列布局',
                cols:[
                    {items:[],opts:{}},
                    {items:[],opts:{}},
                    {items:[],opts:{}},
                    {items:[],opts:{}}
                ]
            }
        ]
    }

}