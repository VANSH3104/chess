import { IconType } from "react-icons"
interface socialButton {
    onclick:()=>void
    icon:IconType
}
export const Social:React.FC<socialButton> = ({
    onclick , icon: Icon
})=>{
    return (
        <div>
           <button type="button" onClick={onclick} className="py-2.5 px-10 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-500 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            <Icon  className="text-lg"/>
           </button>
        </div>
    )
}