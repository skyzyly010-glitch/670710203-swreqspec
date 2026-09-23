import { useEffect, useState } from 'react'

const packages = [
  { code: 'BASIC', label: 'ตรวจสุขภาพพื้นฐาน' },
  { code: 'PREMIUM', label: 'ตรวจสุขภาพพรีเมียม' },
]

function todayAsDateInput() {
  return new Date().toISOString().slice(0, 10)
}

export default function SlotPicker({ apiClient }) {
  const [packageCode, setPackageCode] = useState(packages[0].code)
  const [dateFrom, setDateFrom] = useState(todayAsDateInput)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)

    apiClient.getSlots({ dateFrom, packageCode }).then((result) => {
      if (active) {
        setSlots(result.slots ?? result)
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [apiClient, dateFrom, packageCode])

  return (
    <section aria-labelledby="slot-picker-title" className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Booking</p>
        <h2 id="slot-picker-title" className="mt-1 text-3xl font-bold text-slate-900">
          เลือกแพ็กเกจและช่วงเวลาตรวจ
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          แพ็กเกจ
          <select
            aria-label="แพ็กเกจ"
            className="w-full rounded-lg border border-slate-300 bg-white p-3 font-normal"
            value={packageCode}
            onChange={(event) => setPackageCode(event.target.value)}
          >
            {packages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          เริ่มดูตั้งแต่วันที่
          <input
            aria-label="วันที่เริ่มต้น"
            className="w-full rounded-lg border border-slate-300 bg-white p-3 font-normal"
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </label>
      </div>

      <div aria-live="polite">
        {loading ? (
          <p className="rounded-lg bg-slate-100 p-4 text-slate-600">กำลังโหลดช่วงเวลาว่าง...</p>
        ) : slots.length === 0 ? (
          <p className="rounded-lg bg-slate-100 p-4 text-slate-600">ไม่พบช่วงเวลาว่าง</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2" aria-label="ช่วงเวลาว่าง">
            {slots.map((slot) => (
              <li key={slot.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{slot.slot_date}</p>
                    <p className="text-lg text-teal-800">{slot.start_time}</p>
                  </div>
                  <p className="text-right text-sm text-slate-600">
                    คงเหลือ
                    <span className="mt-1 block text-2xl font-bold text-slate-900">{slot.remaining}</span>
                    ที่นั่ง
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}