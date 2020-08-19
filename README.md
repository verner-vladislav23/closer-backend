## Closest

### Docker
Окружение можно развернуть с помощью докера:

``` sh
cd docker
docker-compose up -d --build
```

После этого поднимутся нужные контейнеры (MongoDB и Minio). Обратите внимание на то, какие креды и порты используются для сервисов.

### Minio
Поставить клиент
``` sh
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
./mc --help
```

Дальше нужно создать запись в `/home/<username>/.mc/config.json`:

``` sh
# ./mc alias set <alias> <host> <access_key> <secret_key>
./mc alias set closer http://localhost:9001 minio minio123
```

``` sh
./mc mb closer/common                   # create bucket named 'common'
./mc cp ./bruh.txt closer/common        # загрузить тестовый файл в хранилище
./mc policy set download closer/common  # разрешить получать файлы по сети
```

### MongoDB

Нужно создать юзера и тестовый документ для базы
```
mongo localhost:3350/admin -uroot -pexample
use default
db.movie.insert({"name":"tutorials point"})

db.createUser(
  {
    user: "default",
    pwd: passwordPrompt(),  // or cleartext password
    roles: [
       { role: "readWrite", db: "default" }
    ]
  }
)
```
### Config
``` sh
cp -r src/config.example src/config
```

Then edit db credentials and other