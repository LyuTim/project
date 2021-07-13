/* slider=====================*/
$(function(){
    sliderRun(); // запускаем нашу программу, когда готов DOM
});
function sliderRun() {
    const w = $('.slide').width(); // ширина слайда - самая важная константа, ее везде используем
    const t = 2500; // время в миллисекундах, вынесено в константу для удобства. для таймаута я взял удвоенный интервал.
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
    $('.left').click(moveRight); // на кнопки навещиваем вызов прокрутки влево и вправо соответственно
    $('.right').click(moveLeft);

}





/* order ======================================================================*/
const order = [
    {
        id: 5711,
        value: 10
    },
    {
        id: 3432,
        value: 10
    },
    {
        id: 4846,
        value: 10
    }
];
function tovarDelete(point) {
    let b = point.parentNode.parentNode; // нашли строку, в которой лежит наш товар
    let t_id = b.querySelector('th').dataset.tovar; // находим id товара
    for (let i = 0; i < order.length; i++) {
        if (order[i].id == t_id) {
            order.splice(i, 1);
            console.log(t_id); // имитация отправки бэку сообщения об удалении товара
            break;
        }
    }
    b.remove();
    if (order.length > 0) {
        tovarCount();
    } else {
        orderEmpty();
    }
}
function tovarChange(point) {
    let new_quantity = point.value;
    if (new_quantity <= 0) {
        tovarDelete(point);
    } else {
        let tovar_id = point.parentNode.parentNode.querySelector('th').dataset.tovar;
        for (let i = 0; i < order.length; i++) {
            if (order[i].id == tovar_id) {
                order[i].value = new_quantity;
                console.log(order[i]);
                break;
            }
        }
        tovarCount();
    }
}
function tovarCount() { // пересчет товара
    let itog = 0; // общий итог
    for (let i = 0; i < order.length; i++) { // перебираем в цикле корзину
        const row = $('.order .table tbody tr').eq(i); // берем строку, соответствующую по порядковому номеру перебираемому товару в корзине
        row.find('th').html(i + 1); // выставляем порядковый номер товара. +1 потому что надо считать с 1, а у нас счет с 0
        row.find('.sum').html(row.find('.rub').html() * order[i].value); // в ячейку с классом sum кладем произведение количества товара, взятого из корзины, на цену товара, взятую из ячейки с классом rub
        itog += +row.find('.sum').html(); // плюсуем к итогу содержимое ячейки с классом sum (произведение количества на цену нашего товара)
    }
    $('.order .table .allsum').html(itog); // кладем итог в ячейку с классом allsum
}
function orderEmpty() {
    $('.order').addClass('empty');
}
function orderAction() {
    let data = {}; // создаем переменную, чтобы собрать все данные о заказе для отправки
    data.order = order; // кладем туда корзину
    data.customer = {}; // кладем данные о заказчике
    data.customer.name = $('#name').val();
    data.customer.address = $('#address').val();
    data.customer.email = $('#email').val();
    data.date = $('#date').val(); // кладем желаемую дату отгрузки
    data.comment = $('#comment').val(); // кладем комментарий заказчика
    let err = checkData(data);
    if (err) { // проверяем данные на отсутствие ошибок
        showErrors(err); // если ошибки есть, показываем их и прекращаем нашу функцию.
        console.log('errors!'); // сообщаем в консоли, что ошибки есть.
        return;
    } // здесь мы поленились писать else
    /* для реального магазина здесь следовало бы написать вот так:
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success
    });
    */
    console.log(data);
}
function checkData(data) {
    let arr = []; // ошибок может быть разное количество, лучше собрать их в массив
    for (let item in data.order) { // проверяем товары в корзине
        if (item.value <= 0) {
            arr.push(['value', item.id]); // если товара 0 или меньше, отмечаем ошибку
        }
    }
    for (let key of ['name', 'address', 'email']) { // перебираем сведения о заказчике
        if (data.customer[key].length == 0) {
            arr.push(['empty', key]); // если поле не заполнено, отмечаем ошибку
        }
    }
    if (data.date.length == 0) { // проверяем дату
        arr.push(['empty', 'date']); // если поле не заполнено, отмечаем ошибку
    } else {
        let a = makeSelectedDate(data.date); // создаем дату из записи в поле date, время суток 0:00:00.000
        let b = new Date(); // создаем дату сегодня, сейчас
        b = new Date(b.getFullYear(), b.getMonth(), b.getDate()); // создаем дату сегодня в 0:00:00.000
        if ((a - b) != (1000 * 60 * 60 * 24 * 2)) {
            arr.push(['error', 'date']); // если поле заполнено, но дата не соответствует "через день", отмечаем ошибку
        }
    }
    if (arr.length > 0) {
        return arr; // если ошибки есть, возращаем массив ошибок
    } else {
        return false; // иначе возвращаем false
    }
}
function showErrors(err) {
    for (let unit of err) { // перебираем массив ошибок
        if (typeof unit[1] == 'number') { // если указатель на поле - число, речь идет о товаре
            for (let i = 0; i < order.length; i++) {
                if (order[i].id == unit[1]) { // перебираем товары, находим нужный id, помечаем нужную строку таблицы
                    $('tbody .tr').eq(i).addClass('error').prop('data-error', unit[0]);
                }
            }
        } else { // используем id поля с ошибкой в селекторе jquery, помечаем нужное поле
            $('#' + unit[1]).addClass('error').prop('data-error', unit[0]);
        }
    }
}


