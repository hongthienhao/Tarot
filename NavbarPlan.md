# Navbar Content Upgrade Plan

## Tiến Độ Thực Hiện

- [x] Phase 1 - Content Architecture & Data Model
- [x] Phase 2 - Upgrade Chiêm Tinh Page
- [x] Phase 3 - Upgrade Bản Đồ Cosmic Page
- [x] Phase 4 - Upgrade Ý Nghĩa Bài Tarot Dictionary
- [x] Phase 5 - Upgrade Về Chúng Tôi
- [x] Phase 6 - UX Copy, Navigation & Polish
- [x] Phase 7 - QA & Acceptance Checklist

## Phạm vi

Trang chủ và trang Tarot hiện đã đạt yêu cầu. Plan này tập trung nâng cấp 4 mục còn lại trên navbar:

- `Chiêm Tinh` - route `/astrology`
- `Bản Đồ` - route `/cosmic`
- `Ý Nghĩa Bài` - modal `CardDictionaryModal`
- `Về Chúng Tôi` - modal `AboutModal`

Mục tiêu là biến các mục này từ nội dung ngắn/teaser thành trải nghiệm chỉnh chu, đầy đủ, có chiều sâu, thống nhất với chất lượng của trang chủ và Tarot.

## Audit Hiện Trạng

### 1. Chiêm Tinh (`frontend/src/pages/AstrologyPage.jsx`, `frontend/src/components/ZodiacDailySection.jsx`)

Hiện trạng:

- Trang đang có banner ngắn và grid 12 cung hoàng đạo.
- Nội dung mỗi cung gồm ngày, nguyên tố, điểm năng lượng, lá bài may mắn và lời khuyên ngắn.
- Dự báo đang hard-code, chưa có ngày hiển thị rõ, chưa có nhịp nội dung theo ngày/tuần/tháng.
- Chưa có phần hướng dẫn người dùng hiểu "đọc chiêm tinh như thế nào" hoặc kết nối chiêm tinh với Tarot.

Vấn đề:

- Trang có tương tác nhưng thiếu chiều sâu nội dung.
- Người dùng xem xong grid chưa có hành trình tiếp theo rõ ràng.
- Các câu dự báo khá ngắn, chưa đủ "premium" hoặc có cảm giác được biên soạn kỹ.

### 2. Bản Đồ (`frontend/src/pages/CosmicSanctuaryPage.jsx`)

Hiện trạng:

- Trang là một hub cá nhân hóa dựa trên hồ sơ người dùng.
- Có 3 tab: bản đồ chiêm tinh, thần số học, tần số linh hồn.
- Khi chưa có ngày sinh/tên, nội dung chủ yếu là empty state yêu cầu cập nhật hồ sơ.
- Khi có dữ liệu, nội dung vẫn ngắn: cung, nguyên tố, tương hợp, vài chỉ số thần số, resonance score.

Vấn đề:

- Tên "Bản Đồ" gợi kỳ vọng về một bản đồ linh hồn/cosmic profile đầy đủ hơn hiện tại.
- Empty state chiếm nhiều trải nghiệm với người chưa đăng nhập/chưa cấu hình.
- Chưa có hệ thống phân tích theo lớp: bản mệnh, cảm xúc, hành động, bài học, gợi ý Tarot.

### 3. Ý Nghĩa Bài (`frontend/src/components/CardDictionaryModal.jsx`, `src/data/cardsData.js`)

Hiện trạng:

- Modal đã có UI thư viện 78 lá, search, filter theo bộ, detail xuôi/ngược.
- Nội dung mỗi lá trong `cardsData.js` hiện chỉ có `meaningUpright` và `meaningReversed`.
- Detail có thêm đoạn "Chiêm nghiệm cốt tủy" dạng template, chưa thật sự riêng cho từng lá.

Vấn đề:

