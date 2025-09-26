import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    fetchEmployees,
    clearEmployeeErrors,
    deleteEmployee,
    createEmployee
} from "../../store/slices/employeeSlice";
import Spinner from "../../components/Spinner/Spinner";
import { FaTrash, FaSearch, FaUserPlus } from "react-icons/fa";
import useScrollToTop from "../../hooks/useScrollToTop";
import AddEmployeeModal from "../../modals/AddModals/AddEmployeeModal";

const EmployeesPage = () => {
    useScrollToTop();
    const { employees, loading, error, totalPages, totalEmployees } = useSelector((state) => state.employee);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentSearchPage, setCurrentSearchPage] = useState(1);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearEmployeeErrors());
        }
        dispatch(fetchEmployees(searchKeyword, currentSearchPage));
    }, [dispatch, error, searchKeyword, currentSearchPage]);

    // Handle scroll position restoration after navigation
    useEffect(() => {
        const savedPosition = localStorage.getItem("employeeScrollPosition");
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
            localStorage.removeItem("employeeScrollPosition");
        }
    }, []);

    const handleVerify = (employeeId, e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info("Please login to verify employee", {
                position: "top-center",
                autoClose: 2000,
            });
            localStorage.setItem("pendingEmployeeVerification", employeeId);
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            return;
        }
        localStorage.setItem("employeeScrollPosition", window.scrollY.toString());
        navigate(`/emp/get/${employeeId}`);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this employee?")) {
            dispatch(deleteEmployee(id))
                .then(() => {
                    toast.success("Employee deleted successfully");
                    // Refresh the list after deletion
                    dispatch(fetchEmployees(searchKeyword, currentSearchPage));
                })
                .catch((error) => {
                    toast.error(error.message || "Failed to delete employee");
                });
        }
    };

    const handleAddEmployee = async (employeeData) => {
        console.log("handleAddEmployee called with employeeData: ", employeeData);
        try {
            const result = await dispatch(createEmployee(employeeData));
            console.log("handleAddEmployee result: ", result);
            // Fix: Check result.success instead of result.payload?.success
            if (result?.success) {
                console.log("handleAddEmployee success");
                toast.success("Employee added successfully!");
                setIsModalOpen(false);
                // Refresh the list after adding
                dispatch(fetchEmployees(searchKeyword, currentSearchPage));
            } else {
                console.log("handleAddEmployee failed", result?.message);
                toast.error(result?.message || "Failed to add employee");
            }
        } catch (error) {
            console.log("handleAddEmployee error", error);
            toast.error(error.message || "Failed to add employee");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentSearchPage(1);
        dispatch(fetchEmployees(searchKeyword, 1));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentSearchPage(newPage);
            dispatch(fetchEmployees(searchKeyword, newPage));
        }
    };

    const clearSearch = () => {
        setSearchKeyword("");
        setCurrentSearchPage(1);
        dispatch(fetchEmployees("", 1));
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-5">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6">
                    {/* Header with Add Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Employees ({totalEmployees})
                        </h1>
                        
                        {isAuthenticated && (user?.role === "admin" || user?.role === "manager") && (
                            <button
                                className="bg-[#005792] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-[#004579] dark:hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FaUserPlus />
                                <span>Add Employee</span>
                            </button>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="flex space-x-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, employee ID, or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#005792] focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[#005792] dark:bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-[#004579] dark:hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                            {searchKeyword && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="bg-gray-500 dark:bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Employees Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#005792] dark:bg-gray-950 text-white">
                                    <th className="p-3 text-left font-semibold">Sl.No</th>
                                    <th className="p-3 text-left font-semibold">Photo</th>
                                    <th className="p-3 text-left font-semibold">Employee ID</th>
                                    <th className="p-3 text-left font-semibold">Name</th>
                                    <th className="p-3 text-left font-semibold">Role</th>
                                    <th className="p-3 text-left font-semibold">Department</th>
                                    <th className="p-3 text-left font-semibold">Email</th>
                                    <th className="p-3 text-left font-semibold">Status</th>
                                    <th className="p-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="p-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            {searchKeyword ? "No employees found matching your search" : "No employees found"}
                                        </td>
                                    </tr>
                                ) : (
                                    employees?.map((employee, index) => (
                                        <tr
                                            key={employee._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-blue-50 dark:even:bg-gray-700 border-b border-gray-200 dark:border-gray-600 cursor-pointer"
                                            onClick={(e) => handleVerify(employee._id, e)}
                                        >
                                            <td className="p-3 dark:text-white">
                                                {(currentSearchPage - 1) * 100 + index + 1}
                                            </td>
                                            <td className="p-3">
                                                <img
                                                    src={employee.photoUrl}
                                                    alt={employee.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/api/placeholder/48/48';
                                                    }}
                                                />
                                            </td>
                                            <td className="p-3 dark:text-white font-mono">
                                                {employee.empId}
                                            </td>
                                            <td className="p-3 dark:text-white font-medium">
                                                {employee.name}
                                            </td>
                                            <td className="p-3 dark:text-white">
                                                {employee.role}
                                            </td>
                                            <td className="p-3 dark:text-white">
                                                {employee.department || "-"}
                                            </td>
                                            <td className="p-3 dark:text-white">
                                                <a 
                                                    href={`mailto:${employee.email}`} 
                                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {employee.email}
                                                </a>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    employee.active
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                }`}>
                                                    {employee.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={(e) => handleVerify(employee._id, e)}
                                                        className="bg-[#005792] dark:bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-[#004579] dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        Verify
                                                    </button>
                                                    
                                                    {isAuthenticated && (user?.role === "admin" || user?.role === "manager") && (
                                                        <>
                                                            <button
                                                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 p-1 transition-colors"
                                                                onClick={(e) => handleDelete(employee._id, e)}
                                                                title="Delete Employee"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button
                                onClick={() => handlePageChange(currentSearchPage - 1)}
                                disabled={currentSearchPage === 1}
                                className={`px-3 py-2 rounded-md ${
                                    currentSearchPage === 1
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-[#005792] text-white hover:bg-[#004579]"
                                } transition-colors`}
                            >
                                Previous
                            </button>
                            
                            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                Page {currentSearchPage} of {totalPages}
                            </span>
                            
                            <button
                                onClick={() => handlePageChange(currentSearchPage + 1)}
                                disabled={currentSearchPage === totalPages}
                                className={`px-3 py-2 rounded-md ${
                                    currentSearchPage === totalPages
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-[#005792] text-white hover:bg-[#004579]"
                                } transition-colors`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Employee Modal */}
            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddEmployee}
            />
        </div>
    );
};

export default EmployeesPage;