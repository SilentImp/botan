window.NumberToWords = (function () {
    var words = [
          ['титульная', 'первая',
          'вторая', 'третья', 'четвертая', 'пятая',
          'шестая', 'седьмая', 'восьмая', 'девятая', 'десятая',
          'одиннадцатая', 'двенадцатая', 'тринадцатая',
          'четырнадцатая', 'пятнадцатая', 'шестнадцатая',
          'семнадцатая', 'восемнадцатая', 'девятнадцатая'],
          [,,
            ['двадцатая', 'двадцать'],
            ['тридцатая', 'тридцать'],
            ['сороковая', 'сорок'],
            ['пятидесятая','пятьдесят'],
            ['шестидесятая','шестьдесят'],
            ['семидесятая','семьдесят'],
            ['восьмидесятая','восемьдесят'],
            ['девяностая','девяносто']
          ]
        ];

        gap = String.fromCharCode(32),
        overdo = 'слишком много';

    function Convert(aNum) {
        var p, a, sub, diff;

        aNum = parseInt(aNum, 10);

        if (aNum < 20) {
            return a = words[0][aNum];
        }else if (aNum < 100) {
            diff = aNum % 10
            p = parseInt(aNum / 10, 10);

            if(diff == 0){
              sub = 0;
            }else{
              sub = 1;
            }
            if(diff>0){
            return Join(words[1][p][sub], words[0][diff]);
            }
            return words[1][p][sub];
        }else{
          return aNum;
        }

    };
    function Join() {
        return Array.prototype.join.call(arguments, gap);
    };
    return (function (aNum) {
        var b = (aNum > 999999999);
        return (b) ? overdo : Convert(aNum);
    });
})();
