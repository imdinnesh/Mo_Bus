export const IconButton = ({ children, onClick }: {
    children: React.ReactNode;
    onClick: () => void;

}) => {

    return (
            <button
                className="border w-full border-gray-300 rounded-lg bg-white shadow-sm shadow-gray-500 hover:bg-gray-50 flex items-center gap-2 px-4 py-3"
                onClick={onClick}>
                {children}
            </button>
    )

}