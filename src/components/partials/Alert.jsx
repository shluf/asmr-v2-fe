'use client'

import { useState } from "react"
import { Check, TriangleAlert } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import PrimaryButton from "@/components/Atoms/PrimaryButton"

function Alert({
  isOpen,
  onClose,
  title = "Berhasil!!",
  desc = '',
  message = "Proses berhasil, tutup untuk melanjutkan",
  success = true,
  color = "green",
  onConfirm,
  confirmButtonText = "Tutup"
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }

    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent id="alert-content" className="max-w-md rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle id="alert-title" className="text-2xl font-bold mb-4 text-center text-[#2C3E50]">
            {title}
          </AlertDialogTitle>
          <div className="flex justify-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-${color}${success ? "" : "-600"}`}>
              { success ?
                <Check className={`w-14 h-14   text-${color}`} />
                : <TriangleAlert className={`w-14 h-14 text-${color}-600`} />
              }
            </div>
          </div>
        </AlertDialogHeader>
          <AlertDialogDescription className="text-center text-base px-4 text-gray-600">
          <div className="text-center text-sm text-gray-400 mt-2">
            {desc}
          </div>
          <div>
            {message}
          </div>
          </AlertDialogDescription>
        <AlertDialogFooter className="sm:justify-center mt-2">
          {/* <PrimaryButton
            color={ customButton ? "yellow" : "green"}
            onClick={onClose}
          >
            Tutup
          </PrimaryButton> */}

          {onConfirm ? (
            <PrimaryButton
              id="alert-confirm-button"
              color="green"
              onClick={handleConfirm}
            >
              {confirmButtonText}
            </PrimaryButton>
          ) : (
              <PrimaryButton id="alert-close-button" color="green" onClick={onClose}>
                Tutup
              </PrimaryButton>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

let showAlertHelper = null

export function showAlert({ title, success=true, message, desc, color, onConfirm, confirmButtonText }) {
  if (showAlertHelper) {
    showAlertHelper({ title, message, desc, success, color, onConfirm, confirmButtonText })
  }
}

export function AlertWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const [alertProps, setAlertProps] = useState({
    title: "Berhasil!!",
    message: "Pengajuan surat berhasil.",
    desc: "",
    success: true,
    color: "green",
    onConfirm: null,
    confirmButtonText: "Lanjutkan"
  })

  showAlertHelper = ({ title, message, desc, success, color, onConfirm, confirmButtonText }) => {
    setAlertProps({ 
      title, 
      message, 
      desc, 
      success, 
      color, 
      onConfirm, 
      confirmButtonText 
    })
    setIsOpen(true)
  }

  return (
    <Alert
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={alertProps.title}
      desc={alertProps.desc}
      message={alertProps.message}
      success={alertProps.success}
      color={alertProps.color}
      onConfirm={alertProps.onConfirm}
      confirmButtonText={alertProps.confirmButtonText}
    />
  )
}