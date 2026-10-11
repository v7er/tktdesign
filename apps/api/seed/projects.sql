DELETE FROM project_images;
DELETE FROM projects;

INSERT INTO projects (
	id, slug, title, summary, description, location, year, category,
	land_width_m, land_depth_m, floor_area_m2, floors, functions,
	cover_key, featured, status, sort_order, created_at, updated_at
) VALUES
(
	'p-govap',
	'nha-pho-5x16-go-vap',
	'Nhà phố 5×16 Gò Vấp',
	'Nhà 4 tầng cho gia đình 2 thế hệ: để xe, khách bếp tách rõ, giếng trời lấy sáng giữa nhà.',
	'Lô đất 5×16 m trong hẻm xe hơi Gò Vấp. Yêu cầu ban đầu là đủ chỗ 3 xe máy, phòng khách không nhìn thẳng vào bếp, và 3 phòng ngủ có ánh sáng tự nhiên.\n\nTầng 1 để xe và kho ướt sát mặt tiền; khách — ăn — bếp xếp dọc theo trục giữa, kết thúc bằng sân sau. Giếng trời 1,4 m đặt giữa cầu thang, lấy sáng cho hành lang các tầng. Tầng 2 hai phòng ngủ con; tầng 3 phòng ngủ master và phòng thờ; tầng tum phơi đồ, máy nước nóng, chỗ ngồi gió chiều.',
	'Gò Vấp, TP. Hồ Chí Minh',
	2024,
	'nha-pho',
	5, 16, 268, 4,
	'Tầng 1: để xe, khách, ăn, bếp, WC.\nTầng 2: 2 phòng ngủ, WC chung.\nTầng 3: phòng ngủ master, phòng thờ, WC.\nTầng tum: phơi, kỹ thuật, ngồi gió.',
	'projects/p-govap/cover.jpg',
	1, 'published', 1, 1728000000000, 1728000000000
),
(
	'p-thuduc',
	'nha-pho-4x18-thu-duc',
	'Nhà phố 4×18 Thủ Đức',
	'Nhà hẹp 4 m, thông tầng khách để lấy sáng. Bếp và giặt ủi tách khỏi khu tiếp khách.',
	'Đất 4×18 m, hai mặt hẻm nhỏ. Chủ nhà làm việc tại nhà nên cần góc làm việc yên, không đi xuyên phòng khách.\n\nChúng tôi kéo thông tầng 2 lớp ở giữa nhà, đặt bàn ăn dưới giếng trời. Bếp ướt và khu giặt dồn ra hậu. Góc làm việc nằm tầng 2, nhìn xuống thông tầng nhưng cửa kéo kín khi cần yên.',
	'Thủ Đức, TP. Hồ Chí Minh',
	2023,
	'nha-pho',
	4, 18, 232, 4,
	'Tầng 1: để xe, khách thông tầng, ăn, bếp ướt, WC.\nTầng 2: góc làm việc, 1 phòng ngủ, WC.\nTầng 3: 2 phòng ngủ, WC.\nTầng tum: phơi, máy nước nóng.',
	'projects/p-thuduc/cover.jpg',
	1, 'published', 2, 1728000000000, 1728000000000
),
(
	'p-tanbinh',
	'cai-tao-nha-pho-tan-binh',
	'Cải tạo nhà phố Tân Bình',
	'Giữ khung cũ, dời bếp ra sau, mở giếng trời. Công năng 3 thế hệ trong cùng một bề rộng 4,2 m.',
	'Nhà xây khoảng 1998, tối và ẩm cuối nhà. Ngân sách không cho phép tháo hết. Chúng tôi giữ cột, dầm; hạ trần giả; mở giếng trời 1,2×2,4 m trên mái.\n\nBếp cũ sát mặt tiền được dời ra sân sau có mái kính. Phòng ông bà ở tầng 1, gần WC và không phải lên cầu thang. Hai vợ chồng và con ở tầng 2–3. Khu giặt phơi lên tum, không còn phơi ở ban công mặt tiền.',
	'Tân Bình, TP. Hồ Chí Minh',
	2025,
	'cai-tao',
	4.2, 14, 186, 3,
	'Tầng 1: để xe, khách, phòng ông bà, bếp sau nhà, WC.\nTầng 2: phòng ngủ vợ chồng, phòng con, WC.\nTầng 3 / tum: thờ, phơi, kỹ thuật.',
	'projects/p-tanbinh/cover.jpg',
	1, 'published', 3, 1728000000000, 1728000000000
),
(
	'p-binhthanh',
	'nha-pho-goc-6x14-binh-thanh',
	'Nhà phố góc 6×14 Bình Thạnh',
	'Lô góc hai mặt tiền. Tầng 1 để xe và cửa vào lệch, tránh nhìn thẳng từ đường vào bàn ăn.',
	'Đất góc 6×14 m. Chủ nhà muốn cửa hàng nhỏ phía mặt tiền phụ, nhà ở phía còn lại, hai luồng đi không lẫn.\n\nMặt tiền chính: hiên để xe, cửa lệch phải. Mặt tiền phụ: cửa cuốn cửa hàng 12 m², kho ướt phía sau. Cầu thang đặt vào lõi, tách nhà và tiệm. Các tầng trên là nhà ở, ban công trồng cây phía Tây để chắn nắng.',
	'Bình Thạnh, TP. Hồ Chí Minh',
	2024,
	'nha-pho',
	6, 14, 294, 4,
	'Tầng 1: để xe, cửa hàng 12 m², kho, khách, WC.\nTầng 2: ăn, bếp, phòng sinh hoạt, WC.\nTầng 3: 2 phòng ngủ, WC.\nTầng 4: master, thờ, tum phơi.',
	'projects/p-binhthanh/cover.jpg',
	1, 'published', 4, 1728000000000, 1728000000000
),
(
	'p-tanphu',
	'nha-pho-5x20-tan-phu',
	'Nhà phố 5×20 Tân Phú — 3 thế hệ',
	'Đất sâu 20 m. Ông bà ở tầng 1 có sân sau; con cháu ở trên. Bếp chung lớn, bàn ăn 8 người.',
	'Gia đình ba thế hệ, 7 người. Ưu tiên: ông bà không lên lầu; có chỗ ăn chung mỗi tối; hai vợ chồng trẻ cần góc làm việc tối.\n\nTầng 1 kéo dài: xe — khách — bàn ăn 8 chỗ — bếp — phòng ông bà nhìn ra sân sau. Tầng 2 hai phòng con và góc học. Tầng 3 master và phòng làm việc. Tum có mái che nửa, nửa phơi.',
	'Tân Phú, TP. Hồ Chí Minh',
	2022,
	'nha-pho',
	5, 20, 310, 4,
	'Tầng 1: để xe, khách, bàn ăn 8 chỗ, bếp, phòng ông bà, WC, sân sau.\nTầng 2: 2 phòng ngủ con, góc học, WC.\nTầng 3: master, phòng làm việc, WC.\nTum: thờ, phơi, ngồi mái.',
	'projects/p-tanphu/cover.jpg',
	0, 'published', 5, 1728000000000, 1728000000000
),
(
	'p-dian',
	'nha-pho-lien-ke-di-an',
	'Nhà phố liền kề Dĩ An',
	'Nhà liền kề 5×16 ở Dĩ An. Tối ưu tường chung, lấy sáng bằng giếng trời và mặt sau.',
	'Khu liền kề mới, hai tường chung. Ánh sáng chỉ có từ mặt tiền, mặt sau và mái. Chúng tôi không khoét mặt tiền cho “đẹp hình”; cửa sổ tính theo phòng ngủ và hướng nắng.\n\nTầng 1 cao 3,6 m để xe hơi 4 chỗ và khách. Bếp sau nhà, cửa ra sân 2 m. Các phòng ngủ xếp theo hướng Đông, WC và kho về phía Tây.',
	'Dĩ An, Bình Dương',
	2025,
	'nha-pho',
	5, 16, 255, 4,
	'Tầng 1: gara 1 xe, khách, ăn, bếp, WC.\nTầng 2: 2 phòng ngủ, WC.\nTầng 3: master, phòng thờ, WC.\nTum: phơi, kỹ thuật.',
	'projects/p-dian/cover.jpg',
	0, 'published', 6, 1728000000000, 1728000000000
);
