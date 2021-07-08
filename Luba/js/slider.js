
$(function(){
    sliderRun(); // запускаем нашу программу, когда готов DOM
});
function sliderRun() {
    const w = $('.slide').width(); // ширина слайда - самая важная константа, ее везде используем
    const t = 1000; // время в миллисекундах, вынесено в константу для удобства. для таймаута я взял удвоенный интервал.
    let current = 0; // указатели на текущий слайд и его соседей слева и справа
    let left = -1; // -1 соответствует length-1, то есть последнему слайду из набора
    let right = 1;
    let flag1 = false; // три флага блокировки, так как у нас три независимых асинхронных процесса, исхода которых необходимо ждать
    let flag2 = false;
    let flag3 = false;
    $('.slide').eq(current).addClass('active').css('left', 0);
    $('.slide').eq(left).css('left', -w); // располагаем левый и правый слайды по бокам от основного. поскольку overflow: hidden - их не видно. используем одно и то же свойство left для всех слайдов.
    $('.slide').eq(right).css('left', w);
    function moveLeft() {
        if (flag1 || flag2 || flag3) return; // проверяем флаги, если хоть один не убран, отказываемся действовать. это не позволит одновременно выполняться вызовам от постоянной прокрутки и кнопок или от двух кнопок сразу.
        flag1 = true; // поднимаем все флаги, чтобы не допустить нового вызова, пока не отработал текущий
        flag2 = true;
        flag3 = true;
        left = current; // текущий слайд становится левым и уезжает налево
        $('.slide').eq(left).animate({left: -w}, t, function(){
            $(this).removeClass('active');
            flag1 = false; // когда анимация отработала, один флаг убирается
        });
        current = right; // правый становится текущим и выезжает справа
        $('.slide').eq(current).addClass('active').animate({left: 0}, t, function(){
            flag2 = false; // когда анимация отработала, еще один флаг убирается
        });
        right++; // переводим правый указатель еще правее
        if (right > $('.slide').length - 2) {
            right -= $('.slide').length; // если значение указателя больше индекса предпоследнего слайда, уменьшаем на его количество слайдов: последний слайд получается по индексу -1.
        }
        $('.slide').eq(right).css('left', w); // устанавливаем правый слайд в готовности справа. поскольку он не должен быть виден - без анимации.
        flag3 = false; // убираем третий флаг
    }
    function moveRight() { // все аналогично предыдущей функции, только в обратную сторону
        if (flag1 || flag2 || flag3) return;
        flag1 = true;
        flag2 = true;
        flag3 = true;
        right = current;
        $('.slide').eq(right).animate({left: w}, t, function(){
            $(this).removeClass('active');
            flag1 = false;
        });
        current = left;
        $('.slide').eq(current).addClass('active').animate({left: 0}, t, function(){
            flag2 = false;
        });
        left--;
        if (left < -1) {
            left += $('.slide').length;
        }
        $('.slide').eq(left).css('left', -w);
        flag3 = false;
    }
    let tm = setTimeout(everScroll, t * 2); // назначаем вызов вспомогательной функции с задержкой
    function everScroll() {
        moveLeft(); // вспомогательная функция вызывает прокрутку влево
        tm = setTimeout(everScroll, t * 2); // и назначает новый вызов себя с задержкой. это не рекурсия, так как функция сразу и заканчивает работу, а не ждет результатов вызова.
    }
    $('.left').click(moveLeft); // на кнопки навещиваем вызов прокрутки влево и вправо соответственно
    $('.right').click(moveRight);
    /*
    $('.stop').click(function(){
        clearTimeout(tm);
        setTimeout(function(){
            clearTimeout(tm);
        }, t * 1.2);
    });
    $('.go').click(everScroll);
    */
}
