// собираем коды маркировок с сайта https://честныйзнак.рф (crpt.ru) с автонажатием на след страницу
// весь текст для вставки и запуска в консоли браузера (режим разработчика)

// КОНСТАНТЫ - менять при необходимости ----------------------------------------

// цвет на проверку серой кнопки (если вдруг поменяется)
// выбор кнопки для нажатия (1 - вперед, 0 - назад)
// выбор сбора информации (1 - полный, 0 - только коды)
// задержка таймера для обновления (в миллисекундах)
const myGreyColor = 'rgb(196, 196, 196)';
const myButton = 1;
const myDataToCollect = 1;
const myTimerDelay = 1000;

// селекторы - поиск элементов на странице (коды, статус, кнопки вперед-назад)
const myQcode = "a.MuiTypography-root span";
const myQcodeDoc = 
	".MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-1" +
	".MuiGrid-wrap-xs-nowrap > div > div";
const myQstatus = 
	".MuiGrid-container.MuiGrid-item.MuiGrid-wrap-xs-nowrap" + 
	".MuiGrid-align-items-xs-center > div:last-child";
const myQbuttons = 
	".MuiGrid-root.MuiGrid-container" + 
	".MuiGrid-align-items-xs-center.MuiGrid-justify-xs-center > div > div";
// -----------------------------------------------------------------------------

// счетчик кодов, таймер
let myCounter = 0;
let myTimer;

// создаем элементы для отображения внизу на странице (текст, поле, кнопки)
let myData = document.createElement("p");
let myTextarea = document.createElement("TEXTAREA");
let myButtonStart = document.createElement("button");
let myButtonStop = document.createElement("button");
let myButtonCopy = document.createElement("button");

document.body.appendChild(myButtonStart);
myButtonStart.setAttribute("style", "width: 140px; height: 30px; margin: 10px;");
myButtonStart.setAttribute("onclick", "myTimerStart()");
myButtonStart.innerHTML = "Запуск";

document.body.appendChild(myButtonStop);
myButtonStop.setAttribute("style", "width: 140px; height: 30px; margin: 10px;");
myButtonStop.setAttribute("onclick", "myTimerStop()");
myButtonStop.innerHTML = "Остановка";

document.body.appendChild(myButtonCopy);
myButtonCopy.setAttribute("style", "width: 140px; height: 30px; margin: 10px;");
myButtonCopy.setAttribute("onclick", "myCopyTextarea()");
myButtonCopy.innerHTML = "Скопировать";

document.body.appendChild(myData);
myData.setAttribute("style", "margin: 10px;");

document.body.appendChild(myTextarea);
myTextarea.setAttribute("style", "width: 460px; height: 500px; margin: 10px;");

// Переменные в виде функции
// считываение, обновление данных и нажатие кнопки
const myUpdate = function() {
	let elements = document.querySelectorAll(myQcode);
	let elementsDoc = document.querySelectorAll(myQcodeDoc);
	if (elements.length == 0 && elementsDoc.length == 0) {
		myTimerStop("Ошибка обработки - не найдены коды!");
		return false
	}
	let status = document.querySelectorAll(myQstatus);
	if (status.length == 0 && elementsDoc.length == 0) {
		myTimerStop("Ошибка обработки - не найден статус!");
		return false
	}
	// обычный сбор кодов
	for (let i = 0; i < elements.length; i++) {
		myTextarea.value += elements[i].innerText;
		if (myDataToCollect == 1) {
			// добавляем статус и заменяем пробелы (для простоты обработки)
			myTextarea.value += " " + status[i].innerText.replace(" ", "_");
		}
		myTextarea.value += "\n";
	}
	// сбор кодов из документов - отгрузка товара - товары
	if (elements.length == 0 && elementsDoc.length != 0) {
		for (let i = 0; i < elementsDoc.length; i++) {
			myTextarea.value += elementsDoc[i].innerText.slice(0, 31);
			myTextarea.value += "\n";
		}
		myCounter += elementsDoc.length;
	}
	myCounter += elements.length;
	myData.textContent = "Количество - " + myCounter;
	document.querySelectorAll(myQbuttons)[myButton].click();
	return true
};

// обработка по таймеру, получаем цвет кнопок и проверяем что делать
const myRepeatFunction = function() {
	let buttons = document.querySelectorAll(myQbuttons);
	if (buttons.length == 0) {
		myTimerStop("Ошибка обработки - не найдены кнопки!");
		return
	}
	let button1 = getComputedStyle(buttons[0]).color;
	let button2 = getComputedStyle(buttons[1]).color;
	// проверки на кнопки
	if (button1 == myGreyColor && button2 == myGreyColor && myCounter != 0) {
		myData.textContent = "Количество - " + myCounter + " * Загрузка ... ";
	}
	else if (myUpdate()) {
		if ((button1 == myGreyColor && myButton == 0) ||
			(button2 == myGreyColor && myButton == 1)) {
				myTimerStop("Обработка завершена");
			}
	}
};


// запуск (обнуляемся и стартуем)
function myTimerStart() {
	myCounter = 0;
	myTextarea.value = "";
	myButtonCopy.innerHTML = "Скопировать";
	myData.textContent = "Количество - " + myCounter;
	myTimer = setInterval(myRepeatFunction, myTimerDelay);
}

// остановка или завершение обработки
function myTimerStop(info = "Обработка остановлена") {
	clearInterval(myTimer);
	myData.textContent = "Количество - " + myCounter + " * " + info;
}

// скопировать в буфер
function myCopyTextarea() {
	myTextarea.select();
	document.execCommand("copy");
	myButtonCopy.innerHTML = "Скопировано!";
}
// -----------------------------------------------------------------------------