$(function(){
    
    $('.popup-desk').click(function(e){
        if (e.target == this) {
            $(this).removeClass('active');
            $('.popup-desk').empty();
        }
    });

    
    $(document).on('click', '.order .del > div', function(){
        tovarDelete(this);
    });
    
    $(document).on('input', '.order .num > input', function(){
        tovarChange(this);
    });
    
    if ($('#date').length) {
        $('#date').click(function(){
            if ($('#date').val()) {
                selected_day = makeSelectedDate($('#date').val());
                makePopup(selected_day.getFullYear(),selected_day.getMonth());
            } else {
                makePopup(TODAY.getFullYear(),TODAY.getMonth());
            }
        });
    
        $('#date').mask('00-00-0000');
    }
    
    
    $('#orderdata').on('submit', function(e){// отправка формы
        e.preventDefault();
        orderAction();
    })
    
    if ($('.product').length) {
        $('.main-image').on('click', 'img', seebigimage);
        $('.small-image').on('click', 'img', changeimage);
    }
    
    if ($('.small-image > img').length) {
        $('.small-image > img').each(function(){
            $(this).css({
                'margin-top': (160 - $(this).height()) / 2,
                'margin-left': (160 - $(this).width()) / 2
            })
        });
    }
});


//выбор доставка или самовывоз - выбор места самовывоза
$(document).ready(function() {
  $(".getting").change(function() {

    if ($('#pickup').prop("checked")) {
      $('#select').fadeIn();
	  $('#deliv').fadeOut();
    } else if ($('#delivery').prop("checked")) {
		$('#deliv').fadeIn();
		$('#select').fadeOut();
	}
	});
});


/* gallery =================================================================*/
function seebigimage() {
    // получаем адрес большой картинки
    let imageurl = document.querySelector('.main-image img').src.split('_medium.jpg').join('_big.jpg');
    
    // вставляем в попап верстку и адрес для картинки, а также кнопку-крестик для уборки попапа
    document.querySelector('.popup-desk').innerHTML = '<div class="popup lightbox"><img src="' + imageurl + '"><div class="cross">+</div></div>';
    
    // получаем доступные размеры экрана и соотношение сторон картинки
    // -120 пикселей - потому что у нас по стилям отступы от края экрана до попапа по 30 пикселей и поля попапа тоже по 30 пикселей с каждой стороны
    let winsize = {
        w: document.documentElement.clientWidth - 120,
        h: document.documentElement.clientHeight - 120
    };
    let sides = document.querySelector('.main-image img').clientWidth / document.querySelector('.main-image img').clientHeight;
    
    // сравниваем реальные размеры попапа и размеры при правильном соотношении сторон у картинки. при необходимости вносим исправления
    if (winsize.w / sides > winsize.h) {
        let correction = (winsize.w - (winsize.h * sides)) / 2;
        document.querySelector('.popup').style = 'margin: 0 ' + correction + 'px';
        winsize.w = winsize.h * sides;
    } else {
        winsize.h = winsize.w / sides;
    }
    
    // прописываем размеры картинки
    document.querySelector('.lightbox img').style = 'width:' + winsize.w + 'px;height:' + winsize.h + 'px';
    
    // прописываем уборку попапа по клику на кнопку-крестик
    document.querySelector('.cross').addEventListener('click',function(){
        document.querySelector('.popup-desk').dispatchEvent(new Event("click"));
    });
    
    // проявляем попап
    document.querySelector('.popup-desk').classList.add('active');
}
function changeimage(event) { // аргументом будет событие клика
    // из объекта события мы берем указатель на место события - event.target
    // это место - наша картинка
    // из ее атрибута src вычисляем адрес картинки среднего размера
    let imageurl = event.target.src.split('_small').join('_medium');
    
    // всталяем этот адрес в атрибут src главной картинки
    document.querySelector('.main-image img').src = imageurl;
}