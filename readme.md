Các service trong dự án:

- Gateway: NestJS - handle các request tới các internal service và trả response về cho người dùng, xác thực người dùng ở service này
- Product: NestJS - DB: MongoDB: xử lý thông tin về product trong hệ thống
- Order: Spring boot - Postgresql
- Rating
- Virtual Tryons: PYTHON
- Searching: Sử dụng ElasticSearch để full-text search, một số technique để improve searching đối với tiếng việt cũng như hình ảnh, hình ảnh tương tự