- Tra cứu được nhưng chưa đủ như một "cổ thư giải nghĩa" hoàn chỉnh.
- Thiếu keyword, biểu tượng, bối cảnh tình yêu/công việc/tài chính/tinh thần, câu hỏi chiêm nghiệm, lời khuyên hành động.
- Search hiện chủ yếu theo tên lá, chưa tận dụng keyword hoặc suit/arcana bằng tiếng Việt.

### 4. Về Chúng Tôi (`frontend/src/components/AboutModal.jsx`)

Hiện trạng:

- Modal có câu chuyện thương hiệu, 2 pillar về bảo mật và cộng đồng.
- Nội dung có vibe tốt nhưng còn chung chung.
- Chưa giải thích rõ triết lý sản phẩm, giới hạn trách nhiệm, vai trò AI, dữ liệu người dùng, niềm tin thiết kế.

Vấn đề:

- Chưa tạo đủ độ tin cậy cho một sản phẩm tâm linh dùng AI.
- Thiếu cấu trúc professional: sứ mệnh, phương pháp, nguyên tắc đạo đức, quyền riêng tư, cách diễn giải kết quả.
- Chưa có CTA mềm dẫn người dùng quay lại trải bài/cấu hình hồ sơ.

## Phase 1 - Content Architecture & Data Model

Mục tiêu: chuẩn hóa cấu trúc nội dung trước khi viết UI lớn.

Việc cần làm:

- Tạo inventory nội dung cho 4 mục navbar, tách rõ phần copy tĩnh, dữ liệu tra cứu, dữ liệu cá nhân hóa.
- Đề xuất tách dữ liệu khỏi component:
  - `frontend/src/data/zodiacContent.js`
  - `frontend/src/data/cosmicContent.js`
  - `frontend/src/data/tarotDictionaryContent.js`
  - `frontend/src/data/aboutContent.js`
- Chuẩn hóa tone tiếng Việt: huyền bí nhưng rõ nghĩa, tránh câu quá mơ hồ hoặc lặp từ "linh hồn/vũ trụ" liên tục.
- Xác định content schema cho từng nhóm:
  - Chiêm tinh: overview, traits, shadow, growth path, tarot ally, daily/weekly guidance.
  - Bản đồ: profile summary, archetype, elemental balance, numerology matrix, suggested spread.
  - Ý nghĩa bài: keywords, upright, reversed, love, career, finance, spirituality, journaling prompt, action advice.
  - Về chúng tôi: mission, method, privacy, AI ethics, disclaimer, team/product philosophy.

Deliverable:

- Một bộ schema nội dung rõ ràng để phase sau chỉ việc fill content và render.
- Danh sách component nào cần đọc dữ liệu từ file data thay vì hard-code.

Tiêu chí hoàn thành:

- Mỗi mục navbar có cấu trúc heading/subheading/section rõ ràng.
- Không còn nội dung nằm rải rác khó kiểm soát trong JSX nếu đó là copy dài.

## Phase 2 - Upgrade Chiêm Tinh Page

Mục tiêu: biến `/astrology` thành trang chiêm tinh đầy đủ, có giá trị đọc ngay cả khi người dùng chưa đăng nhập.

Nội dung đề xuất:

- Hero compact:
  - Tiêu đề: "Chiêm Tinh Ứng Dụng Cho Hành Trình Nội Tâm"
  - Mô tả rõ trang này giúp đọc năng lượng ngày, nguyên tố, cung, và liên hệ Tarot.
  - Hiển thị ngày hiện tại của dự báo.
- Section "Tổng Quan Năng Lượng Hôm Nay":
  - Chủ đề chung trong ngày.
  - Nguyên tố nổi bật.
  - Lá Tarot đại diện.
  - Gợi ý hành động ngắn.
- Section "12 Cung Hoàng Đạo":
  - Giữ grid hiện có nhưng mỗi card có thêm 2-3 keyword.
  - Modal detail mở rộng:
    - Tính cách cốt lõi.
    - Mặt sáng.
    - Mặt bóng.
    - Lời khuyên tình cảm.
    - Lời khuyên công việc.
    - Lá Tarot đồng hành.
    - Câu hỏi chiêm nghiệm trong ngày.
