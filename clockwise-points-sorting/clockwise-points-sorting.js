/**
 * @description 顺时针坐标系点排序
 * @param {Array} input 待排序点构成的数组，数组元素为一个点的 X 坐标值和 Y 坐标值构成的长度为 2 的数组
 * @param {Number} basic 被选中的起始点在输入数组中的索引
 * @return {Array} 排序后点构成的数组
 */
function clockwiseSorting (input, basic) {
  let base = Math.atan2(input[basic][1], input[basic][0])
  return input.sort(function(a, b) {
    return Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]) + (Math.atan2(b[1], b[0]) > base ? - 2 * Math.PI : 0) + (Math.atan2(a[1], a[0]) > base ? 2 * Math.PI : 0)
  })
}


// 这个写法有 bug，只为理解算法步骤
var clockwiseSortingHash = function(input, basic) {
    var base = Math.atan2(input[basic][1], input[basic][0]);
    var hash = {};
    var temp = [];
    var output = [];
    input.forEach(function(e, i) {
        var tmp = Math.atan2(e[1], e[0]) - base;
        if(tmp > 0) {
            tmp -= 2 * Math.PI;
        }
        //var tmp = (Math.atan2(e[1], e[0]) > base) ? (Math.atan2(e[1], e[0]) - base - 2 * Math.PI) : (Math.atan2(e[1], e[0]) - base);
        hash[tmp] = i;
        temp[i] = tmp;
    });
    temp.sort(function(a, b) {
        return b - a;
    });
    temp.forEach(function(e, i) {
        output[i] = input[hash[e]];
    });
    return output;
};
