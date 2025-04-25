'use client'

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, isValid, isSameDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const ProgramKerja = ({ 
  dataProker = [], 
  loading = false,
  onEdit, 
  onDelete, 
  onAdd, 
  editable = false, 
  isProcessing = { edit: false, add: false, delete: false } 
}) => {
  const [filteredProker, setFilteredProker] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    setFilteredProker(dataProker);
  }, [dataProker]);

  const hasEventOnDate = (date) => {
    if (!date || !dataProker || dataProker.length === 0) return false;
    return dataProker.some((event) => {
      if (!event.tanggal) return false;
      try {
        const eventDate = parseISO(event.tanggal);
        return isValid(eventDate) && isSameDay(eventDate, date);
      } catch (e) {
        return false;
      }
    });
  };

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleCalendarDateSelect = (date) => {
    if (!date) return;
    const eventsOnDate = dataProker.filter((event) => {
      if (!event.tanggal) return false;
      try {
        const eventDate = parseISO(event.tanggal);
        return isValid(eventDate) && isSameDay(eventDate, date);
      } catch (e) {
        return false;
      }
    });
    if (eventsOnDate.length > 0) {
      setFilteredProker(eventsOnDate);
      setIsFiltered(true);
    }
  };

  const handleShowAllPrograms = () => {
    setFilteredProker(dataProker);
    setIsFiltered(false);
  };

  const formatDayName = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return "";
      return format(date, "EEEE", { locale: idLocale });
    } catch (e) {
      return "";
    }
  };

  const getDayNumber = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return "";
      return format(date, "d");
    } catch (e) {
      return "";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Program Kerja</CardTitle>
        {isFiltered && (
          <Button
            variant="outline"
            onClick={handleShowAllPrograms}
            className="flex items-center gap-1"
          >
            {editable && <X className="h-4 w-4" />}
            Tampilkan Semua
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {format(selectedMonth, "MMMM yyyy", { locale: idLocale })}
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <Calendar
                mode="single"
                onSelect={handleCalendarDateSelect}
                month={selectedMonth}
                className="rounded-md border flex justify-center w-72"
                modifiers={{
                  hasEvent: (date) => hasEventOnDate(date),
                }}
                modifiersClassNames={{
                  hasEvent: "bg-yellow-200 font-bold text-black",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <div className="overflow-y-auto max-h-[400px] space-y-2 pr-2">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-20 rounded-md" />
                  </div>
                ))
              ) : filteredProker.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada program kerja yang tersedia
                </div>
              ) : (
                filteredProker.map((proker, index) => (
                  <div
                    key={index}
                    className={`rounded-lg ${
                      index % 2 === 0 ? "bg-yellow-200" : "bg-gray-50"
                    } overflow-hidden`}
                  >
                    <div className="p-4 flex justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-center">
                          <div className="text-5xl font-bold">
                            {getDayNumber(proker.tanggal)}
                          </div>
                          <div className="text-sm font-medium">
                            {formatDayName(proker.tanggal)}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-xl font-bold">
                            {proker.jenis_kegiatan}
                          </h3>
                          <p className="text-gray-700">{proker.tempat}</p>
                          <p className="text-lg font-semibold mt-1">
                            {proker.waktu}
                          </p>
                        </div>
                      </div>
                      {editable && (
                        <div className="flex flex-col gap-2">
                          {onEdit && (
                            <Button
                              variant="secondary"
                              className="rounded-md"
                              onClick={() => onEdit(proker)}
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="destructive"
                              className="rounded-md"
                              onClick={() => onDelete(proker.id_program_kerja)}
                              disabled={isProcessing.delete}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {editable && onAdd && (
              <div className="flex justify-end">
                <Button
                  className="mt-4 bg-gray-800 text-white hover:bg-gray-700 rounded-md"
                  onClick={onAdd}
                >
                  Tambahkan Proker
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramKerja;