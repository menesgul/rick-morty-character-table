# Rick and Morty Karakter Tablosu - Yazılım Gereksinimleri Spesifikasyonu (SRS)

## 1. Proje Genel Bakış
### 1.1 Amaç
Rick and Morty API'sini kullanarak, kullanıcı dostu, filtreleme ve sıralama özelliklerine sahip interaktif bir karakter tablosu oluşturmak.

### 1.2 Hedef Kitle
- Frontend geliştirici pozisyonu için değerlendirme yapacak teknik ekip
- Potansiyel kullanıcılar

## 2. Fonksiyonel Gereksinimler

### 2.1 Veri Görüntüleme
- [FR-1] Tablo en az 250 karakter içermelidir
- [FR-2] Her karakter için aşağıdaki bilgiler görüntülenmelidir:
  * İsim
  * Durum (Status)
  * Tür (Species)
  * Cinsiyet (Gender)
  * Lokasyon
  * Görüntü (Image)

### 2.2 Filtreleme Özellikleri
- [FR-3] Çoklu filtreleme desteği
- [FR-4] Aşağıdaki alanlara göre filtreleme yapılabilmeli:
  * İsim
  * Durum
  * Tür
  * Cinsiyet
- [FR-5] Filtreleme sonucu veri bulunamazsa kullanıcıya uygun mesaj gösterilmeli

### 2.3 Sıralama Özellikleri
- [FR-6] Tüm sütunlara göre sıralama yapılabilmeli
- [FR-7] Artan/azalan sıralama seçeneği

### 2.4 Sayfalama
- [FR-8] Sayfa başına gösterilecek kayıt sayısı ayarlanabilmeli
- [FR-9] Sayfa numaralandırma sistemi
- [FR-10] Sayfa geçişleri için navigasyon butonları

### 2.5 Detay Görüntüleme
- [FR-11] Tablo satırına tıklandığında karakter detayları görüntülenmeli
- [FR-12] Detay görünümünde ek bilgiler gösterilmeli

## 3. Teknik Gereksinimler

### 3.1 Teknoloji Yığını
- [TR-1] Frontend Framework: React
- [TR-2] Programlama Dili: TypeScript/JavaScript
- [TR-3] State Yönetimi: Redux/Context API
- [TR-4] API İletişimi: Axios/Fetch
- [TR-5] UI Kütüphanesi: Material-UI/Ant Design

### 3.2 Performans Gereksinimleri
- [PR-1] Sayfa yüklenme süresi < 3 saniye
- [PR-2] Filtreleme işlemleri < 1 saniye
- [PR-3] Sayfalama geçişleri < 500ms

### 3.3 Güvenlik Gereksinimleri
- [SR-1] API isteklerinde hata yönetimi
- [SR-2] Kullanıcı girdilerinin sanitize edilmesi
- [SR-3] Rate limiting uygulanması

## 4. Kullanıcı Arayüzü Gereksinimleri

### 4.1 Genel UI Gereksinimleri
- [UI-1] Responsive tasarım
- [UI-2] Modern ve kullanıcı dostu arayüz
- [UI-3] Tutarlı renk şeması ve tipografi
- [UI-4] Yükleme durumları için loading göstergeleri

### 4.2 Bileşen Gereksinimleri
- [UI-5] Filtreleme paneli
- [UI-6] Sıralama kontrolleri
- [UI-7] Sayfalama kontrolleri
- [UI-8] Detay görünümü modalı

## 5. Test Gereksinimleri
- [TEST-1] Birim testleri
- [TEST-2] Entegrasyon testleri
- [TEST-3] UI testleri
- [TEST-4] Performans testleri

## 6. Dağıtım Gereksinimleri
- [DEP-1] GitHub üzerinde public repository
- [DEP-2] Vercel üzerinde canlı demo
- [DEP-3] README.md dosyası
- [DEP-4] Deployment linki

## 7. Kod Kalitesi Gereksinimleri
- [CQ-1] ESLint kurallarına uygunluk
- [CQ-2] TypeScript strict mode
- [CQ-3] Temiz kod prensipleri
- [CQ-4] Yorum satırları ve dokümantasyon
- [CQ-5] Modüler kod yapısı

## 8. Kabul Kriterleri
1. Tüm fonksiyonel gereksinimler karşılanmalı
2. Performans gereksinimleri sağlanmalı
3. Kod kalitesi standartlarına uyulmalı
4. Test coverage minimum %80 olmalı
5. Vercel üzerinde başarılı deployment
6. Responsive tasarım tüm ekran boyutlarında test edilmeli
7. Tüm hata senaryoları ele alınmış olmalı

## 9. API Gereksinimleri

### 9.1 Kullanılacak API
- [Rick and Morty API](https://rickandmortyapi.com/)
- REST endpoint: `https://rickandmortyapi.com/api/character`
- API, karakter verilerini sayfalı olarak döner (varsayılan: 20 karakter/sayfa, toplam: 826 karakter)
- Filtreleme parametreleri: `name`, `status`, `species`, `type`, `gender`
- Sayfalama parametresi: `page`
- Detay için: `/character/{id}` endpointi kullanılacak

### 9.2 API Yanıt Şeması
- Karakter listesi: `results` (array), `info` (sayfalama bilgisi)
- Karakter detayları: `id`, `name`, `status`, `species`, `type`, `gender`, `origin`, `location`, `image`, `episode`, `url`, `created` 