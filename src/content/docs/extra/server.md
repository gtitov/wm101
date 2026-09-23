---
title: Настройка сервера
draft: true
tableOfContents: false
---

Покупаем сервер. Получаем IP, имя пользователя и пароль.

Устанавливаем расширение Remote-SSH. Подключаемся к серверу.

Переносим данные (кроме `.venv/`).

Устанавливаем Caddy. 

```
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg
sudo chmod o+r /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Проверяем работу. `sudo systemctl status caddy`

Редактируем `etc/caddy/Caddyfile`

```
:80 {
    root * /srv/cities-index/
    file_server
}
```

`sudo systemctl reload caddy`

```
cd /srv/cities-index/backend
python3 -m venv .venv
source .venv/bin/activate
pip install Flask
pip install gunicorn
nohup gunicorn app:app > app.log 2>&1 &
```

Заменяем адрес в коде фронтенда.