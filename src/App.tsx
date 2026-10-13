import React, { useState } from 'react';
import { School, Users, CheckCircle, Clock, Search, Printer, Download, BookOpen, Filter, ArrowUpRight, ShieldCheck, CheckSquare, Square, LogOut, User as UserIcon } from 'lucide-react';
import { apiClient, User } from './api';
import { AdminLogin } from './components/AdminLogin';

interface StudentRosterItem {
  id: string;
  fullName: string;
  mykidNumber?: string;
  standard: string;
  className: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  hasPurchased: boolean;
  totalSpent: number;
  latestOrderStatus: string;
  latestOrderCode?: string;
  handedToStudent?: boolean;
}

const INITIAL_STUDENTS: StudentRosterItem[] = [
  {
    id: 's-1',
    fullName: 'Arun Kumar a/l Sivakumar',
    mykidNumber: '170512-10-4433',
    standard: 'DARJAH_3',
    className: '3 Valluvar',
    parentName: 'Sivakumar a/l Ramasamy',
    parentEmail: 'parent@gmail.com',
    parentPhone: '+60172349876',
    hasPurchased: true,
    totalSpent: 63.50,
    latestOrderStatus: 'PAID',
    latestOrderCode: 'EKV-3VAL-00001',
    handedToStudent: false,
  },
  {
    id: 's-2',
    fullName: 'Priyashini a/p Sivakumar',
    mykidNumber: '190204-10-8822',
    standard: 'DARJAH_1',
    className: '1 Kambar',
    parentName: 'Sivakumar a/l Ramasamy',
    parentEmail: 'parent@gmail.com',
    parentPhone: '+60172349876',
    hasPurchased: true,
    totalSpent: 58.20,
    latestOrderStatus: 'PAID',
    latestOrderCode: 'EKV-1KAM-00002',
    handedToStudent: true,
  },
  {
    id: 's-3',
    fullName: 'Dharshini a/p Murugan',
    mykidNumber: '170810-10-5542',
    standard: 'DARJAH_3',
    className: '3 Valluvar',
    parentName: 'Murugan a/l Gopal',
    parentEmail: 'murugan.g@yahoo.com',
    parentPhone: '+60129871122',
    hasPurchased: true,
    totalSpent: 63.50,
    latestOrderStatus: 'PAID',
    latestOrderCode: 'EKV-3VAL-00003',
    handedToStudent: false,
  },
  {
    id: 's-4',
    fullName: 'Kavin a/l Saravanan',
    mykidNumber: '170322-10-9981',
    standard: 'DARJAH_3',
    className: '3 Valluvar',
    parentName: 'Saravanan a/l Annamalai',
    parentEmail: 'saravanan.a@gmail.com',
    parentPhone: '+60163334455',
    hasPurchased: false,
    totalSpent: 0,
    latestOrderStatus: 'NOT_PURCHASED',
    handedToStudent: false,
  },
  {
    id: 's-5',
    fullName: 'Rithvik a/l Mohan',
    mykidNumber: '180911-10-1234',
    standard: 'DARJAH_2',
    className: '2 Barathi',
    parentName: 'Mohan a/l Ramu',
    parentEmail: 'mohan.ramu@hotmail.com',
    parentPhone: '+60134445566',
    hasPurchased: true,
    totalSpent: 61.00,
    latestOrderStatus: 'PAID',
    latestOrderCode: 'EKV-2BAR-00004',
    handedToStudent: true,
  },
  {
    id: 's-6',
    fullName: 'Sharmila a/p Ravi',
    mykidNumber: '150419-10-6789',
    standard: 'DARJAH_5',
    className: '5 Thiruvalluvar',
    parentName: 'Ravi a/l Subramaniam',
    parentEmail: 'ravi.s@gmail.com',
    parentPhone: '+60198887766',
    hasPurchased: false,
    totalSpent: 0,
    latestOrderStatus: 'NOT_PURCHASED',
    handedToStudent: false,
  },
];

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => apiClient.getUser());
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'STUDENTS' | 'DISTRIBUTION' | 'BOOKLISTS'>('DASHBOARD');
  const [students, setStudents] = useState<StudentRosterItem[]>(INITIAL_STUDENTS);

  // Filters
  const [selectedStandard, setSelectedStandard] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    apiClient.clearToken();
    apiClient.clearUser();
    setCurrentUser(null);
  };

  // Distribution check toggle
  const toggleHandedToStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, handedToStudent: !s.handedToStudent } : s))
    );
  };

  // Calculations
  const totalStudents = students.length;
  const purchasedStudents = students.filter((s) => s.hasPurchased).length;
  const adoptionRate = Math.round((purchasedStudents / totalStudents) * 100);
  const totalSchoolRevenue = students.reduce((sum, s) => sum + s.totalSpent, 0);

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchStd = selectedStandard === 'ALL' || s.standard === selectedStandard;
    const matchClass = selectedClass === 'ALL' || s.className === selectedClass;
    const matchSearch =
      !searchQuery.trim() ||
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.mykidNumber && s.mykidNumber.includes(searchQuery)) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStd && matchClass && matchSearch;
  });

  // Unique classes for filter
  const classList = Array.from(new Set(students.map((s) => s.className)));

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#4d101e', color: '#ffffff', borderBottom: '3px solid #d4af37', padding: '12px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <School size={22} color="#4d101e" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fef08a' }}>
                eKalvi School Admin Portal | SJK(T) Pentadbiran Sekolah
              </div>
              <div style={{ fontSize: 11, color: '#e2e8f0' }}>
                Sekolah Jenis Kebangsaan Tamil • Guru Besar / PK Pentadbiran
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
              Sesi 2026/2027
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.25)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(212,175,55,0.3)' }}>
              <UserIcon size={14} color="#fef08a" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#f8fafc' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: 10, background: '#d4af37', color: '#4d101e', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                ADMIN
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out of Admin Portal"
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub Nav */}
      <div className="no-print" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 24 }}>
          {[
            { id: 'DASHBOARD', label: 'School Dashboard', icon: School },
            { id: 'STUDENTS', label: `Student Rosters (${totalStudents})`, icon: Users },
            { id: 'DISTRIBUTION', label: 'Classroom Distribution Checklists', icon: CheckCircle },
            { id: 'BOOKLISTS', label: 'Curricula Booklist Config', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #4d101e' : '3px solid transparent',
                  color: isActive ? '#4d101e' : '#64748b',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  padding: '14px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: 1200, width: '100%', margin: '24px auto', padding: '0 24px', flex: 1 }}>
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
              School Enrollment & Textbook Purchase Overview
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={{ background: '#ffffff', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Registered Students</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', marginTop: 4 }}>{totalStudents}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Darjah 1 to 6</div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Booklists Purchased</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>
                  {purchasedStudents} ({adoptionRate}%)
                </div>
                <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4 }}>Orders paid & confirmed</div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Pending Purchases</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>
                  {totalStudents - purchasedStudents} students
                </div>
                <div style={{ fontSize: 11, color: '#d97706', marginTop: 4 }}>Awaiting parent checkout</div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Collected Revenue</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#4d101e', marginTop: 4 }}>
                  RM {totalSchoolRevenue.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Processed via FPX/DuitNow</div>
              </div>
            </div>

            {/* Standard by standard adoption bars */}
            <div style={{ background: '#ffffff', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0', marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', marginBottom: 14 }}>
                Curriculum Adoption Rate by Standard (Darjah 1 - 6)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { std: 'Darjah 1 (Tahun 1)', percent: 100, count: '1/1' },
                  { std: 'Darjah 2 (Tahun 2)', percent: 100, count: '1/1' },
                  { std: 'Darjah 3 (Tahun 3)', percent: 67, count: '2/3' },
                  { std: 'Darjah 4 (Tahun 4)', percent: 85, count: '17/20' },
                  { std: 'Darjah 5 (Tahun 5)', percent: 0, count: '0/1' },
                  { std: 'Darjah 6 (Tahun 6)', percent: 90, count: '18/20' },
                ].map((item) => (
                  <div key={item.std}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      <span style={{ color: '#334155' }}>{item.std}</span>
                      <span style={{ color: item.percent > 70 ? '#16a34a' : '#d97706' }}>
                        {item.percent}% ({item.count} students)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.percent}%`,
                          height: '100%',
                          background: item.percent > 70 ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #d97706, #f59e0b)',
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT ROSTERS & PURCHASES */}
        {activeTab === 'STUDENTS' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
                Enrolled Students & Textbook Purchase Status
              </h1>
              <button className="admin-btn" onClick={() => window.print()}>
                <Printer size={16} /> Print Student Roster
              </button>
            </div>

            {/* Filter controls */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0', marginBottom: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 10 }} />
                <input
                  type="text"
                  placeholder="Search student, MyKid, or parent name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px 8px 34px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                />
              </div>

              <div>
                <select
                  value={selectedStandard}
                  onChange={(e) => setSelectedStandard(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                >
                  <option value="ALL">All Standards</option>
                  <option value="DARJAH_1">Darjah 1</option>
                  <option value="DARJAH_2">Darjah 2</option>
                  <option value="DARJAH_3">Darjah 3</option>
                  <option value="DARJAH_4">Darjah 4</option>
                  <option value="DARJAH_5">Darjah 5</option>
                  <option value="DARJAH_6">Darjah 6</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
                >
                  <option value="ALL">All Classes</option>
                  {classList.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Name & MyKid</th>
                    <th>Standard & Class</th>
                    <th>Parent Contact</th>
                    <th>Booklist Status</th>
                    <th>Verification Code</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{s.fullName}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>MyKid: {s.mykidNumber || 'N/A'}</div>
                      </td>
                      <td>
                        <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                          {s.className}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{s.parentName}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{s.parentEmail} • {s.parentPhone}</div>
                      </td>
                      <td>
                        {s.hasPurchased ? (
                          <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 800 }}>
                            ✔ Purchased (Paid)
                          </span>
                        ) : (
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 800 }}>
                            Pending Purchase
                          </span>
                        )}
                      </td>
                      <td>
                        {s.latestOrderCode ? (
                          <code style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: 4, fontWeight: 700, color: '#4d101e' }}>
                            {s.latestOrderCode}
                          </code>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: 11 }}>-</span>
                        )}
                      </td>
                      <td style={{ fontWeight: 700, color: s.totalSpent > 0 ? '#4d101e' : '#64748b' }}>
                        RM {s.totalSpent.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CLASSROOM DISTRIBUTION CHECKLISTS */}
        {activeTab === 'DISTRIBUTION' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
                  Classroom Textbook Distribution Checklist (Borang Agihan Kelas)
                </h1>
                <p style={{ fontSize: 12, color: '#64748b' }}>
                  For class teachers to verify and tick items when handing textbooks directly to students in the classroom.
                </p>
              </div>
              <button className="admin-btn" onClick={() => window.print()}>
                <Printer size={16} /> Print Distribution Sheet
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Status</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Order Code</th>
                    <th>Items Included</th>
                    <th>Handed to Student</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter((s) => s.hasPurchased)
                    .map((s) => (
                      <tr key={s.id}>
                        <td>
                          <button
                            onClick={() => toggleHandedToStudent(s.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                          >
                            {s.handedToStudent ? (
                              <CheckSquare size={20} color="#16a34a" />
                            ) : (
                              <Square size={20} color="#94a3b8" />
                            )}
                          </button>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>{s.fullName}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>MyKid: {s.mykidNumber}</div>
                        </td>
                        <td>
                          <strong>{s.className}</strong>
                        </td>
                        <td>
                          <strong style={{ color: '#4d101e', fontFamily: 'monospace' }}>
                            {s.latestOrderCode}
                          </strong>
                        </td>
                        <td style={{ fontSize: 11, color: '#475569' }}>
                          Standard Curriculum Package (Buku Teks Bahasa Tamil, BM, BI, Math, Sains, Moral + Buku Latihan)
                        </td>
                        <td>
                          {s.handedToStudent ? (
                            <span style={{ color: '#16a34a', fontWeight: 700 }}>✔ Diserahkan</span>
                          ) : (
                            <span style={{ color: '#d97706', fontWeight: 600 }}>Belum Diserahkan</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CURRICULA BOOKLIST PACKAGES */}
        {activeTab === 'BOOKLISTS' && (
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
              Curriculum Booklist Packages Configuration (KSSR Semakan SJKT)
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                {
                  grade: 'Darjah 1 (Tahun 1)',
                  books: [
                    'Buku Teks Bahasa Tamil Tahun 1 (RM 9.80)',
                    'Buku Aktiviti Bahasa Tamil Tahun 1 (RM 5.20)',
                    'Buku Teks Bahasa Melayu Tahun 1 (RM 10.50)',
                    'Buku Aktiviti Bahasa Melayu Tahun 1 (RM 5.50)',
                    'Super Minds 1 Textbook (RM 12.00)',
                    'Buku Teks Matematik Jilid 1 & 2 (RM 14.00)',
                    'Buku Teks Sains Tahun 1 (RM 8.50)',
                    'Buku Teks Pendidikan Moral (RM 7.20)',
                  ],
                  total: 'RM 72.70',
                },
                {
                  grade: 'Darjah 3 (Tahun 3)',
                  books: [
                    'Buku Teks Bahasa Tamil Tahun 3 (RM 11.20)',
                    'Buku Aktiviti Bahasa Tamil Tahun 3 (RM 6.50)',
                    'Buku Teks Bahasa Melayu Tahun 3 (RM 12.00)',
                    'Buku Teks English Year 3 (RM 13.50)',
                    'Buku Teks Matematik Jilid 1 & 2 (RM 15.50)',
                    'Buku Teks Sains Tahun 3 (RM 9.80)',
                    'Buku Teks Pendidikan Moral (RM 8.50)',
                    'Buku Latihan Garis Satu (RM 1.40)',
                  ],
                  total: 'RM 78.40',
                },
              ].map((b) => (
                <div key={b.grade} style={{ background: '#ffffff', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: '#4d101e' }}>{b.grade}</h2>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>Package Total: {b.total}</span>
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: 12, color: '#334155', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {b.books.map((bk, i) => (
                      <li key={i}>{bk}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
