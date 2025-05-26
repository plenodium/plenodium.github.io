// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);



    var position = 0.5;
    var vidWidth = vid.videoWidth/2;
    var vidHeight = vid.videoHeight;

    var mergeContext = videoMerge.getContext("2d");

    if (vid.readyState > 3) {
        vid.play();

        function trackLocation(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.pageX - bcr.x) / bcr.width);
        }
        function trackLocationTouch(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.touches[0].pageX - bcr.x) / bcr.width);
        }

        videoMerge.addEventListener("mousemove",  trackLocation, false); 
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove",  trackLocationTouch, false);

        function drawLoop() {
            // 清除画布
            mergeContext.clearRect(0, 0, videoMerge.width, videoMerge.height);
        
            // 绘制左侧视频部分
            mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
        
            // 计算分割线的位置
            var colStart = Math.max(0, Math.min(vidWidth, vidWidth * position));
            var colWidth = Math.max(0, Math.min(vidWidth, vidWidth - vidWidth * position));
        
            // 绘制右侧视频部分
            mergeContext.drawImage(vid, colStart + vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);

            // 设置边界线和箭头的样式
            mergeContext.strokeStyle = 'gray';
            mergeContext.fillStyle = 'gray';
            mergeContext.lineWidth = 6;
        
            // 绘制垂直的分界线
            mergeContext.beginPath();
            mergeContext.moveTo(colStart, 0);
            mergeContext.lineTo(colStart, vidHeight);
            mergeContext.stroke();
        
            // 绘制半透明的橙色椭圆形蒙版
            mergeContext.fillStyle = "rgba(165, 165, 165, 0.5)"; // 橙色，50%透明度
            var ovalWidth = 60;  // 椭圆宽度
            var ovalHeight = 40;  // 椭圆高度
            mergeContext.beginPath();
            mergeContext.ellipse(colStart, vidHeight / 2, ovalWidth / 2, ovalHeight / 2, 0, 0, 2 * Math.PI);
            mergeContext.fill();
        
            // 重置填充颜色为灰色，绘制箭头
            mergeContext.fillStyle = 'gray';
        
            // 定义箭头尺寸
            var stemLength = 20;        // 箭杆长度
            var arrowHeadLength = 10;   // 箭头头部长度
            var arrowHeadWidth = 20;    // 箭头头部宽度
        
            // 绘制左侧箭头（指向左）
            // 绘制箭杆
            mergeContext.beginPath();
            mergeContext.moveTo(colStart, vidHeight / 2);
            mergeContext.lineTo(colStart - stemLength, vidHeight / 2);
            mergeContext.stroke();
        
            // 绘制箭头头部
            mergeContext.beginPath();
            mergeContext.moveTo(colStart - stemLength, vidHeight / 2);
            mergeContext.lineTo(colStart - stemLength + arrowHeadLength, vidHeight / 2 - arrowHeadWidth / 2);
            mergeContext.lineTo(colStart - stemLength + arrowHeadLength, vidHeight / 2 + arrowHeadWidth / 2);
            mergeContext.closePath();
            mergeContext.fill();
        
            // 绘制右侧箭头（指向右）
            // 绘制箭杆
            mergeContext.beginPath();
            mergeContext.moveTo(colStart, vidHeight / 2);
            mergeContext.lineTo(colStart + stemLength, vidHeight / 2);
            mergeContext.stroke();
        
            // 绘制箭头头部
            mergeContext.beginPath();
            mergeContext.moveTo(colStart + stemLength, vidHeight / 2);
            mergeContext.lineTo(colStart + stemLength - arrowHeadLength, vidHeight / 2 - arrowHeadWidth / 2);
            mergeContext.lineTo(colStart + stemLength - arrowHeadLength, vidHeight / 2 + arrowHeadWidth / 2);
            mergeContext.closePath();
            mergeContext.fill();
        
            requestAnimationFrame(drawLoop);
        }
        
        
        
        requestAnimationFrame(drawLoop);
    } 
}

function resizeAndPlay(element) {
    var cv = document.getElementById(element.id + "Merge");
    cv.width = element.videoWidth/2;
    cv.height = element.videoHeight;
    element.play();
    element.style.height = "0px";  // Hide video without stopping it
    
    playVids(element.id);
}

// Ensure this function is available
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
