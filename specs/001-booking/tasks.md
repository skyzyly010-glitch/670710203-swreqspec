# Tasks: จองคิวตรวจสุขภาพ (Booking)

- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง: `specs/001-booking/plan.md` (plan v1)
- วันที่: 2569-09-23

มีทั้งหมด 16 tasks ครอบคลุมงานฐานข้อมูล, API, หน้าจอ, การทดสอบ และการตรวจคุณภาพ
มี 4 tasks ที่ต้องรอคำตอบ `Q-02` ก่อนจึงจะทำต่อได้

## รายการ task

### T-01 สร้างตารางและ migration
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01, FR-BKG-01, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-02, T-03 และ T-12
- ไฟล์ที่แตะ: `backend/app/db/models.py`, `backend/app/db/session.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/conftest.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง `slots`, `bookings` และ `audit_logs` ได้ และ `bookings` ไม่มีคอลัมน์เลขบัตรประชาชน
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 สร้างการยืนยันตัวตนจาก IDP
- รองรับ: IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-03, T-04 และ T-05
- ไฟล์ที่แตะ: `backend/app/auth/idp.py`, `backend/app/main.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: endpoint ที่เข้าถึงข้อมูลผู้รับบริการตรวจผลยืนยันตัวตนก่อนดำเนินการ
- สถานะ: พร้อมทำ

### T-03 สร้าง API ค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04, T-06 และ T-07
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/slots/router.py`, `backend/app/main.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `GET /slots` คืนช่วงเวลาและจำนวนที่นั่งคงเหลือภายในกรอบ 30 วัน และคำนวณใหม่เมื่อเปลี่ยนแพ็กเกจ
- สถานะ: พร้อมทำ

### T-04 สร้าง API ค้น HN จาก HIS
- รองรับ: IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-05 และ T-06
- ไฟล์ที่แตะ: `backend/app/his/client.py`, `backend/app/booking/router.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: `GET /patients/lookup` ส่งเลขบัตรไปยัง HIS และคืน HN โดยไม่บันทึกเลขบัตรในฐานข้อมูล
- สถานะ: พร้อมทำ

### T-05 สร้างการจองและตัดที่นั่ง
- รองรับ: FR-BKG-04, IF-IDP-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06, T-10 และ T-13
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/app/main.py`
- ต้องทำหลัง: T-01, T-02, T-04
- เสร็จเมื่อ: `POST /bookings` บันทึกการจองและลด `remaining` ของช่วงเวลาที่เลือกโดยไม่เก็บเลขบัตรประชาชน
- สถานะ: พร้อมทำ

### T-06 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_02.py`
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: `test_AC_BKG_02` ผ่านและผลปฏิเสธมีหมายเลขคิวเดิมตามข้อมูลที่มีอยู่
- สถานะ: รอ Q-02

### T-07 เสนอช่วงเวลาทดแทนเมื่อเต็ม
- รองรับ: FR-BKG-03, ASM-02
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_03.py`
- ต้องทำหลัง: T-03, T-05
- เสร็จเมื่อ: `test_AC_BKG_03` ผ่าน โดยคืนสถานะเต็ม ช่วงเวลาว่าง 3 ตัวเลือก และไม่สร้างการจองซ้อน
- สถานะ: พร้อมทำ

### T-08 ทดสอบประสิทธิภาพการค้นหาช่วงเวลา
- รองรับ: NFR-PERF-01, FR-BKG-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_05.py`
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: `test_AC_BKG_05` วัดการเรียกค้นหาพร้อมกัน 200 ครั้งและรายงาน p95 ไม่เกิน 2 วินาทีในสภาพแวดล้อมทดสอบ
- สถานะ: พร้อมทำ

