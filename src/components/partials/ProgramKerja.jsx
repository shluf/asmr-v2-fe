'use client'

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO, isValid, isSameDay, isAfter, isBefore, startOfDay } from "date-fns"
import { id as idLocale } from "date-fns/locale"

const ProgramKerja = ({ 
  dataProker = [], 
  loading = false,
  onEdit, 
  onDelete, 
  onAdd, 
  editable = false, 
  isProcessing = { edit: false, add: false, delete: false } 
}) => {
  const [filteredProker, setFilteredProker] = useState([])
  const [isFiltered, setIsFiltered] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [lastSelectedDate, setLastSelectedDate] = useState(null)

  useEffect(() => {
    if (Array.isArray(dataProker)) {
      const sortedData = [...dataProker].sort((a, b) => {
        const dateA = a.tanggal_mulai ? parseISO(a.tanggal_mulai) : new Date(0)
        const dateB = b.tanggal_mulai ? parseISO(b.tanggal_mulai) : new Date(0)
        return dateB - dateA
      })
      setFilteredProker(sortedData)
      setIsFiltered(false) 
    }
  }, [dataProker])

  const isProgramKerjaSingle = (date) => {
    if (!date || !Array.isArray(dataProker) || dataProker.length === 0) return false
    const currentDay = startOfDay(date)
    return dataProker.some((event) => {
      if (!event.tanggal_mulai) return false
      const startDate = startOfDay(parseISO(event.tanggal_mulai))
      const endDate = event.tanggal_selesai ? startOfDay(parseISO(event.tanggal_selesai)) : startDate
      return isSameDay(currentDay, startDate) && isSameDay(startDate, endDate)
    })
  }

  const isProgramKerjaStart = (date) => {
    if (!date || !Array.isArray(dataProker) || dataProker.length === 0) return false
    const currentDay = startOfDay(date)
    return dataProker.some((event) => {
      if (!event.tanggal_mulai || !event.tanggal_selesai) return false
      const startDate = startOfDay(parseISO(event.tanggal_mulai))
      const endDate = startOfDay(parseISO(event.tanggal_selesai))
      return isSameDay(currentDay, startDate) && !isSameDay(startDate, endDate)
    })
  }

  const isProgramKerjaEnd = (date) => {
    if (!date || !Array.isArray(dataProker) || dataProker.length === 0) return false
    const currentDay = startOfDay(date)
    return dataProker.some((event) => {
      if (!event.tanggal_mulai || !event.tanggal_selesai) return false
      const startDate = startOfDay(parseISO(event.tanggal_mulai))
      const endDate = startOfDay(parseISO(event.tanggal_selesai))
      return isSameDay(currentDay, endDate) && !isSameDay(startDate, endDate)
    })
  }
  
  const isProgramKerjaMiddle = (date) => {
    if (!date || !Array.isArray(dataProker) || dataProker.length === 0) return false
    const currentDay = startOfDay(date)
    return dataProker.some((event) => {
      if (!event.tanggal_mulai || !event.tanggal_selesai) return false
      const startDate = startOfDay(parseISO(event.tanggal_mulai))
      const endDate = startOfDay(parseISO(event.tanggal_selesai))
      return isAfter(currentDay, startDate) && isBefore(currentDay, endDate)
    })
  }

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const handleCalendarDateSelect = (date) => {
    if (!date || !Array.isArray(dataProker)) return

    const currentSelectedDayStart = startOfDay(date)

    if (isFiltered && lastSelectedDate && isSameDay(currentSelectedDayStart, startOfDay(lastSelectedDate))) {
      handleShowAllPrograms()
      return
    }

    const eventsOnSelectedDate = dataProker.filter((event) => {
      const startDate = event.tanggal_mulai ? startOfDay(parseISO(event.tanggal_mulai)) : null
      if (!startDate) return false
      const endDate = event.tanggal_selesai ? startOfDay(parseISO(event.tanggal_selesai)) : startDate
      return (isSameDay(currentSelectedDayStart, startDate) || isAfter(currentSelectedDayStart, startDate)) &&
             (isSameDay(currentSelectedDayStart, endDate) || isBefore(currentSelectedDayStart, endDate))
    })
    
    const otherEvents = dataProker.filter((event) => {
      const startDate = event.tanggal_mulai ? startOfDay(parseISO(event.tanggal_mulai)) : null
      if (!startDate) return true
      const endDate = event.tanggal_selesai ? startOfDay(parseISO(event.tanggal_selesai)) : startDate
      return !((isSameDay(currentSelectedDayStart, startDate) || isAfter(currentSelectedDayStart, startDate)) &&
               (isSameDay(currentSelectedDayStart, endDate) || isBefore(currentSelectedDayStart, endDate)))
    })

    const sortEvents = (arr) => arr.sort((a, b) => {
        const dateA = a.tanggal_mulai ? parseISO(a.tanggal_mulai) : new Date(0)
        const dateB = b.tanggal_mulai ? parseISO(b.tanggal_mulai) : new Date(0)
        return dateB - dateA
    })

    setFilteredProker([...sortEvents(eventsOnSelectedDate), ...sortEvents(otherEvents)])
    setIsFiltered(true)
    setLastSelectedDate(date)
  }

  const handleShowAllPrograms = () => {
    if (Array.isArray(dataProker)) {
      const sortedData = [...dataProker].sort((a, b) => {
        const dateA = a.tanggal_mulai ? parseISO(a.tanggal_mulai) : new Date(0)
        const dateB = b.tanggal_mulai ? parseISO(b.tanggal_mulai) : new Date(0)
        return dateB - dateA
      })
      setFilteredProker(sortedData)
    }
    setIsFiltered(false)
    setLastSelectedDate(null)
  }

  const formatDayName = (dateString) => {
    try {
      const date = parseISO(dateString)
      if (!isValid(date)) return ""
      return format(date, "EEEE", { locale: idLocale })
    } catch (e) {
      return ""
    }
  }

  const getDayNumber = (dateString) => {
    try {
      const date = parseISO(dateString)
      if (!isValid(date)) return ""
      return format(date, "d")
    } catch (e) {
      return ""
    }
  }

  return (
    <Card>
        <div className="flex m-10 flex-col lg:flex-row gap-6">
          <div className="border rounded-lg p-4 shadow-sm">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="flex justify-between items-center w-72">
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
              <Calendar
                mode="single"
                onSelect={handleCalendarDateSelect}
                month={selectedMonth}
                className="rounded flex justify-center w-72"
                modifiers={{
                  isProgramKerjaSingle: (d) => isProgramKerjaSingle(d),
                  isProgramKerjaStart: (d) => isProgramKerjaStart(d),
                  isProgramKerjaMiddle: (d) => !isProgramKerjaStart(d) && !isProgramKerjaSingle(d) && !isProgramKerjaEnd(d) && isProgramKerjaMiddle(d),
                  isProgramKerjaEnd: (d) => isProgramKerjaEnd(d),
                }}
                modifiersClassNames={{
                  isProgramKerjaSingle: "bg-[#61210F] hover:bg-[#7A2A19] hover:text-[#FBE89D] text-primary-foreground font-semibold rounded-md",
                  isProgramKerjaStart: "bg-[#61210F] hover:bg-[#7A2A19] hover:text-[#FBE89D] text-primary-foreground font-semibold rounded-l-md",
                  isProgramKerjaMiddle: "bg-[#F9EDCC] text-accent-foreground font-semibold h-[25px] mt-1 rounded-none",
                  isProgramKerjaEnd: "bg-[#EA2B1F] hover:bg-[#F03D2F] hover:text-[#FBE89D] text-primary-foreground font-semibold rounded-r-md",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
          <h2 className="text-2xl font-bold mb-4">Appointment</h2>
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
                (() => {
                  const today = startOfDay(new Date())
                  let eventsForSelectedDate = []
                  let remainingEvents = filteredProker
                  let formattedSelectedDate = ""

                  if (isFiltered && lastSelectedDate) {
                    formattedSelectedDate = format(lastSelectedDate, "d MMMM yyyy", { locale: idLocale })
                    const currentSelectedDayStart = startOfDay(lastSelectedDate)

                    eventsForSelectedDate = filteredProker.filter(p => {
                      const startDate = p.tanggal_mulai ? startOfDay(parseISO(p.tanggal_mulai)) : null
                      if (!startDate) return false
                      const endDate = p.tanggal_selesai ? startOfDay(parseISO(p.tanggal_selesai)) : startDate
                      return (isSameDay(currentSelectedDayStart, startDate) || isAfter(currentSelectedDayStart, startDate)) &&
                             (isSameDay(currentSelectedDayStart, endDate) || isBefore(currentSelectedDayStart, endDate))
                    })
                    eventsForSelectedDate.sort((a,b) => {
                        const timeA = a.waktu_mulai ? a.waktu_mulai.split(':').join('') : '0000'
                        const timeB = b.waktu_mulai ? b.waktu_mulai.split(':').join('') : '0000'
                        return timeA.localeCompare(timeB)
                    })


                    remainingEvents = filteredProker.filter(p => !eventsForSelectedDate.includes(p))
                  }

                  const upcomingEvents = remainingEvents
                    .filter(p => p.tanggal_mulai && (isSameDay(parseISO(p.tanggal_mulai), today) || isAfter(parseISO(p.tanggal_mulai), today)))
                    .sort((a, b) => parseISO(a.tanggal_mulai) - parseISO(b.tanggal_mulai))
                  
                  const pastEvents = remainingEvents
                    .filter(p => p.tanggal_mulai && isBefore(parseISO(p.tanggal_mulai), today))
                    .sort((a, b) => parseISO(b.tanggal_mulai) - parseISO(a.tanggal_mulai))

                  const renderProkerItem = (proker, index, type) => (
                    <div
                      key={`${type}-${index}`}
                      className={`rounded-lg ${
                        type === 'selected' ? (index % 2 === 0 ? "bg-green-100" : "bg-green-50") :
                        type === 'upcoming' ? (index % 2 === 0 ? "bg-yellow-100" : "bg-gray-50") :
                        ("bg-blue-100")
                      } overflow-hidden ${type === 'past' ? 'opacity-75' : ''}`}
                    >
                      <div className="p-4 flex justify-between">
                        <div className="flex items-start gap-4">
                          <div className="text-center">
                            <div className="text-5xl font-bold">
                              {getDayNumber(proker.tanggal_mulai)}
                            </div>
                            <div className="text-sm font-medium">
                              {formatDayName(proker.tanggal_mulai)}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-xl font-bold">
                              {proker.nama_program_kerja}
                            </h3>
                            <p className="text-gray-700">{proker.tempat}</p>
                            <p className="text-lg font-semibold mt-1">
                              {proker.waktu_mulai} {proker.waktu_selesai ? `- ${proker.waktu_selesai}` : '- Selesai'}
                            </p>
                          </div>
                        </div>
                        {editable && (
                          <div className="flex flex-col gap-2">
                            {onEdit && type !== 'past' && (
                              <Button
                                variant="secondary"
                                className="rounded-md"
                                onClick={() => onEdit(proker)}
                              >
                                Edit
                              </Button>
                            )}
                            {onDelete && type !== 'past' && (
                              <Button
                                variant="destructive"
                                className="rounded-md"
                                onClick={() => onDelete(proker.id)}
                                disabled={isProcessing.delete}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                             {onEdit && type === 'past' && (
                                <Button
                                variant="secondary"
                                className="rounded-md"
                                onClick={() => onEdit(proker)} 
                                >
                                Lihat
                                </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )

                  return (
                    <>
                      {isFiltered && lastSelectedDate && eventsForSelectedDate.length > 0 && (
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex flex-row gap-2 mb-4 justify-between items-center">
                              <div className="w-full h-0.5 bg-gray-300 my-2" />
                              <p className="text-sm font-semibold text-gray-700 text-nowrap">Program Kerja tanggal {formattedSelectedDate}</p>
                              <div className="w-full h-0.5 bg-gray-300 my-2" />
                            </div>
                          {eventsForSelectedDate.map((proker, index) => renderProkerItem(proker, index, 'selected'))}
                        </div>
                      )}

                      {upcomingEvents.length > 0 && (
                        <div className="flex flex-col gap-2 mb-4">
                          { upcomingEvents.length > 0 ? (
                            <div className="flex flex-row gap-2 mb-4 justify-between items-center">
                              <div className="w-full h-0.5 bg-gray-300 my-2" />
                              <p className="text-sm font-semibold text-gray-700 text-nowrap">Program Kerja yang akan datang</p>
                              <div className="w-full h-0.5 bg-gray-300 my-2" />
                            </div>
                          ) : null}
                          {upcomingEvents.map((proker, index) => renderProkerItem(proker, index, 'upcoming'))}
                        </div>
                      )}

                      {pastEvents.length > 0 && (
                        <div className="flex flex-col gap-2">
                          { pastEvents.length > 0 ? (
                            <div className="flex flex-row gap-2 mb-4 justify-between items-center">
                              <div className="w-full h-0.5 bg-gray-300 my-2" />
                              <p className="text-sm font-semibold text-gray-700 text-nowrap">Program Kerja yang telah dilaksanakan</p>
                              <div className="w-full h-0.5 bg-gray-300 my-2" />
                            </div>
                          ) : null}
                          {pastEvents.map((proker, index) => renderProkerItem(proker, index, 'past'))}
                        </div>
                      )}
                      
                      {eventsForSelectedDate.length === 0 && upcomingEvents.length === 0 && pastEvents.length === 0 && filteredProker.length > 0 && (
                         <div className="text-center py-8 text-gray-500">
                            Tidak ada program kerja yang sesuai dengan filter tanggal saat ini.
                         </div>
                      )}
                       {filteredProker.length === 0 && !loading && (
                         <div className="text-center py-8 text-gray-500">
                            Tidak ada program kerja yang tersedia untuk ditampilkan.
                         </div>
                       )}
                    </>
                  )
                })()
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
    </Card>
  )
}

export default ProgramKerja