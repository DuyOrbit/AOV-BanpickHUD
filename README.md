# Ban Pick AOV - Pro Control

Dự án này là một công cụ hỗ trợ cấm chọn (Ban/Pick) dành riêng cho tựa game Liên Quân Mobile (Arena of Valor - AOV), được thiết kế để phục vụ cho các buổi phát sóng trực tiếp (livestream) hoặc tổ chức giải đấu. 

## Cấu trúc dự án
- **`server.js`**: Máy chủ Node.js nhỏ giọt làm nhiệm vụ đồng bộ dữ liệu (state) giữa các trang web thông qua các API tĩnh (`/set`, `/get`, `/save-config`).
- **`admin.html`**: Bảng điều khiển dành cho quản trị viên (Admin/Đạo diễn hình ảnh). Cho phép setup tên đội, tỉ số, cầu thủ, điều khiển luồng cấm/chọn, chỉnh sửa ảnh hiển thị tướng (zoom, offset), và phát nhạc/âm thanh.
- **`index.html`**: Giao diện hiển thị trực quan (HUD) dành cho khán giả hoặc để đưa lên phần mềm stream (OBS, vMix).
- **`heroes.json`** & **`hero_offsets.json`**: Dữ liệu thông tin và các cài đặt căn chỉnh hình ảnh của tướng.

## Hướng dẫn sử dụng

### 1. Khởi động Server (Backend)
Máy chủ có tác dụng đồng bộ hóa trạng thái theo thời gian thực giữa Admin và màn hình hiển thị.
Mở Terminal / Command Prompt trong thư mục dự án và chạy:
```bash
node server.js
```
Server sẽ chạy tại `http://localhost:3000/`. Đừng đóng cửa sổ này.

### 2. Mở Giao Diện (Frontend)
Vì đây là ứng dụng sử dụng file tĩnh, bạn có thể mở giao diện bằng 2 cách:
- **Cách 1 (Đơn giản nhất)**: Mở trực tiếp file `admin.html` và `index.html` bằng trình duyệt web của bạn (Chrome, Edge, v.v.) bằng cách nhấp đúp vào file.
- **Cách 2 (Khuyên dùng)**: Sử dụng tiện ích **Live Server** trên VS Code để mở `admin.html` và `index.html`.

### 3. Thao tác trên Admin
Sau khi mở trang `admin.html`, bạn có thể:
- **Team & Series Setup**: Nhập tên đội, thêm logo, tỉ số và tên các tuyển thủ.
- **Broadcast & Reveal**: Điều khiển hiển thị HUD, bật/tắt nhạc, và chuyển cảnh (Reveal).
- **Ban/Pick**: Điều khiển trực tiếp các lượt cấm/chọn. Hệ thống có thứ tự các lượt được thiết lập sẵn, bạn chọn tướng và nhấn "KHÓA" (Lock) để xác nhận.
- **Tuning**: Điều chỉnh hình ảnh (Zoom, Tọa độ X/Y) cho từng tướng để hiển thị đẹp nhất trên màn hình HUD.

### Lưu ý
- Đảm bảo server (`node server.js`) luôn chạy để tín hiệu giữa Admin và màn hình Stream không bị ngắt quãng.
- Mọi thao tác lưu cấu hình (Save Config) sẽ được ghi thẳng vào tệp `hero_offsets.json` trong thư mục.
