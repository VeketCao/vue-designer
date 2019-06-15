
/**定义接口**/
export default {
    /**
     * 获取左侧栏基础组件配置
     */
    getBasicComponents(){

        return [
            {
                type:'ColumnPanel',
                name:'布局组件',
                opts:{
                    col:2
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
    }

}