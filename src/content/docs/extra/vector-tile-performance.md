---
title: Производительность векторных тайлов
tableOfContents: false
sidebar:
    order: 7
---

Формирование тайла представляет собой запрос кусочка из полного набора пространственных данных, его перепроецирование и кодирование в векторных тайл.

Такие популярные серверы векторных тайлов, как Martin, Tegola, pg_tileserv, формируют тайл средствами базы данных PostGIS. Увидеть запросы, которые они используют можно в режиме отладки. Изучив запросы видно, что на производительность формирования тайлов влияет
1. наличие пространственного индекса, так как есть этап запроса кусочка набора данных по границам тайла
2. проекция исходного набора данных, так как есть этап перепроецирования

Проверим это на запросах к линейному набору пространственных данных

```sql
-- EPSG:4326 без индекса
SELECT ((SELECT ST_AsMVT(q,'lines',4096,'geom','fid') AS data FROM (SELECT ST_AsMVTGeom(ST_Transform(geom, 3857), ST_TileEnvelope(6, 37, 20)) as geom, fid FROM lines WHERE geom && ST_TileEnvelope(6, 37, 20)) AS q)) AS data;

-- EPSG:4326 с индексом
SELECT ((SELECT ST_AsMVT(q,'lines_index',4096,'geom','fid') AS data FROM (SELECT ST_AsMVTGeom(ST_Transform(geom, 3857), ST_TileEnvelope(6, 37, 20)) as geom, fid FROM lines_index WHERE geom && ST_TileEnvelope(6, 37, 20)) AS q)) AS data;

-- EPSG:3857 без индекса
SELECT ((SELECT ST_AsMVT(q,'lines3857',4096,'geom','fid') AS data FROM (SELECT ST_AsMVTGeom(geom, ST_TileEnvelope(6, 37, 20)) as geom, fid FROM lines3857 WHERE geom && ST_TileEnvelope(6, 37, 20)) AS q)) AS data;

-- EPSG:3857 с индексом
SELECT ((SELECT ST_AsMVT(q,'lines3857_index',4096,'geom','fid') AS data FROM (SELECT ST_AsMVTGeom(geom, ST_TileEnvelope(6, 37, 20)) as geom, fid FROM lines3857_index WHERE geom && ST_TileEnvelope(6, 37, 20)) AS q)) AS data;
```

|                           | без индекса | с индексом |
| ------------------------- | ----------- | ---------- |
| другая проекция (4326)    | 389,4 мс    | 3,5 мс     |
| проекция веб-карты (3857) | 13,5 мс     | 0,7 мс     |

При запросе тайла на весь мир (фактически всех данных) индекс становится менее существенным.

```sql
-- EPSG:4326 без индекса
SELECT ((SELECT ST_AsMVT(q,'lines',4096,'geom','fid') AS data FROM (SELECT ST_AsMVTGeom(ST_Transform(geom, 3857), ST_TileEnvelope(0, 0, 0)) as geom, fid FROM lines WHERE geom && ST_TileEnvelope(0, 0, 0)) AS q)) AS data;

-- EPSG:4326 с индексом
SELECT ((SELECT ST_AsMVT(q,'lines_index',4096,'geom','fid') AS data FROM (SELECT ST_AsMVTGeom(ST_Transform(geom, 3857), ST_TileEnvelope(0, 0, 0)) as geom, fid FROM lines_index WHERE geom && ST_TileEnvelope(0, 0, 0)) AS q)) AS data;

-- EPSG:3857 без индекса
SELECT ((SELECT ST_AsMVT(q,'lines3857',4096,'geom','fid') AS data FROM (SELECT ST_AsMVTGeom(geom, ST_TileEnvelope(0, 0, 0)) as geom, fid FROM lines3857 WHERE geom && ST_TileEnvelope(0, 0, 0)) AS q)) AS data;

-- EPSG:3857 с индексом
SELECT ((SELECT ST_AsMVT(q,'lines3857_index',4096,'geom','fid') AS data FROM (SELECT ST_AsMVTGeom(geom, ST_TileEnvelope(0, 0, 0)) as geom, fid FROM lines3857_index WHERE geom && ST_TileEnvelope(0, 0, 0)) AS q)) AS data;
```

|                           | без индекса | с индексом |
| ------------------------- | ----------- | ---------- |
| другая проекция (4326)    | 544,7 мс    | 519,3 мс   |
| проекция веб-карты (3857) | 44,1 мс     | 41,2 мс    |


Проекция и пространственный индекс позволяют ускорить формирование тайлов, однако наибольший прирост производительности даёт *кэширование*, то есть сохранение результатов запросов.

Если данные меняются редко можно предварительно рассчитать тайлы. Для хранения используются форматы MBTiles и PMTiles.