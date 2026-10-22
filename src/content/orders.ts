export interface WorkOrder {
  id: string;
  no: string;
  title: string;
  body: string;
  /** completion description shown after logging */
  done: string;
}

export const WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-1',
    no: 'WO-01',
    title: 'Clock in at the Timekeeper’s window.',
    body: 'Report to the gate office. Take the clipboard. Sign what needs signing.',
    done: 'CLOCKED IN — WELCOME TO THE PAYROLL OF THE DAY',
  },
  {
    id: 'wo-2',
    no: 'WO-02',
    title: 'Walk the yard. Learn it with your boots.',
    body: 'The ways, where hulls rise. The Cut, where ships come home one last time. The overlook, where both make sense. Walk all three.',
    done: 'YARD WALKED — ROUTES KNOWN',
  },
  {
    id: 'wo-3',
    no: 'WO-03',
    title: 'Heat-stamp survey. Rub every stamp you find.',
    body: 'Plates carry their heat numbers like cattle carry brands. Record them. The yard only launches what it can remember.',
    done: 'SURVEY LOGGED — STEEL REMEMBERED.',
  },
];
