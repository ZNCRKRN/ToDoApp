# ToDoApp

Kullanıcı girişi destekli, öncelik/kategori etiketleme ve arama-filtreleme özellikli full-stack bir Yapılacaklar Listesi uygulaması.

- **Backend:** ASP.NET Core 9 Web API, Entity Framework Core (SQLite), AutoMapper, JWT tabanlı kimlik doğrulama
- **Frontend:** React + Vite, React Router, Context API (tema, auth, toast bildirimleri)

## Özellikler

- 🔐 Kayıt ol / giriş yap (JWT), her kullanıcı yalnızca kendi görevlerini görür
- ✅ Görev oluşturma, düzenleme, tamamlama, silme (soft delete)
- 🚦 Öncelik seviyesi (Düşük / Orta / Yüksek) ve serbest metin kategori etiketi
- 🔍 Görevlerde arama, önceliğe/kategoriye/duruma göre filtreleme, çoklu sıralama seçeneği
- 📊 Panel sayfasında toplam / tamamlanan / bekleyen / tamamlanma yüzdesi istatistikleri
- 🌗 Açık / koyu tema (tercih localStorage'da saklanır)
- 📱 Mobile-first, responsive tasarım
- 🔔 Toast bildirimleri ile kullanıcı geri bildirimi
- 🛡️ Geçmiş tarihe görev oluşturma engeli, global hata yönetimi, kullanıcılar arası veri izolasyonu

## Proje Yapısı

```
ToDoApp/
├── backend/     ASP.NET Core Web API (TodoApi)
└── frontend/    React + Vite uygulaması
```

## Backend'i çalıştırma

```bash
cd backend
dotnet restore
dotnet run
```

API varsayılan olarak `http://localhost:5214` adresinde ayağa kalkar ve açılışta migration'ları otomatik uygular (SQLite dosyası: `backend/todoapi.db`, gitignore'da).
Swagger arayüzü: `http://localhost:5214/swagger`

### JWT ayarı

`backend/appsettings.json` içindeki `Jwt:Key` yalnızca **yerel geliştirme** için örnek bir anahtardır. Gerçek bir ortama taşırken mutlaka yeni, gizli bir anahtar üretip ortam değişkeni / secret store üzerinden sağlayın.

## Frontend'i çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` üzerinden açılır ve backend'e `http://localhost:5214` adresinden istek atar (CORS backend tarafında bu origin için açıktır).

## API Uç Noktaları (özet)

| Metot | Yol | Açıklama |
|---|---|---|
| POST | `/api/auth/register` | Kayıt ol, JWT döner |
| POST | `/api/auth/login` | Giriş yap, JWT döner |
| GET | `/api/tasks` | Görevleri listele (`search`, `priority`, `category`, `isCompleted`, `sortBy`, `descending` query parametreleri) |
| GET | `/api/tasks/{id}` | Tek görev getir |
| GET | `/api/tasks/stats` | İstatistikler |
| GET | `/api/tasks/categories` | Kullanıcının kullandığı kategoriler |
| POST | `/api/tasks` | Yeni görev oluştur |
| PUT | `/api/tasks/{id}` | Görevi güncelle |
| PATCH | `/api/tasks/{id}/toggle` | Tamamlandı durumunu değiştir |
| DELETE | `/api/tasks/{id}` | Görevi sil (soft delete) |

`tasks` altındaki tüm uç noktalar `Authorization: Bearer {token}` header'ı gerektirir.
