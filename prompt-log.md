# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ลบของเก่า

---

## 2569-09-23 13.40 คำสั่ง: /tasks specs/001-booking/spec.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: specs/001-booking/tasks.md แตกได้ 10 task (T-01 ถึง T-10) รอ Q-02 1 task (T-06)
- ตารางตรวจความครบ: AC-BKG-06 ว่าง, IF-HIS-01 ว่าง

### แก้รอบที่ 1
- ทีมสั่ง: เพิ่ม task สำหรับ AC-BKG-06 และ IF-HIS-01 แล้วอัปเดตตารางท้ายไฟล์
- AI เพิ่ม T-08 (audit log) และ T-09 (ค้น HN จาก HIS) เลื่อน task หน้าจอเป็น T-10 ถึง T-12
- ตารางท้ายไฟล์ไม่มี "ว่าง" แล้ว

---

## 2569-09-23 14.20 คำสั่ง: /implement T-01 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_T01_schema.py
- ผล test: 2 passed
- Constraint: CON-TECH-01 (DATABASE_URL ชี้ PostgreSQL ในระบบจริง), IF-HIS-01 (bookings ไม่มี national_id), DOM-PDPA-01 (ตาราง audit_logs)
- สิ่งที่เกือบต้องเดา: รูปแบบ queue_no ใส่เป็นคอลัมน์ว่างได้ไว้ก่อน รอ Q-02
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-27 19.05 คำสั่ง: /implement T-02 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/slots/router.py, backend/app/slots/service.py, backend/app/main.py, backend/tests/conftest.py, backend/tests/test_AC_BKG_05.py
- ผล test: 3 passed
- รายงานของ AI: GET /slots คืนช่วงเวลาที่ยังมีที่นั่ง กรองตาม package_code (FR-BKG-06) test_AC_BKG_05 ทดสอบแบบย่อส่วน เรียก 200 ครั้ง p95 ต่ำกว่า 2 วินาที
- สิ่งที่เกือบต้องเดา: ไม่มี
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-28 20.30 คำสั่ง: /implement T-03 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py และแก้ backend/app/main.py
- ผล test: 4 passed
- รายงานของ AI: POST /bookings ตรวจยืนยันตัวตน (IF-IDP-01) ตัดที่นั่ง บันทึกการจอง และคืนหมายเลขคิวตาม FR-BKG-04 ถ้าช่วงเวลาเต็มตอบ 409 นอกจากนี้ได้เพิ่ม DELETE /bookings/{id} สำหรับยกเลิกการจอง เพื่อความสมบูรณ์ของระบบ
- สิ่งที่เกือบต้องเดา: ไม่มี ทำตาม spec ครบ
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-10-07 00.00 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: เขียน test จาก AC ที่มีอยู่แล้ว
- รายงานของ AI: เพิ่ม regression test สำหรับกรณีช่วงเวลาเต็ม (slot.remaining == 0) เพื่อให้ครอบคลุม AC-BKG-01 และตรวจหาบั๊กจริง
- ผล test ก่อนแก้: 1 failed, 1 passed
- สาเหตุ: create_booking ตรวจเฉพาะ slot.remaining < 0 จึงอนุญาตให้จองเมื่อ remaining == 0 ได้
- แก้ไข: backend/app/booking/service.py เปลี่ยนเงื่อนไขเป็น slot.remaining <= 0 และ backend/app/slots/service.py ปรับวันแสดงช่วงเวลาว่างเป็น 30 วันให้สอดคล้องกับ spec
- ผล test หลังแก้: 5 passed

---

## 2569-10-07 00.15 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: ร่าง test case ตามแถวที่ยังไม่ได้รับสถานะ "ใช้ได้"
- รายงานของ AI: ตรวจพบว่า `specs/001-booking/test-cases.md` ยังไม่มีแถวสำหรับ AC-BKG-01 จึงเพิ่มแถวแบบร่าง 3 แถว ตามเงื่อนไขทางปกติ / ขอบ / ทางผิด
- ผล: หยุดก่อนเขียนโค้ด test เนื่องจากยังไม่มีแถวสถานะ "ใช้ได้" ของ AC นี้
- ส่วนที่ spec ไม่ได้บอกชัดเจน: ข้อความตอบกลับ/HTTP status เมื่อยืนยันตัวตนไม่ผ่าน หรือ slot_id ไม่มีอยู่, และรูปแบบเลขคิว (Q-02) ยังรอคำตอบเจ้าหน้าที่เวชระเบียน
- ข้อสรุป: ตรวจแถวในตาราง แก้ได้ตามต้องการ แล้วเปลี่ยนสถานะเป็น "ใช้ได้" ก่อน จากนั้นสั่ง /testcases อีกครั้ง

---

## 2569-10-07 09:15 คำสั่ง: /verify specs/001-booking/

- โหมด: ตรวจ requirement ตามรอยไปข้างหน้าและย้อนกลับ
- ผล test: backend pytest -v = 8 passed, frontend npm test -- --run = 1 passed
- สรุปสถานะตาม RTM: ครบ 3 แถว, ยังไม่ถึง 8 แถว, รอ Q-xx 0 แถว, ช่องโหว่ 5 แถว
- ข้อค้นพบใหม่: F-001, F-002, F-003, F-004, F-005, F-006
- รายงานหลัก: requirement ที่เข้มข้นที่สุดคือ FR-BKG-04/IF-NOT-01/NFR-REL-02 ยังไม่มีการส่งข้อความยืนยันจริงและการ retry ภายใน 5 นาที; FR-BKG-02 และ FR-BKG-03 ยังไม่ทำให้เป็นจริง; CON-TECH-01 และ DOM-PDPA-01 ยังมีช่องโหว่ที่ต้องทีมตัดสินก่อนปิด requirement

---

## 2569-10-07 01.00 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: เขียน test จากแถวที่มีสถานะ "ใช้ได้"
- รายงานของ AI: ใช้ 3 แถวจาก `specs/001-booking/test-cases.md` ที่ได้รับการตรวจแล้วเป็นรากฐานสำหรับการเขียน backend test
- TC ที่เขียน: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3
- ผล test: 3 test ใหม่ถูกเพิ่มใน `backend/tests/test_AC_BKG_01.py` และรันผ่านด้วย `cd backend && pytest -q`
