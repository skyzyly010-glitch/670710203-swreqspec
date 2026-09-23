import SlotPicker from './pages/SlotPicker.jsx'

const demoSlots = {
  BASIC: [
    { id: 'basic-0900', slot_date: '2026-09-24', start_time: '09:00 น.', remaining: 4 },
    { id: 'basic-1300', slot_date: '2026-09-24', start_time: '13:00 น.', remaining: 2 },
  ],
  PREMIUM: [
    { id: 'premium-1000', slot_date: '2026-09-24', start_time: '10:00 น.', remaining: 1 },
    { id: 'premium-1400', slot_date: '2026-09-25', start_time: '14:00 น.', remaining: 3 },
  ],
}

// API จำลองสำหรับ T-14 รองรับ FR-BKG-01 และ FR-BKG-06.
const demoApiClient = {
  getSlots: async ({ packageCode }) => ({ slots: demoSlots[packageCode] ?? [] }),
}

export default function App() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 p-6 sm:p-10">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-teal-800">ระบบจองคิวตรวจสุขภาพ</h1>
        <p className="mt-2 text-slate-600">เลือกช่วงเวลาที่เหมาะกับคุณภายใน 30 วันข้างหน้า</p>
      </header>
      <SlotPicker apiClient={demoApiClient} />
    </main>
  )
}
