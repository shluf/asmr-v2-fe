import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import InputLabel from '@/components/Atoms/InputLabel'
import InputError from '@/components/Atoms/InputError'

export default function FileUpload({ setData, id, accept, errors, required }) {
  const [previews, setPreviews] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    const newPreviews = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }))
    
    setPreviews(newPreviews)


    setData('ttd',acceptedFiles[0])  

  }, [setData, id])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false  // Ensuring only one file is uploaded
  })

  return (
    <div className="flex flex-col items-start gap-1 max-w-md mx-auto">
      <InputLabel htmlFor="ttd" value="Tanda Tangan (JPG/PNG, max 2MB)" />
      <div
        {...getRootProps()}
        className={`border-2 border-dashed w-full  rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} required={required} />
        {previews.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="text-center col-span-2">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <p className="mt-2 text-sm text-gray-600">{preview.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Drag & Drop file tanda tangan disini</p>
            <p className="text-xs text-gray-500 mt-1">atau</p>
            <Button className="mt-4" variant="outline">
              Cari file
            </Button>
          </>
        )}
      </div>
      <InputError message={errors} className="mt-1" />
    </div>
  )
}
