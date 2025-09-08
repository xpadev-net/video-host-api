```
npm install
npm run dev
```

```
open http://localhost:3000
```

## API

### Presigned upload URL (MinIO tmp bucket)

POST `/api/v4/uploads/presign`

Request body (JSON):

```
{
  "filename": "movie.mp4",
  "contentType": "video/mp4",
  "contentLength": 12345678
}
```

Response:

```
{
  "status": "ok",
  "code": 200,
  "data": {
    "url": "https://minio.example.com/tmp/...",
    "bucket": "tmp",
    "key": "videos/tmp/1710000000000-movie.mp4",
    "expiresIn": 900,
    "headers": {
      "Content-Type": "video/mp4",
      "Content-Length": "12345678"
    }
  }
}
```

Use the returned `url` to perform a direct PUT upload from the client:

```
fetch(url, { method: "PUT", headers, body: file })
```

Environment variables:

```
MINIO_ENDPOINT=http://localhost:9000
MINIO_REGION=us-east-1
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_FORCE_PATH_STYLE=true
MINIO_TMP_BUCKET=tmp
UPLOAD_MAX_SIZE_MB=1024
PRESIGN_EXPIRE_SECONDS=900
```

