import { useState, useCallback, forwardRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import InputLabel from '@/components/Atoms/InputLabel'
import InputError from '@/components/Atoms/InputError'

const FileUpload = forwardRef(({
  onChange,
  onBlur,
  name,
  id,
  accept,
  errors,
  required,
  infoText,
}, ref) => {
  const [previews, setPreviews] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return
    
    const file = acceptedFiles[0]
    const previewUrl = URL.createObjectURL(file)

    setPreviews([{ url: previewUrl, name: file.name }])
    
    if (onChange) {
      onChange(acceptedFiles)
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple: false
  })

  const { ref: dropzoneRef, ...otherInputProps } = getInputProps()

  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <InputLabel htmlFor={id} value="Tanda Tangan (JPG/PNG, max 3MB)" />
      <div
        {...getRootProps()}
        className={`border-2 border-dashed w-full rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input 
          {...otherInputProps}
          id={id}
          name={name}
          onBlur={onBlur}
          required={required}
          ref={(node) => {
            if (typeof dropzoneRef === 'function') {
              dropzoneRef(node)
            } else if (dropzoneRef) {
              dropzoneRef.current = node
            }
            
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
        />
        
        {previews.length > 0 ? (
          <div className="flex flex-col items-center gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="text-center">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="max-h-32 object-contain rounded-md mx-auto"
                  onLoad={() => URL.revokeObjectURL(preview.url)} 
                />
                <p className="mt-2 text-sm text-gray-600 truncate">{preview.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
            <Upload className="h-10 w-10" />
            <p className="font-semibold">Drag & Drop atau klik untuk unggah</p>
            <p className="text-xs">{infoText || "Belum ada file yang dipilih."}</p>
          </div>
        )}
      </div>
       {errors && <InputError message={errors} className="mt-1" />}
    </div>
  )
})

FileUpload.displayName = "FileUpload"

export default FileUpload
