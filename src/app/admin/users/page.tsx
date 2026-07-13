"use client";

import React, { useMemo } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Filter, Download, MoreVertical, Edit, Trash2, ShieldOff, Star } from 'lucide-react';

// Mock Data Type
type UserData = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  country: string;
  skills: string[];
  status: 'Online' | 'Offline' | 'Banned';
  isPremium: boolean;
  joinedDate: string;
  avatarUrl: string;
};

export default function UsersManagementPage() {
  
  const data: UserData[] = useMemo(() => [
    {
      id: '1',
      name: 'Alex Developer',
      username: 'alex_dev',
      email: 'alex@example.com',
      role: 'Student',
      country: 'USA',
      skills: ['React', 'Next.js', 'TypeScript'],
      status: 'Online',
      isPremium: true,
      joinedDate: '2023-10-12',
      avatarUrl: 'A',
    },
    {
      id: '2',
      name: 'Sarah Codes',
      username: 'sarah_codes',
      email: 'sarah@example.com',
      role: 'Mentor',
      country: 'UK',
      skills: ['Python', 'Django', 'AWS'],
      status: 'Offline',
      isPremium: true,
      joinedDate: '2023-11-05',
      avatarUrl: 'S',
    },
    {
      id: '3',
      name: 'John Smith',
      username: 'jsmith99',
      email: 'john.smith@example.com',
      role: 'Student',
      country: 'Canada',
      skills: ['Java', 'Spring Boot'],
      status: 'Banned',
      isPremium: false,
      joinedDate: '2024-01-20',
      avatarUrl: 'J',
    },
    {
      id: '4',
      name: 'Elena Rodriguez',
      username: 'elena_r',
      email: 'elena@example.com',
      role: 'Student',
      country: 'Spain',
      skills: ['UI/UX', 'Figma', 'CSS'],
      status: 'Online',
      isPremium: false,
      joinedDate: '2024-02-14',
      avatarUrl: 'E',
    },
    {
      id: '5',
      name: 'Michael Chen',
      username: 'mchen_ai',
      email: 'michael@example.com',
      role: 'Mentor',
      country: 'Singapore',
      skills: ['Machine Learning', 'PyTorch'],
      status: 'Online',
      isPremium: true,
      joinedDate: '2023-09-01',
      avatarUrl: 'M',
    },
  ], []);

  const columns = useMemo<ColumnDef<UserData>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF3366]/20 to-[#7B61FF]/20 border border-[var(--ide-border)] flex items-center justify-center text-[var(--text-primary)] font-bold text-xs">
              {row.original.avatarUrl}
            </div>
            <div>
              <div className="font-bold text-[var(--text-primary)]">{row.original.name}</div>
              <div className="text-[10px] text-[var(--text-muted)]">@{row.original.username}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
            row.original.role === 'Mentor' 
              ? 'bg-[#7B61FF]/10 text-[#7B61FF]' 
              : 'bg-[var(--btn-sec-bg)] text-[var(--text-secondary)]'
          }`}>
            {row.original.role}
          </span>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                status === 'Online' ? 'bg-emerald-500' :
                status === 'Offline' ? 'bg-gray-400' : 'bg-red-500'
              }`} />
              <span className="text-[11px] font-semibold">{status}</span>
            </div>
          );
        }
      },
      {
        accessorKey: 'isPremium',
        header: 'Premium',
        cell: ({ row }) => (
          row.original.isPremium ? (
            <div className="flex items-center gap-1 text-[#FF3366]">
              <Star size={14} className="fill-[#FF3366]" />
              <span className="text-[11px] font-bold">Pro</span>
            </div>
          ) : (
            <span className="text-[11px] text-[var(--text-muted)]">-</span>
          )
        )
      },
      {
        accessorKey: 'skills',
        header: 'Skills',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {row.original.skills.slice(0, 2).map((skill, i) => (
              <span key={i} className="text-[9px] bg-[var(--btn-sec-bg)] border border-[var(--btn-sec-border)] px-1.5 py-0.5 rounded text-[var(--text-secondary)]">
                {skill}
              </span>
            ))}
            {row.original.skills.length > 2 && (
              <span className="text-[9px] text-[var(--text-muted)] py-0.5">+{row.original.skills.length - 2}</span>
            )}
          </div>
        )
      },
      {
        accessorKey: 'joinedDate',
        header: 'Joined',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-[var(--btn-sec-bg)] text-[var(--text-secondary)] transition-colors" title="Edit User">
              <Edit size={14} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-amber-500/10 text-amber-500 transition-colors" title="Suspend User">
              <ShieldOff size={14} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors" title="Delete User">
              <Trash2 size={14} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-[var(--btn-sec-bg)] text-[var(--text-secondary)] transition-colors">
              <MoreVertical size={14} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] font-mono tracking-tight">User Management</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">Manage user accounts, roles, and subscriptions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary-dev flex items-center gap-2">
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <button className="btn-secondary-dev flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[#FF3366] transition-colors" />
          <input 
            type="text"
            placeholder="Search by name, email, or username..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--ide-bg)] border border-[var(--ide-border)] focus:border-[#FF3366] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)] font-semibold"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono text-[10px]">
          {['All', 'Premium', 'Mentors', 'Banned'].map(filter => (
            <button
              key={filter}
              className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all duration-300 ${filter === 'All' ? 'border-[#FF3366] bg-[#FF3366]/10 text-[#FF3366]' : 'border-[var(--btn-sec-border)] hover:border-[#FF3366] text-[var(--text-secondary)] bg-[var(--btn-sec-bg)]'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
