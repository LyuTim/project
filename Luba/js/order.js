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
    let b = point.parentNode.parentNode;
    let t_id = b.querySelector('th').dataset.tovar;
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