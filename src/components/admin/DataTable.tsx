"use client";

import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchQuery?: string; // We can add global filter later if needed
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="ide-panel overflow-hidden border-[var(--ide-border)] bg-[var(--ide-bg)] shadow-2xl rounded-3xl w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[var(--ide-header-bg)] border-b border-[var(--ide-border)]">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="py-4 px-6 text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-wider whitespace-nowrap cursor-pointer select-none group"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {{
                            asc: <ChevronUp className="w-3 h-3 text-[#FF3366]" />,
                            desc: <ChevronDown className="w-3 h-3 text-[#FF3366]" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronUp className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[var(--ide-border)] bg-[var(--background)]/30 text-[var(--text-secondary)]">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={row.id}
                    className="hover:bg-white/[0.02] dark:hover:bg-white/[0.01] transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-6 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-[var(--text-muted)] font-mono">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded-md border border-[var(--btn-sec-border)] bg-[var(--btn-sec-bg)] text-[var(--btn-sec-text)] disabled:opacity-50 hover:bg-[#FF3366]/10 hover:text-[#FF3366] hover:border-[#FF3366]/30 transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded-md border border-[var(--btn-sec-border)] bg-[var(--btn-sec-bg)] text-[var(--btn-sec-text)] disabled:opacity-50 hover:bg-[#FF3366]/10 hover:text-[#FF3366] hover:border-[#FF3366]/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded-md border border-[var(--btn-sec-border)] bg-[var(--btn-sec-bg)] text-[var(--btn-sec-text)] disabled:opacity-50 hover:bg-[#FF3366]/10 hover:text-[#FF3366] hover:border-[#FF3366]/30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded-md border border-[var(--btn-sec-border)] bg-[var(--btn-sec-bg)] text-[var(--btn-sec-text)] disabled:opacity-50 hover:bg-[#FF3366]/10 hover:text-[#FF3366] hover:border-[#FF3366]/30 transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
