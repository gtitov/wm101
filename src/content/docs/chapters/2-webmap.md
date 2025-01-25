### Инициализация карты

Создадим файл разметки `index.html`.

```html title="index.html"
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Население мира</title>
    <!-- Запрашиваем стили 👇 -->
    <link rel="stylesheet" href="style.css">
    <!-- Запрашиваем библиотеку Maplibre 👇 -->
    <script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script> 
    <link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
</head>

<body>
    <!-- Размечаем контейнер для карты 👇 -->
    <div id="map"></div>
    <!-- Запрашиваем логику карты 👇 -->
    <script src="main.js"></script>
</body>

</html>
```

Библиотеку Maplibre мы запрашиваем из внешнего ресурса, а вот стили и логику карты нам нужно создать.

Создадим файл стилей `style.css`.

```css title="style.css"
/* Объявляем, что контейнер карты должен занимать всю страницу */
#map {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
```

И файл с логикой карты `main.js`.

```js title="main.js"
// Инициализируем карту
const map = new maplibregl.Map({
  container: 'map',
  style: "https://raw.githubusercontent.com/gtitov/basemaps/refs/heads/master/positron-nolabels.json",
  center: [51, 0],
  zoom: 4
});
```

После этого запустим Live Server, перейдём по адресу локального сервера и увидим карту.

> Наименование файла `index.html` важно тем, что именно страница `index.html` загружается при обращении к корневому URL. Наименования файлов CSS и JavaScript особой роли не играют.
>    
> Страница HTML является ключевой. Ей необходимо дать информацию о том, какие внешние библиотеки и файлы будут использоваться. В частности `style.css` и `main.js` являются внешними файлами. Для локальных файлов мы можем ввести относительные адреса. Удалённые (находящиеся на внешнем сервере) файлы необходимо подключать по URL.
>    
> В роли сервера может выступать компьютер, за которым вы работаете. Веб-сервер, запущенный на компьютере, достуен с этого комьютера по IP-адресу `127.0.0.1` или `localhost`. Это внутренний адрес. Он будет одним и тем же у всех компьютеров. И он недоступен для запросов снаружи.

### Добавление слоёв

