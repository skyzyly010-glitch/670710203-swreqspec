# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from app.db.models import Booking
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_AC_BKG_01_full_slot_rejected(client, make_slot):
    """AC-BKG-01: เมื่อช่วงเวลาเต็มแล้ว ควรปฏิเสธการจองและไม่สร้างรายการใหม่"""
    slot = make_slot(start="09:00", remaining=0)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 409


def test_TC_BKG_01_1_successful_booking(client, make_slot, db):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    # When: ยืนยันการจองช่วง 09.00 น.
    # Then: บันทึกการจองสำเร็จ, มีหมายเลขคิว, และที่นั่งว่างของช่วงนั้นกลายเป็น 0
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    payload = res.json()
    assert payload["queue_no"]
    refreshed = db.get(type(slot), slot.id)
    assert refreshed.remaining == 0


def test_TC_BKG_01_2_boundary_remaining_zero(client, make_slot, db):
    # Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่ โดยก่อนยืนยันยังไม่มีคิวสำหรับวันนั้น
    # When: ยืนยันการจองช่วง 09.00 น.
    # Then: บันทึกการจองสำเร็จ, remaining จาก 1 เป็น 0, และไม่ให้ติดลบหรือเกินความจุ
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    refreshed = db.get(type(slot), slot.id)
    assert refreshed.remaining == 0
    assert refreshed.remaining >= 0


def test_TC_BKG_01_3_missing_slot_rejected(client, db):
    # Given: slot_id ที่ส่งไม่มีอยู่
    # When: ยืนยันการจองด้วย slot_id ที่ไม่ปรากฏในระบบ
    # Then: ต้องไม่บันทึกการจอง และต้องไม่ลด remaining
    missing_slot_id = 999999

    res = client.post("/bookings", json={"slot_id": missing_slot_id}, headers=AUTH)

    assert res.status_code == 404
    assert db.query(Booking).count() == 0
