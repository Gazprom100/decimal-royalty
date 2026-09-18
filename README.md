# DecimalChain Tokenization — прототип

Кликабельный прототип продукта: **заработок через помощь в создании токенов** для проектов в экосистеме DecimalChain.

## Экраны

| Путь | Что показывает |
|------|----------------|
| `/` | Публичный сайт: идея, цепочка ценности, механика долей |
| `/create` | Мастер создания токена + участники и доли |
| `/cabinet` | Личный кабинет: доход, проекты, история |
| `/admin` | Админ: метрики, графики, Marketing Reward %, реестр |
| `/token/:symbol` | Публичная страница токена (пример: `/token/BLOG`) |

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Деплой

Один статический webservice (Vercel / Netlify / Render):

- build: `npm run build`
- publish: `dist`
- SPA rewrite на `index.html` уже настроен (`vercel.json`, `public/_redirects`, `render.yaml`)

Переменные окружения не требуются для прототипа. Секреты для будущих интеграций задаются только в панели хостинга, без `.env` в репозитории.
