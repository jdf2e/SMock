import {toStr, toJson } from '../src/utils/utils';

describe("utils模块单元测试",function(){
    describe("toStr方法测试",function(){
        const param0 = {
            name:"smock",
            version:"0.0.2"
        }
        const param1 = {
            'name':"smock",
            'version':"0.0.2"
        }
        const param2 = {
            "name":"smock",
            "version":"0.0.2"
        }
        const param3 = {
            "name":"smock",
            "version":"0.0.2",
            "members":[
                'lyl',
                'yl'
            ]
        }
        const result0 = toStr(param0);
        const result1 = toStr(param1);
        const result2 = toStr(param2);
        const result3 = toStr(param3);
        test("无引号对象测试",function(){
            expect(result0).toEqual(JSON.stringify(param0,null,2))
        })
       
        test('单引号对象测试',function(){
            expect(result1).toEqual(JSON.stringify(param1,null,2))
        })
        test('双引号对象测试',function(){
            expect(result2).toEqual(JSON.stringify(param2,null,2))
        })
        test('复杂对象测试',function(){
            expect(result3).toEqual(JSON.stringify(param3,null,2))
        })
    })
    describe("toJson方法测试",function(){
        const _param = {
            name:"smock",
            version:"0.0.2"
        }
        const realParam = JSON.stringify(_param);
        const result = toJson(realParam);
        test('toJson方法的内容和JSON.parse的内容应该相等',function(){
            expect(result).toEqual(_param)
        })
    })
    
});
