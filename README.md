# Range
range.js 区间选择，支持移动端

![image](https://github.com/Takeos/Range/blob/master/demo.gif)


+ //data-min 为最小区间
+ //data-max 为最大区间
+ //data-start 为默认开始值
+ //data-end 为默认结束值
+ //data-step 为设置步长值，即每次滑动的大小
+ //data-disable 为禁止拖动
+ //data-algin 设置对齐方式
+ //data-single 如果需要单个拖动，需要开启此选项
+ //data-blocked 是否开启碰撞判断，开启后，将不会自动改变区间大小，默认false

>>以下是基本的dom结构。
```
<div class="containerWrap" data-min="0" data-max="300" data-start="30" data-end="130" data-step="10" data-blocked="true" data-disable="true">
    <div class="rangeBox rangeBox1" data-drag ></div>
    <div class="rangeBox rangeBox2" data-drag ></div>
    <div class="rangeSlide"></div>
</div>
```


>>以下是基本的css。

```
.containerWrap { background-color: #c2d2d4; height: 12px; padding: 0; position: relative; width: 300px; margin: 20px 0; border-radius: 10px; }
.rangeBox { background-color: #008c7b; text-align: center; width: 30px; height: 30px; position: absolute; top: -11px; z-index: 2; border: 2px solid #f5f5f5; border-radius: 50%; background: #2ab1c1; box-shadow: 0 0 3px gray; }
.rangeBox:hover { background: #55939c; }
.rangeSlide { background-color: #6a7d81; height: 12px; position: relative; border-radius: 10px; }
.containerWrap[data-disable="true"] .rangeBox{background: #6a7d81}
```

```
//第一个参数为元素ID或者class
//第二个回调函数，滑动时执行，可不写
var _range = new Range('#container',function(a){
    //a参数为区间值，是一个数组，例如： [10,24]
    min.innerHTML = a[0];
    max.innerHTML = a[1];
});
_range.clickOff = true //关闭点击改变区间
_range.get(); //获取区间
_range.resize(); //重新改变大小，用于修改宽度时执行 
```
