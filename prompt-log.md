# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ต้องลบของเก่า

---

## 2569-09-23 คำสั่ง: /tasks

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์: `specs/001-booking/spec.md`
- ผลลัพธ์: สร้าง `specs/001-booking/tasks.md` จำนวน 16 tasks
- tasks ที่รอ Open Question: T-06, T-10, T-13 และ T-16 รอ Q-02
- AC ที่ครอบคลุม: AC-BKG-01 ถึง AC-BKG-06 มี task ตรวจครบทุกตัว
- Constraint ที่ครอบคลุม: CON-TECH-01, DOM-PDPA-01, IF-IDP-01, IF-HIS-01 และ IF-NOT-01 มี task รองรับครบ
- หมายเหตุ: ยังไม่เริ่มทำ task ใด ๆ ตามคำสั่ง

---

## 2569-09-23 คำสั่ง: /implement T-01

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: `backend/app/db/models.py`, `backend/app/db/session.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/conftest.py`
- ผลการทดสอบ: `T-01 schema check passed` จากการสร้างฐานข้อมูล SQLite ในหน่วยความจำและตรวจตาราง/คอลัมน์
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่พบประเด็นที่ต้องถามเพิ่ม; รูปแบบหมายเลขคิวยังคงเว้นไว้ตาม Q-02
- สถานะ task: T-01 เปลี่ยนเป็น `เสร็จ รอทีมตรวจ`

---

## 2569-09-23 คำสั่ง: /implement T-14

- เครื่องมือ: Copilot ใน Codespaces
- ไฟล์ที่สร้างหรือแก้: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/slot-picker.test.jsx`
- ผลการทดสอบ: test เฉพาะ T-14 ผ่าน 2 tests; test frontend ทั้งหมดผ่าน 3 tests; `npm run build` ผ่าน
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่พบประเด็นจาก spec/plan ที่ต้องถามเพิ่ม; ใช้ API จำลองตาม plan และไม่ต่อ API จริงใน T-14
- หมายเหตุ: ชุด test ทั้งหมดมี React `act(...)` warning จาก smoke test เดิมที่ไม่รอการโหลดแบบ asynchronous แต่ test ผ่าน
- สถานะ task: T-14 เปลี่ยนเป็น `เสร็จ รอทีมตรวจ`