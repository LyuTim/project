$(function(){
    $('.submenu_mover').click(function(){
        if ($(this).parent().hasClass('open')) {
            $('.catmenu_item.open').removeClass('open').find('.submenu').animate({
                height: 0
            }, 1000);
        } else {
            $('.catmenu_item.open').removeClass('open').find('.submenu').animate({
                height: 0
            }, 1000);
            $(this).parent().addClass('open').find('.submenu').animate({
                height: ($(this).parent().find('.submenu a').length * 24)
            }, 1000);
        }
    });
    
    $('button.basket').click(function(){
        $('.popup-desk').addClass('active');
        $('.popup').html('<p class="popup-header">Личный кабинет</p><input type="text" name="fullname" placeholder="Логин"><input type="password" name="password" placeholder="Пароль"><button type="submit">Войти</button><a href="https://yandex.ru/" class="register">Зарегистрироваться</a>');
        $('.basket').html(6);
    });
    
    $('.popup-desk').click(function(e){
        if (e.target == this) {
            $(this).removeClass('active');
            $('.popup').empty();
            $('.basket').html(5);
        }
    });
    
    $(document).on('click', '.register', function(e){
        e.preventDefault();
        if ($('.basket').html()==6) {
            $('.popup').html('<p class="popup-header">Личный кабинет закрыт на ремонт.<br>Регистрации не будет до 1 января.</p><a href="https://yandex.ru/" class="register">Войти</a>');
            $('.basket').html(5);
        } else {
            $('.popup').html('<p class="popup-header">Личный кабинет</p><input type="text" name="fullname" placeholder="Логин"><input type="password" name="password" placeholder="Пароль"><button type="submit">Войти</button><a href="https://yandex.ru/" class="register">Зарегистрироваться</a>');
            $('.basket').html(6);
        }
    });
    
    $(document).on('click', 'button[type="submit"]', function(){
        alert('OGOGO!!!');
    });
    
    $(document).on('click', '.order .del > div', function(){
        tovarDelete(this);
    });
    
    $(document).on('change input', '.order .num > input', function(){
        tovarChange(this);
    });
	$('#privet').click(function(){alert('Привет!')});
});



/* order */
const order = [
    {
        id: 5711,
        name: 'Товар 1',
        value: 10,
        price: 5
    },
    {
        id: 3432,
        name: 'Товар 2',
        value: 10,
        price: 10
    },
    {
        id: 4846,
        name: 'Товар 3',
        value: 10,
        price: 15
    }
]
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
        document.querySelector('.table').remove();
        document.querySelector('.nihil').style = 'display:block';
    }
}
function tovarChange(a) {
    let b = a.parentNode.parentNode;
	let newVal = b.querySelector('input').value();
	let t_id = b.querySelector('th').dataset.tovar;
    for (let i = 0; i < order.length; i++) {
        if (order[i].id == t_id) {
            order[i].value = order[1].value(newVal);
			console.log(newVal);
        }
    }
	
	// опознать товар
    // найти его в ордере
    // изменить количество в ордере
    // вызвать пересчет +
    
    tovarCount();
}
function tovarCount() {
    alert('It works!');
}
