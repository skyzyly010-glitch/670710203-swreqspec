import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import SlotPicker from '../pages/SlotPicker.jsx'

test('T-14 แสดงที่นั่งคงเหลือของช่วงเวลาที่ว่าง', async () => {
  const apiClient = {
    getSlots: vi.fn().mockResolvedValue({
      slots: [{ id: 'slot-1', slot_date: '2026-09-24', start_time: '09:00 น.', remaining: 4 }],
    }),
  }

  render(<SlotPicker apiClient={apiClient} />)

  expect(await screen.findByText('09:00 น.')).toBeTruthy()
  expect(screen.getByText('4')).toBeTruthy()
  expect(apiClient.getSlots).toHaveBeenCalledWith(expect.objectContaining({ packageCode: 'BASIC' }))
})

test('T-14 โหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจ', async () => {
  const apiClient = {
    getSlots: vi.fn(({ packageCode }) =>
      Promise.resolve({
        slots: [
          {
            id: packageCode,
            slot_date: '2026-09-24',
            start_time: packageCode === 'BASIC' ? '09:00 น.' : '10:00 น.',
            remaining: packageCode === 'BASIC' ? 4 : 1,
          },
        ],
      }),
    ),
  }

  render(<SlotPicker apiClient={apiClient} />)
  await screen.findByText('09:00 น.')

  fireEvent.change(screen.getByLabelText('แพ็กเกจ'), { target: { value: 'PREMIUM' } })

  await waitFor(() => expect(screen.getByText('10:00 น.')).toBeTruthy())
  expect(screen.queryByText('09:00 น.')).toBeNull()
  expect(apiClient.getSlots).toHaveBeenLastCalledWith(expect.objectContaining({ packageCode: 'PREMIUM' }))
})