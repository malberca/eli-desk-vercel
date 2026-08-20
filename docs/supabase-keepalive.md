# Supabase keepalive

Este proyecto ahora expone `GET /api/keepalive/supabase` para generar una consulta liviana a Supabase y evitar que el proyecto quede inactivo.

## Variables de entorno

Agregá estas variables en el entorno donde corre el dashboard:

```bash
SUPABASE_KEEPALIVE_SECRET=poné-un-secret-largo
SUPABASE_KEEPALIVE_TABLE=admin_users
```

`SUPABASE_KEEPALIVE_TABLE` es opcional. Si no la definís, usa `admin_users`.

## Llamada desde Mars

Configurá un job programado que haga un `GET` cada 3 o 4 días:

```bash
curl -X GET \
  "$APP_URL/api/keepalive/supabase" \
  -H "Authorization: Bearer $SUPABASE_KEEPALIVE_SECRET"
```

## Recomendación

Usá una frecuencia menor a 7 días. Cada 72 horas suele ser una buena opción para no quedar al límite.
