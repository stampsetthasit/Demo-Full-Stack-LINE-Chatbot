CREATE TABLE `orders` (
	order_id INT,
	name VARCHAR(50),
	date DATE,
	price DECIMAL(6,2),
	tracking_cn VARCHAR(7),
	tracking_th VARCHAR(7),
	status VARCHAR(16)
);

INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (2, 'จิราภรณ์ สายใจ', '2024-06-21', 725.58, 'CN67890', 'TH12345', 'สินค้าถึงไทย');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (3, 'ประยุทธ จันทร์โอชา', '2024-07-08', 644.39, 'CN54321', 'TH67890', 'จัดส่งแล้ว');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (1, 'สมชาย ศรีสกุล', '2024-06-24', 785.6, 'CN12345', 'TH12345', 'สินค้าถึงไทย');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (4, 'วราภรณ์ เพ็ญศรี', '2024-07-09', 939.92, 'CN54321', 'TH67890', 'สินค้าถึงไทย');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (5, 'สมบัติ บุญเรือง', '2024-06-01', 844.74, 'CN67890', 'TH67890', 'สินค้าออกจากจีน');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (6, 'ณัฐวุฒิ ศิริประเสริฐ', '2024-07-04', 500.41, 'CN67890', 'TH12345', 'ชำระค่าขนส่งแล้ว');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (7, 'สุรชาติ วัฒนาพร', '2024-06-03', 437.9, 'CN12345', 'TH12345', 'สินค้าถึงไทย');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (8, 'กมลวรรณ บุญเพ็ง', '2024-05-31', 674.77, 'CN54321', 'TH54321', 'ยกเลิกคำสั่งซื้อ');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (9, 'วีรศักดิ์ ศรีสุวรรณ', '2024-06-25', 709.24, 'CN67890', 'TH12345', 'ยกเลิกคำสั่งซื้อ');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (10, 'อารีรัตน์ นามสมมุติ', '2024-07-16', 248.66, 'CN67890', 'TH54321', 'สินค้าถึงไทย');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (11, 'ปราณี จันทร์สม', '2024-05-31', 589.69, 'CN12345', 'TH12345', 'สินค้าออกจากจีน');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (12, 'สมพงษ์ นามสมมุติ', '2024-05-19', 783.44, 'CN54321', 'TH54321', 'สินค้าออกจากจีน');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (13, 'อุดม ศรีสำอาง', '2024-05-15', 296.18, 'CN12345', 'TH12345', 'ยกเลิกคำสั่งซื้อ');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (14, 'สุชาติ บุญญเดช', '2024-07-11', 672.48, 'CN12345', 'TH54321', 'ยกเลิกคำสั่งซื้อ');
INSERT INTO `orders` (order_id, name, date, price, tracking_cn, tracking_th, status) VALUES (15, 'วิชิต บัวเงิน', '2024-05-24', 60.48, 'CN12345', 'TH54321', 'สั่งซื้อสำเร็จ');
