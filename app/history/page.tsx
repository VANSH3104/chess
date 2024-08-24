import { Sidebar } from "../()/components/dashboard_comp/sidebar"

const page = ()=>{
    return (
        <div className="flex h-screen w-full overflow-hidden">
        <div className="lg:w-[10%] h-full overflow-hidden hidden p-2 bg-neutral-700 lg:block">
            <Sidebar />
        </div>
        <div className="w-full lg:w-[90%] h-full md:flex flex-colmd:overflow-hidden overflow-auto bg-neutral-7  00">
            
        </div>
    </div>
    )
}
export default page