Создадим подпапку `data` и загрузим в неё данные о [странах](https://raw.githubusercontent.com/gtitov/geojson-maplibre-map/refs/heads/master/data/countries.geojson), [городах](https://raw.githubusercontent.com/gtitov/geojson-maplibre-map/refs/heads/master/data/cities.geojson), [реках](https://raw.githubusercontent.com/gtitov/geojson-maplibre-map/refs/heads/master/data/rivers.geojson) и [озёрах](https://raw.githubusercontent.com/gtitov/geojson-maplibre-map/refs/heads/master/data/lakes.geojson).

Должна получится такая структура. HTML отвечает за структуру веб-страницы, CSS за оформление веб-страницы, JavaScript за логику работы веб-страницы. GeoJSON файлы хранят пространственные данные.

<FileTree>
- data/               # данные
  - cities.geojson    # города
  - countries.geojson # страны
  - lakes.geojson     # озёра
  - rivers.geojson    # реки
- index.html          # разметка
- style.css           # стили
- main.js             # логика
</FileTree>

Все действия с картой выполняются после первичной загрузки исходной карты.

Добавление картографических слоёв включает два шага: добавление источника данных `addSource` и добавление слоя `addLayer`. На первом шаге указываем, откуда мы будем брать данные, а на втором, как их оформить. Из одного источника можно создать несколько слоёв.

```js title="main.js"
// Инициализируем карту
...
map.on('load', () => {
    // Выполняется после загрузки карты
    // Добавление источника данных
     map.addSource('countries', {
        type: 'geojson',
        data: './data/countries.geojson',
        attribution: 'Natural Earth'
    })

    // Добавление слоя
    map.addLayer({
        id: 'countries-layer',
        type: 'fill',
        source: 'countries',
        paint: {
            'fill-color': 'lightgray',
        }
    })
})
```

Мы добавили полигональный слой (`type: 'fill'`). Аналогично добавляем слой линий и слой точек.


```js title="main.js"
// Инициализируем карту
...
map.on('load', () => {
    // Выполняется после загрузки карты
    ...
    map.addSource('rivers', {
        type: 'geojson',
        data: './data/rivers.geojson'
    })

    map.addLayer({
        id: 'rivers-layer',
        type: 'line',
        source: 'rivers',
        paint: {
            'line-color': '#00BFFF'
        }
    })

    map.addSource('lakes', {
        type: 'geojson',
        data: './data/lakes.geojson'
    })

    map.addLayer({
        id: 'lakes-layer',
        type: 'fill',
        source: 'lakes',
        paint: {
            'fill-color': 'lightblue',
            'fill-outline-color': '#00BFFF'
        }
    })

    map.addSource('cities', {
        type: 'geojson',
        data: './data/cities.geojson'
    })

    map.addLayer({
        id: 'cities-layer',
        type: 'circle',
        source: 'cities',
        paint: {
            'circle-color': 'rgb(123, 12, 234)',
            'circle-radius': 3
        }
    })
})
```

В MapLibre слои можно фильтровать и оформлять на основе атрибутов с помощью [выражений](https://maplibre.org/maplibre-style-spec/expressions/).

Например, оставим только города с численностью населения больше 1 000 000

```diff lang="js" title="main.js"
// Инициализируем карту
...
map.on('load', () => {
    // Выполняется после загрузки карты
    ...
    map.addLayer({
        id: 'cities-layer',
        type: 'circle',
        source: 'cities',
        paint: {
            'circle-color': 'rgb(123, 12, 234)',
            'circle-radius': 3
        },
+       filter: ['>', ['get', 'POP_MAX'], 1000000]
    })
})
```

Изобразим красным (`red`) цветом страны, у которых атрибут `MAPCOLOR7` равен 1, а остальные изобразим светло-серым (`lightgray`)

```diff lang="js" title="main.js"
// Инициализируем карту
...
map.on('load', () => {
    // Выполняется после загрузки карты
    ...
    map.addLayer({
        id: 'countries-layer',
        type: 'fill',
        source: 'countries',
        paint: {
-           'fill-color': 'lightgray',
+           'fill-color': ['match', ['get', 'MAPCOLOR7'], 1, 'red', 'lightgray']
        }
    })
    ...
})
```

### Расширение интерактивности

Созданная нами карта сразу даёт пользователю возможности перемещения, зума и даже наклона (попробуйте зажать правую кнопку мыши). Однако чтобы, например, выводить атрибутивные сведения о слое по клику, надо указать это в коде.

Отследим событие клика по слою `cities-layer`. Назовём событие клика переменной `e`. Посмотрим в консоли браузера, что собой представляет это событие. Если мы отслеживаем событие клика по конкретному слою, а не по всей карте, то мы можем обратиться к набору объектов, по которым был выполнен клик `e.features`

```js title="main.js"
// Инициализируем карту
...
map.on('load', () => {
    // Выполняется после загрузки карты
    ...
    map.on('click', ['cities-layer'], (e) => {
        console.log(e)
        console.log(e.features)
    })
})
```

Закомментируем вывод в консоль и выведем по клику на слой попап.

```js title="main.js"
// Инициализируем карту
...
map.on('load', () => {
    // Выполняется после загрузки карты
    ...
    map.on('click', ['cities-layer'], (e) => {
        // console.log(e)
        // console.log(e.features)
        new maplibregl.Popup() // создадим попап
            .setLngLat(e.features[0].geometry.coordinates) // установим на координатах объекта
            .setHTML(e.features[0].properties.NAME) // заполним  текстом из атрибута с именем объекта
            .addTo(map); // добавим на карту
    })
})
```

Попап отображается, но надо показать пользователю, что на объект можно кликать. При попадании мыши на слой `cities-layer` поменяем курсор на pointer, а при покидании слоя `cities-layer` вернём значение по умолчанию.

```js title="main.js"
// Инициализируем карту
...
map.on('load', () => {
    // Выполняется после загрузки карты
    ...
    map.on('mouseenter', 'cities-layer', () => {
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'cities-layer', () => {
        map.getCanvas().style.cursor = ''
    })
})
```

В качестве завершающего штриха уберём карту подложку и добавим фон. При этом фон добавляем перед всеми слоями, так как все слои должны рисоваться после фона, поверх него.

```diff lang="js" title="main.js"
// Инициализируем карту
const map = new maplibregl.Map({
  container: 'map',
- style: "https://raw.githubusercontent.com/gtitov/basemaps/refs/heads/master/positron-nolabels.json",
+ style: {
+   "version": 8,
+   "sources": {},
+   "layers": []
+ },
  center: [51, 0],
  zoom: 4
});

map.on('load', () => {
    // Выполняется после загрузки карты
+   map.addLayer({
+       id: 'background',
+       type: 'background',
+       paint: {
+       'background-color': 'lightblue'
+       }
+   })
    ...
})
```

У нас получилась отличная карта!

При желании посмотрите [полный код](https://github.com/gtitov/geojson-maplibre-map) и [возможный результат](https://gtitov.github.io/geojson-maplibre-map/).

## Что мы получили

Откроем вкладку Сеть в инструментах разработчика и ещё разок проследим поток данных

![geojson-network-tab](../../../assets/geojson-network-tab.png)

1. Пользователь вводит адрес карты в браузере (в клиенте)
1. Клиент выполняет запрос к серверу по введённому адресу
1. Сервер обрабатывает запрос и возвращает разметку (HTML) (1)
1. В разметке содержаться запросы к офомлению (CSS), картографической библиотеке (MapLibre) и программной логике работы (JavaScript) веб-страницы (2)
1. Клиент (браузер), получив все необходимые сведения, отображает веб-страницу
1. Программная логика работы полученной веб-страницы выполняется и в соотстветвии с кодом инициирует запросы к данным (GeoJSON) для составления карты (3)
1. Полученные данные оформляются на веб-карте в рамках описанной разработчиком на языке JavaScript логики с использованием функций библиотеки MapLibre
1. Пользователь получает веб-карту
1. Веб-карта обогащается дополнительной интерактивностью в рамках описанной разработчиком логики

Такая карта удобна, когда немного данных, потому что мы всё переправляем пользователю данные как есть. Когда мы отправляем пользователю данные как есть, почти не требуется серверных мощностей, поэтому для таких карт есть варианты бесплатного размещения в Интернете.

## Упражнения

1. Покрасьте Москву в красный цвет
2. Выведите в попап один из атрибутов стран
3. Добавьте слой с границами озёр, установите им толщину в 2 пикселя
4. Замените курсор на перекрестие (`crosshair`) при расположении поверх стран