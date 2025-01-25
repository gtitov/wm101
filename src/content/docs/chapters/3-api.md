## Заготовка для карты

Попробуем обратиться к публично доступным методам API Google-таблиц, а именно загрузить данные таблицы в формате CSV.

По аналогии с первым упражнением создадим заготовку для карты из файлов `index.html`, `style.css`, `main.js`.


<Tabs>
  <TabItem label="HTML">
    ```html title="index.html"
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Карта вакансий</title>
        <link rel="stylesheet" href="style.css">
        <script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script> 
        <link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
    </head>

    <body>
        <div id="map"></div>
        <script src="main.js"></script>
    </body>

    </html>
    ```
  </TabItem>
  <TabItem label="CSS">
    ```css title="style.css"
    #map {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    ```
  </TabItem>
  <TabItem label="JavaScript">
    ```js title="main.js"
    const map = new maplibregl.Map({
    container: 'map',
    style: "https://raw.githubusercontent.com/gtitov/basemaps/refs/heads/master/positron-nolabels.json",
    center: [51, 37],
    zoom: 4
    });
    ```
  </TabItem>
</Tabs>

<Card title={'Строка <code>&lt;div id="map">&lt;/div></code> это'}>
    <Question answer="контейнер для карты" ballast={['инициализация карты', 'стиль карты']} explanation="Это разметка контейнера карты"/>
</Card>

Удостоверимся, что карта отображается на локальном сервере.

## Обращение к API

Выполним запрос и выведем в консоль ответ

```js title="main.js"
map.on("load", () => {
  ...
  const response = fetch("https://docs.google.com/spreadsheets/d/1f0waZduz5CXdNig_WWcJDWWntF-p5gN2-P-CNTLxEa0/export?format=csv")
  console.log(response)
})
```

В консоль вывелся Promise -- обещание того, что браузер уже занимается нашим запросом. Ответ от сервера не вывелся, хотя во вкладке Сеть мы видим, что данные загружены. Дело в том, что вывод в консоль был выполнен раньше, чем мы получили ответ от сервера.

> Браузер начал исполнять наш код, увидел запрос к внешему ресурсу и подумал: "Здесь можно завязнуть. Ещё неизвестно, сколько этот внешний ресурс будет отвечать. Я верну пока обещание, что когда будет ответ, я его предоставлю, и отправлю запрос. А пока жду ответа буду дальше код выполнять."

Запрос к внешнему ресурсу выполняется асинхронно, то есть изымается из последовательного выполнения программного кода и выполняется отдельно. Поэтому вывод в консоль выполняется раньше того, как данные получены.

Чтобы этого не происходило, мы должны в явном виде указать, что код, использующий ответ на запрос, должен выполняться после выполнения запроса. Для этого используем конструкцию `fetch...then`

```js title="main.js"
map.on("load", () => {
  ...
  fetch("https://docs.google.com/spreadsheets/d/1f0waZduz5CXdNig_WWcJDWWntF-p5gN2-P-CNTLxEa0/export?format=csv")
    .then((response) => response.text())
    .then((csv) => {
      console.log(csv)
    })
})
```


<details>
<summary>В первой карте тоже был асинхронный код</summary>

Сама карта создаётся асинхронно, поэтому все действия по добавлению слоёв мы выполняем после загрузки карты `map.on('load', () => {})`. Функция, которая вызывается после успешного завершения события называется callback-функцией. Это ещё один вариант работы с асинхронностью. А ещё асинхронно выполняется добавление источников данных `map.addSource`, они же тоже фактически загружаются с сервера. В этом случае библиотека MapLibre сама отслеживает, что код по добавлению источника должен завершиться, прежде чем мы сможем создавать картографические слои `map.addLayer` из этого источника.

</details>

## Преобразование данных

MapLibre не может работать с форматом CSV. Мы должны преобразовать данные в знакомый формат GeoJSON. Сделаем это!

Подключим библиотеку для чтения CSV данных в JS-объект.

```html title="index.html"
<head>
  ...
  <script src="https://unpkg.com/papaparse@5.4.1/papaparse.min.js"></script>
</head>
```

Выполним чтение CSV данных c использованием подключенной библиотеки и сконструируем GeoJSON-объект.

```js title="main.js"
.then((csv) => {
  const rows = Papa.parse(csv, { header: true }) // читаем CSV
  // console.log(rows) // любуемся
  // Формируем объекты GeoJSON
  const geojsonFeatures = rows.data.map((row) => {
    return {
      type: "Feature",
      properties: row,
      geometry: {
        type: "Point",
        coordinates: [row.lon, row.lat],
      }
    }
  })
  const geojson = {
    type: "FeatureCollection",
    features: geojsonFeatures
  }
})
```

GeoJSON уже можно использовать в качестве источника для MapLibre.

## Работа над картой

У нас есть заготовка, есть данные, самое время заняться картой!

