//ES6面向对象
class Carousel {
    constructor(id, width, lastIndex, duration, is_auto) {
        //获取轮播图id
        this.id = id;
        //获取urlImg的Jquery对象
        this.$urlImg = $(`#carousel${id}`);
        //找到indicator
        this.$btns = $(`#indicator${id}>li`);
        //找到left
        this.$left = $(`#left${id}`);
        //找到right
        this.$right = $(`#right${id}`);
        //每张图片的宽度
        this.width = width;
        //i表示当前显示图片
        this.i = 0;
        //lastIndex表示最后一张图片索引值
        this.lastIndex = lastIndex;
        //动画持续时间
        this.duration = duration;
        //定义定时器
        this.timer = null;
        //定义两个标志位
        this.canClick4lr = true;
        this.canClick4li = true;
        //是否自动；轮播
        this.is_auto = is_auto;
        var that = this;
        //mouseover时清空定时器，不能用mouseenter
        this.$container = this.$urlImg.parent();
        this.$container.mouseover(function () {
            clearInterval(that.timer);
            that.timer = null;
        });
        //mouseleave时重新启动定时器
        this.$urlImg.mouseleave(function () {
            that.is_auto && that.auto();
        });
        //点击上一张按钮
        this.$left.click(function () {
            //调用上一张
            that.move(-1);
        });
        //点击下一张按钮
        this.$right.click(function () {
            //调用上一张
            that.move(1);
        });
        //点击indicator按钮,找到父元素，使用事件委托
        this.$btns.parent().on("click", "li", function () {
            //找到点击li的index
            if (that.canClick4li) {
                var index = $(this).index();
                that.moveTo(index);
                that.canClick4li = false;
                setTimeout(() => {
                    that.canClick4li = true;
                }, that.duration + 100);
            }

        });

    } //constructor

    init() {
        this.auto();
    }
    moveTo(to) {
        //如果to参数没传
        if (to == undefined) {
            this.i++;
        } else {
            //如果当前显示图片下标为i
            if (this.i == 0) {
                if (this.i < to) {
                    //向左轮播不用做特别处理
                    this.$urlImg.addClass("transition");
                } else {
                    //悄悄将图片移到最左边
                    this.$urlImg.removeClass("transition");
                    this.$urlImg.css("margin-left", `-${this.lastIndex * this.width}px`);
                    //将图片移到上一张
                    var that = this;
                    setTimeout(function () {
                        that.$urlImg.addClass("transition");
                        that.moveTo(that.lastIndex - 1);
                    }, 100);
                    return;
                }
            }
            //将to值给i
            this.i = to;
        }
        //注意：这段代码不能放到this.i==this.lastIndex判断语句后面
        this.$urlImg.addClass("transition");
        this.$urlImg.css("margin-left", `-${this.i * this.width}px`);

        //如果显示的是当前最后一张图片
        if (this.i == this.lastIndex) {
            this.i = 0;
            this.$urlImg.addClass("transition");
            this.$urlImg.css("margin-left", `-${this.lastIndex * this.width}px`);
            setTimeout(() => {
                this.$urlImg.removeClass("transition").css("margin-left", "0");
            }, this.duration);
        }
        //遍历btns，取出active class
        this.$btns.removeClass("active");
        $(this.$btns[this.i]).addClass("active");
    }

    move(n) {
        if (this.canClick4lr) {
            this.moveTo(this.i + n);
            this.canClick4lr = false;
            setTimeout(() => {
                this.canClick4lr = true;
            }, this.duration + 100);
        }
    }
    //自动轮播
    auto() {
        this.timer = setInterval(this.moveTo.bind(this), 3000)
    }

} //class

