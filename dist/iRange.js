window.Range = (function(doc){
    window.addEventListener('load',function(){doc.body.addEventListener('touchstart',function(){},false); },{passive: false});
    var isMobile = /mobile/gi.test(navigator.userAgent.toLowerCase());
    var events = isMobile ? {
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend'
    } : {
        down: 'mousedown',
        move: 'mousemove',
        up: 'mouseup'
    };
    function Range(str,fn){
        var el = this.dom = doc.querySelector(str);
        this.min = +el.getAttribute('data-min') || 0;
        this.max = +el.getAttribute('data-max') || 100;
        this.start = +el.getAttribute('data-start') || 0;
        this.end = +el.getAttribute('data-end') || 0;
        this.step = +el.getAttribute('data-step') || 0;
        this.blocked = eval(el.getAttribute('data-blocked')) || false;
        this.algin = eval(el.getAttribute('data-algin')) || 0;
        this.single = eval(el.getAttribute('data-single')) || 0;
        this.fn =  fn ? fn : function(){};
        this.knobWidth = el.querySelector('.rangeBox2').offsetWidth;
        this.knobOffset = this.algin ?  0 : (this.knobWidth / 2);
        this.w = el.offsetWidth - (this.algin ? this.knobWidth : 0);
        this.range1Dom = el.querySelector('.rangeBox1');
        this.range2Dom = el.querySelector('.rangeBox2');
        this.rangeDom = el.querySelector('.rangeSlide');
        this.clickOff = false;
        this.init(this.start,this.end);
        this.bind();
    };
    Range.prototype = {
        init : function(start,end){
            this.range1Dom.setAttribute('data-nums',this.getPosition(start));
            this.range2Dom.setAttribute('data-nums',this.getPosition(end));
            this.range1Dom.style.transform = this.range1Dom.style.webkitTransform = 'translate3d('+ this.getPosition(start) +'px,0,0)';
            this.range2Dom.style.transform = this.range2Dom.style.webkitTransform = 'translate3d('+ this.getPosition(end) +'px,0,0)';
            this.updateRange();
        },
        bind : function(){
            var t = this;
            var x1=x2 = 0,state,left,target,index = 3;
            this.dom.addEventListener(events.down,down);
            doc.addEventListener(events.up,up);
            function down(ev){
                ev.preventDefault();
                if(t.dom.getAttribute('data-disable')==='true') return;
                var e = isMobile ? ev.changedTouches[0] : ev;
                target = ev.target;
                state = +target.getAttribute('data-nums');
                if(target.getAttribute('data-drag') !== null){
                    target.style.zIndex = index++;
                    x1 = e.pageX;
                    doc.addEventListener(events.move,move);
                }else if(!t.clickOff){
                    var _left = e.pageX - t.dom.getBoundingClientRect().left  - (t.algin ? t.knobWidth/2 : 0),
                        d1 = Math.abs(_left - t.range1Dom.getAttribute('data-nums')),
                        d2 = Math.abs(_left - t.range2Dom.getAttribute('data-nums'));
                    var _dom = d1 > d2 ? t.range2Dom : t.range1Dom;
                    document.title = _left
                    if( t.algin) _left = _left > t.w ? t.w : _left;
                    if( t.algin) _left = _left<=0  ? 0 : _left;
                    _dom.style.transform = _dom.style.webkitTransform = 'translate3d('+ (_left - t.knobOffset) +'px,0,0)';
                    _dom.setAttribute('data-nums',_left - t.knobOffset);
                    t.updateRange();
                };
            }
            function move(ev){
                ev.preventDefault();
                var e = isMobile ? ev.changedTouches[0] : ev;
                x2 = e.pageX;
                left = x2 - x1 + state;
                if(left < -t.knobOffset) left=-t.knobOffset;
                else if(left > t.w - t.knobOffset) left=t.w - t.knobOffset;
                if(t.blocked && left >= t.range2Dom.getAttribute('data-nums') && target == t.range1Dom) left = t.range2Dom.getAttribute('data-nums')
                if(t.blocked &&  left <= t.range1Dom.getAttribute('data-nums') && target== t.range2Dom) left = t.range1Dom.getAttribute('data-nums')
                target.setAttribute('data-nums',left);
                target.style.transform = target.style.webkitTransform = 'translate3d('+left+'px,0,0)';
                t.updateRange();
                return;
            }
            function up(ev){
                doc.removeEventListener(events.move,move);
            }
        },
        getValue : function(position) {
            var ratio = position / this.w;
            var value = (this.max - this.min) * ratio + this.min;
            return value;
        },
        getRange : function (knob) {
            var range = +knob.getAttribute('data-nums') + this.knobOffset;
            range = range < 1 ? 0 : range > this.w ? this.w : range;
            return range;
        },
        getPosition : function(value) {
            var ratio = (value - this.min) / (this.max - this.min);
            var position = ratio * this.w - this.knobOffset ;
            return position;
        },
        resize : function(){
            this.w = this.dom.offsetWidth - (this.algin ? this.knobWidth : 0);
            this.init(this.arr[0], this.arr[1]);
        },
        updateRange : function(){
            var t = this;
            var range1 = t.getRange(t.range1Dom);
            var range2 = t.getRange(t.range2Dom);
            var val1 = Math.round(t.getValue(range1)),val2 = Math.round(t.getValue(range2));
            if (range1 < range2) {
                t.rangeDom.style.width = (range2 - range1) + (t.algin ? t.knobWidth : 0) +'px';
                t.rangeDom.style.transform = t.rangeDom.style.webkitTransform = 'translate3d('+ (+range1) +'px,0,0)';
            } else {
                t.rangeDom.style.width = (range1 - range2) + (t.algin ? t.knobWidth : 0)  +'px';
                t.rangeDom.style.transform = t.rangeDom.style.webkitTransform  = 'translate3d('+ (+range2) +'px,0,0)';
            };
            if(t.step){ //设置step
                val1 = Math.round(val1/t.step) *t.step;
                val1 = val1+1 >= t.max ? t.max : val1;
                val2 = Math.round(val2/t.step) *t.step;
                val2 = val2+1 >= t.max ? t.max : val2;
            }
            t.arr = [val1,val2].sort(function(a,b){return a-b});
            t.fn.call(t.dom,t.arr,[val1,val2])
        },
        get : function(){
            return this.arr
        }
    };
    return Range;
})(document);