- Section "Học Cách Đọc Cung Của Bạn":
  - Giải thích Sun sign, nguyên tố, ruling planet ở mức dễ hiểu.
  - Nhắc rõ đây là nội dung chiêm nghiệm, không phải quyết định thay người dùng.
- CTA:
  - "Cá nhân hóa bằng hồ sơ của bạn" dẫn sang `/cosmic`.
  - "Rút bài theo năng lượng hôm nay" dẫn sang `/tarot`.

File liên quan:

- `frontend/src/pages/AstrologyPage.jsx`
- `frontend/src/components/ZodiacDailySection.jsx`
- `frontend/src/utils/astrology.js`
- Đề xuất thêm `frontend/src/data/zodiacContent.js`

Tiêu chí hoàn thành:

- Người dùng chưa đăng nhập vẫn có một trang đáng đọc.
- Mỗi cung có nội dung sâu hơn một câu dự báo.
- Có luồng đi tiếp rõ: đọc cung -> cấu hình hồ sơ -> trải Tarot.

## Phase 3 - Upgrade Bản Đồ Cosmic Page

Mục tiêu: biến `/cosmic` thành "Cosmic Soul Hub" đúng nghĩa, không chỉ là màn hình yêu cầu cập nhật hồ sơ.

Nội dung đề xuất:

- Hero:
  - Giải thích "Bản Đồ Nguyên Khí" là nơi tổng hợp chiêm tinh, thần số học và Tarot profile.
  - Có preview mẫu cho người chưa nhập ngày sinh.
- Empty state nâng cấp:
  - Không chỉ báo "chưa cấu hình".
  - Hiển thị "Bạn sẽ nhận được gì sau khi cập nhật hồ sơ":
    - Cung bản mệnh.
    - Nguyên tố chủ đạo.
    - Life Path.
    - Destiny Number.
    - Personal Year.
    - Lá Tarot hộ mệnh.
    - Gợi ý trải bài cá nhân hóa.
- Tab `Bản Đồ Chiêm Tinh`:
  - Cung mặt trời.
  - Nguyên tố và hành tinh trị vì.
  - Strengths, growth edges, emotional pattern.
  - Compatibility nên có giải thích, không chỉ list tag.
- Tab `Tam Hợp Thần Số`:
  - Life Path, Destiny, Personal Year hiện có.
  - Mỗi số cần thêm: keyword, bài học, thử thách, lời khuyên hành động.
  - Thay hard-code năm `2026` bằng năm hiện tại hoặc utility dùng date runtime.
- Tab `Tần Số Linh Hồn`:
  - Resonance score cần có ý nghĩa và cách đọc.
  - Chia thành các trục: trực giác, hành động, cảm xúc, ổn định.
  - Gợi ý spread Tarot phù hợp theo hồ sơ.
- Section "Bản Đồ Của Bạn Nói Gì?":
  - Tóm tắt 3-5 insight cá nhân hóa.
  - Dẫn CTA sang trải bài Tarot.

File liên quan:

- `frontend/src/pages/CosmicSanctuaryPage.jsx`
- `frontend/src/components/UserProfileModal.jsx`
- `frontend/src/utils/astrology.js`
- Đề xuất thêm `frontend/src/data/cosmicContent.js`

Tiêu chí hoàn thành:

- Trang có giá trị cả trước và sau khi người dùng nhập hồ sơ.
- Các chỉ số cá nhân hóa có giải thích và hướng hành động.
- Không còn cảm giác "Bản Đồ" chỉ là vài card thống kê.

## Phase 4 - Upgrade Ý Nghĩa Bài Tarot Dictionary

Mục tiêu: biến modal tra cứu thành thư viện Tarot hoàn chỉnh, vừa đẹp vừa giàu nội dung.

Nội dung đề xuất:

