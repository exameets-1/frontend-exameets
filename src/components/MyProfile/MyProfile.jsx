import { useSelector } from "react-redux";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);
  const profileFields = [
    { label: "Full Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone },
    { 
      label: "Date of Birth", 
      value: user?.dob ? new Date(user.dob).toLocaleDateString() : null 
    },
    { label: "Gender", value: user?.gender },
    { 
      label: "Joined", 
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : null 
    }
  ];
  
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
        {profileFields.map((field, index) => (
          <div
            key={index}
            className={`flex justify-between p-4 ${
              index !== profileFields.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""
            }`}
          >
            <div className="font-semibold text-gray-800 dark:text-gray-200 w-2/5">
              {field.label}
            </div>
            <div className={`text-right w-3/5 ${!field.value ? "text-gray-400 dark:text-gray-500 italic" : "text-gray-600 dark:text-gray-300"}`}>
              {field.value || "Not provided"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );  
};

export default MyProfile;