### T-09 สร้างคิวส่งข้อความแบบ asynchronous
- รองรับ: IF-NOT-01, FR-BKG-05, ASM-03
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-10
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/app/booking/service.py`
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: การจองวางงาน SMS/LINE ลงคิวและไม่รอผลการส่งข้อความ
- สถานะ: พร้อมทำ

### T-10 จัดการส่งข้อความล้มเหลวและ retry
- รองรับ: FR-BKG-05, NFR-REL-02, IF-NOT-01, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/tests/test_AC_BKG_04.py`
- ต้องทำหลัง: T-09
- เสร็จเมื่อ: `test_AC_BKG_04` ผ่าน โดยการจองยังถูกบันทึกและมีงานส่งซ้ำภายใน 5 นาทีตาม ASM-03
- สถานะ: รอ Q-02

### T-11 บันทึก audit log การเข้าถึงข้อมูล
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: `backend/app/audit/middleware.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_06.py`
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: `test_AC_BKG_06` ผ่านและ audit log มีผู้เข้าถึง เวลา และ HN พร้อมกลไกเก็บข้อมูลไม่น้อยกว่า 1 ปี
- สถานะ: พร้อมทำ

### T-12 กำหนดการรับส่งผ่าน TLS
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของการตรวจรับระบบ
- ไฟล์ที่แตะ: `backend/app/config.py`, `frontend/vite.config.js`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: การตั้งค่าระบบกำหนดให้ข้อมูลการจองรับส่งผ่าน TLS 1.2 ขึ้นไป และมีผลในสภาพแวดล้อมที่นำไปใช้งาน
- สถานะ: พร้อมทำ

### T-13 ออกและแสดงหมายเลขคิว
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `frontend/src/pages/BookingResult.jsx`, `backend/tests/test_AC_BKG_01.py`
- ต้องทำหลัง: T-05
- เสร็จเมื่อ: `test_AC_BKG_01` ผ่านและ API กับหน้าจอแสดงหมายเลขคิวตามรูปแบบและกติกาที่ทีมยืนยัน
- สถานะ: รอ Q-02

### T-14 สร้างหน้าจอเลือกแพ็กเกจและเวลา
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-USE-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-15 และ T-16
- ไฟล์ที่แตะ: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอเลือกแพ็กเกจและช่วงเวลาแสดงที่นั่งคงเหลือ และโหลดข้อมูลใหม่เมื่อเปลี่ยนแพ็กเกจด้วย API จำลอง
- สถานะ: พร้อมทำ

### T-15 สร้างหน้ายืนยันและผลการจอง
- รองรับ: FR-BKG-03, FR-BKG-04, FR-BKG-05, NFR-USE-01
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/AC-BKG-03.test.jsx`
- ต้องทำหลัง: T-14
- เสร็จเมื่อ: `AC-BKG-03.test.jsx` ผ่านและหน้าจอแสดงข้อความช่วงเวลาเต็มพร้อมตัวเลือก 3 ช่วงจาก API จำลอง
- สถานะ: พร้อมทำ

### T-16 ต่อหน้าจอกับ API จริงและทดสอบการใช้งาน
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05, NFR-USE-01, IF-IDP-01
- ตรวจด้วย: AC-BKG-01, AC-BKG-03 และการทดสอบ NFR-USE-01
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/__tests__/`
- ต้องทำหลัง: T-02, T-07, T-13, T-14, T-15
- เสร็จเมื่อ: หน้าจอเรียก API จริงได้ และผู้ใช้ใหม่ 8 ใน 10 คนจองสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ
- สถานะ: รอ Q-02

## ตารางตรวจความครบของ Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-13 |
| AC-BKG-02 | T-06 |
| AC-BKG-03 | T-07, T-15 |
| AC-BKG-04 | T-10 |
| AC-BKG-05 | T-08 |
| AC-BKG-06 | T-11 |

## ตารางตรวจความครบของ Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-11 |
| IF-IDP-01 | T-02, T-05, T-16 |
| IF-HIS-01 | T-01, T-04, T-05 |
| IF-NOT-01 | T-09, T-10 |

## สิ่งที่ยังไม่ทำ

- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร -> ถามเจ้าหน้าที่เวชระเบียน
  task ที่รอ: T-06, T-10, T-13, T-16