import ApplicationLogo from "../Atoms/ApplicationLogo"

const Loading = () => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
            <ApplicationLogo className="block animate-in fade-in-0 duration-1000 h-9 w-auto fill-current text-gray-800" />
            <div className="flex items-center justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-500" />
                <p className="text-gray-500 ml-2">Loading...</p>
            </div>
        </div>
    )
}

export default Loading