- Mở rộng dữ liệu mỗi lá:
  - `keywords`
  - `summary`
  - `meaningUpright`
  - `meaningReversed`
  - `love`
  - `career`
  - `finance`
  - `spirituality`
  - `shadow`
  - `advice`
  - `journalPrompt`
  - `relatedCards`
- Nâng cấp danh sách:
  - Card preview có keyword ngắn.
  - Search theo tên, keyword, suit, arcana.
  - Filter thêm: Major/Minor, bộ bài, chủ đề tình yêu/công việc/chữa lành.
- Nâng cấp detail:
  - Intro summary riêng từng lá.
  - Tabs hoặc segmented control: Tổng quan, Tình yêu, Công việc, Tinh thần.
  - Block "Khi lá này xuất hiện, hãy tự hỏi..."
  - Block "Hành động nhỏ hôm nay".
  - Related cards để khám phá tiếp.
- Cải thiện nội dung hiện tại:
  - Sửa typo/diễn đạt chưa ổn trong dữ liệu, ví dụ `Nhà Băng Nhẫn` nên kiểm tra lại thành `Nhà Ảo Thuật` hoặc tên Việt thống nhất.
  - Thống nhất tên bộ: Wands/Gậy, Cups/Cốc, Swords/Kiếm, Pentacles/Xu.

File liên quan:

- `frontend/src/components/CardDictionaryModal.jsx`
- `src/data/cardsData.js`
- `frontend/public/assets/cards/*`
- Đề xuất thêm hoặc đồng bộ `frontend/src/data/tarotDictionaryContent.js`

Tiêu chí hoàn thành:

- Mỗi lá bài có ít nhất 6-8 trường nội dung hữu ích.
- Người dùng có thể tra cứu theo nhu cầu thực tế, không chỉ đọc xuôi/ngược.
- Modal vẫn dễ dùng trên mobile, không bị quá tải chữ.

## Phase 5 - Upgrade Về Chúng Tôi

Mục tiêu: tăng độ tin cậy, sự chuyên nghiệp và cảm giác thương hiệu có nền tảng.

Nội dung đề xuất:

- Section "Chúng tôi là ai":
  - Tarot Mystic là không gian chiêm nghiệm kỹ thuật số kết hợp Tarot, chiêm tinh, thần số học và AI.
- Section "Triết lý":
  - Tarot là công cụ soi chiếu, không phải lời phán định cứng.
  - Người dùng luôn giữ quyền tự do lựa chọn.
- Section "Cách chúng tôi diễn giải":
  - AI hỗ trợ tổng hợp biểu tượng, ngữ cảnh câu hỏi và hồ sơ cá nhân.
  - Nội dung được viết theo hướng tự nhận thức, chữa lành, hành động thực tế.
- Section "Nguyên tắc an toàn":
  - Không thay thế tư vấn y tế, pháp lý, tài chính, tâm lý.
  - Không khuyến khích quyết định cực đoan dựa trên một lượt đọc.
  - Khuyến khích người dùng tìm hỗ trợ chuyên môn khi cần.
- Section "Quyền riêng tư":
  - Giải thích ngắn gọn dữ liệu hồ sơ/lịch sử trải bài dùng để cá nhân hóa.
  - Nêu rõ cam kết tôn trọng không gian riêng tư.
- Section "Tại sao dùng Tarot Mystic":
  - Cá nhân hóa.
  - Giao diện tĩnh tại.
  - Nhật ký trải bài.
  - Kết nối Tarot với chiêm tinh/thần số học.
- CTA cuối modal:
  - "Bắt đầu trải bài"
  - "Cấu hình hồ sơ chiêm tinh"

File liên quan:

- `frontend/src/components/AboutModal.jsx`
- Có thể thêm `frontend/src/data/aboutContent.js`

Tiêu chí hoàn thành:

- Modal không chỉ là lời giới thiệu đẹp mà còn xây dựng niềm tin.
- Người dùng hiểu rõ sản phẩm làm gì, không làm gì, và dữ liệu được dùng để làm gì.

