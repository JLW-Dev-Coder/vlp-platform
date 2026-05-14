'use client';

import { CallListTable, type TaxPro } from '@/components/dashboard/CallListTable';

// MOCK DATA — replace with API call to GET /v1/gsvlp/call-list
const MOCK_CALL_LIST: TaxPro[] = [
  { id: '1', fullName: 'Robert Chen', dba: 'Chen Tax Associates', city: 'Los Angeles', state: 'CA', phone: '(213) 555-0142', profession: 'CPA', status: 'not_called' },
  { id: '2', fullName: 'Maria Gonzalez', dba: 'Gonzalez EA Services', city: 'Houston', state: 'TX', phone: '(713) 555-0198', profession: 'EA', status: 'not_called' },
  { id: '3', fullName: 'David Park', dba: 'Park Law & Tax', city: 'New York', state: 'NY', phone: '(212) 555-0173', profession: 'ATTY', status: 'called' },
  { id: '4', fullName: 'Linda Thompson', dba: 'Thompson CPA PLLC', city: 'Miami', state: 'FL', phone: '(305) 555-0119', profession: 'CPA', status: 'not_called' },
  { id: '5', fullName: 'Michael Rivera', dba: 'Rivera Tax Solutions', city: 'Dallas', state: 'TX', phone: '(214) 555-0156', profession: 'EA', status: 'booked' },
  { id: '6', fullName: 'Jennifer Wu', dba: 'Wu & Associates', city: 'San Francisco', state: 'CA', phone: '(415) 555-0188', profession: 'CPA', status: 'not_called' },
  { id: '7', fullName: 'Carlos Mendez', dba: 'Mendez Tax Group', city: 'Orlando', state: 'FL', phone: '(407) 555-0144', profession: 'EA', status: 'not_called' },
  { id: '8', fullName: 'Patricia Johnson', dba: 'Johnson Tax Law', city: 'Brooklyn', state: 'NY', phone: '(718) 555-0167', profession: 'ATTY', status: 'called' },
  { id: '9', fullName: 'Daniel Kim', dba: 'Kim CPA Group', city: 'San Diego', state: 'CA', phone: '(619) 555-0102', profession: 'CPA', status: 'not_called' },
  { id: '10', fullName: 'Rachel Goldberg', dba: 'Goldberg EA', city: 'Austin', state: 'TX', phone: '(512) 555-0135', profession: 'EA', status: 'not_called' },
  { id: '11', fullName: 'Anthony Russo', dba: 'Russo & Sons Tax', city: 'Queens', state: 'NY', phone: '(347) 555-0179', profession: 'CPA', status: 'not_called' },
  { id: '12', fullName: 'Stephanie Lee', dba: 'Lee Tax Advisory', city: 'Tampa', state: 'FL', phone: '(813) 555-0148', profession: 'EA', status: 'booked' },
  { id: '13', fullName: 'Marcus Brown', dba: 'Brown Tax Attorneys', city: 'San Jose', state: 'CA', phone: '(408) 555-0192', profession: 'ATTY', status: 'called' },
  { id: '14', fullName: 'Sandra Patel', dba: 'Patel CPA Firm', city: 'Houston', state: 'TX', phone: '(832) 555-0124', profession: 'CPA', status: 'not_called' },
  { id: '15', fullName: 'Kevin O’Brien', dba: 'O’Brien Tax Services', city: 'Buffalo', state: 'NY', phone: '(716) 555-0163', profession: 'EA', status: 'not_called' },
];

export default function CallsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Call List</h1>
          <p className="mt-1 text-sm text-white/50">
            FOIA-sourced tax pros. Filter, call, and log appointments.
          </p>
        </div>
      </header>

      <CallListTable initialData={MOCK_CALL_LIST} />
    </div>
  );
}
