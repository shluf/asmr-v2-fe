'use client'

import { useState } from "react";
import { Check, TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PrimaryButton from "./PrimaryButton";

function Alert({
  isOpen,
  onClose,
  title = "Berhasil!!",
  desc = '',
  message = "Pengajuan surat berhasil, silahkan tunggu status selanjutnya di laman histori pengajuan",
  success = true,
  color = "green",
  onConfirm,
  confirmButtonText = "Tutup"
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }

    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold mb-4 text-center text-[#2C3E50]">
            {title}
          </AlertDialogTitle>
          <div className="flex justify-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-${color}${success? "" : "-600"}`}>
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
              color="green"
              onClick={handleConfirm}
            >
              {confirmButtonText}
            </PrimaryButton>
          ) : (
              <PrimaryButton color="green" onClick={onClose}>
                Tutup
              </PrimaryButton>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

let showAlertHelper = null;

export function showAlert({ title, success=true, message, desc, customButton, color, onConfirm, confirmButtonText }) {
  if (showAlertHelper) {
    showAlertHelper({ title, message, desc, success, customButton, color, onConfirm, confirmButtonText });
  }
}

export function AlertWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [alertProps, setAlertProps] = useState({
    title: "Berhasil!!",
    message: "Pengajuan surat berhasil.",
    desc: "",
    success: true,
    customButton: false,
    color: "green",
    onConfirm: null,
    confirmButtonText: "Lanjutkan"
  });

  showAlertHelper = ({ title, message, desc, success, customButton, color, onConfirm, confirmButtonText }) => {
    setAlertProps({ 
      title, 
      message, 
      desc, 
      success, 
      customButton, 
      color, 
      onConfirm, 
      confirmButtonText 
    });
    setIsOpen(true);
  };

  return (
    <Alert
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={alertProps.title}
      desc={alertProps.desc}
      message={alertProps.message}
      success={alertProps.success}
      customButton={alertProps.customButton}
      color={alertProps.color}
      onConfirm={alertProps.onConfirm}
      confirmButtonText={alertProps.confirmButtonText}
    />
  );
}