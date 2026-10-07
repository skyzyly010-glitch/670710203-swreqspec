# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 09:15 | test: ผ่าน 9 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots; backend/app/slots/router.py: get_slots | test_AC_BKG_05: ผ่าน | ครบ |
| FR-BKG-02 | AC-BKG-02 | T-04 | backend/app/booking/service.py: create_booking (ไม่มีการตรวจคิวที่ยังไม่ได้ใช้ในวันเดียวกัน) | ไม่มี test | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05 | backend/app/slots/service.py: list_available_slots; backend/app/booking/router.py: create_booking (ไม่มีตัวเลือก 3 ช่วง/ไม่สร้างรายการจอง) | ไม่มี test | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | backend/app/booking/service.py: create_booking; backend/app/booking/router.py: create_booking | test_AC_BKG_01.py: ผ่าน แต่ไม่ตรวจการส่งข้อความยืนยัน | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่มีโค้ดสำหรับคิวส่งซ้ำ/การเลื่อน retry | ไม่มี test | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 | backend/app/slots/service.py: list_available_slots; backend/app/slots/router.py: get_slots (กรอง package_code) | ไม่มี test ระบุ AC ให้ตรวจ package change | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots | test_AC_BKG_05: ผ่าน | ครบ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มี enforced TLS / HTTPS layer | ไม่มี test | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่มีโค้ดสำหรับ queue retry ภายใน 5 นาที | ไม่มี test | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มีโค้ด/เกณฑ์สำหรับเวลา 3 นาที และผู้ใช้ใหม่ | ไม่มี test | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC | T-01 | backend/app/config.py: DATABASE_URL default SQLite; backend/app/db/session.py: create_engine(DATABASE_URL) | ไม่มี test | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 | backend/app/db/models.py: AuditLog model เท่านั้น; ไม่มี middleware เขียน audit log | ไม่มี test | ยังไม่ถึง |
| IF-IDP-01 | ไม่มี AC | T-03 | backend/app/auth/idp.py: get_verified_hn | test_AC_BKG_01.py ใช้ Authorization header ผ่าน; ไม่มี negative test | ครบ |
| IF-HIS-01 | ไม่มี AC | T-09 | ไม่มี backend/app/his/client.py; ตาราง bookings เก็บเฉพาะ hn | ไม่มี test | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 | ไม่มี backend/app/notify/queue.py; POST /bookings ไม่วางงานลงคิว | ไม่มี test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/slots/router.py: get_slots | FR-BKG-01, FR-BKG-06 | มีส่วนตรง | คืนค่าช่วงเวลา + remaining ตาม package_code ที่ส่งเข้ามา แต่ FR-BKG-06 ไม่มี AC ใส่ในการตรวจจริง |
| backend/app/booking/router.py: create_booking | FR-BKG-04, IF-IDP-01 | ครึ่งเดียว | ยอมรับ request จากผู้ยืนยันตัวตนแล้ว และบันทึกการจองได้ แต่ไม่ส่งคำขอส่งข้อความยืนยันและไม่มีการป้องกันคิวซ้ำวันเดียวกัน |
| backend/app/booking/service.py: create_booking | FR-BKG-02, FR-BKG-04 | ไม่ครบ | ไม่มีการตรวจว่าผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน; ตรวจแค่ remaining <= 0 เท่านั้น |
| backend/app/db/models.py: Slot, Booking, AuditLog | FR-BKG-04, DOM-PDPA-01, IF-HIS-01 | ครึ่งเดียว | ตาราง audit_logs มีอยู่แล้ว แต่ไม่มีการ write ใน runtime; booking เก็บเฉพาะ hn ตาม IF-HIS-01 ถูกต้อง |
| backend/app/config.py: DATABASE_URL | CON-TECH-01 | ไม่ครบ | ค่า default เป็น SQLite ใน Codespace แม้ comment ระบุ PostgreSQL สำหรับระบบจริง |
| backend/app/auth/idp.py: get_verified_hn | IF-IDP-01 | ตรง | ตรวจ Authorization header แบบ "Bearer verified:<HN>" ก่อนเข้าถึงข้อมูลผู้รับบริการ |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | โค้ดไม่มี FR | backend/app/booking/router.py, backend/app/booking/service.py | FR-BKG-04, IF-NOT-01, NFR-REL-02 | โค้ดบันทึกการจองได้ แต่ไม่ส่งคำขอส่งข้อความยืนยันและไม่มีคิว retry ภายใน 5 นาที แม้ AC-BKG-01 ผ่าน แต่สิ่งที่ FR-BKG-04 บอกว่า "ส่งคำขอส่งข้อความยืนยัน" ยังไม่ได้ทำจริง |  |
| F-002 | โค้ดไม่มี FR | backend/app/booking/service.py: create_booking | FR-BKG-02 | ไม่มีการตรวจว่าผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน; จึงสามารถจองซ้ำในวันเดียวกันได้ แม้ test_AC_BKG_01.py ผ่านและไม่มี test สำหรับซ้ำวันเดียวกัน |  |
| F-003 | โค้ดไม่มี FR | backend/app/booking/router.py, backend/app/slots/service.py | FR-BKG-03 | ไม่มีการแจ้ง "ช่วงเวลาเต็ม" และไม่มีการเสนอ 3 ตัวเลือกที่ใกล้ที่สุดภายในวันเดียวกันและวันถัดไป 1 วัน |  |
| F-004 | FR ไม่มี AC | backend/app/slots/service.py, backend/app/slots/router.py | FR-BKG-06 | FR-BKG-06 มีเงื่อนไขในการคำนวณช่วงเวลาใหม่ตามแพ็กเกจ แต่ใน spec ไม่มี AC ที่ตรวจ it โดยตรง; ดังนั้นความครอบคลุมของ requirement นี้ยังไม่เป็น test ที่ตรวจจริง |  |
| F-005 | ละเมิด Constraint | backend/app/config.py, backend/app/db/session.py | CON-TECH-01 | ค่าเริ่มต้นของ DATABASE_URL เป็น SQLite ใน environment ปกติ ซึ่งขัดกับข้อบังคับ "ใช้ PostgreSQL ตามมาตรฐานฝ่าย IT" แม้ใช้ใน Codespace เพื่อทดสอบได้ |  |
| F-006 | โค้ดไม่มี FR | backend/app/db/models.py | DOM-PDPA-01 | มีตาราง audit_logs แล้ว แต่ไม่มี code ที่เขียน log ขณะเข้าถึงข้อมูลการจอง จึงไม่มี audit trail จริงตาม spec |  |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
