import { Loader2Icon } from 'lucide-react'

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <Loader2Icon className="animate-spin text-green" />
        </div>
    )
}