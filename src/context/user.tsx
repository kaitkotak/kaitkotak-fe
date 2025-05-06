import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type UserInfo = {
  permissions: string[];
  id: number;
  job_title: string;
  name: string;
  username: string;
};

type UserContextType = {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    console.log(stored);
    if (stored) setUserInfo(JSON.parse(stored));
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