```js title="main.js"
.then((csv) => {
  ...
  const geojson = {
    type: "FeatureCollection",
    features: geojsonFeatures
  }

  map.addSource("vacancies", {
    type: "geojson",
    data: geojson,
    cluster: true, // точки будем объединять в кластеры
    clusterRadius: 20, // радиус поиска 20 пикселей
  });

  map.addLayer({
    id: "clusters",
    source: "vacancies",
    type: "circle",
    paint: {
      "circle-color": "#7EC8E3",
      "circle-stroke-width": 1,
      "circle-stroke-color": "#FFFFFF",
      "circle-radius": [
        "step", ["get", "point_count"],
        12, // до 3 точек в кластере
        3,  // --- первое граничное значение
        20, // от 3 точек до 6
        6,  // --- второе граничное значение
        30  // больше 6 точек в кластере
      ],
    },
  });

  map.addLayer({
    id: "clusters-labels",
    type: "symbol",
    source: "vacancies",
    layout: {
      "text-field": ["get", "point_count"],
      "text-size": 10,
    },
  });
})
```

## Сопутствующие элементы

Чаще всего карту сопровождают дополнительные элементы веб-страницы. Для этой карты мы приведём список всех вакансий и список вакансий, которые пользователь видит на карте при текущем охвате.

Разметим этим спискам место на веб-странице.

```html title="index.html"
<body>
    <div id="map"></div>
    <div id="list-selected"><h2>Сейчас на карте</h2></div>
    <div id="list-all"><h2>Все вакансии</h2></div>
    <script src="main.js"></script>
</body>
```

И зададим оформление.

```css title="style.css"
h2 {
    margin: 10px;
}

.list-item {
    padding: 10px;
}

#map {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 300px;
    left: 300px;
}

#list-selected {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 300px;
    overflow-y: auto;
}

#list-all {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 300px;
    overflow-y: auto;
}
```

Теперь на нашей веб-странице выделено место под списки. Плюс мы добавили оформление для заголовков второго уровня `h2` и создали класс `.list-item` для будущих элементов списка.

Сначала наполним список всех вакансий. Это нужно сделать единожды.

```js title="main.js"
.then((csv) => {
  ...
  geojson.features.map((f) => {
    document.getElementById(
      "list-all"
    ).innerHTML += `<div class="list-item">
    <h4>${f.properties["Вакансия"]}</h4>
    <a href='#' onclick="map.flyTo({center: [${f.geometry.coordinates}], zoom: 10})">Найти на карте</a>
    </div><hr>`;
  });
})
```

А список вакансий, которые видит пользователь при заданном охвате карты, надо будет обновлять при каждом перемещении по карте. Мы будем реагировать на окончание перемещения. Ещё одной сложностью является необходимость извлечь из каждого кластера сведения о том, какие объекты в него входят. Со всем этим мы прекрасно справимся.

```js title="main.js"
.then((csv) => {
  ...
  map.on('moveend', () => {
    const features = map.queryRenderedFeatures({
      layers: ["clusters"]
    });

    document.getElementById("list-selected").innerHTML = "<h2>Сейчас на карте</h2>"


    features.map(f => {
      if (f.properties.cluster) {
        const clusterId = f.properties.cluster_id;
        const pointCount = f.properties.point_count;
        map.getSource("vacancies").getClusterLeaves(clusterId, pointCount, 0)
          .then((clusterFeatures) => {
            clusterFeatures.map((feature) => document.getElementById("list-selected")
              .innerHTML += `<div class="list-item">
              <h4>${feature.properties["Вакансия"]}</h4>
              <a target="blank_" href='${feature.properties["Ссылка на сайте Картетики"]}'>Подробнее</a>
              </div><hr>`)
          });
      } else {
        document.getElementById("list-selected")
          .innerHTML += `<div class="list-item">
          <h4>${f.properties["Вакансия"]}</h4>
          <a target="blank_" href='${f.properties["Ссылка на сайте Картетики"]}'>Подробнее</a>
          </div><hr>`
      }
    })
  })
})
```

## Пара UX-штрихов

Для удобства пользования картой добавим приближение к карте по клику на объект и изменение курсора при наведении на слой.

```js title="main.js"
map.on("load", () => {
  ...
  map.on("click", "clusters", function (e) {
    map.flyTo({ center: e.lngLat, zoom: 8 });
  })

  map.on("mouseenter", "clusters", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "clusters", function () {
    map.getCanvas().style.cursor = "";
  });
})
```

Проделана прекрасная работа!

При желании посмотрите [полный код](https://github.com/gtitov/sheet-maplibre-map) и [возможный результат](https://gtitov.github.io/sheet-maplibre-map/).

## Упражнения

1. Сделайте, чтобы до первого перемещения карты список вакансий "Сейчас на карте" тоже был заполнен
1. Поменяйте местами списки (CSS)
1. Сделайте так, чтобы цвет кластера зависел от количества элементов внутри него

## Чтение

1. Что такое API / Дока [ссылка](https://doka.guide/tools/api/)
1. Асинхронность в JavaScript / Дока [ссылка](https://doka.guide/js/async-in-js/)
1. fetch() / Дока [ссылка](https://doka.guide/js/fetch/)
1. Promise / Дока [ссылка](https://doka.guide/js/promise/)
