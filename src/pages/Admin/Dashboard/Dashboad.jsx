import Sidebar from "../Sidebar/Sidebar";

function Dashboard() {
    return ( 
        <>
        <Sidebar />
        <div className="p-4 sm:ml-60">
            <div className="p-4  mt-20">
                <div className="grid"></div>
            </div>
        </div>
        </>
     );
}

export default Dashboard;