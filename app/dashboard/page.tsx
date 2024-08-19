    import { Mainpage } from "../()/components/dashboard_comp/mainpage";
    import { Section } from "../()/components/dashboard_comp/section";
    import { Sidebar } from "../()/components/dashboard_comp/sidebar";
    import { Title } from "../()/components/dashboard_comp/title";

    const Page = () => {
        return (
            <div className="flex h-screen w-full overflow-hidden">
                <div className="lg:w-[10%] h-full overflow-hidden hidden p-2 bg-neutral-700 lg:block">
                    <Sidebar />
                </div>
                <div className="w-full lg:w-[90%] h-full md:flex flex-colmd:overflow-hidden overflow-auto">
                    <div className="lg:w-[60%] md:w-[70%]  w-full h-full  md:overflow-hidden p-2 bg-neutral-700 ">
                        <Mainpage />
                    </div>
                    <div className="lg:w-[40%] md:w-[30%] w-full
                     md:overflow-hidden h-full p-2 bg-neutral-700">
                        <Section />
                    </div>
                </div>
            </div>
        );
    };
    

    export default Page;