## Phase 6 - UX Copy, Navigation & Polish

Mục tiêu: đảm bảo 4 mục mới hòa vào trải nghiệm chung, không thành các khối nội dung rời rạc.

Việc cần làm:

- Rà soát label navbar:
  - `Bản Đồ` có thể đổi thành `Bản Đồ Linh Hồn` nếu đủ không gian.
  - `Ý Nghĩa Bài` có thể đổi thành `Thư Viện Bài` nếu muốn đúng chức năng hơn.
- Thêm trạng thái active cho route `/astrology` và `/cosmic`.
- Với modal navbar, cân nhắc hỗ trợ deep link:
  - `/#dictionary`
  - `/#about`
  - Hoặc route riêng `/cards` và `/about` nếu muốn SEO tốt hơn.
- Rà soát footer vì footer cũng có link "Ý nghĩa bài"; tránh link footer hoạt động khác navbar.
- Kiểm tra responsive:
  - Modal dictionary trên mobile.
  - Filter dài ở ZodiacDailySection.
  - Tab trong Cosmic page.
- Rà soát tone:
  - Giữ chất huyền bí.
  - Tăng tính hướng dẫn cụ thể.
  - Giảm câu lặp và câu quá chung.

Tiêu chí hoàn thành:

- 4 mục navbar có trải nghiệm đồng đều.
- Người dùng luôn biết đang ở đâu và nên làm gì tiếp theo.
- Nội dung dài nhưng được chia khối, dễ scan.

## Phase 7 - QA & Acceptance Checklist

Kiểm thử nội dung:

- Không còn trang/modal nào chỉ có nội dung 1-2 đoạn ngắn.
- Không có thuật ngữ Anh-Việt lẫn lộn thiếu chủ đích.
- Tên lá bài và tên cung thống nhất toàn site.
- Các disclaimer quan trọng xuất hiện ở nơi phù hợp.

Kiểm thử chức năng:

- Navbar desktop/mobile mở đúng route hoặc modal.
- Modal `Ý Nghĩa Bài` search/filter/detail hoạt động sau khi data mở rộng.
- Modal `Về Chúng Tôi` scroll tốt trên mobile.
- `/astrology` và `/cosmic` không lỗi khi chưa đăng nhập.
- `/cosmic` hiển thị đúng khi có/không có `birthDate` và `name`.

Kiểm thử UI:

- Nội dung không tràn khỏi button/card/modal.
- Không có layout shift lớn khi đổi tab.
- CTA rõ và nhất quán.
- Không có section quá dài không có nhịp nghỉ thị giác.

## Ưu Tiên Triển Khai Đề Xuất

1. Phase 1: Chốt schema và data files.
2. Phase 4: Nâng cấp `Ý Nghĩa Bài` vì đây là nội dung lõi gần Tarot nhất.
3. Phase 2: Nâng cấp `Chiêm Tinh` để tạo trang đọc độc lập có giá trị.
4. Phase 3: Nâng cấp `Bản Đồ` để cá nhân hóa sâu hơn.
5. Phase 5: Nâng cấp `Về Chúng Tôi` để tăng trust.
6. Phase 6-7: Polish, responsive và QA.

## Ghi Chú Nội Dung

- Các nội dung chiêm tinh, thần số học và Tarot nên được trình bày như công cụ chiêm nghiệm/tự nhận thức, không phải lời khẳng định tuyệt đối.
- Với nội dung "hằng ngày", cần có chiến lược cập nhật thật hoặc tránh gọi là "hôm nay" nếu dữ liệu vẫn hard-code.
- Nếu chưa có pipeline cập nhật forecast, có thể đổi thành "Thông điệp năng lượng tham khảo" để trung thực hơn.
- Nếu muốn SEO tốt hơn, nên cân nhắc biến `Ý Nghĩa Bài` và `Về Chúng Tôi` thành route riêng thay vì chỉ là modal.
