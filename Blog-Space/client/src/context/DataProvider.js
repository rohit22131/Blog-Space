import { createContext, useState, useEffect } from "react";

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {

  const [account, setAccount] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          name: "",
          username: "",
          bio: "",
          loggedIn: false
        };
  });

  // Sync account with localStorage
  useEffect(() => {
    if (account?.username) {
      localStorage.setItem("user", JSON.stringify(account));
    } else {
      localStorage.removeItem("user");
    }
  }, [account]);

  return (
    <DataContext.Provider value={{ account, setAccount }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
